import { PlusIcon } from "@heroicons/react/solid";
import capitalize from "capitalize";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { DeviceModel } from "../../types/models/deviceTypes";
import DeviceStatusBadge from "../../components/Badges/DeviceStatusBagde";
import MainContent from "../../components/MainContent";
import Modal from "../../components/Modal";
import PageHeader from "../../components/PageHeader";
import SideTable from "../../components/SideTable/SideTable";
import SideTableFilter from "../../components/SideTable/SideTableFilter";
import { useAuth, useDocTitle, useWindowSize } from "../../hooks";
import { grades } from "../../utils/grades";
import { useDevices } from "../../api";

export default function DeviceType2() {
  const { deviceType, slug } = useParams<"deviceType" | "slug">();
  const location = useLocation();
  useDocTitle(`${capitalize(deviceType!)} | Devices | Cornerstone App`);
  const [selected, setSelected] = useState<DeviceModel>();

  const getPageState = useCallback(() => {
    if (location.pathname.endsWith("add")) return "add";
    if (slug) return "device";
    setSelected(undefined);
    return "blank";
  }, [location.pathname, slug]);

  const [pageState, setPageState] = useState<"blank" | "device" | "add">(getPageState);
  const width = useWindowSize()[0];
  const [filter, setFilter] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();
  const [dialogState, setDialogState] = useState({
    open: false,
    title: "",
    width: 400 as number | string,
    Component: <></>,
  });

  const { data: devices = [], refetch: reFetchDevices } = useDevices(deviceType!);

  useEffect(() => setPageState(getPageState), [getPageState]);

  const data = useMemo(() => devices, [devices]);
  const columns = useMemo(
    () => [
      { Header: "Name", accessor: "name" },
      { Header: "Brand", accessor: "brand" },
      { Header: "Serial Number", accessor: "serialNumber" },
      { Header: "MAC Address", accessor: "macAddress" },
      { Header: "Status", accessor: "status" },
      { Header: "Student", accessor: (original: DeviceModel): string => getLastUser(original) },
    ],
    []
  );

  const handleSelection = (device: DeviceModel) => {
    setSelected(device);
    setPageState("device");
    navigate(`/devices/${deviceType}/${device.slug}`);
  };
  const handleBack = () => {
    setPageState("blank");
    setSelected(undefined);
    navigate(`/devices/${deviceType}`);
  };

  const handleAddClick = () => {
    setPageState("add");
    setSelected(undefined);
    navigate(`/devices/${deviceType}/add`);
  };

  const dialogControls = {
    open: (title: string, width: string | number, Component: JSX.Element) => {
      setDialogState({ open: true, title, width, Component });
    },
    close: () => {
      setDialogState({ open: false, title: "", width: 400, Component: <></> });
    },
  };

  return (
    <div style={{ display: "flex", height: "100%" }}>
      {!(width < 768 && pageState !== "blank") && (
        <SideTable<DeviceModel>
          data={data}
          columns={columns}
          rowComponent={FakeComp}
          groupBy="brand"
          onSelectionChange={handleSelection}
          selected={selected?._id || ""}
          filterValue={filter}
        >
          <div className="pt-6 px-6 pb-4 border-b border-gray-200">
            <PageHeader text={deviceType!} />
            <div style={{ display: "flex", marginTop: 5 }}>
              <SideTableFilter value={filter} onChange={(value) => setFilter(value)} />
              {["Super Admin", "Admin"].includes(user!.role) && (
                <button
                  className="flex items-center justify-center rounded-md border border-gray-300 bg-white hover:bg-gray-50 cursor-pointer"
                  style={{ marginTop: 0, padding: "0 10px", marginLeft: 10 }}
                  onClick={handleAddClick}
                >
                  <PlusIcon className="h-5 w-5 text-blue-600" />
                </button>
              )}
            </div>
            {/* <p>Search directory of many books</p> */}
          </div>
        </SideTable>
      )}
      <MainContent>
        <Outlet
          context={{
            device: selected,
            onBack: handleBack,
            reFetchDevices,
            dialogControls,
            user,
            deviceType,
            setPageState,
            setSelectedDevice: setSelected,
          }}
        />
      </MainContent>
      <Modal
        open={dialogState.open}
        setOpen={() => dialogControls.close()}
        onClose={dialogControls.close}
      >
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">{dialogState.title}</h3>
        {dialogState.Component}
      </Modal>
    </div>
  );
}

function FakeComp(device: DeviceModel) {
  const { name, status, serialNumber, macAddress } = device;
  const lastUser = getLastUser(device);
  return (
    <div style={{ padding: "15px 24px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontWeight: 500,
          marginBottom: 8,
        }}
      >
        {name}
        <DeviceStatusBadge status={status} />
      </div>
      <div style={{ color: "#9ca3af", marginBottom: 8, fontSize: 13 }}>
        <div>Serial Number: {serialNumber}</div>
        <div>MAC Address: {macAddress}</div>
      </div>
      {lastUser && <div style={{ fontSize: 13 }}>Student: {lastUser}</div>}
    </div>
  );
}

const getLastUser = (device: DeviceModel) => {
  return ["Checked Out", "Assigned"].includes(device.status) && device.lastUser
    ? `${device.lastUser?.fullName} (${grades[device.lastUser?.grade ?? 0]})`
    : "";
};
