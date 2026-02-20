# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **Detailed docs:** Architecture, components, guardrails, and git workflow are in `.claude/rules/`.

---

## Cody — AI Architect & Tech Lead (MCP)

You are working under the supervision of **Cody** — an AI architect/tech lead accessible via MCP server (`cody`).
Cody assigns tasks, reviews your work, and maintains the big picture. **Always follow Cody's task instructions.**

### Workflow (mandatory)

1. **At the start of every session** — call `mcp__cody__get_task` with `project: "calendar"`.
2. **Before coding** — call `mcp__cody__get_project_context` with `project: "calendar"` to get conventions.
3. **Before architectural decisions** — call `mcp__cody__get_architecture` with `project: "calendar"`.
4. **After each significant step** — call `mcp__cody__report_progress` with your summary and status.
5. **When task is fully done** — call `mcp__cody__report_progress` (`status: "done"`), then `mcp__cody__request_review`.
6. **If blocked** — call `mcp__cody__report_progress` with `status: "blocked"` and describe the blocker.
7. **When you need next task** — call `mcp__cody__get_next_step`.

### MCP Tools Reference

| Tool | When to use |
|---|---|
| `mcp__cody__get_task` | **Session start** — get current task from Cody |
| `mcp__cody__get_project_context` | Before coding — stack, conventions, notes |
| `mcp__cody__get_architecture` | Before structural decisions |
| `mcp__cody__report_progress` | After each major step (in_progress / done / blocked) |
| `mcp__cody__request_review` | When feature/fix is complete and ready for review |
| `mcp__cody__get_next_step` | When task is done and you need next instructions |

> If no active task exists — tell the user: "No task assigned yet. Ask Cody via Telegram."

---

## Development Commands

```bash
npm run dev          # Development server with Turbopack
npm run build        # Production build
npm start            # Start production server
npm run lint         # Linting (eslint via eslint.config.mjs)
npm run generate:icons  # Generate PWA icons from app/icon.svg
```

---

## Project Overview

Ukrainian fiscal calendar web app (Next.js 16, App Router) displaying week numbers via ISO 8601 and GfK methodologies, with Ukrainian holidays, SEO optimization, and PWA support.

### Tech Stack

Next.js 16 | React 19 | TypeScript | Tailwind CSS v4 | shadcn/ui (New York) | date-fns v4 | TanStack Query v5 | Zustand (persist) | Lucide React | @next/third-parties (GA)

### Path Aliases

`@/*` maps to project root — e.g. `import { cn } from "@/lib/utils"`

---

## Key Architecture (summary)

> Full details: `.claude/rules/architecture.md`

- **Two calendar modes:** ISO 8601 (`lib/calendar.ts`) and GfK (`lib/gfk-calendar.ts`)
- **Zustand stores:** calendar mode/year (`fiscal-calendar-mode`), theme (`fiscal-calendar-theme`)
- **Holiday system:** Dynamic calculation with LRU cache (5 years), UTC dates via `createDate()`
- **Theme:** Light/Dark/System with FOUC prevention (inline script in layout.tsx)
- **Components:** See `.claude/rules/components.md`

---

## Docker Deployment

Multi-stage Dockerfile optimized for Coolify:
- Stage 1 (deps) → Stage 2 (builder, `output: "standalone"`) → Stage 3 (runner, port 3000)

---

## Additional Pages

- `/privacy` — Privacy Policy (app/privacy/page.tsx)
- `/terms` — Terms of Service (app/terms/page.tsx)

---

## Environment Variables

| Variable | Purpose | Required |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Base URL for SEO (sitemap, OG, robots) | Production only |
| `NEXT_PUBLIC_GA_ID` | Google Analytics ID (G-XXXXXXXXXX) | Production only |

URL validation in `lib/env.ts` — fallback: `http://localhost:3000`

---

## Important Notes

**Language:** All text in Ukrainian (`lang="uk"`, date-fns locale `uk`)

**localStorage keys:**
- `fiscal-calendar-mode` — calendar mode (ISO/GfK)
- `fiscal-calendar-theme` — theme preference
- `holidays-panel-state` — floating holidays panel open/closed
- `holidays-panel-hint-shown` — hint tooltip shown flag

**Timezone handling:**
- Holiday system uses UTC exclusively (`createDate()` helper)
- All date comparisons at 12:00:00 UTC
- UI displays use browser local timezone

**Performance:**
- LRU cache for holidays (max 5 years)
- Memoized calendar calculations
- Selective Zustand selectors
- IntersectionObserver (threshold: 0, rootMargin: -64px)
- CSS containment on MonthCalendar

**Accessibility:**
- Screen reader announcements (aria-live)
- ARIA labels on all interactive elements
- Keyboard navigation (tab, Enter, Escape)
- Controlled tooltip state for mobile touch

**Error handling:**
- Easter validates year range (1900-2100), graceful fallback
- Analytics resilient to ad-blockers (try/catch)
- Environment variable validation with console warnings
- TypeScript strict mode, no `any` types

---

## Rules Reference

| File | Content |
|---|---|
| `.claude/rules/architecture.md` | Calendar logic, state management, holiday system, component hierarchy, styling |
| `.claude/rules/components.md` | shadcn/ui components, custom components, adding new components |
| `.claude/rules/guardrails.md` | Known pitfalls, NEVER/ALWAYS rules, common mistakes |
| `.claude/rules/git-workflow.md` | Commit format, emoji guide, branch policy |
