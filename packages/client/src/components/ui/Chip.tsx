import { ReactNode } from "react";
import classNames from "classnames";

interface ChipProps {
  label: string;
  color?: "default" | "primary" | "success" | "danger" | "warning";
  size?: "sm" | "md";
  onDelete?: () => void;
  icon?: ReactNode;
  className?: string;
}

const colorClasses: Record<string, string> = {
  default: "bg-gray-100 text-gray-700",
  primary: "bg-blue-100 text-blue-700",
  success: "bg-emerald-100 text-emerald-700",
  danger: "bg-red-100 text-red-700",
  warning: "bg-yellow-100 text-yellow-800",
};

function Chip({ label, color = "default", size = "md", onDelete, icon, className }: ChipProps) {
  return (
    <span
      className={classNames(
        "inline-flex items-center rounded-full font-medium",
        colorClasses[color],
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-sm",
        className
      )}
    >
      {icon && <span className="mr-1 shrink-0">{icon}</span>}
      {label}
      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          className="ml-1 inline-flex shrink-0 items-center justify-center rounded-full p-0.5 hover:bg-black/10 focus:outline-none"
        >
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </span>
  );
}

export { Chip };
export type { ChipProps };
