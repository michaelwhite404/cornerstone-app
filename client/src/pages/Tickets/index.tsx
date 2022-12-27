import axios from "axios";
import React, { useEffect, useState } from "react";
import { TicketModel } from "../../../../src/types/models";
import EmptyStateIllustration from "../../components/EmptyStateIllustration";
import PrimaryButton from "../../components/PrimaryButton/PrimaryButton";
import { useDocTitle } from "../../hooks";
import CreateTicketModal from "./CreateTicketModal";
import MyTicketTable from "./MyTicketTable";
import TicketDetails from "./TicketDetails";

export default function Tickets() {
  useDocTitle("Tickets | Cornerstone App");
  const [tickets, setTickets] = useState<TicketModel[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fetchTickets = async () => {
      setLoaded(false);
      const res = await axios.get("/api/v2/tickets");
      setTickets(res.data.data.tickets);
      setLoaded(true);
    };
    fetchTickets();
  }, []);
  return (
    <div className="flex flex-col" style={{ padding: "10px 25px 25px" }}>
      <div className="sm:flex sm:justify-between align-center">
        {/* Header */}
        <div className="page-header">
          <h1 style={{ marginBottom: "10px" }}>Tickets</h1>
          {/* <p>Manage the team and account permissions here</p> */}
        </div>
        <PrimaryButton
          className="w-full sm:w-auto"
          text="+ Create New Ticket"
          onClick={() => setModalOpen(true)}
        />
      </div>
      {loaded && (
        <div className="relative">
          {tickets.length > 0 ? (
            <MyTicketTable tickets={tickets} />
          ) : (
            <EmptyStateIllustration
              imgSrc="/Helpdesk_Illustration.png"
              text="You don't have any tickets so far"
              xlWidth={"75%"}
            />
          )}
        </div>
      )}
      <CreateTicketModal open={modalOpen} setOpen={setModalOpen} />
    </div>
  );
}

Tickets.TicketDetails = TicketDetails;
