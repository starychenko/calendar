import { expect, test } from "vitest";
import {
  getMonthWeeks,
  getISOWeekNumber,
  getISOWeekYearNumber,
} from "../../lib/calendar";
import { getGfkYearMonths } from "../../lib/gfk-calendar";
import { getHolidaysForDate, getHolidaysForYear } from "../../lib/holidays";
import {
  calendarDate,
  parseCalendarDate,
  addCalendarDays,
  differenceInDays,
  weekday,
  formatCalendarDate,
} from "../../lib/date-only";
import { getUpcomingHolidays } from "../../lib/upcoming-holidays";

test("ISO boundary fixtures follow the week containing January 4", () => {
  for (const [date, week, year] of [
    ["2005-01-01", 53, 2004],
    ["2021-01-01", 53, 2020],
    ["2024-12-30", 1, 2025],
    ["1900-01-01", 1, 1900],
  ] as const) {
    expect([
      getISOWeekNumber(parseCalendarDate(date)),
      getISOWeekYearNumber(parseCalendarDate(date)),
    ]).toEqual([week, year]);
  }
});
test("all supported ISO months have every civil date exactly once and full Monday weeks", () => {
  for (let year = 1900; year <= 2100; year++)
    for (let month = 0; month < 12; month++) {
      const weeks = getMonthWeeks(year, month);
      const days = weeks.flatMap((w) => w.days).filter((d) => d.isCurrentMonth);
      const expected = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
      expect(days.length, year + "-" + month).toBe(expected);
      expect(new Set(days.map((d) => d.date)).size).toBe(expected);
      expect(days[0].day).toBe(1);
      expect(days.at(-1)!.day).toBe(expected);
      for (const week of weeks) {
        expect(week.days).toHaveLength(7);
        expect(weekday(week.days[0].date)).toBe(1);
        expect(differenceInDays(week.days[6].date, week.days[0].date)).toBe(6);
      }
    }
});
test("every GfK year has 52/53 contiguous weeks and joins the next year", () => {
  for (let year = 1900; year <= 2100; year++) {
    const months = getGfkYearMonths(year);
    const weeks = months.flatMap((m) => m.weeks);
    const days = weeks.flatMap((w) => w.days);
    expect([52, 53]).toContain(weeks.length);
    expect(new Set(days.map((d) => d.date)).size).toBe(days.length);
    expect(differenceInDays(days.at(-1)!.date, days[0].date) + 1).toBe(
      days.length,
    );
    expect(addCalendarDays(days.at(-1)!.date, 1)).toBe(
      getGfkYearMonths(year + 1)[0].weeks[0].days[0].date,
    );
    expect(months[11].weeks.length).toBe(weeks.length === 53 ? 5 : 4);
    expect(weeks.at(-1)!.weekNumber).toBe(weeks.length);
  }
});
test("Easter is always Sunday and Lent ends on its preceding Saturday", () => {
  for (let year = 1900; year <= 2100; year++) {
    const all = getHolidaysForYear(year);
    const easter = all.find((h) => h.nameEn === "Easter (Pascha)")!;
    const lent = all.filter((h) => h.type === "lent");
    expect(weekday(easter.date)).toBe(0);
    expect(lent).toHaveLength(48);
    expect(addCalendarDays(lent.at(-1)!.date, 1)).toBe(easter.date);
  }
});
test("holiday identity and formatting are independent of the machine time zone", () => {
  expect(
    getHolidaysForDate(calendarDate(2026, 0, 1)).map((h) => h.nameEn),
  ).toContain("New Year's Day");
  expect(getHolidaysForDate(calendarDate(2026, 0, 2))).toHaveLength(0);
  expect(formatCalendarDate(calendarDate(2026, 0, 1), "en", "full")).toBe(
    "January 1, 2026",
  );
  const august = getGfkYearMonths(2026)
    .flatMap((m) => m.weeks)
    .flatMap((w) => w.days)
    .find((d) => d.date === "2026-08-24")!;
  expect(getHolidaysForDate(august.date).map((h) => h.nameEn)).toContain(
    "Independence Day of Ukraine",
  );
});
test("long upcoming ranges keep separate Lent periods and include intervening years", () => {
  const groups = getUpcomingHolidays(800, calendarDate(2025, 0, 1));
  const lent = groups.filter((h) => h.isPeriod);
  expect(lent.length).toBeGreaterThanOrEqual(2);
  for (const period of lent) expect(period.daysCount).toBe(48);
  expect(groups.some((h) => !h.isPeriod && h.date === "2027-01-01")).toBe(true);
});
test("date parsing rejects impossible or ambiguous dates", () => {
  for (const value of [
    "2026-02-30",
    "2026-1-1",
    "invalid",
    "2026-01-01T00:00Z",
  ])
    expect(() => parseCalendarDate(value)).toThrow();
  expect(addCalendarDays(parseCalendarDate("2024-02-28"), 1)).toBe(
    "2024-02-29",
  );
  expect(addCalendarDays(parseCalendarDate("2100-02-28"), 1)).toBe(
    "2100-03-01",
  );
});
