import React, { ReactNode } from "react";

export default function MainContentInnerWrapper({ children }: { children?: ReactNode }) {
  return <div className="main-content-inner-wrapper">{children}</div>;
}
