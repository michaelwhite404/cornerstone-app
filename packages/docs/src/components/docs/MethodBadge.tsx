import { clsx } from "clsx";

interface MethodBadgeProps {
  method: string;
  size?: "sm" | "md";
  active?: boolean;
}

const methodColors: Record<string, { default: string; active: string }> = {
  get: {
    default: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
    active: "bg-emerald-600 text-white dark:bg-emerald-500",
  },
  post: {
    default: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
    active: "bg-blue-600 text-white dark:bg-blue-500",
  },
  put: {
    default: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
    active: "bg-amber-600 text-white dark:bg-amber-500",
  },
  patch: {
    default: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400",
    active: "bg-orange-600 text-white dark:bg-orange-500",
  },
  delete: {
    default: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
    active: "bg-red-600 text-white dark:bg-red-500",
  },
};

export function MethodBadge({ method, size = "md", active = false }: MethodBadgeProps) {
  const methodLower = method.toLowerCase();
  const colors = methodColors[methodLower] || { default: "bg-gray-100 text-gray-700", active: "bg-gray-600 text-white" };
  const colorClass = active ? colors.active : colors.default;

  return (
    <span
      className={clsx(
        "inline-flex items-center rounded font-bold uppercase tracking-wide",
        colorClass,
        size === "sm" ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-0.5 text-xs"
      )}
    >
      {method}
    </span>
  );
}
