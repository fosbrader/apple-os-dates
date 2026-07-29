import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import {
  buildParsedSeedData,
  parseAppleNote,
  parseDate,
  parseMilestoneLine,
  type ParsedVersion,
} from "../scripts/lib/apple-note-parser";

const sourceNote = readFileSync(
  path.join(process.cwd(), "original-apple-note"),
  "utf8",
);
const parsedSourceNote = parseAppleNote(sourceNote);

function version(
  platform: string,
  releaseVersion: string,
): ParsedVersion {
  const match = parsedSourceNote.versions.find(
    (candidate) =>
      candidate.platform === platform &&
      candidate.version === releaseVersion,
  );
  assert.ok(match, `Missing ${platform} ${releaseVersion}`);
  return match;
}

function hasMilestone(
  platform: string,
  releaseVersion: string,
  label: string,
  date: string,
): boolean {
  return version(platform, releaseVersion).milestones.some(
    (milestone) =>
      milestone.label === label && milestone.date === date,
  );
}

test("Public Beta is retained without ending an active release cycle", () => {
  const result = parseAppleNote(`
Apple Beta Release Dates
iOS 17.0
Beta 1: 6/5/23
Public Beta: 7/12/23
`);

  assert.equal(result.diagnostics.length, 0);
  assert.equal(result.versions.length, 1);
  assert.deepEqual(
    result.versions[0].milestones.map(({ label, date }) => ({
      label,
      date,
    })),
    [
      { label: "Beta 1", date: "2023-06-05" },
      { label: "Public Beta", date: "2023-07-12" },
    ],
  );
  assert.equal(result.versions[0].publicReleaseDate, undefined);
  assert.equal(result.versions[0].releaseStatus, "active");
});

test("straight and smart quoted beta labels normalize identically", () => {
  const straight = parseMilestoneLine("Beta '2': 12/19/18");
  const smart = parseMilestoneLine("Beta ‘2’: 12/19/18");

  assert.ok(straight);
  assert.ok(smart);
  assert.equal(straight.milestone.label, "Beta 2");
  assert.deepEqual(smart, straight);
});

test("all revised-build label forms set the revision flag", () => {
  const labels = [
    "Beta 1v2: 2/4/21",
    "Beta 1 v2: 2/4/21",
    "Beta 2 Update: 6/30/21",
  ];

  for (const line of labels) {
    const parsed = parseMilestoneLine(line);
    assert.ok(parsed, line);
    assert.equal(
      parsed.milestone.isRevision,
      true,
      `${parsed.milestone.label} must be marked as a revision`,
    );
  }

  const ordinaryBeta = parseMilestoneLine("Beta 2: 2/16/21");
  assert.ok(ordinaryBeta);
  assert.equal(ordinaryBeta.milestone.isRevision, false);
});

test("Apple Pay Cash and Shortcuts are explicitly diagnosed as non-OS programs", () => {
  const result = parseAppleNote(`
iOS 11.2
Beta 1: 10/30/17
Pay Cash Beta: 11/7/17
** Shortcuts v2.0b1: 7/5/18
Public: 12/2/17
`);

  assert.deepEqual(
    result.diagnostics.map(({ text, reason }) => ({ text, reason })),
    [
      {
        text: "Pay Cash Beta: 11/7/17",
        reason: "non-os-program",
      },
      {
        text: "** Shortcuts v2.0b1: 7/5/18",
        reason: "non-os-program",
      },
    ],
  );
  assert.deepEqual(
    result.versions[0].milestones.map((milestone) => milestone.label),
    ["Beta 1", "Public"],
  );
});

test("one combined header creates distinct platform records", () => {
  const result = parseAppleNote(`
iOS/iPadOS 17.0
Beta 1: 6/5/23
Public: 9/18/23
`);

  assert.deepEqual(
    result.versions.map(({ platform, version, majorVersion }) => ({
      platform,
      version,
      majorVersion,
    })),
    [
      { platform: "iOS", version: "17.0", majorVersion: 17 },
      {
        platform: "iPadOS",
        version: "17.0",
        majorVersion: 17,
      },
    ],
  );
  assert.notStrictEqual(
    result.versions[0].milestones,
    result.versions[1].milestones,
  );
});

