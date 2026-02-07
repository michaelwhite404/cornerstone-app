import axios, { AxiosError } from "axios";
import capitalize from "capitalize";
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { CheckoutLogModel } from "../../../types/models/checkoutLogTypes";
import DeviceCheckoutStatusBadge, {
  CheckOutStatus,
} from "../../../components/Badges/DeviceCheckoutStatusBadge";
import PageHeader from "../../../components/PageHeader";
import TablePaginate from "../../../components/TablePaginate/TablePaginate";
import { useDocTitle, useWindowSize } from "../../../hooks";
import { APICheckoutLogResponse, APIError } from "../../../types/apiResponses";
import "./DeviceLogs.sass";

export default function DeviceLogs() {
  const { deviceType } = useParams<{ deviceType: string }>();
  useDocTitle(`${capitalize(deviceType!)} Logs | Cornerstone App`);
  const windowHeight = useWindowSize()[1];
  const [deviceLogs, setDeviceLogs] = useState<CheckoutLogModel[]>([]);
  useEffect(() => {
    getDeviceLogs();
  }, []);

  async function getDeviceLogs() {
    try {
      const res = await axios.get<APICheckoutLogResponse>("/api/v2/devices/logs", {
        params: {
          sort: "-checkOutDate -checkInDate",
          limit: 10000,
        },
      });
      setDeviceLogs(res.data.data.deviceLogs);
    } catch (err) {
      console.log((err as AxiosError<APIError>).response!.data);
    }
  }

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

  const data = useMemo(() => deviceLogs, [deviceLogs]);

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
        data={data}
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
