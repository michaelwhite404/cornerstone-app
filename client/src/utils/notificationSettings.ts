const notificationSettings: INotificationCategory[] = [
  {
    category: "Devices",
    settings: [
      {
        name: "DeviceCheckInEmail",
        label: "Check In",
        roles: ["Super Admin", "Admin"],
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
            type: "TYPE_BOOL",
            description: "Email setting when receiving a leave request",
            defaultValue: true,
            knownValues: [
              { value: true, description: "Send email on every incoming leave request" },
              { value: false, description: "Do not send email on incoming leave requests" },
            ],
          },
        ],
      },
      {
        name: "LeaveFinalizedEmail",
        label: "Leave Finalized",
        roles: ["*"],
        fields: [
          {
            name: "leaveFinalizedEmail",
            type: "TYPE_ENUM",
            description: "Email setting when a leave request is finalized",
            defaultValue: "",
            knownValues: [
              {
                value: "LEAVE_FINALIZED_EMAIL_ENUM_ALL",
                description: "Send email when leave is either approved or rejected",
              },
              {
                value: "LEAVE_FINALIZED_EMAIL_ENUM_APPROVED",
                description: "Send email only when leave is approved",
              },
              {
                value: "LEAVE_FINALIZED_EMAIL_ENUM_REJECTED",
                description: "Send email only when leave is rejected",
              },
              {
                value: "LEAVE_FINALIZED_EMAIL_ENUM_NONE",
                description: "Do not send email when leave is finalized",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    category: "Reimbursements",
    settings: [
      {
        name: "ReimbursementRequestEmail",
        label: "Reimbursement Request",
        roles: ["Super Admin", "Admin"],
        fields: [
          {
            name: "reimbursementRequestEmail",
            type: "TYPE_BOOL",
            description: "Email setting when receiving a reimbursement request",
            defaultValue: true,
            knownValues: [
              { value: true, description: "Send email on every incoming reimbursement request" },
              { value: false, description: "Do not send email on incoming reimbursement requests" },
            ],
          },
        ],
      },
      {
        name: "ReimbursementFinalizedEmail",
        label: "Reimbursement Finalized",
        roles: ["*"],
        fields: [
          {
            name: "reimbursementFinalizedEmail",
            type: "TYPE_ENUM",
            description: "Email setting when a reimbursement request is finalized",
            defaultValue: "",
            knownValues: [
              {
                value: "REIMBURSEMENT_FINALIZED_EMAIL_ENUM_ALL",
                description: "Send email when reimbursement is either approved or rejected",
              },
              {
                value: "REIMBURSEMENT_FINALIZED_EMAIL_ENUM_APPROVED",
                description: "Send email only when reimbursement is approved",
              },
              {
                value: "REIMBURSEMENT_FINALIZED_EMAIL_ENUM_REJECTED",
                description: "Send email only when reimbursement is rejected",
              },
              {
                value: "REIMBURSEMENT_FINALIZED_EMAIL_ENUM_NONE",
                description: "Do not send email when reimbursement is finalized",
              },
            ],
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
  | NotificationSettingStringField
  | NotificationSettingBooleanField;

interface NotificationSettingBaseField {
  name: string;
  description: string;
  defaultValue: any;
}

interface NotificationSettingEnumField extends NotificationSettingBaseField {
  type: "TYPE_ENUM";
  knownValues: KnownValue<string>[];
}

interface NotificationSettingStringField extends NotificationSettingBaseField {
  type: "TYPE_STRING";
}

interface NotificationSettingBooleanField extends NotificationSettingBaseField {
  type: "TYPE_BOOL";
  knownValues: [KnownValue<boolean>, KnownValue<boolean>];
}

interface KnownValue<T = any> {
  value: T;
  description: string;
}
