import {
  startOfYear,
  endOfYear,
  addDays,
  startOfWeek,
  eachWeekOfInterval,
  format,
  isSameMonth,
  isSameDay,
  getDay,
} from "date-fns";
import { uk } from "date-fns/locale";
import { CalendarDay, CalendarWeek, CalendarMonth } from "./calendar";

// GfK (Growth from Knowledge) Period Mapping
// Місяці мають фіксовану кількість тижнів: 4 або 5
// Патерн: 5-4-4, 4-5-4, 4-4-5 тижнів на квартал

// Розподіл тижнів по місяцях за GfK методологією
const GFK_MONTH_WEEKS: readonly number[] = [
  5, 4, 4, // Q1: Січень(5), Лютий(4), Березень(4)
  4, 5, 4, // Q2: Квітень(4), Травень(5), Червень(4)
  4, 4, 5, // Q3: Липень(4), Серпень(4), Вересень(5)
  5, 4, 4, // Q4: Жовтень(5), Листопад(4), Грудень(4)
] as const;

// Отримати початок GfK року (перший понеділок року або останній понеділок попереднього року)
function getGfkYearStart(year: number): Date {
  const yearStart = startOfYear(new Date(year, 0, 1));
  const firstMonday = startOfWeek(yearStart, { weekStartsOn: 1 });

  // Якщо перший понеділок занадто далеко від початку року (більше 3 днів),
  // беремо понеділок попереднього тижня
  if (firstMonday > yearStart && firstMonday.getDate() > 4) {
    return addDays(firstMonday, -7);
  }

  return firstMonday;
}

// Отримати всі тижні GfK для місяця
export function getGfkMonthWeeks(year: number, month: number): CalendarWeek[] {
  // Визначаємо, скільки тижнів має цей місяць за GfK
  const weeksInMonth = GFK_MONTH_WEEKS[month];

  // Визначаємо початковий тиждень для цього місяця
  let weekOffset = 0;
  for (let i = 0; i < month; i++) {
    weekOffset += GFK_MONTH_WEEKS[i];
  }

  const gfkYearStart = getGfkYearStart(year);
  const weeks: CalendarWeek[] = [];
  const monthDate = new Date(year, month, 1);

  for (let i = 0; i < weeksInMonth; i++) {
    const weekNumber = weekOffset + i + 1;
    const weekStart = addDays(gfkYearStart, (weekOffset + i) * 7);

    // Генеруємо 7 днів тижня
    const days: CalendarDay[] = [];
    for (let d = 0; d < 7; d++) {
      const date = addDays(weekStart, d);
      const dayOfWeek = getDay(date);
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const today = new Date();

      days.push({
        date,
        day: date.getDate(),
        month: date.getMonth(),
        year: date.getFullYear(),
        isoWeek: weekNumber, // Використовуємо GfK номер замість ISO
        isoWeekYear: year,
        isWeekend,
        isCurrentMonth: isSameMonth(date, monthDate),
        isToday: isSameDay(date, today),
        isHoliday: false,
        holidayName: undefined,
      });
    }

    weeks.push({
      weekNumber,
      days,
    });
  }

  return weeks;
}

// Отримати всі місяці року за GfK методологією
export function getGfkYearMonths(year: number): CalendarMonth[] {
  const months: CalendarMonth[] = [];

  for (let month = 0; month < 12; month++) {
    const monthDate = new Date(year, month, 1);

    months.push({
      name: format(monthDate, "LLLL", { locale: uk }),
      monthNumber: month,
      year,
      weeks: getGfkMonthWeeks(year, month),
    });
  }

  return months;
}

// Отримати кількість тижнів у місяці за GfK
export function getGfkWeeksInMonth(month: number): number {
  return GFK_MONTH_WEEKS[month];
}
