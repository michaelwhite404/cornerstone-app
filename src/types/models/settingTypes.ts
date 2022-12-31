export interface SettingModel {
  settingName: string;
  category: string;
  description: string;
  name: string;
  settingType: string;
  type: SettingType;
  fieldDescriptions: FieldDescription[];
}

interface KnownValueDescription {
  value: string;
  description: string;
}

type SettingType =
  | "TYPE_ENUM"
  | "TYPE_BOOL"
  | "TYPE_STRING"
  | "TYPE_DOUBLE"
  | "TYPE_FLOAT"
  | "TYPE_INT32"
  | "TYPE_INT64";

interface FieldDescription {
  field: string;
  fieldDescription?: string;
  name: string;
  defaultValue: any;
  knownValueDescriptions?: KnownValueDescription[];
}

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
