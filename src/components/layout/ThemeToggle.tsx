"use client";

import { useEffect, useSyncExternalStore } from "react";

type Theme = "system" | "light" | "dark";
const THEME_CHANGE_EVENT = "apple-os-dates-theme-change";

interface ThemeStorageReader {
  getItem(key: string): string | null;
}

interface ThemeStorageWriter {
  setItem(key: string, value: string): void;
}

export interface ThemePreferenceSnapshot {
  storageAvailable: boolean;
  theme: Theme;
}

let transientTheme: Theme = "system";
let preferTransientTheme = false;

function isTheme(value: string | null): value is Theme {
  return value === "system" || value === "light" || value === "dark";
}

export function readThemePreference(
  storage: ThemeStorageReader | null,
  fallback: Theme = "system",
): ThemePreferenceSnapshot {
  if (!storage) {
    return { storageAvailable: false, theme: fallback };
  }

  try {
    const stored = storage.getItem("theme");
    return {
      storageAvailable: true,
      theme: isTheme(stored) ? stored : "system",
    };
  } catch {
    return { storageAvailable: false, theme: fallback };
  }
}

export function storeThemePreference(
  storage: ThemeStorageWriter | null,
  theme: Theme,
): boolean {
  if (!storage) return false;

  try {
    storage.setItem("theme", theme);
    return true;
  } catch {
    return false;
  }
}

function getBrowserStorage(): Storage | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "system";
  if (preferTransientTheme) return transientTheme;

  const snapshot = readThemePreference(getBrowserStorage(), transientTheme);
  transientTheme = snapshot.theme;
  preferTransientTheme = !snapshot.storageAvailable;
  return snapshot.theme;
}

function subscribeToTheme(onStoreChange: () => void) {
  function onStorage() {
    preferTransientTheme = false;
    onStoreChange();
  }

  window.addEventListener("storage", onStorage);
  window.addEventListener(THEME_CHANGE_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(THEME_CHANGE_EVENT, onStoreChange);
  };
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === "system") {
    root.removeAttribute("data-theme");
    root.style.colorScheme = "";
  } else {
    root.setAttribute("data-theme", theme);
    root.style.colorScheme = theme;
  }
}

export function ThemeToggle() {
  const theme = useSyncExternalStore<Theme>(
    subscribeToTheme,
    getStoredTheme,
    () => "system"
  );

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  function cycleTheme() {
    const next: Theme =
      theme === "system" ? "dark" : theme === "dark" ? "light" : "system";
    transientTheme = next;
    applyTheme(next);
    preferTransientTheme = !storeThemePreference(getBrowserStorage(), next);
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
  }

  const icon = theme === "dark" ? "●" : theme === "light" ? "○" : "◐";
  const label =
    theme === "dark" ? "Dark" : theme === "light" ? "Light" : "System";

  return (
    <button
      onClick={cycleTheme}
      type="button"
      className="theme-toggle"
      aria-label={`Current theme: ${label}. Activate to change theme.`}
      title={`Theme: ${label}`}
    >
      <span aria-hidden="true">{icon}</span>
      <span className="theme-toggle__label">{label}</span>
    </button>
  );
}
