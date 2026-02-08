import classNames from "classnames";
import { ReactNode } from "react";

export default function Tabs({ children }: { children?: ReactNode }) {
  return <div className="flex flex-row [&>*]:mr-2.5">{children}</div>;
}

interface TabProps {
  children: ReactNode;
  current?: boolean;
  onClick?: () => void;
}

function Tab({ current, onClick, children }: TabProps) {
  const className = classNames(
    "py-2 px-3 text-gray-500 text-sm leading-5 font-medium rounded-md cursor-pointer relative",
    "hover:bg-gray-100 hover:text-gray-700",
    {
      "!text-indigo-700 !bg-indigo-100": current,
    }
  );
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
