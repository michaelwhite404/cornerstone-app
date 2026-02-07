import React, { ReactNode } from "react";

export default function PageHeader({ text, children }: { text: string; children?: ReactNode }) {
  return (
    <div className="page-header">
      <h1 style={{ textTransform: "capitalize", marginBottom: "10px" }}>{text}</h1>
      {children}
    </div>
  );
}
