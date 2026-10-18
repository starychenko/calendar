import type { Locale as DateFnsLocale } from "date-fns";
import {
  addCalendarDays,
  dateParts,
  differenceInDays,
  formatCalendarDate,
  todayDate,
  type CalendarDate,
} from "./date-only";
import {
  getHolidaysForDate,
  getHolidaysForYear,
  type Holiday,
} from "./holidays";

type NamedHoliday = Pick<Holiday, "name" | "nameEn" | "type">;
export type HolidayGroup = NamedHoliday &
  (
    | { isPeriod: false; date: CalendarDate }
    | {
        isPeriod: true;
        startDate: CalendarDate;
        endDate: CalendarDate;
        daysCount: number;
      }
  );

export function groupConsecutiveLentDays(
  holidays: readonly Holiday[],
  hasLentDays = false,
): HolidayGroup[] {
  const grouped: HolidayGroup[] = holidays
    .filter((h) => h.type !== "lent")
    .map((h) => ({ ...h, isPeriod: false }));
  if (hasLentDays) {
    const lent = holidays
      .filter((h) => h.type === "lent")
      .sort((a, b) => a.date.localeCompare(b.date));
    for (let i = 0; i < lent.length;) {
      const first = lent[i];
      let end = i;
      while (
        end + 1 < lent.length &&
        differenceInDays(lent[end + 1].date, lent[end].date) === 1
      )
        end++;
      grouped.push({
        name: first.name,
        nameEn: first.nameEn,
        type: "lent",
        isPeriod: true,
        startDate: first.date,
        endDate: lent[end].date,
        daysCount: end - i + 1,
      });
      i = end + 1;
    }
  }
  return grouped.sort((a, b) =>
    (a.isPeriod ? a.startDate : a.date).localeCompare(
      b.isPeriod ? b.startDate : b.date,
    ),
  );
}

export function getUpcomingHolidays(
  daysAhead = 60,
  today = todayDate(),
): HolidayGroup[] {
  if (!Number.isInteger(daysAhead) || daysAhead < 0 || daysAhead > 3660)
    throw new RangeError("Invalid holiday horizon");
  const end = addCalendarDays(today, daysAhead);
  const all: Holiday[] = [];
  for (let year = dateParts(today).year; year <= dateParts(end).year; year++)
    all.push(...getHolidaysForYear(year));
  // Group each Lent separately before intersecting the requested date range.
  return groupConsecutiveLentDays(all, true).filter((h) =>
    h.isPeriod
      ? h.endDate >= today && h.startDate <= end
      : h.date >= today && h.date <= end,
  );
}
export function getTodayHolidays(today = todayDate()): HolidayGroup[] {
  return getHolidaysForDate(today).map((h) => ({ ...h, isPeriod: false }));
}
export function formatShortDate(
  date: CalendarDate,
  locale?: DateFnsLocale,
): string {
  return formatCalendarDate(date, locale?.code ?? "uk");
}
export function getDaysUntilHoliday(
  date: CalendarDate,
  today = todayDate(),
): number {
  return differenceInDays(date, today);
}
