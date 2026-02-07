import { format } from "date-fns";
import { RM } from ".";
import ApprovalBadge from "../../../components/Badges/ApprovalBadge";
import TableWrapper from "../../../components/TableWrapper";
import { CalendarIcon, UserIcon } from "@heroicons/react/outline";

interface Props {
  reimbursements: RM[];
  select: (reimbursement: RM) => void;
}

export default function ApprovalsList(props: Props) {
  const { reimbursements, select } = props;
  return (
    <TableWrapper>
      <div className="sticky-header px-4 py-2">
        <span className="show-entry-label">Requests</span>
      </div>
      <div className="divide-y divide-gray-200">
        {reimbursements.map((reimbursement) => (
          <button
            key={reimbursement._id}
            className="block p-4 w-full"
            onClick={() => select(reimbursement)}
          >
            <div className="flex justify-between mb-2">
              <div className="font-medium text-blue-500 ">{reimbursement.purpose}</div>
              <div>
                <ApprovalBadge status={reimbursement.status} />
              </div>
            </div>
            <div className="flex justify-between align-center">
              <div className="text-left text-gray-400 font-light">
                <div className="flex mb-1 items-center">
                  <CalendarIcon className="mr-1" width={15} />{" "}
                  {format(new Date(reimbursement.date), "P")}
                </div>
                <div className="flex items-center">
                  <UserIcon className="mr-1" width={15} />
                  {reimbursement.user.fullName}
                </div>
              </div>
              <div className="text-gray-400 font-medium">
                {(reimbursement.amount / 100).toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </div>
            </div>
          </button>
        ))}
      </div>
    </TableWrapper>
  );
}
