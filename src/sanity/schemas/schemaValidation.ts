import type { ValidationContext } from "sanity";

const apiVersion = "2024-01-01";

interface ReferenceValue {
  _ref?: string;
}

export interface ChronologyCoverageValue {
  status?: string;
  auditedChannels?: string[];
  coverageThrough?: string;
  knownGapNote?: string;
  verifiedAt?: string;
  auditBatch?: ReferenceValue;
}

interface CitationValue {
  source?: ReferenceValue;
}

interface ChangeOccurrenceValue {
  citations?: CitationValue[];
}

interface EditorialReviewValue {
  status?: string;
}

function normalizeDocumentId(value: string | undefined): string | undefined {
  return value?.replace(/^drafts\./, "");
}

function currentDocumentIds(context: ValidationContext): string[] {
  const id = normalizeDocumentId(context.document?._id);
  return id ? [id, `drafts.${id}`] : [];
}

function referencedId(value: unknown): string | undefined {
  return normalizeDocumentId((value as ReferenceValue | undefined)?._ref);
}

function isIsoDay(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return (
    Number.isFinite(parsed.getTime()) &&
    parsed.toISOString().slice(0, 10) === value
  );
}

function isIsoInstant(value: string): boolean {
  const match =
    /^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d+)?(?:Z|[+-](\d{2}):(\d{2}))$/.exec(
      value,
    );
  if (!match || !isIsoDay(match[1])) return false;
  const offsetHour = match[5] === undefined ? 0 : Number(match[5]);
  const offsetMinute = match[6] === undefined ? 0 : Number(match[6]);
  return (
    Number(match[2]) <= 23 &&
    Number(match[3]) <= 59 &&
    Number(match[4]) <= 59 &&
    offsetHour <= 14 &&
    offsetMinute <= 59 &&
    (offsetHour < 14 || offsetMinute === 0) &&
    Number.isFinite(Date.parse(value))
  );
}

export function validateStatusEffectiveDate(
  value: string | undefined,
  context: ValidationContext
) {
  if (!value) return true;

  const publicReleaseDate = context.document?.publicReleaseDate as
    | string
    | undefined;
  const explicitStatus = context.document?.releaseStatus as
    | string
    | undefined;
  const effectiveStatus = explicitStatus ||
    (publicReleaseDate ? "released" : "active");

  if (effectiveStatus === "active") {
    return "Active versions cannot have a status effective date.";
  }

  if (
    effectiveStatus === "released" &&
    publicReleaseDate &&
    value !== publicReleaseDate
  ) {
    return "A released version's status effective date must match its public release date.";
  }

  if (effectiveStatus === "superseded") {
    const citations = context.document?.citations as unknown[] | undefined;
    const auditBatches = context.document?.auditBatches as
      | ReferenceValue[]
      | undefined;
    const coverage = context.document
      ?.chronologyCoverage as ChronologyCoverageValue | undefined;
    const hasEvidence = Boolean(
      citations?.length ||
      auditBatches?.some((batch) => referencedId(batch)) ||
      referencedId(coverage?.auditBatch)
    );

    if (!hasEvidence) {
      return "A superseded status effective date requires a version citation or audit-batch reference.";
    }
  }

  return true;
}

export function validateStatusFirstObservedAt(
  value: string | undefined,
  context: ValidationContext,
) {
  if (!value) return true;
  if (!isIsoInstant(value)) {
    return "Status first observed at must be a valid ISO timestamp with an offset.";
  }
  const observedInstant = Date.parse(value);

  const publicReleaseDate = context.document?.publicReleaseDate as
    | string
    | undefined;
  const explicitStatus = context.document?.releaseStatus as string | undefined;
  const effectiveStatus =
    explicitStatus || (publicReleaseDate ? "released" : "active");
  if (effectiveStatus === "active") {
    return "Active versions cannot record a lifecycle-transition observation time.";
  }

  const effectiveDate =
    (context.document?.statusEffectiveDate as string | undefined) ||
    (effectiveStatus === "released" ? publicReleaseDate : undefined);
  if (!effectiveDate) {
    return "A lifecycle-transition observation time requires a status effective date.";
  }
  if (!isIsoDay(effectiveDate)) {
    return "A lifecycle-transition observation time requires a valid status effective date.";
  }
  const observedDay = new Date(observedInstant).toISOString().slice(0, 10);
  return observedDay >= effectiveDate
    ? true
    : "Status first observed at cannot precede the status effective date.";
}

