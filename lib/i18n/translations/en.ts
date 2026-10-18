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
    description:
      "Calendar with fiscal weeks by ISO 8601 and GFK standards — an essential tool for business in Ukraine.",
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
    holidaysTitle: "State and selected holidays in {year}",
    faqTitle: "Frequently Asked Questions",
    faqIsoQ: "How is the week number determined by ISO 8601?",
    faqIsoA:
      "According to ISO 8601, the week starts on Monday. The first week of the year is the week that contains the first Thursday of January. This means that the first week always has at least 4 days in the new year. This approach ensures that each year has a full 52 or 53 weeks.",
    faqGfkQ: "What is the GFK calendar used for?",
    faqGfkA:
      "In this project, GfK mode groups complete weeks into fiscal periods using the 5-4-4-4-5-4-4-4-5-5-4-4 pattern. If the ISO year has 53 weeks, the extra week belongs to the final period. This is the project's agreed convention; verify it against your organization's calendar before using it for external reporting.",
    faqHolidaysQ: "What holidays are included in the calendar?",
    faqHolidaysA:
      "The calendar includes selected Ukrainian national, religious and international holidays, plus Black Friday and Cyber Monday. Great Lent is displayed as a separate period. This is not a complete historical reference and does not determine statutory days off or working-time quotas.",
    faqEasterQ: "Why does Easter fall on different dates each year?",
    faqEasterA:
      "Orthodox Easter is calculated using the Julian computus and converted to a Gregorian date. Pentecost follows 49 days later, and Great Lent is derived from Easter. The algorithm is tested over the supported 1900-2100 range, including the change in the offset between the calendars in 2100.",
    faqAutoQ: "Is the calendar updated automatically?",
    faqAutoA:
      "Changing the year recalculates the dates of the holidays included in this calendar. The current day updates automatically. Holiday names and the list itself are maintained in code; legislative and church-calendar changes require a separate update.",
    faqOrthodoxQ: "What Orthodox holidays are included in the calendar?",
    faqOrthodoxIntro:
      "The calendar includes selected Orthodox holidays and periods:",
    faqOrthodoxCategories: [
      {
        title: "Twelve Great Feasts:",
        items:
          "Epiphany, Candlemas, Annunciation, Ascension, Pentecost, Transfiguration (Apple Saviour), Dormition, Nativity of the Mother of God, Exaltation of the Cross, Presentation of Mary",
      },
      { title: "Great Feasts:", items: "Easter (Pascha), Christmas" },
      {
        title: "Saints' Days:",
        items: "Saint George, Saints Peter and Paul, Saint Nicholas",
      },
      {
        title: "Folk Religious Holidays:",
        items: "Ivan Kupala, Generous Evening (Malanka)",
      },
      {
        title: "Movable Feasts:",
        items:
          "Forgiveness Sunday, Palm Sunday, Easter, Ascension, Pentecost (calculated automatically by the church calendar)",
      },
      {
        title: "Great Lent:",
        items: "48-day period before Easter, marked separately",
      },
    ],
  },

  aria: {
    todaySuffix: ", today",
  },
};
