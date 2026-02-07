import { Fragment, useEffect, useRef, useState } from "react";
import "date-fns";
import { add, isToday, set, startOfWeek, differenceInMinutes, format, isSameDay } from "date-fns";
import { CalendarEvent } from "../../../types/calendar";
import classNames from "classnames";
import Calendar from ".";
import { useWindowSize } from "../../../hooks";

export function CalendarWeek(props: CalendarWeekProps) {
  const [days, setDays] = useState(createDates(props.date));
  const container = useRef<HTMLDivElement>(null);
  const containerNav = useRef<HTMLDivElement>(null);
  const containerOffset = useRef<HTMLDivElement>(null);
  const [width] = useWindowSize();

  useEffect(() => {
    // Set the container scroll position based on the current time.
    const currentMinute = new Date().getHours() * 60;
    if (container.current && containerNav.current && containerOffset.current) {
      container.current.scrollTop =
        ((container.current.scrollHeight -
          containerNav.current.offsetHeight -
          containerOffset.current.offsetHeight) *
          currentMinute) /
        1440;
    }
  }, []);

  useEffect(() => {
    setDays(createDates(props.date));
  }, [props.date]);

  const times = [
    "12AM",
    "1AM",
    "2AM",
    "3AM",
    "4AM",
    "5AM",
    "6AM",
    "7AM",
    "8AM",
    "9AM",
    "10AM",
    "11AM",
    "12PM",
    "1PM",
    "2PM",
    "3PM",
    "4PM",
    "5PM",
    "6PM",
    "7PM",
    "8PM",
    "9PM",
    "10PM",
    "11PM",
  ];
  const daysofWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const handleEventClick = (entryId: string) => {
    props.onEntryClick?.(entryId);
  };

  const showLine = width >= 640 ? days.some((d) => d.isToday) : isToday(props.date);

  return (
    <div className="flex flex-col week-view-wrapper">
      <div
        ref={container}
        className="flex flex-auto flex-col overflow-auto bg-white rounded shadow ring-1 ring-black ring-opacity-5"
      >
        <div
          style={{ width: "165%" }}
          className="flex max-w-full flex-none flex-col sm:max-w-none md:max-w-full"
        >
          <div
            ref={containerNav}
            className="sticky top-0 z-30 flex-none bg-white shadow ring-1 ring-black ring-opacity-5 sm:pr-8"
          >
            {/* Days of Week - Mobile */}
            <div className="grid grid-cols-7 text-sm leading-6 text-gray-500 sm:hidden">
              {days.map((day, i) => {
                const className = classNames(
                  { "rounded-full bg-indigo-600 text-white": day.isToday && day.isSelected },
                  { "rounded-full bg-black text-white": !day.isToday && day.isSelected },
                  { "text-gray-900": !day.isToday && !day.isSelected },
                  { "text-indigo-600": day.isToday && !day.isSelected },
                  "mt-1 flex h-8 w-8 items-center justify-center font-semibold"
                );
                return (
                  <button
                    key={day.date}
                    type="button"
                    className="flex flex-col items-center pt-2 pb-3"
                    onClick={() => {
                      const thisDate = day.date.split("-").map((d) => +d);
                      props.setDate(new Date(+thisDate[0], thisDate[1] - 1, thisDate[2]));
                    }}
                  >
                    {daysofWeek[i][0]}{" "}
                    <span className={className}>
                      {day.date.split("-").pop()?.replace(/^0/, "")}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Days of Week  - Desktop */}
            <div className="-mr-px hidden grid-cols-7 divide-x divide-gray-100 border-r border-gray-100 text-sm leading-6 text-gray-500 sm:grid">
              <div className="col-end-1 w-14" />
              {days.map((day, i) => {
                const cN = classNames(
                  { "ml-1.5 flex h-8 w-8 rounded-full bg-indigo-600 text-white": day.isToday },
                  { "text-gray-900": !day.isToday },
                  "items-center justify-center font-semibold"
                );
                return (
                  <div key={day.date} className="flex items-center justify-center py-3">
                    <span className={day.isToday ? "flex items-baseline" : ""}>
                      {daysofWeek[i]}{" "}
                      <span className={cN}>{day.date.split("-").pop()?.replace(/^0/, "")}</span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex flex-auto">
            <div className="sticky left-0 z-10 w-14 flex-none bg-white ring-1 ring-gray-100" />
            <div className="grid flex-auto grid-cols-1 grid-rows-1">
              {/* Horizontal lines */}
              <div
                className="col-start-1 col-end-2 row-start-1 grid divide-y divide-gray-100"
                style={{ gridTemplateRows: "repeat(48, minmax(3.5rem, 1fr))" }}
              >
                <div ref={containerOffset} className="row-end-1 h-7"></div>
                {times.map((time) => (
                  <Fragment key={time}>
                    <div>
                      <div className="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                        {time}
                      </div>
                    </div>
                    <div />
                  </Fragment>
                ))}
              </div>

              {/* Vertical lines */}
              <div className="col-start-1 col-end-2 row-start-1 hidden grid-cols-7 grid-rows-1 divide-x divide-gray-100 sm:grid sm:grid-cols-7">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className={`col-start-${i + 1} row-span-full ${i === 7 ? "w-8" : ""}`}
                  />
                ))}
              </div>

              {/* Events */}
              <ol
                className="col-start-1 col-end-2 row-start-1 grid grid-cols-1 sm:grid-cols-7 sm:pr-8"
                style={{ gridTemplateRows: "1.75rem repeat(288, minmax(0, 1fr)) auto" }}
              >
                {props.events &&
                  props.events.map((event) => (
                    <Event
                      key={event.id}
                      //@ts-ignore
                      event={event}
                      onClick={() => handleEventClick(event.id)}
                      hideBelowSmBreakpoint={!isSameDay(event.date, props.date)}
                    />
                  ))}
              </ol>
              {showLine && <Calendar.Line />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface CalendarWeekProps {
  date: Date;
  events?: CalendarEvent[];
  onEntryClick?: (entryId: string) => void;
  setDate: React.Dispatch<React.SetStateAction<Date>>;
}

const createDates = (date: Date) => {
  const weekStartDate = startOfWeek(date, { weekStartsOn: 0 });
  const dates = Array.from({ length: 7 }).map((_, i) => {
    const thisDay = add(weekStartDate, { days: i });
    return {
      date: thisDay.toISOString().split("T")[0],
      isToday: isToday(thisDay),
      isSelected: isSameDay(date, thisDay),
    };
  });
  return dates;
};

const Event = ({ event, onClick, hideBelowSmBreakpoint }: EventProps) => {
  const [width] = useWindowSize();

  const dayOfWeek = new Date(event.date).getDay() + 1;
  const start = new Date(event.timeStart);
  const end = new Date(event.timeEnd);
  const beginningOfDay = set(new Date(event.date), { hours: 0, minutes: 0, seconds: 0 });
  const rowStartOffset = 2;
  const gridRowStart = differenceInMinutes(start, beginningOfDay) / 5 + rowStartOffset;
  const gridRowEnd = `span ${differenceInMinutes(end, start) / 5}`;
  const gridColumnStart = width < 640 ? 1 : dayOfWeek;

  const className = classNames(`relative mt-px sm:flex sm:col-start-${dayOfWeek}`, {
    hidden: hideBelowSmBreakpoint,
  });

  return (
    <li
      className={className}
      style={{ gridRowStart, gridRowEnd, gridColumnStart }}
      onClick={onClick}
    >
      <div className="group absolute inset-1 flex flex-col overflow-y-auto rounded-lg bg-blue-50 p-2 text-xs leading-5 hover:bg-blue-100 cursor-pointer">
        <p className="order-1 font-semibold text-blue-700">{event.description}</p>
        <p className="text-blue-500 group-hover:text-blue-700">
          <time /* dateTime="2021-12-22T03:00" */>{format(new Date(event.timeStart), "p")}</time>
        </p>
      </div>
    </li>
  );
};

interface EventProps {
  event: Required<Omit<CalendarEvent, "timeLabel" | "color">>;
  onClick?: React.MouseEventHandler<HTMLLIElement>;
  hideBelowSmBreakpoint?: boolean;
}
