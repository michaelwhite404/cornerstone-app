import { Label } from "@blueprintjs/core";
import { Skeleton } from "@mui/material";
import SelectSkeleton from "../../../components/SelectSkeleton";
import { useWindowSize } from "../../../hooks";

export default function UpdateErrorSkeleton() {
  const [width] = useWindowSize();
  const Chips = () => (
    <>
      {[70, 80, 60, 75].map((width, i) => (
        <Skeleton
          variant="rectangular"
          width={`${width}px`}
          height="32px"
          sx={{ borderRadius: "16px", marginRight: "10px" }}
          key={`skeleton-chip-${i}`}
        />
      ))}
    </>
  );
  const StatusSelect = width > 500 ? Chips : SelectSkeleton;
  return (
    <>
      <div style={{ padding: 15 }}>
        <div>
          <div className="device-pane-child">
            <span style={{ display: "flex" }}>
              <Skeleton
                variant="rectangular"
                width="100px"
                height="10px"
                sx={{
                  bgcolor: "grey.400",
                  marginRight: "15px",
                  borderRadius: "4px",
                  alignSelf: "center",
                }}
              />
              <SelectSkeleton />
            </span>
          </div>
          <div className="device-pane-child" style={{ position: "relative" }}>
            <div style={{ display: "flex" }}>
              <span style={{ fontWeight: 500, marginRight: 15, alignSelf: "center" }}>
                <Skeleton
                  variant="rectangular"
                  width="100px"
                  height="10px"
                  sx={{
                    bgcolor: "grey.400",
                    marginRight: "10px",
                    borderRadius: "4px",
                    alignSelf: "center",
                  }}
                />
              </span>
              <div style={{ display: "flex" }}>
                <StatusSelect />
              </div>
            </div>
          </div>
          <div className="device-pane-child" style={{ marginTop: 35 }}>
            <Label style={{ marginBottom: 7 }}>
              <span style={{ fontWeight: 500 }}>
                <Skeleton width="125px" sx={{ bgcolor: "grey.400", marginBottom: "4px" }} />
              </span>
              <Skeleton
                variant="rectangular"
                width="100%"
                height="75px"
                sx={{ borderRadius: "8px", textAlign: "right" }}
              />
              <div style={{ display: "flex", justifyContent: "end", marginTop: "10px" }}>
                <Skeleton
                  variant="rectangular"
                  width={60}
                  height={15}
                  sx={{ borderRadius: "5px", bgcolor: "grey.500" }}
                />
              </div>
            </Label>
          </div>
        </div>
      </div>
      <div style={{ paddingRight: 15, display: "flex", justifyContent: "end" }}>
        <Skeleton variant="rectangular" width={110} height={30} sx={{ borderRadius: "8px" }} />
      </div>
    </>
  );
}
