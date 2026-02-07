import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui";
import { DeviceModel } from "../../types/models/deviceTypes";
import { ErrorLogModel } from "../../types/models/errorLogTypes";
import PaneHeader from "../../components/PaneHeader/PaneHeader";
import { useAuth, useDevice } from "../../hooks";
import { grades } from "../../utils/grades";
import Checkin from "./Checkin";
import Checkout from "./Checkout";
import CheckoutHistory from "./CheckoutHistory";

import ErrorHistory from "./ErrorHistory";
import UpdateError from "./UpdateError";

export default function DeviceContent({
  device,
  setSelectedDevice,
  updateDevice,
}: {
  device: DeviceModel;
  setSelectedDevice: React.Dispatch<React.SetStateAction<DeviceModel | undefined>>;
  updateDevice: (id: string, newDevice: DeviceModel) => void;
}) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  // const history = useHistory();
  const {
    checkouts,
    errors,
    checkinDevice,
    checkoutDevice,
    updateableErrors,
    updateDeviceError,
    createDeviceError,
  } = useDevice(device.deviceType, device.slug);
  const { user } = useAuth();
  useEffect(() => {}, []);

  const values = [
    { heading: "Model", value: device.model },
    { heading: "Serial Number", value: device.serialNumber },
    { heading: "MAC Address", value: device.macAddress },
    { heading: "Management Type", value: "Cloud" },
    { heading: "Device Type", value: "Education Upgrade" },
    { heading: "Auto Update Expiration", value: device.autoUpdateExpiration },
    {
      heading: "Checked Out By",
      value: device.checkedOut
        ? `${device.lastUser?.fullName} (${grades[device.lastUser?.grade ?? 0]})`
        : undefined,
    },
    {
      heading: "Teacher Check Out",
      value: device.checkedOut ? device.teacherCheckOut?.fullName : undefined,
    },
    {
      heading: "Check Out Date",
      value: device.checkedOut ? new Date(device.lastCheckOut!).toLocaleString() : undefined,
    },
  ];

  const onCheckingSuccess = (updatedDevice: DeviceModel) => {
    setSelectedDevice(updatedDevice);
    updateDevice(device._id, updatedDevice);
  };

  const onMakeErrorSuccess = (res: { errorLog: ErrorLogModel; device: DeviceModel }) => {
    setSelectedDevice(res.device);
    updateDevice(device._id, res.device);
  };

  return (
    <>
      <div style={{ height: "100%", overflow: "scroll" }}>
        <div className="py-[15px] pr-[25px] pb-[35px] pl-[50px] border-b border-gray-200">
          <PaneHeader>Basic Info</PaneHeader>
          <div className="flex flex-wrap">
            {values.map((box) => (
              <DeviceBasicInfo heading={box.heading} value={box.value} key={box.heading} />
            ))}
          </div>
        </div>
        {device.status === "Available" && (
          <div className="py-[15px] pr-[25px] pb-[35px] pl-[50px] border-b border-gray-200">
            <Checkout
              device={device}
              checkoutDevice={checkoutDevice}
              onCheckoutSuccess={onCheckingSuccess}
            />
          </div>
        )}
        {device.status === "Checked Out" && (
          <div className="py-[15px] pr-[25px] pb-[35px] pl-[50px] border-b border-gray-200">
            <Checkin
              device={device}
              checkinDevice={checkinDevice}
              onCheckinSuccess={onCheckingSuccess}
            />
          </div>
        )}
        {device.status === "Broken" && updateableErrors.length > 0 && (
          <div className="py-[15px] pr-[25px] pb-[35px] pl-[50px] border-b border-gray-200">
            <UpdateError
              errors={updateableErrors}
              updateDeviceError={updateDeviceError}
              onUpdateErrorSuccess={onMakeErrorSuccess}
            />
          </div>
        )}
        <div className="py-[15px] pr-[25px] pb-[35px] pl-[50px] border-b border-gray-200">
          <CheckoutHistory checkouts={checkouts} />
        </div>
        <div className="py-[15px] pr-[25px] pb-[35px] pl-[50px] border-b border-gray-200">
          <ErrorHistory
            errors={errors}
            createDeviceError={createDeviceError}
            onCreateErrorSuccess={onMakeErrorSuccess}
          />
        </div>
      </div>
      {user && ["Super Admin", "Admin"].includes(user.role) && (
        <div className="h-10 py-[5px] px-2.5 shadow-[inset_0_1px_0_rgba(16,22,26,0.15)]">
          <div className="flex justify-end items-center h-full">
            <Button variant="primary" onClick={() => navigate(`${pathname}/${device.slug}`)}>
              {"See All Data >"}
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

const DeviceBasicInfo = ({ heading, value }: { heading: string; value?: string }) => {
  return value ? (
    <div style={{ width: "33.33%", padding: "15px 0" }}>
      <h4>{heading}</h4>
      {value}
    </div>
  ) : (
    <></>
  );
};
