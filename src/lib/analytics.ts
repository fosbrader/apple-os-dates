"use client";

export const ANALYTICS_CONSENT_STORAGE_KEY =
  "apple-release-tracker:analytics-consent";
export const ANALYTICS_CONSENT_CHANGE_EVENT =
  "analytics-consent-change";
export const ANALYTICS_READY_EVENT = "beta-cadence:analytics-ready";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    __betaCadenceAnalyticsReady?: boolean;
    __betaCadenceAnalyticsConsent?: AnalyticsConsent;
    __betaCadenceConsentDefaultsInitialized?: boolean;
  }
}

export type AnalyticsConsent = "granted" | "denied";

export interface AnalyticsEventMap {
  view_release: {
    platform: string;
    version: string;
    release_status: "active" | "released" | "unknown";
  };
  view_forecast: {
    platform: string;
    version: string;
    confidence_level: "low" | "medium" | "high";
    sample_size: number;
  };
  calendar_export: {
    platform: string;
    version: string;
    calendar_format: "ics" | "google";
  };
  release_notes_click: {
    platform: string;
    version: string;
  };
  platform_filter: {
    platform: string;
  };
  timeline_interaction: {
    action: "expand" | "collapse" | "zoom" | "pan";
    platform?: string;
  };
  share_release: {
    platform: string;
    version: string;
    method: "copy_link" | "native_share";
  };
  notification_signup: {
    signup_method: "email" | "browser";
  };
}

export type AnalyticsEventName = keyof AnalyticsEventMap;

export function hasAnalyticsConsent(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  if (window.__betaCadenceAnalyticsConsent) {
    return window.__betaCadenceAnalyticsConsent === "granted";
  }

  try {
    const storedConsent = window.localStorage.getItem(
      ANALYTICS_CONSENT_STORAGE_KEY,
    );
    return storedConsent === "granted";
  } catch {
    return false;
  }
}

export function isAnalyticsReady(): boolean {
  return (
    typeof window !== "undefined" &&
    window.__betaCadenceAnalyticsReady === true
  );
}

/**
 * Send a typed GA4 event after the visitor has opted in.
 *
 * Never include names, email addresses, search text, or other personal data in
 * event parameters.
 */
export function sendAnalyticsEvent<EventName extends AnalyticsEventName>(
  eventName: EventName,
  parameters: AnalyticsEventMap[EventName],
): void {
  if (!process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim()) {
    return;
  }

  // Consent applies at the moment an interaction happens. Do not retain an
  // action performed before opt-in and replay it if the visitor accepts later.
  if (!hasAnalyticsConsent()) {
    return;
  }

  function dispatchEvent() {
    if (hasAnalyticsConsent() && isAnalyticsReady() && window.gtag) {
      window.gtag("event", eventName, parameters);
    }
  }

  if (isAnalyticsReady()) {
    dispatchEvent();
  } else {
    window.addEventListener(ANALYTICS_READY_EVENT, dispatchEvent, {
      once: true,
    });
  }
}
