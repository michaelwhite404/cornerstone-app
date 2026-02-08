import classNames from "classnames";

interface SkeletonProps {
  variant?: "rectangular" | "circular" | "text";
  width?: number | string;
  height?: number | string;
  className?: string;
}

function Skeleton({ variant = "text", width, height, className }: SkeletonProps) {
  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === "number" ? `${width}px` : width;
  if (height) style.height = typeof height === "number" ? `${height}px` : height;

  return (
    <div
      className={classNames(
        "animate-pulse bg-gray-200",
        variant === "circular" && "rounded-full",
        variant === "rectangular" && "rounded",
        variant === "text" && "rounded h-4",
        className
      )}
      style={style}
    />
  );
}

export { Skeleton };
export type { SkeletonProps };
