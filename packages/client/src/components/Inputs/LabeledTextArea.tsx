import { Label, TextArea, TextAreaProps } from "@blueprintjs/core";
import React from "react";

interface LabeledInputProps extends TextAreaProps {
  label: string;
  required?: boolean;
}

export default function LabeledTextArea({ label, required, ...props }: LabeledInputProps) {
  return (
    <Label>
      <span style={{ fontWeight: 500 }}>
        {label}
        {required && <span style={{ marginLeft: 5, color: "red" }}>*</span>}
      </span>
      <TextArea {...props} />
    </Label>
  );
}
