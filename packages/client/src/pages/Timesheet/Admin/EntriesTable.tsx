import { ArrowNarrowRightIcon } from "@heroicons/react/outline";
import { CheckCircleIcon, ExclamationCircleIcon, XCircleIcon } from "@heroicons/react/solid";
import { format } from "date-fns";
import React, { Fragment, useEffect } from "react";
import { TimesheetModel } from "../../../types/models";
import TableWrapper from "../../../components/TableWrapper";
import { useChecker2 } from "../../../hooks";

const headers = ["Day", "Description", "Times", ""];

const status = {
  Approved: {
    Component: CheckCircleIcon,
    color: "green",
  },
  Rejected: {
    Component: XCircleIcon,
    color: "red",
  },
  Pending: {
    Component: ExclamationCircleIcon,
    color: "gray",
  },
};

export default function EntriesTable(props: Props) {
  const { setSelected, showTimesheetEntry } = props;
  const { allSelected, checkboxRef, toggleAll, selectedData, data, setSelectedData } = useChecker2(
    props.entries
  );

  useEffect(() => setSelectedData([]), [data, setSelectedData]);

  useEffect(() => {
    setSelected(selectedData);
  }, [selectedData, setSelected]);

  return (
    <TableWrapper>
      <table className="[&_td]:p-0 [&_tbody_tr:hover]:!bg-transparent">
        <thead>
          <tr>
            <th scope="col" className="relative w-12 px-6 sm:w-16 sm:px-8">
              <input
                type="checkbox"
                className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 sm:left-6"
                ref={checkboxRef}
                checked={allSelected && data.length > 0}
                onChange={toggleAll}
              />
            </th>
            {headers.map((header) => (
              <th className="px-0" key={header}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-gray-400">
          {data.map((entry) => {
            const selected = selectedData.includes(entry);
            const approvalText =
              entry.status === "Pending"
                ? "Not Approved Yet"
                : `${entry.status} by ${entry.finalizedBy?.fullName}`;
            const info = status[entry.status];
            return (
              <Fragment key={entry._id}>
                <tr className="border-t">
                  <td rowSpan={2} className="relative w-12 px-6 sm:w-16 sm:px-8 pl-4 py-2.5">
                    <input
                      type="checkbox"
                      className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 sm:left-6"
                      value={entry._id}
                      checked={selected}
                      onChange={(e) =>
                        setSelectedData(
                          e.target.checked
                            ? [...selectedData, entry]
                            : selectedData.filter((m) => m !== entry)
                        )
                      }
                    />
                  </td>
                  <td rowSpan={2} className="font-medium">
                    {new Date(entry.timeStart).getDate()}
                  </td>
                  <td className="text-[16px] font-medium text-indigo-600 !border-b-0 !pt-2">
                    <span className="cursor-pointer" onClick={() => showTimesheetEntry(entry._id)}>
                      {entry.description}
                    </span>
                  </td>
                  <td rowSpan={2}>
                    <div className="flex text-gray-400">
                      {format(new Date(entry.timeStart), "p")}
                      <ArrowNarrowRightIcon className="mx-2 w-4" />
                      {format(new Date(entry.timeEnd), "p")}
                    </div>
                  </td>
                  <td rowSpan={2} className="w-5 !pr-4">
                    <div className=" flex items-center justify-center w-5 h-5">
                      <info.Component className={`text-${info.color}-500`} />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td colSpan={4} className="flex text-[11.5px] !border-b-0 !pt-0 text-gray-400">
                    <span className="mt-0.5 mb-2">{approvalText}</span>
                  </td>
                </tr>
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </TableWrapper>
  );
}

interface Props {
  entries: TimesheetModel[];
  setSelected: React.Dispatch<React.SetStateAction<TimesheetModel[]>>;
  showTimesheetEntry: (entryId: string) => Promise<void>;
}
