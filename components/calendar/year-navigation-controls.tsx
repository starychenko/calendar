"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";

interface YearNavigationControlsProps {
  year: number;
  onPreviousYear: () => void;
  onNextYear: () => void;
  onCurrentYear: () => void;
  mode: "iso" | "gfk";
  onToggleMode: () => void;
  compact?: boolean;
}

export function YearNavigationControls({
  year,
  onPreviousYear,
  onNextYear,
  onCurrentYear,
  mode,
  onToggleMode,
  compact = false,
}: YearNavigationControlsProps) {
  return (
    <div className={cn(
      "flex items-center",
      compact
        ? "flex-row gap-2 sm:gap-3"
        : "flex-col sm:flex-row justify-center gap-3 sm:gap-4"
    )}>
      {/* Year Navigation */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        <Button
          onClick={() => {
            onPreviousYear();
            trackEvent({ event: "navigate_year", action: "previous", year: year - 1 });
          }}
          variant="outline"
          size="icon"
          className={cn(
            compact ? "h-7 w-7" : "h-8 w-8 sm:h-9 sm:w-9"
          )}
          aria-label="Попередній рік"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <span className={cn(
          "font-bold text-center",
          compact ? "text-lg min-w-16" : "text-xl sm:text-2xl md:text-3xl min-w-20"
        )}>
          {year}
        </span>

        <Button
          onClick={() => {
            onNextYear();
            trackEvent({ event: "navigate_year", action: "next", year: year + 1 });
          }}
          variant="outline"
          size="icon"
          className={cn(
            compact ? "h-7 w-7" : "h-8 w-8 sm:h-9 sm:w-9"
          )}
          aria-label="Наступний рік"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Divider */}
      <div className="h-4 w-px bg-border hidden sm:block" />

      {/* Mode Toggle */}
      <div className="flex items-center gap-1.5" role="group" aria-label="Режим календаря">
        <button
          onClick={() => {
            if (mode === "gfk") {
              onToggleMode();
              trackEvent({ event: "select_calendar_mode", mode: "iso" });
            }
          }}
          aria-pressed={mode === "iso"}
          aria-label={`ISO 8601 режим${mode === "iso" ? " (активний)" : ""}`}
          className={cn(
            "font-medium cursor-pointer transition-colors px-1.5 py-0.5 rounded",
            compact ? "text-xs" : "text-xs sm:text-sm",
            mode === "iso"
              ? "text-foreground bg-muted"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          ISO 8601
        </button>
        <span className="text-muted-foreground" aria-hidden="true">|</span>
        <button
          onClick={() => {
            if (mode === "iso") {
              onToggleMode();
              trackEvent({ event: "select_calendar_mode", mode: "gfk" });
            }
          }}
          aria-pressed={mode === "gfk"}
          aria-label={`GFK режим${mode === "gfk" ? " (активний)" : ""}`}
          className={cn(
            "font-medium cursor-pointer transition-colors px-1.5 py-0.5 rounded",
            compact ? "text-xs" : "text-xs sm:text-sm",
            mode === "gfk"
              ? "text-foreground bg-muted"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          GFK
        </button>
      </div>

      {/* Divider */}
      <div className="h-4 w-px bg-border hidden sm:block" />

      {/* Today Button */}
      <Button
        onClick={() => {
          onCurrentYear();
          trackEvent({ event: "navigate_year", action: "current", year: new Date().getFullYear() });
        }}
        variant="outline"
        size="sm"
        className={cn(
          "text-xs px-3",
          compact ? "h-7" : "h-8 sm:h-9 sm:text-sm"
        )}
      >
        Сьогодні
      </Button>
    </div>
  );
}
