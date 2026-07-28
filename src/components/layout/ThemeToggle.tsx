"use client";

import { useEffect, useSyncExternalStore } from "react";

type Theme = "system" | "light" | "dark";
const THEME_CHANGE_EVENT = "apple-os-dates-theme-change";

function isTheme(value: string | null): value is Theme {
  return value === "system" || value === "light" || value === "dark";
}

function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "system";
  const stored = localStorage.getItem("theme");
  return isTheme(stored) ? stored : "system";
}

function subscribeToTheme(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(THEME_CHANGE_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
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
    applyTheme(next);
    localStorage.setItem("theme", next);
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
  }

  const icon =
    theme === "dark" ? "\u{263E}" : theme === "light" ? "\u{2600}" : "\u{25D1}";

  return (
    <button
      onClick={cycleTheme}
      className="w-8 h-8 flex items-center justify-center rounded-lg text-sm text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--bg-subtle)] transition-colors"
      aria-label={`Current theme: ${theme}. Click to toggle.`}
      title={`Theme: ${theme}`}
    >
      {icon}
    </button>
  );
}
