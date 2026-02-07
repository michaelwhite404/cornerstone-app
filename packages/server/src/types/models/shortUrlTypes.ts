import { PopulatedDoc } from "mongoose";
import { EmployeeModel } from ".";

export interface ShortUrlModel {
  _id: any;
  full: string;
  short: string;
  clicks: number;
  createdBy: PopulatedDoc<EmployeeModel>;
  qr_clicks: number;
}

export interface ShortUrlDocument extends ShortUrlModel, Document {
  _id: ShortUrlModel["_id"];
}
