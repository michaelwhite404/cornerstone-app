import { Document, Model, Types } from "mongoose";

export interface DepartmentSettingModel {
  _id: Types.ObjectId;
  department: Types.ObjectId;
  setting: Types.ObjectId;
  allowedSettingValue?: Types.ObjectId;
  unconstrainedValue?: any;
  value?: any;
}

export interface DepartmentSettingDocument extends Document {
  _id: Types.ObjectId;
  department: Types.ObjectId;
  setting: Types.ObjectId;
  allowedSettingValue?: Types.ObjectId;
  unconstrainedValue?: any;
  value?: any;
}

export interface DepartmentSetting {
  _id: any;
  key: string;
  description: string;
  helpText?: string;
  value: any;
  caption?: string;
}

export interface IDepartmentSettingModel extends Model<DepartmentSettingDocument> {
  getDepartmentSettings: (departmentId: string) => Promise<DepartmentSetting[]>;
}
