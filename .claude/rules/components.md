# UI Components

## shadcn/ui Components (components/ui/)

Installed components (New York style variant):
- `button.tsx` — Navigation and action buttons
- `badge.tsx` — Status indicators
- `card.tsx` — Month calendar containers
- `tooltip.tsx` — Holiday name tooltips
- `accordion.tsx` — FAQ section
- `dropdown-menu.tsx` — Theme switcher dropdown in header
- `switch.tsx` — Toggle switches
- `label.tsx` — Form labels

**Adding new components:**
```bash
npx shadcn@latest add [component-name]
```
> NEVER edit files in `components/ui/` directly — they are managed by shadcn/ui.

## Custom Components

- `theme-provider.tsx` — Client-side theme application and system theme detection
- `theme-toggle.tsx` — Theme switcher UI (uses dropdown-menu)
- `analytics.tsx` — Google Analytics wrapper (uses @next/third-parties)
- `calendar/year-navigation-controls.tsx` — Reusable year navigation with analytics tracking
- `seo-content.tsx` — Holiday legend + FAQ accordion for SEO
- `scroll-to-top.tsx` — Fixed scroll-to-top button with progress indicator

## Calendar Components (components/calendar/)

- `year-calendar.tsx` — Main calendar view, manages year state, IntersectionObserver
- `month-calendar.tsx` — Single month card with WeekRow grid, CSS containment
- `week-row.tsx` — Week number + 7 DayCell components
- `day-cell.tsx` — Individual day with holiday indicators, tooltips, accessibility

## Layout Components (components/layout/)

- `header.tsx` — Sticky header with logo, dynamic nav, theme toggle
- `footer.tsx` — About section, social links, copyright
