import { useMemo } from "react";
import { CheckoutLogModel } from "../../types/models/checkoutLogTypes";
import PaneHeader from "../../components/PaneHeader/PaneHeader";
import TablePaginate from "../../components/TablePaginate/TablePaginate";
import DeviceCheckoutStatusBadge, {
  CheckOutStatus,
} from "../../components/Badges/DeviceCheckoutStatusBadge";

interface CheckoutHistoryProps {
  checkouts: CheckoutLogModel[];
}

export default function CheckoutHistory({ checkouts }: CheckoutHistoryProps) {
  const columns = useMemo(
    () => [
      {
        Header: "Status",
        accessor: "checkedIn",
        Cell: ({ row: { original } }: { row: { original: CheckoutLogModel } }) => {
          let text: CheckOutStatus;
          original.checkedIn
            ? original.error
              ? (text = "Checked In /w Error")
              : (text = "Checked In")
            : (text = "Checked Out");
          return <DeviceCheckoutStatusBadge status={text} />;
        },
      },
      {
        Header: "Student",
        accessor: "deviceUser.fullName",
      },
      {
        Header: "Check Out",
        accessor: "checkOutDate",
        Cell: ({ row: { original } }: { row: { original: CheckoutLogModel } }) => {
          return new Date(original.checkOutDate).toLocaleString();
        },
      },
      {
        Header: "Check In",
        accessor: "checkInDate",
        Cell: ({ row: { original } }: { row: { original: CheckoutLogModel } }) => {
          return original.checkInDate ? new Date(original.checkInDate).toLocaleString() : "-";
        },
      },
    ],
    []
  );

  const data = useMemo(() => checkouts, [checkouts]);

  return (
    <div>
      <PaneHeader>Check Out History</PaneHeader>
      {checkouts.length > 0 ? (
        <TablePaginate
          data={data}
          columns={columns}
          pageSize={5}
          pageSizeOptions={[5, 10, 20]}
          enableRowsPicker={false}
        />
      ) : (
        "There is no data to display"
      )}
    </div>
  );
}
