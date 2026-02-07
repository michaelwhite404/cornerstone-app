import { ReactNode } from "react";
import classNames from "classnames";

export default function CheckoutBox({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={classNames("device-checkout-box", className?.split(" "))}>{children}</div>;
}
