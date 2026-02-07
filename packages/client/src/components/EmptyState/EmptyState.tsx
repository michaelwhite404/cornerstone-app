import React, { Fragment, ReactNode } from "react";
import FadeIn from "../FadeIn";
import "./EmptyState.sass";

export default function EmptyState({
  children,
  fadeIn,
}: {
  children?: ReactNode;
  fadeIn?: boolean;
}) {
  const El = fadeIn ? FadeIn : Fragment;

  return (
    <div className="empty-state-container">
      <El>
        <div className="empty-state-border">{children}</div>
      </El>
    </div>
  );
}
