import { Model } from "mongoose";

export interface IncrementModel {
  _id: any;
  modelName: string;
  idx: number;
}
export interface IncrementDocument extends IncrementModel, Document {
  _id: IncrementModel["_id"];
}

export interface IIncrementModel extends Model<IncrementDocument> {
  getNextId: (modelName: string, start?: number) => Promise<number>;
}
