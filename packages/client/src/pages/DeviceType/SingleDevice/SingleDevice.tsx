import axios from "axios";
import { Fragment, useCallback, useEffect, useState } from "react";
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

import Badge from "../../../components/Badge/Badge";
import UpdateError from "../UpdateError";
import { Menu, Transition } from "@headlessui/react";
import { CogIcon, RefreshIcon } from "@heroicons/react/solid";
import { Button } from "../../../components/ui";
import Modal from "../../../components/Modal";
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

  return (
    <div>
      {device && (
        <>
          <PageHeader text={device.name || ""}>
            <Menu as="div" className="relative">
              <Menu.Button as={Fragment}>
                <Button icon={<CogIcon className="h-5 w-5" />} text="Actions" size="lg" />
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    {user && user.role === "Super Admin" && (
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={`${active ? "bg-gray-100" : ""} flex w-full items-center px-4 py-2 text-sm text-gray-700`}
                            onClick={() => setOpen(true)}
                          >
                            <RefreshIcon className="h-5 w-5 mr-2" />
                            Reset
                          </button>
                        )}
                      </Menu.Item>
                    )}
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </PageHeader>
          <DeviceStatusBadge status={device.status} />
          <div className="p-[15px]">
            <PaneHeader>Basic Info</PaneHeader>
            <div className="flex flex-wrap">
              {values.map((box) => (
                <DeviceBasicInfo heading={box.heading} value={box.value} key={box.heading} />
              ))}
            </div>
          </div>
          {device.status === "Broken" && updateableErrors.length > 0 && (
            <div className="p-[15px]">
              <UpdateError errors={updateableErrors} updateDeviceError={updateDeviceError} />
            </div>
          )}
          {device.status === "Available" && (
            <div className="p-[15px]">
              <Checkout device={device} checkoutDevice={checkoutDevice} />
            </div>
          )}
          {device.status === "Checked Out" && (
            <div className="p-[15px]">
              <Checkin device={device} checkinDevice={checkinDevice} />
            </div>
          )}
          <div className="p-[15px]">
            <CheckoutHistory checkouts={checkouts} />
          </div>
          <div className="p-[15px]">
            <ErrorHistory errors={errors} createDeviceError={createDeviceError} />
          </div>
          <Modal open={open} setOpen={setOpen} onClose={() => setOpen(false)}>
            <div className="text-lg font-medium text-gray-900 mb-4">Reset 1 Device</div>
            <ResetBody close={() => setOpen(false)} resetDevice={resetDevice} />
          </Modal>
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
