import { ReactNode } from "react";

export default function TableToolbox({ children }: { children?: ReactNode }) {
  return <div className="table-toolbox">{children}</div>;
}
