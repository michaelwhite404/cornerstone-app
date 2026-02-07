import {
  Model,
  model,
  ObjectId,
  Schema,
  SchemaDefinition,
  SchemaTypeOptions,
  Types,
  ValidateFn,
} from "mongoose";
import { TimesheetEntryDocument } from "@@types/models";
import { AppError, datesAreOnSameDay } from "@utils";
import { Department } from "@models";
import FKHelper from "@models/helpers/foreignKeyHelper";

const validDepartmentValidation = {
  validator: async (id: ObjectId) => FKHelper(Department, id),
};

const timesheetEntrySchema: Schema<
  TimesheetEntryDocument,
  Model<TimesheetEntryDocument>
> = new Schema({
  employee: {
    type: Types.ObjectId,
    ref: "Employee",
    required: [true, "Each timesheet entry must have an employee id"],
    immutable: true,
  },
  timeStart: {
    type: Date,
    required: [true, "Each timesheet entry must have a start time"],
    validate: {
      validator: function (timeStart) {
        // @ts-ignore
        const timeEnd: Date = this.timeEnd;
        return timeStart.getTime() < timeEnd.getTime();
      } as ValidateFn<Date>,
      message: "Start time must be before end time",
    },
  } as SchemaTypeOptions<Date>,
  timeEnd: {
    type: Date,
    required: [true, "Each timesheet entry must have a end time"],
  },
  department: {
    type: Types.ObjectId,
    ref: "Department",
    required: [true, "Each timesheet entry must belong to a department"],
    immutable: true,
    validate: validDepartmentValidation,
  },
  description: {
    type: String,
    required: [true, "Each timesheet entry must have a description"],
  } as SchemaTypeOptions<string>,
  hours: Number,
  status: {
    type: String,
    enum: {
      values: ["Pending", "Approved", "Rejected"],
      message: "Status values can only be 'Pending', 'Approved' or 'Rejected'",
    },
    default: "Pending",
  },
  finalizedBy: {
    type: Types.ObjectId,
    ref: "Employee",
  },
  finalizedAt: Date,
} as SchemaDefinition);

timesheetEntrySchema.pre<TimesheetEntryDocument>("save", function (next) {
  if (new Date(this.timeStart) >= new Date(this.timeEnd))
    return next(new AppError("Start time must be before end time", 400));

  if (!datesAreOnSameDay(this.timeStart, this.timeEnd))
    return next(new AppError("Start and end times must be on the same day", 400));

  this.hours = (this.timeEnd.getTime() - this.timeStart.getTime()) / 60 / 60 / 1000;
  next();
});

const TimesheetEntry = model<TimesheetEntryDocument>("TimesheetEntry", timesheetEntrySchema);

export default TimesheetEntry;
