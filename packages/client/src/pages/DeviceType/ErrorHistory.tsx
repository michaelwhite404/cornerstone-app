import { Button, Classes, Icon, TextArea } from "@blueprintjs/core";
import { AxiosError } from "axios";
import { useCallback, useMemo, useState } from "react";
import { UseExpandedRowProps } from "react-table";
import { DeviceModel } from "../../types/models/deviceTypes";
import { ErrorLogModel } from "../../types/models/errorLogTypes";
import DeviceErrorStatusBadge from "../../components/Badges/DeviceErrorStatusBadge";
import PaneHeader from "../../components/PaneHeader/PaneHeader";
import TableExpanded from "../../components/TableExpanded/TableExpanded";
import { useToasterContext } from "../../hooks";
import { APIError } from "../../types/apiResponses";
import "./ErrorHistory.sass";

interface ErrorHistoryProps {
  errors: ErrorLogModel[];
  createDeviceError: (data: { title: string; description: string }) => Promise<{
    errorLog: ErrorLogModel;
    device: DeviceModel;
  }>;
  onCreateErrorSuccess?: (data: { errorLog: ErrorLogModel; device: DeviceModel }) => any;
}

export default function ErrorHistory({
  errors,
  createDeviceError,
  onCreateErrorSuccess,
}: ErrorHistoryProps) {
  const [addingError, setAddingError] = useState(false);
  const [errorData, setErrorData] = useState({
    title: "",
    description: "",
  });
  const { showToaster } = useToasterContext();

  const columns = useMemo(
    () => [
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ row: { original } }: { row: { original: ErrorLogModel } }) => {
          return <DeviceErrorStatusBadge status={original.status} />;
        },
        width: 40,
      },
      {
        Header: "Title",
        accessor: "title",
        width: 40,
      },
      {
        Header: "Error Created Date",
        accessor: "createdAt",
        Cell: ({ row: { original } }: { row: { original: ErrorLogModel } }) => {
          return new Date(original.createdAt).toLocaleString();
        },
        width: 40,
      },
      {
        Header: "Description",
        accessor: "description",
        width: 40,
      },
      {
        // Make an expander cell
        Header: () => null, // No header
        id: "expander]", // It needs an ID
        Cell: ({ row }: { row: UseExpandedRowProps<object> }) => (
          // Use Cell to render an expander for each row.
          // We can use the getToggleRowExpandedProps prop-getter
          // to build the expander.
          <div>
            <span {...row.getToggleRowExpandedProps()}>
              <Icon icon={`chevron-${row.isExpanded ? "down" : "right"}`} size={18} color="black" />
            </span>
          </div>
        ),
        width: 40,
      },
    ] as any,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const data = useMemo(() => errors, [errors]);

  const updateText = (original: ErrorLogModel, index: number) =>
    original.final && index + 1 === original.updates.length
      ? "Final Update"
      : `Update ${index + 1}`;

  const renderRowSubComponent = useCallback(
    ({ original }: { original: ErrorLogModel }) => (
      <div className="error-info">
        <div className="error-basic-info">
          <div className="error-left">
            <div>Title: {original.title}</div>
            <div>Description: {original.description}</div>
          </div>
          <div className="error-right">
            <DeviceErrorStatusBadge status={original.status} />
          </div>
          <br />
        </div>
        <div style={{ color: "black" }}>
          {original.updates.length === 0 ? "There are no updates to show" : "Updates"}
        </div>
        <br />
        <div className="error-updates">
          {original.updates.map((update, i) => (
            <div className="error-single-update">
              <div className="error-left">
                <div> {`${updateText(original, i)}: ${update.description}`} </div>
                <div>{new Date(update.createdAt).toLocaleString()}</div>
              </div>
              <div className="error-right">
                <DeviceErrorStatusBadge status={update.status} />
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const newErrorSubmittable = Object.values(errorData).every((v) => v.length > 0);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement> & React.ChangeEventHandler<HTMLTextAreaElement>
  ) => {
    setErrorData({ ...errorData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (!newErrorSubmittable) return;
      const res = await createDeviceError(errorData);
      showToaster("Error added successfully", "success");
      setAddingError(false);
      setErrorData({ title: "", description: "" });
      onCreateErrorSuccess && onCreateErrorSuccess(res);
    } catch (err) {
      showToaster((err as AxiosError<APIError>).response!.data.message, "danger");
    }
  };

  return (
    <div>
      <PaneHeader>
        Error History
        {!addingError && (
          <Button icon="plus" intent="primary" onClick={() => setAddingError(true)}>
            Add Error
          </Button>
        )}
      </PaneHeader>
      {addingError && (
        <div style={{ width: "65%" }}>
          <div style={{ width: "75%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
              <label htmlFor="error-title">Title of Issue</label>
              <input
                className={Classes.INPUT}
                name="title"
                type="text"
                dir="auto"
                style={{ minWidth: "250px" }}
                onChange={handleInputChange}
                value={errorData.title}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
              <label htmlFor="error-description">Description of Issue</label>
              <TextArea
                style={{ minWidth: "250px", maxWidth: "250px", minHeight: "175px" }}
                name="description"
                value={errorData.description}
                // @ts-ignore
                onChange={handleInputChange}
              />
            </div>
            <div style={{ textAlign: "right" }}>
              <Button intent="danger" onClick={() => setAddingError(false)}>
                Cancel
              </Button>
              <Button
                intent="primary"
                style={{ marginLeft: 10 }}
                disabled={!newErrorSubmittable}
                onClick={handleSubmit}
              >
                Create New Error
              </Button>
            </div>
          </div>
        </div>
      )}
      {errors.length > 0 ? (
        <div className="flex">
          <TableExpanded
            columns={columns}
            data={data}
            renderRowSubComponent={renderRowSubComponent}
            className="error-history-table"
          />
        </div>
      ) : (
        "There is no data to display"
      )}
    </div>
  );
}
