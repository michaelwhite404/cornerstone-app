import { createContext, useState } from "react";
import { EmployeeModel, UserSettingModel } from "../../../../src/types/models";
import { useAuth } from "../../hooks";
import notificationSettings, { INotificationCategory } from "../../utils/notificationSettings";
import NotificationCategory from "./Notifications/NotificationCategory";

export const NotificationContext = createContext({} as NotificationContextValue);
interface NotificationContextValue {
  handleChange: (setting: string, field: string, value: any) => void;
  data: { [x: string]: any };
}

const constructInitialNotificationData = (
  userSettings: Omit<UserSettingModel, "user">[],
  settingCategories: INotificationCategory[]
) => {
  const data: { [x: string]: any } = {};
  settingCategories.forEach((category) => {
    category.settings.forEach((setting) => {
      const settingName = setting.name;
      const userSetting = userSettings.find(
        (userSetting) => userSetting.settingName === `setting.user.notification.${settingName}`
      );
      if (userSetting) data[settingName] = userSetting.value;
      else {
        data[settingName] = {};
        setting.fields.forEach((field) => (data[settingName][field.name] = field.defaultValue));
      }
    });
  });
  return data;
};

const filterNotificationSettings = (user: EmployeeModel) =>
  notificationSettings.reduce<INotificationCategory[]>((arr, notificationCategory) => {
    const category = { ...notificationCategory };
    const filteredSettings = category.settings.filter((setting) => {
      return typeof setting.roles === "function"
        ? setting.roles(user)
        : setting.roles.includes(user.role) || setting.roles[0] === "*";
    });
    if (filteredSettings.length > 0)
      arr.push({ category: category.category, settings: filteredSettings });
    return arr;
  }, []);

export default function Notifications() {
  const { user, settings } = useAuth();
  const settingCategories = filterNotificationSettings(user!);
  const [data, setData] = useState<{ [x: string]: any }>(
    constructInitialNotificationData(settings, settingCategories)
  );

  const handleChange = (setting: string, field: string, value: string) =>
    setData({ ...data, [setting]: { ...data[setting], [field]: value } });

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
              {settingCategories.map((notificationCategory) => (
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
