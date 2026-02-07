import { useRef } from "react";
import {
  TableInstance,
  usePagination,
  UsePaginationInstanceProps,
  UsePaginationState,
  useTable,
} from "react-table";
import PaginationNumbers from "./PaginationNumbers";
import "./TablePaginate.sass";

interface Column {
  Header: string;
  accessor: string;
  Cell?: ({ row: { original } }: { row: { original: any } }) => any;
}

interface TablePaginationProps<T> {
  columns: Column[];
  data: T[];
  pageSize?: number;
  pageSizeOptions?: number[];
  enableRowsPicker?: boolean;
  height?: number;
  id?: string;
}

const defaultPageSizes = [10, 25, 50, 100];

export default function TablePaginate<T>({
  id,
  columns,
  data,
  pageSize = 10,
  pageSizeOptions = defaultPageSizes,
  enableRowsPicker = true,
  height,
}: TablePaginationProps<T>) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page, // Instead of using 'rows', we'll use page,
    // which has only the rows for the active page

    // The rest of these things are super handy, too ;)
    canPreviousPage,
    canNextPage,
    // pageOptions,
    pageCount,
    gotoPage: gtp,
    nextPage,
    previousPage,
    setPageSize,
    state, //: { pageIndex, pageSize }
  } = useTable(
    {
      columns,
      // @ts-ignore
      data,
      // @ts-ignore
      initialState: { pageIndex: 0, pageSize },
    },
    usePagination
  ) as TableInstance & UsePaginationInstanceProps<object>;

  const cState = state as UsePaginationState<any>;
  const showingText = () => {
    const start = cState.pageIndex * cState.pageSize + 1;
    const end = Math.min((cState.pageIndex + 1) * cState.pageSize, data.length);
    return `Showing ${start} - ${end} of ${data.length}`;
  };

  const ref = useRef<HTMLDivElement>(null);

  const goToPage = (value: number) => {
    // Index starts at 0, page 1
    gtp(value - 1);
    ref.current?.scrollTo({ top: 0 });
  };

  // .scrollTo(0,0)
  return (
    <div className="pagination-table">
      <div
        className="pagination-table-wrapper"
        style={{ height: height ? height - 37 : undefined }}
      >
        <div className="table-wrapper" style={{ width: "100%", overflow: "auto" }} ref={ref}>
          <table className="table-paginate" {...getTableProps()} id={id}>
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th {...column.getHeaderProps()} className="sticky-header">
                      {column.render("Header")}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {page.map((row, i) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell) => {
                      return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="table-pagination-toolbar">
        <div className="pagination-toolbar-item">
          {enableRowsPicker && (
            <>
              Rows per page:
              <select onChange={(e) => setPageSize(Number(e.target.value))}>
                {pageSizeOptions.map((o) => (
                  <option key={`${o}-rows`}>{o}</option>
                ))}
              </select>
            </>
          )}
        </div>
        <span className="showing-text pagination-toolbar-item">{showingText()}</span>
        <PaginationNumbers
          currentPage={cState.pageIndex + 1}
          pageCount={pageCount}
          canPreviousPage={canPreviousPage}
          canNextPage={canNextPage}
          previousPage={previousPage}
          nextPage={nextPage}
          goToPage={goToPage}
        />
      </div>
    </div>
  );
}
