import { Icon } from "@blueprintjs/core";
import { Skeleton } from "@mui/material";
import React from "react";
import BadgeSkeleton from "../../../components/BadgeSkeleton";

export default function ErrorLogSkeleton({ rows = 1 }: { rows?: number }) {
  return (
    <div className="device-checkout-history-container">
      <div className="device-checkout-history-wrapper">
        {Array.from({ length: rows }).map((_, i) => (
          <ErrorSkeletonRow key={`skeleton-${i}`} />
        ))}
      </div>
    </div>
  );
}

const ErrorSkeletonRow = () => (
  <div className="device-checkout-history-row">
    <div>
      <div className="dchr-top">
        <div className="student-name">
          <Skeleton width="110px" sx={{ bgcolor: "#4f46e5" }} />
        </div>
        <BadgeSkeleton />
      </div>
      <div className="dchr-bottom">
        <div style={{ width: "100%" }}>
          <div style={{ marginBottom: 5, display: "flex" }}>
            <Icon icon="warning-sign" style={{ marginRight: 10 }} />
            <Skeleton width="75px" />
          </div>
          <div style={{ alignSelf: "center", display: "flex" }}>
            <Icon icon="horizontal-bar-chart-desc" style={{ marginRight: 10 }} />
            <Skeleton width="40%" />
          </div>
        </div>
        <div style={{ alignSelf: "center" }}>
          {/* <IconButton>
              <Icon icon="chevron-down" />
            </IconButton> */}
        </div>
      </div>
    </div>
  </div>
);
