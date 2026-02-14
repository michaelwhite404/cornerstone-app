import { useEffect, useRef, useState } from "react";
import DatePicker from "sassy-datepicker";
import LabeledInput2 from "./LabeledInput2";

interface DateSelectorProps {
  onChange?: (date: Date) => void;
  label?: string;
  maxDate?: Date;
  fill?: boolean;
  align?: "left" | "right";
}

export default function DateSelector(props: DateSelectorProps) {
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { label, align = "right" } = props;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close picker if click is outside the entire container
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside, false);
    return () => {
      document.removeEventListener("click", handleClickOutside, false);
    };
  }, []);

  const onDateSelect = (date: Date) => {
    setDate(date);
    setOpen(false);
    props.onChange?.(date);
  };

  const a = align === "left" ? { left: 0 } : { right: 0 };

  return (
    <div
      ref={containerRef}
      className={`date-selector ${props.fill ? "[&_label]:w-full" : ""}`}
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        position: "relative",
        zIndex: 10,
      }}
    >
      <LabeledInput2
        label={label || "Change Date"}
        value={date.toLocaleDateString()}
        onFocus={() => setOpen(true)}
        readOnly
        className="w-full"
        style={{
          cursor: "pointer",
          boxShadow: open ? "inset 0 0 0 2px #2196f3" : "0px 0px 2px #aeaeae",
        }}
      />
      {open && (
        <DatePicker
          onPointerEnterCapture={() => {}}
          onPointerLeaveCapture={() => {}}
          value={date}
          onChange={onDateSelect}
          maxDate={props.maxDate || new Date()}
          style={{
            position: "absolute",
            top: "100%",
            ...a,
          }}
        />
      )}
    </div>
  );
}
