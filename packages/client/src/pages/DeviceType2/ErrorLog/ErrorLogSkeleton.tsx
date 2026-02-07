import { ExclamationIcon, ChartBarIcon } from "@heroicons/react/solid";
import { Skeleton } from "../../../components/ui";
import React from "react";
import BadgeSkeleton from "../../../components/BadgeSkeleton";

export default function ErrorLogSkeleton({ rows = 1 }: { rows?: number }) {
  return (
    <div className="p-[15px]">
      <div className="shadow-[#d4d4d4_0px_0px_2px_1px] rounded-lg">
        {Array.from({ length: rows }).map((_, i) => (
          <ErrorSkeletonRow key={`skeleton-${i}`} />
        ))}
      </div>
    </div>
  );
}

const ErrorSkeletonRow = () => (
  <div className="p-5 [&:not(:last-child)]:border-b [&:not(:last-child)]:border-[#d4d4d4]">
    <div>
      <div className="flex justify-between mb-2.5">
        <div className="text-indigo-600 font-medium">
          <Skeleton width="110px" className="bg-indigo-600" />
        </div>
        <BadgeSkeleton />
      </div>
      <div className="flex justify-between text-[#bcc0d6]">
        <div style={{ width: "100%" }}>
          <div style={{ marginBottom: 5, display: "flex" }}>
            <ExclamationIcon className="h-5 w-5 mr-2.5" />
            <Skeleton width="75px" />
          </div>
          <div style={{ alignSelf: "center", display: "flex" }}>
            <ChartBarIcon className="h-5 w-5 mr-2.5" />
            <Skeleton width="40%" />
          </div>
        </div>
        <div style={{ alignSelf: "center" }}>
          {/* <IconButton>
              <Icon icon="chevron-down" />
            </IconButton> */}
        </div>
      </div>
    </div>
  </div>
);
