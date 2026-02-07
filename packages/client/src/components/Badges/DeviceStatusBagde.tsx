import Badge from "../Badge/Badge";
import BadgeColor from "../Badge/BadgeColor";

type DeviceStatus = "Available" | "Checked Out" | "Assigned" | "Broken" | "Not Available";

const deviceStatusColor: { [x: string]: BadgeColor } = {
  Available: "emerald",
  "Checked Out": "red",
  Broken: "yellow",
  "Not Available": "blue",
  Assigned: "lime",
};

export default function DeviceStatusBadge({ status }: { status: DeviceStatus }) {
  return <Badge color={deviceStatusColor[status]} text={status} />;
}
