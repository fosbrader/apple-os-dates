import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const eventPageSource = readFileSync(
  path.resolve(
    process.cwd(),
    "src/app/apple/[platform]/[version]/[event]/page.tsx",
  ),
  "utf8",
);
const sanityFetchSource = readFileSync(
  path.resolve(process.cwd(), "src/lib/sanity.fetch.ts"),
  "utf8",
);
const articlesSource = readFileSync(
  path.resolve(process.cwd(), "src/lib/articles.ts"),
  "utf8",
);
const researchDataSource = readFileSync(
  path.resolve(process.cwd(), "src/lib/research/data.ts"),
  "utf8",
);
const serverClientPath = path.resolve(
  process.cwd(),
  "src/sanity/server-client.ts",
);
const releaseSweepFinalizerSource = readFileSync(
  path.resolve(
    process.cwd(),
    "scripts/finalize-release-sweep-2026-08-24.ts",
  ),
  "utf8",
);

test("release event pages render on demand instead of fanning out at build time", () => {
  const staticParams = eventPageSource.match(
    /export (?:async )?function generateStaticParams\(\) \{([\s\S]*?)\n\}/,
  );

  assert.ok(staticParams, "the release-event route must define generateStaticParams");
  assert.match(staticParams[1], /return\s+\[\];/);
  assert.doesNotMatch(
    staticParams[1],
    /getAnalyticsData|getAllEventRoutes|legacyEventsForVersion/,
    "build-time static params must not enumerate the release-event corpus",
  );
});

test("server archive reads bypass the CDN when a read token is configured", () => {
  assert.match(
    sanityFetchSource,
    /import \{ serverReadClient \} from "@\/sanity\/server-client";/,
  );
  assert.equal(
    (sanityFetchSource.match(/\bclient\.fetch/g) ?? []).length,
    0,
    "public archive queries must use the token-aware archive read client",
  );
  assert.match(sanityFetchSource, /serverReadClient\.fetch/);
});

test("published articles use the same deployed and local read-token precedence", () => {
  assert.match(
    articlesSource,
    /import \{ serverReadClient \} from "@\/sanity\/server-client";/,
  );
  assert.doesNotMatch(articlesSource, /const publishedClient =/);
  assert.match(articlesSource, /serverReadClient\.fetch/);
});

test("research and search reads share the authenticated server transport", () => {
  assert.match(
    researchDataSource,
    /import \{ serverReadClient \} from "@\/sanity\/server-client";/,
  );
  assert.equal(
    (researchDataSource.match(/\bclient\.fetch/g) ?? []).length,
    0,
  );
  assert.match(researchDataSource, /serverReadClient\.fetch/);
});

test("the shared server reader prefers the deployed token and falls back locally", () => {
  assert.ok(existsSync(serverClientPath), "the shared server reader must exist");
  const serverClientSource = readFileSync(serverClientPath, "utf8");

  assert.match(serverClientSource, /import "server-only";/);
  assert.match(
    serverClientSource,
    /const readToken =\s*process\.env\.SANITY_API_READ_TOKEN\?\.trim\(\)\s*\|\|\s*process\.env\.SANITY_API_TOKEN\?\.trim\(\);/,
  );
  assert.match(
    serverClientSource,
    /export const serverReadClient = client\.withConfig\(\{[\s\S]*?useCdn:\s*!readToken,[\s\S]*?\}\);/,
  );
});

test("the release-sweep finalizer compares Sanity values canonically", () => {
  assert.match(
    releaseSweepFinalizerSource,
    /import \{ stableStringify \} from "\.\/lib\/release-event-migration";/,
  );
  assert.match(
    releaseSweepFinalizerSource,
    /function equal\(left: unknown, right: unknown\): boolean \{\s*return stableStringify\(left\) === stableStringify\(right\);\s*\}/,
  );
});
