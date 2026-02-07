import { NextFunction, Request, Response } from "express";
import { FilterQuery, Query, UpdateQuery } from "mongoose";
import pluralize from "pluralize";
import { TimesheetEntry } from "@models";
import { AppError, APIFeatures, catchAsync, distinctArrays } from "@utils";
import { TimesheetEntryDocument, TimesheetModel } from "@@types/models";

const getLeaderDepartments = (employee: Employee) =>
  employee.departments?.filter((d) => d.role === "LEADER") || [];

const Model = TimesheetEntry;

/** `GET` - Gets all timesheet entries
 *  - Authenticated users can view their timesheet entries
 *  - Department approvers can view all timesheet entries pertaining to that department
 */
export const getAllTimeSheetEntries = catchAsync(async (req: Request, res: Response) => {
  const leaderDepartments = getLeaderDepartments(req.employee);
  let query: Query<TimesheetEntryDocument[], TimesheetEntryDocument, {}, TimesheetEntryDocument>;
  if (leaderDepartments.length > 0) {
    query = Model.find({
      $or: [{ department: { $in: leaderDepartments } }, { employee: req.employee._id }],
    });
  } else {
    query = Model.find({ employee: req.employee._id });
  }

  query.populate({
    path: "employee finalizedBy department",
    select: "fullName email role name image",
  });

  const features = new APIFeatures(query, req.query).filter().limitFields().sort().paginate();
  const timesheetEntries = await features.query;

  // SEND RESPONSE
  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    results: timesheetEntries.length,
    data: {
      timesheetEntries,
    },
  });
});

/** `GET` - Gets a timesheet entry
 *  - Authenticated users can view their timesheet entry
 *  - Department approvers can view the timesheet entry pertaining to that department
 */
export const getOneTimesheetEntry = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const leaderDepartments = getLeaderDepartments(req.employee);
    // prettier-ignore
    let query: Query<TimesheetEntryDocument | null, TimesheetEntryDocument, {}, TimesheetEntryDocument>
    if (leaderDepartments.length > 0) {
      query = Model.findOne({
        $or: [
          { department: { $in: leaderDepartments }, _id: req.params.id },
          { employee: req.employee._id, _id: req.params.id },
        ],
      });
    } else {
      query = Model.findOne({ employee: req.employee._id, _id: req.params.id });
    }
    query.populate({
      path: "employee finalizedBy department",
      select: "fullName email role name image",
    });
    const timesheetEntry = await query;

    if (!timesheetEntry) {
      return next(new AppError("No timesheet entry found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      requestedAt: req.requestTime,
      data: {
        timesheetEntry,
      },
    });
  }
);

/** `POST` - Creates a new timesheet entry
 *  - Restricted to users with timesheet enabled and an employee of a department
 */
export const createTimeSheetEntry = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { employee } = req;

    if (!employee.timesheetEnabled)
      return next(new AppError("You are not authorized to create timesheet entries", 403));

    const { departments } = employee;

    const foundDepartment = departments?.find(
      (d) => d._id.toString() === req.body.department && d.role === "MEMBER"
    );
    if (!foundDepartment) return next(new AppError("You are not a member of this department", 403));

    const timesheetEntry = await Model.create({
      employee: req.employee._id,
      timeStart: req.body.timeStart,
      timeEnd: req.body.timeEnd,
      department: req.body.department,
      description: req.body.description,
    });

    res.status(201).json({
      status: "success",
      requestedAt: req.requestTime,
      data: {
        timesheetEntry,
      },
    });

    //  Submission test
    //     if (employee.space) {
    //       const format = (date: Date) => moment(date).format("h:mm A");
    //       await chat.spaces.messages.create({
    //         parent: employee.space,
    //         requestBody: {
    //           text: `Timesheet submitted!

    // Date: ${new Date(timesheetEntry.timeStart).toLocaleDateString()}

    // Description: ${timesheetEntry.description}
    // Time Start: ${format(new Date(timesheetEntry.timeStart))}
    // Time End: ${format(new Date(timesheetEntry.timeEnd))}
    // Department: ${foundDepartment.name}
    //   `,
    //         },
    //       });
    //     }
  }
);

/** `PATCH` - Updates a timesheet entry
 * - Timesheet entry updates are restricted to the employee that created the entry
 */
