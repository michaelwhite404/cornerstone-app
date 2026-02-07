import classNames from "classnames";

interface ProgressBarProps {
  value?: number;
  intent?: "primary" | "success" | "danger" | "warning";
  className?: string;
  animate?: boolean;
}

const intentColors: Record<string, string> = {
  primary: "bg-blue-500",
  success: "bg-emerald-500",
  danger: "bg-red-500",
  warning: "bg-yellow-500",
};

function ProgressBar({ value = 0, intent = "primary", className, animate }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, value * 100));

  return (
    <div className={classNames("w-full bg-gray-200 rounded-full h-2 overflow-hidden", className)}>
      <div
        className={classNames(
          "h-full rounded-full transition-all duration-300",
          intentColors[intent],
          animate && "animate-pulse"
        )}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export { ProgressBar };
export type { ProgressBarProps };
