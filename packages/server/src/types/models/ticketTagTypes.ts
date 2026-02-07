import { Document } from "mongoose";

export interface TicketTagModel {
  name: string;
  color: string;
}

export interface TicketTagDocument extends TicketTagModel, Document {}
