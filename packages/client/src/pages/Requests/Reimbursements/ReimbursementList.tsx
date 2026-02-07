import { format } from "date-fns";
import { RM } from ".";
import ApprovalBadge from "../../../components/Badges/ApprovalBadge";
import TableWrapper from "../../../components/TableWrapper";

interface ReimbursementListProps {
  reimbursements: RM[];
  select: (reimbursement: RM) => void;
}

export default function ReimbursementList({ reimbursements, select }: ReimbursementListProps) {
  return (
    <TableWrapper>
      <div className="sticky top-0 z-[2] shadow-[0_-1px_#d1d5db_inset] border-b-0 px-4 py-2">
        <span className="mb-1 text-[#b6b4b4] font-medium tracking-wide text-xs uppercase">Requests</span>
      </div>
      <ul className="bg-white">
        {reimbursements.map((reimbursement, i) => (
          <li key={reimbursement._id}>
            <button
              className={`w-full flex justify-between align-center p-4 ${
                i !== reimbursements.length - 1 ? "border-b border-gray-200" : ""
              }`}
              onClick={() => select(reimbursement)}
            >
              <div className="flex flex-col items-start">
                <div className="font-medium">{reimbursement.purpose}</div>
                <div className="text-gray-400 text-xs">
                  {format(new Date(reimbursement.date), "P")}
                </div>
                <div className="mt-1.5">
                  <ApprovalBadge status={reimbursement.status} />
                </div>
              </div>
              <div className="text-gray-500">
                {(reimbursement.amount / 100).toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </div>
            </button>
          </li>
        ))}
      </ul>
    </TableWrapper>
  );
}
