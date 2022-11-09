import { ArrowNarrowRightIcon } from "@heroicons/react/outline";
import { format } from "date-fns";
import { Leave } from ".";
import ApprovalBadge from "../../../components/Badges/ApprovalBadge";
import TableWrapper from "../../../components/TableWrapper";

interface Props {
  leaves: Leave[];
  select: (leave: Leave) => void;
}

export default function MyLeavesTable(props: Props) {
  const { leaves, select } = props;
  return (
    <TableWrapper>
      <table>
        <thead>
          <tr>
            <th className="pl-6">Leave</th>
            <th>From</th>
            <th>Dates</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody className="text-gray-400 text-sm">
          {leaves.map((leave, i) => {
            const status = leave.approval
              ? leave.approval.approved
                ? "Approved"
                : "Rejected"
              : "Pending";
            return (
              <tr
                key={leave._id}
                className={i !== leaves.length - 1 ? "border-b border-gray-200" : ""}
              >
                <td className="pl-6 py-2 w-[30%]">
                  <div className="pr-6 md:w-[275px]">
                    <div
                      className="text-blue-500 font-medium cursor-pointer"
                      onClick={() => select(leave)}
                    >
                      {leave.reason}
                    </div>
                    {leave.comments && (
                      <div className="hidden md:block whitespace-nowrap overflow-hidden overflow-ellipsis">
                        {leave.comments}
                      </div>
                    )}
                  </div>
                </td>
                <td>{leave.user.fullName}</td>
                <td>
                  <div className="flex">
                    {format(new Date(leave.dateStart), "P")}
                    <ArrowNarrowRightIcon className="mx-2 w-4" />
                    {format(new Date(leave.dateEnd), "P")}
                  </div>
                </td>
                <td>
                  <ApprovalBadge status={status} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </TableWrapper>
  );
}
