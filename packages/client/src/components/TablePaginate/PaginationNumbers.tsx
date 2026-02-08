import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/solid";

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
    <div className="flex flex-row justify-end w-1/3">
      {pageCount > 1 && (
        <>
          <div className="flex items-center justify-center h-[22px] w-[22px]">
            {canPreviousPage && (
              <button
                className="bg-transparent border-none text-[#999999] p-0.5 rounded-md cursor-pointer hover:bg-[#eeeeee] disabled:text-[#d6d5d5]"
                onClick={previousPage}
                disabled={!canPreviousPage}
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </button>
            )}
          </div>
          <ul className="list-none m-0 ps-0 flex flex-row items-center">
            {array.map((value: string | number, i) => (
              <li
                key={`page-${i}`}
                className={`flex items-center justify-center bg-transparent border-none text-[#999999] rounded-md cursor-pointer h-[22px] w-[22px] mx-0.5 hover:bg-[#eeeeee] ${
                  currentPage === value ? "!bg-[#c7c7c7]" : ""
                } ${typeof value === "number" ? "" : "hover:!bg-transparent !cursor-default"}`}
                onClick={() => typeof value === "number" && goToPage(value)}
              >
                {value}
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-center h-[22px] w-[22px]">
            {canNextPage && (
              <button
                className="bg-transparent border-none text-[#999999] p-0.5 rounded-md cursor-pointer hover:bg-[#eeeeee] disabled:text-[#d6d5d5]"
                onClick={nextPage}
                disabled={!canNextPage}
              >
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
