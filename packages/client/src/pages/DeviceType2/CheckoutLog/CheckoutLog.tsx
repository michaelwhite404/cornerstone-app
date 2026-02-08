import { ReactNode } from "react";
import CheckoutLogRow from "./CheckoutLogRow";
import classNames from "classnames";
import CheckoutLogSkeleton from "./CheckoutLogSkeleton";


function CheckoutLog({ children, length }: { children: ReactNode; length: number }) {
  return (
    <div className="p-[15px]">
      <div className={classNames("shadow-[#d4d4d4_0px_0px_2px_1px] rounded-lg", { "shadow-none": !length })}>
        {children}
      </div>
    </div>
  );
}

CheckoutLog.Row = CheckoutLogRow;
CheckoutLog.Skeleton = CheckoutLogSkeleton;

export default CheckoutLog;
