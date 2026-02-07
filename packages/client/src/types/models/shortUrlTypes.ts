import { EmployeeModel } from ".";

export interface ShortUrlModel {
  _id: any;
  full: string;
  short: string;
  clicks: number;
  createdBy: EmployeeModel;
  qr_clicks: number;
}
