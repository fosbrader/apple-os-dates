import { createHash, timingSafeEqual } from "node:crypto";
import { lookup } from "node:dns/promises";
import { canonicalizePublicHttpsUrl, isBlockedIpAddress } from "./urls";

export interface FeedSourceRecord {
  _id: string;
  name: string;
  publisher: string;
  feedUrl: string;
  feedKind: "rss" | "jsonApi";
}

export interface ParsedFeedItem {
  id?: string;
  title: string;
  canonicalUrl: string;
  publishedAt?: string;
}

export interface IngestCandidateDocument {
  _id: string;
  _type: "ingestCandidate";
  feedSource: {
    _type: "reference";
    _ref: string;
  };
  title: string;
  canonicalUrl: string;
  contentHash: string;
  publisher: string;
  publishedAt?: string;
  discoveredAt: string;
  status: "new";
  publicationBlocked: true;
}

type HostResolver = (
  hostname: string,
) => Promise<Array<{ address: string; family: number }>>;

const maximumFeedBytes = 1_000_000;
const maximumItemsPerFeed = 15;

function normalizeText(value: string, maximum: number): string {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, "$1")
    .replace(/<[^>]*>/g, " ")
    .replace(/&(?:nbsp|#160);/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&#(\d+);/g, (_match, value: string) => {
      const codePoint = Number(value);
      return Number.isSafeInteger(codePoint) && codePoint <= 0x10ffff
        ? String.fromCodePoint(codePoint)
        : "";
    })
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maximum);
}

function tagText(xml: string, tagNames: string[]): string {
  for (const tagName of tagNames) {
    const pattern = new RegExp(
      `<${tagName}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tagName}>`,
      "i",
    );
    const match = xml.match(pattern);
    if (match) return normalizeText(match[1], 2_000);
  }
  return "";
}

function attribute(value: string, name: string): string {
  const match = value.match(
    new RegExp(`\\b${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)')`, "i"),
  );
  return normalizeText(match?.[1] ?? match?.[2] ?? "", 2_000);
}

function itemLink(fragment: string): string {
  const rssLink = tagText(fragment, ["link"]);
  if (rssLink) return rssLink;

  const links = fragment.match(/<link\b[^>]*>/gi) ?? [];
  const alternate =
    links.find((link) => {
      const relation = attribute(link, "rel").toLowerCase();
      return !relation || relation === "alternate";
    }) ?? links[0];
  return alternate ? attribute(alternate, "href") : "";
}

function normalizePublishedAt(value: string): string | undefined {
  if (!value) return undefined;
  const milliseconds = Date.parse(value);
  if (!Number.isFinite(milliseconds)) return undefined;
  return new Date(milliseconds).toISOString();
}

export function parseXmlFeed(xml: string): ParsedFeedItem[] {
  const items: ParsedFeedItem[] = [];
  const pattern = /<(item|entry)\b[^>]*>([\s\S]*?)<\/\1>/gi;
  let match: RegExpExecArray | null;

  while (
    items.length < maximumItemsPerFeed &&
    (match = pattern.exec(xml)) !== null
  ) {
    const fragment = match[2];
    const title = tagText(fragment, ["title"]).slice(0, 500);
    const canonicalUrl = canonicalizePublicHttpsUrl(itemLink(fragment));
    if (!title || !canonicalUrl) continue;

    const publishedAt = normalizePublishedAt(
      tagText(fragment, ["pubDate", "published", "updated", "dc:date"]),
    );
    const id = tagText(fragment, ["guid", "id"]).slice(0, 500);
    items.push({
      ...(id ? { id } : {}),
      title,
      canonicalUrl,
      ...(publishedAt ? { publishedAt } : {}),
    });
  }

  return deduplicateFeedItems(items);
}

function jsonRecords(value: unknown): Record<string, unknown>[] {
  if (Array.isArray(value)) {
    return value.filter(
      (item): item is Record<string, unknown> =>
        Boolean(item) && typeof item === "object" && !Array.isArray(item),
    );
  }
  if (!value || typeof value !== "object") return [];

  const record = value as Record<string, unknown>;
  for (const key of ["items", "results", "data"]) {
    if (Array.isArray(record[key])) return jsonRecords(record[key]);
  }
  return [];
}

function firstJsonString(
  record: Record<string, unknown>,
  fields: string[],
): string {
  for (const field of fields) {
    if (typeof record[field] === "string") return record[field].trim();
  }
  return "";
}

export function parseJsonFeed(json: string): ParsedFeedItem[] {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    return [];
  }

  const items: ParsedFeedItem[] = [];
  for (const record of jsonRecords(parsed).slice(0, maximumItemsPerFeed)) {
    const title = normalizeText(
      firstJsonString(record, ["title", "name", "headline"]),
      500,
    );
    const canonicalUrl = canonicalizePublicHttpsUrl(
      firstJsonString(record, [
        "url",
        "external_url",
        "externalUrl",
        "link",
      ]),
    );
    if (!title || !canonicalUrl) continue;

    const publishedAt = normalizePublishedAt(
      firstJsonString(record, [
        "date_published",
        "published_at",
        "publishedAt",
        "published",
        "date",
      ]),
    );
    const id = normalizeText(
      firstJsonString(record, ["id", "guid"]),
      500,
    );
    items.push({
      ...(id ? { id } : {}),
      title,
      canonicalUrl,
      ...(publishedAt ? { publishedAt } : {}),
    });
  }

  return deduplicateFeedItems(items);
}

