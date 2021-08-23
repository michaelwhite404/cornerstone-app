import axios from "axios";
import capitalize from "capitalize";
import pluralize from "pluralize";
import { useEffect, useMemo, useState } from "react";
import { Link, useRouteMatch } from "react-router-dom";
import { DeviceModel } from "../../../../src/types/models/deviceTypes";
import Badge, { BadgeColor } from "../../components/Badge/Badge";
import Table from "../../components/Table/Table";
import { useDocTitle, useWindowSize } from "../../hooks";

export default function DeviceType() {
  const { deviceType } = useRouteMatch<{ deviceType: string }>().params;
  useDocTitle(`${capitalize(deviceType)} | Cornerstone App`);

  const [width] = useWindowSize();
  const [devices, setDevices] = useState<DeviceModel[]>([]);

  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
        width: (width - 619) / 4,
        Cell: ({ row: { original } }: { row: { original: DeviceModel } }) => {
          return (
            <span style={{ display: "flex", alignItems: "center" }}>
              <img
                src={`/device-logos/${original.brand}-Logo.png`}
                alt={`${original.brand} Logo`}
                style={{ width: 30, marginRight: 10 }}
              />
              <Link to={`/devices/${deviceType}/${original.slug}`}>
                <span style={{ color: "black" }}>{original.name}</span>
              </Link>
            </span>
          );
        },
      },
      { Header: "Brand", accessor: "brand", width: (width - 619) / 4 },
      { Header: "Serial Number", accessor: "serialNumber", width: 275, minWidth: 275 },
      { Header: "MAC Address", accessor: "macAddress", width: (width - 619) / 4 },
      {
        Header: "Status",
        accessor: "status",
        width: (width - 619) / 4,
        Cell: ({ row: { original } }: { row: { original: DeviceModel } }) => {
          const { status } = original;
          const statusColor: { [x: string]: BadgeColor } = {
            Available: "green",
            "Checked Out": "red",
            Broken: "yellow",
            "Not Available": "blue",
          };
          return <Badge color={statusColor[status]} text={original.status} />;
        },
      },
    ],
    [deviceType, width]
  );
  const data = useMemo(() => devices, [devices]);
  useEffect(() => {
    getDevicesByType();

    async function getDevicesByType() {
      const res = await axios.get("/api/v2/devices", {
        params: {
          deviceType: pluralize.singular(deviceType),
          sort: "name",
          limit: 2000,
        },
      });
      setDevices(res.data.data.devices);
    }
  }, [deviceType]);

  return (
    <div>
      <div className="page-header">
        <h1 style={{ textTransform: "capitalize", marginBottom: "10px" }}>{deviceType}</h1>
      </div>
      <Table columns={columns} data={data} sortBy="name" />
    </div>
  );
}