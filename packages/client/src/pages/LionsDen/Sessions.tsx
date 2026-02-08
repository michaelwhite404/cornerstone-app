import { useEffect, useState } from "react";
import axios from "axios";
import SessionsTable from "./SessionsTable";

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
      <div className="text-lg font-medium mb-3">Session on {format(date, "LLLL d, yyyy")}</div>
      <div className="grid gap-[35px] grid-cols-[2fr_2fr_auto] mb-[25px] max-[640px]:grid-cols-1 max-[640px]:grid-rows-[repeat(3,1fr)] max-[640px]:gap-[15px]">
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
