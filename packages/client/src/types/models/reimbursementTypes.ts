import { EmployeeModel } from ".";

export interface ReimbursementModel {
  _id: any;
  payee: string;
  user: EmployeeModel;
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
  sendTo: EmployeeModel;
  approval?: ReimbursementApproval;
  message?: string;
}

export interface ReimbursementApproval {
  user: EmployeeModel;
  date: Date;
  approved: boolean;
}
