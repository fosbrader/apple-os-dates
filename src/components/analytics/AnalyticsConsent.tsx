"use client";

import Link from "next/link";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import {
  ANALYTICS_CONSENT_CHANGE_EVENT,
  ANALYTICS_CONSENT_STORAGE_KEY,
  ANALYTICS_READY_EVENT,
  type AnalyticsConsent,
} from "@/lib/analytics";

interface AnalyticsConsentManagerProps {
  measurementId: string;
}

const deniedConsent = {
  analytics_storage: "denied",
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
} as const;

function subscribeToConsent(onStoreChange: () => void) {
  function onStorage(event: StorageEvent) {
    if (
      event.key !== ANALYTICS_CONSENT_STORAGE_KEY &&
      event.key !== null
    ) {
      return;
    }

    const consentWasRevoked =
      window.__betaCadenceAnalyticsConsent === "granted" &&
      (event.key === null || event.newValue !== "granted");

    if (consentWasRevoked) {
      // Apply denial before reloading so an already-loaded tag cannot emit a
      // final beacon using the tab's previous granted state.
      updateGoogleConsent("denied");
      onStoreChange();
      window.location.reload();
      return;
    }

    onStoreChange();
  }

  window.addEventListener("storage", onStorage);
  window.addEventListener(ANALYTICS_CONSENT_CHANGE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(
      ANALYTICS_CONSENT_CHANGE_EVENT,
      onStoreChange,
    );
  };
}

function subscribeToHydration() {
  return () => {};
}

function updateGoogleConsent(consent: AnalyticsConsent) {
  window.__betaCadenceAnalyticsConsent = consent;
  window.gtag?.("consent", "update", {
    ...deniedConsent,
    analytics_storage: consent,
  });
}

function initializeGoogleConsent(consent: AnalyticsConsent | null) {
  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function gtag(...args: unknown[]) {
      window.dataLayer?.push(args);
    };

  if (!window.__betaCadenceConsentDefaultsInitialized) {
    window.gtag("consent", "default", {
      ...deniedConsent,
      wait_for_update: 500,
    });
    window.__betaCadenceConsentDefaultsInitialized = true;
  }

  if (consent) {
    updateGoogleConsent(consent);
  }
}

function readStoredConsent(): AnalyticsConsent | null {
  try {
    const storedConsent = window.localStorage.getItem(
      ANALYTICS_CONSENT_STORAGE_KEY,
    );

    return storedConsent === "granted" || storedConsent === "denied"
      ? storedConsent
      : null;
  } catch {
    return null;
  }
}

function storeConsent(consent: AnalyticsConsent): boolean {
  try {
    window.localStorage.setItem(ANALYTICS_CONSENT_STORAGE_KEY, consent);
    window.dispatchEvent(new Event(ANALYTICS_CONSENT_CHANGE_EVENT));
    return true;
  } catch {
    return false;
  }
}

function ConsentedGoogleAnalytics({
  measurementId,
}: {
  measurementId: string;
}) {
  const serializedMeasurementId = JSON.stringify(measurementId);
  const serializedReadyEvent = JSON.stringify(ANALYTICS_READY_EVENT);

  return (
    <>
      <Script
        id="beta-cadence-ga-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            window.gtag = window.gtag || function(){window.dataLayer.push(arguments);};
            window.gtag('js', new Date());
            window.gtag('config', ${serializedMeasurementId});
            window.__betaCadenceAnalyticsReady = true;
            window.dispatchEvent(new Event(${serializedReadyEvent}));
          `,
        }}
      />
      <Script
        id="beta-cadence-ga"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(
          measurementId,
        )}`}
      />
    </>
  );
}

export function AnalyticsConsentManager({
  measurementId,
}: AnalyticsConsentManagerProps) {
  const pathname = usePathname();
  const persistedConsent = useSyncExternalStore(
    subscribeToConsent,
    readStoredConsent,
    () => null,
  );
  const [memoryConsent, setMemoryConsent] =
    useState<AnalyticsConsent | null>(null);
  const consent = memoryConsent ?? persistedConsent;
  const isReady = useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false,
  );
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isConsentInitialized, setIsConsentInitialized] = useState(false);
  const isStudioRoute =
    pathname === "/studio" || pathname.startsWith("/studio/");

  useEffect(() => {
    if (isStudioRoute) {
      const googleTagWasInitialized =
        Boolean(window.gtag) ||
        Boolean(
          document.querySelector(
            'script[src*="googletagmanager.com/gtag/js"]',
          ),
        );

      if (googleTagWasInitialized) {
        window.location.reload();
      }

      return;
    }

    initializeGoogleConsent(consent);
    queueMicrotask(() => setIsConsentInitialized(true));
  }, [consent, isStudioRoute]);

  function chooseConsent(nextConsent: AnalyticsConsent) {
    const isWithdrawal = consent === "granted" && nextConsent === "denied";
    window.__betaCadenceAnalyticsConsent = nextConsent;
    updateGoogleConsent(nextConsent);
    const wasPersisted = storeConsent(nextConsent);
    setMemoryConsent(wasPersisted ? null : nextConsent);
    setIsPanelOpen(false);

    if (isWithdrawal && wasPersisted) {
      window.location.reload();
    }
  }

  const showPanel = isReady && (consent === null || isPanelOpen);

  if (isStudioRoute) {
    return null;
  }

  return (
    <>
      {consent === "granted" && isConsentInitialized ? (
        <ConsentedGoogleAnalytics measurementId={measurementId} />
      ) : null}

      {showPanel ? (
        <section
          role="region"
          aria-live="polite"
          aria-label="Analytics preferences"
          className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-xl rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-4 shadow-2xl sm:p-5"
        >
          <h2 className="text-sm font-semibold text-[var(--text)]">
            Help improve this release tracker
          </h2>
          <p className="mt-1.5 text-xs leading-5 text-[var(--text-secondary)] sm:text-sm">
            Optional Google Analytics helps us understand which release and
            forecast pages are useful. It stays off unless you accept, and
            advertising storage remains off either way. Read the{" "}
            <Link
              href="/privacy/"
              className="text-[var(--accent)] underline underline-offset-2"
            >
              privacy notice
            </Link>
            .
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => chooseConsent("granted")}
              className="min-h-11 rounded-full bg-[var(--accent-cta)] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[var(--accent-cta-hover)]"
            >
              Accept analytics
            </button>
            <button
              type="button"
              onClick={() => chooseConsent("denied")}
              className="min-h-11 rounded-full border border-[var(--border)] px-4 py-2 text-xs font-semibold text-[var(--text)] transition-colors hover:bg-[var(--bg-muted)]"
            >
              No thanks
            </button>
          </div>
        </section>
      ) : null}

      {isReady && !showPanel ? (
        <button
          type="button"
          onClick={() => setIsPanelOpen(true)}
          className="fixed bottom-3 left-3 z-40 min-h-11 rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-1.5 text-[11px] font-medium text-[var(--text-secondary)] shadow-sm transition-colors hover:text-[var(--text)]"
        >
          Analytics preferences
        </button>
      ) : null}
    </>
  );
}
