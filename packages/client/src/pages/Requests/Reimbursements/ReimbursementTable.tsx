import { format } from "date-fns";
import { RM } from ".";
import ApprovalBadge from "../../../components/Badges/ApprovalBadge";
import TableWrapper from "../../../components/TableWrapper";

interface ReimbursementTableProps {
  reimbursements: RM[];
  select: (reimbursement: RM) => void;
}

export default function ReimbursementTable({ reimbursements, select }: ReimbursementTableProps) {
  return (
    <TableWrapper>
      <table>
        <thead>
          <tr>
            <th className="pl-8">Purpose</th>
            <th>Date</th>
            <th>Amount</th>
            <th>Approval</th>
          </tr>
        </thead>
        <tbody className="text-gray-400 text-sm">
          {reimbursements.map((reimbursement, i) => (
            <tr
              key={reimbursement._id}
              className={i !== reimbursements.length - 1 ? "border-b border-gray-200" : ""}
            >
              <td className="pl-8 text-blue-500 font-medium w-2/5">
                <div
                  className="cursor-pointer whitespace-nowrap overflow-hidden overflow-ellipsis max-w-[240px]"
                  onClick={() => select(reimbursement)}
                >
                  {reimbursement.purpose}
                </div>
              </td>
              <td className="py-1.5 w-40 text-gray-700">
                {format(new Date(reimbursement.date), "P")}
              </td>
              <td>
                {(reimbursement.amount / 100).toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </td>
              <td>
                <ApprovalBadge status={reimbursement.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableWrapper>
  );
}
