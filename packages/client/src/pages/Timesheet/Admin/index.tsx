import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { EmployeeModel } from "../../../types/models";
import MainContent from "../../../components/MainContent";
import PageHeader from "../../../components/PageHeader";
import SideTable from "../../../components/SideTable/SideTable";
import SideTableFilter from "../../../components/SideTable/SideTableFilter";
import { useWindowSize } from "../../../hooks";
import { APIUsersResponse } from "../../../types/apiResponses";
import PendingPage from "./PendingPage";
import UserPage from "./UserPage";

export default function Admin(props: Props) {
  const [viewState, setViewState] = useState("pending");
  const [users, setUsers] = useState<EmployeeModel[]>([]);
  const [selected, setSelected] = useState<EmployeeModel>();
  const width = useWindowSize()[0];
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const getTimesheetUsers = async () => {
      const res = await axios.get<APIUsersResponse>("/api/v2/users", {
        params: { timesheetEnabled: true },
      });
      setUsers(res.data.data.users);
    };
    getTimesheetUsers();
  }, []);

  const data = useMemo(() => users, [users]);
  const columns = useMemo(
    () => [
      { Header: "Full Name", accessor: "fullName" },
      { Header: "First Name", accessor: "firstName" },
      {
        Header: "Last Name",
        accessor: "lastName",
      },
      { Header: "Email", accessor: "email" },
      { Header: "Timesheet Enabled", accessor: "timesheetEnabled" },
      { Header: "Image", accessor: (original: any): string => original.image || "" },
      {
        Header: "First Letter",
        id: "firstLetter",
        accessor: ({ lastName }: { lastName: string }) => lastName[0].toUpperCase(),
      },
    ],
    []
  );

  const handleBack = () => {
    setViewState("pending");
    setSelected(undefined);
  };

  const handleSelection = (user: EmployeeModel) => {
    setSelected(user);
    setViewState("timesheet");
  };

  return (
    <div style={{ display: "flex", height: "100%" }}>
      {!(width < 768 && viewState !== "blank") && (
        <SideTable
          columns={columns}
          data={data}
          rowComponent={RowComponent}
          groupBy="firstLetter"
          onSelectionChange={handleSelection}
          selected={selected?._id || ""}
          filterValue={filter}
        >
          <div className="side-table-top">
            <PageHeader text="Timesheets" />
            <SideTableFilter value={filter} onChange={(value) => setFilter(value)} />
          </div>
        </SideTable>
      )}
      <MainContent>
        {viewState === "pending" && (
          <PendingPage
            showTimesheetEntry={props.showTimesheetEntry}
            finalizeTimesheet={finalizeTimesheet}
          />
        )}
        {viewState === "timesheet" && selected && (
          <UserPage
            onBack={handleBack}
            selected={selected}
            finalizeTimesheet={finalizeTimesheet}
            showTimesheetEntry={props.showTimesheetEntry}
          />
        )}
      </MainContent>
    </div>
  );
}

const RowComponent = (user: EmployeeModel) => {
  return (
    <div className="relative flex items-center space-x-3 px-6 py-5">
      <div className="flex-shrink-0">
        <img className="h-10 w-10 rounded-full" src={user.image} alt="" />
      </div>
      <div className="min-w-0 flex-1">
        <button className="focus:outline-none text-left">
          <span className="absolute inset-0" aria-hidden="true" />
          <p className="m-0 text-sm font-medium text-gray-900">{user.fullName}</p>
          <p className="m-0 truncate text-sm text-gray-500">{user.title}</p>
        </button>
      </div>
    </div>
  );
};

interface Props {
  showTimesheetEntry: (entryId: string) => Promise<void>;
}

const finalizeTimesheet = async (ids: string[], approve: boolean) => {
  const res = await axios.patch("/api/v2/timesheets/approve", {
    [approve ? "approve" : "reject"]: ids,
  });
  return res.data.data.message as string;
};
