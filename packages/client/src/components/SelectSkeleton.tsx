import { Icon } from "@blueprintjs/core";
import { Skeleton } from "@mui/material";
import React from "react";

export default function SelectSkeleton({ width = "130px" }: { width?: string | number }) {
  return (
    <div style={{ position: "relative" }}>
      <Skeleton
        width={width}
        height={30}
        variant="rectangular"
        sx={{ bgcolor: "grey.200", borderRadius: "6px" }}
      />
      <Icon
        icon="double-caret-vertical"
        style={{
          position: "absolute",
          top: "50%",
          right: 5,
          transform: "translateY(-50%)",
        }}
        color="#cecccc"
      />
    </div>
  );
}
