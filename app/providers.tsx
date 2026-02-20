"use client";

import { useLayoutEffect } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { useLanguageStore } from "@/lib/stores/language-store";

export function Providers({ children }: { children: React.ReactNode }) {
  useLayoutEffect(() => {
    // Sync locale from inline script's global before browser paint
    const initial = window.__FISCAL_LOCALE__;
    if (initial && initial !== useLanguageStore.getState().locale) {
      useLanguageStore.setState({ locale: initial });
    }
    // Rehydrate persist middleware for future persistence
    useLanguageStore.persist.rehydrate();
  }, []);

  return (
    <>
      <ThemeProvider />
      {children}
    </>
  );
}
