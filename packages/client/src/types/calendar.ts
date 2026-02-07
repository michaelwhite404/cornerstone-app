import Month from "./month";

export type CalendarView = "day" | "week" | "month" | "year";
export interface CalendarEvent {
  id: string;
  description: string;
  date: Date;
  timeLabel?: string;
  timeStart?: string;
  timeEnd?: string;
  color?: string;
}

export interface CalendarDate {
  month: Month;
  day: number;
  year: number;
}
