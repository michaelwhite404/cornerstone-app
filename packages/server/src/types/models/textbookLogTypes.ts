import { Document, PopulatedDoc } from "mongoose";
import { EmployeeModel, StudentModel, TextbookModel, TextbookQuality } from ".";

export interface TextbookLogModel {
  /** Id of textbook log */
  _id: any;
  textbook: PopulatedDoc<TextbookModel>;
  checkedIn: boolean;
  student: PopulatedDoc<StudentModel>;
  checkOutDate: Date;
  teacherCheckOut: EmployeeModel;
  qualityOut: TextbookQuality;
  checkInDate?: Date;
  teacherCheckIn?: PopulatedDoc<EmployeeModel>;
  qualityIn?: TextbookQuality;
}

export interface TextbookLogDocument extends TextbookLogModel, Document {
  _id: any;
}
