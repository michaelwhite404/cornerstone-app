import { InputHTMLAttributes, forwardRef, ReactNode } from "react";
import classNames from "classnames";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: ReactNode;
  rightElement?: ReactNode;
  fill?: boolean;
  large?: boolean;
  small?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ leftIcon, rightElement, fill, large, small, className, ...props }, ref) => {
    if (leftIcon || rightElement) {
      return (
        <div className={classNames("relative", fill && "w-full")}>
          {leftIcon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-gray-400 h-5 w-5">{leftIcon}</span>
            </div>
          )}
          <input
            ref={ref}
            className={classNames(
              "block rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500",
              leftIcon && "pl-10",
              rightElement && "pr-10",
              large ? "py-2.5 text-base" : small ? "py-1 text-xs" : "py-2 text-sm",
              fill && "w-full",
              className
            )}
            {...props}
          />
          {rightElement && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              {rightElement}
            </div>
          )}
        </div>
      );
    }

    return (
      <input
        ref={ref}
        className={classNames(
          "block rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500",
          large ? "py-2.5 text-base" : small ? "py-1 text-xs" : "py-2 text-sm",
          fill && "w-full",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };
export type { InputProps };
