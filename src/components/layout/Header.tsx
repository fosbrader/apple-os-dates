"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import { ThemeToggle } from "./ThemeToggle";

const navItems = [
  { href: "/", label: "Dashboard" },
  { href: "/forecasts", label: "Forecasts" },
  { href: "/timeline", label: "Timeline" },
  { href: "/analytics", label: "Analytics" },
];

export function Header() {
  const pathname = usePathname();
  const mobileMenuRef = useRef<HTMLDetailsElement>(null);

  return (
    <header
      className="sticky top-0 z-50 border-b border-[var(--border)]"
      style={{
        background: "color-mix(in srgb, var(--bg) 85%, transparent)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-1.5">
          <span className="text-[var(--text-tertiary)] font-normal text-sm tracking-wide">
            Beta
          </span>
          <span className="font-semibold text-sm">Cadence</span>
        </Link>

        <div className="flex items-center gap-1">
          <nav
            aria-label="Primary navigation"
            className="hidden sm:flex items-center gap-0.5"
          >
            {navItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                    isActive
                      ? "text-[var(--text)] bg-[var(--bg-subtle)] font-medium"
                      : "text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--bg-subtle)]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <details ref={mobileMenuRef} className="relative sm:hidden">
            <summary className="list-none cursor-pointer px-3 py-1.5 text-sm rounded-lg text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--bg-subtle)] [&::-webkit-details-marker]:hidden">
              Menu
            </summary>
            <nav
              aria-label="Mobile navigation"
              className="absolute right-0 top-10 min-w-40 surface p-1.5 shadow-xl"
            >
              {navItems.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => {
                      if (mobileMenuRef.current) {
                        mobileMenuRef.current.open = false;
                      }
                    }}
                    className={`block px-3 py-2 text-sm rounded-lg transition-colors ${
                      isActive
                        ? "text-[var(--text)] bg-[var(--bg-subtle)] font-medium"
                        : "text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--bg-subtle)]"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </details>
          <div className="w-px h-5 bg-[var(--border)] mx-2" />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
