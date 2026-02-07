import { Icon } from "@blueprintjs/core";
import { ClockIcon } from "@heroicons/react/solid";
import { IconButton } from "@mui/material";
import { format } from "date-fns";
import { ErrorLogModel } from "../../../types/models/errorLogTypes";
import DeviceErrorStatusBadge from "../../../components/Badges/DeviceErrorStatusBadge";
import { useToggle } from "../../../hooks";

export default function ErrorLogRow({ error }: { error: ErrorLogModel }) {
  const [open, toggle] = useToggle(false);
  return (
    <div className="device-checkout-history-row">
      <div>
        <div className="dchr-top">
          <div className="student-name">{error.title}</div>
          <DeviceErrorStatusBadge status={error.status} />
        </div>
        <div className="dchr-bottom">
          <div>
            <div style={{ marginBottom: 5 }}>
              <Icon icon="warning-sign" style={{ marginRight: 10 }} />
              {new Date(error.createdAt).toLocaleDateString()}
            </div>
            <div style={{ alignSelf: "center" }}>
              <Icon icon="horizontal-bar-chart-desc" style={{ marginRight: 10 }} />
              {error.description}
            </div>
          </div>
          <div style={{ alignSelf: "center" }}>
            <IconButton>
              <Icon icon={open ? "chevron-up" : "chevron-down"} onClick={toggle} />
            </IconButton>
          </div>
        </div>
      </div>
      {open && (
        <div>
          <div className="my-8" />
          {error.updates.length > 0 ? (
            <div className="space-y-5" style={{ color: "#bcc0d6" }}>
              {error.updates.map((update, i) => (
                <div className="">
                  <div className="font-medium">
                    <span className="text-indigo-600 mr-1">Update {i + 1}:</span>
                    <span className="text-gray-500">{update.description}</span>
                  </div>
                  <div className="flex mb-1">
                    <ClockIcon className="mr-1" width={15} fill="#4f46e5" />
                    {format(new Date(update.createdAt), "LLLL d, yyyy - h:m a")}
                  </div>
                  <div className="flex">{update.status}</div>
                </div>
              ))}
            </div>
          ) : (
            <span className="font-medium text-gray-500">There are no updates...... yet</span>
          )}
        </div>
      )}
    </div>
  );
}
