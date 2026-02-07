import { Document, PopulatedDoc } from "mongoose";
import { EmployeeModel } from ".";

export interface ReimbursementModel {
  _id: any;
  payee: string;
  user: PopulatedDoc<EmployeeModel>;
  date: Date;
  amount: number;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  purpose: string;
  dateNeeded?: Date;
  specialInstructions?: string;
  createdAt: Date;
  receipt: string;
  sendTo: PopulatedDoc<EmployeeModel>;
  approval?: ReimbursementApproval;
  message?: string;
}

export interface ReimbursementDocument extends ReimbursementModel, Document {
  _id: any;
}

export interface ReimbursementApproval {
  user: PopulatedDoc<EmployeeModel>;
  date: Date;
  approved: boolean;
}
