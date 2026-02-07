import { Document, PopulatedDoc } from "mongoose";
import { DepartmentDocument, EmployeeDocument } from ".";

export interface DepartmentMemberModel {
  /** Id of the department member connection*/
  _id: any;
  department: PopulatedDoc<DepartmentDocument>;
  member: PopulatedDoc<EmployeeDocument>;
  role: "LEADER" | "MEMBER";
}

export interface DepartmentMemberDocument extends DepartmentMemberModel, Document {
  _id: DepartmentMemberModel["_id"];
}
