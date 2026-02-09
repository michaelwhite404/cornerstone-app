import { Select } from "./Select";

interface GradeSelectProps {
  value: number;
  options: { value: string; label: string }[];
  onChange: (grade: number) => void;
  disabled?: boolean;
}

export function GradeSelect({ value, options, onChange, disabled }: GradeSelectProps) {
  return (
    <Select
      value={value}
      options={options}
      onChange={(e) => onChange(Number(e.target.value))}
      disabled={disabled}
    />
  );
}
