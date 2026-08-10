import {
  buildHistoricalAnalysisDataset,
  validateHistoricalAnalysisDataset,
  type HistoricalAnalysisDatasetV1,
  type HistoricalReleaseMetadataV1,
} from "../../src/lib/historical-analysis-dataset";
import { adaptReleaseObservations } from "../../src/lib/release-observation-adapter";
import type { PublishedHistoricalReleaseSource } from "../../src/lib/historical-release-source";
import { historicalAnalyticalSourceDigest } from "./historical-analytical-source-binding";
import {
  flattenedMetadataEvidence,
  type CuratedHistoricalMetadataManifest,
  type HistoricalReleaseMetadataPlan,
} from "./historical-release-metadata-migration";
import { stableStringify } from "./release-event-migration";

function compareText(left: string, right: string): -1 | 0 | 1 {
  return left < right ? -1 : left > right ? 1 : 0;
}

function exactIds(values: readonly string[], path: string): string[] {
  if (
    values.some((value) => typeof value !== "string" || !value.trim()) ||
    new Set(values).size !== values.length
  ) {
    throw new Error(`${path} must contain unique, non-empty stable IDs.`);
  }
  return [...values].sort(compareText);
}

export function assertHistoricalAnalyticalSourceMatchesPlan(
  plan: HistoricalReleaseMetadataPlan,
  source: unknown,
): void {
  if (
    historicalAnalyticalSourceDigest(source) !==
    plan.analyticalSnapshot.projectedSourceDigest
  ) {
    throw new Error(
      "The exact projected analytical source changed or is incomplete relative to the approved plan. Generate and approve a new plan.",
    );
  }
}

export function assertExactHistoricalManifestCohortCoverage(
  manifest: CuratedHistoricalMetadataManifest,
  plan: HistoricalReleaseMetadataPlan,
  source: PublishedHistoricalReleaseSource,
): void {
  const sourceReleaseIds = exactIds(
    source.releases.map(({ id }) => id),
    "Published analytical release cohort",
  );
  const manifestReleaseIds = exactIds(
    manifest.entries.map(({ releaseVersionId }) => releaseVersionId),
    "Curated manifest release cohort",
  );
  const plannedReleaseIds = exactIds(
    plan.mutations.map(({ releaseVersionId }) => releaseVersionId),
    "Reviewed plan release cohort",
  );
  if (
    stableStringify(manifestReleaseIds) !== stableStringify(sourceReleaseIds) ||
    stableStringify(plannedReleaseIds) !== stableStringify(sourceReleaseIds)
  ) {
    throw new Error(
      "The curated manifest and reviewed plan must exactly cover the complete published analytical release cohort.",
    );
  }
  assertHistoricalAnalyticalSourceMatchesPlan(plan, source);
}

function plannedHistoricalReleaseMetadata(
  manifest: CuratedHistoricalMetadataManifest,
): HistoricalReleaseMetadataV1[] {
  return manifest.entries
    .map((entry) => ({
      releaseId: entry.releaseVersionId,
      platformId: entry.platformId,
      productFamilyId: entry.productFamilyId,
      releaseClass: entry.releaseClass,
      releasePosition: entry.releasePosition,
      releaseCycleId: entry.releaseCycleId,
      sourceEvidenceIds: flattenedMetadataEvidence(entry.metadataEvidence).map(
        ({ id }) => id,
      ),
      chronologyCoverage:
        entry.chronologyCoverage.state === "complete"
          ? {
              state: "complete" as const,
              sourceEvidenceIds: entry.chronologyCoverage.evidence.map(
                ({ id }) => id,
              ),
            }
          : {
              state: "unknown" as const,
              reason: entry.chronologyCoverage.reason,
              sourceEvidenceIds: entry.chronologyCoverage.evidence.map(
                ({ id }) => id,
              ),
            },
    }))
    .sort((left, right) => compareText(left.releaseId, right.releaseId));
}

export function projectHistoricalPostPlanSource(
  source: PublishedHistoricalReleaseSource,
  manifest: CuratedHistoricalMetadataManifest,
  plan: HistoricalReleaseMetadataPlan,
): PublishedHistoricalReleaseSource {
  assertExactHistoricalManifestCohortCoverage(manifest, plan, source);
  const cohortIds = new Set(manifest.entries.map(({ releaseVersionId }) => releaseVersionId));
  const lifecycleByRelease = new Map(
    plan.lifecycleObservationPatches.map((patch) => [patch.id, patch]),
  );
  for (const id of lifecycleByRelease.keys()) {
    if (!cohortIds.has(id)) {
      throw new Error(
        `Reviewed lifecycle patch ${id} is outside the complete published analytical release cohort.`,
      );
    }
  }

  return {
    releases: source.releases.map((release) => {
      const patch = lifecycleByRelease.get(release.id);
      return patch
        ? {
            ...release,
            statusFirstObservedAt: patch.set.statusFirstObservedAt,
          }
        : release;
    }),
    events: source.events,
    compatibilityMilestones: source.compatibilityMilestones,
    releaseMetadata: [
      ...source.releaseMetadata.filter(
        ({ releaseId }) => !cohortIds.has(releaseId),
      ),
      ...plannedHistoricalReleaseMetadata(manifest),
    ],
  };
}

export function buildValidatedHistoricalPostPlanDataset(input: {
  source: PublishedHistoricalReleaseSource;
  manifest: CuratedHistoricalMetadataManifest;
  plan: HistoricalReleaseMetadataPlan;
  issuedAt: string;
}): HistoricalAnalysisDatasetV1 {
  const postPlanSource = projectHistoricalPostPlanSource(
    input.source,
    input.manifest,
    input.plan,
  );
  const adapterResult = adaptReleaseObservations({
    asOfDate: input.issuedAt.slice(0, 10),
    issuedAt: input.issuedAt,
    releases: postPlanSource.releases,
    events: postPlanSource.events,
    compatibilityMilestones: postPlanSource.compatibilityMilestones,
  });
  const dataset = buildHistoricalAnalysisDataset({
    adapterResult,
    releaseMetadata: postPlanSource.releaseMetadata,
  });
  const issues = validateHistoricalAnalysisDataset(dataset);
  if (issues.length) {
    throw new Error(
      `The in-memory post-plan FR-007 dataset is invalid: ${stableStringify(issues)}.`,
    );
  }
  return dataset;
}
