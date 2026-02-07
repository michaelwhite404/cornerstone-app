import { Label, NumericInput, NumericInputProps } from "@blueprintjs/core";

interface Props extends NumericInputProps {
  label: string;
  required?: boolean;
}

export default function LabeledNumbericInput({ label, required, ...props }: Props) {
  return (
    <Label>
      <span style={{ fontWeight: 500 }}>
        {label}
        {required && <span style={{ marginLeft: 5, color: "red" }}>*</span>}
      </span>
      <NumericInput {...props} />
    </Label>
  );
}
