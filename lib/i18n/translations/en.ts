import type { TranslationStrings } from "../types";

export const en: TranslationStrings = {
  common: {
    fiscalCalendar: "Fiscal Calendar",
    today: "Today",
    skipToMain: "Skip to main content",
    scrollToTop: "Scroll to top",
  },

  calendar: {
    weekAbbr: "Wk",
    weekdays: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
    previousYear: "Previous year",
    previousYearMin: "Previous year (minimum year: {year})",
    nextYear: "Next year",
    nextYearMax: "Next year (maximum year: {year})",
    calendarMode: "Calendar mode",
    isoMode: "ISO 8601 mode",
    isoModeActive: "ISO 8601 mode (active)",
    gfkMode: "GFK mode",
    gfkModeActive: "GFK mode (active)",
    isoActivated: "ISO 8601 mode activated",
    gfkActivated: "GFK mode activated",
    calendarFor: "Calendar for {month} {year}",
  },

  holidays: {
    national: "National",
    religious: "Religious",
    international: "International",
    commercial: "Commercial",
    lent: "Great Lent",
    weekends: "Weekends",
    holidaysOfUkraine: "Holidays of Ukraine",
    currentAndUpcoming: "Current and upcoming holidays",
    upcoming: "Upcoming holidays",
    openList: "Open holidays list",
    closePanel: "Close holidays panel",
    openPanel: "Open holidays panel",
    noUpcoming: "No upcoming holidays in the next 60 days",
    nationalExamples: "Independence Day, New Year",
    religiousExamples: "Easter, Pentecost, Ivan Kupala, Saviour",
    internationalExamples: "Women's Day, Valentine's Day",
    commercialExamples: "Black Friday, Cyber Monday",
    lentDescription: "48-day preparation period before Easter",
  },

  theme: {
    toggle: "Toggle theme",
    light: "Light",
    dark: "Dark",
    system: "System",
  },

  footer: {
    description: "Calendar with fiscal weeks by ISO 8601 and GFK standards — an essential tool for business in Ukraine.",
    contacts: "Contacts",
    copyright: "© {year} Fiscal Calendar Ukraine. All rights reserved.",
    privacy: "Privacy",
    terms: "Terms of Use",
  },

  time: {
    today: "today",
    tomorrow: "tomorrow",
    daysAgo: "{count} {days} ago",
    inDays: "in {count} {days}",
  },

  seo: {
    holidaysTitle: "State and professional holidays in {year}",
    faqTitle: "Frequently Asked Questions",
    faqIsoQ: "How is the week number determined by ISO 8601?",
    faqIsoA: "According to ISO 8601, the week starts on Monday. The first week of the year is the week that contains the first Thursday of January. This means that the first week always has at least 4 days in the new year. This approach ensures that each year has a full 52 or 53 weeks.",
    faqGfkQ: "What is the GFK calendar used for?",
    faqGfkA: "The GFK calendar is used in retail and marketing analytics to compare sales across different years. It allows correct comparison of weekly metrics, taking into account the number of days in a month and their distribution. This is especially important for planning promotions, advertising campaigns, and demand forecasting.",
    faqHolidaysQ: "What holidays are included in the calendar?",
    faqHolidaysA: "The calendar includes all official state holidays of Ukraine, the full Orthodox calendar (31+ holidays, including Twelve Great Feasts, Easter, Pentecost, Ivan Kupala, Saviour and others), international holidays, and commercial events. Great Lent is marked separately as a 48-day period. In total, over 70 important dates for planning throughout the year. Each type of holiday is marked with its own color for convenience.",
    faqEasterQ: "Why does Easter fall on different dates each year?",
    faqEasterA: "Easter is a movable feast, the date of which is calculated using a complex algorithm (Gauss's formula). Orthodox Easter is celebrated on the first Sunday after the first spring full moon following the vernal equinox. Because of this, the date can vary from April 4 to May 8. Other religious holidays depend on the date of Easter, for example Pentecost (49 days after Easter).",
    faqAutoQ: "Is the calendar updated automatically?",
    faqAutoA: "Yes, the calendar automatically calculates all dates and holidays for the current year. Movable feasts (such as Easter, Pentecost) are calculated dynamically using the appropriate algorithms. This ensures that you always have up-to-date information regardless of the year.",
    faqOrthodoxQ: "What Orthodox holidays are included in the calendar?",
    faqOrthodoxIntro: "The calendar includes the full Orthodox calendar of Ukraine:",
    faqOrthodoxCategories: [
      { title: "Twelve Great Feasts:", items: "Epiphany, Candlemas, Annunciation, Ascension, Pentecost, Transfiguration (Apple Saviour), Dormition, Nativity of the Mother of God, Exaltation of the Cross, Presentation of Mary" },
      { title: "Great Feasts:", items: "Easter (Pascha), Christmas" },
      { title: "Saints' Days:", items: "Saint George, Saints Peter and Paul, Saint Nicholas" },
      { title: "Folk Religious Holidays:", items: "Ivan Kupala, Generous Evening (Malanka)" },
      { title: "Movable Feasts:", items: "Forgiveness Sunday, Palm Sunday, Easter, Ascension, Pentecost (calculated automatically by the church calendar)" },
      { title: "Great Lent:", items: "48-day period before Easter, marked separately" },
    ],
  },

  aria: {
    todaySuffix: ", today",
  },
};
