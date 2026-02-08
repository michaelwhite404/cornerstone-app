import { SelectHTMLAttributes, forwardRef } from "react";
import classNames from "classnames";

interface SelectOption {
  label: string;
  value: string | number;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options?: SelectOption[];
  fill?: boolean;
  large?: boolean;
  small?: boolean;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ options, fill, large, small, className, children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={classNames(
          "block rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500",
          large ? "py-2.5 text-base" : small ? "py-1 text-xs" : "py-2 text-sm",
          fill && "w-full",
          className
        )}
        {...props}
      >
        {options
          ? options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))
          : children}
      </select>
    );
  }
);

Select.displayName = "Select";

export { Select };
export type { SelectProps, SelectOption };
