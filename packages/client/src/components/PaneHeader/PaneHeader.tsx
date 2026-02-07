import { ReactNode } from "react";
import "./PaneHeader.sass";

export default function PaneHeader({ children }: { children: ReactNode }) {
  return <h3 className="pane-header">{children}</h3>;
}
