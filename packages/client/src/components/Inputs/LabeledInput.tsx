import { InputGroup, InputGroupProps2, Label } from "@blueprintjs/core";
import React from "react";

interface LabeledInputProps extends InputGroupProps2 {
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
      <InputGroup {...props} />
    </Label>
  );
}
