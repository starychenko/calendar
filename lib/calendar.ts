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
import type { Locale as DateFnsLocale } from "date-fns";

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

  // Сортуємо тижні за датою першого дня, а не за номером тижня
  // Це виправляє проблему з 53 тижнем у січні, який має бути першим
  return weeks.sort((a, b) => {
    const dateA = a.days[0].date.getTime();
    const dateB = b.days[0].date.getTime();
    return dateA - dateB;
  });
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
export function getYearMonths(year: number, dateFnsLocale?: DateFnsLocale): CalendarMonth[] {
  const locale = dateFnsLocale ?? uk;
  const start = startOfYear(new Date(year, 0, 1));
  const end = endOfYear(new Date(year, 0, 1));
  const months = eachMonthOfInterval({ start, end });

  return months.map((month) => ({
    name: format(month, "LLLL", { locale }),
    monthNumber: month.getMonth(),
    year: month.getFullYear(),
    weeks: getMonthWeeks(month.getFullYear(), month.getMonth()),
  }));
}

// Форматувати назву місяця
export function formatMonthName(month: number, year: number, dateFnsLocale?: DateFnsLocale): string {
  return format(new Date(year, month, 1), "LLLL", { locale: dateFnsLocale ?? uk });
}
