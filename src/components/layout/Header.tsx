"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import { ThemeToggle } from "./ThemeToggle";

const navItems = [
  { href: "/", label: "Release index" },
  { href: "/forecasts", label: "Forecasts" },
  { href: "/timeline", label: "Timeline" },
  { href: "/analytics", label: "Analytics" },
];

export function Header() {
  const pathname = usePathname();
  const mobileMenuRef = useRef<HTMLDetailsElement>(null);

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link href="/" className="brand-lockup" aria-label="Beta Cadence home">
          <span className="brand-wordmark">
            <strong>Beta Cadence</strong>
          </span>
          <span className="brand-descriptor">Apple OS release index</span>
        </Link>

        <div className="site-header__actions">
          <nav aria-label="Primary navigation" className="primary-nav">
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
                  className={`primary-nav__link ${
                    isActive ? "primary-nav__link--active" : ""
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <details ref={mobileMenuRef} className="mobile-nav">
            <summary className="mobile-nav__trigger">
              <span>Menu</span>
              <span aria-hidden="true">⌄</span>
            </summary>
            <nav aria-label="Mobile navigation" className="mobile-nav__panel">
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
                    className={`mobile-nav__link ${
                      isActive ? "mobile-nav__link--active" : ""
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </details>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
