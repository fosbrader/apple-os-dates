import assert from "node:assert/strict";
import test from "node:test";
import {
  createSiteBuildMetadata,
  formatSiteUpdatedAt,
  formatSiteVersion,
} from "../src/lib/site-version";

test("site versions use Eastern time during daylight saving time", () => {
  const publishedAt = new Date("2026-08-09T00:40:00.000Z");

  assert.equal(formatSiteVersion(publishedAt), "2026.08.08.2040");
  assert.match(formatSiteUpdatedAt(publishedAt), /Aug 8, 2026, 8:40 PM EDT/);
});

test("site versions use Eastern time during standard time", () => {
  const publishedAt = new Date("2026-01-15T14:07:00.000Z");

  assert.equal(formatSiteVersion(publishedAt), "2026.01.15.0907");
  assert.match(formatSiteUpdatedAt(publishedAt), /Jan 15, 2026, 9:07 AM EST/);
});

test("site versions keep leading zeroes after Eastern midnight", () => {
  const publishedAt = new Date("2026-08-08T04:05:00.000Z");

  assert.equal(formatSiteVersion(publishedAt), "2026.08.08.0005");
});

test("build metadata derives the version and ISO timestamp from one instant", () => {
  const publishedAt = new Date("2026-08-09T00:40:00.000Z");

  assert.deepEqual(createSiteBuildMetadata(publishedAt), {
    version: "2026.08.08.2040",
    updatedAt: "2026-08-09T00:40:00.000Z",
  });
});

test("site versions reject invalid timestamps", () => {
  assert.throws(() => formatSiteVersion("not-a-date"), RangeError);
  assert.throws(() => formatSiteUpdatedAt("not-a-date"), RangeError);
});
