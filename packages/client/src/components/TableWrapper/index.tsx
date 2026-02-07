import classNames from "classnames";
import { ReactNode } from "react";

export default function TableWrapper({
  children,
  overflow,
}: {
  children: ReactNode;
  overflow?: boolean;
}) {
  return (
    <div
      className={classNames(
        "mt-[15px] shadow-[0px_1px_20px_-3px_rgba(0,0,0,0.15)] rounded-lg w-full select-none",
        overflow ? "overflow-visible" : "overflow-hidden"
      )}
    >
      {children}
    </div>
  );
}
