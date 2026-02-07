import { CheckoutLogModel, DeviceModel } from ".";

export interface ErrorLogModel {
  /** Id of the error log */
  _id: any;
  title: string;
  device: DeviceModel;
  checkInInfo?: CheckoutLogModel;
  description: string;
  updates: ErrorUpdate[];
  final: boolean;
  status: ErrorStatus;
  createdAt: Date;
}

export type ErrorStatus = "Broken" | "In Repair" | "Fixed" | "Unfixable";

export interface ErrorUpdate {
  description: string;
  createdAt: Date;
  status: ErrorStatus;
}
