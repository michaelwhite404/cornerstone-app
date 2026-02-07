// @ts-nocheck
import { SearchIcon, ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/solid";
import pluralize from "pluralize";
import React, { Fragment } from "react";
import {
  useTable,
  useBlockLayout,
  useGlobalFilter,
  useSortBy,
  TableInstance,
  UseGlobalFiltersInstanceProps,
  UseGlobalFiltersState,
} from "react-table";
import { FixedSizeList } from "react-window";
import { useWindowSize } from "../../hooks";
import { Input } from "../ui";

// const totalAvailableWidth = window.innerWidth - 258;
export default function Table({
  columns,
  data,
  sortBy,
}: {
  columns: {
    Header: string;
    accessor: string | ((original: any) => string);
  }[];
  data: any[];
  sortBy?: string;
}) {
  const [width, height] = useWindowSize();

  // const scrollBarSize = React.useMemo(() => scrollbarWidth(), []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
      initialState: {
        sortBy: [
          {
            id: sortBy,
            desc: false,
          },
        ],
      },
      // defaultColumn,
    },
    useBlockLayout,
    useGlobalFilter,
    useSortBy
  ) as TableInstance & UseGlobalFiltersInstanceProps<object>;

  const { globalFilter } = state as UseGlobalFiltersState<object>;

  const RenderRow = React.useCallback(
    ({ index, style }) => {
      const row = rows[index];
      prepareRow(row);
      return (
        <div
          {...row.getRowProps({
            style,
          })}
          className="border-t border-gray-300 items-center hover:bg-blue-50 first:border-t-0 last:border-b last:border-gray-300 [&_div:first-child]:pl-5"
        >
          {row.cells.map((cell, i) => {
            return (
              <div {...cell.getCellProps()} className="whitespace-nowrap overflow-hidden text-ellipsis" key={"cell" + i}>
                {cell.render("Cell")}
              </div>
            );
          })}
        </div>
      );
    },
    [prepareRow, rows]
  );

  // Render the UI for your table
  return (
    <div className="mt-[15px] shadow-[0px_1px_20px_-3px_rgba(0,0,0,0.15)] rounded-lg overflow-hidden w-full select-none">
      <div className="w-full min-h-[55px] bg-white border-b border-gray-300 flex items-center">
        <Input
          className="ml-5 flex items-center bg-[#e9effd] w-[225px] font-medium [&_input]:py-2 [&_input]:px-0 [&_input]:pl-3 [&_input]:border-none [&_input]:bg-transparent [&_input]:flex-grow [&_input]:font-inherit [&_svg[data-icon='search']]:fill-gray-400 [&_svg[data-icon='search']]:text-xs"
          leftIcon={<SearchIcon className="h-5 w-5" />}
          placeholder="Search"
          value={globalFilter || ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
        />
      </div>
      <div {...getTableProps()} className="bg-white" style={{ width: width - 308 }}>
        <div className="border-b border-gray-300 bg-[#f9f9fb]">
          {headerGroups.map((headerGroup, i) => (
            <div {...headerGroup.getHeaderGroupProps()} className="[&_div:first-child]:pl-5" key={"headerGroup" + i}>
              {headerGroup.headers.map((column, j) => (
                <Fragment key={"column" + j}>
                  {/* @ts-ignore */}
                  <div {...column.getHeaderProps(column.getSortByToggleProps())} className="pt-2.5 pb-2.5 uppercase text-xs text-gray-400 font-medium tracking-wide">
                    {column.render("Header")}
                    <span style={{ marginLeft: 10, marginTop: 4 }}>
                      {/* @ts-ignore */}
                      {column.isSorted ? (
                        <>
                          {/* @ts-ignore */}
                          {column.isSortedDesc ? (
                            <ArrowDownIcon className="h-3 w-3 text-blue-500 inline" />
                          ) : (
                            <ArrowUpIcon className="h-3 w-3 text-blue-500 inline" />
                          )}
                        </>
                      ) : (
                        ""
                      )}
                    </span>
                  </div>
                </Fragment>
              ))}
            </div>
          ))}
        </div>

        <div {...getTableBodyProps()} className="font-medium text-[15px] text-gray-400">
          <FixedSizeList
            height={height - 240}
            itemCount={rows.length}
            itemSize={42}
            width={width - 308}
          >
            {RenderRow}
          </FixedSizeList>
        </div>
      </div>
      <div className="border-t border-gray-300 h-10 bg-[#f5f5ff] flex items-center">
        <span className="ml-5 text-gray-400 text-[15px]">
          Showing {pluralize("Result", rows.length, true)}
        </span>
      </div>
    </div>
  );
}
