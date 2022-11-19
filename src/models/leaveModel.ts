import { LeaveDocument } from "@@types/models";
import { Model, model, Schema, Types } from "mongoose";
import { isSameDay, isBefore } from "date-fns";

const leaveSchema: Schema<LeaveDocument, Model<LeaveDocument>> = new Schema({
  user: {
    type: Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  dateStart: {
    type: Date,
    required: true,
  },
  dateEnd: {
    type: Date,
    required: true,
    validate: {
      validator: function (): boolean {
        // @ts-ignore
        return isSameDay(this.dateStart, this.dateEnd) || isBefore(this.dateStart, this.dateEnd);
      },
      message: "Start date must be on or before end date",
    },
  },
  allDay: { type: Boolean, default: true },
  reason: {
    type: String,
    required: true,
    minLength: 1,
  },
  comments: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: () => new Date(),
  },
  sendTo: {
    type: Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  approval: {
    user: {
      type: Types.ObjectId,
      ref: "Employee",
      // required: true,
    },
    date: {
      type: Date,
    },
    approved: {
      type: Boolean,
      // required: true,
    },
  },
  message: {
    type: String,
    select: false,
  },
  calendarLink: {
    type: String,
    required: false,
  },
});

const Leave = model<LeaveDocument>("Leave", leaveSchema);

export default Leave;
