// @ts-nocheck
import { ReactChild, useEffect, useState } from "react";
import { Row, useGlobalFilter, useGroupBy, useSortBy, useTable } from "react-table";
import FadeIn from "../FadeIn";
import classNames from "classnames";

type BasicDoc = { _id: string; [x: string]: any };

export default function SideTable<T extends BasicDoc>({
  columns,
  data,
  rowComponent: Component,
  groupBy,
  onSelectionChange,
  selected,
  children,
  filterValue,
  customMethod,
}: {
  columns: {
    id?: string;
    Header: string;
    accessor?: string | ((original: T) => string);
  }[];
  data: T[];
  rowComponent: (props: any) => JSX.Element;
  groupBy: string | string[];
  onSelectionChange?: (original: T) => void;
  selected?: string;
  children?: ReactChild;
  filterValue?: string;
  customMethod?: (rows: Row<{}>[]) => void;
}) {
  const [tableSelected, setTableSelected] = useState("");
  const group = typeof groupBy === "string" ? [groupBy] : groupBy;
  const instance = useTable(
    //@ts-ignore
    { data, columns, initialState: { groupBy: group } },
    useGlobalFilter,
    useGroupBy,
    useSortBy
  );
  const { rows, prepareRow, setGlobalFilter } = instance;
  customMethod && customMethod(rows);

  useEffect(() => {
    selected !== undefined && setTableSelected(selected);
  }, [selected]);

  useEffect(() => {
    setGlobalFilter(filterValue);
  }, [filterValue, setGlobalFilter, data]);

  const handleClick = (subRow: Row<T>) => {
    if (selected === undefined) setTableSelected(subRow.original._id);
    onSelectionChange && onSelectionChange(subRow.original);
  };

  return (
    <aside className="flex flex-col min-w-[20rem] bg-white border-r border-[#e5e7eb] h-full max-[767px]:min-w-full min-[992px]:max-[1032px]:min-w-[18rem]">
      {children}
      <div className="flex flex-col overflow-y-auto">
        <FadeIn>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <div key={row.groupByVal}>
                <div className="bg-gray-50 py-1 px-6 sticky top-0 border-b border-gray-200 text-gray-400">
                  {row.groupByVal}
                </div>
                <ul className="list-none p-0 m-0">
                  {row.subRows.map((subRow) => (
                    <li
                      className={classNames(
                        "border-b border-gray-200 cursor-pointer hover:bg-gray-50",
                        {
                          "!bg-[#eff6ff] hover:!bg-[#eff6ff]":
                            tableSelected === subRow.original._id,
                        }
                      )}
                      key={subRow.id}
                      onClick={() => handleClick(subRow)}
                    >
                      <Component {...subRow.original} />
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </FadeIn>
      </div>
    </aside>
  );
}
