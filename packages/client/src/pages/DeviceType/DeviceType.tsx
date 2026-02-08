import axios from "axios";
import capitalize from "capitalize";
import pluralize from "pluralize";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Menu, Transition } from "@headlessui/react";
import { CogIcon, PlusIcon, ViewListIcon, ChartBarIcon } from "@heroicons/react/solid";
import { Button } from "../../components/ui";
import Slideover from "../../components/Slideover";
import { DeviceModel } from "../../types/models/deviceTypes";
import DeviceStatusBadge from "../../components/Badges/DeviceStatusBagde";
import PageHeader from "../../components/PageHeader";
import Table from "../../components/Table/Table";
import { useDocTitle, useWindowSize } from "../../hooks";
import { grades } from "../../utils/grades";
import AddDevice from "./AddDevice";
import DeviceContent from "./DeviceContent";

export default function DeviceType() {
  const { pathname } = useLocation();
  const { deviceType } = useParams<{ deviceType: string }>();
  useDocTitle(`${capitalize(deviceType!)} | Cornerstone App`);
  const navigate = useNavigate();
  const [width] = useWindowSize();
  const [devices, setDevices] = useState<DeviceModel[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<DeviceModel | undefined>(undefined);
  const [pageStatus, setPageStatus] = useState<"List" | "Single" | "Add">("List");

  const updateDevice = (id: string, newDevice: DeviceModel) => {
    const copiedDevices = [...devices];
    const index = copiedDevices.findIndex((device) => device._id === id);
    copiedDevices[index] = newDevice;
    setDevices(copiedDevices);
  };

  const getLastUser = (device: DeviceModel) => {
    return device.status === "Checked Out" && device.lastUser
      ? `${device.lastUser?.fullName} (${grades[device.lastUser?.grade ?? 0]})`
      : "";
  };

  const handleDeviceNameClick = (original: DeviceModel) => {
    setSelectedDevice(original);
    setPageStatus("Single");
  };

  const handleDrawerClose = () => {
    setPageStatus("List");
    setSelectedDevice(undefined);
  };

  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
        width: (width - 619) / 5,
        Cell: ({ row: { original } }: { row: { original: DeviceModel } }) => {
          return (
            <span style={{ display: "flex", alignItems: "center" }}>
              <img
                src={`/device-logos/${original.brand}-Logo.png`}
                alt={`${original.brand} Logo`}
                style={{ width: 30, marginRight: 10 }}
              />
              <span
                className="text-black cursor-pointer hover:text-blue-400"
                onClick={() => handleDeviceNameClick(original)}
              >
                {original.name}
              </span>
            </span>
          );
        },
      },
      { Header: "Brand", accessor: "brand", width: (width - 619) / 5 },
      { Header: "Serial Number", accessor: "serialNumber", width: 275, minWidth: 275 },
      { Header: "MAC Address", accessor: "macAddress", width: (width - 619) / 5 },
      {
        Header: "Status",
        accessor: "status",
        width: (width - 619) / 5,
        Cell: ({ row: { original } }: { row: { original: DeviceModel } }) => (
          <DeviceStatusBadge status={original.status} />
        ),
      },
      {
        Header: "Student",
        accessor: (original: DeviceModel): string => {
          return getLastUser(original);
        },
        width: (width - 619) / 5,
        Cell: ({ row: { original } }: { row: { original: DeviceModel } }): string => {
          return getLastUser(original);
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [width]
  );
  const data = useMemo(() => devices, [devices]);

  const getDevicesByType = useCallback(async () => {
    const res = await axios.get("/api/v2/devices", {
      params: {
        deviceType: pluralize.singular(deviceType!),
        sort: "name",
        limit: 2000,
      },
    });
    setDevices(res.data.data.devices);
  }, [deviceType]);

  useEffect(() => {
    getDevicesByType();
  }, [getDevicesByType]);

  const goTo = (value: string) => navigate(`${pathname}/${value}`);

  const drawerTitle = {
    Single: (
      <div className="flex">
        {selectedDevice && (
          <>
            <span style={{ marginRight: 10 }}>{selectedDevice?.name}</span>
            <DeviceStatusBadge status={selectedDevice.status} />
          </>
        )}
      </div>
    ),
    List: "",
    Add: `Add ${capitalize(pluralize.singular(deviceType!))}`,
  };
  const drawerContent = {
    Single: (
      <>
        {selectedDevice && (
          <DeviceContent
            device={selectedDevice!}
            setSelectedDevice={setSelectedDevice}
            updateDevice={updateDevice}
          />
        )}
      </>
    ),
    List: "",
    Add: (
      <AddDevice
        deviceType={deviceType!}
        setPageStatus={setPageStatus}
        setSelectedDevice={setSelectedDevice}
        getDevicesByType={getDevicesByType}
      />
    ),
  };
  return (
    <div>
      <PageHeader text={deviceType!}>
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
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`${
                        active ? "bg-gray-100" : ""
                      } flex w-full items-center px-4 py-2 text-sm text-gray-700`}
                      onClick={() => setPageStatus("Add")}
                    >
                      <PlusIcon className="h-5 w-5 mr-2" />
                      Add {capitalize(pluralize.singular(deviceType!))}
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`${
                        active ? "bg-gray-100" : ""
                      } flex w-full items-center px-4 py-2 text-sm text-gray-700`}
                      onClick={() => goTo("logs")}
                    >
                      <ViewListIcon className="h-5 w-5 mr-2" />
                      Checkout Logs
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`${
                        active ? "bg-gray-100" : ""
                      } flex w-full items-center px-4 py-2 text-sm text-gray-700`}
                      onClick={() => goTo("stats")}
                    >
                      <ChartBarIcon className="h-5 w-5 mr-2" />
                      Stats
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </PageHeader>
      <Table columns={columns} data={data} sortBy="name" />
      <Slideover open={pageStatus !== "List"} onOverlayClick={handleDrawerClose}>
        <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
          <div className="px-4 py-4 sm:px-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-lg font-medium text-gray-900">{drawerTitle[pageStatus]}</div>
            </div>
          </div>
          <div className="relative flex-1 overflow-y-auto">{drawerContent[pageStatus]}</div>
        </div>
      </Slideover>
    </div>
  );
}
