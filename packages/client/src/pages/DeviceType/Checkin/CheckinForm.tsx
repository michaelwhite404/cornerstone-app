import React from "react";
import { RadioGroup } from "@/components/ui";
import { DeviceModel } from "@/types/models/deviceTypes";

export default function CheckinForm({
  device,
  radioValue,
  onRadioChange,
}: {
  device?: DeviceModel;
  radioValue?: string;
  onRadioChange?: (value: string) => void;
}) {
  const options = [
    {
      label: `${device?.lastUser!.fullName} has returned the ${
        device?.deviceType
      } in working condition`,
      value: "passed",
    },
    {
      label: `Check in ${device?.deviceType} and assign to ${device?.lastUser!.fullName}`,
      value: "assign",
    },
    {
      label: `There is an issue with the ${device?.deviceType}`,
      value: "error",
    },
  ];

  return (
    <RadioGroup
      className="mb-5"
      name="checkin-device"
      options={options}
      value={radioValue}
      onChange={(value) => onRadioChange && onRadioChange(value)}
    />
  );
}
