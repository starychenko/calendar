"use client";

import { useLayoutEffect } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { useLanguageStore } from "@/lib/stores/language-store";
import { useCalendarStore } from "@/lib/stores/calendar-store";

export function Providers({ children }: { children: React.ReactNode }) {
  useLayoutEffect(() => {
    // Sync client state from inline script globals before browser paint
    const initialLocale = window.__FISCAL_LOCALE__;
    if (initialLocale && initialLocale !== useLanguageStore.getState().locale) {
      useLanguageStore.setState({ locale: initialLocale });
    }

    const initialMode = window.__FISCAL_MODE__;
    if (initialMode && initialMode !== useCalendarStore.getState().mode) {
      useCalendarStore.setState({ mode: initialMode });
    }

    // Rehydrate persist middleware for future persistence
    useLanguageStore.persist.rehydrate();
    useCalendarStore.persist.rehydrate();

    // Reveal body now that state is correct
    document.documentElement.classList.remove("needs-hydration");
  }, []);

  return (
    <>
      <ThemeProvider />
      {children}
    </>
  );
}
