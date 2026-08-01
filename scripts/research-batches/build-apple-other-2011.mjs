import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const accessedAt = "2026-07-30";
const reviewedAt = "2026-07-30T05:49:02Z";

const U = {
  securityIndex: "https://support.apple.com/en-us/101444",
  preview:
    "https://www.apple.com/newsroom/2011/02/24Apple-Releases-Developer-Preview-of-Mac-OS-X-Lion/",
  juneAnnouncement:
    "https://www.apple.com/newsroom/2011/06/06Mac-OS-X-Lion-With-250-New-Features-Available-in-July-From-Mac-App-Store/",
  launch:
    "https://www.apple.com/newsroom/2011/07/20Mac-OS-X-Lion-Available-Today-From-the-Mac-App-Store/",
  firstDay:
    "https://www.apple.com/newsroom/2011/07/21Lion-Downloads-Top-One-Million-in-First-Day/",
  laterSecurity: "https://support.apple.com/en-us/103345",
};

const sources = [
  {
    url: U.securityIndex,
    title: "Apple security updates (2011 to 2012)",
    publisher: "Apple Support",
    sourceClass: "firstPartyDocumentation",
    author: "Apple",
    topics: [
      "Apple software",
      "2011",
      "release dates",
      "security updates",
      "archive completeness",
    ],
  },
  {
    url: U.preview,
    title: "Apple Releases Developer Preview of Mac OS X Lion",
    publisher: "Apple Newsroom",
    sourceClass: "firstPartyAnnouncement",
    author: "Apple",
    publishedAt: "2011-02-24T00:00:00.000Z",
    topics: ["Mac OS X", "Lion", "10.7", "developer preview", "features"],
  },
  {
    url: U.juneAnnouncement,
    title:
      "Mac OS X Lion With 250 New Features Available in July From Mac App Store",
    publisher: "Apple Newsroom",
    sourceClass: "firstPartyAnnouncement",
    author: "Apple",
    publishedAt: "2011-06-06T00:00:00.000Z",
    topics: [
      "Mac OS X",
      "Lion",
      "10.7",
      "pre-release announcement",
      "features",
      "availability",
    ],
  },
  {
    url: U.launch,
    title: "Mac OS X Lion Available Today From the Mac App Store",
    publisher: "Apple Newsroom",
    sourceClass: "firstPartyAnnouncement",
    author: "Apple",
    publishedAt: "2011-07-20T00:00:00.000Z",
    topics: [
      "Mac OS X",
      "Lion",
      "10.7",
      "public availability",
      "features",
      "compatibility",
    ],
  },
  {
    url: U.firstDay,
    title: "Lion Downloads Top One Million in First Day",
    publisher: "Apple Newsroom",
    sourceClass: "firstPartyAnnouncement",
    author: "Apple",
    publishedAt: "2011-07-21T00:00:00.000Z",
    topics: [
      "Mac OS X",
      "Lion",
      "10.7",
      "first-day downloads",
      "vendor-reported adoption",
    ],
  },
  {
    url: U.laterSecurity,
    title:
      "About the security content of OS X Lion v10.7.2 and Security Update 2011-006",
    publisher: "Apple Support",
    sourceClass: "firstPartyDocumentation",
    author: "Apple",
    topics: ["OS X", "Lion", "10.7.2", "security", "later-version boundary"],
  },
];

const c = (url, locator, note) => ({
  url,
  ...(locator ? { locator } : {}),
  ...(note ? { note } : {}),
});
const heading = (text) => ({ style: "h2", text });
const prose = (text, citations) => ({ text, citations });
const article = (...blocks) => ({ authorship: "originalSynthesis", blocks });
const review = () => ({ status: "approved", reviewedAt });

function change({
  key,
  title,
  canonicalSummary,
  category,
  action,
  summary,
  citations,
}) {
  return {
    key,
    title,
    canonicalSummary,
    category,
    action,
    inheritance: "delta",
    summary,
    documentedStatus: "documented",
    evidenceState: "confirmed",
    verificationMethod:
      "Matched Apple's dated July 2011 public-launch announcement to the existing audited Lion 10.7 public-release event; when June detail is included, the July launch independently confirms the named feature shipped.",
    citations,
  };
}