function deduplicateFeedItems(items: ParsedFeedItem[]): ParsedFeedItem[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.canonicalUrl)) return false;
    seen.add(item.canonicalUrl);
    return true;
  });
}

async function defaultResolver(
  hostname: string,
): Promise<Array<{ address: string; family: number }>> {
  return lookup(hostname, { all: true, verbatim: true });
}

export async function assertPublicFeedDestination(
  urlValue: string,
  allowedHosts: ReadonlySet<string>,
  resolveHost: HostResolver = defaultResolver,
): Promise<URL> {
  const canonical = canonicalizePublicHttpsUrl(urlValue);
  if (!canonical) throw new Error("Feed URL must be public HTTPS.");

  const url = new URL(canonical);
  const hostname = url.hostname.toLowerCase().replace(/\.$/, "");
  if (!allowedHosts.has(hostname)) {
    throw new Error("Feed hostname is not on the server allowlist.");
  }

  const addresses = await resolveHost(hostname);
  if (
    addresses.length === 0 ||
    addresses.some(({ address }) => isBlockedIpAddress(address))
  ) {
    throw new Error("Feed hostname did not resolve to a public address.");
  }

  return url;
}

async function readBoundedResponse(
  response: Response,
  maximumBytes = maximumFeedBytes,
): Promise<string> {
  if (!response.body) return "";

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let bytes = 0;
  let text = "";

  while (true) {
    const result = await reader.read();
    if (result.done) break;
    bytes += result.value.byteLength;
    if (bytes > maximumBytes) {
      await reader.cancel();
      throw new Error("Feed response exceeded the size limit.");
    }
    text += decoder.decode(result.value, { stream: true });
  }

  text += decoder.decode();
  return text;
}

export async function fetchAllowlistedFeed({
  source,
  allowedHosts,
  fetchImplementation = fetch,
  resolveHost = defaultResolver,
}: {
  source: FeedSourceRecord;
  allowedHosts: ReadonlySet<string>;
  fetchImplementation?: typeof fetch;
  resolveHost?: HostResolver;
}): Promise<ParsedFeedItem[]> {
  const url = await assertPublicFeedDestination(
    source.feedUrl,
    allowedHosts,
    resolveHost,
  );
  const response = await fetchImplementation(url, {
    method: "GET",
    redirect: "error",
    cache: "no-store",
    headers: {
      Accept:
        source.feedKind === "jsonApi"
          ? "application/feed+json, application/json"
          : "application/atom+xml, application/rss+xml, application/xml, text/xml",
      "User-Agent": "VersionRecordFeedReview/1.0 (+https://www.versionrecord.com)",
    },
    signal: AbortSignal.timeout(12_000),
  });
  if (!response.ok) {
    throw new Error(`Feed returned HTTP ${response.status}.`);
  }

  const declaredLength = Number(response.headers.get("content-length"));
  if (
    Number.isFinite(declaredLength) &&
    declaredLength > maximumFeedBytes
  ) {
    throw new Error("Feed response exceeded the size limit.");
  }
  const contentType = response.headers
    .get("content-type")
    ?.split(";")[0]
    .trim()
    .toLowerCase();
  const allowedContentTypes =
    source.feedKind === "jsonApi"
      ? new Set(["application/json", "application/feed+json"])
      : new Set([
          "application/atom+xml",
          "application/rss+xml",
          "application/xml",
          "text/xml",
        ]);
  if (contentType && !allowedContentTypes.has(contentType)) {
    throw new Error("Feed returned an unsupported content type.");
  }

  const body = await readBoundedResponse(response);
  return source.feedKind === "jsonApi"
    ? parseJsonFeed(body)
    : parseXmlFeed(body);
}

export function buildIngestCandidate(
  source: FeedSourceRecord,
  item: ParsedFeedItem,
  discoveredAt = new Date().toISOString(),
): IngestCandidateDocument {
  const identityHash = createHash("sha256")
    .update(item.canonicalUrl)
    .digest("hex");
  const contentHash = createHash("sha256")
    .update(
      JSON.stringify([
        item.canonicalUrl,
        item.title,
        item.publishedAt ?? null,
      ]),
    )
    .digest("hex");

  return {
    _id: `ingestCandidate.${identityHash}`,
    _type: "ingestCandidate",
    feedSource: {
      _type: "reference",
      _ref: source._id.replace(/^drafts\./, ""),
    },
    title: item.title.slice(0, 500),
    canonicalUrl: item.canonicalUrl,
    contentHash,
    publisher: source.publisher.slice(0, 200),
    ...(item.publishedAt ? { publishedAt: item.publishedAt } : {}),
    discoveredAt,
    status: "new",
    publicationBlocked: true,
  };
}

export function isAuthorizedCron(
  authorization: string | null,
  secret: string,
): boolean {
  const supplied = authorization?.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length)
    : "";
  const left = Buffer.from(supplied);
  const right = Buffer.from(secret);
  return (
    left.length === right.length &&
    left.length > 0 &&
    timingSafeEqual(left, right)
  );
}
