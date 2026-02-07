import { UserSetting } from "@models";

export const getUserSetting = async (userId: string, setting: string) => {
  return UserSetting.findOne({
    user: userId,
    settingName: `setting.user.notification.${setting}`,
  });
};
