import { ObjectId, PopulatedDoc } from "mongoose";

export interface UserSettingModel {
  user: PopulatedDoc<ObjectId>;
  type: string;
  settingName: string;
  value: any;
}

// const exampleUserSetting: UserSettingModel = {
//   user: new Schema.Types.ObjectId("63afd53a73ae04faf3c7ab96"),
//   type: "user.notification",
//   settingName: "setting.user.notification.DeviceCheckInEmail",
//   value: { deviceCheckInEmail: "DEVICE_CHECK_IN_EMAIL_ENUM_NONE" },
// };
