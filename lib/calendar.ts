import {
  getISOWeek,
  getISOWeekYear,
  startOfISOWeek,
  endOfISOWeek,
  eachDayOfInterval,
  startOfYear,
  endOfYear,
  format,
  getDay,
  isSameMonth,
  startOfMonth,
  endOfMonth,
  eachMonthOfInterval,
} from "date-fns";
import { uk } from "date-fns/locale";

export interface CalendarDay {
  date: Date;
  day: number;
  month: number;
  year: number;
  isoWeek: number;
  isoWeekYear: number;
  isWeekend: boolean;
  isCurrentMonth: boolean;
  isHoliday: boolean;
  holidayName?: string;
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

// Отримати номер ISO тижня для дати
export function getISOWeekNumber(date: Date): number {
  return getISOWeek(date);
}

// Отримати рік ISO тижня
export function getISOWeekYearNumber(date: Date): number {
  return getISOWeekYear(date);
}

// Отримати всі дні ISO тижня
export function getISOWeekDays(date: Date): Date[] {
  const start = startOfISOWeek(date);
  const end = endOfISOWeek(date);
  return eachDayOfInterval({ start, end });
}

// Отримати всі тижні для місяця
export function getMonthWeeks(year: number, month: number): CalendarWeek[] {
  const monthDate = new Date(year, month, 1);
  const start = startOfMonth(monthDate);
  const end = endOfMonth(monthDate);

  // Отримуємо всі дні місяця
  const days = eachDayOfInterval({ start, end });

  // Групуємо дні по ISO тижнях
  const weekMap = new Map<number, Date[]>();

  days.forEach((day) => {
    const weekNum = getISOWeek(day);
    if (!weekMap.has(weekNum)) {
      weekMap.set(weekNum, []);
    }
    weekMap.get(weekNum)!.push(day);
  });

  // Для кожного тижня, заповнюємо всі 7 днів
  const weeks: CalendarWeek[] = [];
  weekMap.forEach((weekDays, weekNum) => {
    const firstDay = weekDays[0];
    const allWeekDays = getISOWeekDays(firstDay);

    weeks.push({
      weekNumber: weekNum,
      days: allWeekDays.map((date) => createCalendarDay(date, monthDate)),
    });
  });

  return weeks.sort((a, b) => a.weekNumber - b.weekNumber);
}

// Створити об'єкт CalendarDay
export function createCalendarDay(
  date: Date,
  currentMonth: Date
): CalendarDay {
  const dayOfWeek = getDay(date);
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

  return {
    date,
    day: date.getDate(),
    month: date.getMonth(),
    year: date.getFullYear(),
    isoWeek: getISOWeek(date),
    isoWeekYear: getISOWeekYear(date),
    isWeekend,
    isCurrentMonth: isSameMonth(date, currentMonth),
    isHoliday: false,
    holidayName: undefined,
  };
}

// Отримати всі місяці року
export function getYearMonths(year: number): CalendarMonth[] {
  const start = startOfYear(new Date(year, 0, 1));
  const end = endOfYear(new Date(year, 0, 1));
  const months = eachMonthOfInterval({ start, end });

  return months.map((month) => ({
    name: format(month, "LLLL", { locale: uk }),
    monthNumber: month.getMonth(),
    year: month.getFullYear(),
    weeks: getMonthWeeks(month.getFullYear(), month.getMonth()),
  }));
}

// Форматувати назву місяця
export function formatMonthName(month: number, year: number): string {
  return format(new Date(year, month, 1), "LLLL", { locale: uk });
}

// Скорочені назви днів тижня (ISO 8601: Пн, Вт, Ср, Чт, Пт, Сб, Нд)
export const WEEKDAY_NAMES_SHORT: readonly string[] = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"] as const;
