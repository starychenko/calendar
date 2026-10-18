import type { StateStorage } from "zustand/middleware";

/** Preferences are optional; denied access or quota errors must never break the app. */
export const safeStorage: StateStorage = {
  getItem: (name) => {
    try {
      return typeof window === "undefined"
        ? null
        : window.localStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem: (name, value) => {
    try {
      window.localStorage.setItem(name, value);
    } catch {
      /* Continue with in-memory preferences. */
    }
  },
  removeItem: (name) => {
    try {
      window.localStorage.removeItem(name);
    } catch {
      /* Storage may be disabled. */
    }
  },
};
export function storedField(value: unknown, key: string): unknown {
  return typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)[key]
    : undefined;
}
