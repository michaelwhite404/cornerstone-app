import Badge from "../Badge/Badge";
import BadgeColor from "../Badge/BadgeColor";
import { TextbookQuality } from "../../types/models/textbookTypes";

const textbookQualityColor: { [x: string]: BadgeColor } = {
  Excellent: "teal",
  Good: "lime",
  Acceptable: "sky",
  Poor: "fuchsia",
  Lost: "gray",
};

export default function TextbookQualityBadge({ quality }: { quality: TextbookQuality }) {
  return <Badge color={textbookQualityColor[quality]} text={quality} />;
}