test("status directives preserve active, released, and superseded lifecycle state", () => {
  const result = parseAppleNote(`
iOS 27.0
Status: Active
Beta 1: 6/8/26
———
iOS 18.0
Status: Released
Beta 1: 6/10/24
Public: 9/16/24
———
iPadOS 16.0
Status: Superseded — Superseded by iPadOS 16.1; never publicly released
Beta 1: 6/6/22
`);

  assert.equal(result.versions[0].releaseStatus, "active");
  assert.equal(result.versions[0].versionNote, undefined);
  assert.equal(result.versions[1].releaseStatus, "released");
  assert.equal(
    result.versions[1].publicReleaseDate,
    "2024-09-16",
  );
  assert.equal(result.versions[2].releaseStatus, "superseded");
  assert.equal(
    result.versions[2].versionNote,
    "Superseded by iPadOS 16.1; never publicly released",
  );
  assert.equal(result.versions[2].publicReleaseDate, undefined);
});

test("section-scoped release-note URLs survive version boundaries", () => {
  const url = "https://support.apple.com/en-us/HT210393";
  const result = parseAppleNote(`
iOS 13 full cycle release notes: ${url}
iOS 13.7
Beta 1: 8/26/20
Public: 9/1/20
———
iOS 13.6
Beta 1: 6/1/20
Public: 7/15/20
`);

  assert.equal(result.versions.length, 2);
  assert.equal(result.versions[0].releaseNotesUrl, url);
  assert.equal(result.versions[1].releaseNotesUrl, url);
});

test("the corrected note retains every historical Apple release-notes URL", () => {
  const expected: Array<[string, string]> = [
    ["13.7", "https://support.apple.com/en-us/HT210393"],
    ["12.4", "https://support.apple.com/en-us/HT209084"],
    ["11.4.1", "https://support.apple.com/en-us/HT208067#114"],
    [
      "10.3",
      "https://support.apple.com/kb/DL1893?viewlocale=en_US&locale=en_US",
    ],
  ];

  for (const [releaseVersion, expectedUrl] of expected) {
    assert.equal(
      version("iOS", releaseVersion).releaseNotesUrl,
      expectedUrl,
      `iOS ${releaseVersion}`,
    );
  }
});

test("date parsing rejects impossible and malformed calendar dates", () => {
  assert.equal(parseDate("2/29/24"), "2024-02-29");
  assert.equal(parseDate("2/29/23"), "");
  assert.equal(parseDate("13/1/24"), "");
  assert.equal(parseDate("4/31/24"), "");
  assert.equal(parseDate("not-a-date"), "");

  const result = parseAppleNote(`
iOS 18.0
Beta 1: 2/30/24
`);
  assert.deepEqual(result.versions, []);
  assert.equal(result.diagnostics[0]?.reason, "unclassified-line");
});

test("the corrected source note is completely classified and has unique platform/version records", () => {
  const unclassified = parsedSourceNote.diagnostics.filter(
    (diagnostic) => diagnostic.reason === "unclassified-line",
  );
  assert.deepEqual(unclassified, []);

  const keys = parsedSourceNote.versions.map(
    (candidate) => `${candidate.platform}|${candidate.version}`,
  );
  assert.equal(new Set(keys).size, keys.length);
});

test("release-train years come from the initial cycle rather than a later point release", () => {
  const parsed = parseAppleNote(`
iOS 18.6
Beta 1: 6/16/25
Public: 7/29/25
———
iOS 18.0
Beta 1: 6/10/24
Public: 9/16/24
`);
  const seed = buildParsedSeedData(parsed.versions);

  assert.equal(seed.releaseTrains.length, 1);
  assert.equal(seed.releaseTrains[0].releaseYear, 2024);

  const correctedSeed = buildParsedSeedData(parsedSourceNote.versions);
  const expectedYears = new Map([
    ["iOS|26", 2025],
    ["iPadOS|26", 2025],
    ["iOS|18", 2024],
    ["iPadOS|18", 2024],
    ["iOS|13", 2019],
    ["iPadOS|13", 2019],
  ]);
  for (const [key, expectedYear] of expectedYears) {
    const [platform, major] = key.split("|");
    const train = correctedSeed.releaseTrains.find(
      (candidate) =>
        candidate.platform === platform &&
        candidate.majorVersion === Number(major),
    );
    assert.equal(train?.releaseYear, expectedYear, key);
  }
});

