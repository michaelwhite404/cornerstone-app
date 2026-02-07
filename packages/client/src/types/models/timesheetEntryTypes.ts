import { DepartmentModel, EmployeeModel } from ".";

export interface TimesheetModel {
  /** Id of the timesheet entry */
  _id: any;
  employee: EmployeeModel;
  timeStart: Date;
  timeEnd: Date;
  department: DepartmentModel;
  description: string;
  hours?: number;
  status: "Pending" | "Approved" | "Rejected";
  finalizedBy?: EmployeeModel;
  finalizedAt?: Date;
}
