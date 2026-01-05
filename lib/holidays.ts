import { getYear, setYear, setMonth, setDate } from "date-fns";

export interface Holiday {
  name: string;
  date: Date;
  type: "national" | "international" | "religious" | "commercial";
  isWeekend?: boolean;
}

// Cache for holidays by year to avoid recalculation
const holidaysCache = new Map<number, Holiday[]>();

// Функція для обчислення Великодня (Easter) за алгоритмом Гауса
function getEasterDate(year: number): Date {
  // Validate year range for Easter calculation accuracy
  if (year < 1900 || year > 2100) {
    throw new Error(`Easter calculation is only valid for years 1900-2100, received: ${year}`);
  }
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31) - 1;
  const day = ((h + l - 7 * m + 114) % 31) + 1;

  return new Date(year, month, day);
}

// Функція для обчислення Трійці (50 днів після Великодня)
function getTrinityDate(year: number): Date {
  const easter = getEasterDate(year);
  const trinity = new Date(easter);
  trinity.setDate(easter.getDate() + 49);
  return trinity;
}

// Функція для обчислення Чорної п'ятниці (четверта п'ятниця листопада)
function getBlackFriday(year: number): Date {
  // День подяки в США - четвертий четвер листопада
  const november = new Date(year, 10, 1); // Листопад
  let thursdayCount = 0;
  let thanksgiving = new Date(november);

  for (let day = 1; day <= 30; day++) {
    const current = new Date(year, 10, day);
    if (current.getDay() === 4) { // Четвер
      thursdayCount++;
      if (thursdayCount === 4) {
        thanksgiving = current;
        break;
      }
    }
  }

  // Чорна п'ятниця - наступний день після Дня подяки
  const blackFriday = new Date(thanksgiving);
  blackFriday.setDate(thanksgiving.getDate() + 1);
  return blackFriday;
}

// Функція для обчислення Кіберпонеділка (понеділок після Чорної п'ятниці)
function getCyberMonday(year: number): Date {
  const blackFriday = getBlackFriday(year);
  const cyberMonday = new Date(blackFriday);
  cyberMonday.setDate(blackFriday.getDate() + 3);
  return cyberMonday;
}

// Отримати всі свята для конкретного року
export function getHolidaysForYear(year: number): Holiday[] {
  // Check cache first
  if (holidaysCache.has(year)) {
    return holidaysCache.get(year)!;
  }

  const holidays: Holiday[] = [
    // Національні свята України
    {
      name: "Новий рік",
      date: new Date(year, 0, 1),
      type: "national",
    },
    {
      name: "Міжнародний жіночий день",
      date: new Date(year, 2, 8),
      type: "international",
    },
    {
      name: "День праці",
      date: new Date(year, 4, 1),
      type: "national",
    },
    {
      name: "День пам'яті та перемоги над нацизмом у Другій світовій війні",
      date: new Date(year, 4, 8),
      type: "national",
    },
    {
      name: "День Конституції України",
      date: new Date(year, 5, 28),
      type: "national",
    },
    {
      name: "День Української Державності",
      date: new Date(year, 6, 15),
      type: "national",
    },
    {
      name: "День незалежності України",
      date: new Date(year, 7, 24),
      type: "national",
    },
    {
      name: "День захисників і захисниць України",
      date: new Date(year, 9, 1),
      type: "national",
    },
    {
      name: "Різдво Христове",
      date: new Date(year, 11, 25),
      type: "religious",
    },

    // Міжнародні та комерційні свята
    {
      name: "День Святого Валентина",
      date: new Date(year, 1, 14),
      type: "international",
    },

    // Великодень (плаваюча дата)
    {
      name: "Великдень",
      date: getEasterDate(year),
      type: "religious",
    },

    // Трійця (плаваюча дата)
    {
      name: "Трійця",
      date: getTrinityDate(year),
      type: "religious",
    },

    // Комерційні свята
    {
      name: "Чорна п'ятниця",
      date: getBlackFriday(year),
      type: "commercial",
    },
    {
      name: "Кіберпонеділок",
      date: getCyberMonday(year),
      type: "commercial",
    },
  ];

  // Cache the result before returning
  holidaysCache.set(year, holidays);
  return holidays;
}

// Перевірити, чи є дата святом
export function getHolidayForDate(date: Date): Holiday | undefined {
  const year = getYear(date);
  const holidays = getHolidaysForYear(year);

  return holidays.find(
    (holiday) =>
      holiday.date.getDate() === date.getDate() &&
      holiday.date.getMonth() === date.getMonth() &&
      holiday.date.getFullYear() === date.getFullYear()
  );
}
