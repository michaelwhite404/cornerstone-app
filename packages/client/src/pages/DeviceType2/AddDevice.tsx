import { Button, Input, Label } from "../../components/ui";
import { AxiosError } from "axios";
import capitalize from "capitalize";
import pluralize, { singular } from "pluralize";
import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { DeviceModel } from "../../types/models/deviceTypes";
import BackButton from "../../components/BackButton";
import FadeIn from "../../components/FadeIn";
import MainContent from "../../components/MainContent";
import { useToasterContext } from "../../hooks";
import { useCreateDevice } from "../../api";
import { APIError } from "../../types/apiResponses";

interface AddDeviceProps {
  deviceType: string;
  setPageState: React.Dispatch<React.SetStateAction<"blank" | "device" | "add">>;
  setSelectedDevice: React.Dispatch<React.SetStateAction<DeviceModel | undefined>>;
  reFetchDevices: () => Promise<void>;
  onBack: VoidFunction;
}

export default function AddDevice() {
  const { showToaster } = useToasterContext();
  const navigate = useNavigate();
  const { deviceType, setPageState, setSelectedDevice, reFetchDevices, onBack } =
    useOutletContext<AddDeviceProps>();
  const [data, setData] = useState({
    name: "",
    brand: "",
    model: "",
    serialNumber: "",
    macAddress: "",
    directoryId: "",
  });

  useEffect(() => setSelectedDevice(undefined), [setSelectedDevice]);

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

  const createDeviceMutation = useCreateDevice();

  const handleClick = async () => {
    if (!submittable) return;
    try {
      const device = await createDeviceMutation.mutateAsync({
        ...data,
        deviceType: singular(deviceType),
        directoryId: data.directoryId || undefined,
      });
      setSelectedDevice(device);
      setPageState("device");
      showToaster(`${device.name} successfully created`, "success");
      reFetchDevices();
      navigate(`/devices/${pluralize(deviceType)}/${device.slug}`);
    } catch (err) {
      showToaster((err as AxiosError<APIError>).response!.data.message, "danger");
    }
  };

  const { directoryId, ...rest } = data;
  const submittable = Object.values(rest).every((value) => value.length > 0);

  return (
    <MainContent.InnerWrapper>
      <FadeIn>
        <MainContent.Header>
          <div style={{ display: "flex", alignItems: "center" }}>
            <BackButton onClick={onBack} />
            <span style={{ fontWeight: 500, fontSize: 16 }}>
              Add {capitalize(singular(deviceType))}
            </span>
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
          <Button variant="primary" onClick={handleClick} disabled={!submittable}>
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
        <Input
          className="add-device-input"
          value={value}
          name={name}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          fill
        />
      </Label>
    </div>
  );
};
