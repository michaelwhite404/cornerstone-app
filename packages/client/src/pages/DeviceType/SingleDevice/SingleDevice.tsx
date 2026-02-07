import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { admin_directory_v1 } from "googleapis";
import DeviceStatusBadge from "../../../components/Badges/DeviceStatusBagde";
import PageHeader from "../../../components/PageHeader";
import PaneHeader from "../../../components/PaneHeader/PaneHeader";
import { useAuth, useDevice, useDocTitle } from "../../../hooks";
import { grades } from "../../../utils/grades";
import Checkin from "../Checkin";
// import useToasterContext from "../../../hooks/useToasterContext";
import Checkout from "../Checkout";
import CheckoutHistory from "../CheckoutHistory";
import ErrorHistory from "../ErrorHistory";
import "./SingleDevice.sass";
import Badge from "../../../components/Badge/Badge";
import UpdateError from "../UpdateError";
import { Button, Dialog, Menu, MenuItem } from "@blueprintjs/core";
import { Popover2 } from "@blueprintjs/popover2";
import ResetBody from "./ResetBody";

type ChromeOsDevice = admin_directory_v1.Schema$ChromeOsDevice;

export default function SingleDevice() {
  const { user } = useAuth();
  // const { showToaster } = useToasterContext();
  const { deviceType, slug } = useParams<"deviceType" | "slug">();
  const {
    device,
    checkouts,
    errors,
    checkoutDevice,
    checkinDevice,
    createDeviceError,
    updateableErrors,
    updateDeviceError,
    resetDevice,
  } = useDevice(deviceType!, slug!);
  const [, setDocTitle] = useDocTitle(`${device?.name || ""} | Cornerstone App`);
  const [googleDevice, setGoogleDevice] = useState<ChromeOsDevice>();
  const [currentOsVersion, setCurrentOsVersion] = useState<string>();
  useEffect(() => {
    setDocTitle(`${device?.name || ""} | Cornerstone App`);
  }, [device?.name, setDocTitle]);
  const [open, setOpen] = useState(false);

  const getGoogleDevice = useCallback(async () => {
    if (device?.directoryId) {
      const [deviceRes, versionRes] = await Promise.all([
        axios.get(`/api/v2/devices/from-google/${device.directoryId}`),
        axios.get("https://omahaproxy.appspot.com/win"),
      ]);
      setGoogleDevice(deviceRes.data.data.device);
      setCurrentOsVersion(versionRes.data);
    }
  }, [device?.directoryId]);

  useEffect(() => {
    getGoogleDevice();
  }, [getGoogleDevice]);

  const values = [
    { heading: "Model", value: device?.model },
    { heading: "Serial Number", value: device?.serialNumber },
    { heading: "MAC Address", value: device?.macAddress },
    { heading: "Management Type", value: "Cloud" },
    { heading: "Device Type", value: "Education Upgrade" },
    { heading: "Auto Update Expiration", value: device?.autoUpdateExpiration },
    {
      heading: "Checked Out By",
      value: device?.checkedOut
        ? `${device?.lastUser?.fullName} (${grades[device?.lastUser?.grade ?? 0]})`
        : undefined,
    },
    {
      heading: "Teacher Check Out",
      value: device?.checkedOut ? device?.teacherCheckOut?.fullName : undefined,
    },
    {
      heading: "Check Out Date",
      value: device?.checkedOut ? new Date(device?.lastCheckOut!).toLocaleString() : undefined,
    },
    {
      heading: "Last Policy Sync",
      value: googleDevice?.lastSync ? new Date(googleDevice?.lastSync).toLocaleString() : undefined,
    },
    {
      heading: "Chrome OS Version",
      value: googleDevice?.osVersion,
    },
    {
      heading: "Directory API ID",
      value: googleDevice?.deviceId,
    },
    {
      heading: "Enrollment Time",
      value: googleDevice?.lastEnrollmentTime
        ? new Date(googleDevice?.lastEnrollmentTime).toLocaleString()
        : undefined,
    },
    {
      heading: "OS Version Policy Compliance",
      value:
        googleDevice?.osVersion === undefined ||
        currentOsVersion === undefined ? undefined : googleDevice?.osVersion?.split(".")[0] ===
          currentOsVersion?.split(".")[0] ? (
          <Badge color="emerald" text="Compliant" />
        ) : (
          <Badge color="red" text="Not Compliant" />
        ),
    },
  ];

  const ActionsMenu = (
    <Menu className="custom-pop">
      {user && user.role === "Super Admin" && (
        <MenuItem icon="reset" text="Reset" onClick={() => setOpen(true)} />
      )}
    </Menu>
  );

  return (
    <div>
      {device && (
        <>
          <PageHeader text={device.name || ""}>
            <Popover2 content={ActionsMenu} placement="bottom-end" className="menu-popover">
              <Button icon="settings" text="Actions" large />
            </Popover2>
          </PageHeader>
          <DeviceStatusBadge status={device.status} />
          <div className="single-device-pane">
            <PaneHeader>Basic Info</PaneHeader>
            <div className="basic-info-box-wrapper">
              {values.map((box) => (
                <DeviceBasicInfo heading={box.heading} value={box.value} key={box.heading} />
              ))}
            </div>
          </div>
          {device.status === "Broken" && updateableErrors.length > 0 && (
            <div className="single-device-pane">
              <UpdateError errors={updateableErrors} updateDeviceError={updateDeviceError} />
            </div>
          )}
          {device.status === "Available" && (
            <div className="single-device-pane">
              <Checkout device={device} checkoutDevice={checkoutDevice} />
            </div>
          )}
          {device.status === "Checked Out" && (
            <div className="single-device-pane">
              <Checkin device={device} checkinDevice={checkinDevice} />
            </div>
          )}
          <div className="single-device-pane">
            <CheckoutHistory checkouts={checkouts} />
          </div>
          <div className="single-device-pane">
            <ErrorHistory errors={errors} createDeviceError={createDeviceError} />
          </div>
          <Dialog
            isOpen={open}
            title={"Reset 1 Device"}
            onClose={() => setOpen(false)}
            style={{ width: 400 }}
          >
            <ResetBody close={() => setOpen(false)} resetDevice={resetDevice} />
          </Dialog>
        </>
      )}
    </div>
  );
}

const DeviceBasicInfo = ({ heading, value }: { heading: string; value?: string | JSX.Element | null }) => {
  return value ? (
    <div style={{ width: "33.33%", padding: "15px 0" }}>
      <h4>{heading}</h4>
      {value}
    </div>
  ) : (
    <></>
  );
};
