import Badge from "../Badge/Badge";
import BadgeColor from "../Badge/BadgeColor";

type DeviceErrorStatus = "Fixed" | "Broken" | "In Repair" | "Unfixable";

const deviceErrorStatusColor: { [x: string]: BadgeColor } = {
  Fixed: "emerald",
  Broken: "red",
  "In Repair": "yellow",
  Unfixable: "fuchsia",
};

export default function DeviceErrorStatusBadge({ status }: { status: DeviceErrorStatus }) {
  return <Badge color={deviceErrorStatusColor[status]} text={status} />;
}
