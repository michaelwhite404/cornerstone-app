import { HTMLSelect, HTMLSelectProps, Label } from "@blueprintjs/core";
import React from "react";

interface LabeledSelectProps extends HTMLSelectProps {
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
      <HTMLSelect {...props} />
    </Label>
  );
}
