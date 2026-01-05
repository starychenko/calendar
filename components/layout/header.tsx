"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { YearNavigationControls } from "@/components/calendar/year-navigation-controls";
import { useCalendarStore } from "@/lib/stores/calendar-store";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  const year = useCalendarStore((state) => state.year);
  const setYear = useCalendarStore((state) => state.setYear);
  const mode = useCalendarStore((state) => state.mode);
  const toggleMode = useCalendarStore((state) => state.toggleMode);
  const navigationVisible = useCalendarStore((state) => state.navigationVisible);

  const handlePreviousYear = () => setYear(year - 1);
  const handleNextYear = () => setYear(year + 1);
  const handleCurrentYear = () => setYear(new Date().getFullYear());

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto px-8 sm:px-10 md:px-12 lg:px-16 xl:px-12 2xl:px-10 3xl:px-96 max-w-screen-3xl">
        <div
          className={cn(
            "grid grid-cols-[1fr_auto_1fr] items-center transition-all duration-300",
            isHomePage && navigationVisible ? "h-20" : "h-16"
          )}
        >
          {/* Logo and Title - колонка 1 (ліворуч) */}
          <div className="col-start-1 justify-self-start">
            <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
              <Calendar className="h-6 w-6 text-primary" />
              <h1 className="font-bold text-lg whitespace-nowrap">Фіскальний календар</h1>
            </Link>
          </div>

          {/* Year Navigation - колонка 2 (центр) - тільки на головній сторінці */}
          {isHomePage && (
            <div
              className={cn(
                "col-start-2 justify-self-center hidden lg:block transition-all duration-300",
                navigationVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-2 pointer-events-none"
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

          {/* Theme Toggle - колонка 3 (праворуч) */}
          <div className="col-start-3 justify-self-end">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
