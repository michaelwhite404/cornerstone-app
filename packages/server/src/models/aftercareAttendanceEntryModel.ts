import { model, Schema, Types } from "mongoose";
import { AftercareAttendanceEntryDocument } from "@@types/models";

const aftercareAttendanceEntrySchema = new Schema({
  student: {
    type: Types.ObjectId,
    ref: "Student",
    required: [true, "Each aftercare attendance entry must have a student."],
    immutable: true,
  },
  session: {
    type: Types.ObjectId,
    ref: "AftercareSession",
    required: [true, "Each aftercare attendance entry must have a session."],
    immutable: true,
  },
  signOutDate: Date,
  signature: String,
  lateSignOut: Boolean,
  dropIn: Boolean,
});

aftercareAttendanceEntrySchema.static("sessionToday", async function (this) {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date();
  end.setHours(23, 59, 59, 999);
  return await this.findOne({ date: { $gte: start, $lt: end } });
});

const AftercareAttendanceEntry = model<AftercareAttendanceEntryDocument>(
  "AftercareAttendanceEntry",
  aftercareAttendanceEntrySchema
);

export default AftercareAttendanceEntry;
