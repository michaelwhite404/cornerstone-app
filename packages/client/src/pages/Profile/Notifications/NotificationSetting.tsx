import React, { Fragment } from "react";
import { INotificationSetting } from "@/utils/notificationSettings";
import NotificationField from "./NotificationField";

export default function NotificationSetting(props: NotificationSettingProps) {
  const { notificationSetting } = props;
  return (
    <Fragment>
      <div className="text-sm font-medium text-gray-500">{notificationSetting.label}</div>
      <div className="mt-1 flex flex-col text-sm text-gray-400 sm:mt-0">
        {notificationSetting.fields.map((field) => (
          <NotificationField
            key={field.name}
            notificationField={field}
            settingName={notificationSetting.name}
          />
        ))}
      </div>
    </Fragment>
  );
}

interface NotificationSettingProps {
  notificationSetting: INotificationSetting;
}
