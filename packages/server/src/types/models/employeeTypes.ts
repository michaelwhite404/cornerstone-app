import { Document } from "mongoose";
import { DepartmentModel } from ".";

export interface EmployeeModel {
  /** Id of the user */
  _id: any;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  homeroomGrade?: number;
  title: string;
  role: EmployeeRole;
  image?: string;
  googleId?: string;
  password: string;
  passwordConfirm?: string;
  passwordChangedAt?: Date;
  passwordResetToken?: String;
  passwordResetExpires?: Date;
  lastLogin?: Date;
  createdAt: Date;
  active: boolean;
  slug: string;
  timesheetEnabled: boolean;
  departments?: UserDepartment[];
  groups?: UserGroup[];
  space?: string;
}

type EmployeeRole =
  | "Super Admin"
  | "Admin"
  | "Development"
  | "Instructor"
  | "Intern"
  | "Maintenance";

export interface UserGroup {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  type: string;
}

interface UserDepartment {
  _id: DepartmentModel["_id"];
  name: string;
  role: "LEADER" | "MEMBER";
}

export interface EmployeeDocument extends EmployeeModel, Document {
  _id: EmployeeModel["_id"];
  correctPassword: (candidatePassword: any, userPassword: string) => Promise<boolean>;
  changedPasswordAfter: (JWTTimestamp: number) => boolean;
  createPasswordResetToken: () => string;
  isLeader: (departmentName: string) => boolean;
}
