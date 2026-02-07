export interface DepartmentSettingModel {
  _id: string;
  department: string;
  setting: string;
  allowedSettingValue?: string;
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
