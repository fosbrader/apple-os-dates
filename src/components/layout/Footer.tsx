import Link from "next/link";
import { siteXHandle, siteXUrl } from "@/lib/site";
import {
  createSiteBuildMetadata,
  formatSiteUpdatedAt,
} from "@/lib/site-version";

const exploreLinks = [
  { href: "/search/", label: "Search" },
  { href: "/apple/", label: "Apple releases" },
  { href: "/forecasts/", label: "Forecasts" },
  { href: "/timeline/", label: "Timeline" },
  { href: "/analytics/", label: "Analytics" },
  { href: "/exports/", label: "Data exports" },
  { href: "/api/", label: "Public API" },
];

const projectLinks = [
  { href: "/about/", label: "About" },
  { href: "/news/", label: "Site news" },
  { href: "/methodology/", label: "Methodology" },
  { href: "/sources/", label: "Editorial policy" },
  { href: "/corrections/", label: "Corrections" },
];

const policyLinks = [
  { href: "/privacy/", label: "Privacy" },
  { href: "/submit/", label: "Submit a tip" },
  { href: "/contact/", label: "Contact" },
];

export function Footer() {
  const fallbackBuildMetadata = createSiteBuildMetadata();
  const siteVersion =
    process.env.NEXT_PUBLIC_SITE_VERSION ?? fallbackBuildMetadata.version;
  const siteUpdatedAt =
    process.env.NEXT_PUBLIC_SITE_UPDATED_AT ?? fallbackBuildMetadata.updatedAt;

  return (
    <footer className="site-footer">
      <div className="site-footer__lead">
        <p>
          <strong>Corrections are welcome.</strong> If a date or source needs
          another look, let us know.
        </p>
        <Link href="/contact/" className="text-link">
          Report an issue
          <span aria-hidden="true">→</span>
        </Link>
      </div>

      <div className="site-footer__grid">
        <div className="site-footer__brand">
          <Link href="/" className="brand-lockup" aria-label="Version Record home">
            <span className="brand-wordmark">
              <strong>Version Record</strong>
            </span>
          </Link>
          <p>
            Independent release histories, notes, corrections, and sources.
            Apple platforms are the first catalog.
          </p>
          <a
            className="text-link"
            href={siteXUrl}
            rel="me noopener"
            target="_blank"
          >
            {siteXHandle} on X
            <span aria-hidden="true">↗</span>
          </a>
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
          Independent and not affiliated with or endorsed by Apple Inc. Apple
          platform names are trademarks of Apple Inc.
        </p>
        <p>Structured archive data is published under CC0; editorial prose is protected.</p>
        <p className="site-footer__version">
          <span className="site-footer__version-meta">
            Build version <strong>{siteVersion}</strong>
          </span>
          <span className="site-footer__version-meta">
            Built{" "}
            <time dateTime={siteUpdatedAt}>
              {formatSiteUpdatedAt(siteUpdatedAt)}
            </time>
          </span>
          <span className="site-footer__version-note">
            This build version identifies the deployed site code, not content
            freshness. Archive data and editorial content can update separately.
          </span>
        </p>
      </div>
    </footer>
  );
}
