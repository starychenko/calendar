import type { Locale as DateFnsLocale } from "date-fns";
import {
  createCalendarDay,
  formatMonthName,
  type CalendarMonth,
  type CalendarWeek,
} from "./calendar";
import {
  addCalendarDays,
  calendarDate,
  differenceInDays,
  startOfCalendarWeek,
} from "./date-only";

// Project convention confirmed 2026-10-18: keep the existing pattern and
// allocate the ISO year's extra week to the final fiscal period.
export const GFK_MONTH_WEEKS = [5, 4, 4, 4, 5, 4, 4, 4, 5, 5, 4, 4] as const;
export function getGfkYearStart(year: number) {
  return startOfCalendarWeek(calendarDate(year, 0, 4));
}
export function getGfkWeeksInMonth(month: number, year: number): number {
  if (!Number.isInteger(month) || month < 0 || month > 11)
    throw new RangeError("Invalid fiscal period");
  const extra =
    differenceInDays(getGfkYearStart(year + 1), getGfkYearStart(year)) / 7 - 52;
  return GFK_MONTH_WEEKS[month] + (month === 11 ? extra : 0);
}
export function getGfkMonthWeeks(year: number, month: number): CalendarWeek[] {
  const length = getGfkWeeksInMonth(month, year);
  const offset = GFK_MONTH_WEEKS.slice(0, month).reduce<number>(
    (a, b) => a + b,
    0,
  );
  const start = getGfkYearStart(year);
  return Array.from({ length }, (_, i) => {
    const weekNumber = offset + i + 1;
    return {
      weekNumber,
      days: Array.from({ length: 7 }, (_, day) => ({
        ...createCalendarDay(
          addCalendarDays(start, (offset + i) * 7 + day),
          calendarDate(year, month, 1),
        ),
        fiscalWeek: weekNumber,
      })),
    };
  });
}
export function getGfkYearMonths(
  year: number,
  locale?: DateFnsLocale,
): CalendarMonth[] {
  return Array.from({ length: 12 }, (_, monthNumber) => ({
    name: formatMonthName(monthNumber, year, locale),
    monthNumber,
    year,
    weeks: getGfkMonthWeeks(year, monthNumber),
  }));
}
