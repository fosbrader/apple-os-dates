import { createHash } from "node:crypto";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import prettier from "prettier";

const directory = dirname(fileURLToPath(import.meta.url));
const seedPath = join(directory, "..", "seed-data.json");
const launchManifestPath = join(
  directory,
  "..",
  "apple-launch-content-2026.json",
);
const jsonPath = join(directory, "apple-26-4-prerelease.json");
const ledgerPath = join(directory, "apple-26-4-prerelease.md");
const outputFile = "apple-26-4-prerelease.json";
const reviewedAt = "2026-07-30T07:11:05Z";

const archiveEvidence = {
  iosIpadosBeta1: {
    url: "https://web.archive.org/web/20260219170414/https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-26_4-release-notes",
    rawUrl:
      "https://web.archive.org/web/20260219063222id_/https://developer.apple.com/tutorials/data/documentation/ios-ipados-release-notes/ios-ipados-26_4-release-notes.json",
    source: {
      url: "https://web.archive.org/web/20260219170414/https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-26_4-release-notes",
      title:
        "Archived iOS & iPadOS 26.4 Beta Release Notes — February 19 snapshot",
      publisher: "Apple Developer",
      sourceClass: "archive",
      topics: [
        "Apple Developer",
        "iOS",
        "iPadOS",
        "26.4",
        "Beta 1",
        "Internet Archive",
        "DocC snapshot",
      ],
    },
  },
  macosBeta1: {
    url: "https://web.archive.org/web/20260216203520/https://developer.apple.com/documentation/macos-release-notes/macos-26_4-release-notes",
    rawUrl:
      "https://web.archive.org/web/20260217150536id_/https://developer.apple.com/tutorials/data/documentation/macos-release-notes/macos-26_4-release-notes.json",
    source: {
      url: "https://web.archive.org/web/20260216203520/https://developer.apple.com/documentation/macos-release-notes/macos-26_4-release-notes",
      title:
        "Archived macOS Tahoe 26.4 Beta Release Notes — February 16 snapshot",
      publisher: "Apple Developer",
      sourceClass: "archive",
      topics: [
        "Apple Developer",
        "macOS",
        "26.4",
        "Beta 1",
        "Internet Archive",
        "DocC snapshot",
      ],
    },
  },
  macosBeta2: {
    url: "https://web.archive.org/web/20260225122433/https://developer.apple.com/documentation/macos-release-notes/macos-26_4-release-notes",
    rawUrl:
      "https://web.archive.org/web/20260225122435id_/https://developer.apple.com/tutorials/data/documentation/macos-release-notes/macos-26_4-release-notes.json",
    source: {
      url: "https://web.archive.org/web/20260225122433/https://developer.apple.com/documentation/macos-release-notes/macos-26_4-release-notes",
      title:
        "Archived macOS Tahoe 26.4 Beta 2 Release Notes — February 25 snapshot",
      publisher: "Apple Developer",
      sourceClass: "archive",
      topics: [
        "Apple Developer",
        "macOS",
        "26.4",
        "Beta 2",
        "Internet Archive",
        "DocC snapshot",
      ],
    },
  },
};

const sharedMobileBeta1Specs = [
  {
    suffix: "background-assets-offline-state",
    title: "Offline Background Assets inspection and refresh APIs",
    canonicalSummary:
      "Background Assets added APIs for inspecting local asset-pack state while offline and requesting the latest locally available pack version.",
    category: "developerApi",
    action: "introduced",
    locator: "Background Assets — New Features; issues 164498466 and 166237389",
    summary:
      "The initial archived beta note documents offline status queries and an API for ensuring that the latest asset-pack version is available locally.",
  },
  {
    suffix: "background-assets-download-crash",
    title: "Background Assets download-crash known issue",
    canonicalSummary:
      "Apple documented a beta issue in which an application could crash while downloading an asset pack.",
    category: "knownIssue",
    action: "knownIssue",
    locator: "Background Assets — Known Issues; issue 169648111",
    summary:
      "The beta note warns that an asset-pack download could crash the application and provides relaunch guidance.",
  },
  {
    suffix: "external-hfs-automount",
    title: "External HFS automount known issue",
    canonicalSummary:
      "Apple documented that HFS-formatted external media might not mount automatically in the beta.",
    category: "knownIssue",
    action: "knownIssue",
    locator: "External Media — Known Issues; issue 168672160",
    summary:
      "The shared iOS and iPadOS beta note records an automatic-mount failure for HFS external media and labels its command-line workaround as macOS-only.",
  },
  {
    suffix: "feedback-close-button",
    title: "Feedback close-button known issue",
    canonicalSummary:
      "The Feedback interface could leave its close button unresponsive after a crash or panic report was submitted.",
    category: "knownIssue",
    action: "knownIssue",
    locator: "Feedback — Known Issues; issue 170091186",
    summary:
      "The initial beta note records an unresponsive close control after submitting a crash or panic report, with locking and unlocking as a workaround.",
  },
  {
    suffix: "memory-integrity-full-protection",
    title: "Full Memory Integrity Enforcement opt-in",
    canonicalSummary:
      "Applications gained an option to use the full Memory Integrity Enforcement protection level instead of being limited to Soft Mode.",
    category: "developerApi",
    action: "introduced",
    locator:
      "Memory Integrity Enforcement for Applications — New Features; issue 160719439",
    summary:
      "The archived beta note says applications can opt in to the full protection mode for stronger memory-safety enforcement.",
  },
  {
    suffix: "rcs-e2ee-apple-device-testing",
    title: "RCS end-to-end encryption testing between Apple devices",
    canonicalSummary:
      "The beta exposed RCS end-to-end encryption for developer testing between supported Apple devices while explicitly withholding it from the public release.",
    category: "feature",
    action: "introduced",
    locator: "Messages — New Features; issue 170160585",
    summary:
      "Apple's initial beta note limits this RCS encryption test to Apple-device conversations and says it was not shipping to customers in 26.4.",
  },
  {
    suffix: "cfnetwork-pac-runloop-leak",
    title: "PAC configuration run-loop source leak fix",
    canonicalSummary:
      "CFNetwork corrected a run-loop source leak affecting processes that used automatic proxy configuration or discovery.",
    category: "bugFix",
    action: "fixed",
    locator: "Networking — Resolved Issues; issues 166839810 and FB21376045",
    summary:
      "The beta note documents corrected ownership behavior around proxy auto-configuration callbacks and their returned Core Foundation objects.",
  },
  {
    suffix: "reality-composer-export",
    title: "Reality Composer export known issue",
    canonicalSummary:
      "Reality Composer could present an empty export panel instead of exporting a project as Reality or USDZ content.",
    category: "knownIssue",
    action: "knownIssue",
    locator: "Reality Composer — Known Issues; issue 170091896",
    summary:
      "The archived note records an empty export menu that prevented Reality Composer projects from being exported in the documented formats.",
  },
  {
    suffix: "storekit-revocation-fields",
    title: "StoreKit transaction revocation fields",
    canonicalSummary:
      "StoreKit Transaction records gained revocationType and revocationPercentage fields.",
    category: "developerApi",
    action: "introduced",
    locator: "StoreKit — New Features; issue 148858551",
    summary:
      "The initial beta note adds two revocation-related properties to StoreKit transaction data.",
  },
  {
    suffix: "swiftui-current-user-activity",
    title: "SwiftUI current user-activity fix",
    canonicalSummary:
      "SwiftUI corrected a failure to expose the most recent userActivity value as the current user activity.",
    category: "bugFix",
    action: "fixed",
    locator: "SwiftUI — Resolved Issues; issue 163136831",
    summary:
      "The archived beta note marks SwiftUI's stale current-user-activity behavior as resolved.",
  },
  {
    suffix: "swiftui-realitykit-animation-grouping",
    title: "SwiftUI RealityKit animation-grouping limitation",
    canonicalSummary:
      "Implicit RealityKit component animations combine only when successive animations target the same property set.",
    category: "knownIssue",
    action: "knownIssue",
    locator: "SwiftUI — Known Issues; issue 169723142",
    summary:
      "Apple documents that overlapping implicit animations can remain independent and overwrite a property when their targeted component-property sets differ.",
  },
  {
    suffix: "uikit-keyboard-notification",
    title: "UIKit keyboard-notification delivery fix",
    canonicalSummary:
      "UIKit corrected a case in which KeyboardNotification might not be delivered.",
    category: "bugFix",
    action: "fixed",
    locator: "UIKit — Resolved Issues; issue 165479264",
    summary:
      "The initial beta note marks unreliable keyboard-notification delivery as fixed.",
  },
];

