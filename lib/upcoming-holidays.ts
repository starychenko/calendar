import { addDays, format, isSameDay, isAfter, isBefore } from "date-fns";
import { uk } from "date-fns/locale";
import { getHolidaysForDate, getHolidaysForYear, Holiday } from "./holidays";

export interface HolidayGroup {
  name: string;
  date?: Date; // Для одиночних свят
  startDate?: Date; // Для періодів (піст)
  endDate?: Date; // Для періодів (піст)
  type: Holiday["type"];
  isPeriod: boolean; // true для Великого посту
  daysCount?: number; // Кількість днів для періоду
}

/**
 * Helper: отримати сьогоднішню дату в UTC (для consistency з lib/holidays.ts)
 * Використовує UTC щоб уникнути timezone проблем при порівнянні з святами
 */
function getTodayUTC(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0, 0));
}

/**
 * Отримати свята на наступні N днів від сьогодні
 * Групує послідовні дні Великого посту в один запис з періодом
 */
export function getUpcomingHolidays(daysAhead: number = 60): HolidayGroup[] {
  const today = getTodayUTC();
  const endDate = addDays(today, daysAhead);
  const currentYear = today.getFullYear();
  const nextYear = endDate.getFullYear();

  // Отримуємо свята для поточного та наступного року (якщо діапазон перетинає роки)
  const allYearHolidays = [
    ...getHolidaysForYear(currentYear),
    ...(nextYear > currentYear ? getHolidaysForYear(nextYear) : []),
  ];

  // Оптимізація: одна фільтрація замість двох + перевірка діапазону дат
  const { lentDays, upcomingOtherHolidays, hasLentInRange } = allYearHolidays.reduce(
    (acc, holiday) => {
      const isInRange =
        (isSameDay(holiday.date, today) || isAfter(holiday.date, today)) &&
        (isSameDay(holiday.date, endDate) || isBefore(holiday.date, endDate));

      if (holiday.type === "lent") {
        acc.lentDays.push(holiday);
        if (isInRange) {
          acc.hasLentInRange = true;
        }
      } else if (isInRange) {
        acc.upcomingOtherHolidays.push(holiday);
      }

      return acc;
    },
    {
      lentDays: [] as Holiday[],
      upcomingOtherHolidays: [] as Holiday[],
      hasLentInRange: false,
    }
  );

  // Якщо хоча б один день посту в діапазоні, додаємо ВСІ дні посту
  const holidaysToGroup = hasLentInRange
    ? [...upcomingOtherHolidays, ...lentDays]
    : upcomingOtherHolidays;

  return groupConsecutiveLentDays(holidaysToGroup, hasLentInRange);
}

/**
 * Групує послідовні дні Великого посту в один запис з періодом
 * Інші свята залишаються окремими записами
 */
export function groupConsecutiveLentDays(
  holidays: Holiday[],
  hasLentDays: boolean = false
): HolidayGroup[] {
  // Оптимізація: одна фільтрація і сортування замість кількох
  const { lentDays, otherHolidays } = holidays.reduce(
    (acc, holiday) => {
      if (holiday.type === "lent") {
        acc.lentDays.push(holiday);
      } else {
        acc.otherHolidays.push(holiday);
      }
      return acc;
    },
    { lentDays: [] as Holiday[], otherHolidays: [] as Holiday[] }
  );

  const grouped: HolidayGroup[] = [];

  // Якщо є дні посту, групуємо їх в один період
  if (hasLentDays && lentDays.length > 0) {
    // Сортуємо на місці (без створення копії)
    lentDays.sort((a, b) => a.date.getTime() - b.date.getTime());

    grouped.push({
      name: lentDays[0].name,
      startDate: lentDays[0].date,
      endDate: lentDays[lentDays.length - 1].date,
      type: "lent",
      isPeriod: true,
      daysCount: lentDays.length,
    });
  }

  // Сортуємо і додаємо інші свята
  otherHolidays.sort((a, b) => a.date.getTime() - b.date.getTime());

  otherHolidays.forEach((holiday) => {
    grouped.push({
      name: holiday.name,
      date: holiday.date,
      type: holiday.type,
      isPeriod: false,
    });
  });

  // Фінальне сортування всіх записів за датою
  grouped.sort((a, b) => {
    const dateA = a.isPeriod ? a.startDate! : a.date!;
    const dateB = b.isPeriod ? b.startDate! : b.date!;
    return dateA.getTime() - dateB.getTime();
  });

  return grouped;
}

/**
 * Отримати свята на сьогодні
 */
export function getTodayHolidays(): HolidayGroup[] {
  const today = getTodayUTC();
  const holidays = getHolidaysForDate(today);

  return holidays.map((holiday) => ({
    name: holiday.name,
    date: holiday.date,
    type: holiday.type,
    isPeriod: false,
  }));
}

/**
 * Форматувати дату для відображення (коротко)
 * Приклад: "9 січ"
 */
export function formatShortDate(date: Date): string {
  return format(date, "d MMM", { locale: uk });
}

/**
 * Форматувати період для відображення
 * Приклад: "10 лют - 28 бер (47 днів)"
 */
export function formatPeriod(
  startDate: Date,
  endDate: Date,
  daysCount: number
): string {
  const start = formatShortDate(startDate);
  const end = formatShortDate(endDate);
  return `${start} - ${end} (${daysCount} ${getDaysWord(daysCount)})`;
}

/**
 * Отримати правильну форму слова "день/дні/днів"
 */
function getDaysWord(count: number): string {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return "днів";
  }

  if (lastDigit === 1) {
    return "день";
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return "дні";
  }

  return "днів";
}

/**
 * Порахувати кількість днів до свята
 * Повертає 0 якщо свято сьогодні, від'ємне число якщо свято вже минуло
 */
export function getDaysUntilHoliday(holidayDate: Date): number {
  const today = getTodayUTC();
  const target = new Date(holidayDate);
  target.setUTCHours(12, 0, 0, 0);

  const diffTime = target.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}

/**
 * Форматувати текст "через X днів" або "сьогодні"
 */
export function formatDaysUntil(daysUntil: number): string {
  if (daysUntil === 0) {
    return "сьогодні";
  }

  if (daysUntil === 1) {
    return "завтра";
  }

  if (daysUntil < 0) {
    const daysAgo = Math.abs(daysUntil);
    return `${daysAgo} ${getDaysWord(daysAgo)} тому`;
  }

  return `через ${daysUntil} ${getDaysWord(daysUntil)}`;
}
