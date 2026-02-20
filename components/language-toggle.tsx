"use client";

import { useLanguageStore } from "@/lib/stores/language-store";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";

export function LanguageToggle() {
  const locale = useLanguageStore((state) => state.locale);
  const setLocale = useLanguageStore((state) => state.setLocale);

  const handleToggle = () => {
    const newLocale = locale === "uk" ? "en" : "uk";
    setLocale(newLocale);
    trackEvent({ event: "select_language", language: newLocale });

    // Update html lang attribute immediately
    document.documentElement.lang = newLocale;
  };

  return (
    <button
      onClick={handleToggle}
      className={cn(
        "flex items-center gap-0.5 h-9 px-2 rounded-md",
        "text-sm font-medium",
        "hover:bg-accent hover:text-accent-foreground",
        "transition-colors cursor-pointer"
      )}
      aria-label={locale === "uk" ? "Switch to English" : "Перемкнути на українську"}
    >
      <span className={cn(
        "transition-colors",
        locale === "uk" ? "text-foreground font-semibold" : "text-muted-foreground"
      )}>
        UA
      </span>
      <span className="text-muted-foreground/50">/</span>
      <span className={cn(
        "transition-colors",
        locale === "en" ? "text-foreground font-semibold" : "text-muted-foreground"
      )}>
        EN
      </span>
    </button>
  );
}