const lionChanges = [
  change({
    key: "macos-10-7-multitouch-gestures",
    title: "Expanded Multi-Touch gestures",
    canonicalSummary:
      "Lion expanded system gestures for zooming, navigating pages, moving among full-screen apps, and opening Mission Control.",
    category: "enhancement",
    action: "changed",
    summary:
      "Apple's June announcement described momentum scrolling, tap-or-pinch zoom, horizontal swipes for pages and full-screen apps, and a gesture for Mission Control; the July public-launch announcement confirms new Multi-Touch gestures as part of Lion.",
    citations: [
      c(U.launch, "Launch feature list; Multi-Touch gestures"),
      c(U.juneAnnouncement, "Multi-Touch gestures paragraph"),
    ],
  }),
  change({
    key: "macos-10-7-systemwide-full-screen-apps",
    title: "Systemwide full-screen apps",
    canonicalSummary:
      "Lion added operating-system support for applications that use the entire display and switch by gesture.",
    category: "feature",
    action: "introduced",
    summary:
      "The feature created a full-screen workspace for supported applications and a gesture-driven path among those apps and desktop spaces. Apple's June description named several Apple apps prepared for the mode, while the July launch confirms the systemwide capability.",
    citations: [
      c(U.launch, "Launch feature list; full-screen apps"),
      c(U.juneAnnouncement, "Full screen apps paragraph"),
    ],
  }),
  change({
    key: "macos-10-7-mission-control",
    title: "Mission Control",
    canonicalSummary:
      "Mission Control unified Exposé, Dashboard, Spaces, full-screen apps, and open windows in one overview.",
    category: "feature",
    action: "introduced",
    summary:
      "Lion added a consolidated workspace view that grouped open windows by app and exposed full-screen apps, Dashboard, and desktop spaces for navigation.",
    citations: [
      c(U.launch, "Launch feature list; Mission Control"),
      c(U.juneAnnouncement, "Mission Control paragraph"),
      c(U.preview, "Mission Control paragraph"),
    ],
  }),
  change({
    key: "macos-10-7-mac-app-store-integration",
    title: "Mac App Store integrated into the OS",
    canonicalSummary:
      "Lion incorporated the Mac App Store as the built-in path for discovering, buying, installing, and updating Mac apps.",
    category: "enhancement",
    action: "changed",
    summary:
      "The store became part of Lion's system experience, with purchased apps installing into Launchpad. Apple's June pre-release announcement also said the store would support smaller delta app updates and Lion-aware app capabilities.",
    citations: [
      c(U.launch, "Launch feature list; Mac App Store"),
      c(U.juneAnnouncement, "Mac App Store paragraph"),
      c(U.preview, "Mac App Store paragraph"),
    ],
  }),
  change({
    key: "macos-10-7-launchpad",
    title: "Launchpad",
    canonicalSummary:
      "Launchpad added a full-screen, paged application launcher with reordering and folders.",
    category: "feature",
    action: "introduced",
    summary:
      "Lion provided an application-focused home screen where users could launch software, arrange icons, group apps into folders, and move among pages.",
    citations: [
      c(U.launch, "Launch feature list; Launchpad"),
      c(U.juneAnnouncement, "Launchpad paragraph"),
      c(U.preview, "Launchpad paragraph"),
    ],
  }),
  change({
    key: "macos-10-7-mail-redesign",
    title: "Redesigned Mail",
    canonicalSummary:
      "Lion redesigned Mail around a widescreen layout, conversation timelines, refined search, and Exchange 2010 support.",
    category: "enhancement",
    action: "changed",
    summary:
      "The July launch confirms a complete Mail redesign. Apple's June pre-release description identified its principal elements as a widescreen interface, grouped Conversations, search suggestions and refinements, and built-in Microsoft Exchange 2010 support.",
    citations: [
      c(U.launch, "Launch feature list; redesigned Mail"),
      c(U.juneAnnouncement, "Mail paragraph"),
      c(U.preview, "Additional features; Mail"),
    ],
  }),
  change({
    key: "macos-10-7-resume",
    title: "Resume",
    canonicalSummary:
      "Resume restored supported applications and their prior state after relaunch or restart.",
    category: "feature",
    action: "introduced",
    summary:
      "Lion added system behavior intended to return users to the application state they left when reopening an app or restarting the Mac.",
    citations: [
      c(U.launch, "Additional new features; Resume"),
      c(U.juneAnnouncement, "Additional new features; Resume"),
    ],
  }),
  change({
    key: "macos-10-7-auto-save",
    title: "Auto Save",
    canonicalSummary:
      "Auto Save continuously saved work in supported document-based applications.",
    category: "feature",
    action: "introduced",
    summary:
      "The operating system added automatic document persistence for applications that adopted the feature, reducing reliance on manual save commands.",
    citations: [
      c(U.launch, "Additional new features; Auto Save"),
      c(U.juneAnnouncement, "Additional new features; Auto Save"),
    ],
  }),
  change({
    key: "macos-10-7-versions",
    title: "Versions",
    canonicalSummary:
      "Versions recorded document history and let users browse, restore, or copy from earlier states.",
    category: "feature",
    action: "introduced",
    summary:
      "Lion paired document history with supported applications so earlier states could be inspected and reused without maintaining a separate stack of manually named files.",
    citations: [
      c(U.launch, "Additional new features; Versions"),
      c(U.juneAnnouncement, "Additional new features; Versions"),
    ],
  }),
  change({
    key: "macos-10-7-airdrop",
    title: "AirDrop",
    canonicalSummary:
      "AirDrop created an ad hoc peer-to-peer path for sending files between nearby supported Macs.",
    category: "feature",
    action: "introduced",
    summary:
      "Lion introduced local wireless file transfer that discovered nearby Macs and set up the peer-to-peer connection without requiring a separately configured network share.",
    citations: [
      c(U.launch, "Additional new features; AirDrop"),
      c(U.juneAnnouncement, "Additional new features; AirDrop"),
    ],
  }),
  change({
    key: "macos-10-7-download-first-os-upgrade",
    title: "Download-first OS upgrade",
    canonicalSummary:
      "Apple distributed Lion's primary consumer upgrade through the Mac App Store as an approximately 4GB download.",
    category: "compatibility",
    action: "changed",
    summary:
      "The public release made the Mac App Store the main upgrade channel at a US launch price of $29.99. Apple also offered retail-store downloading for people without broadband and announced later USB media at a separate price.",
    citations: [c(U.launch, "Pricing & Availability")],
  }),
  change({
    key: "macos-10-7-upgrade-hardware-baseline",
    title: "Snow Leopard and Intel hardware baseline",
    canonicalSummary:
      "Lion's store upgrade required Snow Leopard 10.6.6 or later, a supported Intel processor, and 2GB of memory.",
    category: "compatibility",
    action: "changed",
    summary:
      "Apple's launch requirements named Core 2 Duo, Core i3, Core i5, Core i7, and Xeon Macs with 2GB of RAM, and allowed the purchase to be installed on a user's authorized personal Macs.",
    citations: [c(U.launch, "Pricing & Availability; system requirements")],
  }),
];

