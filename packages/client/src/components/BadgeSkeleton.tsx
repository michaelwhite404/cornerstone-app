import { Skeleton } from "./ui";

export default function BadgeSkeleton({ width = 90 }: { width?: number }) {
  return (
    <div style={{ width, position: "relative" }}>
      <Skeleton
        variant="circular"
        width={6}
        height={6}
        className="absolute left-2.5 top-[7px] z-10"
      />
      <Skeleton
        variant="rectangular"
        width={width}
        height={20}
        className="rounded-full"
      />
    </div>
  );
}
