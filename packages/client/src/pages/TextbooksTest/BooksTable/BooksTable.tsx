//@ts-nocheck

import { DotsVerticalIcon } from "@heroicons/react/solid";
import { Checkbox, IconButton } from "@mui/material";
import React, { ReactNode, useEffect } from "react";
import { useGroupBy, useRowSelect, useTable } from "react-table";
import { TextbookModel } from "../../../types/models/textbookTypes";
import FadeIn from "../../../components/FadeIn";
import { useWindowSize } from "../../../hooks";
import "./BooksTable.sass";

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
            <div className="selection-wrapper">
              <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
            </div>
          ),
          // The cell can use the individual row's getToggleRowSelectedProps method
          // to the render a checkbox
          Cell: ({ row }) => (
            <div className="selection-wrapper" style={{ alignSelf: "center" }}>
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            </div>
          ),
        },
        ...columns,
        {
          id: "menu",
          Header: "",
          Cell: (
            // <div style={{ padding: "0 5px" }}>
            <IconButton aria-label="more">
              <DotsVerticalIcon color="#a1a1a1" width={20} />
            </IconButton>
            // </div>
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
        arr.push(flatRows[id].original);
      }
      return arr;
    };
    setSelectedBooks(getSelected());
  }, [flatRows, selectedRowIds, setSelectedBooks]);

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
                    <th {...column.getHeaderProps()} className="sticky-header">
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
        className="textbook-mobile-row-header"
        style={{ padding: "2px 10px", backgroundColor: "#f9f9fb" }}
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
  const defaultRef = React.useRef();
  const resolvedRef = ref || defaultRef;

  React.useEffect(() => {
    resolvedRef.current.indeterminate = indeterminate;
  }, [resolvedRef, indeterminate]);

  return <Checkbox ref={resolvedRef} {...rest} size="small" />;
});

const MobileHeader = ([checkbox]: ReactNode[]) => {
  return checkbox;
};

const MobileRow = ([checkbox, bookNumber, status, quality, student, dots]: ReactNode[]) => {
  return (
    <FadeIn>
      <div className="textbook-mobile-row">
        <div style={{ display: "flex" }}>{checkbox}</div>
        <div className="textbook-mobile-row-data">
          <div className="textbook-mobile-row-title">Book Number {bookNumber}</div>
          <div className="textbook-mobile-row-badges">
            {status} {quality}
          </div>
          <div style={{ fontStyle: "italic" }}>{student}</div>
        </div>
        <div style={{ marginLeft: "auto" }}>{dots}</div>
      </div>
    </FadeIn>
  );
};
