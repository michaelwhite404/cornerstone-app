import axios from "axios";
import { useEffect, useState } from "react";
import { ReimbursementApproval, ReimbursementModel } from "../../../../../src/types/models";
import PrimaryButton from "../../../components/PrimaryButton/PrimaryButton";
import Tabs2 from "../../../components/Tabs2";
import { useAuth } from "../../../hooks";
import { APIReimbursementResponse } from "../../../types/apiResponses";
import AddReimbursement from "./AddReimbursement";
import Approvals from "./Approvals";
import Detail from "./Detail";
import MyReimbursements from "./MyReimbursements";

export interface RM extends ReimbursementModel {
  selected: boolean;
  status: "Approved" | "Rejected" | "Pending";
}

type PageState = "MY_REIMBURSEMENTS" | "APPROVALS";

export default function Reimbursements() {
  const [pageState, setPageState] = useState<PageState>("MY_REIMBURSEMENTS");
  const [reimbursements, setReimbursements] = useState<RM[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [slideOpen, setSlideOpen] = useState(false);
  const user = useAuth().user!;

  const getStatus = (approval?: ReimbursementApproval) =>
    approval ? (approval.approved ? "Approved" : "Rejected") : ("Pending" as RM["status"]);

  const fetchReimbursements = async () => {
    const reimbursements = (await axios.get("/api/v2/reimbursements")).data.data
      .reimbursements as ReimbursementModel[];
    const r = reimbursements.map((r) => ({
      ...r,
      selected: false,
      status: getStatus(r.approval),
    }));
    setReimbursements(r);
  };

  useEffect(() => {
    fetchReimbursements();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selected = reimbursements.find((r) => r.selected);

  const select = (r: RM) => {
    const copy = [...reimbursements];
    const index = copy.findIndex((record) => record._id === r._id);
    if (index === -1) return;
    copy[index].selected = true;
    setReimbursements(copy);
    setSlideOpen(true);
  };

  const finalizeReimbursement = async (id: string, approved: boolean) => {
    const res = await axios.post<APIReimbursementResponse>(`/api/v2/reimbursements/${id}/approve`, {
      approved,
    });
    return res.data.data.reimbursement;
  };

  const isLeader = user.departments?.some((d) => d.role === "LEADER");

  return (
    <div style={{ padding: "10px 25px 25px" }}>
      <div className="sm:flex sm:justify-between  sm:align-center">
        <div className="page-header">
          <h1 style={{ textTransform: "capitalize", marginBottom: "10px" }}>
            Reimbursement Requests
          </h1>
          <p>View and create reimbursement requests</p>
        </div>
        <div className="flex justify-end sm:block sm:mt-4">
          <PrimaryButton
            className="w-full sm:w-auto"
            text="+ Create Reimbursement"
            onClick={() => setModalOpen(true)}
          />
        </div>
      </div>
      {isLeader && (
        <div className="sm:mt-0 mt-3">
          <Tabs2
            tabs={[
              { name: "My Reimbursements", value: "MY_REIMBURSEMENTS" },
              { name: "Approvals", value: "APPROVALS" },
            ]}
            value={pageState}
            onChange={(tab) => setPageState(tab.value)}
          />
        </div>
      )}
      {pageState === "MY_REIMBURSEMENTS" ? (
        <MyReimbursements
          reimbursements={reimbursements.filter((r) => r.user._id === user._id)}
          select={select}
        />
      ) : (
        <Approvals reimbursements={reimbursements} select={select} user={user} />
      )}
      <AddReimbursement open={modalOpen} setOpen={setModalOpen} />
      <Detail
        open={slideOpen}
        setOpen={setSlideOpen}
        setReimbursements={setReimbursements}
        reimbursement={selected}
        user={user}
        finalizeReimbursement={finalizeReimbursement}
        getStatus={getStatus}
      />
    </div>
  );
}