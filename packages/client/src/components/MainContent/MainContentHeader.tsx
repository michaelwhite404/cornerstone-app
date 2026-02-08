import React, { ReactNode } from "react";

export default function MainContentHeader({ children, ...props }: { children?: ReactNode }) {
  return (
    <div
      className="py-3 px-6 items-center flex justify-between bg-white border-b border-gray-200 sticky top-0 z-50 max-[379px]:flex-wrap"
      {...props}
    >
      {children}
    </div>
  );
}
