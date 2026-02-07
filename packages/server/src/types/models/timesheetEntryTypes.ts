import { Document, PopulatedDoc } from "mongoose";
import { DepartmentModel, EmployeeModel } from ".";

export interface TimesheetModel {
  /** Id of the timesheet entry */
  _id: any;
  employee: PopulatedDoc<EmployeeModel>;
  timeStart: Date;
  timeEnd: Date;
  department: PopulatedDoc<DepartmentModel>;
  description: string;
  hours?: number;
  status: "Pending" | "Approved" | "Rejected";
  finalizedBy?: PopulatedDoc<EmployeeModel>;
  finalizedAt?: Date;
}

export interface TimesheetEntryDocument extends TimesheetModel, Document {
  _id: TimesheetModel["_id"];
}
