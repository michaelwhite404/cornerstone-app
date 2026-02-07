import Badge from "../Badge/Badge";
import BadgeColor from "../Badge/BadgeColor";
import { TextBookStatus } from "../../types/models/textbookTypes";

const textbookStatusColor: { [x: string]: BadgeColor } = {
  Available: "emerald",
  "Checked Out": "red",
  Replaced: "yellow",
  "Not Available": "blue",
};

export default function TextbookStatusBadge({ status }: { status: TextBookStatus }) {
  return <Badge color={textbookStatusColor[status]} text={status} />;
}
