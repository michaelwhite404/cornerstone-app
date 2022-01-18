// @ts-nocheck
import { ReactChild, useEffect, useState } from "react";
import { Row, useExpanded, useGlobalFilter, useGroupBy, useTable } from "react-table";
import FadeIn from "../FadeIn";
import classNames from "classnames";
import "./SideTable.sass";

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
}) {
  const [tableSelected, setTableSelected] = useState("");
  const group = typeof groupBy === "string" ? [groupBy] : groupBy;
  const instance = useTable(
    //@ts-ignore
    { data, columns, initialState: { groupBy: group } },
    useGlobalFilter,
    useGroupBy,
    useExpanded
  );
  const { rows, prepareRow, setGlobalFilter } = instance;
  rows.sort((row1, row2) => (row1.groupByVal as string).localeCompare(row2.groupByVal));

  useEffect(() => {
    selected !== undefined && setTableSelected(selected);
  }, [selected]);

  useEffect(() => {
    setGlobalFilter(filterValue);
  }, [filterValue, setGlobalFilter]);

  const handleClick = (subRow: Row<T>) => {
    if (selected === undefined) setTableSelected(subRow.original._id);
    onSelectionChange && onSelectionChange(subRow.original);
  };

  return (
    <aside className="side-table">
      {children}
      <div className="side-table-content">
        <FadeIn>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <div className="side-table-group" key={row.groupByVal}>
                <div className="side-table-header">{row.groupByVal}</div>
                <ul className="side-table-list">
                  {row.subRows.map((subRow) => (
                    <li
                      className={classNames("side-table-row", {
                        "highlight-row": tableSelected === subRow.original._id,
                      })}
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
