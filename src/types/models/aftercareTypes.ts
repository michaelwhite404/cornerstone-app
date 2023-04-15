import { Document, PopulatedDoc } from "mongoose";
import { StudentModel } from ".";

export interface AftercareAttendanceEntryModel {
  _id: any;
  student: PopulatedDoc<StudentModel>;
  session: any;
  signOutDate?: Date;
  signature?: string;
  lateSignOut?: boolean;
  dropIn: boolean;
}

export interface AftercareAttendanceEntryDocument extends AftercareAttendanceEntryModel, Document {
  _id: AftercareAttendanceEntryModel["_id"];
}

export interface AftercareSessionModel {
  /** Id of the aftercare session */
  _id: any;
  date: Date;
  active: boolean;
  numAttended: number;
  dropIns: number;
}

export interface AftercareSessionDocument extends AftercareSessionModel, Document {
  _id: AftercareSessionModel["_id"];
}

export interface AttendanceStat {
  entriesCount: number;
  lateCount: number;
  student: Pick<StudentModel, "_id" | "fullName" | "grade" | "schoolEmail" | "aftercare">;
}
