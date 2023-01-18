import { Leave } from "@models";
import { LeaveDocument } from "@@types/models";
import { APIFeatures, AppError, catchAsync, getUserLeaders, StaffCalendar } from "@utils";
import { handlerFactory as factory } from ".";
import { leaveEvent } from "@events";
import { ObjectId } from "mongoose";
import { stringify } from "csv-stringify";

const Model = Leave;
const key = "leave";

export const getAllLeaves = catchAsync(async (req, res) => {
  const isInFinance = req.employee.departments?.some((d) => d.name === "Finance") || false;
  const filter = isInFinance
    ? {}
    : { $or: [{ sendTo: req.employee._id }, { user: req.employee._id }] };

  const query = Model.find(filter).populate([
    { path: "user sendTo", select: "fullName slug email" },
    { path: "approval", populate: { path: "user", select: "fullName email" } },
  ]);

  const features = new APIFeatures(query, req.query).filter().limitFields().sort().paginate();
  const leaves = await features.query;

  // SEND RESPONSE
  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    results: leaves.length,
    data: {
      leaves,
    },
  });
});

export const getLeave = factory.getOneById(Model, key);

export const checkCanApprove = catchAsync(async (req, res, next) => {
  const leave = await Leave.findById(req.params.id).populate({
    path: "user sendTo",
    select: "fullName slug email",
  });
  if (!leave) return next(new AppError("There is no leave with this id", 404));
  if (leave.sendTo._id.toString() !== req.employee._id.toString()) {
    return next(new AppError("You are not authorized to approve this leave", 403));
  }
  if (leave.approval?.date)
    return next(new AppError("This leave request has already been finalized", 400));
  res.locals.leave = leave;
  next();
});

export const approveLeave = catchAsync(async (req, res, next) => {
  // BODY: { approved: true } || { approved: false }
  const { approved } = req.body;
  if (approved === undefined || approved === null)
    return next(new AppError("Please set the property `approved` as a boolean value", 400));
  // If value not valid
  let value: boolean | undefined = undefined;
  new Set([true, "true", 1, "1", "yes"]).has(approved) && (value = true);
  new Set([false, "false", 0, "0", "no"]).has(approved) && (value = false);
  if (value === undefined)
    return next(new AppError("The property `approved` should be a boolean value", 400));
  // VALID
  let leave = res.locals.leave as LeaveDocument;
  leave.approval = {
    user: req.employee._id,
    date: new Date(req.requestTime),
    approved,
  };
  if (approved) {
    try {
      const calendar = new StaffCalendar(req.employee.email);
      const event = await calendar.addEvent({
        title: `${leave.user.fullName} Out`,
        start: leave.dateStart,
        end: leave.dateEnd,
        allDay: leave.allDay,
      });
      leave.calendarLink = event.htmlLink!;
    } catch (err) {}
  }
  await leave.save();
  await leave.populate({ path: "approval.user", select: "fullName email" }).execPopulate();
  res.sendJson(200, { leave });
  leaveEvent.finalize(leave);
});

export const createLeave = catchAsync(async (req, res, next) => {
  const { dateStart, dateEnd, reason, comments, sendTo, allDay = true } = req.body;
  // Is user leader
  const leaders = await getUserLeaders(req.employee);
  if (!leaders.map((l) => l._id.toString() as string).includes(sendTo)) {
    return next(
      new AppError("Please send your leave request to a person who leads your department", 400)
    );
  }

  let leave = await Model.create({
    user: req.employee._id,
    dateStart,
    dateEnd,
    reason,
    comments,
    sendTo,
    createdAt: new Date(),
    allDay,
  });
  leave = await Model.populate(leave, {
    path: "user sendTo",
    select: "fullName slug email",
  });
  res.sendJson(201, { leave });
  leaveEvent.submit(leave);
});

export const generateReport = catchAsync(async (req, res, next) => {
  // const { type, fields, dateFormat } = req.body;
  // TODO: Validate type and fields are correct
  const leaves = await Leave.aggregate([
    {
      $lookup: {
        from: "employees",
        localField: "user",
        foreignField: "_id",
        as: "submittingUser",
      },
    },
    {
      $lookup: {
        from: "employees",
        localField: "approval.user",
        foreignField: "_id",
        as: "finalizedUser",
      },
    },
    {
      $project: {
        reason: 1,
        submittingUser: {
          $let: {
            vars: {
              name: { $arrayElemAt: ["$submittingUser.fullName", 0] },
              email: { $arrayElemAt: ["$submittingUser.email", 0] },
            },
            in: { $concat: ["$$name", " (", "$$email", ")"] },
          },
        },
        dateStart: 1,
        dateEnd: 1,
        status: {
          $cond: {
            if: { $gt: ["$approval", null] },
            then: {
              $cond: {
                if: "$approval.approved",
                then: "Approved",
                else: "Rejected",
              },
            },
            else: "Pending",
          },
        },
        finalizedBy: {
          $let: {
            vars: {
              name: { $arrayElemAt: ["$finalizedUser.fullName", 0] },
              email: { $arrayElemAt: ["$finalizedUser.email", 0] },
            },
            in: { $concat: ["$$name", " (", "$$email", ")"] },
          },
        },
        finalizedAt: "$approval.date",
        createdAt: 1,
      },
    },
  ]);

  res.setHeader("Content-Type", "text/csv");
  res.setHeader(
    "Content-Disposition",
    'attachment; filename="' + "device-logs" + new Date().toISOString() + '.csv"'
  );
  createCsvStringifier(leaves).pipe(res);
  // res.sendJson(200, { leaves });
});

const createCsvStringifier = (leaves: AggregatedLeave[]) => {
  // const headers = [
  //   "Reason For Leave",
  //   "Submitting User",
  //   "Date Start",
  //   "Date End",
  //   "Status",
  //   "Finalized By",
  //   "Finalized At",
  //   "Created At",
  // ];

  const csvHeaders = [
    "Reason",
    "Submitting User",
    "Date Start",
    "Date End",
    "Status",
    "Finalized By",
    "Finalized At",
    "Created At",
  ];

  const values = leaves.map((leave) => [
    leave.reason,
    leave.submittingUser,
    leave.dateStart.toLocaleString() || "",
    leave.dateEnd.toLocaleString() || "",
    leave.status,
    leave.finalizedBy || "",
    leave.finalizedAt?.toLocaleString() || "",
    leave.createdAt.toLocaleString(),
  ]);
  return stringify([csvHeaders, ...values]);
};

interface AggregatedLeave {
  _id: ObjectId;
  reason: string;
  dateStart: Date;
  dateEnd: Date;
  submittingUser: string;
  status: "Approved" | "Rejected" | "Pending";
  createdAt: Date;
  finalizedBy: string | null;
  finalizedAt?: Date;
}
