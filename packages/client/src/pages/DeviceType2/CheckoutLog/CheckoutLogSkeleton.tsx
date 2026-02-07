import { Icon } from "@blueprintjs/core";
import { Skeleton } from "@mui/material";
import BadgeSkeleton from "../../../components/BadgeSkeleton";

export default function CheckoutLogSkeleton({
  rows = 3,
  checkedOut = false,
}: {
  rows?: number;
  checkedOut?: boolean;
}) {
  if (rows < 1) throw Error("Rows cannot be less than 1");
  return (
    <div className="device-checkout-history-container">
      <div className="device-checkout-history-wrapper">
        {Array.from({ length: rows }).map((_, i) => (
          <SkeletonRow checkedOut={i === 0 && checkedOut} key={`skeleton-row-${i}`} />
        ))}
      </div>
    </div>
  );
}

const SkeletonRow = ({ checkedOut = false }: { checkedOut?: boolean }) => (
  <div className="device-checkout-history-row">
    <div className="dchr-top">
      <div className="student-name">
        <Skeleton width="110px" sx={{ bgcolor: "#4f46e5" }} />
      </div>
      <BadgeSkeleton />
    </div>
    <div className="dchr-bottom">
      <div>
        <div style={{ marginBottom: 5, display: "flex" }}>
          <Icon icon="calendar" style={{ marginRight: 5 }} />
          <Skeleton width="75px" />
        </div>
        <div style={{ display: "flex" }}>
          <Icon icon="endorsed" style={{ marginRight: 5 }} />
          <Skeleton width="115px" />
        </div>
      </div>
      {!checkedOut && (
        <div style={{ textAlign: "right" }}>
          <div style={{ marginBottom: 5, display: "flex", justifyContent: "end" }}>
            <Icon icon="calendar" style={{ marginRight: 5 }} />
            <Skeleton width="75px" />
          </div>
          <div style={{ display: "flex" }}>
            <Icon icon="endorsed" style={{ marginRight: 5 }} />
            <Skeleton width="115px" />
          </div>
        </div>
      )}
    </div>
  </div>
);
