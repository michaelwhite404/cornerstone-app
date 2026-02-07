import React from "react";
import TableWrapper from "../../../components/TableWrapper";
import { AttendanceEntry } from "../../../types/aftercareTypes";

export default function index({ entries }: { entries: AttendanceEntry[] }) {
  return (
    <TableWrapper>
      <table className="aftercare-session-table">
        <thead>
          <tr>
            <th>Student</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr style={{ borderBottom: "1px #e5e7eb solid" }} key={entry._id}>
              <td>{entry.student.fullName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableWrapper>
  );
}
