import classNames from "classnames";

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
  size?: "sm" | "md";
}

function Switch({ checked, onChange, label, disabled, className, size = "md" }: SwitchProps) {
  const trackSize = size === "sm" ? "h-5 w-9" : "h-6 w-11";
  const thumbSize = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";
  const translateOn = size === "sm" ? "translate-x-4" : "translate-x-6";

  return (
    <label
      className={classNames(
        "inline-flex items-center gap-2",
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
        className
      )}
    >
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={classNames(
          "relative inline-flex shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
          trackSize,
          checked ? "bg-blue-500" : "bg-gray-200"
        )}
      >
        <span
          aria-hidden="true"
          className={classNames(
            "pointer-events-none inline-block transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
            thumbSize,
            checked ? translateOn : "translate-x-0.5",
            "mt-[1px]"
          )}
        />
      </button>
      {label && <span className="text-sm text-gray-700">{label}</span>}
    </label>
  );
}

export { Switch };
export type { SwitchProps };
