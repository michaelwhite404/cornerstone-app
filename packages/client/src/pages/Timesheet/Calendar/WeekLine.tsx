import { differenceInMinutes, format, startOfDay } from "date-fns";
import { useEffect, useState } from "react";
import { useWindowSize } from "../../../hooks";

export function WeekLine() {
  const [{ dayOfWeek, minutes }, setValue] = useState(getInfo());
  const [width] = useWindowSize();

  useEffect(() => {
    const interval = setInterval(() => setValue(getInfo()), 60000);
    return () => clearInterval(interval);
  }, []);

  const num = width < 640 ? 1 : dayOfWeek;
  return (
    <div
      className="div-start-1 col-end-2 row-start-1 grid grid-cols-1 sm:grid-cols-7 sm:pr-8"
      style={{ gridTemplateRows: "1.75rem repeat(1440, minmax(0, 1fr)) auto" }}
    >
      <div
        // sm:col-start-${dayOfWeek}
        className={`relative mt-px flex bg-red-500 align-center z-10`}
        style={{ gridRowStart: minutes + 2, gridRowEnd: "span 2", gridColumnStart: num }}
      >
        <div className="relative left-2">
          <div
            className="-top-3/4 absolute align-center flex right-0 text-red-500 whitespace-nowrap bottom-0 -mr-0.5"
            // style={{ left: "-20%" }}
          >
            <div className="text-xs font-extrabold mr-1">{format(new Date(), "p")}</div>
            <div className="h-2 w-2 bg-red-500 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

const getInfo = () => {
  const date = new Date();
  return {
    dayOfWeek: date.getDay() + 1,
    minutes: differenceInMinutes(date, startOfDay(date)),
  };
};
