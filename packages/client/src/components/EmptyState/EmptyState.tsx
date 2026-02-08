import React, { Fragment, ReactNode } from "react";
import FadeIn from "../FadeIn";

export default function EmptyState({
  children,
  fadeIn,
}: {
  children?: ReactNode;
  fadeIn?: boolean;
}) {
  const El = fadeIn ? FadeIn : Fragment;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <El>
        <div className="py-16 px-24 border-2 border-gray-200 border-dashed rounded-2xl">{children}</div>
      </El>
    </div>
  );
}
