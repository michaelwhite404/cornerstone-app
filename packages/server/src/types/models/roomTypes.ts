import { Document } from "mongoose";

export interface RoomModel {
  /** Id of the room */
  _id: any;
  roomNumber: number;
  name: string;
}

export interface RoomDocument extends RoomModel, Document {
  _id: any;
}
