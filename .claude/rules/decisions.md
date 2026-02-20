## 2026-02-20 — i18n: Zustand + translation files (not next-intl)

**Context:** Task to add multilingual support (UK + EN) with language switcher.

**Decision:** Use lightweight Zustand store + JSON translation files instead of next-intl.

**Rationale:**
- next-intl requires URL-based locale routing (`/uk/`, `/en/`) — major structural change to App Router
- This app is primarily a client-side SPA with one main page — no need for SSR-based i18n
- Zustand + persist is the established pattern (theme store, calendar store)
- Minimal dependency footprint — no extra packages needed
- Holiday names: `nameEn` field on Holiday interface (co-located data, no separate mapping)
- Legal pages (privacy/terms): metadata translated, body stays Ukrainian-only for English
- OG image and manifest: stay in Ukrainian (primary language, server-generated)
- `<html lang>` updated via client-side script (same pattern as theme FOUC prevention)

**Architecture:**
- `lib/stores/language-store.ts` — Zustand store, persisted to `fiscal-calendar-lang`
- `lib/i18n/translations/{uk,en}.ts` — typed translation objects
- `lib/i18n/index.ts` — `useTranslation()` hook, locale helpers
- `components/language-toggle.tsx` — header toggle button
- Calendar/date-fns functions accept optional `locale` parameter
