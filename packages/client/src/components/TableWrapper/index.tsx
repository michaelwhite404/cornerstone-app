import classNames from "classnames";
import { ReactNode } from "react";
import "./TableWrapper.sass";

export default function TableWrapper({
  children,
  overflow,
}: {
  children: ReactNode;
  overflow?: boolean;
}) {
  return (
    <div className={classNames("table-wrapper", overflow ? "overflow-visible" : "overflow-hidden")}>
      {children}
    </div>
  );
}
