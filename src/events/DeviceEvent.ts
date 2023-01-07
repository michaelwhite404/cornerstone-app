import { UserSetting } from "@models";
import { DeviceDocument, EmployeeDocument, ErrorLogModel } from "@@types/models";
import { Email, formatUrl } from "@utils";
import { Document, FilterQuery } from "mongoose";

class DeviceEvent {
  async checkIn(device: DeviceDocument, checkedInBy: Employee, error?: ErrorLogModel) {
    // Send Email
    const checkInAll = { "value.deviceCheckInEmail": "DEVICE_CHECK_IN_EMAIL_ENUM_ALL" };
    const checkInBroken = { "value.deviceCheckInEmail": "DEVICE_CHECK_IN_EMAIL_ENUM_BROKEN" };
    const filter: FilterQuery<Document> = error ? { $or: [checkInAll, checkInBroken] } : checkInAll;
    const docs = await UserSetting.find(filter).populate({ path: "user" });
    docs.forEach(({ user }: { user: EmployeeDocument }) => {
      const { deviceType, slug } = device;
      const email = new Email(user, formatUrl(`/devices/${deviceType}/${slug}`));
      email.sendDeviceCheckInEmail(device, checkedInBy, error);
    });
  }
}

export const deviceEvent = new DeviceEvent();
