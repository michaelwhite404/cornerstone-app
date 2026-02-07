import { Radio, RadioGroup } from "@blueprintjs/core";
import React from "react";
import { DeviceModel } from "../../../types/models/deviceTypes";

export default function CheckinForm({
  device,
  radioValue,
  onRadioChange,
}: {
  device?: DeviceModel;
  radioValue?: string;
  onRadioChange?: (value: string) => void;
}) {
  const handleRadioChange = (e: React.FormEvent<HTMLInputElement>) =>
    onRadioChange && onRadioChange(e.currentTarget.value);

  return (
    <RadioGroup
      className="device-checkin-radio-container"
      selectedValue={radioValue}
      onChange={handleRadioChange}
    >
      <Radio className="radio" name="checkin-device" value="passed">
        {device?.lastUser!.fullName} has returned the {device?.deviceType} in working condition
      </Radio>
      <Radio className="radio" name="checkin-device" value="assign">
        Check in {device?.deviceType} and assign to {device?.lastUser!.fullName}
      </Radio>
      <Radio className="radio" name="checkin-device" value="error">
        There is an issue with the {device?.deviceType}
      </Radio>
    </RadioGroup>
  );
}
