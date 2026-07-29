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
    <footer className="site-footer">
      <div className="site-footer__lead">
        <div>
          <p className="section-kicker">Keep the record accurate</p>
          <h2>Found a release date that needs a second look?</h2>
        </div>
        <Link href="/contact/" className="button button--secondary">
          Submit a correction
          <span aria-hidden="true">↗</span>
        </Link>
      </div>

      <div className="site-footer__grid">
        <div className="site-footer__brand">
          <Link href="/" className="brand-lockup" aria-label="Beta Cadence home">
            <span className="brand-mark" aria-hidden="true">
              <span className="brand-mark__orbit" />
              <span className="brand-mark__core" />
            </span>
            <span className="brand-wordmark">
              <span>Beta</span>
              <strong>Cadence</strong>
            </span>
          </Link>
          <p>
            An independent release index for the Apple operating-system
            ecosystem. Historical dates, transparent forecasts, no rumor mill.
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
        <p>Built as a public reference · Data maintained in Sanity</p>
      </div>
    </footer>
  );
}
