export interface TranslationStrings {
  common: {
    fiscalCalendar: string;
    today: string;
    skipToMain: string;
    scrollToTop: string;
  };

  calendar: {
    weekAbbr: string;
    weekdays: readonly string[];
    previousYear: string;
    previousYearMin: string;
    nextYear: string;
    nextYearMax: string;
    calendarMode: string;
    isoMode: string;
    isoModeActive: string;
    gfkMode: string;
    gfkModeActive: string;
    isoActivated: string;
    gfkActivated: string;
    calendarFor: string;
  };

  holidays: {
    national: string;
    religious: string;
    international: string;
    commercial: string;
    lent: string;
    weekends: string;
    holidaysOfUkraine: string;
    currentAndUpcoming: string;
    upcoming: string;
    openList: string;
    closePanel: string;
    openPanel: string;
    noUpcoming: string;
    nationalExamples: string;
    religiousExamples: string;
    internationalExamples: string;
    commercialExamples: string;
    lentDescription: string;
  };

  theme: {
    toggle: string;
    light: string;
    dark: string;
    system: string;
  };

  footer: {
    description: string;
    contacts: string;
    copyright: string;
    privacy: string;
    terms: string;
  };

  time: {
    today: string;
    tomorrow: string;
    daysAgo: string;
    inDays: string;
  };

  seo: {
    holidaysTitle: string;
    faqTitle: string;
    faqIsoQ: string;
    faqIsoA: string;
    faqGfkQ: string;
    faqGfkA: string;
    faqHolidaysQ: string;
    faqHolidaysA: string;
    faqEasterQ: string;
    faqEasterA: string;
    faqAutoQ: string;
    faqAutoA: string;
    faqOrthodoxQ: string;
    faqOrthodoxIntro: string;
    faqOrthodoxCategories: ReadonlyArray<{ title: string; items: string }>;
  };

  aria: {
    todaySuffix: string;
  };
}
