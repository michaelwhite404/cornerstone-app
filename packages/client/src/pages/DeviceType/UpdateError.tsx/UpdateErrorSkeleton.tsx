import { Label, Skeleton } from "@/components/ui";
import SelectSkeleton from "@/components/SelectSkeleton";
import { useWindowSize } from "@/hooks";

export default function UpdateErrorSkeleton() {
  const [width] = useWindowSize();
  const Chips = () => (
    <>
      {[70, 80, 60, 75].map((chipWidth, i) => (
        <Skeleton
          variant="rectangular"
          width={`${chipWidth}px`}
          height="32px"
          className="rounded-full mr-2.5 bg-gray-300"
          key={`skeleton-chip-${i}`}
        />
      ))}
    </>
  );
  const StatusSelect = width > 500 ? Chips : SelectSkeleton;
  return (
    <>
      <div style={{ padding: 15 }}>
        <div>
          <div className="mb-[25px]">
            <span style={{ display: "flex" }}>
              <Skeleton
                variant="rectangular"
                width="100px"
                height="10px"
                className="bg-gray-300 mr-4 rounded self-center"
              />
              <SelectSkeleton />
            </span>
          </div>
          <div className="mb-[25px]" style={{ position: "relative" }}>
            <div style={{ display: "flex" }}>
              <span style={{ fontWeight: 500, marginRight: 15, alignSelf: "center" }}>
                <Skeleton
                  variant="rectangular"
                  width="100px"
                  height="10px"
                  className="bg-gray-300 mr-2.5 rounded self-center"
                />
              </span>
              <div style={{ display: "flex" }}>
                <StatusSelect />
              </div>
            </div>
          </div>
          <div className="mb-[25px]" style={{ marginTop: 35 }}>
            <Label style={{ marginBottom: 7 }}>
              <span style={{ fontWeight: 500 }}>
                <Skeleton width="125px" className="bg-gray-300 mb-1" />
              </span>
              <Skeleton
                variant="rectangular"
                width="100%"
                height="75px"
                className="rounded-lg"
              />
              <div style={{ display: "flex", justifyContent: "end", marginTop: "10px" }}>
                <Skeleton
                  variant="rectangular"
                  width={60}
                  height={15}
                  className="rounded bg-gray-400"
                />
              </div>
            </Label>
          </div>
        </div>
      </div>
      <div style={{ paddingRight: 15, display: "flex", justifyContent: "end" }}>
        <Skeleton variant="rectangular" width={110} height={30} className="rounded-lg" />
      </div>
    </>
  );
}
