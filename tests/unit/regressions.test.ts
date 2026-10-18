import { afterEach, expect, test, vi } from "vitest";
import { getGfkYearMonths } from "../../lib/gfk-calendar";
import { getHolidaysForYear } from "../../lib/holidays";
import { getDaysUntilHoliday } from "../../lib/upcoming-holidays";

const dateKey = (date: Date | string) =>
  typeof date === "string" ? date : date.toISOString().slice(0, 10);
afterEach(() => vi.useRealTimers());

test("GfK 2026 includes the entire 53rd week in its final period", () => {
  const months = getGfkYearMonths(2026);
  expect(months.reduce((n, m) => n + m.weeks.length, 0)).toBe(53);
  expect(months[11].weeks).toHaveLength(5);
  expect(dateKey(months[11].weeks.at(-1)!.days.at(-1)!.date)).toBe(
    "2027-01-03",
  );
});

test("Easter 2100 is Sunday May 2, not Saturday May 1", () => {
  const easter = getHolidaysForYear(2100).find(
    (h) => h.nameEn === "Easter (Pascha)",
  )!;
  expect(dateKey(easter.date)).toBe("2100-05-02");
});

test("Black Friday is one calendar day after November 26", () => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 10, 26, 13));
  const friday = getHolidaysForYear(2026).find(
    (h) => h.nameEn === "Black Friday",
  )!;
  expect(getDaysUntilHoliday(friday.date)).toBe(1);
});

test("Great Lent remains 48 calendar dates across DST", () => {
  const lent = getHolidaysForYear(2026).filter((h) => h.type === "lent");
  expect(lent).toHaveLength(48);
  expect(dateKey(lent.at(-1)!.date)).toBe("2026-04-11");
});
