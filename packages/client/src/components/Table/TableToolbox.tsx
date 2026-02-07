import { ReactNode } from "react";

export default function TableToolbox({ children }: { children?: ReactNode }) {
  return <div className="w-full min-h-[55px] bg-white border-b border-gray-300 flex items-center">{children}</div>;
}
