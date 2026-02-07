import Badge from "../Badge/Badge";
import BadgeColor from "../Badge/BadgeColor";

export type CheckOutStatus = "Checked In" | "Checked Out" | "Checked In /w Error";

const checkoutStatusColor: { [x: string]: BadgeColor } = {
  "Checked In": "emerald",
  "Checked Out": "red",
  "Checked In /w Error": "yellow",
};

export default function DeviceCheckoutStatusBadge({ status }: { status: CheckOutStatus }) {
  return <Badge color={checkoutStatusColor[status]} text={status} />;
}
