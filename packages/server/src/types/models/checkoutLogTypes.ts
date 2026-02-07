import { Document } from "mongoose";
import { DeviceModel, EmployeeModel, ErrorLogModel, StudentModel } from ".";

export interface CheckoutLogModel {
  _id: any;
  device: DeviceModel;
  checkOutDate: Date;
  checkInDate?: Date;
  dueDate?: Date;
  deviceUser: StudentModel;
  teacherCheckOut: EmployeeModel;
  teacherCheckIn?: EmployeeModel;
  checkedIn: boolean;
  error?: ErrorLogModel;
  status: CheckOutStatus;
}

export interface CheckoutLogDocument extends CheckoutLogModel, Document {
  _id: CheckoutLogModel["_id"];
}

type CheckOutStatus = "Checked In" | "Checked Out" | "Checked In /w Error";
