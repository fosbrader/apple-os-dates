import Link from "next/link";
import {
  releaseBuildPath,
  releaseEventPath,
} from "@/lib/release-routes";
import type { ChangeOccurrence } from "@/lib/types";

const GROUP_LABELS = {
  delta: "Changed in this release",
  inherited: "Inherited from an earlier release",
  cumulative: "Cumulative context",
} as const;

const GROUP_DESCRIPTIONS = {
  delta:
    "Features, fixes, removals, and regressions first observed in this release record.",
  inherited:
    "Relevant behavior that appeared earlier and continues to apply here.",
  cumulative:
    "Broader context included for understanding, not claimed as new in this release.",
} as const;

function occurrenceAnchor(targetId: string, key: string): string {
  return `change-${encodeURIComponent(`${targetId}:change:${key}`)}`;
}

export function ReleaseChanges({
  changes,
  targetId,
  platform,
  version,
}: {
  changes?: ChangeOccurrence[] | null;
  targetId: string;
  platform?: string;
  version?: string;
}) {
  const safeChanges = changes ?? [];
  if (safeChanges.length === 0) return null;

  return (
    <div className="release-change-groups">
      {(["delta", "inherited", "cumulative"] as const).map(
        (group) => {
          const occurrences = safeChanges.filter(
            (occurrence) =>
              (occurrence.inheritance ?? "delta") === group,
          );
          if (occurrences.length === 0) return null;

          return (
            <section
              aria-labelledby={`change-group-${group}`}
              className="release-change-group"
              key={group}
            >
              <header>
                <div>
                  <p className="section-kicker">Release changes</p>
                  <h3 id={`change-group-${group}`}>
                    {GROUP_LABELS[group]}
                  </h3>
                </div>
                <p>{GROUP_DESCRIPTIONS[group]}</p>
              </header>
              <div>
                {occurrences.map((occurrence) => (
                  <article
                    id={occurrenceAnchor(targetId, occurrence._key)}
                    className="release-change-card"
                    key={occurrence._key}
                  >
                    <div className="release-change-card__heading">
                      <div>
                        <p className="section-kicker">
                          {occurrence.change.category || "Change"} ·{" "}
                          {occurrence.action}
                        </p>
                        <h4>{occurrence.change.title}</h4>
                      </div>
                      <div className="release-change-card__states">
                        <span>{occurrence.documentedStatus}</span>
                        <span>{occurrence.evidenceState}</span>
                      </div>
                    </div>
                    {occurrence.summary ? (
                      <p>{occurrence.summary}</p>
                    ) : null}
                    {occurrence.targetEvent ? (
                      <p className="release-change-card__target">
                        Recorded at{" "}
                        {platform &&
                        version &&
                        occurrence.targetEvent.slug?.current ? (
                          <Link
                            href={releaseEventPath(
                              platform,
                              version,
                              occurrence.targetEvent.slug.current,
                            )}
                          >
                            {occurrence.targetEvent.label}
                          </Link>
                        ) : (
                          occurrence.targetEvent.label
                        )}
                      </p>
                    ) : occurrence.targetBuild ? (
                      <p className="release-change-card__target">
                        Recorded on build{" "}
                        {platform && version ? (
                          <Link
                            href={releaseBuildPath(
                              platform,
                              version,
                              occurrence.targetBuild.buildNumber,
                            )}
                          >
                            {occurrence.targetBuild.displayBuildNumber ??
                              occurrence.targetBuild.buildNumber}
                          </Link>
                        ) : (
                          occurrence.targetBuild.displayBuildNumber ??
                          occurrence.targetBuild.buildNumber
                        )}
                      </p>
                    ) : null}
                    {occurrence.applicability?.length ? (
                      <p className="release-change-card__applicability">
                        Applies to: {occurrence.applicability.join(", ")}
                      </p>
                    ) : null}
                    {occurrence.citations?.length ? (
                      <ol
                        aria-label={`Sources for ${occurrence.change.title}`}
                        className="release-change-card__sources"
                      >
                        {occurrence.citations.map(
                          (citation, citationIndex) => (
                            <li
                              key={
                                citation._key ??
                                citation.source._id ??
                                citationIndex
                              }
                            >
                              <a
                                href={citation.source.canonicalUrl}
                                rel="external nofollow noopener noreferrer"
                                target="_blank"
                              >
                                [{citationIndex + 1}]{" "}
                                {citation.source.title}
                              </a>
                              {citation.locator
                                ? ` · ${citation.locator}`
                                : ""}
                            </li>
                          ),
                        )}
                      </ol>
                    ) : null}
                    {occurrence.publicContributorCredit ? (
                      <p className="release-change-card__credit">
                        Community report credited to{" "}
                        {occurrence.publicContributorCredit}
                      </p>
                    ) : null}
                  </article>
                ))}
              </div>
            </section>
          );
        },
      )}
    </div>
  );
}
