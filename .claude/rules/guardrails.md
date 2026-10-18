# Calendar guardrails

- Use CalendarDate helpers for civil dates; use CalendarClock for current time.
- Preserve the confirmed GfK week-53 rule and test continuity between years.
- Do not silently truncate the supported year range or relabel fiscal weeks as ISO weeks.
- Validate persisted settings and use safeStorage for every localStorage operation.
- Keep server and initial browser output consistent; never hide the whole body waiting for JavaScript.
- Keep secrets outside the repository and Docker build context. NEXT_PUBLIC_* values are public and fixed at build time.
- Keep live server changes, publication and commits within the user's authorization.
- Do not kill unrelated Node processes or delete a live Next lock.
- Run meaningful unit, timezone, build and browser checks for affected behavior.
- Check the entire affected page at mobile and desktop sizes, keyboard focus and relevant themes.
- Use TypeScript types rather than any. Use existing UI primitives and Tailwind styles where suitable; OG's Satori renderer requires inline style objects.
