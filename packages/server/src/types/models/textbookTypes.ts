import { Document, PopulatedDoc } from "mongoose";
import { TextbookSetModel, StudentModel, EmployeeModel } from ".";

export interface TextbookModel {
  /** Id of the textbook */
  _id: any;
  textbookSet: TextbookSetModel;
  bookNumber: number;
  quality: TextbookQuality;
  status: TextBookStatus;
  active: boolean;
  lastUser?: PopulatedDoc<StudentModel>;
  teacherCheckOut?: PopulatedDoc<EmployeeModel>;
}

export interface TextbookDocument extends TextbookModel, Document {
  _id: any;
}

export type TextbookQuality = "Excellent" | "Good" | "Acceptable" | "Poor" | "Lost";
export type TextBookStatus = "Available" | "Checked Out" | "Replaced" | "Not Available";
