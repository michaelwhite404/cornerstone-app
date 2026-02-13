import React from "react";
import { ErrorLogModel } from "../../../types/models/errorLogTypes";
import DevicePane from "../DevicePane";
import ErrorLog from "../ErrorLog";

function ErrorLogSection({ errors, showData }: { errors: ErrorLogModel[]; showData: boolean }) {
  return (
    <DevicePane heading="Error History">
      {showData ? (
        <ErrorLog length={errors.length}>
          {errors.length
            ? errors.map((error) => <ErrorLog.Row error={error} key={error._id} />)
            : "There is no data to display"}
        </ErrorLog>
      ) : (
        <ErrorLog.Skeleton />
      )}
    </DevicePane>
  );
}
export default ErrorLogSection;
