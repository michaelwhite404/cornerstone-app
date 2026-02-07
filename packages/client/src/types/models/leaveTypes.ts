import { EmployeeModel } from ".";

export interface LeaveModel {
  _id: any;
  user: EmployeeModel;
  dateStart: Date;
  dateEnd: Date;
  allDay?: boolean;
  reason: string;
  comments?: string;
  createdAt: Date;
  sendTo: EmployeeModel;
  approval?: LeaveApproval;
  message?: string;
  calendarLink?: string;
}

export interface LeaveApproval {
  user: EmployeeModel;
  date: Date;
  approved: boolean;
}
