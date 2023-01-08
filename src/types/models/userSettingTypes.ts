import { Document, PopulatedDoc } from "mongoose";
import { EmployeeDocument } from ".";

export interface UserSettingModel {
  user: PopulatedDoc<EmployeeDocument>;
  type: string;
  settingName: string;
  value: any;
}

export interface UserSettingDocument extends UserSettingModel, Document {
  _id: any;
}

// EXAMPLE:
// const exampleUserSetting: UserSettingModel = {
//   user: new Schema.Types.ObjectId("63afd53a73ae04faf3c7ab96"),
//   type: "user.notification",
//   settingName: "setting.user.notification.DeviceCheckInEmail",
//   value: { deviceCheckInEmail: "DEVICE_CHECK_IN_EMAIL_ENUM_NONE" },
// };
