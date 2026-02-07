import { Button, Classes, Radio, TextArea } from "@blueprintjs/core";
import React, { useState } from "react";
import { DeviceModel } from "../../types/models/deviceTypes";
import PaneHeader from "../../components/PaneHeader/PaneHeader";

interface DeviceCheckinProps {
  device: DeviceModel;
  checkinDevice: (data?: any) => Promise<DeviceModel | undefined>;
  onCheckinSuccess?: (updatedDevice: DeviceModel) => any;
}

export default function Checkin({ device, checkinDevice, onCheckinSuccess }: DeviceCheckinProps) {
  const [radio, setRadio] = useState<string | undefined>(undefined);
  const [error, setError] = useState({
    title: "",
    description: "",
  });
  const handleRadioChange = (e: React.FormEvent<HTMLDivElement>) => {
    // @ts-ignore
    setRadio(e.target.value as string);
  };
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement> & React.ChangeEventHandler<HTMLTextAreaElement>
  ) => {
    setError({ ...error, [e.target.name]: e.target.value });
  };

  const submittable = () => {
    let submittable = false;
    if (radio === "passed") submittable = true;
    if (radio === "error" && error.title.length > 0 && error.description.length > 0)
      submittable = true;
    return submittable;
  };

  // setSelectedDevice(updatedDevice);
  // updateDevice(device._id, updatedDevice);
  const handleCheckin = async () => {
    if (!submittable()) return;
    let data: any = {};
    if (radio === "error")
      data = { error: radio === "error", title: error.title, description: error.description };
    const updatedDevice = await checkinDevice(data);
    if (updatedDevice && onCheckinSuccess) onCheckinSuccess(updatedDevice);
  };

  return (
    <div>
      <PaneHeader>Check In</PaneHeader>
      <div className="flex">
        <div style={{ width: "65%" }}>
          <div style={{ marginBottom: "25px" }} onChange={handleRadioChange}>
            <Radio className="radio" name="checkin-device" value="passed">
              {device.lastUser!.fullName} has returned the {device.deviceType} in working condition
            </Radio>
            <Radio className="radio" name="checkin-device" value="error">
              There is an issue with the {device.deviceType}
            </Radio>
          </div>
          {radio === "error" && (
            <div style={{ width: "75%" }}>
              <div
                style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}
              >
                <label htmlFor="error-title">Title of Issue</label>
                <input
                  className={Classes.INPUT}
                  name="title"
                  type="text"
                  dir="auto"
                  style={{ minWidth: "250px" }}
                  onChange={handleInputChange}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <label htmlFor="error-description">Description of Issue</label>
                <TextArea
                  style={{ minWidth: "250px", maxWidth: "250px", minHeight: "175px" }}
                  name="description"
                  // @ts-ignore
                  onChange={handleInputChange}
                />
              </div>
            </div>
          )}
        </div>
        <div className="device-checkin-box button" style={{ justifyContent: "flex-start" }}>
          <Button intent="primary" disabled={!submittable()} onClick={handleCheckin}>
            Check In {device.deviceType}
          </Button>
        </div>
      </div>
    </div>
  );
}
