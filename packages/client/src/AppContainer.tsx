import { Outlet } from "react-router-dom";
import Div100vh from "react-div-100vh";
import { useEffect } from "react";
import DevTag from "./components/DevTag";
import Sidebar from "./components/Sidebar/Sidebar";
import Topbar from "./components/Topbar/Topbar";
import { useAuth, useSocket, useToasterContext, useWindowSize } from "./hooks";
import { LeaveModel, ReimbursementApproval, ReimbursementModel } from "./types/models";

export default function AppContainer() {
  const [width] = useWindowSize();
  const socket = useSocket();
  const user = useAuth().user!;
  const { showToaster } = useToasterContext();

  useEffect(() => {
    const getStatus = (approval?: ReimbursementApproval) =>
      approval ? (approval.approved ? "Approved" : "Rejected") : "Pending";

    socket?.on("finalizeReimbursement", (finalized: ReimbursementModel) => {
      if (user._id === finalized.user._id && user._id !== finalized.sendTo._id) {
        const status = getStatus(finalized.approval);
        showToaster(
          `Your reimbursement request for '${finalized.purpose}' has been ${status.toLowerCase()}`,
          status === "Approved" ? "success" : "danger"
        );
      }
    });
    socket?.on("finalizeLeave", (finalized: LeaveModel) => {
      if (user._id === finalized.user._id && user._id !== finalized.sendTo._id) {
        const status = getStatus(finalized.approval);
        showToaster(
          `Your leave request for '${finalized.reason}' has been ${status.toLowerCase()}`,
          status === "Approved" ? "success" : "danger"
        );
      }
    });
    socket?.on("submittedReimbursement", () =>
      showToaster("You have received a reimbusement request", "none", "envelope")
    );
    socket?.on("submittedLeave", () =>
      showToaster("You have received a leave request", "none", "envelope")
    );

    return () => {
      socket?.off("finalizeReimbursement");
      socket?.off("submittedReimbursement");
      socket?.off("submittedLeave");
    };
  }, [showToaster, socket, user._id]);

  return (
    <Div100vh className="flex overflow-hidden max-lg:flex-col">
      {width > 992 ? <Sidebar /> : <Topbar />}
      <div
        className="main-area-container"
        style={{
          backgroundColor: "#f9fcff",
          width: "100%",
          height: "100%",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        <Outlet />
      </div>
      {/* {process.env.NODE_ENV === "development" && <DevTag />} */}
    </Div100vh>
  );
}