const macosBeta1Specs = [
  {
    suffix: "appkit-window-resize-pointer",
    title: "AppKit window-resize pointer fix",
    canonicalSummary:
      "AppKit corrected a resize pointer that did not follow the shape of a window corner.",
    category: "bugFix",
    action: "fixed",
    locator: "AppKit — Resolved Issues; issue 149726089",
    summary:
      "The initial macOS beta note marks the mismatch between the resize pointer and the window-corner shape as resolved.",
  },
  {
    suffix: "background-assets-offline-state",
    title: "Offline Background Assets inspection and refresh APIs",
    canonicalSummary:
      "Background Assets added APIs for inspecting local asset-pack state while offline and requesting the latest locally available pack version.",
    category: "developerApi",
    action: "introduced",
    locator: "Background Assets — New Features; issues 164498466 and 166237389",
    summary:
      "The initial macOS beta note documents offline status queries and an API for ensuring that the latest asset-pack version is available locally.",
  },
  {
    suffix: "background-assets-url-override",
    title: "Background Assets URL-override known issue",
    canonicalSummary:
      "A previously configured URL override could disrupt App Store applications that use Apple-hosted Background Assets.",
    category: "knownIssue",
    action: "knownIssue",
    locator: "Background Assets — Known Issues; issue 169558509",
    summary:
      "Apple's beta note warns developers to remove an existing URL override before installing or using affected App Store applications.",
  },
  {
    suffix: "background-assets-download-crash",
    title: "Background Assets download-crash known issue",
    canonicalSummary:
      "Apple documented a beta issue in which an application could crash while downloading an asset pack.",
    category: "knownIssue",
    action: "knownIssue",
    locator: "Background Assets — Known Issues; issue 169648111",
    summary:
      "The beta note warns that an asset-pack download could crash the application and provides relaunch guidance.",
  },
  {
    key: "macos-26-4-network-midi-2",
    title: "Network MIDI 2.0 support",
    canonicalSummary:
      "macOS expanded networked music-device communication with MIDI 2.0 capabilities.",
    category: "developerApi",
    action: "introduced",
    locator: "CoreMIDI — New Features; issue 118728162",
    summary:
      "The initial beta note introduces Network MIDI 2.0 sessions, local-network discovery, and UDP transport for Universal MIDI Packets.",
  },
  {
    suffix: "external-boot-panic",
    title: "M1 external-boot panic known issue",
    canonicalSummary:
      "Some M1 Mac configurations could panic while booting an installation from an external disk.",
    category: "knownIssue",
    action: "knownIssue",
    locator: "External Boot — Known Issues; issue 170263142",
    summary:
      "Apple documents an external-disk boot panic on some M1 configurations and recommends a secondary APFS volume for testing.",
  },
  {
    suffix: "external-hfs-automount",
    title: "External HFS automount known issue",
    canonicalSummary:
      "HFS-formatted external media might not mount automatically in the beta.",
    category: "knownIssue",
    action: "knownIssue",
    locator: "External Media — Known Issues; issue 168672160",
    summary:
      "The macOS beta note records an automatic-mount failure and gives diskutil mount as a temporary workaround.",
  },
  {
    suffix: "exchange-sync",
    title: "Exchange account synchronization known issue",
    canonicalSummary:
      "Exchange synchronization could fail for Calendar, Reminders, and Notes.",
    category: "knownIssue",
    action: "knownIssue",
    locator: "Internet Accounts — Known Issues; issue 168082477",
    summary:
      "Apple documents failed Exchange synchronization and suggests disabling Notes sync to keep Calendar and Reminders updating.",
  },
  {
    suffix: "touch-id-standard-user-unlock",
    title: "Standard-user Touch ID unlock known issue",
    canonicalSummary:
      "Touch ID might be unavailable for unlocking a standard user's screen after an update when FileVault and login order meet the documented conditions.",
    category: "knownIssue",
    action: "knownIssue",
    locator: "Login — Known Issues; issue 169743642",
    summary:
      "The initial beta note says an administrator should sign in first to avoid the documented standard-account unlock state.",
  },
  {
    suffix: "recovery-activation-lock-erase",
    title: "Recovery Activation Lock erase known issue",
    canonicalSummary:
      "Deleting a boot volume from the Activation Lock window in macOS Recovery might not complete a full erase.",
    category: "knownIssue",
    action: "knownIssue",
    locator: "macOS Recovery — Known Issues; issue 170280070",
    summary:
      "Apple directs testers to use Erase All Content and Settings from the running system instead of the affected Recovery workflow.",
  },
  {
    suffix: "cfnetwork-pac-runloop-leak",
    title: "PAC configuration run-loop source leak fix",
    canonicalSummary:
      "CFNetwork corrected a run-loop source leak affecting processes that used automatic proxy configuration or discovery.",
    category: "bugFix",
    action: "fixed",
    locator: "Networking — Resolved Issues; issues 166839810 and FB21376045",
    summary:
      "The beta note documents corrected ownership behavior around proxy auto-configuration callbacks and their returned Core Foundation objects.",
  },
  {
    suffix: "resource-fork-partial-writes",
    title: "Resource-fork partial-write restriction",
    canonicalSummary:
      "File systems without native extended attributes restrict partial writes within the first 286 bytes of the resource-fork attribute.",
    category: "compatibility",
    action: "changed",
    locator: "Resource fork — Resolved Issues; issue 156896699",
    summary:
      "The initial beta note describes the supported replacement or beyond-offset write patterns for the com.apple.ResourceFork attribute.",
  },
  {
    key: "macos-26-4-rosetta-compatibility-notice",
    title: "Rosetta retirement compatibility notice",
    canonicalSummary:
      "macOS began warning about future compatibility changes for software that still depends on Rosetta translation.",
    category: "compatibility",
    action: "changed",
    locator: "Rosetta — Deprecations; issue 169228455",
    summary:
      "The beta began accelerated compatibility notices for applications that depend on Rosetta, ahead of the previously announced support transition.",
  },
  {
    suffix: "storekit-revocation-fields",
    title: "StoreKit transaction revocation fields",
    canonicalSummary:
      "StoreKit Transaction records gained revocationType and revocationPercentage fields.",
    category: "developerApi",
    action: "introduced",
    locator: "StoreKit — New Features; issue 148858551",
    summary:
      "The initial beta note adds two revocation-related properties to StoreKit transaction data.",
  },
  {
    suffix: "swiftui-current-user-activity",
    title: "SwiftUI current user-activity fix",
    canonicalSummary:
      "SwiftUI corrected a failure to expose the most recent userActivity value as the current user activity.",
    category: "bugFix",
    action: "fixed",
    locator: "SwiftUI — Resolved Issues; issue 163136831",
    summary:
      "The archived beta note marks SwiftUI's stale current-user-activity behavior as resolved.",
  },
  {
    suffix: "swiftui-glass-backdrop",
    title: "Inactive-window glass backdrop fix",
    canonicalSummary:
      "A non-opaque macOS window hosting glass content now refreshes the backdrop behind that glass while inactive.",
    category: "bugFix",
    action: "fixed",
    locator: "SwiftUI — Resolved Issues; issues 166828089 and FB21375029",
    summary:
      "The beta note marks backdrop updates behind glass content in inactive non-opaque windows as corrected.",
  },
  {
    suffix: "swiftui-realitykit-animation-grouping",
    title: "SwiftUI RealityKit animation-grouping limitation",
    canonicalSummary:
      "Implicit RealityKit component animations combine only when successive animations target the same property set.",
    category: "knownIssue",
    action: "knownIssue",
    locator: "SwiftUI — Known Issues; issue 169723142",
    summary:
      "Apple documents that overlapping implicit animations can remain independent and overwrite a property when their targeted component-property sets differ.",
  },
  {
    key: "macos-26-4-vm-install-display",
    title: "Virtual-machine installation display fix",
    canonicalSummary:
      "A virtualization fix addressed black-screen failures during supported guest installation workflows.",
    category: "bugFix",
    action: "fixed",
    locator: "Virtualization — Resolved Issues; issue 169654019",
    summary:
      "The initial beta note marks a black screen during new macOS Tahoe virtual-machine installation as resolved on affected hardware.",
  },
];

