import React from "react";
import { Label, Textarea } from "../ui";
import type { TextareaProps } from "../ui";

interface LabeledTextAreaProps extends TextareaProps {
  label: string;
  required?: boolean;
}

export default function LabeledTextArea({ label, required, ...props }: LabeledTextAreaProps) {
  return (
    <Label>
      <span style={{ fontWeight: 500 }}>
        {label}
        {required && <span style={{ marginLeft: 5, color: "red" }}>*</span>}
      </span>
      <Textarea {...props} />
    </Label>
  );
}
