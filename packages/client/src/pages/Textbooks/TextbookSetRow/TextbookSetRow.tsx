import Badge from "@/components/Badge/Badge";

interface Props {
  class: string;
  title: string;
  count: number;
  children?: React.ReactNode;
}

export default function TextbookSetRow(values: Props) {
  return (
    <div className="py-5 px-6">
      <span className="flex">
        <span
          style={{
            fontWeight: 500,
            marginRight: "0.5rem",
            maxWidth: 230,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {values.title}
        </span>
        <Badge text={String(values.count)} color="blue" noDot />
      </span>
      <div className="text-gray-400 text-[13px]">{values.class}</div>
    </div>
  );
}