export const updateTimesheetEntry = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const timesheetEntry = await Model.findById(req.params.id);

    if (!timesheetEntry) return next(new AppError("No timesheet entry found with that ID", 404));
    if (timesheetEntry.employee.toString() !== req.employee._id.toString())
      return next(new AppError("You cannot update this timesheet entry", 403));

    if (timesheetEntry.status !== "Pending")
      return next(
        new AppError(`${timesheetEntry.status} timesheet entries cannot be updated`, 403)
      );

    req.body.timeStart ? (timesheetEntry.timeStart = req.body.timeStart) : "";
    req.body.timeEnd ? (timesheetEntry.timeEnd = req.body.timeEnd) : "";
    req.body.description ? (timesheetEntry.description = req.body.description) : "";

    await timesheetEntry.save({ validateBeforeSave: true });

    res.status(200).json({
      status: "success",
      requestedAt: req.requestTime,
      data: {
        timesheetEntry,
      },
    });
  }
);

/** `DELETE` - Deletes a timesheet entry
 * - Timesheet entry deletes are restricted to the employee that created the entry
 */
export const deleteTimesheetEntry = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const timesheetEntry = await Model.findById(req.params.id);

    if (!timesheetEntry) return next(new AppError("No timesheet entry found with that ID", 404));
    if (timesheetEntry.employee.toString() !== req.employee._id.toString())
      return next(new AppError("You cannot delete this timesheet entry", 403));

    if (timesheetEntry.status === "Approved")
      return next(new AppError("Approved timesheet entries cannot be deleted", 403));

    await timesheetEntry.remove();

    res.status(200).json({
      status: "success",
      requestedAt: req.requestTime,
      message: "1 timesheet entry has been deleted",
    });
  }
);

export const approveTimesheets = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Get apprrover departments
    const leaderDepartments = getLeaderDepartments(req.employee);
    if (!leaderDepartments || leaderDepartments.length < 1)
      return next(new AppError("You do not have access to approvals", 403));
    const leaderDepartmentsIds = leaderDepartments.map((d) => d._id.toString());
    // Destructure body approvals and rejections
    const { approve: bodyApprove, reject: bodyReject } = req.body;
    const approvalData = { exists: Boolean(bodyApprove), isArray: Array.isArray(bodyApprove) };
    const rejectionData = { exists: Boolean(bodyReject), isArray: Array.isArray(bodyReject) };
    // Approvals and rejections must be an array of object ids
    if (approvalData.exists && !approvalData.isArray)
      return next(new AppError("Approved timesheet entries must be an array", 400));
    if (rejectionData.exists && !rejectionData.isArray)
      return next(new AppError("Rejected timesheet entries must be an array", 400));
    // If both arrays, test no duplicates
    if (approvalData.isArray && rejectionData.isArray && !distinctArrays(bodyApprove, bodyReject))
      return next(new AppError("Values cannot exist in both approve and reject arrays", 400));
    // Push all ids into an array
    const allBodyIds: any[] = [];
    approvalData.isArray && allBodyIds.push(...bodyApprove);
    rejectionData.isArray && allBodyIds.push(...bodyReject);

    // Get approvable timesheets
    const timesheets = await Model.find({
      _id: { $in: allBodyIds },
      department: { $in: leaderDepartmentsIds },
      status: "Pending",
    });

    const finalIds = {
      approve: [] as any[],
      reject: [] as any[],
      all: timesheets.map((t) => t._id.toString()),
    };

    finalIds.all.forEach((t) =>
      bodyApprove.includes(t) ? finalIds.approve.push(t) : finalIds.reject.push(t)
    );

    const writeArray = [
      {
        updateMany: {
          filter: { _id: { $in: finalIds.approve } } as FilterQuery<TimesheetModel>,
          update: {
            status: "Approved",
            finalizedBy: req.employee._id,
            finalizedAt: new Date(req.requestTime),
          } as UpdateQuery<TimesheetModel>,
        },
      },
      {
        updateMany: {
          filter: { _id: { $in: finalIds.reject } } as FilterQuery<TimesheetModel>,
          update: {
            status: "Rejected",
            finalizedBy: req.employee._id,
            finalizedAt: new Date(req.requestTime),
          } as UpdateQuery<TimesheetModel>,
        },
      },
    ];

    const result = await Model.bulkWrite(writeArray);

    const hasOrHave = (num: number) => (num === 1 ? "has" : "have");
    const message = `${pluralize("timesheet entries", result.modifiedCount, true)} ${hasOrHave(
      result.modifiedCount || 0
    )} been finalized`;

    res.status(200).json({
      status: "success",
      requestedAt: req.requestTime,
      data: {
        message,
      },
    });
  }
);
