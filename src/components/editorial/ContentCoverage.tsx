import {
  CONTENT_COVERAGE_DESCRIPTIONS,
  CONTENT_COVERAGE_LABELS,
  type ContentCoverage,
} from "@/lib/content-coverage";

export function ContentCoverageBadge({
  coverage,
}: {
  coverage: ContentCoverage;
}) {
  const label = CONTENT_COVERAGE_LABELS[coverage];
  const description = CONTENT_COVERAGE_DESCRIPTIONS[coverage];

  return (
    <span
      className={`provenance-badge content-coverage-badge content-coverage-badge--${coverage}`}
      aria-label={`${label}. ${description}`}
      title={description}
    >
      {label}
    </span>
  );
}

export function ContentCoverageDisclosure({
  coverage,
}: {
  coverage: ContentCoverage;
}) {
  return (
    <div className="content-coverage-disclosure">
      <ContentCoverageBadge coverage={coverage} />
      <p>{CONTENT_COVERAGE_DESCRIPTIONS[coverage]}</p>
    </div>
  );
}
