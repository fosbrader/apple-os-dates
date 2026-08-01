import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import VersionDetailPage, {
  generateMetadata as generateVersionMetadata,
} from "@/app/[platform]/[version]/page";
import { JsonLd, type JsonLdValue } from "@/components/seo/JsonLd";
import {
  getAllPlatforms,
  getAllVersionRoutes,
  getPlatformVersions,
  getVersionDetail,
} from "@/lib/sanity.fetch";
import {
  applePlatformPath,
  releaseFamilyPath,
  releaseMajor,
  releaseVersionPath,
} from "@/lib/release-routes";
import {
  getReleaseStatus,
  type ReleaseVersionSummary,
} from "@/lib/types";
import {
  absoluteUrl,
  createPageMetadata,
  latestDate,
  siteName,
} from "@/lib/site";
import { formatDate } from "@/lib/utils";

interface ReleaseRouteParams {
  platform: string;
  version: string;
}

function compareVersions(
  left: ReleaseVersionSummary,
  right: ReleaseVersionSummary,
): number {
  return right.version.localeCompare(left.version, undefined, {
    numeric: true,
  });
}

function familyDescription(
  platformName: string,
  majorVersion: number,
  versions: ReleaseVersionSummary[],
): string {
  return `Browse ${versions.length} archived ${platformName} ${majorVersion} release record${versions.length === 1 ? "" : "s"}, from major and point releases through beta and public milestones.`;
}

export async function generateStaticParams() {
  const routes = await getAllVersionRoutes();
  const params = new Map<string, ReleaseRouteParams>();

  for (const route of routes) {
    params.set(`${route.platform}:${route.version}`, {
      platform: route.platform,
      version: route.version,
    });

    const major = releaseMajor(route.version);
    if (major !== null) {
      params.set(`${route.platform}:${major}`, {
        platform: route.platform,
        version: String(major),
      });
    }
  }

  return Array.from(params.values());
}

export async function generateMetadata({
  params,
}: {
  params: Promise<ReleaseRouteParams>;
}): Promise<Metadata> {
  const { platform: platformSlug, version } = await params;
  const exactVersion = await getVersionDetail(platformSlug, version);

  if (exactVersion) {
    return generateVersionMetadata({
      params: Promise.resolve({
        platform: platformSlug,
        version,
      }),
    });
  }

  if (!/^\d+$/.test(version)) {
    return {
      title: "Release Not Found",
      robots: { index: false, follow: false },
    };
  }

  const majorVersion = Number.parseInt(version, 10);
  const [platforms, versions] = await Promise.all([
    getAllPlatforms(),
    getPlatformVersions(platformSlug),
  ]);
  const platform = platforms.find(
    (candidate) => candidate.slug.current === platformSlug,
  );
  const familyVersions = versions.filter(
    (version) => version.releaseTrain.majorVersion === majorVersion,
  );

  if (!platform || familyVersions.length === 0) {
    return {
      title: "Release Family Not Found",
      robots: { index: false, follow: false },
    };
  }

  return createPageMetadata({
    title: `${platform.name} ${majorVersion} Release Archive`,
    description: familyDescription(
      platform.name,
      majorVersion,
      familyVersions,
    ),
    path: releaseFamilyPath(platformSlug, majorVersion),
  });
}

