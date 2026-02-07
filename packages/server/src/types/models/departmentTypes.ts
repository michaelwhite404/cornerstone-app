import { Document } from "mongoose";
import { EmployeeModel } from ".";

export interface DepartmentModel {
  /** Id of the department */
  _id: any;
  name: string;
  membersCount?: number;
  members?: DepartmentMember[];
}

export interface DepartmentMember {
  _id: EmployeeModel["_id"];
  fullName: string;
  email: string;
  role: "LEADER" | "MEMBER";
}

export interface DepartmentDocument extends DepartmentModel, Document {
  _id: DepartmentModel["_id"];
}