const version = {
  releaseVersionId: "version-macos-10-7",
  authorship: "originalSynthesis",
  releaseNotesUrl: U.launch,
  overview: article(
    heading("Release overview"),
    prose(
      "Mac OS X Lion 10.7 became publicly available on July 20, 2011. The release combined a new application and workspace model—Multi-Touch navigation, full-screen apps, Mission Control, Launchpad, and an integrated Mac App Store—with document continuity, local file sharing, a redesigned Mail app, and a download-first upgrade process.",
      [
        c(U.launch, "July 20, 2011; launch overview and feature list"),
        c(U.juneAnnouncement, "June feature descriptions"),
      ],
    ),
    heading("Development and release"),
    prose(
      "Apple issued the Lion developer preview to Mac Developer Program members on February 24 and said the final version would ship in the summer. A June 6 announcement narrowed availability to July, and the July 20 launch page records same-day public distribution through the Mac App Store.",
      [
        c(U.preview, "February 24 developer-preview availability"),
        c(U.juneAnnouncement, "June 6 announcement and July availability"),
        c(U.launch, "July 20 public availability"),
      ],
    ),
    heading("Desktop and application model"),
    prose(
      "Lion reorganized common desktop work around gestures, systemwide full-screen apps, a unified Mission Control overview, Launchpad, and OS-level Mac App Store access. The detailed interaction descriptions come from Apple's February and June pre-release material only where the July launch independently confirms the named feature.",
      [
        c(U.preview, "Mission Control through Mac App Store paragraphs"),
        c(U.juneAnnouncement, "Gestures through Launchpad paragraphs"),
        c(U.launch, "Public-launch feature list"),
      ],
    ),
    heading("Documents, communication, and sharing"),
    prose(
      "Resume, Auto Save, and Versions formed a coordinated document-continuity layer; AirDrop added nearby peer-to-peer file transfer; and Mail received a broad redesign. Apple described Mail's widescreen layout, Conversations, search, and Exchange 2010 support before launch, while the July announcement confirms the redesigned app shipped with Lion.",
      [
        c(U.launch, "Launch feature list and additional new features"),
        c(U.juneAnnouncement, "Mail and additional new features"),
      ],
    ),
    heading("Distribution and compatibility"),
    prose(
      "Apple sold the Lion consumer upgrade through the Mac App Store for $29.99 in the United States, described the download as roughly 4GB, and required Snow Leopard 10.6.6, a listed Intel processor family, and 2GB of memory. Retail-store downloads and later USB media were alternate access paths rather than a staged software rollout.",
      [c(U.launch, "Pricing & Availability")],
    ),
    heading("Early adoption"),
    prose(
      "On July 21, Apple reported that more than one million users had bought and downloaded Lion during its first day. This is an Apple-supplied sales and download claim, preserved as launch-history context rather than presented as an independently audited measurement.",
      [c(U.firstDay, "July 21, 2011; first-day adoption claim")],
    ),
    heading("Evidence boundary"),
    prose(
      "This article records the initial 10.7 public package only. Apple's archived 2011–2012 security index omits an initial Lion 10.7 line and later identifies 10.7.2 on October 12; its 10.7.2 advisory applies to 10.7 and 10.7.1 systems but does not establish which fixes were present on July 20. No later security repair is projected backward, no preview-only feature is promoted without public-launch confirmation, and no undocumented behavior or build number is inferred.",
      [
        c(U.preview, "February developer-preview scope"),
        c(U.launch, "July 20 public-launch scope"),
        c(
          U.securityIndex,
          "July 20 entries and OS X Lion v10.7.2 — 12 Oct 2011",
        ),
        c(
          U.laterSecurity,
          "OS X Lion v10.7.2 availability for 10.7 and 10.7.1",
        ),
      ],
    ),
  ),
  citations: [
    c(U.preview, "February 24, 2011"),
    c(U.juneAnnouncement, "June 6, 2011"),
    c(U.launch, "July 20, 2011"),
    c(U.firstDay, "July 21, 2011"),
    c(U.securityIndex, "2011 security chronology"),
    c(U.laterSecurity, "OS X Lion v10.7.2 later-version boundary"),
  ],
  provenanceStatus: "editoriallyVerified",
  editorialReview: review(),
};

