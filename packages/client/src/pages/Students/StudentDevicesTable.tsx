import capitalize from "capitalize";
import { StudentDevice } from "../../types/models";
import DeviceStatusBadge from "../../components/Badges/DeviceStatusBagde";
import TableWrapper from "../../components/TableWrapper";

interface Props {
  devices: StudentDevice[];
}

export default function StudentDevicesTable({ devices }: Props) {
  return (
    <TableWrapper>
      <table>
        <thead>
          <tr>
            <th className="pl-4 ">Name</th>
            <th className="hidden lg:table-cell">Brand</th>
            <th>Type</th>
            <th>Quality</th>
          </tr>
        </thead>
        <tbody>
          {devices.map((device, i) => (
            <tr className={i !== devices.length - 1 ? "border-b" : ""} key={device._id}>
              <td className="pl-4 pr-6 py-2.5 font-medium whitespace-nowrap">{device.name}</td>
              <td className="hidden lg:table-cell">{device.brand}</td>
              <td>{capitalize(device.deviceType)}</td>
              <td>
                <DeviceStatusBadge status={device.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableWrapper>
  );
}
