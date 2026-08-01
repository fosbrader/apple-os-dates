import assert from "node:assert/strict";
import test from "node:test";
import {
  createResearchEnvelope,
  selectPublicColumns,
  serializeResearchCsv,
} from "../src/lib/research/serialize";
import { normalizeResearchSnapshot } from "../src/lib/research/data";
import {
  eventHref,
  searchResearchIndex,
} from "../src/lib/research/search";
import type {
  PublicReleaseRow,
  PublicResearchDatasets,
  ResearchSearchIndex,
} from "../src/lib/research/types";

const release: PublicReleaseRow = {
  id: "release.ios.26.3",
  vendor: "apple",
  platform: "ios",
  family: "26",
  version: "26.3",
  status: "active",
  public_release_date: null,
  note: "Current beta cycle",
  release_notes_url: null,
  provenance_status: "audit_verified",
  updated_at: "2026-07-29T12:00:00Z",
};

const datasets: PublicResearchDatasets = {
  releases: [release],
  events: [],
  builds: [],
  changes: [],
  occurrences: [],
  citations: [],
  provenance: [],
};

test("the serialization boundary removes undeclared and private fields", () => {
  const unsafe = {
    ...release,
    email: "private@example.com",
    editorial_notes: "do not publish",
    review_notes: "internal",
  } as PublicReleaseRow;

  const [selected] = selectPublicColumns("releases", [unsafe]);
  assert.equal(selected.email, undefined);
  assert.equal(selected.editorial_notes, undefined);
  assert.equal(selected.review_notes, undefined);

  const envelope = createResearchEnvelope(
    "releases",
    { ...datasets, releases: [unsafe] },
    "2026-07-29T12:00:00.000Z",
  );
  const json = JSON.stringify(envelope);
  assert.doesNotMatch(json, /private@example\.com/);
  assert.doesNotMatch(json, /do not publish|internal/);
});

test("CSV output has stable columns and neutralizes formulas", () => {
  const csv = serializeResearchCsv("releases", [
    {
      ...release,
      release_notes_url: "=HYPERLINK(\"https://example.com\")",
    },
  ]);

  const [header, row] = csv.trim().split("\r\n");
  assert.equal(
    header,
    '"id","vendor","platform","family","version","status","public_release_date","release_notes_url","provenance_status","updated_at"',
  );
  assert.match(
    row,
    /"'=HYPERLINK\(""https:\/\/example\.com""\)"/,
  );
});

test("JSON envelopes declare their version, license, and count", () => {
  const envelope = createResearchEnvelope(
    "releases",
    datasets,
    "2026-07-29T12:00:00.000Z",
  );

  assert.equal(envelope.schema_version, "1.0.0");
  assert.equal(envelope.license, "CC0-1.0");
  assert.equal(envelope.record_count, 1);
  assert.equal(envelope.generated_at, "2026-07-29T12:00:00.000Z");
});

test("local search requires every term and applies exact facets", () => {
  const index: ResearchSearchIndex = {
    schema_version: "1.0.0",
    generated_at: "2026-07-29T12:00:00.000Z",
    documents: [
      {
        id: "release:ios-26.3",
        kind: "release",
        title: "iOS 26.3",
        href: "/apple/ios/26.3",
        text: "Current beta cycle",
        vendor: "apple",
        platform: "ios",
        family: "26",
        version: "26.3",
        date: null,
        status: "active",
        channel: null,
        build_number: null,
        change_type: null,
        documented_status: null,
        evidence_state: null,
        publishers: ["Apple"],
      },
      {
        id: "event:ios-26.3-beta-4",
        kind: "event",
        title: "iOS 26.3 Beta 4",
        href: "/apple/ios/26.3/beta-4/",
        text: "Developer beta",
        vendor: "apple",
        platform: "ios",
        family: "26",
        version: "26.3",
        date: "2026-07-28",
        status: "available",
        channel: "developer_beta",
        build_number: null,
        change_type: null,
        documented_status: null,
        evidence_state: null,
        publishers: ["Apple Developer"],
      },
    ],
  };

  const results = searchResearchIndex(
    index,
    "26.3 beta",
    { kind: "event", publisher: "Apple Developer" },
    10,
  );
  assert.deepEqual(
    results.map(({ document }) => document.id),
    ["event:ios-26.3-beta-4"],
  );

  assert.deepEqual(searchResearchIndex(index, "26.3 macOS"), []);
});