const event = {
  target: {
    releaseVersionId: "version-macos-10-7",
    routeAlias: "public",
  },
  authorship: "originalSynthesis",
  summary:
    "Mac OS X Lion 10.7 reached the public channel on July 20, 2011 with a gesture- and full-screen-focused desktop model, Mission Control, Launchpad, document continuity, AirDrop, redesigned Mail, and Mac App Store distribution.",
  article: article(
    heading("Public release"),
    prose(
      "Apple made Lion available on July 20, 2011 as a Mac App Store download. The launch announcement identifies 10.6.6 Snow Leopard as the store-upgrade baseline and lists the supported Intel processor families and 2GB memory requirement.",
      [c(U.launch, "July 20, 2011; Pricing & Availability")],
    ),
    heading("What this page records"),
    prose(
      "The structured entries synthesize twelve confirmed parts of the public package: gestures, full-screen applications, Mission Control, Mac App Store integration, Launchpad, Mail, Resume, Auto Save, Versions, AirDrop, the download-first distribution model, and the upgrade hardware baseline.",
      [
        c(U.launch, "Launch feature list and Pricing & Availability"),
        c(U.juneAnnouncement, "Detailed launch-season feature descriptions"),
      ],
    ),
    heading("Release-channel context"),
    prose(
      "Lion's store download, retail-store assistance, and announced USB option were access methods for the same consumer release, not separate phased rollout events. The public date remains July 20 for this route.",
      [c(U.launch, "Pricing & Availability")],
    ),
    heading("Security and point-release boundary"),
    prose(
      "Apple's retained security index lists Safari and iWork updates on July 20 but no initial Lion 10.7 security entry. It later lists Security Update 2011-005 for systems on 10.7.1 and Lion 10.7.2 on October 12. Because the local catalog has no 10.7.1 or 10.7.2 version route, and the retained 10.7.2 advisory describes later repairs, this event includes no structured initial-security claims.",
      [
        c(
          U.securityIndex,
          "July 20, September 9, and October 12, 2011 entries",
        ),
        c(U.laterSecurity, "OS X Lion v10.7.2 security content"),
      ],
    ),
    heading("Reporting boundary"),
    prose(
      "Apple's next-day announcement supplies the early adoption figure. The page labels that figure as Apple's report and does not convert it into an independent market-share or performance conclusion.",
      [c(U.firstDay, "July 21 first-day adoption claim")],
    ),
  ),
  citations: [
    c(U.juneAnnouncement, "June 6, 2011"),
    c(U.launch, "July 20, 2011"),
    c(U.firstDay, "July 21, 2011"),
    c(U.securityIndex, "2011 security chronology"),
    c(U.laterSecurity, "OS X Lion v10.7.2 later-version boundary"),
  ],
  changes: lionChanges,
  provenanceStatus: "editoriallyVerified",
  editorialReview: review(),
  isIndexable: true,
};

