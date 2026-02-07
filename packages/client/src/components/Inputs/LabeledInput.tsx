import React from "react";
import { Input, Label } from "../ui";
import type { InputProps } from "../ui";

interface LabeledInputProps extends InputProps {
  label: string;
  required?: boolean;
}

export default function LabeledInput({ label, required, ...props }: LabeledInputProps) {
  return (
    <Label>
      <span style={{ fontWeight: 500 }}>
        {label}
        {required && <span style={{ marginLeft: 5, color: "red" }}>*</span>}
      </span>
      <Input fill {...props} />
    </Label>
  );
}
