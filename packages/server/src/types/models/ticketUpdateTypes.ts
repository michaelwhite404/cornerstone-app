import { Document, PopulatedDoc } from "mongoose";
import { EmployeeModel, TicketModel } from ".";

interface TicketUpdateBase {
  _id: any;
  date: Date;
  createdBy: PopulatedDoc<EmployeeModel>;
  ticket: PopulatedDoc<TicketModel>;
}

export interface TicketCommentUpdateModel extends TicketUpdateBase {
  __t: "COMMENT";
  comment: string;
}

export interface TicketAssignUpdateModel extends TicketUpdateBase {
  __t: "ASSIGN";
  assign: PopulatedDoc<EmployeeModel>;
  op: "ADD" | "REMOVE";
}

export interface TicketTagUpdateModel extends TicketUpdateBase {
  __t: "TAG";
}

export interface TicketCommentUpdateDocument extends TicketCommentUpdateModel, Document {
  _id: any;
}

export interface TicketAssignUpdateDocument extends TicketAssignUpdateModel, Document {
  _id: any;
}

export interface TicketTagUpdateDocument extends TicketTagUpdateModel, Document {
  _id: any;
}

export type TicketUpdate =
  | TicketCommentUpdateModel
  | TicketAssignUpdateModel
  | TicketTagUpdateModel;
