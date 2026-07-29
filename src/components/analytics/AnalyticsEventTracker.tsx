"use client";

import { useEffect, useRef, useState } from "react";
import {
  ANALYTICS_CONSENT_CHANGE_EVENT,
  ANALYTICS_READY_EVENT,
  hasAnalyticsConsent,
  isAnalyticsReady,
  sendAnalyticsEvent,
} from "@/lib/analytics";

function useConsentGatedEvent(sendEvent: () => void, enabled = true) {
  const hasSent = useRef(false);
  const sendEventRef = useRef(sendEvent);

  useEffect(() => {
    sendEventRef.current = sendEvent;
  }, [sendEvent]);

  useEffect(() => {
    function sendOnce() {
      if (
        !enabled ||
        hasSent.current ||
        !hasAnalyticsConsent() ||
        !isAnalyticsReady()
      ) {
        return;
      }

      sendEventRef.current();
      hasSent.current = true;
    }

    if (enabled) {
      sendOnce();
    }
    window.addEventListener(ANALYTICS_CONSENT_CHANGE_EVENT, sendOnce);
    window.addEventListener(ANALYTICS_READY_EVENT, sendOnce);

    return () => {
      window.removeEventListener(ANALYTICS_CONSENT_CHANGE_EVENT, sendOnce);
      window.removeEventListener(ANALYTICS_READY_EVENT, sendOnce);
    };
  }, [enabled]);
}

export function ReleaseViewEvent({
  platform,
  version,
  releaseStatus,
}: {
  platform: string;
  version: string;
  releaseStatus: "active" | "released" | "superseded" | "unknown";
}) {
  useConsentGatedEvent(() => {
    sendAnalyticsEvent("view_release", {
      platform,
      version,
      release_status: releaseStatus,
    });
  });

  return null;
}

export function ForecastViewEvent({
  platform,
  version,
  confidence,
  sampleSize,
}: {
  platform: string;
  version: string;
  confidence: "low" | "medium" | "high";
  sampleSize: number;
}) {
  const markerRef = useRef<HTMLSpanElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const card = markerRef.current?.parentElement;
    if (!card || typeof IntersectionObserver === "undefined") {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(card);

    return () => observer.disconnect();
  }, []);

  useConsentGatedEvent(() => {
    sendAnalyticsEvent("view_forecast", {
      platform,
      version,
      confidence_level: confidence,
      sample_size: sampleSize,
    });
  }, isVisible);

  return <span ref={markerRef} aria-hidden="true" className="sr-only" />;
}
