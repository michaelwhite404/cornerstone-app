import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  startOfDay,
  startOfYear,
  endOfYear,
  endOfDay,
} from "date-fns";
import { CalendarView } from "../types/calendar";

const startEnd = {
  day: {
    start: startOfDay,
    end: endOfDay,
  },
  week: {
    start: startOfWeek,
    end: endOfWeek,
  },
  month: {
    start: startOfMonth,
    end: endOfMonth,
  },
  year: {
    start: startOfYear,
    end: endOfYear,
  },
};

export const start = (date: Date, view: CalendarView) => startEnd[view].start(date);
export const end = (date: Date, view: CalendarView) => startEnd[view].end(date);
