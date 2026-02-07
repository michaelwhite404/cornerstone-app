import { String } from "aws-sdk/clients/cloudsearch";
import { Document, Model, ObjectId } from "mongoose";

export interface DepartmentSettingModel {
  _id: ObjectId;
  department: ObjectId;
  setting: ObjectId;
  allowedSettingValue?: ObjectId;
  value?: any;
}

export interface DepartmentSettingDocument extends DepartmentSettingModel, Document {
  _id: DepartmentSettingModel["_id"];
}

export interface DepartmentSetting {
  _id: any;
  key: string;
  description: string;
  helpText?: string;
  value: any;
  caption?: String;
}

export interface IDepartmentSettingModel extends Model<DepartmentSettingDocument> {
  getDepartmentSettings: (departmentId: string) => Promise<DepartmentSetting[]>;
}