export async function validateChronologyCoverage(
  value: ChronologyCoverageValue | undefined,
  context: ValidationContext
) {
  if (!value) return true;

  const allowedStatuses = ["unknown", "partial", "complete"];
  if (!value.status || !allowedStatuses.includes(value.status)) {
    return "Choose Unknown, Partial, or Complete coverage.";
  }

  const allowedChannels = [
    "developerBeta",
    "publicBeta",
    "releaseCandidate",
    "goldenMaster",
    "public",
    "securityResponse",
    "recovery",
    "other",
  ];
  if (
    value.auditedChannels?.some(
      (channel) => !allowedChannels.includes(channel)
    )
  ) {
    return "Audited channels must use a canonical release-event channel.";
  }

  if (value.status === "partial" && !value.knownGapNote?.trim()) {
    return "Partial coverage requires a known-gap note.";
  }

  if (value.status !== "complete") return true;

  if (!value.auditedChannels?.length) {
    return "Complete coverage requires at least one audited channel.";
  }
  if (!value.coverageThrough) {
    return "Complete coverage requires a coverage-through date.";
  }
  if (!value.verifiedAt) {
    return "Complete coverage requires a verification time.";
  }

  const auditBatchId = referencedId(value.auditBatch);
  if (!auditBatchId) {
    return "Complete coverage requires an audit-batch reference.";
  }

  const audit = await context
    .getClient({ apiVersion })
    .fetch<{
      status?: string;
      editorialStatus?: string;
      verifiedAt?: string;
    } | null>(
      `*[_id in $auditBatchIds] | order(_updatedAt desc)[0] {
        status,
        "editorialStatus": editorialReview.status,
        verifiedAt
      }`,
      {
        auditBatchIds: [auditBatchId, `drafts.${auditBatchId}`],
      }
    );

  return audit?.status === "complete" &&
    audit.editorialStatus === "approved" &&
    Boolean(audit.verifiedAt)
    ? true
    : "Complete coverage requires a complete, approved, and verified audit batch.";
}

export async function uniqueSourceUrl(
  value: string | undefined,
  context: ValidationContext
) {
  if (!value) return true;

  const duplicateCount = await context
    .getClient({ apiVersion })
    .fetch<number>(
      `count(*[
        _type == "source" &&
        canonicalUrl == $canonicalUrl &&
        !(_id in $documentIds)
      ])`,
      {
        canonicalUrl: value,
        documentIds: currentDocumentIds(context),
      }
    );

  return duplicateCount === 0
    ? true
    : "A source with this canonical URL already exists.";
}

export async function uniqueFeedUrl(
  value: string | undefined,
  context: ValidationContext
) {
  if (!value) return true;

  const duplicateCount = await context
    .getClient({ apiVersion })
    .fetch<number>(
      `count(*[
        _type == "feedSource" &&
        feedUrl == $feedUrl &&
        !(_id in $documentIds)
      ])`,
      {
        feedUrl: value,
        documentIds: currentDocumentIds(context),
      }
    );

  return duplicateCount === 0
    ? true
    : "A feed with this URL already exists.";
}

export async function uniqueCandidateUrl(
  value: string | undefined,
  context: ValidationContext
) {
  if (!value) return true;

  const duplicateCount = await context
    .getClient({ apiVersion })
    .fetch<number>(
      `count(*[
        _type == "ingestCandidate" &&
        canonicalUrl == $canonicalUrl &&
        !(_id in $documentIds)
      ])`,
      {
        canonicalUrl: value,
        documentIds: currentDocumentIds(context),
      }
    );

  return duplicateCount === 0
    ? true
    : "This URL has already been ingested.";
}

export async function uniqueEventIdentity(
  value: string | undefined,
  context: ValidationContext
) {
  if (!value) return true;

  const duplicateCount = await context
    .getClient({ apiVersion })
    .fetch<number>(
      `count(*[
        _type == "releaseEvent" &&
        stableEventId == $stableEventId &&
        !(_id in $documentIds)
      ])`,
      {
        stableEventId: value,
        documentIds: currentDocumentIds(context),
      }
    );

  return duplicateCount === 0
    ? true
    : "This stable event identity is already in use.";
}

export async function uniqueLegacySourceId(
  value: string | undefined,
  context: ValidationContext
) {
  if (!value) return true;

  const duplicateCount = await context
    .getClient({ apiVersion })
    .fetch<number>(
      `count(*[
        _type == "releaseEvent" &&
        legacySourceId == $legacySourceId &&
        !(_id in $documentIds)
      ])`,
      {
        legacySourceId: value,
        documentIds: currentDocumentIds(context),
      }
    );

  return duplicateCount === 0
    ? true
    : "This legacy source identity has already been migrated.";
}

export async function uniqueEventAlias(
  value: { current?: string } | undefined,
  context: ValidationContext
) {
  const routeAlias = value?.current;
  const releaseVersionId = referencedId(context.document?.releaseVersion);
  if (!routeAlias || !releaseVersionId) return true;

  const duplicateCount = await context
    .getClient({ apiVersion })
    .fetch<number>(
      `count(*[
        _type == "releaseEvent" &&
        releaseVersion._ref == $releaseVersionId &&
        routeAlias.current == $routeAlias &&
        !(_id in $documentIds)
      ])`,
      {
        releaseVersionId,
        routeAlias,
        documentIds: currentDocumentIds(context),
      }
    );

  return duplicateCount === 0
    ? true
    : "This version already has an event with that route alias.";
}

