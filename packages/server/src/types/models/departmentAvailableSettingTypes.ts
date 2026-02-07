import { Document } from "mongoose";
import { AllowedSettingValueModel } from "./departmentAllowedSettingValueTypes";

export interface DepartmentAvailableSettingModel {
  _id: any;
  key: string;
  description: string;
  helpText?: string;
  constrained: boolean;
  dataType: "NUMBER" | "STRING" | "COLOR" | "BOOLEAN" | "MEMBERS";
  allowedValues?: AllowedSettingValueModel[];
}

export interface DepartmentAvailableSettingDocument
  extends DepartmentAvailableSettingModel,
    Document {
  _id: DepartmentAvailableSettingModel["_id"];
}
