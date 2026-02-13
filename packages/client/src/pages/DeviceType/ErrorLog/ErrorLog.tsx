import classNames from "classnames";
import React, { ReactNode } from "react";
import ErrorLogRow from "./ErrorLogRow";
import ErrorLogSkeleton from "./ErrorLogSkeleton";

function ErrorLog({ children, length }: { children: ReactNode; length: number }) {
  return (
    <div className="p-[15px]">
      <div className={classNames("shadow-[#d4d4d4_0px_0px_2px_1px] rounded-lg", { "shadow-none": !length })}>
        {children}
      </div>
    </div>
  );
}

ErrorLog.Row = ErrorLogRow;
ErrorLog.Skeleton = ErrorLogSkeleton;

export default ErrorLog;
