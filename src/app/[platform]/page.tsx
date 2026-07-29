import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPlatforms, getPlatformVersions } from "@/lib/sanity.fetch";
import { JsonLd, type JsonLdValue } from "@/components/seo/JsonLd";
import { formatDate } from "@/lib/utils";
import {
  absoluteUrl,
  createPageMetadata,
  latestDate,
} from "@/lib/site";

function platformDescription(name: string, versionCount: number): string {
  return `Browse ${versionCount} ${name} versions with every tracked beta, release candidate, and public release date in one historical index.`;
}

export async function generateStaticParams() {
  const platforms = await getAllPlatforms();
  return platforms.map((p) => ({ platform: p.slug.current }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ platform: string }>;
}): Promise<Metadata> {
  const { platform: slug } = await params;
  const [platforms, versions] = await Promise.all([
    getAllPlatforms(),
    getPlatformVersions(slug),
  ]);
  const platform = platforms.find(
    (candidate) => candidate.slug.current === slug
  );

  if (!platform) {
    return {
      title: "Platform Not Found",
      robots: { index: false, follow: false },
    };
  }

  return createPageMetadata({
    title: `${platform.name} Release Dates`,
    description: platformDescription(platform.name, versions.length),
    path: `/${encodeURIComponent(slug)}/`,
  });
}

export default async function PlatformPage({
  params,
}: {
  params: Promise<{ platform: string }>;
}) {
  const { platform: slug } = await params;
  const [platforms, versions] = await Promise.all([
    getAllPlatforms(),
    getPlatformVersions(slug),
  ]);
  const platform = platforms.find((p) => p.slug.current === slug);

  if (!platform) notFound();

  const grouped = new Map<number, typeof versions>();
  for (const v of versions) {
    const major = v.releaseTrain.majorVersion;
    if (!grouped.has(major)) grouped.set(major, []);
    grouped.get(major)!.push(v);
  }

  const sortedGroups = Array.from(grouped.entries()).sort(
    ([a], [b]) => b - a
  );
  const activeVersionCount = versions.filter(
    (version) => !version.publicReleaseDate,
  ).length;
  const description = platformDescription(platform.name, versions.length);
  const canonical = absoluteUrl(`/${encodeURIComponent(slug)}/`);
  const collectionId = `${canonical}#collection`;
  const itemListId = `${canonical}#versions`;
  const dateModified = latestDate(versions.map((version) => version.updatedAt));
  const structuredData: JsonLdValue = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": collectionId,
        url: canonical,
        name: `${platform.name} Release Dates`,
        description,
        dateModified,
        isPartOf: { "@id": `${absoluteUrl("/")}#website` },
        mainEntity: { "@id": itemListId },
      },
      {
        "@type": "ItemList",
        "@id": itemListId,
        name: `${platform.name} Versions`,
        numberOfItems: versions.length,
        itemListOrder: "https://schema.org/ItemListOrderDescending",
        itemListElement: versions.map((version, index) => {
          const versionUrl = absoluteUrl(
            `/${encodeURIComponent(slug)}/${encodeURIComponent(version.version)}`
          );

          return {
            "@type": "ListItem",
            position: index + 1,
            item: {
              "@type": "Dataset",
              "@id": `${versionUrl}#release-dataset`,
              url: versionUrl,
              name: `${platform.name} ${version.version} Release Dates`,
              description: `Beta, release candidate, and public release milestones for ${platform.name} ${version.version}.`,
              dateModified: version.updatedAt,
            },
          };
        }),
      },
    ],
  };

  return (
    <>
      <JsonLd id={`${slug}-release-collection`} data={structuredData} />
      <div className="space-y-16">
        <header
          className="platform-hero animate-in"
          style={
            {
              "--delay": 0,
              "--platform-color": platform.color,
            } as React.CSSProperties
          }
        >
          <div className="platform-hero__copy">
            <p className="section-kicker">Platform release index</p>
            <h1 className="text-heading">{platform.name}</h1>
            <p>{description}</p>
            {activeVersionCount > 0 && (
              <p className="mt-5">
                <span className="badge badge-active">
                  {activeVersionCount} active{" "}
                  {activeVersionCount === 1 ? "cycle" : "cycles"}
                </span>
              </p>
            )}
          </div>
          <div className="platform-hero__meta" aria-label={`${versions.length} indexed versions`}>
            <strong>{versions.length}</strong>
            <span>Indexed versions</span>
          </div>
        </header>

        {sortedGroups.map(([majorVersion, groupVersions], groupIndex) => (
          <section
            key={majorVersion}
            className="animate-in"
            style={{ "--delay": 1 + groupIndex } as React.CSSProperties}
          >
            <div className="section-heading">
              <div>
                <p className="section-kicker">Major release family</p>
                <h2>
                  {platform.name} {majorVersion}
                </h2>
              </div>
              <p>
                {groupVersions.length} indexed{" "}
                {groupVersions.length === 1 ? "version" : "versions"} in this
                release family.
              </p>
            </div>

            <div className="surface overflow-hidden overflow-x-auto">
              <table className="data-table min-w-[48rem]">
                <caption className="sr-only">
                  {platform.name} {majorVersion} release history
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Version</th>
                    <th scope="col">Status</th>
                    <th scope="col">
                      Public release
                    </th>
                    <th scope="col">
                      First beta
                    </th>
                    <th scope="col" className="text-right">
                      Milestones
                    </th>
                    <th scope="col">
                      Note
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {groupVersions.map((version, index) => {
                    const isActive = !version.publicReleaseDate;

                    return (
                      <tr key={`${version._id}-${index}`}>
                        <td>
                          <Link
                            href={`/${slug}/${version.version}`}
                            className="inline-flex items-center gap-2 group"
                          >
                            <span className="font-mono font-semibold group-hover:text-[var(--accent)] transition-colors">
                              {version.version}
                            </span>
                            <span
                              className="text-[var(--text-tertiary)] group-hover:text-[var(--accent)]"
                              aria-hidden="true"
                            >
                              ↗
                            </span>
                          </Link>
                        </td>
                        <td>
                          {isActive ? (
                            <span className="badge badge-active">Active</span>
                          ) : (
                            <span className="badge badge-released">
                              Released
                            </span>
                          )}
                        </td>
                        <td className="text-[var(--text-secondary)]">
                          {version.publicReleaseDate
                            ? formatDate(version.publicReleaseDate)
                            : "—"}
                        </td>
                        <td className="text-[var(--text-secondary)]">
                          {version.firstBetaDate
                            ? formatDate(version.firstBetaDate)
                            : "—"}
                        </td>
                        <td className="text-right font-mono text-[var(--text-secondary)]">
                          {version.milestoneCount}
                        </td>
                        <td className="text-xs text-[var(--accent)] italic">
                          {version.versionNote || "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
