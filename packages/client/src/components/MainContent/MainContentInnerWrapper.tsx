import React, { ReactNode } from "react";

export default function MainContentInnerWrapper({ children }: { children?: ReactNode }) {
  return <div className="flex flex-col h-full">{children}</div>;
}