const macosBeta2Spec = {
  suffix: "storekit-purchase-intents",
  title: "Background-launch StoreKit purchase-intent fix",
  canonicalSummary:
    "StoreKit corrected a case in which purchase intents were not emitted from the intents sequence after a background app launch.",
  category: "bugFix",
  action: "fixed",
  locator: "StoreKit — Resolved Issues; issues 168958783 and FB21767675",
  summary:
    "The Beta 2 snapshot adds a resolved issue for missing StoreKit purchase intents when an application launches from the background.",
};

const supportedPlatforms = [
  {
    slug: "ios",
    displayName: "iOS",
    releaseVersionId: "version-ios-26-4",
    beta1Scope:
      "Background Assets APIs and limitations, memory protection, RCS encryption testing, networking, StoreKit, SwiftUI, UIKit, Feedback, external media, and Reality Composer",
  },
  {
    slug: "ipados",
    displayName: "iPadOS",
    releaseVersionId: "version-ipados-26-4",
    beta1Scope:
      "Background Assets APIs and limitations, memory protection, RCS encryption testing, networking, StoreKit, SwiftUI, UIKit, Feedback, external media, and Reality Composer",
  },
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function signature(milestones) {
  return milestones
    .map(
      (milestone) =>
        `${milestone.label}@${milestone.date}${milestone.isRevision ? "*" : ""}`,
    )
    .join("|");
}

function idForSeedVersion(version) {
  return `version-${version.platform.toLowerCase()}-${version.version.replaceAll(".", "-")}`;
}

function citation(url, locator) {
  return {
    url,
    ...(locator ? { locator } : {}),
  };
}

function article(blocks) {
  return {
    authorship: "originalSynthesis",
    blocks,
  };
}

function heading(text) {
  return { style: "h2", text };
}

function paragraph(text, citations) {
  return { text, citations };
}

function initialSnapshotChange(platformSlug, spec, source) {
  return {
    key: spec.key || `${platformSlug}-26-4-beta-1-${spec.suffix}`,
    title: spec.title,
    canonicalSummary: spec.canonicalSummary,
    category: spec.category,
    action: spec.action,
    inheritance: "delta",
    summary: spec.summary,
    documentedStatus: "documented",
    evidenceState: "confirmed",
    verificationMethod:
      "Observed in the first CDX-confirmed raw Apple DocC payload after Beta 1 and before Beta 2. This is initial snapshot-state attribution, not a claim about the exact hour the item first appeared.",
    citations: [citation(source.url, spec.locator)],
  };
}

function beta1Event(platform) {
  const source = archiveEvidence.iosIpadosBeta1;
  const sourceCitation = citation(
    source.url,
    "Human DocC capture 20260219170414; companion raw payload 20260219063222; iOS & iPadOS 26.4 Beta Release Notes",
  );
  return {
    target: {
      releaseVersionId: platform.releaseVersionId,
      routeAlias: "beta-1",
    },
    authorship: "originalSynthesis",
    summary: `The first retained raw Apple DocC state after ${platform.displayName} 26.4 Beta 1 and before Beta 2 documents ${platform.beta1Scope}.`,
    article: article([
      heading("Archived Apple note state"),
      paragraph(
        `Internet Archive preserved Apple's ${platform.displayName} 26.4 beta documentation during the interval after Beta 1 and before Beta 2. The raw DocC payload identifies itself as the 26.4 beta notes and contains ${sharedMobileBeta1Specs.length} structured items represented here.`,
        [sourceCitation],
      ),
      heading("Documented Beta 1 inventory"),
      paragraph(
        `The archived state covers ${platform.beta1Scope}. Items are separated below so known issues, resolved issues, new APIs, and test-only capabilities remain distinguishable.`,
        [sourceCitation],
      ),
      heading("Attribution boundary"),
      paragraph(
        "This page records the first retained 26.4 note state, not a claim that every item debuted at the exact seed publication time. The raw capture predates Beta 2, which makes Beta 1 the only intervening 26.4 milestone; later beta, RC, and Public material is not copied backward.",
        [sourceCitation],
      ),
    ]),
    citations: [sourceCitation],
    changes: sharedMobileBeta1Specs.map((spec) =>
      initialSnapshotChange(platform.slug, spec, source),
    ),
    provenanceStatus: "editoriallyVerified",
    editorialReview: { status: "approved", reviewedAt },
    isIndexable: true,
  };
}

function macosBeta1Event() {
  const source = archiveEvidence.macosBeta1;
  const sourceCitation = citation(
    source.url,
    "Human DocC capture 20260216203520; companion raw payload 20260217150536; macOS Tahoe 26.4 Beta Release Notes",
  );
  return {
    target: {
      releaseVersionId: "version-macos-26-4",
      routeAlias: "beta-1",
    },
    authorship: "originalSynthesis",
    summary:
      "The first retained raw Apple DocC state after macOS Tahoe 26.4 Beta 1 and before Beta 2 documents 18 distinct API, compatibility, resolved-issue, and known-issue entries.",
    article: article([
      heading("Archived Apple note state"),
      paragraph(
        `Apple's human documentation shell was archived on the Beta 1 date, and its raw DocC payload was captured the following day, before Beta 2. The payload identifies itself as macOS Tahoe 26.4 Beta Release Notes and contains ${macosBeta1Specs.length} structured items represented here.`,
        [sourceCitation],
      ),
      heading("Documented Beta 1 inventory"),
      paragraph(
        "The initial state spans AppKit, Background Assets, CoreMIDI, external boot and media, Exchange accounts, login and Recovery, networking, resource forks, Rosetta, StoreKit, SwiftUI, and virtualization. Known issues remain labeled separately from fixes and new capabilities.",
        [sourceCitation],
      ),
      heading("Attribution boundary"),
      paragraph(
        "This is an observed initial snapshot state rather than a claim that every item appeared at the exact release hour. Because the raw payload follows Beta 1 and precedes Beta 2, no later milestone is crossed and no final-note material is projected backward.",
        [sourceCitation],
      ),
    ]),
    citations: [sourceCitation],
    changes: macosBeta1Specs.map((spec) =>
      initialSnapshotChange("macos", spec, source),
    ),
    provenanceStatus: "editoriallyVerified",
    editorialReview: { status: "approved", reviewedAt },
    isIndexable: true,
  };
}

function macosBeta2Event() {
  const before = archiveEvidence.macosBeta1;
  const after = archiveEvidence.macosBeta2;
  const beforeCitation = citation(
    before.url,
    "Raw payload 20260217150536; 19 ungrouped note items before Beta 2",
  );
  const afterCitation = citation(
    after.url,
    "Raw payload 20260225122435; macOS Tahoe 26.4 Beta 2 Release Notes; StoreKit — Resolved Issues",
  );
  return {
    target: {
      releaseVersionId: "version-macos-26-4",
      routeAlias: "beta-2",
    },
    authorship: "originalSynthesis",
    summary:
      "A sequential diff of CDX-confirmed Apple DocC payloads adds one macOS 26.4 Beta 2 note: a StoreKit purchase-intent fix for background app launches.",
    article: article([
      heading("Sequential archive diff"),
      paragraph(
        "The retained raw Apple payload before Beta 2 contains the Beta 1 state. The next retained raw payload identifies itself as Beta 2 and adds one structured note item while retaining the earlier inventory.",
        [beforeCitation, afterCitation],
      ),
      heading("Documented Beta 2 delta"),
      paragraph(
        "The added StoreKit resolved issue concerns purchase intents that might not be emitted from the intents sequence when an application is launched from the background.",
        [afterCitation],
      ),
      heading("Attribution boundary"),
      paragraph(
        "The two raw payload captures bracket Beta 2 without crossing another macOS 26.4 milestone. This page therefore records the StoreKit item as a snapshot-derived Beta 2 delta; it does not import changes from the later cumulative Public notes.",
        [beforeCitation, afterCitation],
      ),
    ]),
    citations: [beforeCitation, afterCitation],
    changes: [
      {
        key: `macos-26-4-beta-2-${macosBeta2Spec.suffix}`,
        title: macosBeta2Spec.title,
        canonicalSummary: macosBeta2Spec.canonicalSummary,
        category: macosBeta2Spec.category,
        action: macosBeta2Spec.action,
        inheritance: "delta",
        summary: macosBeta2Spec.summary,
        documentedStatus: "documented",
        evidenceState: "confirmed",
        verificationMethod:
          "Sequential diff between CDX-confirmed raw Apple DocC payloads captured after Beta 1 and after Beta 2, with no intervening macOS 26.4 milestone.",
        citations: [
          citation(before.url, "StoreKit section before Beta 2"),
          citation(after.url, macosBeta2Spec.locator),
        ],
      },
    ],
    provenanceStatus: "editoriallyVerified",
    editorialReview: { status: "approved", reviewedAt },
    isIndexable: true,
  };
}

function collectCitations(value, output = []) {
  if (Array.isArray(value)) {
    for (const item of value) collectCitations(item, output);
    return output;
  }
  if (!value || typeof value !== "object") return output;
  if (
    typeof value.url === "string" &&
    Object.keys(value).every((key) => ["url", "locator", "note"].includes(key))
  ) {
    output.push(value);
    return output;
  }
  for (const item of Object.values(value)) collectCitations(item, output);
  return output;
}

const seed = JSON.parse(await readFile(seedPath, "utf8"));
const launchManifest = JSON.parse(await readFile(launchManifestPath, "utf8"));

const seedVersions = seed.releaseVersions
  .filter(
    (version) =>
      version.version === "26.4" &&
      ["iOS", "iPadOS", "macOS", "tvOS", "visionOS", "watchOS"].includes(
        version.platform,
      ),
  )
  .sort((a, b) => a.platform.localeCompare(b.platform));

const expectedSeed = {
  "iOS 26.4":
    "Beta 1@2026-02-16|Beta 2@2026-02-23|Beta 3@2026-03-02|Beta 3 v2@2026-03-05*|Beta 4@2026-03-09|RC@2026-03-18|Public@2026-03-24",
  "iPadOS 26.4":
    "Beta 1@2026-02-16|Beta 2@2026-02-23|Beta 3@2026-03-02|Beta 3 v2@2026-03-05*|Beta 4@2026-03-09|RC@2026-03-18|Public@2026-03-24",
  "macOS 26.4":
    "Beta 1@2026-02-16|Beta 2@2026-02-23|Beta 3@2026-03-03|Beta 4@2026-03-09|RC@2026-03-18|Public@2026-03-24",
  "tvOS 26.4":
    "Beta 1@2026-02-16|Beta 2@2026-02-23|Beta 3@2026-03-02|Beta 4@2026-03-09|RC@2026-03-18|Public@2026-03-24",
  "visionOS 26.4":
    "Beta 1@2026-02-16|Beta 2@2026-02-23|Beta 3@2026-03-02|Beta 4@2026-03-09|RC@2026-03-18|Public@2026-03-24",
  "watchOS 26.4":
    "Beta 1@2026-02-16|Beta 2@2026-02-23|Beta 3@2026-03-02|Beta 3 v2@2026-03-05*|Beta 4@2026-03-09|RC@2026-03-18|Public@2026-03-24",
};

assert(seedVersions.length === 6, "Expected six 26.4 platform records.");
for (const version of seedVersions) {
  const key = `${version.platform} ${version.version}`;
  assert(expectedSeed[key], `Unexpected seed version ${key}.`);
  assert(
    signature(version.milestones) === expectedSeed[key],
    `${key} milestone closure changed.`,
  );
  assert(
    version.publicReleaseDate === "2026-03-24",
    `${key} public date changed.`,
  );
}

const seedMilestones = seedVersions.flatMap((version) =>
  version.milestones.map((milestone) => ({
    releaseVersionId: idForSeedVersion(version),
    platform: version.platform,
    ...milestone,
  })),
);
const publicMilestones = seedMilestones.filter(
  (milestone) => milestone.label === "Public",
);
const prereleaseMilestones = seedMilestones.filter(
  (milestone) => milestone.label !== "Public",
);
const publicBetaMilestones = prereleaseMilestones.filter((milestone) =>
  milestone.label.toLowerCase().includes("public beta"),
);
const supportedRouteKeys = new Set([
  "version-ios-26-4/beta-1",
  "version-ipados-26-4/beta-1",
  "version-macos-26-4/beta-1",
  "version-macos-26-4/beta-2",
]);
const supportedMilestones = prereleaseMilestones.filter((milestone) =>
  supportedRouteKeys.has(
    `${milestone.releaseVersionId}/${milestone.label.toLowerCase().replaceAll(" ", "-")}`,
  ),
);
const unsupportedMilestones = prereleaseMilestones.filter(
  (milestone) =>
    !supportedRouteKeys.has(
      `${milestone.releaseVersionId}/${milestone.label.toLowerCase().replaceAll(" ", "-")}`,
    ),
);

assert(seedMilestones.length === 39, "Expected 39 total seed milestones.");
assert(publicMilestones.length === 6, "Expected six Public milestones.");
assert(
  prereleaseMilestones.length === 33,
  "Expected 33 prerelease milestones.",
);
assert(
  publicBetaMilestones.length === 0,
  "A Public Beta route appeared and needs explicit research.",
);
assert(
  supportedMilestones.length === 4,
  "Expected exactly four supported prerelease milestones.",
);
assert(
  unsupportedMilestones.length === 29,
  "Expected exactly 29 unsupported prerelease milestones.",
);

const launchVersionIds = new Set(
  (launchManifest.versions || []).map((version) => version.releaseVersionId),
);
for (const version of seedVersions) {
  assert(
    launchVersionIds.has(idForSeedVersion(version)),
    `${idForSeedVersion(version)} is not owned by the approved launch manifest.`,
  );
}

const launchPublicEvents = (launchManifest.events || []).filter((event) => {
  const legacySourceId = event.target?.legacySourceId || "";
  return (
    /^version-(ios|ipados|macos|tvos|visionos|watchos)-26-4:m[56]$/.test(
      legacySourceId,
    ) &&
    event.editorialReview?.status === "approved" &&
    event.provenanceStatus === "editoriallyVerified" &&
    event.isIndexable === true
  );
});
assert(
  launchPublicEvents.length === 6,
  "Expected six approved 26.4 Public routes in the launch manifest.",
);

const approvedChanges = new Map();
for (const event of launchManifest.events || []) {
  for (const change of event.changes || []) {
    const definition = {
      title: change.title,
      canonicalSummary: change.canonicalSummary,
      category: change.category,
    };
    const prior = approvedChanges.get(change.key);
    assert(
      !prior || JSON.stringify(prior) === JSON.stringify(definition),
      `Approved launch change ${change.key} has conflicting definitions.`,
    );
    approvedChanges.set(change.key, definition);
  }
}
for (const spec of macosBeta1Specs.filter((item) => item.key)) {
  const approved = approvedChanges.get(spec.key);
  assert(approved, `${spec.key} is not an approved reusable change.`);
  assert(
    JSON.stringify(approved) ===
      JSON.stringify({
        title: spec.title,
        canonicalSummary: spec.canonicalSummary,
        category: spec.category,
      }),
    `${spec.key} drifted from its approved reusable definition.`,
  );
}

const sources = Object.values(archiveEvidence).map((item) => item.source);
const events = [
  ...supportedPlatforms.map(beta1Event),
  macosBeta1Event(),
  macosBeta2Event(),
];
const bundle = {
  formatVersion: 1,
  target: { projectId: "lh3yswzu", dataset: "production" },
  accessedAt: "2026-07-30",
  sources,
  versions: [],
  events,
  builds: [],
};

assert(bundle.versions.length === 0, "Version overlays are out of scope.");
assert(bundle.events.length === 4, "Expected four event overlays.");
assert(bundle.builds.length === 0, "Build pages are out of scope.");
const occurrences = bundle.events.flatMap((event) => event.changes);
assert(occurrences.length === 43, "Expected 43 change occurrences.");
assert(
  new Set(occurrences.map((change) => change.key)).size === 43,
  "Expected 43 unique or approved platform-scoped change keys.",
);
for (const event of bundle.events) {
  assert(
    JSON.stringify(Object.keys(event.target).sort()) ===
      JSON.stringify(["releaseVersionId", "routeAlias"]),
    "Event selector contains a non-durable field.",
  );
  assert(
    supportedRouteKeys.has(
      `${event.target.releaseVersionId}/${event.target.routeAlias}`,
    ),
    "Event selector escaped the exact supported-route allowlist.",
  );
  assert(
    event.provenanceStatus === "editoriallyVerified" &&
      event.editorialReview.status === "approved" &&
      event.editorialReview.reviewedAt === reviewedAt &&
      event.isIndexable === true,
    "Every event must remain independently approved and indexable.",
  );
  assert(event.changes.length > 0, "Every emitted event needs a delta.");
  for (const change of event.changes) {
    assert(change.inheritance === "delta", `${change.key} is not a delta.`);
    assert(
      change.documentedStatus === "documented" &&
        change.evidenceState === "confirmed",
      `${change.key} has an unexpected evidence state.`,
    );
  }
}

const sourceUrls = new Set(sources.map((source) => source.url));
assert(sourceUrls.size === sources.length, "Source URLs must be unique.");
for (const source of sources) {
  assert(
    source.url.startsWith("https://web.archive.org/web/") &&
      source.sourceClass === "archive" &&
      source.publisher === "Apple Developer",
    `Archive provenance is incomplete for ${source.url}.`,
  );
  assert(
    !source.url.includes("/tutorials/data/"),
    `Reader-facing source exposes raw DocC transport JSON: ${source.url}.`,
  );
}
for (const item of Object.values(archiveEvidence)) {
  assert(
    item.rawUrl.startsWith("https://web.archive.org/web/") &&
      item.rawUrl.includes("id_/https://developer.apple.com/tutorials/data/"),
    `Raw archive URL is not exact: ${item.rawUrl}.`,
  );
}
const citations = collectCitations({ events });
for (const item of citations) {
  assert(sourceUrls.has(item.url), `Undeclared citation source ${item.url}.`);
}
for (const url of sourceUrls) {
  assert(
    citations.some((item) => item.url === url),
    `Declared source is unused: ${url}.`,
  );
}

const files = (await readdir(directory))
  .filter((file) => file.endsWith(".json") && file !== outputFile)
  .sort();
const targetOwners = new Map();
const researchChangeDefinitions = new Map();
for (const file of files) {
  const other = JSON.parse(await readFile(join(directory, file), "utf8"));
  for (const event of other.events || []) {
    if (event.target?.releaseVersionId && event.target?.routeAlias) {
      targetOwners.set(
        `${event.target.releaseVersionId}/${event.target.routeAlias}`,
        file,
      );
    }
    for (const change of event.changes || []) {
      const definition = JSON.stringify({
        title: change.title,
        canonicalSummary: change.canonicalSummary,
        category: change.category,
      });
      const prior = researchChangeDefinitions.get(change.key);
      assert(
        !prior || prior.definition === definition,
        `${change.key} conflicts between ${prior?.file} and ${file}.`,
      );
      researchChangeDefinitions.set(change.key, { file, definition });
    }
  }
}
for (const event of bundle.events) {
  const target = `${event.target.releaseVersionId}/${event.target.routeAlias}`;
  assert(
    !targetOwners.has(target),
    `${target} is already owned by ${targetOwners.get(target)}.`,
  );
  for (const change of event.changes) {
    const prior = researchChangeDefinitions.get(change.key);
    if (!prior) continue;
    assert(
      prior.definition ===
        JSON.stringify({
          title: change.title,
          canonicalSummary: change.canonicalSummary,
          category: change.category,
        }),
      `${change.key} conflicts with ${prior.file}.`,
    );
  }
}

const rawJson = `${JSON.stringify(bundle, null, 2)}\n`;
const formattedJson = await prettier.format(rawJson, {
  parser: "json",
  printWidth: 80,
});
const jsonSha = sha256(formattedJson);
const generatorSha = sha256(await readFile(fileURLToPath(import.meta.url)));

const seedRows = seedVersions
  .map((version) => {
    const prereleaseCount = version.milestones.filter(
      (milestone) => milestone.label !== "Public",
    ).length;
    const selectedCount =
      prereleaseCount -
      unsupportedMilestones.filter(
        (milestone) => milestone.platform === version.platform,
      ).length;
    return `| ${version.platform} | ${version.milestones.length} | ${prereleaseCount} | ${selectedCount} | ${prereleaseCount - selectedCount} |`;
  })
  .join("\n");

const markdown = `# Apple 26.4 prerelease archive research batch

## Result

\`apple-26-4-prerelease.json\` enriches four existing prerelease routes whose Apple DocC states are durably bounded by CDX-confirmed raw payload captures.

- The exact seed contains 6 versions, 39 milestones, 6 Public routes, and 33 prerelease routes.
- There are no Public Beta milestones in this cohort.
- 4 prerelease routes are included: iOS Beta 1, iPadOS Beta 1, macOS Beta 1, and macOS Beta 2.
- 29 prerelease routes remain unsupported because no adjacent raw payload boundary isolates their milestone.
- The four event overlays contain 43 documented and confirmed change occurrences.
- 3 archived first-party Apple sources are declared, with Apple retained as original publisher and \`archive\` as the source class.
- No version overlay, Public route, build page, or route creation is included. The four supported event articles were independently approved and published after review.

## Exact seed closure

| Platform | Seed milestones | Prerelease routes | Selected | Unsupported |
| --- | ---: | ---: | ---: | ---: |
${seedRows}
| **Total** | **39** | **33** | **4** | **29** |

Every seed signature is asserted by label, date, order, and revision flag. iOS, iPadOS, and watchOS include a March 5 Beta 3 v2 revision; macOS Beta 3 is dated March 3 while the other tracks use March 2. All Public overlays are already approved in \`scripts/apple-launch-content-2026.json\` and are excluded.

## Archive method

Wayback replay timestamps and raw-payload capture timestamps are not interchangeable. A URL of the form \`/web/<requested-time>id_/...\` can silently return the nearest archived payload even when CDX has no capture at that requested time. Structured changes in this batch therefore use only exact raw JSON timestamps returned by the Internet Archive CDX index.

Reader-facing citations point to archived human Apple Developer pages. The exact raw DocC URLs used for research are listed below for reproducibility. Apple is the original publisher; Internet Archive supplies the timestamped preservation layer. Snapshot prose is paraphrased and Apple issue identifiers are used only as factual locators.

Two attribution types are kept separate:

1. **Initial snapshot state** — the first retained 26.4 raw payload follows Beta 1 and precedes Beta 2, so Beta 1 is the only possible 26.4 milestone. This shows the documented state during Beta 1; it does not prove the exact hour each item first appeared.
2. **Sequential snapshot delta** — two retained raw payloads bracket one and only one milestone. Only the addition found in that diff is assigned to the intervening milestone.

## Exact supported snapshot alignment

### iOS and iPadOS Beta 1

- Seed milestone: Beta 1 on 2026-02-16.
- Same-day human shell: [20260216202312 Apple DocC capture](https://web.archive.org/web/20260216202312/https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-26_4-release-notes).
- Reader-facing evidence: [20260219170414 Apple DocC capture](${archiveEvidence.iosIpadosBeta1.url}).
- Exact raw payload: [20260219063222 Apple DocC JSON](${archiveEvidence.iosIpadosBeta1.rawUrl}).
- Raw title: \`iOS & iPadOS 26.4 Beta Release Notes\`.
- Boundary: captured after Beta 1 and before Beta 2 on February 23; classified as an initial snapshot state.
- Result: 12 structured occurrences for each platform. The shared Apple page is not used to infer tvOS, visionOS, watchOS, or macOS state.

### macOS Beta 1

- Seed milestone: Beta 1 on 2026-02-16.
- Reader-facing evidence: [20260216203520 Apple DocC capture](${archiveEvidence.macosBeta1.url}).
- Exact raw payload: [20260217150536 Apple DocC JSON](${archiveEvidence.macosBeta1.rawUrl}).
- Raw title: \`macOS Tahoe 26.4 Beta Release Notes\`.
- Boundary: captured after Beta 1 and before Beta 2 on February 23; classified as an initial snapshot state.
- Result: 18 structured occurrences.

### macOS Beta 2

- Seed milestone: Beta 2 on 2026-02-23.
- Before-state raw payload: [20260217150536 Apple DocC JSON](${archiveEvidence.macosBeta1.rawUrl}).
- Reader-facing after-state: [20260225122433 Apple DocC capture](${archiveEvidence.macosBeta2.url}).
- Exact after-state raw payload: [20260225122435 Apple DocC JSON](${archiveEvidence.macosBeta2.rawUrl}).
- Raw title: \`macOS Tahoe 26.4 Beta 2 Release Notes\`.
- Boundary: the two raw payloads cross Beta 2 and no other macOS 26.4 milestone.
- Result: one added StoreKit resolved issue; all earlier items remain initial-state material and are not duplicated as Beta 2 deltas.

## Unsupported snapshot alignment

### iOS and iPadOS

| Milestone | Human archive state | Raw-payload result | Decision |
| --- | --- | --- | --- |
| Beta 2 · 2026-02-23 | [20260224205256 shell titled Beta 2](https://web.archive.org/web/20260224205256/https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-26_4-release-notes/) | No CDX-confirmed raw payload near Beta 2 | Unsupported; a replayed older payload cannot prove the Beta 2 note state |
| Beta 3 · 2026-03-02 | [20260302145239 shell titled Beta 3](https://web.archive.org/web/20260302145239/https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-26_4-release-notes) | Raw payload [20260303083220](https://web.archive.org/web/20260303083220id_/https://developer.apple.com/tutorials/data/documentation/ios-ipados-release-notes/ios-ipados-26_4-release-notes.json) exists, but the prior raw payload is Beta 1 | Snapshot state observed, but three apparent additions cannot be assigned across the intervening Beta 2 gap |
| Beta 3 v2 · 2026-03-05 | No aligned human or raw payload | No isolated boundary | Unsupported; no corrective delta is inferred |
| Beta 4 · 2026-03-09 | [20260313112417 shell still titled Beta 3](https://web.archive.org/web/20260313112417/https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-26_4-release-notes) | No contemporaneous raw payload | Unsupported; shell metadata cannot establish item-level state |
| RC · 2026-03-18 | [20260318205246 human shell](https://web.archive.org/web/20260318205246/https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-26_4-release-notes) | Next CDX-confirmed raw payload is after Public on March 25 | Unsupported; later cumulative items are not copied to RC |

The Beta 3 raw snapshot contains observable state changes relative to the Beta 1 payload, including a Feedback status change, expanded RCS test wording, and a StoreKit resolved issue. Because the raw sequence crosses Beta 2, these are recorded only as snapshot-state observations in this ledger and are not emitted as Beta 3 deltas.

### macOS

| Milestone | Archive coverage | Decision |
| --- | --- | --- |
| Beta 3 · 2026-03-03 | No raw payload after Beta 2 and before Beta 4 | Unsupported |
| Beta 4 · 2026-03-09 | Human shell captured 20260316222424, but no contemporaneous raw payload | Unsupported |
| RC · 2026-03-18 | Human shell captured 20260319202028, but the next raw payload is after Public | Unsupported |

### tvOS, visionOS, and watchOS

- tvOS has a human shell capture on 20260320120652, after RC, but its first CDX-confirmed raw 26.4 payload is 20260325182944, after Public.
- visionOS has a human shell capture on 20260314103605, after Beta 4, but its first CDX-confirmed raw payload is 20260325184240, after Public.
- watchOS has no retained prerelease human or raw 26.4 state in the audited CDX results; its first confirmed pair is 20260325184839/40, after Public.
- Consequently, all 16 tvOS, visionOS, and watchOS prerelease routes are unsupported. The March 5 watchOS Beta 3 v2 revision receives no inferred change.

## Structured inventory

The iOS and iPadOS Beta 1 pages each preserve 12 separately labeled items spanning Background Assets, external media, Feedback, Memory Integrity Enforcement, Messages, networking, Reality Composer, StoreKit, SwiftUI, and UIKit.

The macOS Beta 1 page preserves 18 items spanning AppKit, Background Assets, CoreMIDI, external boot and media, Internet Accounts, login, Recovery, networking, resource forks, Rosetta, StoreKit, SwiftUI, and virtualization. Three exact approved Public change identities are reused only because the initial Beta 1 snapshot independently contains the same Network MIDI, Rosetta-notice, and virtual-machine display facts.

The macOS Beta 2 page contains one true sequential delta: the archived Beta 2 payload adds a StoreKit resolved issue for background-launch purchase intents. No cumulative Public item is assigned backward.

## Copyright and attribution method

All titles, summaries, verification notes, and article paragraphs are original synthesis. The manifest does not reproduce Apple's paragraphs, lists, workaround wording, or interface assets. Framework names, API identifiers, platform names, status headings, and issue numbers are factual nominative references. Every occurrence links to an archived human Apple page and carries a section-and-issue locator; the ledger separately exposes the exact raw payload used for verification.

## Closure guards

- Exact comparison against all six local 26.4 seed records, including every date, label, revision flag, and platform-specific Beta 3 date.
- Exact four-route allowlist and explicit exclusion of all six Public routes.
- Approved-launch ownership assertion for all six 26.4 versions and Public events.
- Collision scan across every other research-batch JSON.
- Exact 43-occurrence inventory with unique or approved reusable definitions.
- Reader-facing archive provenance, exact raw URL assertions, and full source/citation closure.
- All four events are \`editoriallyVerified\`, approved at \`${reviewedAt}\`, and \`isIndexable: true\`.
- Deterministic formatted JSON SHA-256: \`${jsonSha}\`.

## Validation

- Repository research validation accepted all 44 current batches and 2,287 globally consistent change keys; this batch contributes 3 sources, 4 events, 43 change occurrences, and 63 citations.
- Focused launch-content ingestion and manifest tests passed 19 of 19.
- ESLint passed for the generator, and Prettier passed for the generator, JSON, and ledger.
- A second generator run reproduced the JSON and ledger byte for byte.
- The reviewed production dry run reported 43 creates, 7 revision-guarded patches, and 2,078 unchanged documents.
- Creates are exactly 3 archived Apple source records and 40 new granular release-change records. There are no version, event, or build creates.
- Four patches enrich the exact existing Beta 1/Beta 2 event routes with article body, changes, citations, review state, and summary. Three citation-only patches add the independent archived Beta 1 evidence to the existing approved Network MIDI, Rosetta notice, and virtual-machine display changes.
- No version, Public event, build, or unsupported prerelease route is patched. No field is unset and no document is deleted.
- Production plan SHA-256: \`594835aed6f04d9c563b592582246368f49d175290b3f70203aafac8d8223ab5\`; mutation payload: 93,010 bytes (2.4% of the guarded limit).
- Serialized plan artifact SHA-256: \`ff9bbc8c08c050cb352ad1c95ddf00031a0d033d1bb9c0890daaae1c8a942fc6\`; rollback artifact SHA-256: \`468ea38acd44dfbded42ce01e6edb3fa6daf6348d340f8d017a173388763e333\`.

## Human approval checklist

- [x] Accepted initial-snapshot attribution for iOS, iPadOS, and macOS Beta 1.
- [x] Accepted the macOS Beta 2 StoreKit item as the only sequentially isolated delta.
- [x] Kept the iOS/iPadOS Beta 3 observations out of structured changes because the raw-payload gap crosses Beta 2.
- [x] Accepted all remaining 29 prerelease routes as unsupported.
- [x] Approved every emitted event for indexing at \`${reviewedAt}\`.

## Production receipt

The primary agent downloaded and independently checked all three exact raw Apple payloads. All 46 issue identifiers cited by emitted changes appeared in their assigned payloads, the two macOS snapshots added only StoreKit issues \`168958783\` and \`FB21767675\`, and no identifier was removed.

- Approved manifest SHA-256: \`${jsonSha}\`
- Generator SHA-256: \`${generatorSha}\`
- Sanity transaction: \`F0eE6eK5XyVXtlnaoy8AeI\`
- Apply receipt SHA-256: \`9f9ecf865628c45ee16d91131132334c93626c8f42bc5a40f2ec2d416f694211\`
- Post-apply zero-plan SHA:
  \`dec0cea498ef2cf180778c03d1972bbd21412a97cc83e4a4caa209c7a97c75c3\`
  with 0 creates, 0 patches, and 2,128 unchanged documents
- Production coverage after apply: 410 of 410 versions have full articles; appearances are 294 full, 266 source-linked, and 1,419 timeline-only; 445 appearances have approved structured changes
- All four local routes rendered their archived-state or sequential-diff article, references, and \`index, follow\` metadata

## Reproduction

\`\`\`bash
node scripts/research-batches/build-apple-26-4-prerelease.mjs
npm run research:validate
node --import tsx --test tests/launch-content-ingestion.test.ts tests/launch-content-manifest.test.ts
npx eslint scripts/research-batches/build-apple-26-4-prerelease.mjs
npx prettier --check scripts/research-batches/build-apple-26-4-prerelease.mjs scripts/research-batches/apple-26-4-prerelease.json scripts/research-batches/apple-26-4-prerelease.md
npx sanity exec scripts/ingest-launch-content.ts --with-user-token -- --content scripts/research-batches/apple-26-4-prerelease.json
\`\`\`

The final command is a dry run only. Do not add \`--apply\` or any approval flags in this research pass.
`;

const formattedMarkdown = await prettier.format(markdown, {
  parser: "markdown",
  printWidth: 80,
  proseWrap: "preserve",
});

await writeFile(jsonPath, formattedJson);
await writeFile(ledgerPath, formattedMarkdown);
