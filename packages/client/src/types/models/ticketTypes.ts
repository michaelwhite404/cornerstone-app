import { DepartmentModel, EmployeeModel, TicketUpdate } from ".";

export interface TicketModel {
  _id: any;
  ticketId: number;
  title: string;
  description: string;
  department: DepartmentModel;
  status: TicketStatus;
  updates?: TicketUpdate[];
  priority: TicketPriority;
  submittedBy: EmployeeModel;
  assignedTo: EmployeeModel[];
  createdAt: Date;
  updatedAt: Date;
  closedBy?: EmployeeModel;
  closedAt?: Date;
}

type TicketStatus = "OPEN" | "CLOSED";
export type TicketPriority = "URGENT" | "HIGH" | "MEDIUM" | "LOW";
