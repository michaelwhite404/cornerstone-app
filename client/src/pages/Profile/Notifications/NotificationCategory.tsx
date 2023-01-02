import { INotificationCategory } from "../../../utils/notificationSettings";
import NotificationSetting from "./NotificationSetting";

export default function NotificationCategory(props: NotificationCategoryProps) {
  const { notificationCategory } = props;
  return (
    <div className="py-4">
      <div className="text-lg font-medium text-gray-600">{notificationCategory.category}</div>
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