test("audited date corrections and added milestones remain exact", async (t) => {
  const expected: Array<
    [platform: string, version: string, label: string, date: string]
  > = [
    ["iOS", "27.0", "Public Beta 1", "2026-07-13"],
    ["iPadOS", "27.0", "Beta 3 v2", "2026-07-13"],
    ["iOS", "26.5", "Beta 1 v2", "2026-04-03"],
    ["iOS", "26.4", "Beta 3 v2", "2026-03-05"],
    ["iOS", "26.0", "Beta 6 v2", "2025-08-14"],
    ["iOS", "18.6", "Beta 3", "2025-07-14"],
    ["iOS", "18.6", "Public Beta 3", "2025-07-15"],
    ["iOS", "17.4", "Beta 1 v2", "2024-01-30"],
    ["iOS", "17.1", "Beta 1", "2023-09-27"],
    ["iOS", "17.1", "Public Beta 1", "2023-09-28"],
    ["iOS", "17.0", "Beta 3 v2", "2023-07-11"],
    ["iOS", "16.3", "Beta 2", "2023-01-10"],
    ["iOS", "16.3", "Public Beta 2", "2023-01-11"],
    ["iOS", "16.0", "Public", "2022-09-12"],
    ["iOS", "15.7", "RC", "2022-09-07"],
    ["iOS", "15.6", "RC 2", "2022-07-15"],
    ["iOS", "15.0", "Beta 1", "2021-06-07"],
    ["iOS", "14.6", "Beta 3", "2021-05-10"],
    ["iOS", "14.6", "RC 2", "2021-05-21"],
    ["iOS", "14.5", "Beta 8", "2021-04-13"],
    ["iOS", "14.3", "RC 2", "2020-12-10"],
    ["iOS", "14.2", "Beta 4", "2020-10-20"],
    ["iOS", "14.1", "GM", "2020-10-13"],
    ["iOS", "13.7", "Beta 1", "2020-08-26"],
    ["iOS", "13.6", "13.5.5 Beta 1", "2020-06-01"],
    ["iOS", "13.5", "13.4.5 Beta 1", "2020-03-31"],
    ["iOS", "13.5", "GM", "2020-05-18"],
    ["iOS", "13.4", "Beta 4", "2020-03-03"],
    ["iOS", "13.4", "GM", "2020-03-18"],
    ["iOS", "13.3", "Beta 2", "2019-11-12"],
    ["iOS", "13.3", "Beta 3", "2019-11-20"],
    ["iOS", "12.4", "Beta 4", "2019-06-11"],
    ["iOS", "12.4", "Beta 7", "2019-07-16"],
    ["iOS", "11.3", "Beta 6", "2018-03-16"],
    ["iOS", "11.0", "Beta 2 Update", "2017-06-26"],
    ["iOS", "11.0", "Beta 6", "2017-08-14"],
  ];

  for (const [platform, releaseVersion, label, date] of expected) {
    await t.test(`${platform} ${releaseVersion} ${label}`, () => {
      assert.ok(
        hasMilestone(platform, releaseVersion, label, date),
        `Expected ${platform} ${releaseVersion} ${label} on ${date}`,
      );
    });
  }
});

test("audited platform scope and removed incorrect dates do not regress", () => {
  const forbidden: Array<
    [platform: string, version: string, label: string, date?: string]
  > = [
    ["iOS", "16.0", "Public", "2022-09-19"],
    ["iPadOS", "16.0", "Public"],
    ["iOS", "13.7", "GM", "2020-08-26"],
    ["iOS", "13.4", "Beta 6", "2020-03-18"],
    ["iOS", "13.3", "Beta 2", "2019-10-12"],
    ["iOS", "13.3", "Beta 3", "2019-10-20"],
    ["iOS", "12.1.1", "Beta 4", "2018-11-29"],
    ["iOS", "11.0", "Beta 6", "2017-08-15"],
    ["iPadOS", "17.1", "RC 2"],
    ["iPadOS", "15.2", "RC 2"],
    ["iOS", "15.1", "RC 2"],
  ];

  for (const [platform, releaseVersion, label, date] of forbidden) {
    const found = version(platform, releaseVersion).milestones.some(
      (milestone) =>
        milestone.label === label &&
        (date === undefined || milestone.date === date),
    );
    assert.equal(
      found,
      false,
      `Unexpected ${platform} ${releaseVersion} ${label}${date ? ` on ${date}` : ""}`,
    );
  }

  assert.equal(version("iPadOS", "16.0").releaseStatus, "superseded");
  assert.equal(version("iPadOS", "16.0").publicReleaseDate, undefined);
  assert.equal(version("iPadOS", "13.0").releaseStatus, "superseded");
  assert.equal(version("iPadOS", "13.0").publicReleaseDate, undefined);
});

test("audited build and device-scope evidence remains attached to milestones", () => {
  const iPadBeta = version("iPadOS", "27.0").milestones.find(
    (milestone) =>
      milestone.label === "Beta 3 v2" &&
      milestone.date === "2026-07-13",
  );
  assert.match(iPadBeta?.note || "", /Build 24A5380l/);

  const phoneRc = version("iOS", "17.1").milestones.find(
    (milestone) =>
      milestone.label === "RC 2" &&
      milestone.date === "2023-10-20",
  );
  assert.match(phoneRc?.note || "", /iPhone 15 family only/);
});
