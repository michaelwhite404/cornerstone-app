import { EmployeeModel } from ".";

export interface UserSettingModel {
  user: EmployeeModel;
  type: string;
  settingName: string;
  value: any;
}