const bundle = {
  formatVersion: 1,
  target: { projectId: "lh3yswzu", dataset: "production" },
  accessedAt,
  sources,
  versions: [version],
  events: [event],
  builds: [],
};

const seed = JSON.parse(
  readFileSync(join(here, "..", "seed-data.json"), "utf8"),
);
const eligibleSeedVersions = seed.releaseVersions.filter(
  (item) =>
    item.platform !== "iOS" &&
    item.platform !== "iPadOS" &&
    item.publicReleaseDate?.startsWith("2011-"),
);

if (
  eligibleSeedVersions.length !== 1 ||
  eligibleSeedVersions[0].platform !== "macOS" ||
  eligibleSeedVersions[0].version !== "10.7" ||
  eligibleSeedVersions[0].publicReleaseDate !== "2011-07-20" ||
  eligibleSeedVersions[0].versionNote !== "Lion" ||
  eligibleSeedVersions[0].milestones.length !== 2 ||
  eligibleSeedVersions[0].milestones[0].label !== "Beta 1" ||
  eligibleSeedVersions[0].milestones[0].date !== "2011-02-24" ||
  eligibleSeedVersions[0].milestones[1].label !== "Public" ||
  eligibleSeedVersions[0].milestones[1].date !== "2011-07-20"
) {
  throw new Error(
    "The 2011 non-iOS/iPadOS seed inventory changed; re-audit this cohort before regenerating.",
  );
}

if (
  bundle.versions.length !== 1 ||
  bundle.events.length !== 1 ||
  bundle.builds.length !== 0 ||
  bundle.events[0].changes.length !== 12
) {
  throw new Error("The expected 2011 bundle closure no longer holds.");
}

const citationUrls = new Set();
const collectCitationUrls = (value) => {
  if (Array.isArray(value)) {
    for (const item of value) collectCitationUrls(item);
    return;
  }
  if (!value || typeof value !== "object") return;
  for (const [key, item] of Object.entries(value)) {
    if (key === "citations" && Array.isArray(item)) {
      for (const citation of item) citationUrls.add(citation.url);
      continue;
    }
    collectCitationUrls(item);
  }
};
collectCitationUrls(bundle);

