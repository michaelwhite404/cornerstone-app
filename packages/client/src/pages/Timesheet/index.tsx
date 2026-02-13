import { useState } from "react";
import { useTimesheet } from "../../api";
import { useAuth, useDocTitle } from "../../hooks";
import Slideover from "../../components/Slideover";
import Admin from "./Admin";
import CalendarPage from "./CalendarPage";
import ShowEntry from "./ShowEntry";

type PageState = "CALENDAR" | "ADMIN";

export default function Timesheet() {
  const user = useAuth().user!;
  useDocTitle("Timesheet | Cornerstone App");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [pageState, _setPageState] = useState<PageState>(
    user.departments?.some((d) => d.role === "LEADER") ? "ADMIN" : "CALENDAR"
  );
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);

  // Fetch entry when ID is set
  const { data: selectedEntry } = useTimesheet(selectedEntryId || "");

  const showTimesheetEntry = async (entryId: string) => {
    setSelectedEntryId(entryId);
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setSelectedEntryId(null);
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
