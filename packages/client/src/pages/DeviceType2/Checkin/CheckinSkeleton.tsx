import { Skeleton } from "@mui/material";
import { useWindowSize } from "../../../hooks";

export default function CheckinSkeleton() {
  const [width] = useWindowSize();
  return (
    <>
      <div style={{ width: width > 650 ? "65%" : "100%" }}>
        <RadioSkeleton width="70%" />
        <RadioSkeleton width="40%" />
      </div>
      <div className="device-checkin-right">
        <Skeleton variant="rectangular" height={42} width={175} sx={{ borderRadius: "7px" }} />
      </div>
    </>
  );
}

const RadioSkeleton = ({ width }: { width?: string | number }) => (
  <div style={{ display: "flex", marginBottom: 15 }}>
    <Skeleton variant="circular" width={16} height={16} sx={{ marginRight: "10px" }} />
    <Skeleton variant="rectangular" width={width} sx={{ borderRadius: "5px" }} />
  </div>
);
