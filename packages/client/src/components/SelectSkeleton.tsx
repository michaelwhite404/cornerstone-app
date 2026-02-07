import { SelectorIcon } from "@heroicons/react/solid";
import React from "react";
import { Skeleton } from "./ui";

export default function SelectSkeleton({ width = "130px" }: { width?: string | number }) {
  return (
    <div style={{ position: "relative" }}>
      <Skeleton
        variant="rectangular"
        width={width}
        height={30}
        className="rounded-md"
      />
      <SelectorIcon
        className="h-5 w-5 text-gray-300"
        style={{
          position: "absolute",
          top: "50%",
          right: 5,
          transform: "translateY(-50%)",
        }}
      />
    </div>
  );
}
