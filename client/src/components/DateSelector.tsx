import { forwardRef, useEffect, useRef, useState } from "react";
import DatePicker from "sassy-datepicker";
import LabeledInput from "./Inputs/LabeledInput";
import "./DateSelector.sass";

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
  const inputRef = useRef<HTMLLabelElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);

  const { label, align = "right" } = props;

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, false);
    return () => {
      document.removeEventListener("click", handleClickOutside, false);
    };
  }, []);

  // @ts-ignore
  const handleClickOutside = (event) => {
    if (inputRef.current && inputRef.current?.contains(event.target)) {
      return setOpen(true);
    }

    if (pickerRef.current && !pickerRef.current?.contains(event.target)) {
      setOpen(false);
    }
  };

  const onDateSelect = (date: Date) => {
    setDate(date);
    setOpen(false);
    props.onChange?.(date);
  };

  const DateInput = forwardRef((props, ref) => {
    return (
      <LabeledInput
        label={label || "Change Date"}
        value={date.toLocaleDateString()}
        onFocus={() => setOpen(true)}
        readOnly
        style={{
          cursor: "pointer",
          boxShadow: open ? "inset 0 0 0 2px #2196f3" : undefined,
          padding: "20px 15px",
          borderRadius: 8,
        }}
      />
    );
  });

  const a = align === "left" ? { left: 0 } : { right: 0 };

  return (
    <div
      className={`date-selector ${props.fill ? "fill" : ""}`}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        justifyContent: "flex-end",
        position: "relative",
        zIndex: 10,
      }}
    >
      <DateInput ref={inputRef} />
      {open && (
        <DatePicker
          ref={pickerRef}
          value={date}
          // selected={date}
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
