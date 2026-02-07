import classNames from "classnames";
import { format } from "date-fns";
import React from "react";
import { RM } from ".";
import ApprovalBadge from "../../../components/Badges/ApprovalBadge";
import TableWrapper from "../../../components/TableWrapper";

const headings = ["Purpose", "Date", "Amount", "Submitted By", "Status"];

interface Props {
  reimbursements: RM[];
  select: (reimbursement: RM) => void;
}

export default function ApprovalsTable(props: Props) {
  return (
    <TableWrapper>
      <table className="table-auto">
        <thead>
          <tr>
            {headings.map((h, i) => (
              <th className={classNames({ "pl-8": i === 0 })} key={h}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {props.reimbursements.map((reimbursement) => {
            return (
              <tr className={"hover:bg-gray-100"} key={reimbursement._id}>
                <td
                  onClick={() => props.select(reimbursement)}
                  className="py-2.5 border-b border-gray-300 pl-8 font-medium text-blue-500 cursor-pointer"
                >
                  {reimbursement.purpose}
                </td>
                <td className="py-2.5 border-b border-gray-300">
                  {format(new Date(reimbursement.date), "P")}
                </td>
                <td className="py-2.5 border-b border-gray-300 text-gray-400 ">
                  {(reimbursement.amount / 100).toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </td>
                <td className="py-2.5 border-b border-gray-300 text-gray-400">
                  {reimbursement.user.fullName}
                </td>
                <td className="py-2.5 border-b border-gray-300 text-gray-400">
                  <ApprovalBadge status={reimbursement.status} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </TableWrapper>
  );
}
