import { Skeleton } from "@mui/material";

export default function BadgeSkeleton({ width = 90 }: { width?: number }) {
  return (
    <div style={{ width, position: "relative" }}>
      <Skeleton
        variant="circular"
        width={6}
        height={6}
        sx={{ bgcolor: "grey.400", position: "absolute", left: 10, top: 7, zIndex: 10 }}
        animation={false}
      />
      <Skeleton
        variant="rectangular"
        width={width}
        height={20}
        sx={{
          borderRadius: 9999,
          marginRight: 0,
          bgcolor: "grey.100",
        }}
      />
    </div>
  );
}
