import { Request } from "express-serve-static-core";
import { EmployeeDocument } from "./models/employeeTypes";

export default interface CustomRequest extends Request {
  // body: Object;
  /* The type of device */
  employee: EmployeeDocument;
  user: EmployeeDocument;
  device?: string;
  key: string;
}
