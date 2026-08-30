import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

interface ManifestSource {
  url: string;
  topics?: string[];
}

interface ReleaseManifest {
  sources: ManifestSource[];
}

function loadManifest(filename: string): ReleaseManifest {
  return JSON.parse(
    readFileSync(path.resolve(process.cwd(), "scripts", filename), "utf8"),
  ) as ReleaseManifest;
}

test("release-sweep manifests agree on taxonomy for shared sources", () => {
  const currentReleases = loadManifest(
    "apple-release-sweep-2026-08-24.json",
  );
  const publicBetas = loadManifest(
    "apple-os-27-public-beta-backfill-2026-08-25.json",
  );
  const publicBetaSources = new Map(
    publicBetas.sources.map((source) => [source.url, source]),
  );

  for (const source of currentReleases.sources) {
    const shared = publicBetaSources.get(source.url);
    if (!shared) continue;

    assert.deepEqual(
      [...(source.topics ?? [])].sort(),
      [...(shared.topics ?? [])].sort(),
      `${source.url} must have one shared topic taxonomy`,
    );
  }
});
