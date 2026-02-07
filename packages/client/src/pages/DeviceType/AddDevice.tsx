import { Button, InputGroup, Label } from "@blueprintjs/core";
import axios, { AxiosError } from "axios";
import capitalize from "capitalize";
import { singular } from "pluralize";
import React, { useState } from "react";
import { DeviceModel } from "../../types/models/deviceTypes";
import { useToasterContext } from "../../hooks";
import { APIDeviceResponse, APIError } from "../../types/apiResponses";

interface AddDeviceProps {
  deviceType: string;
  setPageStatus: React.Dispatch<React.SetStateAction<"List" | "Single" | "Add">>;
  setSelectedDevice: React.Dispatch<React.SetStateAction<DeviceModel | undefined>>;
  getDevicesByType: () => Promise<void>;
}

export default function AddDevice({
  deviceType,
  setPageStatus,
  setSelectedDevice,
  getDevicesByType,
}: AddDeviceProps) {
  const { showToaster } = useToasterContext();

  const [data, setData] = useState({
    name: "",
    brand: "",
    model: "",
    serialNumber: "",
    macAddress: "",
    directoryId: "",
  });

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const inputs = [
    { label: "Name", name: "name", required: true },
    { label: "Brand", name: "brand", required: true },
    { label: "Model", name: "model", required: true },
    { label: "Serial Number", name: "serialNumber", required: true },
    { label: "MAC Address", name: "macAddress", required: true },
    { label: "Directory API ID", name: "directoryId", required: false },
  ];

  interface CreateDevicePayload {
    name: string;
    brand: string;
    model: string;
    serialNumber: string;
    macAddress: string;
    directoryId?: string;
    deviceType: string;
  }

  /** Method to create a device */
  const createDevice = async (data: CreateDevicePayload) => {
    if (data.directoryId === "") data.directoryId = undefined;
    const res = await axios.post<APIDeviceResponse>("/api/v2/devices", {
      ...data,
      deviceType: singular(deviceType),
    });
    return res.data.data.device;
  };

  const handleClick = async () => {
    if (!submittable) return;
    try {
      const device = await createDevice({ ...data, deviceType: singular(deviceType) });
      setSelectedDevice(device);
      setPageStatus("Single");
      showToaster(`${device.name} successfully created`, "success");
      getDevicesByType();
    } catch (err) {
      showToaster((err as AxiosError<APIError>).response!.data.message, "danger");
    }
  };

  const { directoryId, ...rest } = data;
  const submittable = Object.values(rest).every((value) => value.length > 0);

  return (
    <>
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          paddingTop: "25px",
          overflow: "scroll",
        }}
      >
        <div style={{ width: "80%" }}>
          {inputs.map((input) => (
            <div key={input.name} style={{ marginBottom: 25 }}>
              <Label>
                <span style={{ fontWeight: 500 }}>
                  {input.label}
                  {input.required && <span style={{ marginLeft: 5, color: "red" }}>*</span>}
                </span>
                <InputGroup name={input.name} onChange={handleInput} />
              </Label>
            </div>
          ))}
          <div style={{ marginBottom: 25 }}>
            <Label>
              <span style={{ fontWeight: 500 }}>
                Device Type
                <span style={{ marginLeft: 5, color: "red" }}>*</span>
              </span>
              <InputGroup value={singular(deviceType)} disabled />
            </Label>
          </div>
        </div>
      </div>
      <div className="bp4-drawer-footer" style={{ textAlign: "right" }}>
        <Button intent="primary" onClick={handleClick} disabled={!submittable}>
          Create {capitalize(singular(deviceType))}
        </Button>
      </div>
    </>
  );
}
