import badgeColors from "./badgeColors";
import BadgeColor from "./BadgeColor";

export default function Badge({
  color,
  text,
  noDot = false,
}: {
  color: BadgeColor;
  text: string;
  noDot?: boolean;
}) {
  const getColor = (color: BadgeColor, fontWeight: 100 | 400 | 800) =>
    badgeColors[fontWeight][color];

  return (
    <span
      style={{ color: getColor(color, 800), backgroundColor: getColor(color, 100) }}
      className="inline-flex items-center py-0.5 px-2.5 rounded-full font-medium text-xs leading-4"
    >
      {!noDot && (
        <svg
          style={{ color: getColor(color, 400) }}
          className="mr-1.5 -ml-0.5 w-2 h-2"
          fill="currentColor"
          viewBox="0 0 8 8"
        >
          <circle cx="4" cy="4" r="3" />
        </svg>
      )}
      {text}
    </span>
  );
}
