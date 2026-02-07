import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/solid";
import { sub, add } from "date-fns";
import pluralize from "pluralize";
import { CalendarView } from "../../../types/calendar";

export function DatePick(props: DatePickProps) {
  const handleTodayClick = () => props.setDate(new Date());
  const previousClick = () => props.setDate((date) => sub(date, { [pluralize(props.view)]: 1 }));
  const nextClick = () => props.setDate((date) => add(date, { [pluralize(props.view)]: 1 }));

  return (
    <div className="flex items-center rounded-md shadow-sm md:items-stretch">
      <button
        type="button"
        className="flex items-center justify-center rounded-l-md border border-r-0 border-gray-300 bg-white py-2 px-2 text-gray-400 hover:text-gray-500 focus:relative w-9 md:hover:bg-gray-50"
        onClick={previousClick}
      >
        <span className="sr-only">Previous {props.view}</span>
        <ChevronLeftIcon className="h-5 w-5" />
      </button>
      <button
        type="button"
        className="border-t border-b border-gray-300 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus:relative md:block"
        onClick={handleTodayClick}
      >
        Today
      </button>
      {/* <span className="relative -mx-px h-5 w-px bg-gray-300 md:hidden" /> */}
      <button
        type="button"
        className="flex items-center justify-center rounded-r-md border border-l-0 border-gray-300 bg-white py-2 text-gray-400 hover:text-gray-500 focus:relative md:w-9 px-2 md:hover:bg-gray-50"
        onClick={nextClick}
      >
        <span className="sr-only">Next {props.view}</span>
        <ChevronRightIcon className="h-5 w-5" />
      </button>
    </div>
  );
}

interface DatePickProps {
  view: CalendarView;
  setDate: React.Dispatch<React.SetStateAction<Date>>;
}
