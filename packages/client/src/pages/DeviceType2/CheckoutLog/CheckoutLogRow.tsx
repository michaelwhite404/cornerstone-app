import { Icon } from "@blueprintjs/core";
import { CheckoutLogModel } from "../../../types/models/checkoutLogTypes";
import DeviceCheckoutStatusBadge from "../../../components/Badges/DeviceCheckoutStatusBadge";

export default function CheckoutLogRow({ checkout }: { checkout: CheckoutLogModel }) {
  return (
    <div className="device-checkout-history-row">
      <div className="dchr-top">
        <div className="student-name">{checkout.deviceUser.fullName}</div>
        <DeviceCheckoutStatusBadge status={checkout.status} />
      </div>
      <div className="dchr-bottom">
        <div>
          <div style={{ marginBottom: 5 }}>
            <Icon icon="calendar" style={{ marginRight: 5 }} />
            {new Date(checkout.checkOutDate).toLocaleDateString()}
          </div>
          <div>
            <Icon icon="endorsed" style={{ marginRight: 5 }} />
            {checkout.teacherCheckOut.fullName}
          </div>
        </div>
        {checkout.checkedIn && (
          <div style={{ textAlign: "right" }}>
            <div style={{ marginBottom: 5 }}>
              <Icon icon="calendar" style={{ marginRight: 5 }} />
              {new Date(checkout.checkInDate!).toLocaleDateString()}
            </div>
            <div>
              <Icon icon="endorsed" style={{ marginRight: 5 }} />
              {checkout.teacherCheckIn!.fullName}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
