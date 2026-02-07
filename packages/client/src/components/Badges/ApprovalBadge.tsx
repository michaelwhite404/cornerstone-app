import Badge from "../Badge/Badge";
import BadgeColor from "../Badge/BadgeColor";

export type ApprovalStatus = "Approved" | "Rejected" | "Pending";

const approvalStatusColor: { [x: string]: BadgeColor } = {
  Approved: "emerald",
  Rejected: "red",
  Pending: "yellow",
};

export default function ApprovalBadge({ status }: { status: ApprovalStatus }) {
  return <Badge color={approvalStatusColor[status]} text={status} />;
}