test("search result limits are bounded to one hundred", () => {
  const baseDocument = {
    id: "release:0",
    kind: "release" as const,
    title: "iOS release",
    href: "/apple/ios/26.0",
    text: "",
    vendor: "apple",
    platform: "ios",
    family: "26",
    version: "26.0",
    date: null,
    status: "released",
    channel: null,
    build_number: null,
    change_type: null,
    documented_status: null,
    evidence_state: null,
    publishers: [],
  };
  const index: ResearchSearchIndex = {
    schema_version: "1.0.0",
    generated_at: "2026-07-29T12:00:00.000Z",
    documents: Array.from({ length: 150 }, (_, indexValue) => ({
      ...baseDocument,
      id: `release:${indexValue}`,
    })),
  };

  assert.equal(searchResearchIndex(index, "ios", {}, 1_000).length, 100);
});

test("a verified build does not replace an appearance's public route", () => {
  assert.equal(
    eventHref("ios", "27.0", "Beta 4", "beta-4"),
    "/apple/ios/27.0/beta-4/",
  );
});

test("first-class events replace their legacy milestone and keep builds distinct", () => {
  const citation = {
    _key: "citation-1",
    sourceId: "source.apple",
    sourceUrl: "https://support.apple.com/example",
    sourceTitle: "Apple release notes",
    publisher: "Apple",
    sourceClass: "firstPartyDocumentation",
  };
  const occurrence = {
    _key: "occurrence-1",
    changeId: "change.feature",
    changeTitle: "Example feature",
    action: "introduced",
    inheritance: "delta",
    summary: "An original description of the example feature.",
    documentedStatus: "documented",
    evidenceState: "confirmed",
    applicability: ["iPhone"],
    citations: [citation],
  };

  const normalized = normalizeResearchSnapshot({
    releases: [
      {
        _id: "release.ios.26.3",
        _updatedAt: "2026-07-29T12:00:00Z",
        version: "26.3",
        releaseStatus: "active",
        releaseTrain: {
          majorVersion: 26,
          platform: { slug: "ios", name: "iOS" },
        },
        milestones: [
          {
            _key: "milestone-1",
            label: "Beta 4",
            date: "2026-07-28",
            sourceUrl: citation.sourceUrl,
          },
        ],
      },
    ],
    events: [
      {
        _id: "event.ios.26.3.beta-4",
        _updatedAt: "2026-07-29T12:00:00Z",
        legacySourceId: "release.ios.26.3:milestone-1",
        versionId: "release.ios.26.3",
        version: "26.3",
        family: 26,
        platform: "ios",
        label: "Developer Beta 4",
        routeAlias: "beta-4",
        channel: "developerBeta",
        appearanceDate: "2026-07-28",
        availabilityState: "available",
        buildId: "build.23d123",
        buildNumber: "23D123",
        provenanceStatus: "sourceLinked",
        indexEligible: true,
        citations: [citation],
        changes: [occurrence],
      },
    ],
    builds: [
      {
        _id: "build.23d123",
        _updatedAt: "2026-07-29T12:00:00Z",
        versionId: "release.ios.26.3",
        version: "26.3",
        family: 26,
        platform: "ios",
        buildNumber: "23D123",
        canonicalSlug: "23d123",
        status: "available",
        provenanceStatus: "sourceLinked",
        indexEligible: true,
        citations: [citation],
        changes: [occurrence],
      },
    ],
    changes: [
      {
        _id: "change.feature",
        _updatedAt: "2026-07-29T12:00:00Z",
        title: "Example feature",
        category: "developerApi",
        summary: "A canonical description of the example feature.",
        citations: [citation],
      },
    ],
  });

  assert.equal(normalized.datasets.events.length, 1);
  assert.equal(normalized.datasets.events[0].channel, "developer_beta");
  assert.equal(normalized.datasets.builds.length, 1);
  assert.equal(
    normalized.datasets.builds[0].display_build_number,
    "23D123",
  );
  assert.equal(normalized.datasets.occurrences.length, 2);
  assert.deepEqual(
    new Set(
      normalized.datasets.occurrences.map(
        (candidate) => candidate.target_kind,
      ),
    ),
    new Set(["event", "build"]),
  );
  assert.equal(
    normalized.datasets.changes[0].category,
    "developer_api",
  );
  assert.ok(normalized.datasets.citations.length >= 4);
});

test("legacy event aliases match the public route collision rule", () => {
  const normalized = normalizeResearchSnapshot({
    releases: [
      {
        _id: "release.ios.10.0",
        version: "10.0",
        releaseStatus: "released",
        releaseTrain: {
          majorVersion: 10,
          platform: { slug: "ios", name: "iOS" },
        },
        milestones: [
          {
            _key: "beta-1",
            label: "Beta 1",
            date: "2016-06-13",
          },
          {
            _key: "beta-1-revision",
            label: "Beta 1",
            date: "2016-06-15",
            isRevision: true,
          },
        ],
      },
    ],
  });

  assert.deepEqual(
    normalized.datasets.events.map((event) => event.route_alias),
    ["beta-1-2016-06-13", "beta-1-2016-06-15"],
  );
});
