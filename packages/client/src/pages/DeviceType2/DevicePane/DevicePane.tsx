import { ReactNode } from "react";
import "./DevicePane.sass";

export default function DevicePane({
  heading,
  children,
}: {
  heading: string;
  children: ReactNode;
}) {
  return (
    <div className="device-pane">
      <h3 className="device-pane-heading">{heading}</h3>
      {children}
    </div>
  );
}
