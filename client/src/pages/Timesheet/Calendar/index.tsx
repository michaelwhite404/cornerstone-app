import { CalendarMonth } from "./Month";
import { CalendarWeek } from "./Week";
import { CalendarViewDropdown } from "./ViewDropdown";
import { DatePick } from "./DatePick";
import { WeekLine } from "./WeekLine";
import { useCallback, useEffect, useState } from "react";
import { CalendarEvent, CalendarView } from "../../../types/calendar";
import { endOfWeek, format, startOfWeek } from "date-fns";
import axios from "axios";
import { TimesheetModel } from "../../../../../src/types/models";
import { useAuth } from "../../../hooks";
import { start, end } from "../../../utils/startEnd";
import Month from "../../../types/month";
import "./Calendar.sass";

function Calendar(props: CalendarProps) {
  const [view, setView] = useState<CalendarView>("week");
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const { user } = useAuth();

  const { date, setDate, showTimesheetEntry } = props;
  const { month, year } = getMDY(date);

  const getTimesheetData = useCallback(async () => {
    const res = await axios.get("/api/v2/timesheets", {
      params: {
        "timeStart[gte]": start(date, view),
        "timeStart[lte]": end(date, view),
        employee: user?._id,
      },
    });
    const entries = res.data.data.timesheetEntries as TimesheetModel[];
    const events: CalendarEvent[] = entries.map((entry) => ({
      id: entry._id,
      description: entry.description,
      date: new Date(entry.timeStart),
      timeLabel: `${entry.hours} ${entry.hours === 1 ? "Hr" : "Hrs"}`,
      timeStart: new Date(entry.timeStart).toISOString(),
      timeEnd: new Date(entry.timeEnd).toISOString(),
    }));
    setEvents(events);
  }, [date, user?._id, view]);

  useEffect(() => {
    getTimesheetData();
  }, [getTimesheetData]);

  return (
    <div>
      <header className="xs:flex justify-between align-center my-4">
        <div className="font-medium">
          {view === "week" && formatWeekString(date)}
          {view === "month" && `${month} ${year}`}
        </div>
        <div className="flex md:space-x-3 align-center space-x-2 justify-end xs:m-0 mt-3 min-w-fit">
          <Calendar.DatePick view={view} setDate={setDate} />
          <div className="space-x-3 align-center flex">
            <Calendar.View view={view} setView={setView} />
          </div>
        </div>
      </header>
      {view === "month" && (
        <Calendar.Month
          // @ts-ignore
          month={month}
          year={year}
          events={events}
          onEntryClick={showTimesheetEntry}
        />
      )}
      {view === "week" && (
        <Calendar.Week
          date={date}
          setDate={setDate}
          events={events}
          onEntryClick={showTimesheetEntry}
        />
      )}
    </div>
  );
}

Calendar.Month = CalendarMonth;
Calendar.Week = CalendarWeek;
Calendar.View = CalendarViewDropdown;
Calendar.DatePick = DatePick;
Calendar.Line = WeekLine;
export default Calendar;

const getMDY = (date: Date) => {
  return {
    month: format(date, "LLLL") as Month,
    day: date.getDate(),
    year: date.getFullYear(),
  };
};

const formatWeekString = (date: Date) => {
  const start = startOfWeek(date);
  const end = endOfWeek(date);
  return start.getMonth() === end.getMonth()
    ? format(start, "LLLL y")
    : `${format(start, `LLLL ${start.getFullYear() !== end.getFullYear() ? "y" : ""}`)} - ${format(
        end,
        "LLLL y"
      )}`;
};

interface CalendarProps {
  showTimesheetEntry: (entryId: string) => Promise<void>;
  date: Date;
  setDate: React.Dispatch<React.SetStateAction<Date>>;
}
