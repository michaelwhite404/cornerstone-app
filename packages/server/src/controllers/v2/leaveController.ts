import { Leave } from "@models";
import { LeaveDocument } from "@@types/models";
import { APIFeatures, AppError, catchAsync, getUserLeaders, sheets, StaffCalendar } from "@utils";
import { handlerFactory as factory } from ".";
import { leaveEvent } from "@events";
import { ObjectId } from "mongoose";
import { stringify } from "csv-stringify";
import { Request } from "express";

const Model = Leave;
const key = "leave";

const isInFinance = (req: Request) =>
  req.employee.departments?.some((d) => d.name === "Finance") || false;

export const getAllLeaves = catchAsync(async (req, res) => {
  const filter = isInFinance(req)
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
  // TODO: Validate type and fields are correct
  const { type, fields, dateFormat: _dateFormat, sortBy: _sortBy } = req.body;
  const canGenerateReport = req.employee.role === "Super Admin" || isInFinance(req);
  if (!canGenerateReport)
    return next(new AppError("You are not authorized to generate leave reports", 403));
  const leaves: AggregatedLeave[] = await Leave.aggregate([
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

  switch (type) {
    case "sheets":
      const { spreadsheetUrl } = await generateSpreadsheet(leaves, fields, req.employee);
      return res.sendJson(200, { spreadsheetUrl });
    case "csv":
      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="' + "device-logs_" + new Date().toISOString() + '.csv"'
      );
      return createCsvStringifier(leaves, fields).pipe(res);
    default:
      res.sendJson(200, { leaves });
  }
});

const headerMap = {
  reason: "Reason For Leave",
  submittingUser: "Submitting User",
  dateStart: "Date Start",
  dateEnd: "Date End",
  status: "Status",
  finalizedBy: "Finalized By",
  finalizedAt: "Finalized At",
  createdAt: "Created At",
} as const;

const generate2dData = (leaves: AggregatedLeave[], fields: Array<keyof typeof headerMap>) => {
  const newHeaders = fields.map((field) => headerMap[field]);
  const values = leaves.map((leave) => {
    return fields.map((field) => {
      const value = leave[field];
      if (value instanceof Date) return value.toLocaleString();
      return typeof value === "string" ? value : "";
    });
  });
  return [newHeaders, ...values];
};

const createCsvStringifier = (leaves: AggregatedLeave[], fields: Array<keyof typeof headerMap>) => {
  const data = generate2dData(leaves, fields);
  return stringify(data);
};

const generateSpreadsheet = async (
  leaves: AggregatedLeave[],
  fields: Array<keyof typeof headerMap>,
  employee: Employee
) => {
  const googleSheets = sheets(employee.email);
  const response = await googleSheets.spreadsheets.create({
    requestBody: {
      properties: {
        title: `Leave Report`,
      },
    },
  });
  const spreadsheetId = response.data.spreadsheetId!;
  await googleSheets.spreadsheets.values.append({
    spreadsheetId,
    range: "Sheet1",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: generate2dData(leaves, fields),
    },
  });
  await googleSheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: [
        {
          autoResizeDimensions: {
            dimensions: {
              sheetId: 0,
              dimension: "COLUMNS",
              startIndex: 0,
              endIndex: fields.length,
            },
          },
        },
      ],
    },
  });
  return { spreadsheetUrl: response.data.spreadsheetUrl };
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
