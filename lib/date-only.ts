/** A proleptic Gregorian calendar date, not an instant or a local midnight. */
export type CalendarDate = string & { readonly calendarDate: unique symbol };
const DAY_MS = 86_400_000;

export function calendarDate(
  year: number,
  month: number,
  day: number,
): CalendarDate {
  const value = new Date(Date.UTC(year, month, day));
  // Date.UTC treats 0..99 as 1900..1999; our public range starts at 1900.
  if (!Number.isFinite(value.getTime()) || year < 100 || year > 9999) {
    throw new RangeError("Invalid calendar date");
  }
  return value.toISOString().slice(0, 10) as CalendarDate;
}

export function parseCalendarDate(value: string): CalendarDate {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value))
    throw new RangeError("Invalid calendar date");
  const [year, month, day] = value.split("-").map(Number);
  const result = calendarDate(year, month - 1, day);
  if (result !== value) throw new RangeError("Invalid calendar date");
  return result;
}

export function dateParts(date: CalendarDate) {
  const [year, month, day] = date.split("-").map(Number);
  return { year, month: month - 1, day };
}

export function dateInstant(date: CalendarDate): Date {
  return new Date(date + "T00:00:00.000Z");
}

export function addCalendarDays(
  date: CalendarDate,
  days: number,
): CalendarDate {
  return new Date(dateInstant(date).getTime() + days * DAY_MS)
    .toISOString()
    .slice(0, 10) as CalendarDate;
}

export function differenceInDays(
  later: CalendarDate,
  earlier: CalendarDate,
): number {
  return (
    (dateInstant(later).getTime() - dateInstant(earlier).getTime()) / DAY_MS
  );
}

export function weekday(date: CalendarDate): number {
  return dateInstant(date).getUTCDay();
}

export function startOfCalendarWeek(date: CalendarDate): CalendarDate {
  return addCalendarDays(date, -((weekday(date) + 6) % 7));
}

/** Only this boundary reads the visitor's local time zone. Domain dates never do. */
export function todayDate(now = new Date()): CalendarDate {
  return calendarDate(now.getFullYear(), now.getMonth(), now.getDate());
}

const formatters = new Map<string, Intl.DateTimeFormat>();
export function formatCalendarDate(
  date: CalendarDate,
  locale: string,
  style: "short" | "month" | "full" = "short",
): string {
  const key = locale + ":" + style;
  let formatter = formatters.get(key);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat(locale, {
      timeZone: "UTC",
      ...(style === "month"
        ? { month: "long" }
        : style === "full"
          ? { day: "numeric", month: "long", year: "numeric" }
          : { day: "numeric", month: "short" }),
    });
    formatters.set(key, formatter);
  }
  return formatter.format(dateInstant(date));
}
