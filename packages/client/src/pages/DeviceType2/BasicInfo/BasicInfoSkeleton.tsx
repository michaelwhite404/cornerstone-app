import { Skeleton } from "@mui/material";

export default function BasicInfoSkeleton() {
  return (
    <div className="basic-info-card">
      <Skeleton width="33%" sx={{ bgcolor: "grey.400" }} />
      <Skeleton width="90%" />
    </div>
  );
}
