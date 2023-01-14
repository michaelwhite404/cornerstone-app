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
            disabled: true,
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
    category: "Textbooks",
    settings: [
      {
        name: "TextbookCheckInEmail",
        label: "Check In",
        roles: ["Super Admin", "Admin"],
        fields: [
          {
            name: "textbookCheckInEmail",
            type: "TYPE_ENUM",
            description: "Email setting when textbook is checked in",
            defaultValue: "TEXTBOOK_CHECK_IN_EMAIL_ENUM_NONE",
            knownValues: [
              {
                value: "TEXTBOOK_CHECK_IN_EMAIL_ENUM_ALL",
                description: "Send email on all textbook check ins",
              },
              {
                value: "TEXTBOOK_CHECK_IN_EMAIL_ENUM_NONE",
                description: "Do not send email on any textbook check ins",
              },
              {
                value: "TEXTBOOK_CHECK_IN_EMAIL_ENUM_PICK",
                description: "Send email on when textbook has certain quality",
              },
            ],
          },
          {
            name: "textbookCheckInQualityPick",
            type: "TYPE_ENUM_ARRAY",
            description: "",
            defaultValue: ["Poor", "Lost"],
            disabled: (data) =>
              data.TextbookCheckInEmail.textbookCheckInEmail !==
              "TEXTBOOK_CHECK_IN_EMAIL_ENUM_PICK",
            shift: 30,
            knownValues: [
              { value: "Excellent", description: "Excellent" },
              { value: "Good", description: "Good" },
              { value: "Acceptable", description: "Acceptable" },
              { value: "Poor", description: "Poor" },
              { value: "Lost", description: "Lost" },
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
            defaultValue: "LEAVE_FINALIZED_EMAIL_ENUM_ALL",
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
            defaultValue: "REIMBURSEMENT_FINALIZED_EMAIL_ENUM_ALL",
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
  {
    category: "Tickets",
    settings: [
      {
        name: "TicketAssignEmail",
        label: "Ticket Assign",
        roles: ["*"],
        fields: [
          {
            name: "ticketAssignEmail",
            type: "TYPE_BOOL",
            description: "Email setting when assigned to a ticket",
            defaultValue: true,
            knownValues: [
              {
                value: true,
                description: "Send email when assigned to a ticket",
              },
              { value: false, description: "Do not send email when assigned to a ticket" },
            ],
          },
        ],
      },
      {
        name: "TicketCommentEmail",
        label: "Ticket Comment",
        roles: ["*"],
        fields: [
          {
            name: "ticketCommentEmail",
            type: "TYPE_BOOL",
            description: "Email setting when a comment is added to a ticket",
            defaultValue: true,
            knownValues: [
              { value: true, description: "Send email when a comment is added to a ticket" },
              {
                value: false,
                description: "Do not send email when a comment is added to a ticket",
              },
            ],
          },
        ],
      },
      {
        name: "TicketClosedEmail",
        label: "Ticket Closed",
        roles: ["*"],
        fields: [
          {
            name: "ticketClosedEmail",
            type: "TYPE_BOOL",
            description: "Email setting when a ticket is closed",
            defaultValue: true,
            knownValues: [
              { value: true, description: "Send email when ticket is closed" },
              { value: false, description: "Do not send email when ticket is closed" },
            ],
          },
        ],
      },
    ],
  },
];

export default notificationSettings;

export interface INotificationCategory {
  /** Category name */
  category: string;
  settings: INotificationSetting[];
}

export interface INotificationSetting {
  /** Name of the setting */
  name: string;
  /** Label given to the setting */
  label: string;
  /** The fields connected to the setting */
  fields: INotificationSettingField[];
  roles: string[];
}

export type INotificationSettingField =
  | NotificationSettingEnumField
  | NotificationSettingStringField
  | NotificationSettingBooleanField
  | NotificationSettingEnumArrayField;

interface NotificationSettingBaseField {
  /** The name of the field */
  name: string;
  /** A description of the field */
  description: string;
  defaultValue: any;
  /** Whether the field inputs should be disabled */
  disabled?: boolean | ((data: any) => boolean);
  /** How far to shift the inputs in the UI */
  shift?: number;
}

interface NotificationSettingEnumField extends NotificationSettingBaseField {
  type: "TYPE_ENUM";
  knownValues: KnownValue<string>[];
}

interface NotificationSettingStringField extends NotificationSettingBaseField {
  /** String field type */
  type: "TYPE_STRING";
}

interface NotificationSettingBooleanField extends NotificationSettingBaseField {
  /** Boolean field type */
  type: "TYPE_BOOL";
  knownValues: [KnownValue<boolean>, KnownValue<boolean>];
}

interface NotificationSettingEnumArrayField extends NotificationSettingBaseField {
  type: "TYPE_ENUM_ARRAY";
  knownValues: KnownValue<string>[];
}

interface KnownValue<T = any> {
  /** Enum value */
  value: T;
  /** Enum description */
  description: string;
}
