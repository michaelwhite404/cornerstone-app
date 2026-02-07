import { useEffect, useState } from "react";
import axios from "axios";
import SessionsTable from "./SessionsTable";
import "./Sessions.sass";
import DateSelector from "../../components/DateSelector";
import SessionStat from "./SessionStat";
import { format } from "date-fns";
import { useSocket } from "../../hooks";

export default function Sessions() {
  const [entries, setEntries] = useState<any[]>([]);
  const [date, setDate] = useState<Date>(new Date());
  const socket = useSocket();

  const getSessions = async (date: Date) => {
    const res = await axios.get(
      `/api/v2/aftercare/attendance/year/${date.getFullYear()}/month/${
        date.getMonth() + 1
      }/day/${date.getDate()}`
    );
    setEntries(res.data.data.entries);
  };

  useEffect(() => {
    getSessions(date);
    socket?.on("aftercareSignOutSuccess", () => getSessions(date));
  }, [date, socket]);

  return (
    <div>
      <div className="session-header">Session on {format(date, "LLLL d, yyyy")}</div>
      <div className="session-stats-container">
        <SessionStat label="Total Students" value={entries.length} disable={!entries.length} />
        <SessionStat
          label="Drop Ins"
          value={entries.filter((e) => e.dropIn).length}
          disable={!entries.length}
        />
        <DateSelector onChange={setDate} />
      </div>
      <div>
        {entries.length > 0 ? (
          <SessionsTable entries={entries} />
        ) : (
          <span>There is no data to display</span>
        )}
      </div>
    </div>
  );
}
