import { Request } from "express-serve-static-core";
import { EmployeeModel } from "./models/employeeTypes";

export default interface CustomRequest extends Request {
  // body: Object;
  /* The type of device */
  employee: EmployeeModel;
  user: EmployeeModel;
  device?: string;
  key: string;
}
