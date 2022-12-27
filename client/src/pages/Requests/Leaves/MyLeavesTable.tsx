import { Icon } from "@blueprintjs/core";
import { ArrowNarrowRightIcon } from "@heroicons/react/outline";
import classNames from "classnames";
import { format } from "date-fns";
import { useContext } from "react";
import { Leave, LeavesSortContext } from ".";
import ApprovalBadge from "../../../components/Badges/ApprovalBadge";
import TableWrapper from "../../../components/TableWrapper";

interface Props {
  leaves: Leave[];
  select: (leave: Leave) => void;
}

const headers = [{ name: "Leave" }, { name: "From" }, { name: "Dates" }, { name: "Status" }];

const Header = ({
  name,
  first = false,
  selected = false,
  order = "desc",
  setSort,
}: {
  name: string;
  first?: boolean;
  selected?: boolean;
  order?: "asc" | "desc";
  setSort: any;
}) => {
  const switchOrder = () => (order === "desc" ? "asc" : "desc");
  const handleClick = () => setSort({ key: name, order: selected ? switchOrder() : "desc" });
  return (
    <th className={classNames("relative py-1", { "pl-6": first })} key={name}>
      <button
        name={name}
        className={classNames(
          "flex items-center uppercase tracking-[1px] hover:bg-gray-200 py-1 px-1.5 rounded relative -left-[6px]",
          { "text-gray-600": selected }
        )}
        onClick={handleClick}
      >
        {name}
        {selected && <Icon icon={order === "desc" ? "caret-down" : "caret-up"} />}
      </button>
    </th>
  );
};

export default function MyLeavesTable(props: Props) {
  const { sort, setSort } = useContext(LeavesSortContext);
  const { leaves, select } = props;
  return (
    <TableWrapper>
      <table>
        <thead>
          <tr className="h-[36px]">
            {headers.map(({ name }, i) => (
              <Header
                key={name}
                name={name}
                first={i === 0}
                selected={sort?.key === name}
                order={sort?.order}
                setSort={setSort}
              />
            ))}
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
