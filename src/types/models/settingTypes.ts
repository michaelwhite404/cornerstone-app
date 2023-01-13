import { Document } from "mongoose";

export interface SettingModel {
  /** Id of the setting */
  _id: any;
  settingName: string;
  category: string;
  description: string;
  name: string;
  settingType: string;
  fieldDescriptions: FieldDescription[];
}

export interface KnownValueDescription {
  value: any;
  description: string;
}

export type SettingFieldType =
  | "TYPE_ENUM"
  | "TYPE_BOOL"
  | "TYPE_STRING"
  | "TYPE_DOUBLE"
  | "TYPE_FLOAT"
  | "TYPE_INT32"
  | "TYPE_INT64"
  | "TYPE_ENUM_ARRAY";

interface FieldDescription {
  field: string;
  fieldDescription?: string;
  name: string;
  defaultValue: any;
  type: SettingFieldType;
  knownValueDescriptions?: KnownValueDescription[];
}

export interface SettingDocument extends SettingModel, Document {
  _id: any;
}

// EXAMPLE:
// const exampleSetting: SettingModel = {
//   settingName: "setting.user.notification.DeviceCheckInEmail",
//   category: "Devices",
//   description: "Notification to send on device check in",
//   name: "DeviceCheckIn",
//   settingType: "user.notification",
//   type: "TYPE_ENUM",
//   fieldDescriptions: [
//     {
//       field: "deviceCheckInEmail",
//       fieldDescription: "N/A",
//       name: "Device Check In",
//       defaultValue: "DEVICE_CHECK_IN_EMAIL_ENUM_NONE",
//       knownValueDescriptions: [
//         {
//           value: "DEVICE_CHECK_IN_EMAIL_ENUM_ALL",
//           description: "Send email on every device check in.",
//         },
//         {
//           value: "DEVICE_CHECK_IN_EMAIL_ENUM_BROKEN",
//           description: "Send email on every devices check in marked as broken.",
//         },
//         {
//           value: "DEVICE_CHECK_IN_EMAIL_ENUM_NONE",
//           description: "Do not send email on device check in.",
//         },
//       ],
//     },
//   ],
// };
