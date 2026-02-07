import { useEffect, useState } from "react";
import {
  format,
  getDaysInMonth,
  getDay,
  subDays,
  addDays,
  lastDayOfMonth,
  isToday,
} from "date-fns";
import classNames from "classnames";
import Month from "../../../types/month";
import { CalendarEvent } from "../../../types/calendar";
import { ClockIcon } from "@heroicons/react/solid";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function CalendarMonth(props: CalendarMonthProps) {
  const [days, setDays] = useState(createDates(props.month, props.year, props.events));
  const selectedDay = days.find((day) => day.isSelected);

  useEffect(() => {
    setDays(createDates(props.month, props.year, props.events));
  }, [props.events, props.month, props.year]);

  const onDayButtonClick = (date: string) => {
    const daysClone = [...days];
    const selectedDayIndex = daysClone.findIndex((day) => day.isSelected);
    selectedDayIndex > -1 && (daysClone[selectedDayIndex].isSelected = false);
    const dayIndex = daysClone.findIndex((day) => day.date === date);
    if (dayIndex > -1) {
      daysClone[dayIndex].isSelected = true;
    }
    setDays(daysClone);
  };

  const handleEntryClick = (entryId: string) => {
    props.onEntryClick?.(entryId);
  };

  return (
    <div>
      <div className="shadow ring-1 ring-black ring-opacity-5 lg:flex lg:flex-auto lg:flex-col rounded overflow-hidden">
        {/* Days of Week */}
        <div className="grid grid-cols-7 gap-px border-b border-gray-300 bg-gray-200 text-center text-xs font-semibold leading-6 text-gray-700 lg:flex-none">
          {daysOfWeek.map((day) => (
            <div className="bg-white py-2" key={day}>
              {day[0]}
              <span className="sr-only sm:not-sr-only">{day.substring(1)}</span>
            </div>
          ))}
        </div>
        {/* Calendar Days */}
        <div className="flex bg-gray-200 text-xs leading-6 text-gray-700 lg:flex-auto">
          <div className="hidden w-full lg:grid lg:grid-cols-7 lg:grid-rows-5 lg:gap-px">
            {days.map((day) => (
              <div
                key={day.date}
                className={classNames(
                  day.isCurrentMonth ? "bg-white" : "bg-gray-50 text-gray-500",
                  "relative py-2 px-3"
                )}
                style={{ minHeight: 105 }}
              >
                <time
                  dateTime={day.date}
                  className={
                    day.isToday
                      ? "flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 font-semibold text-white"
                      : undefined
                  }
                >
                  {day.date.split("-").pop()?.replace(/^0/, "")}
                </time>
                {day.events && day.events.length > 0 && (
                  <ol className="mt-2">
                    {day.events.slice(0, 2).map((event) => (
                      <li key={event.id}>
                        <div
                          className="group flex hover:no-underline cursor-pointer"
                          onClick={() => handleEntryClick(event.id)}
                        >
                          <p className="flex-auto truncate font-medium text-gray-900 group-hover:text-indigo-600">
                            {event.description}
                          </p>
                          <time
                            // dateTime={event.datetime}
                            className="ml-3 hidden flex-none text-gray-500 group-hover:text-indigo-600 xl:block"
                          >
                            {event.timeLabel}
                          </time>
                        </div>
                      </li>
                    ))}
                    {day.events.length > 2 && (
                      <li className="text-gray-500">+ {day.events.length - 2} more</li>
                    )}
                  </ol>
                )}
              </div>
            ))}
          </div>
          <div className="isolate grid w-full grid-cols-7 grid-rows-5 gap-px lg:hidden">
            {days.map((day) => (
              <button
                key={day.date}
                type="button"
                className={classNames(
                  day.isCurrentMonth ? "bg-white" : "bg-gray-50",
                  (day.isSelected || day.isToday) && "font-semibold",
                  day.isSelected && "text-white",
                  !day.isSelected && day.isToday && "text-indigo-600",
                  !day.isSelected && day.isCurrentMonth && !day.isToday && "text-gray-900",
                  !day.isSelected && !day.isCurrentMonth && !day.isToday && "text-gray-500",
                  "flex h-14 flex-col py-2 px-3 hover:bg-gray-100 focus:z-10"
                )}
                onClick={() => onDayButtonClick(day.date)}
              >
                <time
                  dateTime={day.date}
                  className={classNames(
                    day.isSelected && "flex h-6 w-6 items-center justify-center rounded-full",
                    day.isSelected && day.isToday && "bg-indigo-600",
                    day.isSelected && !day.isToday && "bg-gray-900",
                    "ml-auto"
                  )}
                >
                  {day.date.split("-").pop()?.replace(/^0/, "")}
                </time>
                <span className="sr-only">{day.events?.length} events</span>
                {day.events && day.events.length > 0 && (
                  <span className="-mx-0.5 mt-auto flex flex-wrap-reverse">
                    {day.events.map((event) => (
                      <span
                        key={event.id}
                        className="mx-0.5 mb-1 h-1.5 w-1.5 rounded-full bg-gray-400"
                      />
                    ))}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
      {selectedDay?.events && selectedDay?.events.length > 0 && (
        <div className="py-10 px-4 sm:px-6 lg:hidden">
          <ol className="divide-y divide-gray-100 overflow-hidden rounded-lg bg-white text-sm shadow ring-1 ring-black ring-opacity-5">
            {selectedDay.events.map((event) => (
              <li key={event.id} className="group flex focus-within:bg-gray-50 hover:bg-gray-50">
                <button className="p-4 w-full text-left" onClick={() => handleEntryClick(event.id)}>
                  <p className="font-semibold text-gray-900">{event.description}</p>
                  <time
                    /* dateTime={event.datetime} */ className="mt-2 flex items-center text-gray-700"
                  >
                    <ClockIcon className="mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                    {event.timeLabel}
                  </time>
                </button>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

const createDates = (month: Month, year: number, events?: CalendarEvent[]) => {
  const firstDay = new Date(`${month} 1 ${year}`);
  const daysInMonth = getDaysInMonth(firstDay);
  const form = (month: string, day: number, year: number) =>
    format(new Date(`${month} ${day}, ${year}`), "y-LL-dd");
  const dates: Day[] = [];
  for (let i = 1; i <= daysInMonth; i++) {
    dates.push({
      date: form(month, i, year),
      isCurrentMonth: true,
      isToday: isToday(new Date(`${month} ${i}, ${year}`)),
      events: [],
    });
  }
  events?.forEach((event) => {
    // console.log(format(event.date, "LLLL"), event.date.getFullYear());
    if (format(event.date, "LLLL") === month && event.date.getFullYear() === year) {
      // console.log(dates, event.date.getDate());
      dates[event.date.getDate() - 1].events?.push(event);
    }
  });
  // Days Before Month
  for (let i = 1; i <= getDay(firstDay); i++) {
    const day = subDays(firstDay, i);
    dates.unshift({
      date: format(day, "y-LL-dd"),
      isCurrentMonth: false,
    });
  }
  // Days After Month
  const lastDay = lastDayOfMonth(firstDay);
  for (let i = 1; i <= 6 - getDay(lastDay); i++) {
    const day = addDays(lastDay, i);
    dates.push({
      date: format(day, "y-LL-dd"),
      isCurrentMonth: false,
    });
  }
  return dates;
};

interface Day {
  date: string;
  isCurrentMonth?: boolean;
  isToday?: boolean;
  isSelected?: boolean;
  events?: CalendarEvent[];
}

interface CalendarMonthProps {
  month: Month;
  year: number;
  events?: CalendarEvent[];
  onEntryClick?: (entryId: string) => void;
}
