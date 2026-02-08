import classNames from "classnames";

interface DividerProps {
  orientation?: "horizontal" | "vertical";
  className?: string;
}

function Divider({ orientation = "horizontal", className }: DividerProps) {
  if (orientation === "vertical") {
    return <div className={classNames("inline-block w-px self-stretch bg-gray-200", className)} />;
  }
  return <hr className={classNames("border-gray-200", className)} />;
}

export { Divider };
export type { DividerProps };