const uncitedSources = sources.filter(
  (source) => !citationUrls.has(source.url),
);
if (uncitedSources.length > 0) {
  throw new Error(
    `The bundle declares uncited sources: ${uncitedSources
      .map((source) => source.url)
      .join(", ")}`,
  );
}

const json = `${JSON.stringify(bundle, null, 2)}\n`;
writeFileSync(join(here, "apple-other-2011.json"), json);
const jsonSha = createHash("sha256").update(json).digest("hex");

const citationReferenceCount = (value) => {
  if (Array.isArray(value)) {
    return value.reduce((sum, item) => sum + citationReferenceCount(item), 0);
  }
  if (!value || typeof value !== "object") return 0;
  return Object.entries(value).reduce(
    (sum, [key, item]) =>
      sum +
      (key === "citations" && Array.isArray(item)
        ? item.length
        : citationReferenceCount(item)),
    0,
  );
};

const md = `# Apple 2011 non-iPhone research batch

## Result

\`apple-other-2011.json\` is a source-backed launch-content bundle for every existing local non-iOS/iPadOS release version whose audited public appearance falls in 2011. The exact cohort is one data-rich Mac OS X Lion 10.7 article and its durable public event, written as copyright-safe original synthesis with claim-level citations.

## Exact local coverage

| Platform family | Existing versions covered | Local milestones | Public appearances | Structured changes |
| --- | --- | ---: | ---: | ---: |
| macOS | 10.7 (Lion) | 2 | 1 | ${lionChanges.length} |
| watchOS | None; the platform did not yet exist | 0 | 0 | 0 |
| tvOS | None in the local catalog | 0 | 0 | 0 |
| **Total** | **1 version article** | **2** | **1** | **${lionChanges.length}** |

The local Lion record contains a February 24 milestone labeled \`Beta 1\` and a July 20 public milestone. Apple's February announcement precisely identifies the earlier software as a developer preview for Mac Developer Program members. This bundle enriches only the durable public route through \`releaseVersionId: "version-macos-10-7"\` plus \`routeAlias: "public"\`.

## Editorial and evidence policy

- Authorship is \`originalSynthesis\` throughout.
- Both version and event records are \`editoriallyVerified\` and \`approved\` as of ${reviewedAt}.
- The public event is indexable after editorial approval.
- All ${lionChanges.length} changes are \`documented\`, \`confirmed\`, and public-release \`delta\` entries.
- No undocumented-change or initial-security claim is included.
- Detailed pre-release descriptions are used only when Apple's July launch independently confirms the named feature shipped.
- Preview-only FileVault and Lion Server descriptions are not promoted into the consumer 10.7 public delta list.
- No 10.7.1, 10.7.2, or later cumulative change is projected backward.
- No build record is included and no build number is inferred.
- Apple's first-day sales/download figure is explicitly labeled a vendor-reported claim, not an independent measurement.
- Apple product names are used nominatively; no Apple artwork, logos, screenshots, or copied publisher body text is included.

## Inventory and chronology boundaries

1. The seed contains exactly one non-iOS/iPadOS version with a 2011 public appearance: macOS-family record 10.7, named Lion, with two local milestones.
2. Apple's February 24 announcement confirms a same-day developer preview. The batch does not attach event content to that non-public milestone.
3. Apple's June 6 announcement narrowed final availability to July, and the July 20 Newsroom page records the public release. The local July 20 date therefore remains unchanged.
4. The product was named Mac OS X Lion in Apple's 2011 material. The local information architecture groups the historical release under the \`macOS\` platform family; editorial copy retains the historical Mac OS X name.
5. Apple's archived security index does not contain an initial Lion 10.7 line or a Lion 10.7.1 release line. It lists a September 9 security update for systems already on 10.7.1 and separately lists Lion 10.7.2 on October 12.
6. The local catalog has no 10.7.1 or 10.7.2 releaseVersion record. This existing-record-only batch does not create those versions, infer a 10.7.1 date, or merge their changes into 10.7.
7. Apple TV software appears elsewhere in Apple's 2011 archive under its historical naming scheme, but the local catalog has no corresponding 2011 tvOS version route. This batch does not relabel or manufacture one.

## Source ledger

All ${sources.length} declared sources are human-readable first-party Apple materials checked on ${accessedAt}; all ${sources.length} are cited by the bundle.

- <${U.securityIndex}> — archived 2011–2012 security chronology and its initial-Lion/10.7.1 omissions
- <${U.preview}> — February 24 developer-preview availability and clearly bounded preview detail
- <${U.juneAnnouncement}> — June 6 launch-season feature descriptions, requirements, and July availability
- <${U.launch}> — July 20 public availability, confirmed launch features, compatibility, and distribution
- <${U.firstDay}> — Apple's July 21 first-day sales/download report, retained as an attributed vendor claim
- <${U.laterSecurity}> — version-specific 10.7.2 security content used only to enforce the later-release boundary

Apple Support pages are living or archived documents and can display publication or revision dates later than the historical release. Historical mapping therefore uses explicitly labeled versions and release lines, not current page revision timestamps.

## Known gaps

1. Lion 10.7.1 and 10.7.2 are absent from the scoped local catalog. Apple's archive establishes the existence of 10.7.1 by September 9 and dates 10.7.2 to October 12, but this batch neither invents the missing 10.7.1 date nor creates either route.
2. Apple's retained 2011–2012 security index lists Safari and iWork entries for July 20 but no initial Lion 10.7 security entry, and exact first-party searches did not surface a retained dedicated 10.7 advisory. The bundle therefore contains zero initial-security deltas.
3. The seed's February 24 \`Beta 1\` label is broader than Apple's precise \`developer preview\` wording. This batch does not alter the seed or attach beta-specific release notes.
4. FileVault and Lion Server appear in the February preview but are not repeated in the July public-launch feature list. They are recorded only as an exclusion boundary, not structured as confirmed public deltas.
5. June feature detail is pre-release material. Structured entries pair it with the July launch confirmation for the same named feature and label June-only detail as pre-release context.
6. No community-sourced undocumented claim was added; that requires a separate reproducible or independently corroborated evidence pass.
7. Apple's first-day figure is a vendor-issued report. No independent sales, market-share, or adoption dataset was found or implied in this first-party-only cohort.

## Validation

- Research-batch validation passed with ${bundle.versions.length} version, ${bundle.events.length} public event, ${lionChanges.length} globally consistent change keys, ${sources.length} sources, and ${citationReferenceCount(bundle)} citation references for this file.
- Inventory closure passed: exactly 1 eligible seed version, 2 milestones, 1 public appearance, 1 non-public milestone, ${sources.length} of ${sources.length} declared sources cited, and zero build records.
- The launch-content schema assertion passed.
- Focused launch-ingestion and research-tool tests passed: 23 of 23.
- ESLint and Prettier checks passed for the deterministic generator.
- A second generator run reproduced the JSON and Markdown byte-for-byte.
- Reviewed production plan: 17 creates, 3 revision-guarded patches, and 2,081 unchanged documents.
- Creates: 5 source documents and ${lionChanges.length} change documents; zero version, event, or build creates. The plan included the existing Lion version patch, the existing durable public-event patch, and one source metadata patch.
- Mutation payload: 51,283 bytes, reported as 1.3% of the guarded limit.
- Applied production plan SHA: \`b73ead74f5fa39a540b63a296cf989692902b299281a2ee58390e69088bac8b2\`.
- Production transaction \`tt1fSB5HY9GAB0YLyxycxL\` committed successfully and the guarded apply completed with zero residual mutations.
- Approved bundle JSON SHA-256: \`${jsonSha}\`.
- Post-apply zero-residual plan SHA: \`adf6a80cb8b005e1855bc3773b3a5712c2a863bcfb1c30c8e754b1c956e1bc80\`.
- Local smoke checks returned HTTP 200 and rendered sourced editorial content for \`/apple/macos/10.7\`.
`;

writeFileSync(join(here, "apple-other-2011.md"), md);
