import React, { createContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useAuth, useDocTitle, useSocket } from "../../../hooks";
import { LeaveApproval, LeaveModel } from "../../../../../src/types/models";
import Detail from "./Detail";
import AddLeave from "./AddLeave";
import PrimaryButton from "../../../components/PrimaryButton/PrimaryButton";
import Tabs2, { TabOption } from "../../../components/Tabs2";
import MyLeaves from "./MyLeaves";
import { APILeaveResponse } from "../../../types/apiResponses";
import { useLocation } from "react-router-dom";
import { DocumentTextIcon } from "@heroicons/react/solid";
import ReportModal from "./ReportModal";

type PageState = "MY_LEAVES" | "APPROVALS" | "ALL";
const getStatus = (approval?: LeaveApproval): Leave["status"] =>
  approval ? (approval.approved ? "Approved" : "Rejected") : "Pending";

export interface Leave extends LeaveModel {
  selected: boolean;
  status: "Approved" | "Rejected" | "Pending";
}

interface Sort {
  key: string;
  order: "asc" | "desc";
}

interface SortContext {
  sort: Sort | null;
  setSort: React.Dispatch<React.SetStateAction<Sort | null>>;
}

export const LeavesSortContext = createContext({} as SortContext);

function Leaves() {
  useDocTitle("Leave Requests | Cornerstone App");
  const [pageState, setPageState] = useState<PageState>("MY_LEAVES");
  const [loaded, setLoaded] = useState(false);
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [sort, setSort] = useState<Sort | null>(null);
  const [slideOpen, setSlideOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const location = useLocation();
  const user = useAuth().user!;
  const socket = useSocket();

  useEffect(() => {
    const getLeaves = async () => {
      const leaveId = location.hash.replace("#", "");
      leaveId &&
        window.history.replaceState(
          "",
          document.title,
          window.location.pathname + window.location.search
        );

      setLoaded(false);
      const leaves = (await axios.get("/api/v2/leaves")).data.data.leaves as LeaveModel[];
      const l = leaves.map((leave) => ({
        ...leave,
        selected: leave._id === leaveId,
        status: getStatus(leave.approval),
      }));
      const selected = l.find((leave) => leave.selected);
      setLeaves(l);
      if (selected) {
        selected.sendTo._id === user._id &&
          selected.user._id !== user._id &&
          setPageState("APPROVALS");
        setSlideOpen(true);
      }
      setLoaded(true);
    };

    getLeaves();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleFinalize = (finalized: LeaveModel) => {
      const index = leaves.findIndex((r) => r._id === finalized._id);
      if (index === -1) return;
      const copy = [...leaves];
      const status = getStatus(finalized.approval);
      copy[index].approval = finalized.approval;
      copy[index].status = status;
      setLeaves(copy);
    };

    const handleSubmitted = (leave: LeaveModel) => {
      const copy = [...leaves];
      copy.unshift({ ...leave, selected: false, status: "Pending" });
      setLeaves(copy);
    };

    socket?.on("finalizeLeave", handleFinalize);
    socket?.on("submittedLeave", handleSubmitted);
    return () => {
      socket?.off("finalizeLeave", handleFinalize);
      socket?.off("submittedLeave", handleSubmitted);
    };
  }, [leaves, socket, user]);

  useEffect(() => {
    if (sort === null) return;
    setLeaves((leaves) => {
      const leavesCopy = [...leaves];
      const stringSort = (key: keyof Leave) => {
        return leavesCopy.sort((a, b) =>
          sort.order === "desc" ? b[key].localeCompare(a[key]) : a[key].localeCompare(b[key])
        );
      };
      switch (sort.key) {
        case "Leave":
          return stringSort("reason");
        case "From":
          return leavesCopy.sort((a, b) =>
            sort.order === "desc"
              ? b.user.fullName.localeCompare(a.user.fullName)
              : a.user.fullName.localeCompare(b.user.fullName)
          );
        case "Dates":
          return leavesCopy.sort((a, b) =>
            sort.order === "desc"
              ? new Date(b.dateStart).getTime() - new Date(a.dateStart).getTime()
              : new Date(a.dateStart).getTime() - new Date(b.dateStart).getTime()
          );
        case "Status":
          return stringSort("status");
        default:
          return leavesCopy;
      }
    });
  }, [sort]);

  const isLeader = user.departments?.some((d) => d.role === "LEADER") || false;
  const isInFinance = user.departments?.some((d) => d.name === "Finance") || false;
  const isSuperAdmin = user.role === "Super Admin";
  const canSeeAll = isInFinance || isSuperAdmin;
  const showTabs = isLeader || canSeeAll;
  const selected = leaves.find((leave) => leave.selected);

  const select = (r: Leave) => {
    const copy = [...leaves];
    const index = copy.findIndex((record) => record._id === r._id);
    if (index === -1) return;
    copy[index].selected = true;
    setLeaves(copy);
    setSlideOpen(true);
  };

  const finalizeLeave = async (id: string, approved: boolean) => {
    const res = await axios.post<APILeaveResponse>(`/api/v2/leaves/${id}/approve`, { approved });
    return res.data.data.leave;
  };

  const tabs = useMemo(() => {
    const tabs: TabOption<PageState>[] = [{ name: "My Leaves", value: "MY_LEAVES" }];
    isLeader &&
      tabs.push({
        name: "Approvals",
        value: "APPROVALS",
        count: leaves.filter((r) => r.sendTo._id === user._id && !r.approval).length,
      });
    canSeeAll &&
      tabs.push({
        name: "All",
        value: "ALL",
      });
    return tabs;
  }, [isLeader, canSeeAll, leaves, user._id]);

  return (
    <LeavesSortContext.Provider value={{ sort, setSort }}>
      <div className="relative h-[100vh]" style={{ padding: "10px 25px 25px" }}>
        <div className="sm:flex sm:justify-between  sm:align-center">
          <div className="page-header">
            <h1 style={{ textTransform: "capitalize", marginBottom: "10px" }}>Leave Requests</h1>
            <p>View and create leave requests</p>
          </div>
          <div className="flex justify-end sm:block sm:mt-4">
            <PrimaryButton
              className="w-full sm:w-auto"
              text="+ Create Leave"
              onClick={() => setModalOpen(true)}
            />
          </div>
        </div>
        {showTabs && (
          <div className="sm:mt-0 mt-3">
            <Tabs2 tabs={tabs} value={pageState} onChange={(tab) => setPageState(tab.value)} />
          </div>
        )}
        {/* Table Top */}
        <div className="w-full flex justify-end pt-4">
          <span className="isolate inline-flex rounded-md shadow-sm">
            {/* <button
              type="button"
              className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              Years
            </button>
            <button
              type="button"
              className="relative -ml-px inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              Months
            </button> */}
            {canSeeAll && (
              <button
                type="button"
                className="relative -ml-px inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                onClick={() => setReportOpen(true)}
              >
                <DocumentTextIcon className="-ml-1 mr-2 h-5 w-5 text-gray-400" />
                Generate Report
              </button>
            )}
          </span>
        </div>
        {/* Table Top End */}
        {loaded && (
          <>
            {pageState === "MY_LEAVES" && (
              <MyLeaves leaves={leaves.filter((l) => l.user._id === user._id)} select={select} />
            )}
            {isLeader && pageState === "APPROVALS" && (
              <MyLeaves leaves={leaves.filter((l) => l.sendTo._id === user._id)} select={select} />
            )}
            {canSeeAll && pageState === "ALL" && <MyLeaves leaves={leaves} select={select} />}
          </>
        )}
        <AddLeave open={modalOpen} setOpen={setModalOpen} setLeaves={setLeaves} />
        <Detail
          open={slideOpen}
          setOpen={setSlideOpen}
          selected={selected}
          setLeaves={setLeaves}
          user={user}
          finalizeLeave={finalizeLeave}
          getStatus={getStatus}
        />
        <ReportModal isOpen={reportOpen} closeModal={() => setReportOpen(false)} />
      </div>
    </LeavesSortContext.Provider>
  );
}

Leaves.Detail = Detail;

export default Leaves;
