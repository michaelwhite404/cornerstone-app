import { DepartmentAvailableSettingModel } from "./departmentAvailableSettingTypes";

export interface AllowedSettingValueModel {
  _id: any;
  setting: DepartmentAvailableSettingModel;
  value: any;
  caption?: string;
}
