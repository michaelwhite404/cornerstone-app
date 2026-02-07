import { EmployeeModel, TicketModel } from ".";

interface TicketUpdateBase {
  _id: any;
  date: Date;
  createdBy: EmployeeModel;
  ticket: TicketModel;
}

export interface TicketCommentUpdateModel extends TicketUpdateBase {
  __t: "COMMENT";
  comment: string;
}

export interface TicketAssignUpdateModel extends TicketUpdateBase {
  __t: "ASSIGN";
  assign: EmployeeModel;
  op: "ADD" | "REMOVE";
}

export interface TicketTagUpdateModel extends TicketUpdateBase {
  __t: "TAG";
}

export type TicketUpdate =
  | TicketCommentUpdateModel
  | TicketAssignUpdateModel
  | TicketTagUpdateModel;
