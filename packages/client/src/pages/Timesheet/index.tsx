import axios from "axios";
import { useState } from "react";
import { TimesheetModel } from "../../types/models";
import { useAuth, useDocTitle } from "../../hooks";
import Slideover from "../../components/Slideover";
import Admin from "./Admin";
import CalendarPage from "./CalendarPage";
import ShowEntry from "./ShowEntry";

type PageState = "CALENDAR" | "ADMIN";

export default function Timesheet() {
  const user = useAuth().user!;
  useDocTitle("Timesheet | Cornerstone App");
  const [pageState, setPageState] = useState<PageState>(
    user.departments?.some((d) => d.role === "LEADER") ? "ADMIN" : "CALENDAR"
  );
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<TimesheetModel>();

  const showTimesheetEntry = async (entryId: string) => {
    const res = await axios.get(`/api/v2/timesheets/${entryId}`);
    setSelectedEntry(res.data.data.timesheetEntry);
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setSelectedEntry(undefined);
  };

  return (
    <>
      {pageState === "CALENDAR" && <CalendarPage showTimesheetEntry={showTimesheetEntry} />}
      {pageState === "ADMIN" && <Admin showTimesheetEntry={showTimesheetEntry} />}
      <Slideover open={drawerOpen} onOverlayClick={handleDrawerClose}>
        {selectedEntry && (
          <ShowEntry entry={selectedEntry} closeDrawer={() => setDrawerOpen(false)} />
        )}
      </Slideover>
    </>
  );
}
