# Architecture decisions

## 2026-02-20: Client language preference

The project uses a small Zustand language store and typed UK/EN translation objects. This keeps the existing single-URL product and matches the theme/mode stores without another dependency. URL routing is a product choice, not a requirement imposed by all alternative i18n libraries.

Legal page bodies and metadata remain Ukrainian; the body explicitly carries lang="uk" when the surrounding client controls use English. Initial server content is Ukrainian. After hydration the validated saved preference updates the client text and document language.

## 2026-10-18: Date-only domain and one clock

CalendarDate is a validated YYYY-MM-DD value. Arithmetic and display conversion use UTC explicitly. Local time is consulted only at the browser today boundary. The server passes an initial date to the client so the first render matches; the shared clock refreshes on hydration, focus, visibility and every 15 seconds.

ISO week number/year, fiscal week and civil month membership are separate fields. The owner confirmed that the existing GfK pattern is retained and the 53rd week goes to the final fiscal period. This is the project's business convention, not a claim of external GfK certification.

Persisted enum values are validated and storage failures are nonfatal. Core calendar and holiday generation stay independent of React and Zustand. The current supported selection range is 1900-2100.
