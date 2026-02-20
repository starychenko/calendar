# Architecture — Fiscal Calendar Ukraine

## Calendar Logic

The application supports two calendar methodologies:

### ISO 8601 Standard (lib/calendar.ts)
The default calendar system based on ISO 8601 standard:
- Weeks start on Monday
- First week of the year contains the first Thursday
- Uses date-fns functions: `getISOWeek`, `getISOWeekYear`, `startOfISOWeek`, `endOfISOWeek`

**Key interfaces:**
- `CalendarDay`: Represents a single day with ISO week info, holiday status, and display flags
- `CalendarWeek`: Contains week number and array of 7 CalendarDay objects
- `CalendarMonth`: Contains month metadata and array of CalendarWeek objects

**Critical function:** `getMonthWeeks(year, month)` groups days by ISO week number and ensures all weeks have exactly 7 days (fills in days from adjacent months as needed).

### GfK Period Mapping (lib/gfk-calendar.ts)
Alternative methodology for retail and marketing analytics:
- Each month has a fixed number of weeks: 4 or 5
- Quarterly pattern: 5-4-4, 4-5-4, 4-4-5, 5-4-4
- Year starts on first Monday using ISO 8601 logic (first week contains first Thursday)
- Uses `startOfWeek(jan4, { weekStartsOn: 1 })` to determine GfK year start
- `getGfkMonthWeeks(year, month)` generates weeks based on fixed monthly allocation
- `getGfkYearMonths(year)` generates full year with GfK week numbering

**GfK month week allocation:**
```typescript
const GFK_MONTH_WEEKS = [
  5, 4, 4, // Q1: January(5), February(4), March(4)
  4, 5, 4, // Q2: April(4), May(5), June(4)
  4, 4, 5, // Q3: July(4), August(4), September(5)
  5, 4, 4, // Q4: October(5), November(4), December(4)
];
```

## State Management

### Calendar Store (lib/stores/calendar-store.ts)
Zustand store manages calendar state and navigation:
- `mode`: "iso" | "gfk" — current calendar methodology
- `year`: number — currently displayed year
- `navigationVisible`: boolean — whether navigation should be shown in header
- `setMode(mode)`, `toggleMode()`, `setYear(year)`, `setNavigationVisible(visible)`
- Persisted to localStorage key: `fiscal-calendar-mode` (only mode is persisted)

### Theme System (lib/stores/theme-store.ts)
Minimalist Zustand store for theme preference:
- `theme`: "light" | "dark" | "system"
- Persisted to localStorage key: `fiscal-calendar-theme`
- Store only tracks user preference, not computed values
- `systemTheme` is local state in ThemeProvider (not in Zustand)

**ThemeProvider (components/theme-provider.tsx):**
- Client-side component that applies `.dark` class to `<html>`
- Listens to OS theme changes via `matchMedia`
- No hydration mismatch due to inline script in layout.tsx

**Initial Load (app/layout.tsx):**
- Inline script in `<head>` prevents FOUC
- Reads localStorage on first paint (before React hydration)
- `suppressHydrationWarning` on `<html>` tag required

## Holiday System (lib/holidays.ts)

Holidays are calculated dynamically for each year:
- **Fixed dates**: National holidays (New Year, Independence Day, etc.)
- **Calculated dates**: Easter (Meeus algorithm, Julian), Trinity (+49 days), Black Friday, Cyber Monday, Great Lent (-48 days)

**Year range:** 1900-2100 (constants: `EASTER_YEAR_MIN`, `EASTER_YEAR_MAX`). Returns `null` outside range.

**LRU Cache:** Max 5 years cached. Evicts oldest entry when full.

**Timezone:** All dates in UTC via `createDate()` helper: `Date.UTC(year, month, day, 12, 0, 0, 0)`

**Holiday types** (defined in lib/constants/holiday-styles.ts):
- `national`: Blue gradient
- `religious`: Purple gradient
- `international`: Pink gradient
- `commercial`: Amber/yellow gradient
- `lent`: Subtle grey background

### Upcoming Holidays (lib/upcoming-holidays.ts)
- `getTodayUTC()`: UTC date for consistency
- `getUpcomingHolidays(daysAhead)`: Find holidays in next N days (default: 60)
- `groupConsecutiveLentDays()`: Groups Great Lent into single period
- Date formatting: `formatShortDate()`, `formatPeriod()`, `getDaysUntilHoliday()`, `formatDaysUntil()`

## Component Hierarchy

```
app/layout.tsx
├── Inline theme script (prevents FOUC)
├── ThemeProvider (components/theme-provider.tsx)
│
├── Header (components/layout/header.tsx)
│   ├── Sticky navigation with logo and theme toggle
│   ├── Dynamic year navigation (YearNavigationControls) — shows when main nav scrolls out
│   ├── IntersectionObserver toggles visibility
│   └── Grid: [logo][center navigation][theme toggle]
│
├── main → app/page.tsx
│   ├── YearCalendar (components/calendar/year-calendar.tsx)
│   │   ├── YearNavigationControls — year nav, mode toggle, legend
│   │   ├── Memoized calendar calculations
│   │   └── Auto-centered grid of MonthCalendar
│   │       ├── MonthCalendar → Card with WeekRow grid
│   │       │   └── WeekRow → week number + DayCell grid
│   │       │       └── DayCell — holiday indicators, tooltips, phantom days
│   │       │
│   └── SEOContent — holiday legend + FAQ accordion
│
├── Footer — about, social links, copyright
└── ScrollToTop — fixed button with circular progress
```

## Key Features

### Dynamic Header Navigation
- IntersectionObserver (threshold: 0, rootMargin: -64px)
- Duplicates controls in header when main nav scrolls out
- Hidden on mobile (<lg), visible on desktop

### Mode Switching (ISO / GfK)
- Toggle in YearNavigationControls, persisted via Zustand
- Changes calendar generation, week numbers, phantom day styling

### Analytics (Google Analytics)
- Via @next/third-parties, configured in components/analytics.tsx
- Events: `select_theme`, `navigate_year`, `select_calendar_mode`, `outbound_click`
- Resilient to ad-blockers (try/catch, dev console logging)

### SEO and PWA
- Dynamic metadata with current year (Open Graph, Twitter Cards, JSON-LD)
- Auto-generated: icon.svg, opengraph-image.tsx, robots.ts, sitemap.ts, manifest.ts, viewport.ts
- PWA icons via `npm run generate:icons`

## Styling Patterns

- Mobile-first, fixed-size month cards (285px), CSS Grid auto-fit
- `aspect-square` for day cells
- Current month: `ring-2 ring-slate-300`; current date: ring + lighter bg
- Weekends: `bg-red-50/40`; holidays: type-specific gradients
- Phantom days: ISO = low opacity, GfK = normal + semibold
- Sticky header with backdrop blur
