import { Icon } from "@blueprintjs/core";
import { Skeleton } from "@mui/material";
import React from "react";

export default function CheckoutSkeleton() {
  return (
    <div className="device-checkout-box">
      <Skeleton width="60px" sx={{ bgcolor: "grey.400", marginBottom: "4px" }} />
      <div style={{ position: "relative" }}>
        <Skeleton
          width="130px"
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
    </div>
  );
}
