import { ReactNode } from "react";
import classNames from "classnames";

export default function CheckoutBox({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={classNames("w-1/3 p-[15px] flex flex-col items-start", className?.split(" "))}>{children}</div>;
}
