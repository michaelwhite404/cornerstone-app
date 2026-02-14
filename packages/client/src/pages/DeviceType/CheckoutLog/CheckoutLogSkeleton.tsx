import { CalendarIcon, CheckCircleIcon } from "@heroicons/react/solid";
import { Skeleton } from "@/components/ui";
import BadgeSkeleton from "@/components/BadgeSkeleton";

export default function CheckoutLogSkeleton({
  rows = 3,
  checkedOut = false,
}: {
  rows?: number;
  checkedOut?: boolean;
}) {
  if (rows < 1) throw Error("Rows cannot be less than 1");
  return (
    <div className="p-[15px]">
      <div className="shadow-[#d4d4d4_0px_0px_2px_1px] rounded-lg">
        {Array.from({ length: rows }).map((_, i) => (
          <SkeletonRow checkedOut={i === 0 && checkedOut} key={`skeleton-row-${i}`} />
        ))}
      </div>
    </div>
  );
}

const SkeletonRow = ({ checkedOut = false }: { checkedOut?: boolean }) => (
  <div className="p-5 [&:not(:last-child)]:border-b [&:not(:last-child)]:border-[#d4d4d4]">
    <div className="flex justify-between mb-2.5">
      <div className="text-indigo-600 font-medium">
        <Skeleton width="110px" className="bg-indigo-600" />
      </div>
      <BadgeSkeleton />
    </div>
    <div className="flex justify-between text-[#bcc0d6]">
      <div>
        <div style={{ marginBottom: 5, display: "flex" }}>
          <CalendarIcon className="h-5 w-5 mr-1.5" />
          <Skeleton width="75px" />
        </div>
        <div style={{ display: "flex" }}>
          <CheckCircleIcon className="h-5 w-5 mr-1.5" />
          <Skeleton width="115px" />
        </div>
      </div>
      {!checkedOut && (
        <div style={{ textAlign: "right" }}>
          <div style={{ marginBottom: 5, display: "flex", justifyContent: "end" }}>
            <CalendarIcon className="h-5 w-5 mr-1.5" />
            <Skeleton width="75px" />
          </div>
          <div style={{ display: "flex" }}>
            <CheckCircleIcon className="h-5 w-5 mr-1.5" />
            <Skeleton width="115px" />
          </div>
        </div>
      )}
    </div>
  </div>
);
