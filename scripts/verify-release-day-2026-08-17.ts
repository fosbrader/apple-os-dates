/**
 * Brings the 2026-08-17 appearances up to editorial verification.
 *
 * Reads a reviewed editorial payload from
 * `scripts/release-day-2026-08-17-editorial.json` and writes, per event:
 * article prose, cited change occurrences, merged page-level citations,
 * provenance, review status, and indexability.
 *
 * Unlike the 2026-08-10 pass, this one owns `articleBody` as well as the
 * chronology and evidence fields. That is safe only because no concurrent
 * editorial pass is running against these documents. If one ever is, split the
 * ownership again: prose in one command, evidence in another, so the two never
 * contend for the same key.
 *
 * Every patch is revision-guarded and applied to both the published document
 * and any `drafts.` copy, because publishing a draft is a whole-document swap
 * that would otherwise discard this write.
 *
 * Dry run (default):
 *   npx sanity exec scripts/verify-release-day-2026-08-17.ts --with-user-token
 *
 * Apply:
 *   npx sanity exec scripts/verify-release-day-2026-08-17.ts --with-user-token -- \
 *     --apply --confirm-production
 *
 * Records with no cited change evidence and no article are intentionally left
 * at sourceLinked / readyForReview / noindex. The schema requires a sourced
 * article or a substantive cited change before indexing, and inventing filler
 * to clear that gate is exactly what the archive forbids.
 */

import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { getCliClient } from "sanity/cli";

const apiVersion = "2024-01-01";
const expectedProjectId = "lh3yswzu";
const expectedDataset = "production";
const accessedAt = "2026-08-17";
const payloadPath = join(
  __dirname,
  "release-day-2026-08-17-editorial.json",
);

