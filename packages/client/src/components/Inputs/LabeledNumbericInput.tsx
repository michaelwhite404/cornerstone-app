import React, { ChangeEvent, useCallback } from "react";
import { Input, Label } from "../ui";
import type { InputProps } from "../ui";

interface LabeledNumbericInputProps extends InputProps {
  label: string;
  required?: boolean;
  /** BlueprintJS compat: called with (valueAsNumber, valueAsString, inputElement) */
  onValueChange?: (valueAsNumber: number, valueAsString: string, inputElement: HTMLInputElement | null) => void;
  /** BlueprintJS compat: ignored, type="number" already restricts input */
  allowNumericCharactersOnly?: boolean;
}

export default function LabeledNumbericInput({
  label,
  required,
  onValueChange,
  allowNumericCharactersOnly,
  onChange,
  ...props
}: LabeledNumbericInputProps) {
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (onValueChange) {
        onValueChange(e.target.valueAsNumber, e.target.value, e.target);
      }
      if (onChange) {
        onChange(e);
      }
    },
    [onValueChange, onChange]
  );

  return (
    <Label>
      <span style={{ fontWeight: 500 }}>
        {label}
        {required && <span style={{ marginLeft: 5, color: "red" }}>*</span>}
      </span>
      <Input type="number" onChange={handleChange} {...props} />
    </Label>
  );
}
