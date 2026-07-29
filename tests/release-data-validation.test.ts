import assert from "node:assert/strict";
import test from "node:test";
import {
  validateReleaseData,
  type ReleaseData,
} from "../scripts/lib/release-data-validation";

function validData(): ReleaseData {
  return {
    platforms: [
      {
        name: "iOS",
        slug: "ios",
        color: "#007AFF",
        sortOrder: 1,
      },
    ],
    releaseTrains: [
      {
        platform: "iOS",
        majorVersion: 18,
        displayName: "iOS 18",
        releaseYear: 2024,
      },
    ],
    releaseVersions: [
      {
        platform: "iOS",
        majorVersion: 18,
        version: "18.0",
        releaseStatus: "released",
        publicReleaseDate: "2024-09-16",
        releaseNotesUrl: "https://support.apple.com/121161",
        milestones: [
          {
            label: "Beta 1",
            date: "2024-06-10",
            sourceUrl:
              "https://developer.apple.com/news/releases/?id=06102024a",
            sourceLabel: "Apple Developer",
            isRevision: false,
          },
          {
            label: "Beta 2",
            date: "2024-06-24",
            isRevision: false,
          },
          {
            label: "Public",
            date: "2024-09-16",
            sourceUrl: "https://support.apple.com/121161",
            sourceLabel: "Apple Support",
            isRevision: false,
          },
        ],
      },
    ],
  };
}

function issueCodes(data: ReleaseData): string[] {
  return validateReleaseData(data).map((issue) => issue.code);
}

test("a coherent release record validates cleanly", () => {
  assert.deepEqual(validateReleaseData(validData()), []);
});

test("invalid calendar dates are rejected", () => {
  const data = validData();
  data.releaseVersions[0].milestones[0].date = "2024-02-30";
  assert.ok(issueCodes(data).includes("invalid-date"));
});

test("milestones must be stored in chronological order", () => {
  const data = validData();
  data.releaseVersions[0].milestones[1].date = "2024-06-01";
  assert.ok(issueCodes(data).includes("milestone-order"));
});

test("publicReleaseDate must agree with Public, not Public Beta", () => {
  const data = validData();
  data.releaseVersions[0].publicReleaseDate = "2024-09-15";
  assert.ok(issueCodes(data).includes("public-date-mismatch"));

  const publicBetaOnly = validData();
  publicBetaOnly.releaseVersions[0] = {
    ...publicBetaOnly.releaseVersions[0],
    releaseStatus: "active",
    publicReleaseDate: undefined,
    milestones: [
      {
        label: "Beta 1",
        date: "2024-06-10",
        isRevision: false,
      },
      {
        label: "Public Beta 1",
        date: "2024-07-15",
        isRevision: false,
      },
    ],
  };
  assert.deepEqual(validateReleaseData(publicBetaOnly), []);
});

test("lifecycle state and public availability cannot contradict", () => {
  const activeWithPublic = validData();
  activeWithPublic.releaseVersions[0].releaseStatus = "active";
  assert.ok(
    issueCodes(activeWithPublic).includes(
      "unreleased-with-public-date",
    ),
  );

  const releasedWithoutPublic = validData();
  releasedWithoutPublic.releaseVersions[0].releaseStatus = "released";
  releasedWithoutPublic.releaseVersions[0].publicReleaseDate = undefined;
  releasedWithoutPublic.releaseVersions[0].milestones =
    releasedWithoutPublic.releaseVersions[0].milestones.filter(
      (milestone) => milestone.label !== "Public",
    );
  assert.ok(
    issueCodes(releasedWithoutPublic).includes(
      "released-without-public-date",
    ),
  );

  const superseded = validData();
  superseded.releaseVersions[0].releaseStatus = "superseded";
  superseded.releaseVersions[0].publicReleaseDate = undefined;
  superseded.releaseVersions[0].milestones =
    superseded.releaseVersions[0].milestones.filter(
      (milestone) => milestone.label !== "Public",
    );
  assert.deepEqual(validateReleaseData(superseded), []);
});

test("revision flags must agree with normalized milestone labels", () => {
  const missingRevisionFlag = validData();
  missingRevisionFlag.releaseVersions[0].milestones[1].label =
    "Beta 2 v2";
  missingRevisionFlag.releaseVersions[0].milestones[1].isRevision =
    false;
  assert.ok(
    issueCodes(missingRevisionFlag).includes(
      "revision-flag-mismatch",
    ),
  );

  const unexpectedRevisionFlag = validData();
  unexpectedRevisionFlag.releaseVersions[0].milestones[1].isRevision =
    true;
  assert.ok(
    issueCodes(unexpectedRevisionFlag).includes(
      "revision-flag-mismatch",
    ),
  );
});

test("duplicate versions and duplicate milestone identities are rejected", () => {
  const duplicateVersion = validData();
  duplicateVersion.releaseVersions.push(
    structuredClone(duplicateVersion.releaseVersions[0]),
  );
  assert.ok(issueCodes(duplicateVersion).includes("duplicate-version"));

  const duplicateMilestone = validData();
  duplicateMilestone.releaseVersions[0].milestones.splice(
    1,
    0,
    structuredClone(
      duplicateMilestone.releaseVersions[0].milestones[0],
    ),
  );
  assert.ok(
    issueCodes(duplicateMilestone).includes("duplicate-milestone"),
  );
});

test("source URLs must be paired, HTTPS, and valid for release notes", () => {
  const missingLabel = validData();
  missingLabel.releaseVersions[0].milestones[0].sourceLabel =
    undefined;
  assert.ok(issueCodes(missingLabel).includes("source-pair-mismatch"));

  const insecureSource = validData();
  insecureSource.releaseVersions[0].milestones[0].sourceUrl =
    "http://example.com/beta";
  assert.ok(issueCodes(insecureSource).includes("invalid-source-url"));

  const insecureReleaseNotes = validData();
  insecureReleaseNotes.releaseVersions[0].releaseNotesUrl =
    "http://example.com/release-notes";
  assert.ok(
    issueCodes(insecureReleaseNotes).includes(
      "invalid-release-notes-url",
    ),
  );
});

test("release-train year is tied to the earliest public evidence", () => {
  const data = validData();
  data.releaseTrains[0].releaseYear = 2025;
  assert.ok(issueCodes(data).includes("release-year-mismatch"));
});
