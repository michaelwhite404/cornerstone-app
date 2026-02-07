import classNames from "classnames";
import React, { ReactNode } from "react";
import ErrorLogRow from "./ErrorLogRow";
import ErrorLogSkeleton from "./ErrorLogSkeleton";

function ErrorLog({ children, length }: { children: ReactNode; length: number }) {
  return (
    <div className="device-checkout-history-container">
      <div className={classNames("device-checkout-history-wrapper", { none: !length })}>
        {children}
      </div>
    </div>
  );
}

ErrorLog.Row = ErrorLogRow;
ErrorLog.Skeleton = ErrorLogSkeleton;

export default ErrorLog;
