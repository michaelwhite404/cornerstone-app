import { InputHTMLAttributes, forwardRef, useEffect, useRef } from "react";
import classNames from "classnames";

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  label?: string;
  indeterminate?: boolean;
  size?: "sm" | "md" | "lg";
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, indeterminate, size = "md", className, ...props }, forwardedRef) => {
    const innerRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      const el = (forwardedRef as React.RefObject<HTMLInputElement>)?.current || innerRef.current;
      if (el) {
        el.indeterminate = !!indeterminate;
      }
    }, [indeterminate, forwardedRef]);

    const sizeClass = size === "lg" ? "h-5 w-5" : size === "sm" ? "h-3 w-3" : "h-4 w-4";

    const checkbox = (
      <input
        ref={forwardedRef || innerRef}
        type="checkbox"
        className={classNames(
          "rounded border-gray-300 text-blue-500 focus:ring-blue-500",
          sizeClass,
          className
        )}
        {...props}
      />
    );

    if (label) {
      return (
        <label className="inline-flex items-center gap-2 cursor-pointer">
          {checkbox}
          <span className="text-sm text-gray-700">{label}</span>
        </label>
      );
    }

    return checkbox;
  }
);

Checkbox.displayName = "Checkbox";

export { Checkbox };
export type { CheckboxProps };
