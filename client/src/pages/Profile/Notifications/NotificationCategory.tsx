import { Fragment } from "react";
import { INotificationCategory } from "../../../utils/notificationSettings";
import NotificationSetting from "./NotificationSetting";

export default function NotificationCategory(props: NotificationCategoryProps) {
  const { notificationCategory } = props;
  return (
    <Fragment>
      <div className="text-lg font-medium text-gray-600">{notificationCategory.category}</div>
      <div className="py-4 sm:grid sm:grid-cols-[1fr_5fr] sm:gap-4 sm:py-5">
        {notificationCategory.settings.map((setting) => (
          <NotificationSetting key={setting.name} notificationSetting={setting} />
        ))}
      </div>
    </Fragment>
  );
}

interface NotificationCategoryProps {
  notificationCategory: INotificationCategory;
}
