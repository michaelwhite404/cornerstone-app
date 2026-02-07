import { CheckoutLogModel, EmployeeModel, ErrorLogModel, StudentModel } from ".";

export interface DeviceModel {
  /** Id of the device */
  _id: any;
  name: string;
  brand: string;
  model: string;
  serialNumber: string;
  dueDate?: Date;
  macAddress: string;
  status: "Available" | "Checked Out" | "Assigned" | "Broken" | "Not Available";
  deviceType: string;
  autoUpdateExpiration?: string;
  checkedOut?: boolean;
  lastUser?: StudentModel;
  teacherCheckOut?: EmployeeModel;
  lastCheckOut?: Date;
  lastCheckIn?: Date;
  slug: string;
  checkouts?: CheckoutLogModel[];
  errorLogs?: ErrorLogModel[];
  directoryId?: string;
}
