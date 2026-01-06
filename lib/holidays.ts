import { getYear, isSameDay } from "date-fns";

export interface Holiday {
  name: string;
  date: Date;
  type: "national" | "international" | "religious" | "commercial" | "lent";
  isWeekend?: boolean;
}

// Cache for holidays by year to avoid recalculation
const holidaysCache = new Map<number, Holiday[]>();

// Функція для обчислення православного Великодня за алгоритмом Meeus (Julian calendar)
function getEasterDate(year: number): Date {
  // Validate year range for Easter calculation accuracy
  if (year < 1900 || year > 2100) {
    throw new Error(`Easter calculation is only valid for years 1900-2100, received: ${year}`);
  }

  // Алгоритм для юліанського календаря (православна Пасха)
  const a = year % 4;
  const b = year % 7;
  const c = year % 19;
  const d = (19 * c + 15) % 30;
  const e = (2 * a + 4 * b - d + 34) % 7;
  const month = Math.floor((d + e + 114) / 31) - 1;
  const day = ((d + e + 114) % 31) + 1;

  // Конвертуємо з юліанського в григоріанський календар (+13 днів для 1900-2099)
  // Використовуємо UTC для уникнення проблем з літнім часом
  const julianDate = new Date(Date.UTC(year, month, day, 12, 0, 0, 0));
  const julianTimestamp = julianDate.getTime();
  const gregorianTimestamp = julianTimestamp + (13 * 24 * 60 * 60 * 1000);

  return new Date(gregorianTimestamp);
}

/**
 * Розрахунок дати відносно Великодня
 * @param year - Рік
 * @param daysOffset - Кількість днів до (від'ємне) або після (додатнє) Великодня
 * @returns Розрахована дата
 * @example
 * // Трійця (49 днів після Великодня)
 * getEasterBasedDate(2025, 49)
 *
 * // Вербна неділя (7 днів до Великодня)
 * getEasterBasedDate(2025, -7)
 */
function getEasterBasedDate(year: number, daysOffset: number): Date {
  const easter = getEasterDate(year);
  const easterTimestamp = easter.getTime();
  const offsetTimestamp = easterTimestamp + (daysOffset * 24 * 60 * 60 * 1000);
  return new Date(offsetTimestamp);
}

/**
 * Генерує масив свят для всіх днів Великого посту
 * @param year - Рік
 * @returns Масив Holiday об'єктів для кожного дня посту
 */
