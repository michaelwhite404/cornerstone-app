import { Document, Model } from "mongoose";

export type ExtractDocument<Type> = Type extends Model<infer X> ? X : any;
export type ExtractDocumentModel<Type> = Omit<
  Type extends Model<infer X> ? X : any,
  Exclude<keyof Document, "_id">
>;
