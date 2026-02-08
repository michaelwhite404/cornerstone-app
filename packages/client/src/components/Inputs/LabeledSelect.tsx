import React from "react";
import { Label, Select } from "../ui";
import type { SelectProps } from "../ui";

interface LabeledSelectProps extends SelectProps {
  label: string;
  required?: boolean;
}

export default function LabeledSelect({ label, required, ...props }: LabeledSelectProps) {
  return (
    <Label>
      <span style={{ fontWeight: 500 }}>
        {label}
        {required && <span style={{ marginLeft: 5, color: "red" }}>*</span>}
      </span>
      <Select fill {...props} />
    </Label>
  );
}
