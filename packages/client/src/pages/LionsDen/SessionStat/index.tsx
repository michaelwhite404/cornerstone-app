import classNames from "classnames";
import { ReactNode } from "react";
import "./SessionStat.sass";

interface SessionStatProps {
  label: string;
  value: ReactNode;
  disable?: boolean;
}

export default function SessionStat(props: SessionStatProps) {
  const cName = classNames("session-stat", { disable: props.disable });
  return (
    <div className={cName}>
      <div className="session-stat_header">{props.label}</div>
      <div className="session-stat_value">{props.value}</div>
    </div>
  );
}
