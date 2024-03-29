interface Employee {
  _id: any;
  fullName: string;
  email: string;
  role: string;
  timesheetEnabled: boolean;
  homeroomGrade?: number;
  image?: string;
  slug: string;
  departments?: UserDepartment[];
  space?: string;
  isLeader: (departmentName: string) => boolean;
}

interface UserDepartment {
  _id: DepartmentModel["_id"];
  name: string;
  role: "LEADER" | "MEMBER";
}

declare namespace Express {
  import { EmployeeDocument } from "@@types/models";
  import { ObjectId } from "mongoose";
  import { Send } from "express";

  export interface Request {
    /** Time of the request */
    requestTime: string;
    employee: Employee;
  }

  export interface Response {
    sendJson(statusCode: number, dataObject: any): Express.Response;
  }
}
