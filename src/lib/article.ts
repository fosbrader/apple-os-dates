export const defaultArticleByline = "Version Record";
export const articleTimeZone = "America/New_York";

export interface ArticlePublicationStamp {
  byline: string;
  publishedAt: string;
  updatedAt: string;
}

function validDate(value: string): Date | null {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function createArticlePublicationStamp({
  existingPublishedAt,
  now = new Date(),
}: {
  existingPublishedAt?: string | null;
  now?: Date;
}): ArticlePublicationStamp {
  if (Number.isNaN(now.getTime())) {
    throw new Error("A valid publication time is required.");
  }

  const publishedAt = existingPublishedAt
    ? validDate(existingPublishedAt)?.toISOString()
    : now.toISOString();

  if (!publishedAt) {
    throw new Error("The existing publication time is invalid.");
  }

  return {
    byline: defaultArticleByline,
    publishedAt,
    updatedAt: now.toISOString(),
  };
}

export function formatArticleTimestamp(value: string): string {
  const date = validDate(value);
  if (!date) throw new Error(`Invalid article timestamp: ${value}`);

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: articleTimeZone,
    timeZoneName: "short",
  }).format(date);
}

export function articleHasMeaningfulUpdate(
  publishedAt: string,
  updatedAt: string,
): boolean {
  const published = validDate(publishedAt);
  const updated = validDate(updatedAt);
  if (!published || !updated) return false;

  return updated.getTime() > published.getTime();
}
