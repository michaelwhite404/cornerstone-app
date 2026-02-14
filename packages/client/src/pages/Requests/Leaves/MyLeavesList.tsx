import { ArrowNarrowRightIcon } from "@heroicons/react/outline";
import { format } from "date-fns";
import { Leave } from ".";
import ApprovalBadge from "@/components/Badges/ApprovalBadge";
import TableWrapper from "@/components/TableWrapper";

interface Props {
  leaves: Leave[];
  select: (r: Leave) => void;
}

export default function MyLeavesList(props: Props) {
  const { leaves, select } = props;
  return (
    <TableWrapper>
      <div className="sticky top-0 z-[2] shadow-[0_-1px_#d1d5db_inset] border-b-0 px-4 py-2">
        <span className="mb-1 text-[#b6b4b4] font-medium tracking-wide text-xs uppercase">Requests</span>
      </div>
      <ul className="bg-white">
        {leaves.map((leave, i) => {
          const status = leave.approval
            ? leave.approval.approved
              ? "Approved"
              : "Rejected"
            : "Pending";
          return (
            <li
              key={leave._id}
              className={i !== leaves.length - 1 ? "border-b border-gray-200" : ""}
            >
              <div className="p-4 space-y-0.5" onClick={() => select(leave)}>
                <div className="text-gray-900 font-medium">{leave.reason}</div>
                <div className="text-gray-800">{leave.user.fullName}</div>
                {leave.comments && (
                  <div className="whitespace-nowrap overflow-hidden overflow-ellipsis">
                    {leave.comments}
                  </div>
                )}
                <div className="flex text-gray-400">
                  {format(new Date(leave.dateStart), "P")}
                  <ArrowNarrowRightIcon className="mx-2 w-4" />
                  {format(new Date(leave.dateEnd), "P")}
                </div>
                <div>
                  <div className="mt-2">
                    <ApprovalBadge status={status} />
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </TableWrapper>
  );
}
