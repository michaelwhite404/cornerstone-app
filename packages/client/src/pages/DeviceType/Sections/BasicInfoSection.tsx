import React from "react";
import DevicePane from "../DevicePane";
import { grades } from "@/utils/grades";
import { DeviceModel } from "@/types/models/deviceTypes";
import BasicInfo from "../BasicInfo";

export default function BasicInfoSection({
  device,
  showData,
  originalDevice,
}: {
  device?: DeviceModel;
  showData: boolean;
  originalDevice: DeviceModel;
}) {
  const values = [
    { heading: "Model", value: device?.model, showSkeleton: true },
    { heading: "Serial Number", value: device?.serialNumber, showSkeleton: true },
    { heading: "MAC Address", value: device?.macAddress, showSkeleton: true },
    { heading: "Management Type", value: "Cloud", showSkeleton: true },
    { heading: "Device Type", value: "Education Upgrade", showSkeleton: true },
    {
      heading: "Auto Update Expiration",
      value: device?.autoUpdateExpiration,
      showSkeleton: originalDevice.deviceType === "chromebook",
    },
    {
      heading: "Checked Out By",
      value: device?.checkedOut
        ? `${device?.lastUser?.fullName} (${grades[device?.lastUser?.grade ?? 0]})`
        : undefined,
      showSkeleton: originalDevice.checkedOut,
    },
    {
      heading: "Teacher Check Out",
      value: device?.checkedOut ? device?.teacherCheckOut?.fullName : undefined,
      showSkeleton: originalDevice.checkedOut,
    },
    {
      heading: "Check Out Date",
      value: device?.checkedOut ? new Date(device?.lastCheckOut!).toLocaleString() : undefined,
      showSkeleton: originalDevice.checkedOut,
    },
  ];

  return (
    <DevicePane heading="Basic Info">
      <BasicInfo>
        {values.map((value) =>
          showData ? (
            <BasicInfo.Card data={value} key={value.heading} />
          ) : (
            value.showSkeleton && <BasicInfo.Skeleton key={`${value.heading}-skeleton`} />
          )
        )}
      </BasicInfo>
    </DevicePane>
  );
}
