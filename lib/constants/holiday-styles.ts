import type { Holiday } from "@/lib/holidays";

/**
 * Holiday style configurations for calendar day cells
 */
export const HOLIDAY_STYLES: Record<Holiday["type"], string> = {
  national:
    "bg-linear-to-br from-blue-50 to-blue-100/80 dark:from-blue-950/40 dark:to-blue-900/50 text-blue-900 dark:text-blue-100 border-blue-200/30 dark:border-blue-800/30",
  religious:
    "bg-linear-to-br from-purple-50 to-purple-100/80 dark:from-purple-950/40 dark:to-purple-900/50 text-purple-900 dark:text-purple-100 border-purple-200/30 dark:border-purple-800/30",
  international:
    "bg-linear-to-br from-pink-50 to-pink-100/80 dark:from-pink-950/40 dark:to-pink-900/50 text-pink-900 dark:text-pink-100 border-pink-200/30 dark:border-pink-800/30",
  commercial:
    "bg-linear-to-br from-amber-50 to-amber-100/80 dark:from-amber-950/40 dark:to-amber-900/50 text-amber-900 dark:text-amber-100 border-amber-200/30 dark:border-amber-800/30",
  lent:
    "bg-linear-to-br from-slate-50/40 to-slate-100/60 dark:from-slate-950/20 dark:to-slate-900/30 text-slate-700 dark:text-slate-300 border-slate-200/20 dark:border-slate-800/20",
};

/**
 * Holiday indicator configurations
 */
export const HOLIDAY_INDICATORS: Record<Holiday["type"], string> = {
  national:
    "absolute bottom-1 left-1/2 -translate-x-1/2 w-2 h-0.5 sm:w-2.5 sm:h-0.5 bg-blue-600 dark:bg-blue-400 shadow-sm shadow-blue-600/50 dark:shadow-blue-400/50",
  religious:
    "absolute bottom-1 left-1/2 -translate-x-1/2 w-2 h-0.5 sm:w-2.5 sm:h-0.5 bg-purple-600 dark:bg-purple-400 shadow-sm shadow-purple-600/50 dark:shadow-purple-400/50",
  international:
    "absolute bottom-1 left-1/2 -translate-x-1/2 w-2 h-0.5 sm:w-2.5 sm:h-0.5 bg-pink-600 dark:bg-pink-400 shadow-sm shadow-pink-600/50 dark:shadow-pink-400/50",
  commercial:
    "absolute bottom-1 left-1/2 -translate-x-1/2 w-2 h-0.5 sm:w-2.5 sm:h-0.5 bg-amber-600 dark:bg-amber-400 shadow-sm shadow-amber-600/50 dark:shadow-amber-400/50",
  lent:
    "absolute bottom-1 left-1/2 -translate-x-1/2 w-2 h-0.5 sm:w-2.5 sm:h-0.5 bg-slate-400 dark:bg-slate-500 shadow-sm shadow-slate-400/30 dark:shadow-slate-500/30",
};
