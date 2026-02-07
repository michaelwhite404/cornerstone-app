// @ts-nocheck
import { Icon, InputGroup } from "@blueprintjs/core";
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
import "./Table.sass";

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
          className="tr"
        >
          {row.cells.map((cell, i) => {
            return (
              <div {...cell.getCellProps()} className="td" key={"cell" + i}>
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
    <div className="table-wrapper">
      <div className="table-toolbox">
        <InputGroup
          className="search"
          leftIcon="search"
          placeholder="Search"
          value={globalFilter || ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
        />
      </div>
      <div {...getTableProps()} className="table" style={{ width: width - 308 }}>
        <div className="header-row">
          {headerGroups.map((headerGroup, i) => (
            <div {...headerGroup.getHeaderGroupProps()} className="tr" key={"headerGroup" + i}>
              {headerGroup.headers.map((column, j) => (
                <Fragment key={"column" + j}>
                  {/* @ts-ignore */}
                  <div {...column.getHeaderProps(column.getSortByToggleProps())} className="th">
                    {column.render("Header")}
                    <span style={{ marginLeft: 10, marginTop: 4 }}>
                      {/* @ts-ignore */}
                      {column.isSorted ? (
                        <>
                          <Icon
                            /* 
                              //@ts-ignore */
                            icon={`arrow-${column.isSortedDesc ? "down" : "up"}`}
                            size={12}
                            color="#3a8cd2"
                          />
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

        <div {...getTableBodyProps()}>
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
      <div className="table-bottom">
        <span className="table-footer-results">
          Showing {pluralize("Result", rows.length, true)}
        </span>
      </div>
    </div>
  );
}
