# Calendar project guidance

Use the current user request as the task. No external task coordinator is required.

Read README.md for architecture and commands, docs/DEPLOYMENT.md for the Komodo delivery contract, and .claude/rules/architecture.md for date and state invariants.

Use Node 24 LTS and npm ci. Required checks for code changes: npm run lint, npm run typecheck, npm test, a configured production build, and affected Playwright scenarios. Calendar changes require the timezone matrix. Delivery requires checking the actual standalone/container behavior.

CalendarDate is a YYYY-MM-DD civil date. Do not introduce local-midnight Date arithmetic or UTC-noon conversions. Current time belongs to CalendarClock; do not cache new Date() inside a memo with no clock dependency.

Preserve the accepted GfK pattern; allocate week 53 to the last period. Keep ISO and fiscal week fields distinct.

Preferences are untrusted data. All storage access goes through safeStorage; persisted values are validated before merge. Keep SSR and the initial client render identical and never hide body until hydration.

LocalStorage keys: fiscal-calendar-mode, fiscal-calendar-lang, fiscal-calendar-theme, holidays-panel-state, holidays-panel-hint-shown.

Do not commit, push, publish or deploy unless requested. When authorized, follow the user's commit conventions. Do not restore obsolete historical workflows or assume that an available tool authorizes its use.
