import Link from "next/link";

const exploreLinks = [
  { href: "/forecasts/", label: "Forecasts" },
  { href: "/timeline/", label: "Timeline" },
  { href: "/analytics/", label: "Analytics" },
];

const projectLinks = [
  { href: "/about/", label: "About" },
  { href: "/methodology/", label: "Methodology" },
  { href: "/sources/", label: "Sources" },
];

const policyLinks = [
  { href: "/privacy/", label: "Privacy" },
  { href: "/contact/", label: "Contact" },
];

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__lead">
        <p>
          <strong>Corrections are welcome.</strong> If a date or source needs
          another look, let us know.
        </p>
        <Link href="/contact/" className="text-link">
          Report an issue
          <span aria-hidden="true">↗</span>
        </Link>
      </div>

      <div className="site-footer__grid">
        <div className="site-footer__brand">
          <Link href="/" className="brand-lockup" aria-label="Beta Cadence home">
            <span className="brand-wordmark">
              <strong>Beta Cadence</strong>
            </span>
          </Link>
          <p>
            An independent index of Apple operating-system beta and release
            dates, with transparent, history-based forecasts.
          </p>
        </div>

        {[
          { title: "Explore", links: exploreLinks },
          { title: "Project", links: projectLinks },
          { title: "Information", links: policyLinks },
        ].map((group) => (
          <nav
            key={group.title}
            aria-label={group.title}
            className="footer-nav"
          >
            <p>{group.title}</p>
            <ul>
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="site-footer__legal">
        <p>
          Not affiliated with or endorsed by Apple Inc. Apple platform names
          are trademarks of Apple Inc.
        </p>
        <p>Dates and sources maintained as a public reference.</p>
      </div>
    </footer>
  );
}
