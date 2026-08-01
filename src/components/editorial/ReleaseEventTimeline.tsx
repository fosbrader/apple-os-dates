import Link from "next/link";
import {
  releaseBuildPath,
  releaseEventPath,
} from "@/lib/release-routes";
import type {
  ReleaseEvent,
} from "@/lib/types";
import { getContentCoverage } from "@/lib/content-coverage";
import { releaseEventChannelLabel } from "@/lib/release-events";
import { daysBetween, formatDate } from "@/lib/utils";
import { ContentCoverageBadge } from "./ContentCoverage";
import { ProvenanceBadge } from "./Provenance";

function eventHref(
  event: ReleaseEvent,
  platform: string,
  version: string,
): string {
  return releaseEventPath(
    platform,
    version,
    event.slug?.current || event._id,
  );
}

export function ReleaseEventTimeline({
  events,
  platform,
  version,
}: {
  events: ReleaseEvent[];
  platform: string;
  version: string;
}) {
  if (events.length === 0) {
    return (
      <p className="text-[var(--text-tertiary)]">
        No release appearances have been recorded.
      </p>
    );
  }

  return (
    <ol className="release-event-list">
      {events.map((event, index) => {
        const previous = index > 0 ? events[index - 1] : undefined;
        const interval = previous
          ? daysBetween(previous.date, event.date)
          : null;
        const sourceCount = event.citations?.length ?? 0;
        const isEditoriallyApproved =
          event.editorialReview?.status === "approved";
        const contentCoverage = getContentCoverage({
          article: isEditoriallyApproved
            ? event.articleBody
            : undefined,
          citations: event.citations,
          changes: isEditoriallyApproved
            ? event.changes
            : undefined,
        });

        return (
          <li key={event._id}>
            <div className="release-event-list__date">
              <time dateTime={event.date}>{formatDate(event.date)}</time>
              {interval !== null ? (
                <small>
                  +{interval} {interval === 1 ? "day" : "days"}
                </small>
              ) : null}
            </div>
            <article className="release-event-card">
              <header>
                <div>
                  <p className="section-kicker">
                    {releaseEventChannelLabel(event.normalizedChannel)}
                  </p>
                  <h3>
                    <Link href={eventHref(event, platform, version)}>
                      {event.label}
                    </Link>
                  </h3>
                </div>
                <div className="release-event-card__badges">
                  <ContentCoverageBadge coverage={contentCoverage} />
                  <ProvenanceBadge status={event.provenanceStatus} />
                </div>
              </header>
              {event.note ? <p>{event.note}</p> : null}
              <dl>
                {event.build?.buildNumber ? (
                  <div>
                    <dt>Build</dt>
                    <dd>
                      <Link
                        href={releaseBuildPath(
                          platform,
                          version,
                          event.build.buildNumber,
                        )}
                      >
                        <code>
                          {event.build.displayBuildNumber ??
                            event.build.buildNumber}
                        </code>
                      </Link>
                    </dd>
                  </div>
                ) : null}
                {event.versionLabelAtAppearance ? (
                  <div>
                    <dt>Version label</dt>
                    <dd>{event.versionLabelAtAppearance}</dd>
                  </div>
                ) : null}
                <div>
                  <dt>Availability</dt>
                  <dd>{event.availabilityState ?? "available"}</dd>
                </div>
                <div>
                  <dt>Sources</dt>
                  <dd>
                    {sourceCount > 0
                      ? `${sourceCount} linked`
                      : "Awaiting claim-level sources"}
                  </dd>
                </div>
              </dl>
              <Link
                className="text-link"
                href={eventHref(event, platform, version)}
              >
                Open this appearance <span aria-hidden="true">→</span>
              </Link>
            </article>
          </li>
        );
      })}
    </ol>
  );
}