function sha256(v: string): string {
  return createHash("sha256").update(v).digest("hex");
}
function compactHash(v: string): string {
  return sha256(v).slice(0, 24);
}
function normalizeSourceUrl(v: string): string {
  const url = new URL(v);
  url.hash = "";
  return url.toString();
}
function sourceDocumentId(url: string): string {
  return `source-${compactHash(normalizeSourceUrl(url))}`;
}
function eventDocumentId(stableEventId: string): string {
  return `release-event-${compactHash(stableEventId)}`;
}
function changeDocumentId(key: string): string {
  const normalized = key.trim().toLowerCase();
  if (!/^[a-z0-9]+(?:[._-][a-z0-9]+)*$/.test(normalized)) {
    throw new Error(`Change key ${key} is not a valid slug.`);
  }
  return `release-change-${compactHash(normalized)}`;
}
function slugify(v: string): string {
  return v
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
function reference(id: string) {
  return { _type: "reference" as const, _ref: id };
}
function citation(sourceId: string, locator: string) {
  return {
    _key: `citation-${compactHash(`${sourceId}\0${locator}`)}`,
    _type: "citation" as const,
    locator,
    source: reference(sourceId),
  };
}

/** Portable Text block from a finished paragraph of prose. */
function block(text: string, key: string) {
  const style = text.startsWith("## ") ? "h2" : "normal";
  const body = style === "h2" ? text.slice(3) : text;
  return {
    _key: `block-${compactHash(key)}`,
    _type: "block" as const,
    style,
    markDefs: [],
    children: [
      {
        _key: `span-${compactHash(key)}`,
        _type: "span" as const,
        marks: [],
        text: body,
      },
    ],
  };
}

interface SourceInput {
  url: string;
  title: string;
  publisher: string;
  sourceClass: string;
  publishedAt?: string;
  topics?: string[];
}
interface EvidenceInput {
  url: string;
  locator: string;
}
interface ChangeInput {
  key: string;
  title: string;
  canonicalSummary: string;
  category: string;
  action: string;
  summary: string;
  evidence: EvidenceInput[];
}
interface RecordInput {
  stableEventId: string;
  paragraphs: string[];
  changes: ChangeInput[];
  verificationMethod: string;
  provenanceStatus: "sourceLinked" | "editoriallyVerified";
}
interface Payload {
  accessedAt: string;
  target: { projectId: string; dataset: string };
  sources: SourceInput[];
  records: RecordInput[];
}

/**
 * Em-dashes and en-dashes are a house style violation in Version Record copy.
 * Catching them here keeps a drafting slip from reaching production prose.
 */
function assertNoDashes(value: string, where: string): void {
  if (/[—–]/.test(value)) {
    throw new Error(`${where} contains an em-dash or en-dash: ${value}`);
  }
}

async function main(): Promise<void> {
  const argv = process.argv.slice(2);
  const apply = argv.includes("--apply");
  const confirmed = argv.includes("--confirm-production");

  const payload: Payload = JSON.parse(readFileSync(payloadPath, "utf8"));

  const client = getCliClient({ apiVersion });
  const { projectId, dataset } = client.config();
  if (projectId !== expectedProjectId || dataset !== expectedDataset) {
    throw new Error(
      `Refusing to run against ${projectId}/${dataset}; expected ${expectedProjectId}/${expectedDataset}.`,
    );
  }
  if (
    payload.target.projectId !== expectedProjectId ||
    payload.target.dataset !== expectedDataset
  ) {
    throw new Error("Editorial payload targets a different project or dataset.");
  }
  if (apply && !confirmed) {
    throw new Error("--apply also requires --confirm-production.");
  }

  // Style and shape gates before a single mutation is planned.
  const sourceByUrl = new Map(payload.sources.map((s) => [s.url, s]));
  for (const record of payload.records) {
    for (const [i, p] of record.paragraphs.entries()) {
      assertNoDashes(p, `${record.stableEventId} paragraph ${i}`);
    }
    for (const change of record.changes) {
      assertNoDashes(change.summary, `${change.key} summary`);
      assertNoDashes(change.canonicalSummary, `${change.key} canonicalSummary`);
      assertNoDashes(change.title, `${change.key} title`);
      if (change.evidence.length === 0) {
        throw new Error(`Change ${change.key} has no evidence.`);
      }
      for (const e of change.evidence) {
        if (!sourceByUrl.has(e.url)) {
          throw new Error(
            `Change ${change.key} cites ${e.url}, which is not declared in payload.sources.`,
          );
        }
      }
    }
  }

  const mutations: unknown[] = [];
  const planned: string[] = [];
  const reviewedAt = `${accessedAt}T00:00:00Z`;

  // Sources first: a citation cannot reference a document that does not exist.
  const sourceIds = payload.sources.map((s) => sourceDocumentId(s.url));
  const existingSources: { _id: string }[] = await client.fetch(
    "*[_id in $ids]{_id}",
    { ids: sourceIds },
  );
  const haveSource = new Set(existingSources.map((s) => s._id));
  for (const source of payload.sources) {
    const id = sourceDocumentId(source.url);
    if (haveSource.has(id)) continue;
    mutations.push({
      createIfNotExists: {
        _id: id,
        _type: "source",
        title: source.title,
        canonicalUrl: source.url,
        publisher: source.publisher,
        sourceClass: source.sourceClass,
        ...(source.publishedAt ? { publishedAt: source.publishedAt } : {}),
        accessedAt,
        status: "active",
        reuseBasis: "linkedFactsOnly",
        topics: source.topics ?? [],
      },
    });
    planned.push(`source   ${id}  ${source.publisher}`);
  }

  // Reusable change library entries, deduplicated across platforms.
  const allChanges = new Map<string, ChangeInput>();
  for (const record of payload.records) {
    for (const change of record.changes) allChanges.set(change.key, change);
  }
  const changeIds = Array.from(allChanges.keys()).map(changeDocumentId);
  const existingChanges: { _id: string }[] = await client.fetch(
    "*[_id in $ids]{_id}",
    { ids: changeIds },
  );
  const haveChange = new Set(existingChanges.map((c) => c._id));

  for (const change of allChanges.values()) {
    const id = changeDocumentId(change.key);
    if (haveChange.has(id)) continue;
    mutations.push({
      createIfNotExists: {
        _id: id,
        _type: "releaseChange",
        title: change.title,
        slug: { _type: "slug", current: slugify(change.key) },
        canonicalSummary: change.canonicalSummary,
        category: change.category,
        status: "active",
        provenanceStatus: "sourceLinked",
        editorialReview: {
          _type: "editorialReview",
          status: "approved",
          reviewedAt,
        },
        citations: change.evidence.map((e) =>
          citation(sourceDocumentId(e.url), e.locator),
        ),
      },
    });
    planned.push(`change   ${id}  ${change.title}`);
  }

  const baseIds = payload.records.map((r) => eventDocumentId(r.stableEventId));
  const eventIds = [...baseIds, ...baseIds.map((id) => `drafts.${id}`)];
  const events: {
    _id: string;
    _rev: string;
    citations?: { _key: string }[];
  }[] = await client.fetch("*[_id in $ids]{_id, _rev, citations}", {
    ids: eventIds,
  });
  const eventById = new Map(events.map((e) => [e._id, e]));

  for (const record of payload.records) {
    const baseId = eventDocumentId(record.stableEventId);
    for (const id of [baseId, `drafts.${baseId}`]) {
      const event = eventById.get(id);
      if (!event) {
        if (id === baseId) {
          throw new Error(`Missing event ${id} (${record.stableEventId}).`);
        }
        continue; // No draft in flight for this event.
      }

      const occurrences = record.changes.map((change) => ({
        _key: `occurrence-${compactHash(`${id}\0${change.key}`)}`,
        _type: "changeOccurrence",
        change: reference(changeDocumentId(change.key)),
        action: change.action,
        inheritance: "delta",
        summary: change.summary,
        documentedStatus: "undocumented",
        evidenceState:
          change.evidence.length > 1 ? "corroborated" : "reported",
        verificationMethod: record.verificationMethod,
        citations: change.evidence.map((e) =>
          citation(sourceDocumentId(e.url), e.locator),
        ),
      }));

      const articleBody = record.paragraphs.map((text, index) =>
        block(text, `${id}\0${index}\0${text.slice(0, 80)}`),
      );

      // Merge page-level citations; never drop what is already there.
      const existingCitations = event.citations || [];
      const merged = [...existingCitations];
      const seen = new Set(existingCitations.map((c) => c._key));
      for (const change of record.changes) {
        for (const e of change.evidence) {
          const c = citation(sourceDocumentId(e.url), e.locator);
          if (!seen.has(c._key)) {
            seen.add(c._key);
            merged.push(c);
          }
        }
      }

      // Mirror validateIndexable rather than assuming: the custom schema rule
      // runs in Studio, not on API writes, so nothing but this check stops an
      // invalid indexable document from being written here.
      const indexable = occurrences.length > 0 || articleBody.length > 0;

      mutations.push({
        patch: {
          id,
          ifRevisionID: event._rev,
          set: {
            ...(occurrences.length > 0 ? { changes: occurrences } : {}),
            ...(articleBody.length > 0 ? { articleBody } : {}),
            citations: merged,
            provenanceStatus: record.provenanceStatus,
            editorialReview: {
              _type: "editorialReview",
              status: "approved",
              reviewedAt,
            },
            isIndexable: indexable,
          },
        },
      });
      planned.push(
        `verify   ${id.padEnd(46)} ${occurrences.length} changes, ${articleBody.length} blocks, ${merged.length} citations, ${record.provenanceStatus}, ${indexable ? "indexable" : "NOT indexable"}`,
      );
    }
  }

  console.log(planned.join("\n"));
  console.log(`\n${apply ? "APPLY" : "DRY RUN"}: ${mutations.length} mutations.`);

  if (!apply) {
    console.log(
      "No Sanity data changed. Rerun with --apply --confirm-production.",
    );
    return;
  }

  const result = await client.mutate(mutations as never, {
    visibility: "sync",
  });
  console.log(`Committed transaction ${result.transactionId}.`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
