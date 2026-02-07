import axios from "axios";
import { useContext, useState } from "react";
import isDeepEqual from "deep-equal";
import { INotificationCategory } from "../../../utils/notificationSettings";
import { NotificationContext } from "../Notifications";
import NotificationSetting from "./NotificationSetting";
import { useAuth, useToasterContext } from "../../../hooks";

export default function NotificationCategory({ notificationCategory }: NotificationCategoryProps) {
  const getCategoryState = (data: { [x: string]: any }) =>
    notificationCategory.settings.map(({ name }) => data[name]);
  const { data } = useContext(NotificationContext);
  const { setSettings } = useAuth();
  const [stateBeforeUpdate, setStateBeforeUpdate] = useState(getCategoryState(data));
  const { showToaster } = useToasterContext();
  const handleUpdateSetting = async () => {
    try {
      await Promise.all(
        notificationCategory.settings.map(({ name }) =>
          axios.patch("/api/v2/users/me/settings", {
            settingName: `setting.user.notification.${name}`,
            value: data[name],
          })
        )
      );
      updateGlobalSettings();
      setStateBeforeUpdate(getCategoryState(data));
      showToaster("Settings Updated!", "success");
    } catch (err) {
      showToaster("There was an error. Please try again", "danger");
    }
  };

  const updateGlobalSettings = () => {
    setSettings((settings) => {
      const settingsCopy = [...settings];
      notificationCategory.settings.forEach(({ name }) => {
        const index = settingsCopy.findIndex(
          (userSetting) => userSetting.settingName === `setting.user.notification.${name}`
        );
        if (index < 0) return;
        settingsCopy[index].value = data[name];
      });
      return settingsCopy;
    });
  };

  const updateable = !isDeepEqual(stateBeforeUpdate, getCategoryState(data));

  return (
    <div className="py-4">
      <div className="flex justify-between">
        <div className="text-lg font-medium text-gray-600">{notificationCategory.category}</div>
        <button
          type="button"
          className="rounded-md bg-white font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:text-blue-200"
          disabled={!updateable}
          onClick={handleUpdateSetting}
        >
          Update
        </button>
      </div>
      <div className="py-4 sm:grid sm:grid-cols-[1.25fr_4.75fr] sm:gap-4 sm:py-5">
        {notificationCategory.settings.map((setting) => (
          <NotificationSetting key={setting.name} notificationSetting={setting} />
        ))}
      </div>
    </div>
  );
}

interface NotificationCategoryProps {
  notificationCategory: INotificationCategory;
}
