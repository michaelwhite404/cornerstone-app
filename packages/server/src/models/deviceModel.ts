import { Schema, model, Model, Types, ObjectId } from "mongoose";
import slugify from "slugify";
import autopopulate from "mongoose-autopopulate";
import { DeviceDocument } from "@@types/models";
import { Student } from "@models";
import { AppError } from "@utils";
import FKHelper from "./helpers/foreignKeyHelper";

const deviceSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Each Device must have a name"],
      unique: true,
    },
    brand: {
      type: String,
      required: [true, "Each Device has a brand"],
      unique: false,
    },
    model: {
      type: String,
      required: [true, "Each Device has a model"],
      unique: false,
    },
    serialNumber: {
      type: String,
      required: [true, "Each Device must have a serial number"],
      unique: false,
    },
    dueDate: {
      type: Date,
      required: false,
    },
    macAddress: {
      type: String,
      required: [true, "Each Device must have a MAC Address"],
    },
    status: {
      type: String,
      required: [true, "Each Device must have a status"],
      default: "Available",
      enum: {
        values: ["Available", "Checked Out", "Assigned", "Broken", "Not Available"],
        message: "Status is either: Available, Not Available, Broken, Not Available",
      },
    },
    deviceType: {
      type: String,
      required: [true, "Each Device must have a device type"],
    },
    autoUpdateExpiration: String,
    checkedOut: {
      type: Boolean,
      default: false,
    },
    lastUser: {
      type: Types.ObjectId,
      ref: "Student",
    },
    teacherCheckOut: {
      type: Types.ObjectId,
      ref: "Employee",
    },
    lastCheckOut: Date,
    lastCheckIn: Date,
    slug: String,
    location: {
      type: Types.ObjectId,
      ref: "Room",
    },
    directoryId: String,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

deviceSchema.virtual("checkouts", {
  ref: "DeviceLog",
  foreignField: "device",
  localField: "_id",
  options: {
    sort: { checkOutDate: -1 },
    populate: { path: "deviceUser teacherCheckOut teacherCheckIn", select: "fullName" },
  },
  autopopulate: true,
});

deviceSchema.virtual("errorLogs", {
  ref: "ErrorLog",
  foreignField: "device",
  localField: "_id",
  options: { sort: { createdAt: -1 } },
  autopopulate: true,
});

deviceSchema.plugin(autopopulate);

deviceSchema.pre<DeviceDocument>("save", function (next) {
  if (this.isModified("dueDate") && this.dueDate !== undefined) {
    // If due date is valid
    // @ts-ignore
    var timestamp = Date.parse(this.dueDate);
    if (isNaN(timestamp))
      return next(new AppError("The value for 'dueDate' is not a valid date", 400));
    const date = new Date(timestamp);
    // Due Date can not be in the past
    if (date <= new Date()) return next(new AppError("Due date cannot be in the past", 400));
    // Due Date can not be more than a year in the future
    if (date > new Date(new Date().setFullYear(new Date().getFullYear() + 1)))
      return next(new AppError("Due Date can not be more than a year in the future", 400));
  }
  this.slug = slugify(this.name, { lower: true });
  next();
});

deviceSchema.pre<DeviceDocument>("save", function (next) {
  if (this.$locals.assigned)
    FKHelper(Student, this.$locals.student as ObjectId)
      .then(() => {
        next();
      })
      .catch((reason) => {
        next(new AppError(reason, 400));
      });
  next();
});

const Device: Model<DeviceDocument> = model<DeviceDocument>("Device", deviceSchema);

export default Device;
