import type { ValidationContext } from "sanity";

const apiVersion = "2024-01-01";

interface ReferenceValue {
  _ref?: string;
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
