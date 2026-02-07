import { isValidObjectId, Types } from "mongoose";

const isObjectID = (id: string) => {
  if (!isValidObjectId(id)) return false;
  return new Types.ObjectId(id).toString() === id;
};

export default isObjectID;
