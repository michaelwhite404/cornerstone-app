import { Select } from "./Select";

interface StudentSelectProps {
  value: string;
  options: { value: string; label: string }[];
  onChange: (studentId: string) => void;
  disabled?: boolean;
}

export function StudentSelect({ value, options, onChange, disabled }: StudentSelectProps) {
  return (
    <Select
      value={value}
      options={options}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
    />
  );
}
