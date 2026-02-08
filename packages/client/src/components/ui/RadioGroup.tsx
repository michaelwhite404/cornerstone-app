import { ReactNode } from "react";
import classNames from "classnames";

interface RadioOption {
  label: string;
  value: string;
  disabled?: boolean;
}

interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  value?: string;
  onChange: (value: string) => void;
  label?: string;
  inline?: boolean;
  className?: string;
  children?: ReactNode;
}

function RadioGroup({
  name,
  options,
  value,
  onChange,
  label,
  inline,
  className,
}: RadioGroupProps) {
  return (
    <fieldset className={className}>
      {label && (
        <legend className="text-sm font-medium text-gray-700 mb-2">{label}</legend>
      )}
      <div className={classNames("gap-3", inline ? "flex flex-wrap" : "flex flex-col")}>
        {options.map((option) => (
          <label
            key={option.value}
            className={classNames(
              "inline-flex items-center gap-2 cursor-pointer",
              option.disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              disabled={option.disabled}
              className="border-gray-300 text-blue-500 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export { RadioGroup };
export type { RadioGroupProps, RadioOption };
