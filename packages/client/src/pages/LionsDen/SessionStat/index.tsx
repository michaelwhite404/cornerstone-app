import classNames from "classnames";
import { ReactNode } from "react";

interface SessionStatProps {
  label: string;
  value: ReactNode;
  disable?: boolean;
}

export default function SessionStat(props: SessionStatProps) {
  const cName = classNames("bg-white shadow-[0px_1px_2px_1px_rgba(0,0,0,0.1)] w-[95%] p-5 rounded-md", { "bg-[#ebebeb]": props.disable });
  return (
    <div className={cName}>
      <div className="text-[15px] text-gray-500 mb-[5px]">{props.label}</div>
      <div className="font-semibold text-gray-900 text-3xl">{props.value}</div>
    </div>
  );
}
