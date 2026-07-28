import type { ValidationContext } from "sanity";

const apiVersion = "2024-01-01";

function documentIds(context: ValidationContext): string[] {
  const id = context.document?._id?.replace(/^drafts\./, "");
  return id ? [id, `drafts.${id}`] : [];
}

export async function uniquePlatformSlug(
  value: { current?: string } | undefined,
  context: ValidationContext
) {
  const slug = value?.current;
  if (!slug) return true;

  const duplicateCount = await context
    .getClient({ apiVersion })
    .fetch<number>(
      `count(*[
        _type == "platform" &&
        slug.current == $slug &&
        !(_id in $documentIds)
      ])`,
      { slug, documentIds: documentIds(context) }
    );

  return duplicateCount === 0
    ? true
    : "This platform slug is already in use.";
}

export async function uniqueReleaseTrain(
  value: number | undefined,
  context: ValidationContext
) {
  const platformId = (
    context.document?.platform as { _ref?: string } | undefined
  )?._ref?.replace(/^drafts\./, "");
  if (!platformId || value === undefined) return true;

  const duplicateCount = await context
    .getClient({ apiVersion })
    .fetch<number>(
      `count(*[
        _type == "releaseTrain" &&
        platform._ref == $platformId &&
        majorVersion == $majorVersion &&
        !(_id in $documentIds)
      ])`,
      {
        platformId,
        majorVersion: value,
        documentIds: documentIds(context),
      }
    );

  return duplicateCount === 0
    ? true
    : "This platform already has a release train with that major version.";
}

export async function uniqueReleaseVersion(
  value: string | undefined,
  context: ValidationContext
) {
  const releaseTrainId = (
    context.document?.releaseTrain as { _ref?: string } | undefined
  )?._ref?.replace(/^drafts\./, "");
  if (!releaseTrainId || !value) return true;

  const duplicateCount = await context
    .getClient({ apiVersion })
    .fetch<number>(
      `count(*[
        _type == "releaseVersion" &&
        releaseTrain._ref == $releaseTrainId &&
        version == $version &&
        !(_id in $documentIds)
      ])`,
      {
        releaseTrainId,
        version: value,
        documentIds: documentIds(context),
      }
    );

  return duplicateCount === 0
    ? true
    : "This release train already has that version.";
}
