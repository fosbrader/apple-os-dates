/**
 * Creates a short-lived, signed URL that enables Next.js Draft Mode for one
 * Sanity article. The raw preview secret is never placed in the URL.
 *
 * ARTICLE_PREVIEW_SECRET='<same server-only deployment secret>' \
 *   npx tsx scripts/create-article-preview-url.ts \
 *   --slug launching-version-record \
 *   --origin https://www.versionrecord.com
 */

import { createArticlePreviewToken } from "../src/lib/article-preview";

function argumentValue(flag: string): string | undefined {
  const index = process.argv.indexOf(flag);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function requiredArgument(flag: string): string {
  const value = argumentValue(flag)?.trim();
  if (!value) throw new Error(`${flag} is required.`);
  return value;
}

function previewOrigin(value: string): string {
  const url = new URL(value);
  if (
    url.protocol !== "https:" ||
    url.username ||
    url.password ||
    url.search ||
    url.hash
  ) {
    throw new Error("--origin must be a clean HTTPS deployment origin.");
  }

  url.pathname = "/";
  return url.toString().replace(/\/$/, "");
}

function lifetimeSeconds(): number {
  const rawMinutes = argumentValue("--minutes") ?? "10";
  const minutes = Number(rawMinutes);
  if (!Number.isInteger(minutes) || minutes < 1 || minutes > 60) {
    throw new Error("--minutes must be an integer between 1 and 60.");
  }
  return minutes * 60;
}

function main(): void {
  const secret = process.env.ARTICLE_PREVIEW_SECRET?.trim();
  if (!secret) {
    throw new Error("ARTICLE_PREVIEW_SECRET is required in the shell environment.");
  }

  const slug = requiredArgument("--slug");
  const origin = previewOrigin(requiredArgument("--origin"));
  const token = createArticlePreviewToken({
    slug,
    secret,
    lifetimeSeconds: lifetimeSeconds(),
  });
  const url = new URL("/api/draft-mode/enable/", origin);
  url.searchParams.set("token", token);

  console.log(url.toString());
  console.log(
    "This link is short-lived and private. Do not paste it into analytics, chat, or public documents.",
  );
}

try {
  main();
} catch (error: unknown) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
