# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Development server with Turbopack
npm run dev

# Production build
npm run build

# Start production server
npm start

# Linting
npm run lint

# Generate PWA icons from app/icon.svg
npm run generate:icons
```

## Project Overview

This is a Ukrainian fiscal calendar web application built with Next.js 16 (App Router) that displays week numbers using both ISO 8601 and GfK methodologies, along with Ukrainian holidays. The application includes comprehensive SEO optimization, PWA support, and a clean, modern UI.

### Tech Stack
- **Next.js 16** with App Router and Turbopack
- **React 19** with TypeScript
- **Tailwind CSS v4** for styling
- **shadcn/ui** components (New York style)
- **date-fns v4** for date manipulation
- **TanStack Query v5** for state management (configured in app/providers.tsx)
- **Zustand** with persist middleware for global state (calendar mode, year, navigation visibility, theme preference)
- **Lucide React** for icons
- **@next/third-parties** for Google Analytics integration

## Architecture

### Calendar Logic

The application supports two calendar methodologies:

#### ISO 8601 Standard (lib/calendar.ts)
The default calendar system based on ISO 8601 standard:
- Weeks start on Monday
- First week of the year contains the first Thursday
- Uses date-fns functions: `getISOWeek`, `getISOWeekYear`, `startOfISOWeek`, `endOfISOWeek`

**Key interfaces:**
- `CalendarDay`: Represents a single day with ISO week info, holiday status, and display flags
- `CalendarWeek`: Contains week number and array of 7 CalendarDay objects
- `CalendarMonth`: Contains month metadata and array of CalendarWeek objects

**Critical function:** `getMonthWeeks(year, month)` groups days by ISO week number and ensures all weeks have exactly 7 days (fills in days from adjacent months as needed).

#### GfK Period Mapping (lib/gfk-calendar.ts)
Alternative methodology for retail and marketing analytics:
- Each month has a fixed number of weeks: 4 or 5
- Quarterly pattern: 5-4-4, 4-5-4, 4-4-5, 5-4-4
- Year starts on first Monday (or last Monday of previous year if Jan 1 is after Thursday)
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

### State Management

#### Calendar Store (lib/stores/calendar-store.ts)
Zustand store manages calendar state and navigation:
- `mode`: "iso" | "gfk" - current calendar methodology
- `year`: number - currently displayed year
- `navigationVisible`: boolean - whether navigation should be shown in header
- `setMode(mode)`: Set specific mode
- `toggleMode()`: Switch between ISO and GfK
- `setYear(year)`: Change displayed year
- `setNavigationVisible(visible)`: Control header navigation visibility
- Persisted to localStorage with key: `fiscal-calendar-mode` (only mode is persisted, not year or navigationVisible)

#### Theme System (lib/stores/theme-store.ts)
Minimalist Zustand store for theme preference:
- `theme`: "light" | "dark" | "system" - user's theme choice
- `setTheme(theme)`: Update theme preference
- Persisted to localStorage with key: `fiscal-calendar-theme`
- Version: 0

**Architecture:**
- Store only tracks user preference, not computed values
- `systemTheme` is local state in ThemeProvider (not in Zustand)
- Automatic localStorage initialization on first visit
- Default: `"system"` - follows OS preference

**ThemeProvider (components/theme-provider.tsx):**
- Client-side component that applies theme to DOM
- Listens to OS theme changes via `matchMedia`
- Computes final theme: `resolvedTheme = theme === "system" ? systemTheme : theme`
- Applies `.dark` class to `<html>` element
- No hydration mismatch due to inline script in layout.tsx

**Initial Load (app/layout.tsx):**
- Inline script in `<head>` prevents flash of wrong theme
- Reads from localStorage on first paint (before React hydration)
- Falls back to system theme if no stored preference
- `suppressHydrationWarning` on `<html>` tag required

**Key Implementation Details:**
- No race conditions between Zustand persist and ThemeProvider
- User preference always persisted and respected
- System theme detection happens client-side only
- localStorage format: `{"state":{"theme":"system"},"version":0}`

### Holiday System (lib/holidays.ts)

Holidays are calculated dynamically for each year:
- **Fixed dates**: National holidays (New Year, Independence Day, etc.)
- **Calculated dates**:
  - Easter (Великдень) - uses Gauss algorithm in `getEasterDate()`
  - Trinity (Трійця) - 49 days after Easter
  - Black Friday - day after 4th Thursday in November
  - Cyber Monday - 3 days after Black Friday

**Holiday types** affect visual styling (defined in lib/constants/holiday-styles.ts):
- `national`: Blue gradient backgrounds, horizontal line indicator
- `religious`: Purple gradient backgrounds, horizontal line indicator
- `international`: Pink gradient backgrounds, horizontal line indicator
- `commercial`: Amber/yellow gradient backgrounds, horizontal line indicator

All holiday styles include:
- Light mode: from-{color}-50 to {color}-100/80 gradient
- Dark mode: from-{color}-950/40 to {color}-900/50 gradient
- Consistent horizontal line indicators at bottom of day cell (w-2.5 h-0.5)

### Component Hierarchy

```
app/layout.tsx
├── Inline theme script (prevents FOUC)
├── ThemeProvider (components/theme-provider.tsx)
│   ├── Manages system theme detection
│   ├── Applies .dark class to <html>
│   └── Listens to OS preference changes
│
├── Header (components/layout/header.tsx)
│   ├── Sticky navigation with logo and theme toggle
│   ├── Theme toggle button (components/theme-toggle.tsx) - dropdown menu
│   ├── Dynamic year navigation controls (YearNavigationControls) - shows when main navigation scrolls out of view
│   ├── Uses IntersectionObserver to toggle navigation visibility
│   ├── Grid layout: [logo][center navigation][theme toggle]
│   └── Backdrop blur effect with responsive height (h-16 or h-20)
│
├── main content
│   └── app/page.tsx
│       ├── YearCalendar (components/calendar/year-calendar.tsx)
│       │   ├── Manages year state via Zustand store
│       │   ├── Uses IntersectionObserver to track navigation visibility
│       │   ├── Navigation controls (YearNavigationControls) with year navigation, mode toggle, and legend
│       │   ├── Navigation is non-sticky on page (duplicated in header when scrolled)
│       │   ├── Memoized calendar calculations for performance
│       │   ├── TooltipProvider for holiday tooltips
│       │   └── Auto-centered grid of MonthCalendar components
│       │       │
│       │       MonthCalendar (components/calendar/month-calendar.tsx)
│       │       ├── Highlights current month with ring border
│       │       ├── Month header with large background number
│       │       ├── Card component with hover effects
│       │       └── Grid of WeekRow components
│       │           │
│       │           WeekRow (components/calendar/week-row.tsx)
│       │           ├── Shows week number in first column
│       │           └── Grid of DayCell components
│       │               │
│       │               DayCell (components/calendar/day-cell.tsx)
│       │               ├── Renders individual day
│       │               ├── Shows holiday indicators with type-specific shapes
│       │               ├── Wraps holidays with Tooltip for names
│       │               └── Displays "phantom" days from adjacent months
│       │                   (grayed in ISO mode, normal in GfK mode)
│       │
│       └── SEOContent (components/seo-content.tsx)
│           ├── Holiday type legend with colored indicators
│           └── FAQ section with Accordion component
│
├── Footer (components/layout/footer.tsx)
│   ├── About section with description
│   ├── Social links (LinkedIn, Telegram, GitHub)
│   └── Copyright and legal links
│
└── ScrollToTop (components/scroll-to-top.tsx)
    ├── Fixed position button (bottom-right)
    ├── Circular progress indicator
    ├── Shows after scrolling 300px
    └── Smooth scroll to top on click
