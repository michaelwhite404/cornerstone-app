import { Model, model, Schema, Types } from "mongoose";
import { CheckoutLogDocument } from "@@types/models";

const checkoutLogSchema: Schema<CheckoutLogDocument, Model<CheckoutLogDocument>> = new Schema(
  {
    device: {
      type: Types.ObjectId,
      ref: "Device",
    },
    checkOutDate: {
      type: Date,
      required: true,
      default: () => Date.now(),
    },
    checkInDate: {
      type: Date,
    },
    dueDate: {
      type: Date,
      required: false,
    },
    deviceUser: {
      type: Types.ObjectId,
      ref: "Student",
      required: true,
    },
    teacherCheckOut: {
      type: Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    teacherCheckIn: {
      type: Types.ObjectId,
      ref: "Employee",
    },
    checkedIn: {
      type: Boolean,
      default: false,
    },
    error: {
      type: Types.ObjectId,
      ref: "ErrorLog",
      required: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

checkoutLogSchema.index({ device: 1 });

checkoutLogSchema.virtual("status").get(function () {
  //@ts-ignore
  return !this.checkedIn ? "Checked Out" : this.error ? "Checked In /w Error" : "Checked In";
});

const CheckoutLog = model<CheckoutLogDocument>("DeviceLog", checkoutLogSchema);

export default CheckoutLog;
