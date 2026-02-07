import { Icon } from "@blueprintjs/core";

interface PaginationNumbersProps {
  currentPage: number;
  pageCount: number;
  canPreviousPage: boolean;
  canNextPage: boolean;
  previousPage: () => void;
  nextPage: () => void;
  goToPage: (value: number) => void;
}

export default function PaginationNumbers({
  currentPage,
  pageCount,
  canPreviousPage,
  canNextPage,
  previousPage,
  nextPage,
  goToPage,
}: PaginationNumbersProps) {
  function getPaginationArray(current: number, pageCount: number) {
    const delta = 1;
    const left = current - delta;
    const right = current + delta + 1;
    const range = [];
    const rangeWithDots = [];
    let l: number | undefined;

    for (let i = 1; i <= pageCount; i++) {
      if (i === 1 || i === pageCount || (i >= left && i < right)) {
        range.push(i);
      }
    }

    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  }

  const array = getPaginationArray(currentPage, pageCount);

  return (
    <div className="pagination-navigator pagination-toolbar-item">
      {pageCount > 1 && (
        <>
          <div className="pagination-arrow-holder">
            {canPreviousPage && (
              <button
                className="pagination-arrow"
                onClick={previousPage}
                disabled={!canPreviousPage}
              >
                <Icon icon="chevron-left" />
              </button>
            )}
          </div>
          <ul className="pagination-page-container">
            {array.map((value: string | number, i) => (
              <li
                key={`page-${i}`}
                className={`pagination-page-number ${currentPage === value ? "current-page" : ""} ${
                  typeof value === "number" ? "" : "dots"
                }`}
                onClick={() => typeof value === "number" && goToPage(value)}
              >
                {value}
              </li>
            ))}
          </ul>
          <div className="pagination-arrow-holder">
            {canNextPage && (
              <button className="pagination-arrow" onClick={nextPage} disabled={!canNextPage}>
                <Icon icon="chevron-right" />
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
