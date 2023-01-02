import { createContext, useState } from "react";
import notificationSettings from "../../utils/notificationSettings";
import NotificationCategory from "./Notifications/NotificationCategory";

export const NotificationContext = createContext({} as NotificationContextValue);
interface NotificationContextValue {
  handleChange: (setting: string, field: string, value: string) => void;
  data: { [x: string]: any };
}

export default function Notifications() {
  const [data, setData] = useState<{ [x: string]: any }>({
    DeviceCheckInEmail: { deviceCheckInEmail: "DEVICE_CHECK_IN_EMAIL_ENUM_NONE" },
    LeaveRequestEmail: { leaveRequestEmail: true },
    LeaveFinalizedEmail: { leaveFinalizedEmail: "LEAVE_FINALIZED_EMAIL_ENUM_ALL" },
    ReimbursementRequestEmail: { reimbursementRequestEmail: true },
    ReimbursementFinalizedEmail: {
      reimbursementFinalizedEmail: "REIMBURSEMENT_FINALIZED_EMAIL_ENUM_ALL",
    },
  });

  const handleChange = (setting: string, field: string, value: string) =>
    setData({ ...data, [setting]: { [field]: value } });

  return (
    <NotificationContext.Provider value={{ data, handleChange }}>
      <div className="mt-10 divide-y divide-gray-200">
        <div className="space-y-1">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Email Notifications</h3>
          <p className="max-w-2xl text-sm text-gray-500">Preferences for email notifications</p>
        </div>
        <div className="mt-6">
          <div className="divide-y divide-gray-200">
            <div className="divide-y divide-gray-200">
              {notificationSettings.map((notificationCategory) => (
                <NotificationCategory
                  key={notificationCategory.category}
                  notificationCategory={notificationCategory}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </NotificationContext.Provider>
  );
}
