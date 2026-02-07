import { Schema, model, Types } from "mongoose";
import { TextbookLogDocument } from "@@types/models";

const textbookLogSchema = new Schema({
  textbook: {
    type: Types.ObjectId,
    ref: "Textbook",
    required: true,
  },
  checkedIn: {
    type: Boolean,
    required: true,
  },
  student: {
    type: Types.ObjectId,
    ref: "Student",
    required: true,
  },
  checkOutDate: {
    type: Date,
    required: true,
  },
  teacherCheckOut: {
    type: Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  qualityOut: {
    type: String,
    enum: {
      values: ["Excellent", "Good", "Acceptable", "Poor"],
      message: "Quality must be: Excellent, Good, Acceptable, or Poor",
    },
    required: true,
  },
  checkInDate: Date,
  teacherCheckIn: {
    type: Types.ObjectId,
    ref: "Employee",
  },
  qualityIn: {
    type: String,
    enum: {
      values: ["Excellent", "Good", "Acceptable", "Poor"],
      message: "Quality must be: Excellent, Good, Acceptable, or Poor",
    },
  },
});

const TextbookLog = model<TextbookLogDocument>("TextbookLog", textbookLogSchema);

export default TextbookLog;
