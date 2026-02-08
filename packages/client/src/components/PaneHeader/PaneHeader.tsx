import { ReactNode } from "react";

export default function PaneHeader({ children }: { children: ReactNode }) {
  return (
    <h3 className="text-[rgb(49,113,179)] text-lg font-medium flex items-center justify-between">
      {children}
    </h3>
  );
}
