import classNames from "classnames";
import React, { ReactNode } from "react";

export default function MainContentFooter({
  children,
  align,
  ...props
}: {
  children?: ReactNode;
  align?: "left" | "center" | "right";
}) {
  const alignClass =
    align === "left"
      ? "justify-start"
      : align === "center"
      ? "justify-center"
      : "justify-end";

  const className = classNames(
    "mt-auto py-3 px-6 items-center flex bg-white border-t border-[#e5e7eb]",
    alignClass
  );

  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
}
