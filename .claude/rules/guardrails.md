# Guardrails — Known Pitfalls

## 🚫 NEVER do this

- **NEVER** edit files in `node_modules/`, `.next/`, or `components/ui/`
  → `components/ui/` is managed by shadcn/ui — use `npx shadcn@latest add` instead
- **NEVER** remove `"use client"` from components that use hooks/state
- **NEVER** use `new Date()` for holiday calculations — use `createDate()` helper from `lib/holidays.ts`
- **NEVER** use `console.log` for debugging — remove before committing
- **NEVER** use `any` TypeScript type — use proper types or `unknown`
- **NEVER** use `npm install` for shadcn components — use `npx shadcn@latest add <component>`
- **NEVER** say done without running `npm run lint && npm run build`

## ✅ ALWAYS do this

- **ALWAYS** run `npm run lint && npm run build` after code changes
- **ALWAYS** use UTC dates via `createDate()`: `Date.UTC(year, month, day, 12, 0, 0, 0)`
- **ALWAYS** add new localStorage keys to the "Important Notes" section of CLAUDE.md
- **ALWAYS** use Tailwind classes — no inline styles
- **ALWAYS** use `@/` path aliases — no relative `../../../` imports
- **ALWAYS** git commit with Ukrainian message + emoji after completing a task

## ⚠️ Common Mistakes in This Project

1. **next lint** — removed in Next.js 16. Lint script is now `eslint .` via `eslint.config.mjs`
2. **Zustand stores** — don't add computed values to stores, keep only user preferences
3. **Date comparisons** — always compare at UTC noon (12:00:00) to avoid timezone bugs
4. **shadcn/ui** — always use New York style variant when adding components
5. **Tailwind v4** — some v3 utilities changed, check docs if something doesn't work
