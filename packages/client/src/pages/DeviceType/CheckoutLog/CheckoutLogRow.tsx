import { CalendarIcon, CheckCircleIcon } from "@heroicons/react/solid";
import { CheckoutLogModel } from "@/types/models/checkoutLogTypes";
import DeviceCheckoutStatusBadge from "@/components/Badges/DeviceCheckoutStatusBadge";

export default function CheckoutLogRow({ checkout }: { checkout: CheckoutLogModel }) {
  return (
    <div className="p-5 [&:not(:last-child)]:border-b [&:not(:last-child)]:border-[#d4d4d4]">
      <div className="flex justify-between mb-2.5">
        <div className="text-indigo-600 font-medium">{checkout.deviceUser.fullName}</div>
        <DeviceCheckoutStatusBadge status={checkout.status} />
      </div>
      <div className="flex justify-between text-[#bcc0d6]">
        <div>
          <div style={{ marginBottom: 5 }}>
            <CalendarIcon className="h-5 w-5 mr-1.5 inline" />
            {new Date(checkout.checkOutDate).toLocaleDateString()}
          </div>
          <div>
            <CheckCircleIcon className="h-5 w-5 mr-1.5 inline" />
            {checkout.teacherCheckOut.fullName}
          </div>
        </div>
        {checkout.checkedIn && (
          <div style={{ textAlign: "right" }}>
            <div style={{ marginBottom: 5 }}>
              <CalendarIcon className="h-5 w-5 mr-1.5 inline" />
              {new Date(checkout.checkInDate!).toLocaleDateString()}
            </div>
            <div>
              <CheckCircleIcon className="h-5 w-5 mr-1.5 inline" />
              {checkout.teacherCheckIn!.fullName}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
