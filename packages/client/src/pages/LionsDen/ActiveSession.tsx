import { AttendanceEntry, SignedOutEntry } from "../../types/aftercareTypes";
import AwaitingPickupTable from "./AwaitingPickupTable";
import SessionsTable from "./SessionsTable";

export default function ActiveSession({ attendance }: { attendance: AttendanceEntry[] }) {
  const awaitingPickup: AttendanceEntry[] = [];
  const pickedUp: AttendanceEntry[] = [];

  attendance.forEach((entry) => {
    const array = entry.signOutDate ? pickedUp : awaitingPickup;
    array.push(entry);
  });

  return (
    <div>
      {awaitingPickup.length > 0 && (
        <div style={{ marginBottom: 25 }}>
          <div className="text-lg font-medium mb-3">Awaiting Pickup ({awaitingPickup.length})</div>
          <AwaitingPickupTable entries={awaitingPickup} />
        </div>
      )}
      {pickedUp.length > 0 && (
        <div>
          <div className="text-lg font-medium mb-3">Picked Up ({pickedUp.length})</div>
          <SessionsTable entries={pickedUp as SignedOutEntry[]} />
        </div>
      )}
    </div>
  );
}
