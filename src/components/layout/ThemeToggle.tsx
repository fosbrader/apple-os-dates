"use client";

import { useState, useEffect } from "react";

type Theme = "system" | "light" | "dark";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("system");

  useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme | null;
    if (stored) {
      setTheme(stored);
      applyTheme(stored);
    }
  }, []);

  function applyTheme(t: Theme) {
    const root = document.documentElement;
    if (t === "system") {
      root.removeAttribute("data-theme");
      root.style.colorScheme = "";
    } else {
      root.setAttribute("data-theme", t);
      root.style.colorScheme = t;
    }
  }

  function cycleTheme() {
    const next: Theme =
      theme === "system" ? "dark" : theme === "dark" ? "light" : "system";
    setTheme(next);
    applyTheme(next);
    localStorage.setItem("theme", next);
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
