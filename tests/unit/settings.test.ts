import { afterEach, expect, test, vi } from "vitest";
import { useLanguageStore } from "../../lib/stores/language-store";
import { useCalendarStore } from "../../lib/stores/calendar-store";
import { useThemeStore } from "../../lib/stores/theme-store";
import { safeStorage } from "../../lib/storage";
import { siteOrigin } from "../../lib/site-config";

afterEach(() => {
  vi.unstubAllGlobals();
  useLanguageStore.setState({ locale: "uk" });
  useThemeStore.setState({ theme: "system" });
  useCalendarStore.setState({ mode: "iso", year: null });
});
test.each(["xx", null, 42, {}, ["en"]])(
  "invalid persisted locale %j recovers to Ukrainian",
  async (locale) => {
    vi.stubGlobal("window", {
      localStorage: {
        getItem: () => JSON.stringify({ state: { locale }, version: 0 }),
        setItem() {},
        removeItem() {},
      },
    });
    await useLanguageStore.persist.rehydrate();
    expect(useLanguageStore.getState().locale).toBe("uk");
  },
);
test("valid stored language/theme/mode survive hydration; unrelated fields do not", async () => {
  vi.stubGlobal("window", {
    localStorage: {
      getItem: (key: string) =>
        JSON.stringify({
          state: key.includes("lang")
            ? { locale: "en" }
            : key.includes("theme")
              ? { theme: "dark" }
              : { mode: "gfk", year: 9999, setYear: null },
          version: 0,
        }),
      setItem() {},
      removeItem() {},
    },
  });
  await useLanguageStore.persist.rehydrate();
  await useThemeStore.persist.rehydrate();
  await useCalendarStore.persist.rehydrate();
  expect(useLanguageStore.getState().locale).toBe("en");
  expect(useThemeStore.getState().theme).toBe("dark");
  expect(useCalendarStore.getState().mode).toBe("gfk");
  expect(useCalendarStore.getState().year).toBe(null);
  expect(typeof useCalendarStore.getState().setYear).toBe("function");
});
test("denied storage access and quota failure keep preferences usable", async () => {
  const denied = {};
  Object.defineProperty(denied, "localStorage", {
    get() {
      throw new Error("denied");
    },
  });
  vi.stubGlobal("window", denied);
  expect(safeStorage.getItem("key")).toBe(null);
  expect(() => safeStorage.setItem("key", "value")).not.toThrow();
  await useLanguageStore.persist.rehydrate();
  expect(() => useLanguageStore.getState().setLocale("en")).not.toThrow();
  expect(useLanguageStore.getState().locale).toBe("en");
});
test("malformed JSON cannot replace the working default", async () => {
  vi.stubGlobal("window", {
    localStorage: { getItem: () => "{bad json", setItem() {}, removeItem() {} },
  });
  await useLanguageStore.persist.rehydrate();
  expect(useLanguageStore.getState().locale).toBe("uk");
});
test("production configuration fails closed while development has a local default", () => {
  expect(siteOrigin(undefined, false)).toBe("http://localhost:3000");
  expect(siteOrigin("https://calendar.example/", true)).toBe(
    "https://calendar.example",
  );
  for (const value of [
    undefined,
    "bad",
    "javascript:alert(1)",
    "https://name:secret@example.com",
    "https://example.com/path",
    "https://example.com/?q=1",
  ])
    expect(() => siteOrigin(value, true)).toThrow();
});
