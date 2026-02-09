import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { aftercareKeys, useAftercareSession } from "../../api";
import SessionsTable from "./SessionsTable";
import DateSelector from "../../components/DateSelector";
import SessionStat from "./SessionStat";
import { format } from "date-fns";
import { useSocket } from "../../hooks";
import { SignedOutEntry } from "../../types/aftercareTypes";

export default function Sessions() {
  const [date, setDate] = useState<Date>(new Date());
  const queryClient = useQueryClient();
  const { data: entries = [] } = useAftercareSession(date);
  const socket = useSocket();

  // Refetch when socket events occur
  useEffect(() => {
    const refetch = () => {
      queryClient.invalidateQueries({
        queryKey: aftercareKeys.sessionByDate(
          date.getFullYear(),
          date.getMonth() + 1,
          date.getDate()
        ),
      });
    };
    socket?.on("aftercareSignOutSuccess", refetch);
    return () => {
      socket?.off("aftercareSignOutSuccess", refetch);
    };
  }, [date, socket, queryClient]);

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
          <SessionsTable entries={entries as SignedOutEntry[]} />
        ) : (
          <span>There is no data to display</span>
        )}
      </div>
    </div>
  );
}
