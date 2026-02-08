import { ButtonHTMLAttributes, forwardRef, ReactNode } from "react";
import classNames from "classnames";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "minimal" | "success";
  size?: "sm" | "md" | "lg";
  icon?: ReactNode;
  rightIcon?: ReactNode;
  loading?: boolean;
  text?: string;
  fill?: boolean;
}

const variantClasses: Record<string, string> = {
  primary:
    "bg-blue-500 text-white hover:bg-blue-600 border border-transparent shadow-sm",
  secondary:
    "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 shadow-sm",
  danger:
    "bg-red-500 text-white hover:bg-red-600 border border-transparent shadow-sm",
  minimal:
    "bg-transparent text-gray-700 hover:bg-gray-100 border border-transparent",
  success:
    "bg-emerald-500 text-white hover:bg-emerald-600 border border-transparent shadow-sm",
};

const sizeClasses: Record<string, string> = {
  sm: "px-2.5 py-1.5 text-xs",
  md: "px-3 py-2 text-sm",
  lg: "px-4 py-2.5 text-base",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "secondary",
      size = "md",
      icon,
      rightIcon,
      loading,
      text,
      fill,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={classNames(
          "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
          variantClasses[variant],
          sizeClasses[size],
          fill && "w-full",
          (disabled || loading) && "opacity-50 cursor-not-allowed",
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {icon && <span className={classNames("shrink-0", (text || children) && "mr-2")}>{icon}</span>}
        {text || children}
        {rightIcon && <span className="ml-2 shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
export type { ButtonProps };
