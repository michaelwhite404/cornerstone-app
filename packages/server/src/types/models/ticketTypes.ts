import { Document, PopulatedDoc, Types } from "mongoose";
import { DepartmentModel, EmployeeModel, TicketUpdate } from ".";

export interface TicketModel {
  _id: any;
  ticketId: number;
  title: string;
  description: string;
  department: PopulatedDoc<DepartmentModel>;
  status: TicketStatus;
  updates?: TicketUpdate[];
  priority: TicketPriority;
  submittedBy: PopulatedDoc<EmployeeModel>;
  assignedTo: PopulatedDoc<EmployeeModel[]>;
  createdAt: Date;
  updatedAt: Date;
  closedBy?: PopulatedDoc<EmployeeModel>;
  closedAt?: Date;
}

export interface TicketDocument extends TicketModel, Document {
  _id: Types.ObjectId;
  ticketId: number;
}

type TicketStatus = "OPEN" | "CLOSED";
export type TicketPriority = "URGENT" | "HIGH" | "MEDIUM" | "LOW";
