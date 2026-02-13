import { Button, Select, Label, Textarea, Chip } from "../../../components/ui";
import React, { useState } from "react";
import { DeviceModel } from "../../../types/models/deviceTypes";
import { ErrorLogModel, ErrorStatus } from "../../../types/models/errorLogTypes";
import { useToasterContext, useWindowSize } from "../../../hooks";
import { getErrorMessage } from "../../../utils/getErrorMessage";
import DevicePane from "../DevicePane";
import UpdateErrorSkeleton from "../UpdateError.tsx/UpdateErrorSkeleton";

interface UpdateErrorPayload {
  status: string;
  description: string;
}

interface UpdateErrorProps {
  errors: ErrorLogModel[];
  updateDeviceError: (
    errorId: string,
    data: UpdateErrorPayload
  ) => Promise<{
    errorLog: ErrorLogModel;
    device: DeviceModel;
  }>;
  onUpdateErrorSuccess?: (data: { errorLog: ErrorLogModel; device: DeviceModel }) => any;
  showData: boolean;
}

export default function UpdateErrorSection({
  errors,
  updateDeviceError,
  onUpdateErrorSuccess,
  showData,
}: UpdateErrorProps) {
  const [errorId, setErrorId] = useState(errors[0]._id);
  const [status, setStatus] = useState<ErrorStatus | "">("");
  const [description, setDescription] = useState("");
  const { showToaster } = useToasterContext();
  const [width] = useWindowSize();

  const errorOptions = errors.map((e) => ({
    label: `${e.title} (${e.status})`,
    value: e._id,
  }));

  const statuses: ErrorStatus[] = ["Broken", "In Repair", "Fixed", "Unfixable"];

  const submittable = errorId && status.length > 0 && description.length > 0;
  const clearData = () => {
    setStatus("");
    setDescription("");
    setErrorId(errors[0]._id);
  };

  const handleClick = async () => {
    try {
      if (!submittable) return;
      const data = await updateDeviceError(errorId, { status: status!, description });
      clearData();
      showToaster("Error has been updated", "success");
      onUpdateErrorSuccess && onUpdateErrorSuccess(data);
    } catch (err) {
      showToaster(getErrorMessage(err), "danger");
    }
  };

  const StatusChips = () => (
    <>
      {statuses.map((s) => (
        <span
          key={s}
          onClick={() => {
            setStatus(s);
          }}
          className="cursor-pointer"
          style={{ marginRight: 10 }}
        >
          <Chip
            label={s}
            color={status === s ? "primary" : "default"}
          />
        </span>
      ))}
    </>
  );

  const StatusSelect = () => (
    <Select
      options={[{ label: "Choose a Status", value: "" }, ...statuses.map((s) => ({ label: s, value: s }))]}
      value={status}
      onChange={(e) => {
        setStatus(e.target.value as ErrorStatus);
      }}
    />
  );

  const StatusPicker = width > 500 ? StatusChips : StatusSelect;

  return (
    <DevicePane heading="Update Error">
      {showData ? (
        <>
          <div style={{ padding: 15 }}>
            <div>
              <div className="mb-[25px]" style={{ marginBottom: 10 }}>
                <span style={{ fontWeight: 500, marginRight: 15 }}>Error To Update</span>
                <Select
                  options={errorOptions}
                  value={errorId}
                  onChange={(e) => setErrorId(e.target.value)}
                />
              </div>
              <div className="mb-[25px]" style={{ position: "relative" }}>
                <span style={{ fontWeight: 500, marginRight: 15 }}>Update Status</span>
                <StatusPicker />
                {status && ["Unfixable", "Fixed"].includes(status) && (
                  <div className="text-[#0d09fe] italic text-xs font-light mt-[7px]" style={{ position: "absolute" }}>
                    * Updating this error to '{status}' will finalize the error
                  </div>
                )}
              </div>
              <div className="mb-[25px]" style={{ marginTop: 35 }}>
                <Label style={{ marginBottom: 7 }}>
                  <span style={{ fontWeight: 500 }}>Description of Update</span>
                  <Textarea
                    fill
                    style={{ marginTop: 10, minHeight: "75px", minWidth: "100%", maxWidth: "100%" }}
                    maxLength={500}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  <div style={{ textAlign: "right", marginTop: 5 }}>
                    <span>{description.length} / 500</span>
                  </div>
                </Label>
              </div>
            </div>
          </div>
          <div style={{ textAlign: "right", paddingRight: 15 }}>
            <Button variant="primary" disabled={!submittable} onClick={handleClick}>
              Update Error
            </Button>
          </div>
        </>
      ) : (
        <UpdateErrorSkeleton />
      )}
    </DevicePane>
  );
}
