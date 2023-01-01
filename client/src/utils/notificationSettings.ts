const notificationSettings: INotificationCategory[] = [
  {
    category: "Devices",
    settings: [
      {
        name: "DeviceCheckInEmail",
        label: "Check In",
        fields: [
          {
            name: "deviceCheckInEmail",
            type: "TYPE_ENUM",
            description: "Notification to send on device check in",
            defaultValue: "DEVICE_CHECK_IN_EMAIL_ENUM_NONE",
            knownValues: [
              {
                value: "DEVICE_CHECK_IN_EMAIL_ENUM_ALL",
                description: "Send email on every device check in",
              },
              {
                value: "DEVICE_CHECK_IN_EMAIL_ENUM_BROKEN",
                description: "Send email on every devices checked in marked as broken",
              },
              {
                value: "DEVICE_CHECK_IN_EMAIL_ENUM_NONE",
                description: "Do not send email on device check in",
              },
            ],
          },
        ],
        roles: ["Super Admin", "Admin"],
      },
    ],
  },
  {
    category: "Leaves",
    settings: [
      {
        name: "LeaveRequestEmail",
        label: "Leave Request",
        roles: ["Super Admin", "Admin"],
        fields: [
          {
            name: "leaveRequestEmail",
            type: "TYPE_ENUM",
            description: "Notification to send when sent a leave request",
            defaultValue: "LEAVE_REQUEST_EMAIL_ENUM_TRUE",
            knownValues: [],
          },
        ],
      },
    ],
  },
];

export default notificationSettings;

export interface INotificationCategory {
  category: string;
  settings: INotificationSetting[];
}

export interface INotificationSetting {
  name: string;
  label: string;
  fields: INotificationSettingField[];
  roles: string[];
}

export type INotificationSettingField =
  | NotificationSettingEnumField
  | NotificationSettingStringField;

interface NotificationSettingBaseField {
  name: string;
  description: string;
  defaultValue: any;
}

interface NotificationSettingEnumField extends NotificationSettingBaseField {
  type: "TYPE_ENUM";
  knownValues: KnownValue[];
}

interface NotificationSettingStringField extends NotificationSettingBaseField {
  type: "TYPE_STRING";
}

interface KnownValue {
  value: string;
  description: string;
}
