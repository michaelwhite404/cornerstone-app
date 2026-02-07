import { ReactNode } from "react";


export default function DevicePane({
  heading,
  children,
}: {
  heading: string;
  children: ReactNode;
}) {
  return (
    <div className="p-5 max-[767px]:p-2.5">
      <h3 className="pl-[15px]">{heading}</h3>
      {children}
    </div>
  );
}
