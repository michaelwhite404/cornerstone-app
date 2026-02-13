import DevicePane from "../DevicePane";
import CheckoutLog from "../CheckoutLog";
import { CheckoutLogModel } from "../../../types/models/checkoutLogTypes";

export default function CheckoutLogSection({
  checkouts,
  showData,
  originalStatus,
}: {
  checkouts: CheckoutLogModel[];
  showData: boolean;
  originalStatus: "Available" | "Checked Out" | "Assigned" | "Broken" | "Not Available";
}) {
  return (
    <DevicePane heading="Check Out History">
      {showData ? (
        <CheckoutLog length={checkouts.length}>
          {checkouts.length
            ? checkouts.map((checkout) => (
                <CheckoutLog.Row checkout={checkout} key={checkout._id} />
              ))
            : "There is no data to display"}
        </CheckoutLog>
      ) : (
        <CheckoutLog.Skeleton rows={3} checkedOut={originalStatus === "Checked Out"} />
      )}
    </DevicePane>
  );
}