export async function uniqueBuildNumber(
  value: string | undefined,
  context: ValidationContext
) {
  const platformId = referencedId(context.document?.platform);
  if (!value || !platformId) return true;

  const duplicateCount = await context
    .getClient({ apiVersion })
    .fetch<number>(
      `count(*[
        _type == "releaseBuild" &&
        platform._ref == $platformId &&
        lower(buildNumber) == $buildNumber &&
        !(_id in $documentIds)
      ])`,
      {
        platformId,
        buildNumber: value.toLowerCase(),
        documentIds: currentDocumentIds(context),
      }
    );

  return duplicateCount === 0
    ? true
    : "This platform already has a build with that build number.";
}

export async function versionMatchesPlatform(
  _value: unknown,
  context: ValidationContext
) {
  const releaseVersionId = referencedId(context.document?.releaseVersion);
  const platformId = referencedId(context.document?.platform);
  if (!releaseVersionId || !platformId) return true;

  const versionIds = [releaseVersionId, `drafts.${releaseVersionId}`];
  const versionPlatformId = await context
    .getClient({ apiVersion })
    .fetch<string | null>(
      `*[_id in $versionIds]
        | order(_updatedAt desc)[0]
        .releaseTrain->platform._ref`,
      { versionIds }
    );

  return !versionPlatformId ||
    normalizeDocumentId(versionPlatformId) === platformId
    ? true
    : "The platform must match the selected release version's release train.";
}

export async function eventBuildMatchesParent(
  value: ReferenceValue | undefined,
  context: ValidationContext
) {
  const buildId = referencedId(value);
  const releaseVersionId = referencedId(context.document?.releaseVersion);
  const platformId = referencedId(context.document?.platform);
  if (!buildId || !releaseVersionId || !platformId) return true;

  const buildIds = [buildId, `drafts.${buildId}`];
  const build = await context
    .getClient({ apiVersion })
    .fetch<{
      releaseVersionId?: string;
      platformId?: string;
    } | null>(
      `*[_id in $buildIds] | order(_updatedAt desc)[0] {
        "releaseVersionId": releaseVersion._ref,
        "platformId": platform._ref
      }`,
      { buildIds }
    );

  if (!build) return true;

  return normalizeDocumentId(build.releaseVersionId) === releaseVersionId &&
    normalizeDocumentId(build.platformId) === platformId
    ? true
    : "The build must belong to this event's release version and platform.";
}

export function noSelfReference(
  value: ReferenceValue | undefined,
  context: ValidationContext
) {
  const targetId = referencedId(value);
  const documentId = normalizeDocumentId(context.document?._id);
  return !targetId || !documentId || targetId !== documentId
    ? true
    : "A document cannot reference itself here.";
}

export function validateProvenanceStatus(
  value: string | undefined,
  context: ValidationContext
) {
  if (!value || value === "legacyImported") return true;

  const citations = (context.document?.citations as CitationValue[] | undefined) || [];
  const auditBatches =
    (context.document?.auditBatches as ReferenceValue[] | undefined) || [];
  const review = context.document?.editorialReview as
    | EditorialReviewValue
    | undefined;

  if (value === "auditVerified" && auditBatches.length === 0) {
    return "Audit-verified records must reference at least one audit batch.";
  }
  if (
    (value === "sourceLinked" || value === "editoriallyVerified") &&
    citations.length === 0
  ) {
    return "Source-linked records must include at least one citation.";
  }
  if (value === "editoriallyVerified" && review?.status !== "approved") {
    return "Editorially verified records must have an approved editorial review.";
  }

  return true;
}

export function validateIndexable(
  value: boolean | undefined,
  context: ValidationContext
) {
  if (!value) return true;

  const review = context.document?.editorialReview as
    | EditorialReviewValue
    | undefined;
  const provenanceStatus = context.document?.provenanceStatus as
    | string
    | undefined;
  const citations =
    (context.document?.citations as CitationValue[] | undefined) || [];
  const changes =
    (context.document?.changes as ChangeOccurrenceValue[] | undefined) || [];
  const articleBody =
    (context.document?.articleBody as unknown[] | undefined) || [];

  if (review?.status !== "approved") {
    return "Only editorially approved pages may be indexed.";
  }
  if (
    provenanceStatus !== "sourceLinked" &&
    provenanceStatus !== "editoriallyVerified"
  ) {
    return "Indexed pages must be source-linked or editorially verified.";
  }
  if (citations.length === 0) {
    return "Indexed pages must include at least one page-level citation.";
  }
  if (changes.length === 0 && articleBody.length === 0) {
    return "Indexed pages need a sourced article section or substantive change.";
  }
  if (changes.some((change) => !change.citations?.length)) {
    return "Every change on an indexed page must include a citation.";
  }

  return true;
}

export function citationsRequiredWhenApproved(
  value: CitationValue[] | undefined,
  context: ValidationContext
) {
  const review = context.document?.editorialReview as
    | EditorialReviewValue
    | undefined;
  return review?.status !== "approved" || Boolean(value?.length)
    ? true
    : "Approved editorial content must include at least one citation.";
}
