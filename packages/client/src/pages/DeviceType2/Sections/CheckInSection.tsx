import { useState } from "react";
import { DeviceModel } from "../../../types/models/deviceTypes";
import { useToasterContext } from "../../../hooks";
import Checkin from "../Checkin";
import DevicePane from "../DevicePane";

interface CheckInSectionProps {
  device?: DeviceModel;
  showData: boolean;
  // checkinDevice: (studentId: string) => Promise<DeviceModel>;
  checkinDevice: (data?: any) => Promise<DeviceModel>;
  /** A function to run directly after a checkin request is successful. The updated device is
   * passed in as a parameter
   */
  onCheckinSuccess?: (updatedDevice: DeviceModel) => void;
}

export default function CheckInSection({
  device,
  showData,
  checkinDevice,
  onCheckinSuccess,
}: CheckInSectionProps) {
  type CheckInState = "passed" | "assign" | "error";
  const [radio, setRadio] = useState<CheckInState | undefined>(undefined);
  const [error, setError] = useState({
    title: "",
    description: "",
  });
  const { showToaster } = useToasterContext();

  const handleRadioChange = (value: string) => setRadio(value as CheckInState);
  const handleInputChange = (name: string, value: string) => setError({ ...error, [name]: value });

  const submittable =
    radio === "passed" ||
    radio === "assign" ||
    (radio === "error" && error.title.length > 0 && error.description.length > 0);

  const handleCheckin = () => {
    if (!submittable) return;
    let data: any = {};
    if (radio === "error")
      data = { error: radio === "error", title: error.title, description: error.description };
    if (radio === "assign") data = { assign: true };
    checkinDevice(data)
      .then((updatedDevice) => {
        showToaster(`${updatedDevice.name} successfully checked in!`, "success");
        onCheckinSuccess && onCheckinSuccess(updatedDevice);
      })
      .catch((err) => showToaster(err.message, "danger"));
  };

  return (
    <DevicePane heading="Check In">
      <Checkin>
        {showData ? (
          <>
            <div className="device-checkin-left">
              <Checkin.Form device={device} radioValue={radio} onRadioChange={handleRadioChange} />
              {radio === "error" && (
                <Checkin.ErrorForm value={error} onInputChange={handleInputChange} />
              )}
            </div>
            <div className="device-checkin-right">
              <Checkin.Button
                deviceType={device?.deviceType}
                disabled={!submittable}
                onClick={handleCheckin}
              />
            </div>
          </>
        ) : (
          <Checkin.Skeleton />
        )}
      </Checkin>
    </DevicePane>
  );
}
