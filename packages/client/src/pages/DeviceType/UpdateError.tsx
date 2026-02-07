import { Button, HTMLSelect, Label, TextArea } from "@blueprintjs/core";
import Chip from "@mui/material/Chip";
import { AxiosError } from "axios";
import { useState } from "react";
import { DeviceModel } from "../../types/models/deviceTypes";
import { ErrorLogModel, ErrorStatus } from "../../types/models/errorLogTypes";
import PaneHeader from "../../components/PaneHeader/PaneHeader";
import { useToasterContext } from "../../hooks";
import { APIError } from "../../types/apiResponses";

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
}

export default function UpdateError({
  errors,
  updateDeviceError,
  onUpdateErrorSuccess,
}: UpdateErrorProps) {
  const [errorId, setErrorId] = useState(errors[0]._id);
  const [status, setStatus] = useState<ErrorStatus>();
  const [description, setDescription] = useState("");
  const { showToaster } = useToasterContext();

  const errorOptions = errors.map((e) => ({
    label: `${e.title} (${e.status})`,
    value: e._id,
  }));

  const statuses: ErrorStatus[] = ["Broken", "In Repair", "Fixed", "Unfixable"];

  const submittable = errorId && status && description.length > 0;
  const clearData = () => {
    setStatus(undefined);
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
      showToaster((err as AxiosError<APIError>).response!.data.message, "danger");
    }
  };

  return (
    <div>
      <PaneHeader>Update Device</PaneHeader>
      <div className="flex">
        <div>
          <div className="device-pane-child">
            <span style={{ fontWeight: 500, marginRight: 15 }}>Error To Update</span>
            <HTMLSelect
              options={errorOptions}
              value={errorId}
              onChange={(e) => setErrorId(e.target.value)}
            />
          </div>
          <div className="device-pane-child">
            <span style={{ fontWeight: 500, marginRight: 15 }}>Update Status</span>
            {statuses.map((s) => (
              <Chip
                label={s}
                variant={status === s ? "filled" : "outlined"}
                color={status === s ? "info" : "default"}
                onClick={() => {
                  setStatus(s);
                }}
                key={s}
                style={{ marginRight: 10 }}
              />
            ))}
            {status && ["Unfixable", "Fixed"].includes(status) && (
              <div className="pop-text">
                * Updating this error to '{status}' will finalize the error
              </div>
            )}
          </div>
        </div>
        <div style={{ paddingLeft: 30, width: "50%" }}>
          <div className="device-pane-child">
            <Label style={{ marginBottom: 7 }}>
              <span style={{ fontWeight: 500 }}>Description of Update</span>
              <TextArea
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
      <div style={{ textAlign: "right", paddingRight: 20 }}>
        <Button intent="primary" disabled={!submittable} onClick={handleClick}>
          Update Error
        </Button>
      </div>
    </div>
  );
}
