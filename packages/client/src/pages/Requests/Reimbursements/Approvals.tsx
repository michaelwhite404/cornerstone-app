import { CheckIcon, XIcon } from "@heroicons/react/outline";
import classNames from "classnames";
import { format } from "date-fns";
import pluralize from "pluralize";
import { RM } from ".";
import { ReimbursementModel } from "../../../types/models";
import ApprovalBadge from "../../../components/Badges/ApprovalBadge";
import EmptyStateIllustration from "../../../components/EmptyStateIllustration";
import TableWrapper from "../../../components/TableWrapper";
import { useChecker2, useToasterContext } from "../../../hooks";
import ApprovalsList from "./ApprovalsList";
import ApprovalsTable from "./ApprovalsTable";

interface Props {
  reimbursements: RM[];
  setReimbursements: React.Dispatch<React.SetStateAction<RM[]>>;
  select: (reimbursement: RM) => void;
  finalizeReimbursement: (id: string, approved: boolean) => Promise<ReimbursementModel>;
}

const headings = ["Purpose", "Date", "Amount", "Submitted By", "Status"];

export default function Approvals(props: Props) {
  const { reimbursements, select, finalizeReimbursement, setReimbursements } = props;
  const { showToaster } = useToasterContext();
  const { pending, finalized } = reimbursements.reduce(
    (prev, reimbursement) => {
      reimbursement.approval
        ? prev.finalized.push(reimbursement)
        : prev.pending.push(reimbursement);
      return prev;
    },
    { pending: [] as RM[], finalized: [] as RM[] }
  );
  const { allSelected, checkboxRef, data, toggleAll, selectedData, setSelectedData } =
    useChecker2(pending);

  const handleMultiFinalize = async (approved: boolean) => {
    if (!selectedData.length) return;
    const requests = selectedData.map((r) => finalizeReimbursement(r._id, approved));
    const responses = await Promise.allSettled(requests);
    const copy = [...reimbursements];
    const fulfilled = responses.filter(
      (r) => r.status === "fulfilled"
    ) as PromiseFulfilledResult<ReimbursementModel>[];
    const word = approved ? "Approved" : "Rejected";
    fulfilled.forEach((result) => {
      const reimbursement = result.value;
      const index = copy.findIndex((rm) => rm._id === reimbursement._id);
      if (index < 0) return;
      copy[index].selected = false;
      copy[index].status = word;
    });
    setReimbursements(copy);
    setSelectedData([]);
    showToaster(`${pluralize("request", fulfilled.length, true)} ${word}`.toLowerCase(), "success");
  };

  return (
    <div className="relative">
      {reimbursements.length ? (
        <div>
          <div>
            <div className="mt-4 sm:h-14 sm:flex items-center justify-between">
              <span className="text-xl font-bold text-gray-900">Pending ({data.length})</span>
              <div
                className={`${
                  selectedData.length ? "sm:block flex" : "hidden"
                } space-x-3  pt-2 sm:pt-0`}
              >
                <button
                  type="button"
                  className="w-full sm:w-auto justify-center inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  onClick={() => handleMultiFinalize(true)}
                >
                  <CheckIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
                  Approve {allSelected ? "All" : ""}
                </button>
                <button
                  type="button"
                  className="w-full sm:w-auto justify-center inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  onClick={() => handleMultiFinalize(false)}
                >
                  <XIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
                  Reject {allSelected ? "All" : ""}
                </button>
              </div>
            </div>
            {pending.length ? (
              <div>
                <div className="hidden sm:block">
                  <TableWrapper>
                    <table className="table-auto">
                      <thead>
                        <tr>
                          <th scope="col" className="relative w-12 px-6 sm:w-16 sm:px-8 border-b">
                            <input
                              type="checkbox"
                              className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 sm:left-6"
                              ref={checkboxRef}
                              checked={allSelected && reimbursements.length > 0}
                              onChange={toggleAll}
                            />
                          </th>
                          {headings.map((h) => (
                            <th key={h}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {data.map((reimbursement) => {
                          const selected = selectedData.includes(reimbursement);
                          return (
                            <tr
                              className={classNames(
                                { "bg-indigo-50": selected },
                                { "hover:bg-gray-100": !selected }
                              )}
                              key={reimbursement._id}
                            >
                              <td className="relative w-12 px-6 sm:w-16 sm:px-8 pl-4 py-2.5 border-b border-gray-300">
                                <input
                                  type="checkbox"
                                  className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 sm:left-6"
                                  value={reimbursement._id}
                                  checked={selected}
                                  onChange={(e) =>
                                    setSelectedData(
                                      e.target.checked
                                        ? [...selectedData, reimbursement]
                                        : selectedData.filter((r) => r !== reimbursement)
                                    )
                                  }
                                />
                              </td>

                              <td
                                onClick={() => select(reimbursement)}
                                className="py-2.5 border-b border-gray-300 font-medium text-blue-500 cursor-pointer"
                              >
                                {reimbursement.purpose}
                              </td>
                              <td className="py-2.5 border-b border-gray-300">
                                {format(new Date(reimbursement.date), "P")}
                              </td>
                              <td className="py-2.5  border-b border-gray-300 text-gray-400 ">
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
                </div>
                <div className="block sm:hidden">
                  <ApprovalsList reimbursements={pending} select={select} />
                </div>
              </div>
            ) : (
              <span className="ml-5">There are no pending reimbursements right now</span>
            )}
          </div>
          <div>
            <div className="mt-4 sm:h-14 sm:flex items-center justify-between">
              <span className="text-xl font-bold text-gray-900">
                Finalized ({finalized.length})
              </span>
            </div>
            {finalized.length ? (
              <div>
                <div className="hidden sm:block">
                  <ApprovalsTable reimbursements={finalized} select={select} />
                </div>
                <div className="block sm:hidden">
                  <ApprovalsList reimbursements={finalized} select={select} />
                </div>
              </div>
            ) : (
              <span className="ml-5">There are no finalized reimbursements right now</span>
            )}
          </div>
        </div>
      ) : (
        <EmptyStateIllustration
          text="There are no reimbursement approvals so far"
          imgSrc="https://cdni.iconscout.com/illustration/premium/thumb/man-endorses-document-with-an-ink-pen-2549497-2145099.png"
          xlWidth="100%"
        />
      )}
    </div>
  );
}
