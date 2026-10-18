"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { YearNavigationControls } from "@/components/calendar/year-navigation-controls";
import { useCalendarNavigation } from "@/lib/use-calendar-navigation";
import { useCalendarStore } from "@/lib/stores/calendar-store";
import { useTranslation } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const { t, locale } = useTranslation();

  const {
    year,
    mode,
    toggleMode,
    previousYear: handlePreviousYear,
    nextYear: handleNextYear,
    currentYear: handleCurrentYear,
  } = useCalendarNavigation();
  const navigationVisible = useCalendarStore((s) => s.navigationVisible);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto px-4 sm:px-10 md:px-12 lg:px-16 xl:px-12 2xl:px-10 3xl:px-96 max-w-screen-3xl">
        {/* Фіксована висота h-16 (64px) на всіх пристроях */}
        <div className="relative grid grid-cols-[1fr_auto_1fr] items-center h-16">
          {/* Logo and Title - колонка 1 (ліворуч) */}
          <div className="col-start-1 justify-self-start z-10">
            <Link
              href="/"
              className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
            >
              <Calendar className="h-6 w-6 text-primary" />
              <h1 className="font-bold text-lg whitespace-nowrap">
                <span className="sm:hidden">
                  {locale === "en" ? "Calendar" : "Календар"}
                </span>
                <span className="hidden sm:inline">
                  {t.common.fiscalCalendar}
                </span>
              </h1>
            </Link>
          </div>

          {/* Year Navigation - абсолютне позиціювання в центрі */}
          {isHomePage && (
            <div
              inert={!navigationVisible}
              aria-hidden={!navigationVisible}
              className={cn(
                "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
                "hidden lg:block transition-opacity duration-300 z-0",
                navigationVisible
                  ? "opacity-100 pointer-events-auto"
                  : "opacity-0 pointer-events-none",
              )}
            >
              <YearNavigationControls
                year={year}
                onPreviousYear={handlePreviousYear}
                onNextYear={handleNextYear}
                onCurrentYear={handleCurrentYear}
                mode={mode}
                onToggleMode={toggleMode}
                compact
              />
            </div>
          )}

          {/* Language + Theme Toggle - колонка 3 (праворуч) */}
          <div className="col-start-3 justify-self-end z-10 flex items-center gap-1">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
