import React, { ReactNode } from "react";

export default function MainContentHeader({ children, ...props }: { children?: ReactNode }) {
  return (
    <div className="main-content-header" {...props}>
      {children}
    </div>
  );
}
