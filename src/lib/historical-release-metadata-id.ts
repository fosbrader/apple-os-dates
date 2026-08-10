export const HISTORICAL_RELEASE_METADATA_DOCUMENT_TYPE =
  "historicalReleaseMetadata";
export const HISTORICAL_RELEASE_METADATA_ID_PREFIX =
  `${HISTORICAL_RELEASE_METADATA_DOCUMENT_TYPE}.`;

const MAX_SANITY_DOCUMENT_ID_LENGTH = 128;
const SAFE_SANITY_DOCUMENT_ID = /^[A-Za-z0-9][A-Za-z0-9._-]*$/;

/** One release version has exactly one deterministic, non-rewritten sidecar ID. */
export function historicalReleaseMetadataDocumentId(
  releaseVersionId: string | undefined,
): string | null {
  const normalized = releaseVersionId?.replace(/^drafts\./, "").trim();
  if (!normalized || !SAFE_SANITY_DOCUMENT_ID.test(normalized)) return null;

  const documentId = `${HISTORICAL_RELEASE_METADATA_ID_PREFIX}${normalized}`;
  return documentId.length <= MAX_SANITY_DOCUMENT_ID_LENGTH
    ? documentId
    : null;
}
