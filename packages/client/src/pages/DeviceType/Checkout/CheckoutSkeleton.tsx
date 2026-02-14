import { SelectorIcon } from "@heroicons/react/solid";
import { Skeleton } from "@/components/ui";
import React from "react";

export default function CheckoutSkeleton() {
  return (
    <div className="w-1/3 p-[15px] flex flex-col items-start">
      <Skeleton width="60px" className="bg-gray-300 mb-1" />
      <div style={{ position: "relative" }}>
        <Skeleton
          width="130px"
          height={30}
          variant="rectangular"
          className="bg-gray-200 rounded-md"
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
    </div>
  );
}
