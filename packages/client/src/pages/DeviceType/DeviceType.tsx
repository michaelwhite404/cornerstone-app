import { Button, Drawer, Menu, MenuItem } from "@blueprintjs/core";
import { Popover2 } from "@blueprintjs/popover2";
import axios from "axios";
import capitalize from "capitalize";
import pluralize from "pluralize";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
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
              <span className="device-name" onClick={() => handleDeviceNameClick(original)}>
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
  const drawerSize = {
    List: "0%",
    Single: "70%",
    Add: "40%",
  };

  const ActionsMenu = (
    <Menu className="custom-pop">
      <MenuItem
        icon="add"
        text={`Add ${capitalize(pluralize.singular(deviceType!))}`}
        onClick={() => setPageStatus("Add")}
      />
      <MenuItem icon="th-list" text="Checkout Logs" onClick={() => goTo("logs")} />
      <MenuItem icon="stacked-chart" text="Stats" onClick={() => goTo("stats")} />
    </Menu>
  );

  return (
    <div>
      <PageHeader text={deviceType!}>
        <Popover2 content={ActionsMenu} placement="bottom-end" className="menu-popover">
          <Button icon="settings" text="Actions" large />
        </Popover2>
      </PageHeader>
      <Table columns={columns} data={data} sortBy="name" />
      <Drawer
        isOpen={pageStatus !== "List"}
        onClose={handleDrawerClose}
        usePortal
        size={drawerSize[pageStatus]}
        hasBackdrop
        canEscapeKeyClose={false}
        canOutsideClickClose={pageStatus === "Single"}
        title={drawerTitle[pageStatus]}
      >
        {drawerContent[pageStatus]}
      </Drawer>
    </div>
  );
}
