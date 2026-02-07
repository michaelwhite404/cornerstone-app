import { Model, model, Schema } from "mongoose";
import { RoomDocument } from "@@types/models";

const roomSchema: Schema<RoomDocument, Model<RoomDocument>> = new Schema({
  roomNumber: {
    type: String,
    required: [true, "Each room must have a room number"],
    unique: true,
  },
  name: {
    type: String,
    required: [true, "Each room must have a name"],
  },
});

const Room = model("Room", roomSchema);

export default Room;
