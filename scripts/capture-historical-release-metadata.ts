/**
 * Captures a bounded, published-only Sanity snapshot and a local curation
 * queue. It has no token, CMS mutation, Blob, Vercel, or GitHub write path.
 */

import { createHash } from "node:crypto";
import * as fs from "node:fs";
import * as path from "node:path";

import {
  HISTORICAL_RELEASE_METADATA_CURATION_VERSION,
  buildHistoricalMetadataCurationQueue,
} from "./lib/historical-release-metadata-curation";
import {
  HISTORICAL_ANALYTICAL_SNAPSHOT_TYPES,
  extractHistoricalMetadataSnapshotDocuments,
  type HistoricalMetadataSnapshotDocument,
} from "./lib/historical-release-metadata-migration";
import { stableStringify } from "./lib/release-event-migration";
import { client } from "../src/sanity/client";

const repositoryRoot = path.join(__dirname, "..");
const artifactDirectory = path.join(repositoryRoot, ".migration-artifacts");
const maxDocuments = 8_192;

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function sha256(value: unknown): string {
  return createHash("sha256").update(stableStringify(value)).digest("hex");
}

function writeArtifact(filename: string, value: unknown): string {
  fs.mkdirSync(artifactDirectory, { recursive: true, mode: 0o700 });
  const artifactPath = path.join(artifactDirectory, filename);
  const content = `${stableStringify(value, 2)}\n`;
  if (fs.existsSync(artifactPath)) {
    if (fs.readFileSync(artifactPath, "utf8") !== content) {
      throw new Error(
        `${artifactPath} already exists with different contents.`,
      );
    }
    return artifactPath;
  }
  fs.writeFileSync(artifactPath, content, {
    encoding: "utf8",
    flag: "wx",
    mode: 0o600,
  });
  return artifactPath;
}

function extractSnapshotEnvelope(
  value: unknown,
): HistoricalMetadataSnapshotDocument[] {
  if (!isRecord(value) || !Number.isSafeInteger(value.documentCount)) {
    throw new Error("Published snapshot envelope is invalid.");
  }
  if (
    value.documentOverflow !== false ||
    (value.documentCount as number) > maxDocuments
  ) {
    throw new Error("Published snapshot exceeds the bounded document limit.");
  }
  const documents = extractHistoricalMetadataSnapshotDocuments({
    documents: value.documents,
  });
  if (documents.length !== value.documentCount) {
    throw new Error(
      "Published snapshot count does not match its returned documents.",
    );
  }
  if (!isRecord(value.documentCounts)) {
    throw new Error("Published snapshot type counts are invalid.");
  }
  for (const type of HISTORICAL_ANALYTICAL_SNAPSHOT_TYPES) {
    const expected = value.documentCounts[type];
    const actual = documents.filter(
      (document) => document._type === type,
    ).length;
    if (!Number.isSafeInteger(expected) || expected !== actual) {
      throw new Error(`Published snapshot count is invalid for ${type}.`);
    }
  }
  return documents;
}

const snapshotQuery = `
  {
    "documents": *[
      _type in $types &&
      !(_id in path("drafts.**"))
    ] | order(_id asc) [0...${maxDocuments + 1}] { ... },
    "documentCount": count(*[
      _type in $types &&
      !(_id in path("drafts.**"))
    ]),
    "documentOverflow": count(*[
      _type in $types &&
      !(_id in path("drafts.**"))
    ]) > ${maxDocuments},
    "documentCounts": {
      "auditBatch": count(*[_type == "auditBatch" && !(_id in path("drafts.**"))]),
      "historicalReleaseMetadata": count(*[_type == "historicalReleaseMetadata" && !(_id in path("drafts.**"))]),
      "platform": count(*[_type == "platform" && !(_id in path("drafts.**"))]),
      "releaseEvent": count(*[_type == "releaseEvent" && !(_id in path("drafts.**"))]),
      "releaseTrain": count(*[_type == "releaseTrain" && !(_id in path("drafts.**"))]),
      "releaseVersion": count(*[_type == "releaseVersion" && !(_id in path("drafts.**"))]),
      "source": count(*[_type == "source" && !(_id in path("drafts.**"))])
    }
  }
`;

async function main(): Promise<void> {
  const allowedArguments = new Set(["--write-artifacts", "--json"]);
  if (
    process.argv.slice(2).some((argument) => !allowedArguments.has(argument))
  ) {
    throw new Error("Usage: [--write-artifacts] [--json]");
  }
  const sourceClient = client.withConfig({
    useCdn: false,
    perspective: "published",
    timeout: 20_000,
    maxRetries: 1,
    retryDelay: () => 250,
  });
  const documents = extractSnapshotEnvelope(
    await sourceClient.fetch<unknown>(snapshotQuery, {
      types: HISTORICAL_ANALYTICAL_SNAPSHOT_TYPES,
    }),
  );
  const snapshot = { documents };
  const snapshotDigest = sha256(documents);
  const queue = buildHistoricalMetadataCurationQueue(snapshot);
  if (queue.sourceSnapshotDigest !== snapshotDigest) {
    throw new Error("Curation queue does not bind the captured snapshot.");
  }

  const shouldWrite = process.argv.includes("--write-artifacts");
  const snapshotPath = shouldWrite
    ? writeArtifact(
        `historical-release-metadata-snapshot-${snapshotDigest}.json`,
        snapshot,
      )
    : undefined;
  const queuePath = shouldWrite
    ? writeArtifact(
        `historical-release-metadata-curation-${snapshotDigest}.json`,
        queue,
      )
    : undefined;
  const output = {
    mode: "read-only-capture",
    curationVersion: HISTORICAL_RELEASE_METADATA_CURATION_VERSION,
    sourceSnapshotDigest: snapshotDigest,
    projectedSourceDigest: queue.projectedSourceDigest,
    summary: queue.summary,
    snapshot: snapshotPath ?? "not written; pass --write-artifacts",
    curationQueue: queuePath ?? "not written; pass --write-artifacts",
    next: "Review every null reviewFields value with source evidence, then create a separate curated manifest. This queue is not an ingestible manifest.",
  };
  if (process.argv.includes("--json")) {
    console.log(stableStringify(output, 2));
    return;
  }
  console.log(
    [
      "OK: captured a published-only historical metadata review package.",
      `SNAPSHOT SHA-256: ${output.sourceSnapshotDigest}`,
      `RELEASE VERSIONS: ${queue.summary.releaseVersions}`,
      `MISSING SIDECARS: ${queue.summary.missingMetadata}`,
      `LIFECYCLE REPAIRS: ${queue.summary.releaseVersionsRequiringLifecycleRepair}`,
      `NO EVIDENCE CANDIDATES: ${queue.summary.releaseVersionsWithoutEvidenceCandidates}`,
      `SNAPSHOT: ${output.snapshot}`,
      `CURATION QUEUE: ${output.curationQueue}`,
      "No Sanity, Blob, Vercel, GitHub, cron, or deployment write was attempted.",
      output.next,
    ].join("\n"),
  );
}

void main().catch((error: unknown) => {
  console.error(
    error instanceof Error
      ? `Historical metadata capture failed: ${error.message}`
      : "Historical metadata capture failed.",
  );
  process.exitCode = 1;
});
