import { Button, InputGroup, Label } from "@blueprintjs/core";
import axios, { AxiosError } from "axios";
import capitalize from "capitalize";
import { singular } from "pluralize";
import React, { useState } from "react";
import { DeviceModel } from "../../../../src/types/models/deviceTypes";
import BackButton from "../../components/BackButton";
import FadeIn from "../../components/FadeIn";
import MainContent from "../../components/MainContent";
import { useToasterContext } from "../../hooks";
import { APIDeviceResponse, APIError } from "../../types/apiResponses";

interface AddDeviceProps {
  deviceType: string;
  setPageStatus: React.Dispatch<React.SetStateAction<"blank" | "device" | "add">>;
  setSelectedDevice: React.Dispatch<React.SetStateAction<DeviceModel | undefined>>;
  reFetchDevices: () => Promise<void>;
}

export default function AddDevice({
  deviceType,
  setPageStatus,
  setSelectedDevice,
  reFetchDevices,
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
    { label: "Name", name: "name", required: true, disabled: false, placeholder: "HP 01" },
    { label: "Brand", name: "brand", required: true, disabled: false, placeholder: "HP" },
    {
      label: "Model",
      name: "model",
      required: true,
      disabled: false,
      placeholder: "HP Chromebook 14 G5",
    },
    {
      label: "Serial Number",
      name: "serialNumber",
      required: true,
      disabled: false,
      placeholder: "5CD8214GMZ",
    },
    {
      label: "MAC Address",
      name: "macAddress",
      required: true,
      disabled: false,
      placeholder: "5C:5F:67:B0:DC:36",
    },
    {
      label: "Directory API ID",
      name: "directoryId",
      required: false,
      disabled: false,
      placeholder: "57db2897-8756-4ad6-bfa9-858f410d5fb9",
    },
    {
      label: "Device Type",
      name: "deviceType",
      required: true,
      disabled: true,
      placeholder: singular(deviceType),
    },
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
      setPageStatus("device");
      showToaster(`${device.name} successfully created`, "success");
      reFetchDevices();
    } catch (err) {
      showToaster((err as AxiosError<APIError>).response!.data.message, "danger");
    }
  };

  const onBack = () => setPageStatus("blank");

  const { directoryId, ...rest } = data;
  const submittable = Object.values(rest).every((value) => value.length > 0);

  return (
    <MainContent.InnerWrapper>
      <FadeIn>
        <MainContent.Header>
          <div style={{ display: "flex", alignItems: "center" }}>
            <BackButton onClick={onBack} />
            <span style={{ fontWeight: 500, fontSize: 16 }}>Add {capitalize(deviceType)}</span>
          </div>
        </MainContent.Header>
        <div
          style={{
            overflowY: "scroll",
          }}
        >
          <div
            style={{ width: "100%", display: "flex", justifyContent: "center", padding: "15px 0" }}
          >
            <div style={{ width: "80%" }}>
              {inputs.map(({ name, label, required, disabled, placeholder }) => (
                <InputRow
                  key={name}
                  name={name}
                  label={label}
                  required={required}
                  onChange={handleInput}
                  disabled={disabled}
                  //@ts-ignore
                  value={data[name] ?? singular(deviceType)}
                  placeholder={placeholder}
                />
              ))}
            </div>
          </div>
        </div>
        <MainContent.Footer>
          <Button text="Cancel" onClick={onBack} style={{ marginRight: 10 }} />
          <Button intent="primary" onClick={handleClick} disabled={!submittable}>
            Create {capitalize(singular(deviceType))}
          </Button>
        </MainContent.Footer>
      </FadeIn>
    </MainContent.InnerWrapper>
  );
}

const InputRow = ({
  name,
  label,
  required,
  onChange,
  disabled = false,
  value,
  placeholder,
}: {
  name: string;
  label: string;
  required: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  disabled?: boolean;
  value: string;
  placeholder?: string;
}) => {
  return (
    <div style={{ marginBottom: 25 }}>
      <Label>
        <span style={{ fontWeight: 500 }}>
          {label}
          {required && <span style={{ marginLeft: 5, color: "red" }}>*</span>}
        </span>
        <InputGroup
          className="add-device-input"
          value={value}
          name={name}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
        />
      </Label>
    </div>
  );
};
