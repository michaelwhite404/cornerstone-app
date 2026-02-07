import { format } from "date-fns";
import Badge from "../../../components/Badge/Badge";
import TableWrapper from "../../../components/TableWrapper";
import { SignedOutEntry } from "../../../types/aftercareTypes";
import "./SessionsTable.sass";

export default function SessionsTable({ entries }: { entries: SignedOutEntry[] }) {
  const regular: SignedOutEntry[] = [];
  const dropIns: SignedOutEntry[] = [];

  entries.forEach((entry) => {
    const array = !entry.dropIn ? regular : dropIns;
    array.push(entry);
  });

  return (
    <TableWrapper>
      <table className="aftercare-session-table">
        <thead>
          <tr>
            <th>Student</th>
            <th className="hide-at-640">Time</th>
            <th style={{ width: 150 }}>Signature</th>
            <th className="hide-at-640" style={{ width: 150 }}></th>
          </tr>
        </thead>
        <tbody>
          {regular.map((entry) => (
            <EntryRow key={entry._id} entry={entry} />
          ))}
          {dropIns.length > 0 && (
            <tr>
              <td
                className="table-header"
                style={{ height: "auto", padding: "10px 15px" }}
                colSpan={4}
              >
                Drop Ins
              </td>
            </tr>
          )}
          {dropIns.map((entry) => (
            <EntryRow key={entry._id} entry={entry} />
          ))}
        </tbody>
      </table>
    </TableWrapper>
  );
}

function EntryRow({ entry }: { entry: SignedOutEntry }) {
  return (
    <tr style={{ borderBottom: "1px #e5e7eb solid" }} key={entry._id}>
      <td>
        <div>{entry.student.fullName}</div>
        <div className="show-at-640">
          <div
            style={{
              color: "gray",
              fontSize: 10,
              margin: "7px 0",
            }}
          >
            Time: {format(new Date(entry.signOutDate), "h:mm aa")}
          </div>
          {entry.lateSignOut && <Badge text="Late" color="red" />}
        </div>
      </td>
      <td className="hide-at-640">{format(new Date(entry.signOutDate), "h:mm aa")}</td>
      <td>
        <img className="sign-out-signature" src={`/images/${entry.signature}`} alt="signature" />
      </td>
      <td className="hide-at-640 late-td">
        {entry.lateSignOut && <Badge text="Late" color="red" />}
      </td>
    </tr>
  );
}
