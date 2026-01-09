"use client";

import { useMemo, useCallback, useRef, useEffect } from "react";
import { getYearMonths } from "@/lib/calendar";
import { getGfkYearMonths } from "@/lib/gfk-calendar";
import { useCalendarStore } from "@/lib/stores/calendar-store";
import { MonthCalendar } from "./month-calendar";
import { YearNavigationControls } from "./year-navigation-controls";
import { TooltipProvider } from "@/components/ui/tooltip";

export function YearCalendar() {
  const navigationRef = useRef<HTMLDivElement>(null);

  // Use selective selectors to prevent unnecessary re-renders
  const year = useCalendarStore((state) => state.year);
  const setYear = useCalendarStore((state) => state.setYear);
  const mode = useCalendarStore((state) => state.mode);
  const toggleMode = useCalendarStore((state) => state.toggleMode);
  const setNavigationVisible = useCalendarStore((state) => state.setNavigationVisible);

  // Memoize calendar calculations - expensive operation
  const months = useMemo(() => {
    return mode === "iso" ? getYearMonths(year) : getGfkYearMonths(year);
  }, [year, mode]);

  // Memoize event handlers
  const handlePreviousYear = useCallback(() => setYear(year - 1), [year, setYear]);
  const handleNextYear = useCallback(() => setYear(year + 1), [year, setYear]);
  const handleCurrentYear = useCallback(() => setYear(new Date().getFullYear()), [setYear]);

  // Intersection Observer для відстеження видимості navigation
  useEffect(() => {
    const element = navigationRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Показуємо в header коли navigation НЕ видимий у viewport
        // або коли його верхній край вище header
        const isAboveViewport = entry.boundingClientRect.top < 0;
        const isNotVisible = !entry.isIntersecting;
        const shouldShowInHeader = isNotVisible || isAboveViewport;

        setNavigationVisible(shouldShowInHeader);
      },
      {
        threshold: [0, 0.1, 1], // Відстежуємо входження/виходження з viewport
        rootMargin: "-64px 0px 0px 0px", // Компенсуємо висоту header
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [setNavigationVisible]);

  return (
    <div className="space-y-4">
      {/* Screen reader announcement for mode changes */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {mode === "iso" ? "ISO 8601 режим активовано" : "GFK режим активовано"}
      </div>

      {/* Навігація та легенда - не sticky на lg+ (бо буде в header) */}
      <div
        ref={navigationRef}
        className="bg-background/95 backdrop-blur-md border-b pb-3 sm:pb-4 -mx-8 px-8 sm:-mx-10 sm:px-10 md:-mx-12 md:px-12 lg:-mx-16 lg:px-16 xl:-mx-12 xl:px-12 2xl:-mx-10 2xl:px-10 pt-4 sm:pt-5"
      >
        {/* Navigation Controls */}
        <div className="mb-3">
          <YearNavigationControls
            year={year}
            onPreviousYear={handlePreviousYear}
            onNextYear={handleNextYear}
            onCurrentYear={handleCurrentYear}
            mode={mode}
            onToggleMode={toggleMode}
          />
        </div>

        {/* Легенда - завжди на сторінці (прихована на мобільних) */}
        <div className="hidden sm:flex flex-wrap justify-center gap-2 sm:gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 bg-blue-500" />
            <span>Національні</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 bg-purple-500" />
            <span>Релігійні</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 bg-pink-500" />
            <span>Міжнародні</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 bg-amber-500" />
            <span>Комерційні</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 bg-red-400/60" />
            <span>Вихідні</span>
          </div>
        </div>
      </div>

      {/* Сітка місяців */}
      <TooltipProvider delayDuration={300}>
        <div className="calendar-grid gap-4 sm:gap-2.5 lg:gap-3 mx-auto">
          {months.map((month) => (
            <MonthCalendar
              key={`${month.year}-${month.monthNumber}`}
              month={month}
              mode={mode}
            />
          ))}
        </div>
      </TooltipProvider>
    </div>
  );
}
