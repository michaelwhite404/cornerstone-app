import { Fragment } from "react";
import { Column, useExpanded, useTable, UseTableRowProps } from "react-table";

interface TableExpandedProps<T> extends Pick<React.HTMLAttributes<HTMLTableElement>, "className"> {
  columns: Column[];
  data: T[];
  renderRowSubComponent: ({ original }: { original: any }) => JSX.Element;
}

interface Row<D extends object = {}> extends UseTableRowProps<D> {
  isExpanded?: boolean;
}

export default function TableExpanded<T extends object = {}>({
  columns,
  data,
  renderRowSubComponent,
  className = "",
}: TableExpandedProps<T>) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows: rs,
    prepareRow,
    visibleColumns,
    // state
  } = useTable(
    {
      // @ts-ignore
      columns,
      data,
    },
    useExpanded
  );

  const rows: Row<T>[] = rs as unknown as Row<T>[];

  return (
    <>
      <table
        className={
          "table-wrapper [&_thead_th:first-child]:pl-5 [&_td]:py-1.5 [&_td]:px-0 [&_td]:max-w-0 [&_td]:overflow-hidden [&_td]:text-ellipsis [&_td]:whitespace-nowrap [&_td:first-child]:pl-5 [&_tbody[role='rowgroup']_tr:last-child]:border-b-0 [&_tbody[role='rowgroup']_tr.expanded-row:hover]:bg-transparent " +
          className
        }
        {...getTableProps()}
      >
        <thead>
          {headerGroups.map((headerGroup, i) => (
            <tr {...headerGroup.getHeaderGroupProps()} key={`header-row-${i}`}>
              {headerGroup.headers.map((column, j) => (
                <th {...column.getHeaderProps()} key={`header-${j}`}>
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row as any);
            return (
              <Fragment key={`row-${i}`}>
                <tr className="normal-row">
                  {row.cells.map((cell, j) => {
                    return (
                      <td {...cell.getCellProps()} key={`cell-${j}`}>
                        {cell.render("Cell")}
                      </td>
                    );
                  })}
                </tr>
                {row.isExpanded ? (
                  <tr className="expanded-row">
                    <td colSpan={visibleColumns.length}>
                      {renderRowSubComponent({ original: row.original })}
                    </td>
                  </tr>
                ) : null}
              </Fragment>
            );
          })}
        </tbody>
      </table>
      <br />
    </>
  );
}
