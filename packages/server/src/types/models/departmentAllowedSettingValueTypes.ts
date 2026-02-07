import { PopulatedDoc } from "mongoose";
import { DepartmentAvailableSettingDocument } from "./departmentAvailableSettingTypes";

export interface AllowedSettingValueModel {
  _id: any;
  setting: PopulatedDoc<DepartmentAvailableSettingDocument>;
  value: any;
  caption?: string;
}

export interface AllowedSettingValueDocument extends AllowedSettingValueModel, Document {
  _id: AllowedSettingValueModel["_id"];
}