function getGreatLentPeriod(year: number): Holiday[] {
  const lentStart = getEasterBasedDate(year, -48); // Понеділок після Прощеної неділі
  const lentEnd = getEasterBasedDate(year, -1); // Субота перед Великоднем (Велика субота)

  const lentDays: Holiday[] = [];
  const currentDate = new Date(lentStart);

  while (currentDate <= lentEnd) {
    lentDays.push({
      name: "Великий піст",
      date: new Date(currentDate),
      type: "lent",
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return lentDays;
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

// Допоміжна функція для створення дати без впливу часових поясів
function createDate(year: number, month: number, day: number): Date {
  return new Date(Date.UTC(year, month, day, 12, 0, 0, 0));
}

// Національні свята України
function getNationalHolidays(year: number): Holiday[] {
  return [
    { name: "Новий рік", date: createDate(year, 0, 1), type: "national" },
    { name: "День праці", date: createDate(year, 4, 1), type: "national" },
    {
      name: "День пам'яті та перемоги над нацизмом у Другій світовій війні",
      date: createDate(year, 4, 8),
      type: "national",
    },
    { name: "День Конституції України", date: createDate(year, 5, 28), type: "national" },
    { name: "День Української Державності", date: createDate(year, 6, 15), type: "national" },
    { name: "День незалежності України", date: createDate(year, 7, 24), type: "national" },
    {
      name: "День захисників і захисниць України",
      date: createDate(year, 9, 1),
      type: "national",
    },
  ];
}

// Фіксовані релігійні свята
function getFixedReligiousHolidays(year: number): Holiday[] {
  return [
    // Січень
    { name: "Богоявлення (Водохреще)", date: createDate(year, 0, 6), type: "religious" },

    // Лютий
    { name: "Стрітення Господнє", date: createDate(year, 1, 2), type: "religious" },

    // Березень
    { name: "Благовіщення", date: createDate(year, 2, 25), type: "religious" },

    // Квітень
    { name: "Святого Юрія (Георгія) Переможця", date: createDate(year, 3, 23), type: "religious" },

    // Червень
    {
      name: "Різдво Іоанна Хрестителя (Івана Купала)",
      date: createDate(year, 5, 24),
      type: "religious",
    },
    { name: "Апостолів Петра і Павла", date: createDate(year, 5, 29), type: "religious" },

    // Серпень
    {
      name: "Преображення Господнє (Яблучний Спас)",
      date: createDate(year, 7, 6),
      type: "religious",
    },
    { name: "Успіння Пресвятої Богородиці", date: createDate(year, 7, 15), type: "religious" },

    // Вересень
    { name: "Різдво Пресвятої Богородиці", date: createDate(year, 8, 8), type: "religious" },
    {
      name: "Воздвиження Хреста Господнього",
      date: createDate(year, 8, 14),
      type: "religious",
    },

    // Листопад
    { name: "Собор Архистратига Михаїла", date: createDate(year, 10, 8), type: "religious" },
    {
      name: "Введення в храм Пресвятої Богородиці",
      date: createDate(year, 10, 21),
      type: "religious",
    },

    // Грудень
    { name: "Святого Миколая", date: createDate(year, 11, 6), type: "religious" },
    { name: "Різдво Христове", date: createDate(year, 11, 25), type: "religious" },
    { name: "Щедрий вечір (Маланки)", date: createDate(year, 11, 31), type: "religious" },
  ];
}

// Рухомі релігійні свята (залежать від дати Великодня)
function getMovableReligiousHolidays(year: number): Holiday[] {
  return [
    { name: "Прощена неділя", date: getEasterBasedDate(year, -49), type: "religious" },
    { name: "Вербна неділя", date: getEasterBasedDate(year, -7), type: "religious" },
    { name: "Великдень", date: getEasterDate(year), type: "religious" },
    { name: "Вознесіння Господнє", date: getEasterBasedDate(year, 39), type: "religious" },
    { name: "Трійця", date: getEasterBasedDate(year, 49), type: "religious" },
  ];
}

// Міжнародні свята
function getInternationalHolidays(year: number): Holiday[] {
  return [
    { name: "День Святого Валентина", date: createDate(year, 1, 14), type: "international" },
    { name: "Міжнародний жіночий день", date: createDate(year, 2, 8), type: "international" },
  ];
}

// Комерційні свята
function getCommercialHolidays(year: number): Holiday[] {
  const blackFriday = getBlackFriday(year);
  const cyberMonday = getCyberMonday(year);

  return [
    { name: "Чорна п'ятниця", date: blackFriday, type: "commercial" },
    { name: "Кіберпонеділок", date: cyberMonday, type: "commercial" },
  ];
}

// Отримати всі свята для конкретного року
export function getHolidaysForYear(year: number): Holiday[] {
  // Check cache first
  if (holidaysCache.has(year)) {
    return holidaysCache.get(year)!;
  }

  const holidays: Holiday[] = [
    ...getNationalHolidays(year),
    ...getFixedReligiousHolidays(year),
    ...getMovableReligiousHolidays(year),
    ...getInternationalHolidays(year),
    ...getCommercialHolidays(year),
    ...getGreatLentPeriod(year),
  ];

  // Cache the result before returning
  holidaysCache.set(year, holidays);
  return holidays;
}

// Перевірити, чи є дата святом (з системою пріоритетів)
export function getHolidayForDate(date: Date): Holiday | undefined {
  const year = getYear(date);
  const holidays = getHolidaysForYear(year);

  const matchingHolidays = holidays.filter((holiday) => isSameDay(holiday.date, date));

  if (matchingHolidays.length === 0) return undefined;
  if (matchingHolidays.length === 1) return matchingHolidays[0];

  // Система пріоритетів: national > religious > international > commercial > lent
  const priorityOrder: Holiday["type"][] = [
    "national",
    "religious",
    "international",
    "commercial",
    "lent",
  ];

  return matchingHolidays.sort(
    (a, b) => priorityOrder.indexOf(a.type) - priorityOrder.indexOf(b.type)
  )[0];
}
