import { Skeleton } from "../../../components/ui";

export default function BasicInfoSkeleton() {
  return (
    <div className="w-1/3 p-[15px]">
      <Skeleton width="33%" className="bg-gray-300" />
      <Skeleton width="90%" />
    </div>
  );
}
