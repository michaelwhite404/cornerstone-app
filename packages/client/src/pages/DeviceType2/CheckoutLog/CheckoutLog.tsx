import { ReactNode } from "react";
import CheckoutLogRow from "./CheckoutLogRow";
import classNames from "classnames";
import CheckoutLogSkeleton from "./CheckoutLogSkeleton";
import "./CheckoutLog.sass";

function CheckoutLog({ children, length }: { children: ReactNode; length: number }) {
  return (
    <div className="device-checkout-history-container">
      <div className={classNames("device-checkout-history-wrapper", { none: !length })}>
        {children}
      </div>
    </div>
  );
}

CheckoutLog.Row = CheckoutLogRow;
CheckoutLog.Skeleton = CheckoutLogSkeleton;

export default CheckoutLog;
