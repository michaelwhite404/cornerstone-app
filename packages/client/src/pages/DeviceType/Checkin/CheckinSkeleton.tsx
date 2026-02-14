import { Skeleton } from "@/components/ui";
import { useWindowSize } from "@/hooks";

export default function CheckinSkeleton() {
  const [width] = useWindowSize();
  return (
    <>
      <div style={{ width: width > 650 ? "65%" : "100%" }}>
        <RadioSkeleton width="70%" />
        <RadioSkeleton width="40%" />
      </div>
      <div>
        <Skeleton variant="rectangular" height={42} width={175} className="rounded-lg" />
      </div>
    </>
  );
}

const RadioSkeleton = ({ width }: { width?: string | number }) => (
  <div style={{ display: "flex", marginBottom: 15 }}>
    <Skeleton variant="circular" width={16} height={16} className="mr-2.5" />
    <Skeleton variant="rectangular" width={width} className="rounded" />
  </div>
);