```

### Styling Patterns

- Mobile-first responsive design with fixed-size month cards (285px)
- Auto-centered grid layout using CSS Grid with `auto-fit` and `minmax`
- Uses `aspect-square` for day cells to maintain consistent proportions
- Current month: slate ring border (`ring-2 ring-slate-300`)
- Current date: slate ring with lighter background
- Weekends: red/pink background tint (`bg-red-50/40`)
- Holidays: type-specific background colors with indicator shapes at bottom
- "Phantom" days (from other months):
  - ISO mode: very low opacity (`text-muted-foreground/30`)
  - GfK mode: normal styling with semibold font
- Sticky header with backdrop blur for modern glass effect
- Responsive padding using Tailwind's responsive utilities

### SEO and PWA Features

The application includes comprehensive SEO optimization:

**Metadata (app/layout.tsx):**
- Dynamic title and description with current year
- Extensive keywords for Ukrainian fiscal calendar search terms
- Open Graph and Twitter Card metadata
- Structured data (JSON-LD) for SoftwareApplication and FAQPage
- Robots meta tags for search engine indexing

**Auto-generated files:**
- `app/icon.svg` - SVG favicon
- `app/opengraph-image.tsx` - Dynamic OG image generation with year
- `app/robots.ts` - Search engine crawling rules
- `app/sitemap.ts` - XML sitemap with all routes
- `app/manifest.ts` - PWA manifest
- `app/viewport.ts` - Viewport configuration with theme colors
- PWA icons generated via `npm run generate:icons` (icon-192.png, icon-512.png)

**SEO Content Component:**
- Holiday type cards with visual indicators
- FAQ accordion with structured data matching layout.tsx
- Keyword-rich content about calendar methodologies

### Path Aliases

Configured in tsconfig.json:
- `@/*` maps to project root
- Import example: `import { cn } from "@/lib/utils"`

## UI Components

### shadcn/ui Components Used
Currently installed in `components/ui/`:
- `button.tsx` - Navigation and action buttons
- `badge.tsx` - Status indicators
- `card.tsx` - Month calendar containers
- `tooltip.tsx` - Holiday name tooltips
- `accordion.tsx` - FAQ section
- `dropdown-menu.tsx` - Theme switcher dropdown in header
- `switch.tsx` - Toggle switches
- `label.tsx` - Form labels

### Custom Components
Non-UI library components:
- `theme-provider.tsx` - Client-side theme application and system theme detection
- `theme-toggle.tsx` - Theme switcher UI component (uses dropdown-menu)
- `analytics.tsx` - Google Analytics integration wrapper (uses @next/third-parties)
- `calendar/year-navigation-controls.tsx` - Reusable year navigation with analytics tracking

### Adding New Components

```bash
npx shadcn@latest add [component-name]
```

Components are added to `components/ui/` with New York style variant.

## Key Features Implementation

### Dynamic Header Navigation
- Uses IntersectionObserver API to track visibility of main navigation
- When main navigation scrolls out of view, duplicates controls in header
- Smooth transitions with opacity and transform animations
- Responsive design: hidden on mobile (<lg), visible on desktop
- Prevents layout shift by maintaining header height
- Implemented in YearCalendar and Header components

### Mode Switching (ISO / GfK)
- Toggle buttons in YearNavigationControls component
- Zustand store persists mode selection
- Changes calendar generation logic dynamically
- Updates displayed week numbers
- Affects "phantom day" styling
- Analytics tracking on mode change

### Theme System
- Three modes: Light, Dark, System (follows OS preference)
- Zustand store persists user choice to localStorage
- ThemeProvider detects system theme changes in real-time
- Inline script in layout.tsx prevents FOUC (Flash of Unstyled Content)
- Theme applies via `.dark` class on `<html>` element
- No hydration mismatches due to proper SSR handling
- Dropdown menu in header for theme switching

### Scroll to Top Button
- Uses `requestAnimationFrame` for performance
- Circular progress indicator shows scroll percentage
- Appears after 300px scroll
- Smooth scroll animation
- Fixed position with z-index management

### Analytics (Google Analytics)
- Integration via @next/third-parties/google package
- Configured in components/analytics.tsx
- Only loads in production with NEXT_PUBLIC_GA_ID environment variable
- Custom event tracking in lib/analytics.ts with type-safe events:
  - `select_theme` - tracks theme changes
  - `navigate_year` - tracks year navigation (previous/next/current)
  - `select_calendar_mode` - tracks ISO/GfK mode switching
  - `outbound_click` - tracks social media link clicks
- Events tracked in YearNavigationControls component

### Responsive Design
- Container uses responsive padding (px-8 to 3xl:px-96)
- Month cards fixed at 285px width
- Grid auto-centers using `justify-content: center`
- Font sizes scale with breakpoints (text-xs to text-sm)
- Header dynamic navigation hidden on mobile (<lg)
- Compact mode for navigation controls in header

## Docker Deployment

The project uses multi-stage Dockerfile optimized for Coolify deployment:
- Stage 1 (deps): Install dependencies including sharp for image processing
- Stage 2 (builder): Build with `output: "standalone"` (next.config.ts)
- Stage 3 (runner): Minimal production image, runs on port 3000

The standalone output significantly reduces Docker image size by only including necessary files.

## Additional Pages

The application includes legal and informational pages:
- `/privacy` - Privacy Policy page (app/privacy/page.tsx)
- `/terms` - Terms of Service page (app/terms/page.tsx)

Both pages are linked in the footer and included in sitemap.

## Environment Variables

Required for production:
- `NEXT_PUBLIC_SITE_URL` - Base URL for SEO features (sitemap, robots.txt, Open Graph)
- `NEXT_PUBLIC_GA_ID` - Google Analytics Measurement ID (format: G-XXXXXXXXXX)

Both are optional in development (safe fallbacks provided).

## Important Notes

- All text content is in Ukrainian (locale: `uk` from date-fns)
- Language code in layout.tsx: `lang="uk"`
- ISO 8601 week constant: `WEEKDAY_NAMES_SHORT` in lib/calendar.ts
- Current year/month detection uses `new Date()` - no timezone handling needed for this use case
- PWA icons automatically generated during build process via scripts/generate-icons.mjs
- Theme system uses inline script to prevent FOUC (Flash of Unstyled Content)
- localStorage keys: `fiscal-calendar-mode`, `fiscal-calendar-theme`
- `suppressHydrationWarning` on `<html>` tag required for theme system
- Performance optimizations: memoized calendar calculations, selective Zustand selectors
- Accessibility: screen reader announcements, ARIA labels, keyboard navigation support
- IntersectionObserver used for dynamic header navigation (threshold: [0, 0.1, 1], rootMargin: -64px)