export default async function ReleaseOrFamilyPage({
  params,
}: {
  params: Promise<ReleaseRouteParams>;
}) {
  const { platform: platformSlug, version } = await params;
  const exactVersion = await getVersionDetail(platformSlug, version);

  if (exactVersion) {
    return (
      <VersionDetailPage
        params={Promise.resolve({
          platform: platformSlug,
          version,
        })}
      />
    );
  }

  if (!/^\d+$/.test(version)) notFound();

  const majorVersion = Number.parseInt(version, 10);
  const [platforms, allVersions] = await Promise.all([
    getAllPlatforms(),
    getPlatformVersions(platformSlug),
  ]);
  const platform = platforms.find(
    (candidate) => candidate.slug.current === platformSlug,
  );
  if (!platform) notFound();

  const versions = allVersions
    .filter(
      (version) =>
        version.releaseTrain.majorVersion === majorVersion,
    )
    .sort(compareVersions);
  if (versions.length === 0) notFound();

  const canonical = absoluteUrl(
    releaseFamilyPath(platformSlug, majorVersion),
  );
  const description = familyDescription(
    platform.name,
    majorVersion,
    versions,
  );
  const structuredData: JsonLdValue = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${canonical}#collection`,
        url: canonical,
        name: `${platform.name} ${majorVersion} Release Archive`,
        description,
        dateModified: latestDate(
          versions.map((version) => version.updatedAt),
        ),
        isPartOf: { "@id": `${absoluteUrl("/")}#website` },
        breadcrumb: { "@id": `${canonical}#breadcrumb` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonical}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: siteName,
            item: absoluteUrl("/"),
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Apple",
            item: absoluteUrl("/apple/"),
          },
          {
            "@type": "ListItem",
            position: 3,
            name: platform.name,
            item: absoluteUrl(applePlatformPath(platformSlug)),
          },
          {
            "@type": "ListItem",
            position: 4,
            name: `${platform.name} ${majorVersion}`,
            item: canonical,
          },
        ],
      },
      {
        "@type": "ItemList",
        numberOfItems: versions.length,
        itemListElement: versions.map((version, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: absoluteUrl(
            releaseVersionPath(platformSlug, version.version),
          ),
          name: `${platform.name} ${version.version}`,
        })),
      },
    ],
  };

  return (
    <>
      <JsonLd id="release-family-structured-data" data={structuredData} />
      <div className="space-y-16">
        <nav aria-label="Breadcrumb" className="breadcrumb-nav">
          <Link href="/">Version Record</Link>
          <span aria-hidden="true">/</span>
          <Link href="/apple/">Apple</Link>
          <span aria-hidden="true">/</span>
          <Link href={applePlatformPath(platformSlug)}>
            {platform.name}
          </Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page" className="text-[var(--text)]">
            {majorVersion}
          </span>
        </nav>

        <header
          className="platform-hero"
          style={
            {
              "--platform-color": platform.color,
            } as React.CSSProperties
          }
        >
          <div className="platform-hero__copy">
            <p className="section-kicker">Release family</p>
            <h1 className="text-heading">
              {platform.name} {majorVersion}
            </h1>
            <p>{description}</p>
          </div>
          <div className="platform-hero__meta">
            <strong>{versions.length}</strong>
            <span>Version records</span>
          </div>
        </header>

        <section aria-labelledby="family-versions-heading">
          <div className="section-heading">
            <div>
              <p className="section-kicker">Family index</p>
              <h2 id="family-versions-heading">Versions and point releases</h2>
            </div>
            <p>
              Open a version for its beta appearances, builds, sourced
              changes, release notes, and historical context.
            </p>
          </div>

          <div className="family-release-grid">
            {versions.map((version) => {
              const status = getReleaseStatus(version);

              return (
                <article className="family-release-card" key={version._id}>
                  <div>
                    <p className="section-kicker">
                      {status === "active"
                        ? "Active cycle"
                        : status === "released"
                          ? "Released"
                          : "Superseded"}
                    </p>
                    <h3>
                      <Link
                        href={releaseVersionPath(
                          platformSlug,
                          version.version,
                        )}
                      >
                        {platform.name} {version.version}
                      </Link>
                    </h3>
                    {version.versionNote ? (
                      <p>{version.versionNote}</p>
                    ) : null}
                  </div>
                  <dl>
                    <div>
                      <dt>Public release</dt>
                      <dd>
                        {version.publicReleaseDate
                          ? formatDate(version.publicReleaseDate)
                          : status === "superseded"
                            ? "Never released"
                            : "Pending"}
                      </dd>
                    </div>
                    <div>
                      <dt>Appearances</dt>
                      <dd>{version.milestoneCount}</dd>
                    </div>
                  </dl>
                  <Link
                    className="text-link"
                    href={releaseVersionPath(
                      platformSlug,
                      version.version,
                    )}
                  >
                    Read release record <span aria-hidden="true">→</span>
                  </Link>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </>
  );
}
