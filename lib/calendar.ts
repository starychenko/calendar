import type { Locale as DateFnsLocale } from "date-fns";
import {
  addCalendarDays,
  calendarDate,
  dateParts,
  differenceInDays,
  formatCalendarDate,
  startOfCalendarWeek,
  weekday,
  type CalendarDate,
} from "./date-only";

export interface CalendarDay {
  date: CalendarDate;
  day: number;
  month: number;
  year: number;
  isoWeek: number;
  isoWeekYear: number;
  fiscalWeek?: number;
  isWeekend: boolean;
  isCurrentMonth: boolean;
}
export interface CalendarWeek {
  weekNumber: number;
  days: CalendarDay[];
}
export interface CalendarMonth {
  name: string;
  monthNumber: number;
  year: number;
  weeks: CalendarWeek[];
}

export function getISOWeekYearNumber(date: CalendarDate): number {
  return dateParts(addCalendarDays(startOfCalendarWeek(date), 3)).year;
}
export function getISOWeekNumber(date: CalendarDate): number {
  const year = getISOWeekYearNumber(date);
  return (
    differenceInDays(
      startOfCalendarWeek(date),
      startOfCalendarWeek(calendarDate(year, 0, 4)),
    ) /
      7 +
    1
  );
}
export function getISOWeekDays(date: CalendarDate): CalendarDate[] {
  const start = startOfCalendarWeek(date);
  return Array.from({ length: 7 }, (_, i) => addCalendarDays(start, i));
}
export function createCalendarDay(
  date: CalendarDate,
  currentMonth: CalendarDate,
): CalendarDay {
  const parts = dateParts(date);
  const current = dateParts(currentMonth);
  return {
    date,
    ...parts,
    isoWeek: getISOWeekNumber(date),
    isoWeekYear: getISOWeekYearNumber(date),
    isWeekend: [0, 6].includes(weekday(date)),
    isCurrentMonth:
      parts.year === current.year && parts.month === current.month,
  };
}
export function getMonthWeeks(year: number, month: number): CalendarWeek[] {
  const start = calendarDate(year, month, 1);
  const end = calendarDate(year, month + 1, 0);
  const weeks: CalendarWeek[] = [];
  for (
    let week = startOfCalendarWeek(start);
    week <= end;
    week = addCalendarDays(week, 7)
  ) {
    weeks.push({
      weekNumber: getISOWeekNumber(week),
      days: getISOWeekDays(week).map((date) => createCalendarDay(date, start)),
    });
  }
  return weeks;
}
export function formatMonthName(
  month: number,
  year: number,
  locale?: DateFnsLocale,
): string {
  return formatCalendarDate(
    calendarDate(year, month, 1),
    locale?.code ?? "uk",
    "month",
  );
}
export function getYearMonths(
  year: number,
  locale?: DateFnsLocale,
): CalendarMonth[] {
  return Array.from({ length: 12 }, (_, monthNumber) => ({
    name: formatMonthName(monthNumber, year, locale),
    monthNumber,
    year,
    weeks: getMonthWeeks(year, monthNumber),
  }));
}
