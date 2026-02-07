import { TextbookSetModel, StudentModel, EmployeeModel } from ".";

export interface TextbookModel {
  /** Id of the textbook */
  _id: any;
  textbookSet: TextbookSetModel;
  bookNumber: number;
  quality: TextbookQuality;
  status: TextBookStatus;
  active: boolean;
  lastUser?: StudentModel;
  teacherCheckOut?: EmployeeModel;
}

export type TextbookQuality = "Excellent" | "Good" | "Acceptable" | "Poor" | "Lost";
export type TextBookStatus = "Available" | "Checked Out" | "Replaced" | "Not Available";
