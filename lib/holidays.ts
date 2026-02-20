import { getYear, isSameDay } from "date-fns";

export interface Holiday {
  name: string;
  nameEn: string;
  date: Date;
  type: "national" | "international" | "religious" | "commercial" | "lent";
  isWeekend?: boolean;
}

// LRU Cache for holidays by year to avoid recalculation and prevent memory leak
// Зберігаємо поточний рік + 2 попередніх + 2 наступних = максимум 5 років
const MAX_CACHE_SIZE = 5;
const holidaysCache = new Map<number, Holiday[]>();

// Діапазон років для точного розрахунку Великодня
export const EASTER_YEAR_MIN = 1900;
export const EASTER_YEAR_MAX = 2100;

// Функція для обчислення православного Великодня за алгоритмом Meeus (Julian calendar)
function getEasterDate(year: number): Date | null {
  // Validate year range for Easter calculation accuracy
  if (year < EASTER_YEAR_MIN || year > EASTER_YEAR_MAX) {
    console.warn(`Easter calculation is only valid for years ${EASTER_YEAR_MIN}-${EASTER_YEAR_MAX}, received: ${year}`);
    return null;
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
 * @returns Розрахована дата або null, якщо Великдень не може бути розрахований
 * @example
 * // Трійця (49 днів після Великодня)
 * getEasterBasedDate(2025, 49)
 *
 * // Вербна неділя (7 днів до Великодня)
 * getEasterBasedDate(2025, -7)
 */
function getEasterBasedDate(year: number, daysOffset: number): Date | null {
  const easter = getEasterDate(year);
  if (!easter) return null;

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

  // Якщо Великдень не може бути розрахований, повертаємо порожній масив
  if (!lentStart || !lentEnd) return [];

  const lentDays: Holiday[] = [];
  const currentDate = new Date(lentStart);

  while (currentDate <= lentEnd) {
    lentDays.push({
      name: "Великий піст",
      nameEn: "Great Lent",
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
    { name: "Новий рік", nameEn: "New Year's Day", date: createDate(year, 0, 1), type: "national" },
    { name: "День праці", nameEn: "Labour Day", date: createDate(year, 4, 1), type: "national" },
    {
      name: "День пам'яті та перемоги над нацизмом у Другій світовій війні",
      nameEn: "Day of Remembrance and Victory over Nazism in WWII",
      date: createDate(year, 4, 8),
      type: "national",
    },
    { name: "День Конституції України", nameEn: "Constitution Day of Ukraine", date: createDate(year, 5, 28), type: "national" },
    { name: "День Української Державності", nameEn: "Ukrainian Statehood Day", date: createDate(year, 6, 15), type: "national" },
    { name: "День незалежності України", nameEn: "Independence Day of Ukraine", date: createDate(year, 7, 24), type: "national" },
    {
      name: "День захисників і захисниць України",
      nameEn: "Defenders of Ukraine Day",
      date: createDate(year, 9, 1),
      type: "national",
    },
  ];
}

// Фіксовані релігійні свята
function getFixedReligiousHolidays(year: number): Holiday[] {
  return [
    // Січень
    { name: "Богоявлення (Водохреще)", nameEn: "Epiphany (Theophany)", date: createDate(year, 0, 6), type: "religious" },

    // Лютий
    { name: "Стрітення Господнє", nameEn: "Candlemas", date: createDate(year, 1, 2), type: "religious" },

    // Березень
    { name: "Благовіщення", nameEn: "Annunciation", date: createDate(year, 2, 25), type: "religious" },

    // Квітень
    { name: "Святого Юрія (Георгія) Переможця", nameEn: "Saint George's Day", date: createDate(year, 3, 23), type: "religious" },

    // Червень
    {
      name: "Різдво Іоанна Хрестителя (Івана Купала)",
      nameEn: "Nativity of John the Baptist (Ivan Kupala)",
      date: createDate(year, 5, 24),
      type: "religious",
    },
    { name: "Апостолів Петра і Павла", nameEn: "Saints Peter and Paul Day", date: createDate(year, 5, 29), type: "religious" },

    // Серпень
    {
      name: "Преображення Господнє (Яблучний Спас)",
      nameEn: "Transfiguration (Apple Saviour)",
      date: createDate(year, 7, 6),
      type: "religious",
    },
    { name: "Успіння Пресвятої Богородиці", nameEn: "Dormition of the Mother of God", date: createDate(year, 7, 15), type: "religious" },

    // Вересень
    { name: "Різдво Пресвятої Богородиці", nameEn: "Nativity of the Mother of God", date: createDate(year, 8, 8), type: "religious" },
    {
      name: "Воздвиження Хреста Господнього",
      nameEn: "Exaltation of the Holy Cross",
      date: createDate(year, 8, 14),
      type: "religious",
    },

    // Листопад
    { name: "Собор Архистратига Михаїла", nameEn: "Synaxis of Archangel Michael", date: createDate(year, 10, 8), type: "religious" },
    {
      name: "Введення в храм Пресвятої Богородиці",
      nameEn: "Presentation of the Mother of God",
      date: createDate(year, 10, 21),
      type: "religious",
    },

    // Грудень
    { name: "Святого Миколая", nameEn: "Saint Nicholas Day", date: createDate(year, 11, 6), type: "religious" },
    { name: "Різдво Христове", nameEn: "Christmas", date: createDate(year, 11, 25), type: "religious" },
    { name: "Щедрий вечір (Маланки)", nameEn: "Generous Evening (Malanka)", date: createDate(year, 11, 31), type: "religious" },
  ];
}

// Рухомі релігійні свята (залежать від дати Великодня)
function getMovableReligiousHolidays(year: number): Holiday[] {
  const easter = getEasterDate(year);

  // Якщо Великдень не може бути розрахований, повертаємо порожній масив
  if (!easter) return [];

  const forgivennessSunday = getEasterBasedDate(year, -49);
  const palmSunday = getEasterBasedDate(year, -7);
  const ascension = getEasterBasedDate(year, 39);
  const trinity = getEasterBasedDate(year, 49);

  const holidays: Holiday[] = [
    { name: "Великдень", nameEn: "Easter (Pascha)", date: easter, type: "religious" },
  ];

  if (forgivennessSunday) holidays.push({ name: "Прощена неділя", nameEn: "Forgiveness Sunday", date: forgivennessSunday, type: "religious" });
  if (palmSunday) holidays.push({ name: "Вербна неділя", nameEn: "Palm Sunday", date: palmSunday, type: "religious" });
  if (ascension) holidays.push({ name: "Вознесіння Господнє", nameEn: "Ascension Day", date: ascension, type: "religious" });
  if (trinity) holidays.push({ name: "Трійця", nameEn: "Pentecost (Trinity)", date: trinity, type: "religious" });

  return holidays;
}

// Міжнародні свята
function getInternationalHolidays(year: number): Holiday[] {
  return [
    { name: "День Святого Валентина", nameEn: "Valentine's Day", date: createDate(year, 1, 14), type: "international" },
    { name: "Міжнародний жіночий день", nameEn: "International Women's Day", date: createDate(year, 2, 8), type: "international" },
  ];
}

// Комерційні свята
function getCommercialHolidays(year: number): Holiday[] {
  const blackFriday = getBlackFriday(year);
  const cyberMonday = getCyberMonday(year);

  return [
    { name: "Чорна п'ятниця", nameEn: "Black Friday", date: blackFriday, type: "commercial" },
    { name: "Кіберпонеділок", nameEn: "Cyber Monday", date: cyberMonday, type: "commercial" },
  ];
}

// Отримати всі свята для конкретного року
export function getHolidaysForYear(year: number): Holiday[] {
  // Check cache first (LRU: move to end if found)
  if (holidaysCache.has(year)) {
    const cached = holidaysCache.get(year)!;
    // Move to end (most recently used)
    holidaysCache.delete(year);
    holidaysCache.set(year, cached);
    return cached;
  }

  const holidays: Holiday[] = [
    ...getNationalHolidays(year),
    ...getFixedReligiousHolidays(year),
    ...getMovableReligiousHolidays(year),
    ...getInternationalHolidays(year),
    ...getCommercialHolidays(year),
    ...getGreatLentPeriod(year),
  ];

  // Evict oldest entry if cache is full
  if (holidaysCache.size >= MAX_CACHE_SIZE) {
    const firstKey = holidaysCache.keys().next().value;
    if (firstKey !== undefined) {
      holidaysCache.delete(firstKey);
    }
  }

  // Cache the result before returning
  holidaysCache.set(year, holidays);
  return holidays;
}

// Отримати всі свята для конкретної дати (відсортовані за пріоритетом)
export function getHolidaysForDate(date: Date): Holiday[] {
  const year = getYear(date);
  const holidays = getHolidaysForYear(year);

  const matchingHolidays = holidays.filter((holiday) => isSameDay(holiday.date, date));

  if (matchingHolidays.length === 0) return [];
  if (matchingHolidays.length === 1) return matchingHolidays;

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
  );
}

// Перевірити, чи є дата святом (повертає свято з найвищим пріоритетом)
// Deprecated: використовуйте getHolidaysForDate для повного списку свят
export function getHolidayForDate(date: Date): Holiday | undefined {
  const holidays = getHolidaysForDate(date);
  return holidays.length > 0 ? holidays[0] : undefined;
}
