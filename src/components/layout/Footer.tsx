import Link from "next/link";

const exploreLinks = [
  { href: "/forecasts", label: "Forecasts" },
  { href: "/timeline", label: "Timeline" },
  { href: "/analytics", label: "Analytics" },
];

const projectLinks = [
  { href: "/about", label: "About" },
  { href: "/methodology", label: "Methodology" },
  { href: "/sources", label: "Sources" },
];

const policyLinks = [
  { href: "/privacy", label: "Privacy" },
  { href: "/contact", label: "Contact" },
];

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] mt-16">
      <div className="max-w-6xl mx-auto px-6 py-10 grid gap-8 sm:grid-cols-[minmax(0,2fr)_repeat(3,minmax(0,1fr))]">
        <div>
          <p className="text-sm font-semibold">Beta Cadence</p>
          <p className="mt-2 max-w-sm text-xs leading-relaxed text-[var(--text-tertiary)]">
            An independent reference for Apple operating-system beta cycles,
            release history, and evidence-based forecast ranges. Not affiliated
            with or endorsed by Apple Inc.
          </p>
        </div>
        {[
          { title: "Explore", links: exploreLinks },
          { title: "Project", links: projectLinks },
          { title: "Information", links: policyLinks },
        ].map((group) => (
          <nav key={group.title} aria-label={group.title}>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
              {group.title}
            </p>
            <ul className="mt-3 space-y-2">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs text-[var(--text-tertiary)] hover:text-[var(--text)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
    </footer>
  );
}
