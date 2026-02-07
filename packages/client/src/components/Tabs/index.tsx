import classNames from "classnames";
import { ReactNode } from "react";
import "./Tabs.sass";

export default function Tabs({ children }: { children?: ReactNode }) {
  return <div className="tabs">{children}</div>;
}

interface TabProps {
  children: ReactNode;
  current?: boolean;
  onClick?: () => void;
}

function Tab({ current, onClick, children }: TabProps) {
  const className = classNames("tab", { current });
  return (
    <div
      className={className}
      aria-current={current ? "page" : undefined}
      onClick={() => onClick?.()}
    >
      {children}
    </div>
  );
}

Tabs.Tab = Tab;
