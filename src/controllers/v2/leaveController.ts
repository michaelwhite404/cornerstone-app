import { Leave } from "@models";
import { LeaveDocument } from "@@types/models";
import { APIFeatures, AppError, catchAsync, getUserLeaders, StaffCalendar } from "@utils";
import { handlerFactory as factory } from ".";
import { leaveEvent } from "@events";

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
