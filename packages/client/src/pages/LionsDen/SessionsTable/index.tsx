import { format, parseISO } from "date-fns";
import Badge from "@/components/Badge/Badge";
import TableWrapper from "@/components/TableWrapper";
import { SignedOutEntry } from "@/types/aftercareTypes";

export default function SessionsTable({ entries }: { entries: SignedOutEntry[] }) {
  const regular: SignedOutEntry[] = [];
  const dropIns: SignedOutEntry[] = [];

  entries.forEach((entry) => {
    const array = !entry.dropIn ? regular : dropIns;
    array.push(entry);
  });

  return (
    <TableWrapper>
      <table className="relative">
        <thead>
          <tr>
            <th className="pl-[15px]">Student</th>
            <th className="max-[640px]:hidden">Time</th>
            <th style={{ width: 150 }}>Signature</th>
            <th className="max-[640px]:hidden" style={{ width: 150 }}></th>
          </tr>
        </thead>
        <tbody>
          {regular.map((entry) => (
            <EntryRow key={entry._id} entry={entry} />
          ))}
          {dropIns.length > 0 && (
            <tr>
              <td
                className="border-b border-gray-300 bg-[#f9f9fb] uppercase text-xs text-gray-400 font-medium tracking-wider text-left"
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
  console.log(entry);
  return (
    <tr style={{ borderBottom: "1px #e5e7eb solid" }} key={entry._id}>
      <td className="py-[7px] h-14 pl-[15px]">
        <div>{entry.student.fullName}</div>
        <div className="hidden max-[640px]:block">
          <div
            style={{
              color: "gray",
              fontSize: 10,
              margin: "7px 0",
            }}
          >
            Time: {format(parseISO(entry.signOutDate), "h:mm aa")}
          </div>
          {entry.lateSignOut && <Badge text="Late" color="red" />}
        </div>
      </td>
      <td className="max-[640px]:hidden py-[7px] h-14">
        {format(parseISO(entry.signOutDate), "h:mm aa")}
      </td>
      <td className="py-[7px] h-14">
        <img
          className="h-10 max-[640px]:w-[100px]"
          src={`/images/${entry.signature}`}
          alt="signature"
        />
      </td>
      <td className="max-[640px]:hidden text-center py-[7px] h-14">
        {entry.lateSignOut && <Badge text="Late" color="red" />}
      </td>
    </tr>
  );
}
