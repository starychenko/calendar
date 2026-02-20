/**
 * Google Analytics event tracking utilities
 *
 * Provides type-safe custom event tracking for user interactions.
 * Works with @next/third-parties/google integration.
 */

// Global gtag type declaration
declare global {
  interface Window {
    gtag?: (
      command: "event",
      eventName: string,
      eventParams?: Record<string, string | number>
    ) => void;
  }
}

/**
 * Analytics events with their parameters
 * All events are type-safe for better developer experience
 */
export type CalendarAnalyticsEvent =
  | {
      event: "select_theme";
      theme: "light" | "dark" | "system";
    }
  | {
      event: "navigate_year";
      action: "previous" | "next" | "current";
      year: number;
    }
  | {
      event: "select_calendar_mode";
      mode: "iso" | "gfk";
    }
  | {
      event: "outbound_click";
      social_network: "linkedin" | "telegram" | "github";
      url: string;
    }
  | {
      event: "select_language";
      language: "uk" | "en";
    };

/**
 * Track a custom event in Google Analytics
 *
 * @param eventData - Event object with event name and parameters
 *
 * @example
 * ```tsx
 * trackEvent({ event: 'select_theme', theme: 'dark' });
 * trackEvent({ event: 'navigate_year', action: 'next', year: 2025 });
 * trackEvent({ event: 'outbound_click', social_network: 'linkedin', url: '...' });
 * ```
 */
export function trackEvent(eventData: CalendarAnalyticsEvent): void {
  // Only track events in browser environment
  if (typeof window === "undefined") {
    return;
  }

  try {
    // Check if gtag is available (loaded by @next/third-parties/google)
    if (!window.gtag) {
      // In development, log that GA is not active
      if (process.env.NODE_ENV === "development") {
        console.log("[Analytics] Event tracked (dev mode):", eventData);
      }
      return;
    }

    // Extract event name and parameters
    const { event, ...params } = eventData;

    // Send event to Google Analytics
    window.gtag("event", event, params);
  } catch (error) {
    // Тихо ігноруємо помилки analytics (не повинні впливати на UX)
    // Analytics може бути заблоковано ad-blockers або виникнути інші помилки
    if (process.env.NODE_ENV === "development") {
      console.warn("[Analytics] Failed to track event:", error);
    }
  }
}
