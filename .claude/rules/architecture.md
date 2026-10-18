# Calendar architecture

## Domain

CalendarDate in lib/date-only.ts is a branded YYYY-MM-DD string. UTC is used only as an arithmetic/formatting implementation detail. The domain never represents a local midnight or a UTC noon. Calendar dates remain the same in every device time zone.

ISO weeks start on Monday and use the week containing January 4. GfK shares ISO year boundaries and keeps the project pattern [5,4,4,4,5,4,4,4,5,5,4,4]. The owner confirmed on 2026-10-18 that week 53 belongs to the final period. CalendarDay.isoWeek always means ISO; fiscalWeek means GfK. isCurrentMonth refers only to a civil month; GfK cells remain active across civil-month boundaries.

Holiday lookups are indexed by CalendarDate, with bounded yearly caches. HolidayGroup is a discriminated union for individual dates and periods. Multiple years' Lent periods must not merge.

## Rendering and state

RootLayout renders per request with a CSP nonce and serialized initial date. CalendarClock uses the same initial snapshot for hydration, then reads the browser's local date every 15 seconds and on focus/visibility changes. CalendarStore.year=null follows the clock; an explicit year remains selected.

Zustand persists only preference fields. safeStorage catches access/quota errors; merge validates enum/boolean values and preserves actions. Providers hydrates stores once. An early theme-only script may change html.dark; it must never hide body or inject unchecked language/mode state.

Month grids expose column and row headers, one roving tab stop per month and arrow/Home/End navigation. Hidden navigation is inert. DayCell receives locale/clock values and uses cached holiday/Intl lookups.

## Delivery and checks

Next.js standalone, Node 24, non-root Docker image. Public build-time origin is mandatory. Fonts are vendored with the OFL license. OG is a statically generated PNG. No database or write API exists.

Use README.md and docs/DEPLOYMENT.md for commands. Tests cover date boundaries, all supported years, five time zones, storage failures, midnight/year rollover, accessibility, responsive layout, CSP/SEO and OG. CI is validation only; deployment requires explicit authorization.
