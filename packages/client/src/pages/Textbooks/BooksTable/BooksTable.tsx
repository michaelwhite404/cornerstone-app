//@ts-nocheck

import { DotsVerticalIcon } from "@heroicons/react/solid";
import React, { ReactNode, useEffect } from "react";
import { useGroupBy, useRowSelect, useTable } from "react-table";
import { Checkbox } from "../../../components/ui";
import { TextbookModel } from "../../../types/models/textbookTypes";
import FadeIn from "../../../components/FadeIn";
import { useWindowSize } from "../../../hooks";

export default function BooksTable({
  columns,
  data,
  setSelectedBooks,
}: {
  columns: {
    Header: string;
    accessor: string;
  }[];
  data: any[];
  setSelectedBooks: React.Dispatch<React.SetStateAction<TextbookModel[]>>;
}) {
  const [width] = useWindowSize();
  const tableInstance = useTable(
    {
      columns,
      data,
      initialState: {
        // @ts-ignore
        groupBy: ["textbookSet.title"],
        sortBy: ["textbookSet.title, bookNumber"],
      },
    },
    useGroupBy,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        // Let's make a column for selection
        {
          id: "selection",
          // The header can use the table's getToggleAllRowsSelectedProps method
          // to render a checkbox
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <div className="flex pl-2">
              <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
            </div>
          ),
          // The cell can use the individual row's getToggleRowSelectedProps method
          // to the render a checkbox
          Cell: ({ row }) => (
            <div className="flex pl-2" style={{ alignSelf: "center" }}>
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            </div>
          ),
        },
        ...columns,
        {
          id: "menu",
          Header: "",
          Cell: (
            <button className="p-1 rounded hover:bg-gray-100" aria-label="more">
              <DotsVerticalIcon className="h-5 w-5 text-gray-400" />
            </button>
          ),
        },
      ]);
    }
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    flatRows,
    rows,
    prepareRow,
    // @ts-ignore
    state: { selectedRowIds },
  } = tableInstance;

  useEffect(() => {
    const getSelected = (): TextbookModel[] => {
      const arr = [];
      for (const id in selectedRowIds) {
        if (flatRows[id]) {
          arr.push(flatRows[id].original);
        }
      }
      return arr;
    };
    setSelectedBooks(getSelected());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRowIds]);

  const table = (
    <div className="textbooks-table-container">
      <table {...getTableProps()} id="textbooks-table">
        <thead>
          {
            // Loop over the header rows
            headerGroups.map((headerGroup) => (
              // Apply the header row props
              <tr {...headerGroup.getHeaderGroupProps()}>
                {
                  // Loop over the headers in each row
                  headerGroup.headers.map((column) => (
                    // Apply the header cell props
                    <th
                      {...column.getHeaderProps()}
                      className="sticky top-0 z-[2] shadow-[0_-1px_#d1d5db_inset] border-b-0 bg-[#f9f9fb]"
                    >
                      {
                        // Render the header
                        column.render("Header")
                      }
                    </th>
                  ))
                }
              </tr>
            ))
          }
        </thead>
        {/* Apply the table body props */}
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <FadeIn>
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
                  })}
                </tr>
              </FadeIn>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  const mobileTable = (
    <>
      <div
        className="py-0.5 px-2.5 bg-gray-100 top-0 sticky border-b border-gray-200 z-10"
        style={{ backgroundColor: "#f9f9fb" }}
      >
        {headerGroups.map((headerGroup) => {
          const columnArray = headerGroup.headers.map((column) => column.render("Header"));
          return MobileHeader(columnArray);
        })}
      </div>
      {rows.map((row) => {
        prepareRow(row);
        const array = row.cells.map((cell) => cell.render("Cell"));
        return MobileRow(array);
      })}
    </>
  );

  return width > 540 ? table : mobileTable;
}

const IndeterminateCheckbox = React.forwardRef(({ indeterminate, ...rest }, ref) => {
  return <Checkbox ref={ref} indeterminate={indeterminate} size="md" {...rest} />;
});

const MobileHeader = ([checkbox]: ReactNode[]) => {
  return checkbox;
};

const MobileRow = ([checkbox, bookNumber, status, quality, student, dots]: ReactNode[]) => {
  return (
    <FadeIn>
      <div className="flex p-2.5 border-b border-gray-200">
        <div style={{ display: "flex" }}>{checkbox}</div>
        <div className="flex flex-col ml-2.5 text-gray-500">
          <div className="font-medium mb-[7px]">Book Number {bookNumber}</div>
          <div className="mb-[5px] [&_.badge]:mr-[5px]">
            {status} {quality}
          </div>
          <div style={{ fontStyle: "italic" }}>{student}</div>
        </div>
        <div style={{ marginLeft: "auto" }}>{dots}</div>
      </div>
    </FadeIn>
  );
};
