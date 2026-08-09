import {
  createHmac,
  timingSafeEqual,
} from "node:crypto";

const previewTokenVersion = 1;
const minimumPreviewSecretLength = 32;
const maximumPreviewLifetimeSeconds = 60 * 60;

export interface ArticlePreviewPayload {
  version: number;
  slug: string;
  expiresAt: number;
}

export function isArticleSlug(value: string): boolean {
  return /^[a-z0-9](?:[a-z0-9-]{0,94}[a-z0-9])?$/.test(value);
}

function assertPreviewSecret(secret: string): void {
  if (secret.trim().length < minimumPreviewSecretLength) {
    throw new Error(
      `ARTICLE_PREVIEW_SECRET must contain at least ${minimumPreviewSecretLength} characters.`,
    );
  }
}

function signature(payload: string, secret: string): string {
  return createHmac("sha256", secret)
    .update(payload)
    .digest("base64url");
}

export function createArticlePreviewToken({
  slug,
  secret,
  now = new Date(),
  lifetimeSeconds = 10 * 60,
}: {
  slug: string;
  secret: string;
  now?: Date;
  lifetimeSeconds?: number;
}): string {
  assertPreviewSecret(secret);
  if (!isArticleSlug(slug)) {
    throw new Error("The article preview slug is invalid.");
  }
  if (Number.isNaN(now.getTime())) {
    throw new Error("A valid preview creation time is required.");
  }
  if (
    !Number.isInteger(lifetimeSeconds) ||
    lifetimeSeconds < 60 ||
    lifetimeSeconds > maximumPreviewLifetimeSeconds
  ) {
    throw new Error("Preview lifetime must be between 60 and 3600 seconds.");
  }

  const payload: ArticlePreviewPayload = {
    version: previewTokenVersion,
    slug,
    expiresAt: Math.floor(now.getTime() / 1000) + lifetimeSeconds,
  };
  const encodedPayload = Buffer.from(
    JSON.stringify(payload),
    "utf8",
  ).toString("base64url");

  return `${encodedPayload}.${signature(encodedPayload, secret)}`;
}

export function verifyArticlePreviewToken({
  token,
  secret,
  now = new Date(),
}: {
  token: string;
  secret: string;
  now?: Date;
}): ArticlePreviewPayload | null {
  try {
    assertPreviewSecret(secret);
    if (Number.isNaN(now.getTime())) return null;

    const parts = token.split(".");
    if (parts.length !== 2) return null;
    const [encodedPayload, suppliedSignature] = parts;
    const expectedSignature = signature(encodedPayload, secret);
    const supplied = Buffer.from(suppliedSignature, "utf8");
    const expected = Buffer.from(expectedSignature, "utf8");
    if (
      supplied.length !== expected.length ||
      !timingSafeEqual(supplied, expected)
    ) {
      return null;
    }

    const payload = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf8"),
    ) as Partial<ArticlePreviewPayload>;
    if (
      payload.version !== previewTokenVersion ||
      typeof payload.slug !== "string" ||
      !isArticleSlug(payload.slug) ||
      typeof payload.expiresAt !== "number" ||
      !Number.isInteger(payload.expiresAt) ||
      payload.expiresAt <= Math.floor(now.getTime() / 1000)
    ) {
      return null;
    }

    return payload as ArticlePreviewPayload;
  } catch {
    return null;
  }
}
