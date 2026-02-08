import capitalize from "capitalize";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { CheckoutLogModel } from "../../../types/models/checkoutLogTypes";
import { useDeviceLogs } from "../../../api";
import DeviceCheckoutStatusBadge, {
  CheckOutStatus,
} from "../../../components/Badges/DeviceCheckoutStatusBadge";
import PageHeader from "../../../components/PageHeader";
import TablePaginate from "../../../components/TablePaginate/TablePaginate";
import { useDocTitle, useWindowSize } from "../../../hooks";


export default function DeviceLogs() {
  const { deviceType } = useParams<{ deviceType: string }>();
  useDocTitle(`${capitalize(deviceType!)} Logs | Cornerstone App`);
  const windowHeight = useWindowSize()[1];
  const { data: deviceLogs = [] } = useDeviceLogs();

  const columns = useMemo(
    () => [
      {
        Header: "Device",
        accessor: "device.name",
      },
      {
        Header: "Status",
        accessor: "checkedIn",
        Cell: ({ row: { original } }: { row: { original: CheckoutLogModel } }) => {
          let text: CheckOutStatus;
          original.checkedIn
            ? original.error
              ? (text = "Checked In /w Error")
              : (text = "Checked In")
            : (text = "Checked Out");
          return <DeviceCheckoutStatusBadge status={text} />;
        },
      },
      {
        Header: "Student",
        accessor: "deviceUser.fullName",
      },
      {
        Header: "Check Out Date",
        accessor: "checkOutDate",
        Cell: ({ row: { original } }: { row: { original: CheckoutLogModel } }) => {
          return new Date(original.checkOutDate).toLocaleString();
        },
      },
      {
        Header: "Teacher Check Out",
        accessor: "teacherCheckOut.fullName",
      },
      {
        Header: "Check In",
        accessor: "checkInDate",
        Cell: ({ row: { original } }: { row: { original: CheckoutLogModel } }) => {
          return original.checkInDate ? new Date(original.checkInDate).toLocaleString() : "-";
        },
      },
      {
        Header: "Teacher Check In",
        accessor: "teacherCheckIn.fullName",
      },
    ],
    []
  );

  // const getCsv = async () => {
  //   await axios.get("http://localhost:8080/csv/device-logs");
  // };
  //
  // const ActionsMenu = (
  //   <Menu className="custom-pop">
  //     <MenuItem icon="export" text="Export (csv)" onClick={getCsv} />
  //   </Menu>
  // );

  return (
    <>
      <PageHeader text={`${deviceType} Logs`}>
        {/* <Popover2 content={ActionsMenu} placement="bottom-end" className="menu-popover">
          <Button icon="settings" text="Actions" large />
        </Popover2> */}
      </PageHeader>
      <TablePaginate
        data={deviceLogs}
        columns={columns}
        pageSize={25}
        pageSizeOptions={[25, 50, 100]}
        enableRowsPicker
        height={windowHeight - 100}
        id="device-logs-table"
      />
    </>
  );
}
