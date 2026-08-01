import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const accessedAt = "2026-07-30";
const reviewedAt = "2026-07-30T05:22:32Z";

const U = {
  securityIndex: "https://support.apple.com/en-us/103178",
  macNews:
    "https://www.apple.com/newsroom/2017/09/macos-high-sierra-now-available-as-a-free-update/",
  macSecurity: "https://support.apple.com/en-us/103806",
  watch3: "https://support.apple.com/en-us/106644",
  watch4: "https://support.apple.com/en-us/111739",
  watch4Preview:
    "https://www.apple.com/newsroom/2017/06/watchos-4-brings-more-intelligence-and-fitness-features-to-apple-watch/",
  watch313Security: "https://support.apple.com/en-us/103531",
  watch32Security: "https://support.apple.com/en-us/103532",
  watch322Security: "https://support.apple.com/en-us/103534",
  watch323Security: "https://support.apple.com/en-us/103535",
  watch4Security: "https://support.apple.com/en-us/103678",
  watch41Security: "https://support.apple.com/en-us/103540",
  watch42Security: "https://support.apple.com/en-us/103682",
  tvUpdates: "https://support.apple.com/en-us/106336",
  tv4kNews:
    "https://www.apple.com/newsroom/2017/09/apple-tv-4k-brings-home-the-magic-of-cinema-with-4k-and-hdr/",
  tv102Security: "https://support.apple.com/en-us/103074",
  tv1021Security: "https://support.apple.com/en-us/103451",
  tv1022Security: "https://support.apple.com/en-us/103457",
  tv11Security: "https://support.apple.com/en-us/103568",
  tv111Security: "https://support.apple.com/en-us/103467",
  tv112Security: "https://support.apple.com/en-us/103683",
};

const datedSecuritySources = [
  [
    U.macSecurity,
    "About the security content of macOS High Sierra 10.13",
    "2017-09-25",
    ["macOS", "High Sierra", "10.13"],
  ],
  [
    U.watch313Security,
    "About the security content of watchOS 3.1.3",
    "2017-01-23",
    ["watchOS", "3.1.3"],
  ],
  [
    U.watch32Security,
    "About the security content of watchOS 3.2",
    "2017-03-27",
    ["watchOS", "3.2"],
  ],
  [
    U.watch322Security,
    "About the security content of watchOS 3.2.2",
    "2017-05-15",
    ["watchOS", "3.2.2"],
  ],
  [
    U.watch323Security,
    "About the security content of watchOS 3.2.3",
    "2017-07-19",
    ["watchOS", "3.2.3"],
  ],
  [
    U.watch4Security,
    "About the security content of watchOS 4",
    "2017-09-19",
    ["watchOS", "4.0"],
  ],
  [
    U.watch41Security,
    "About the security content of watchOS 4.1",
    "2017-10-31",
    ["watchOS", "4.1"],
  ],
  [
    U.watch42Security,
    "About the security content of watchOS 4.2",
    "2017-12-05",
    ["watchOS", "4.2"],
  ],
  [
    U.tv102Security,
    "About the security content of tvOS 10.2",
    "2017-03-27",
    ["tvOS", "10.2"],
  ],
  [
    U.tv1021Security,
    "About the security content of tvOS 10.2.1",
    "2017-05-15",
    ["tvOS", "10.2.1"],
  ],
  [
    U.tv1022Security,
    "About the security content of tvOS 10.2.2",
    "2017-07-19",
    ["tvOS", "10.2.2"],
  ],
  [
    U.tv11Security,
    "About the security content of tvOS 11",
    "2017-09-19",
    ["tvOS", "11.0"],
  ],
  [
    U.tv111Security,
    "About the security content of tvOS 11.1",
    "2017-10-31",
    ["tvOS", "11.1"],
  ],
  [
    U.tv112Security,
    "About the security content of tvOS 11.2",
    "2017-12-04",
    ["tvOS", "11.2"],
  ],
];

const sources = [
  {
    url: U.securityIndex,
    title: "Apple security updates (2016 to 2017)",
    publisher: "Apple Support",
    sourceClass: "firstPartyDocumentation",
    author: "Apple",
    publishedAt: "2023-11-06T00:00:00.000Z",
    topics: ["Apple software", "2017", "security release index"],
  },
  {
    url: U.macNews,
    title: "macOS High Sierra now available as a free update",
    publisher: "Apple Newsroom",
    sourceClass: "firstPartyAnnouncement",
    author: "Apple",
    publishedAt: "2017-09-25T00:00:00.000Z",
    topics: ["macOS", "High Sierra", "10.13", "availability", "features"],
  },
  {
    url: U.watch3,
    title: "About watchOS 3 Updates",
    publisher: "Apple Support",
    sourceClass: "firstPartyDocumentation",
    author: "Apple",
    topics: ["watchOS", "3", "consumer release notes"],
  },
  {
    url: U.watch4,
    title: "About watchOS 4 Updates",
    publisher: "Apple Support",
    sourceClass: "firstPartyDocumentation",
    author: "Apple",
    topics: ["watchOS", "4", "consumer release notes"],
  },
  {
    url: U.watch4Preview,
    title:
      "watchOS 4 brings more intelligence and fitness features to Apple Watch",
    publisher: "Apple Newsroom",
    sourceClass: "firstPartyAnnouncement",
    author: "Apple",
    publishedAt: "2017-06-05T00:00:00.000Z",
    topics: ["watchOS", "4", "features", "compatibility"],
  },
  {
    url: U.tvUpdates,
    title: "About Apple TV 4K and Apple TV HD software updates",
    publisher: "Apple Support",
    sourceClass: "firstPartyDocumentation",
    author: "Apple",
    topics: ["tvOS", "Apple TV", "consumer release notes"],
  },
  {
    url: U.tv4kNews,
    title: "Apple TV 4K brings home the magic of cinema with 4K and HDR",
    publisher: "Apple Newsroom",
    sourceClass: "firstPartyAnnouncement",
    author: "Apple",
    publishedAt: "2017-09-12T00:00:00.000Z",
    topics: ["tvOS", "Apple TV 4K", "4K", "HDR", "features"],
  },
  ...datedSecuritySources.map(([url, title, date, topics]) => ({
    url,
    title,
    publisher: "Apple Support",
    sourceClass: "firstPartyDocumentation",
    author: "Apple",
    publishedAt: `${date}T00:00:00.000Z`,
    topics: [...topics, "security", "CVE"],
  })),
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
      "Matched Apple's version-specific consumer notes, availability announcement, or security advisory to the existing audited public-release event.",
    citations,
  };
}

function securityChange({
  key,
  title,
  canonicalSummary,
  summary,
  url,
  locator,
}) {
  return change({
    key,
    title,
    canonicalSummary,
    category: "security",
    action: "fixed",
    summary,
    citations: [c(url, locator)],
  });
}

function release({
  id,
  releaseNotesUrl,
  overview,
  overviewCitations,
  boundary,
  boundaryCitations,
  pageCitations,
  summary,
  publicText,
  publicCitations,
  scopeText,
  scopeCitations,
  changes,
}) {
  return {
    version: {
      releaseVersionId: id,
      authorship: "originalSynthesis",
      releaseNotesUrl,
      overview: article(
        heading("Release overview"),
        prose(overview, overviewCitations),
        heading("Evidence boundary"),
        prose(boundary, boundaryCitations),
      ),
      citations: pageCitations,
      provenanceStatus: "editoriallyVerified",
      editorialReview: review(),
    },
    event: {
      target: { releaseVersionId: id, routeAlias: "public" },
      authorship: "originalSynthesis",
      summary,
      article: article(
        heading("Public release"),
        prose(publicText, publicCitations),
        heading("Documented scope"),
        prose(scopeText, scopeCitations),
      ),
      citations: pageCitations,
      changes,
      provenanceStatus: "editoriallyVerified",
      editorialReview: review(),
      isIndexable: true,
    },
  };
}

const records = [
  release({
    id: "version-macos-10-13",
    releaseNotesUrl: U.macNews,
    overview:
      "macOS High Sierra 10.13 became publicly available on September 25, 2017. The release paired foundational storage, video, graphics, machine-learning, and virtual-reality technologies with substantial Photos, Safari, Siri, Touch Bar, Notes, Spotlight, and security work.",
    overviewCitations: [
      c(U.macNews, "September 25, 2017 availability; New features"),
      c(U.macSecurity, "Released September 25, 2017"),
      c(U.securityIndex, "macOS High Sierra 10.13 — 25 Sep 2017"),
    ],
    boundary:
      "This article describes the initial 10.13 release only. Apple's current security page notes that newly downloaded 10.13 installers can include the later Supplemental Update, so fixes first shipped on October 5 are not treated as September 25 launch changes.",
    boundaryCitations: [
      c(U.macSecurity, "macOS High Sierra 10.13; current-download note"),
      c(
        U.securityIndex,
        "macOS High Sierra 10.13 Supplemental Update — 5 Oct 2017",
      ),
    ],
    pageCitations: [
      c(U.macNews, "September 25, 2017; Pricing and Availability"),
      c(U.macSecurity, "Released September 25, 2017"),
      c(U.securityIndex, "macOS High Sierra 10.13 — 25 Sep 2017"),
    ],
    summary:
      "macOS High Sierra 10.13 reached the public channel on September 25, 2017 with new storage, media, graphics, machine-learning, virtual-reality, app, browser, productivity, and security capabilities.",
    publicText:
      "Apple made macOS High Sierra available from the Mac App Store as a free update on September 25, 2017. Apple said it supported Macs introduced in late 2009 or later, with feature availability varying by hardware, region, and language.",
    publicCitations: [
      c(U.macNews, "Pricing and Availability"),
      c(U.securityIndex, "macOS High Sierra 10.13 — 25 Sep 2017"),
    ],
    scopeText:
      "The structured entries synthesize Apple's launch announcement and version-specific security record. Hardware qualifications remain attached, and later 10.13 Supplemental Update or point-release deltas are excluded.",
    scopeCitations: [
      c(U.macNews, "New features in macOS High Sierra"),
      c(U.macSecurity, "macOS High Sierra 10.13 security content"),
      c(
        U.securityIndex,
        "10.13 launch, Supplemental Update, 10.13.1, and 10.13.2 entries",
      ),
    ],
    changes: [
      change({
        key: "macos-10-13-apfs",
        title: "Apple File System on all-flash internal storage",
        canonicalSummary:
          "High Sierra adopted APFS for Macs with all-flash internal storage, emphasizing faster common operations, integrity, security, and reliability.",
        category: "feature",
        action: "introduced",
        summary:
          "The new storage architecture made operations such as copying files and directories nearly instantaneous and added protections against power-loss or crash-related corruption. Fusion Drive and hard-drive support was deferred.",
        citations: [c(U.macNews, "Apple File System (APFS)")],
      }),
      change({
        key: "macos-10-13-hevc",
        title: "HEVC video support",
        canonicalSummary:
          "High Sierra added HEVC decoding and encoding support for more efficient 4K video storage, streaming, and playback.",
        category: "feature",
        action: "introduced",
        summary:
          "Apple described HEVC as reducing storage requirements relative to H.264 while enabling higher-quality streaming; hardware acceleration depended on newer Mac hardware.",
        citations: [
          c(U.macNews, "High-Efficiency Video Coding (HEVC) Support"),
        ],
      }),
      change({
        key: "macos-10-13-metal-2-egpu",
        title: "Metal 2 and external GPU foundations",
        canonicalSummary:
          "Metal 2 expanded the Mac graphics platform with a refined API, performance work, machine-learning support, and external-GPU access over Thunderbolt 3.",
        category: "developerApi",
        action: "changed",
        summary:
          "The release advanced Apple's GPU framework and established a path for demanding workflows to use external graphics hardware on supported Macs.",
        citations: [c(U.macNews, "Metal 2")],
      }),
      change({
        key: "macos-10-13-core-ml",
        title: "Core ML framework",
        canonicalSummary:
          "Core ML gave Mac developers a system framework for on-device machine-learning models.",
        category: "developerApi",
        action: "introduced",
        summary:
          "The framework used Metal and Accelerate for computer vision, natural-language, and neural-network workloads while keeping inference processing on the device.",
        citations: [c(U.macNews, "Core ML")],
      }),
      change({
        key: "macos-10-13-vr-content-creation",
        title: "Virtual-reality content creation",
        canonicalSummary:
          "High Sierra added the Mac platform's first official support for creating immersive gaming, 3D, and virtual-reality content.",
        category: "developerApi",
        action: "introduced",
        summary:
          "Apple established VR authoring support and described ecosystem work with Valve, Unity, Epic, and professional video tools, while identifying some integrations as later arrivals.",
        citations: [c(U.macNews, "Virtual Reality Support")],
      }),
      change({
        key: "macos-10-13-photos-organization-editing",
        title: "Photos organization and editing redesign",
        canonicalSummary:
          "Photos gained a persistent sidebar, stronger filtering and selection, a refreshed editor, Curves, and Selective Color.",
        category: "enhancement",
        action: "changed",
        summary:
          "The app's interface and editing workflow were expanded to make library navigation more direct and to support finer tonal and color adjustments.",
        citations: [c(U.macNews, "Photos Update")],
      }),
      change({
        key: "macos-10-13-photos-live-and-extensions",
        title: "Live Photos editing and third-party project extensions",
        canonicalSummary:
          "Photos added Live Photo effects and key-frame selection, round-trip editing in external apps, and project extensions for publishing services.",
        category: "feature",
        action: "introduced",
        summary:
          "Users could apply Loop, Bounce, or Long Exposure effects, choose a different key image, edit through supported third-party tools, and create printed or published projects from Photos.",
        citations: [c(U.macNews, "Photos Update")],
      }),
      change({
        key: "macos-10-13-safari-autoplay-reader",
        title: "Safari autoplay controls and automatic Reader",
        canonicalSummary:
          "Safari could stop media with audio from autoplaying and automatically open supported articles in Reader.",
        category: "feature",
        action: "introduced",
        summary:
          "High Sierra gave users more control over disruptive playback and let the browser consistently present compatible articles in a simplified reading view.",
        citations: [c(U.macNews, "Additional app refinements — Safari")],
      }),
      change({
        key: "macos-10-13-intelligent-tracking-prevention",
        title: "Intelligent Tracking Prevention",
        canonicalSummary:
          "Safari introduced Intelligent Tracking Prevention to limit cross-site tracking data.",
        category: "security",
        action: "introduced",
        summary:
          "The browser identified and restricted cookies and related data used to follow users across sites, adding a privacy boundary to ordinary browsing.",
        citations: [c(U.macNews, "Additional app refinements — Safari")],
      }),
      change({
        key: "macos-10-13-siri-music",
        title: "More natural Siri voice and Apple Music knowledge",
        canonicalSummary:
          "Siri on Mac gained a more natural voice plus music-preference learning, playlist creation, and music trivia.",
        category: "enhancement",
        action: "changed",
        summary:
          "The assistant's spoken output and Apple Music interactions were expanded for more personalized playback requests.",
        citations: [c(U.macNews, "Additional app refinements — Siri")],
      }),
      change({
        key: "macos-10-13-touch-bar-controls",
        title: "Expanded Touch Bar controls",
        canonicalSummary:
          "High Sierra added Control Strip choices, a better color picker, and additional video controls to the MacBook Pro Touch Bar.",
        category: "enhancement",
        action: "changed",
        summary:
          "Supported MacBook Pro models gained a broader set of persistent controls and richer editing or playback interactions on the Touch Bar.",
        citations: [c(U.macNews, "Additional app refinements — Touch Bar")],
      }),
      change({
        key: "macos-10-13-notes-tables",
        title: "Tables in Notes",
        canonicalSummary:
          "Notes added simple tables with editable cells and movable rows and columns.",
        category: "feature",
        action: "introduced",
        summary:
          "Users could organize structured information directly in a note without switching to a spreadsheet or separate document.",
        citations: [c(U.macNews, "Additional app refinements — Notes")],
      }),
      change({
        key: "macos-10-13-spotlight-flight-status",
        title: "Flight status in Spotlight",
        canonicalSummary:
          "Spotlight began showing flight schedules, delays, gate and terminal details, and route maps.",
        category: "feature",
        action: "introduced",
        summary:
          "System search could surface a compact operational view of a flight without requiring a separate travel app or web search.",
        citations: [c(U.macNews, "Additional app refinements — Spotlight")],
      }),
      securityChange({
        key: "macos-10-13-security-baseline",
        title: "High Sierra 10.13 security baseline",
        canonicalSummary:
          "The initial High Sierra security record covers authentication, networking, sandboxing, media and document parsing, storage, drivers, the kernel, cryptography, certificates, and web content.",
        summary:
          "Apple's living advisory records broad repairs across local, network, file, graphics, identity, kernel, and browser attack surfaces. Later-added advisory entries are represented as part of Apple's current published record, not as proof of launch-day disclosure.",
        url: U.macSecurity,
        locator:
          "802.1X through WebKit; released September 25, 2017",
      }),
    ],
  }),
];

function finish() {
const releaseOrder = [
  "version-macos-10-13",
  "version-watchos-3-1-3",
  "version-watchos-3-2",
  "version-watchos-3-2-2",
  "version-watchos-3-2-3",
  "version-watchos-4-0",
  "version-watchos-4-1",
  "version-watchos-4-2",
  "version-tvos-10-2",
  "version-tvos-10-2-1",
  "version-tvos-10-2-2",
  "version-tvos-11-0",
  "version-tvos-11-1",
  "version-tvos-11-2",
];
records.sort(
  (left, right) =>
    releaseOrder.indexOf(left.version.releaseVersionId) -
    releaseOrder.indexOf(right.version.releaseVersionId),
);
const versions = records.map((record) => record.version);
const events = records.map((record) => record.event);
const bundle = {
  formatVersion: 1,
  target: { projectId: "lh3yswzu", dataset: "production" },
  accessedAt,
  sources,
  versions,
  events,
  builds: [],
};

writeFileSync(
  join(here, "apple-other-2017.json"),
  `${JSON.stringify(bundle, null, 2)}\n`,
);

const eventChanges = events.reduce(
  (sum, releaseEvent) => sum + releaseEvent.changes.length,
  0,
);
const platformChangeCount = (platform) =>
  events
    .filter((item) =>
      item.target.releaseVersionId.startsWith(`version-${platform}`),
    )
    .reduce((sum, item) => sum + item.changes.length, 0);

function citationReferenceCount(value) {
  if (Array.isArray(value)) {
    return value.reduce((sum, item) => sum + citationReferenceCount(item), 0);
  }
  if (!value || typeof value !== "object") return 0;

  return Object.entries(value).reduce((sum, [key, item]) => {
    if (key === "citations" && Array.isArray(item)) return sum + item.length;
    return sum + citationReferenceCount(item);
  }, 0);
}

const citationReferences = citationReferenceCount(bundle);

const md = `# Apple 2017 non-iPhone research batch

## Result

\`apple-other-2017.json\` is a source-backed launch-content bundle for every existing local non-iOS/iPadOS release version whose audited public appearance falls in calendar 2017. It contains original synthesis with claim-level citations and no copied release-note prose.

## Exact local coverage

| Platform family | Existing versions covered | Public appearances | Structured changes |
| --- | --- | ---: | ---: |
| macOS | 10.13 | 1 | ${platformChangeCount("macos")} |
| watchOS | 3.1.3, 3.2, 3.2.2, 3.2.3, 4.0, 4.1, 4.2 | 7 | ${platformChangeCount("watchos")} |
| tvOS | 10.2, 10.2.1, 10.2.2, 11.0, 11.1, 11.2 | 6 | ${platformChangeCount("tvos")} |
| **Total** | **14 version articles** | **${events.length}** | **${eventChanges}** |

The 14 versions contain 96 existing local timeline milestones: 14 public appearances and 82 beta, release-candidate, golden-master, and related non-public milestones. This bundle enriches only the 14 durable public routes through \`releaseVersionId\` plus \`routeAlias: "public"\`.

## Editorial and evidence policy

- Authorship is \`originalSynthesis\` throughout.
- All 28 version/event records are \`editoriallyVerified\` and \`approved\` as of ${reviewedAt}.
- All public events are indexable after editorial approval.
- Every change is \`documented\`, \`confirmed\`, and a public-release \`delta\`.
- No undocumented-change claim is included.
- No beta notes or later cumulative changes are projected backward.
- No build records are included; no build number is inferred.
- Security changes summarize affected surfaces and remediation classes without reproducing advisory prose.
- Apple product names are used nominatively; no Apple artwork, logos, screenshots, or copied publisher body text is included.

## Inventory and chronology boundaries

1. The 14 local public dates match Apple's version-specific advisory and security-index dates.
2. Apple's current Apple TV consumer history begins at tvOS 11. The local tvOS 10.2, 10.2.1, and 10.2.2 routes therefore contain security-advisory detail without inferred features, stability changes, or ordinary fixes.
3. Apple's watchOS 3 consumer history describes 3.1.3, 3.2.2, and 3.2.3 only as improvements-and-bug-fixes updates. Those broad maintenance entries are kept generic; specific technical claims come from the matching advisories.
4. Apple's High Sierra 10.13 security page now notes that new downloads can include the later Supplemental Update. This batch excludes the October 5 Supplemental Update from the September 25 launch delta.
5. Apple's watchOS 4 preview discussed GymKit and person-to-person payments before launch, but the final version history assigns them to 4.1 and 4.2 respectively. They are not projected backward into 4.0.
6. Apple TV 4K hardware became available September 22, three days after tvOS 11's September 19 public date. The 4K and HDR entry retains its Apple TV 4K hardware qualification.
7. The existing-record-only catalog omits Apple-documented 2017 version identities: macOS 10.13.1 and 10.13.2; watchOS 4.0.1; and tvOS 10.1.1 and 11.2.1. The High Sierra Supplemental Update and Security Update 2017-001 are separately named update packages rather than new semantic-version identities. This batch creates none of them.

## Source ledger

All ${sources.length} declared sources are human-readable first-party Apple pages checked on ${accessedAt}.

### Cross-platform chronology

- <${U.securityIndex}> — Apple's dated 2016–2017 security-release index, including the eligible routes and locally absent point releases

### macOS

- <${U.macNews}> — dated High Sierra availability, compatibility, launch features, and hardware qualifications
- <${U.macSecurity}> — detailed High Sierra 10.13 security content and release date

### watchOS

- <${U.watch3}> — watchOS 3 consumer update notes
- <${U.watch4}> — watchOS 4 consumer update notes and final version boundaries
- <${U.watch4Preview}> — first-party watchOS 4 preview and feature context
- <${U.watch313Security}>
- <${U.watch32Security}>
- <${U.watch322Security}>
- <${U.watch323Security}>
- <${U.watch4Security}>
- <${U.watch41Security}>
- <${U.watch42Security}>

### tvOS

- <${U.tvUpdates}> — retained Apple TV software-update notes beginning at tvOS 11
- <${U.tv4kNews}> — Apple TV 4K feature, qualification, and hardware-availability context
- <${U.tv102Security}>
- <${U.tv1021Security}>
- <${U.tv1022Security}>
- <${U.tv11Security}>
- <${U.tv111Security}>
- <${U.tv112Security}>

Apple Support pages are living documents and may show revision dates later than the historical release. Mapping uses each explicitly labeled version section and advisory release line.

## Known gaps

1. The five Apple-documented 2017 point-version identities absent from the local catalog remain out of scope until a separate inventory expansion creates durable version and event records.
2. No surviving version-labeled consumer narrative was found on Apple's current site for tvOS 10.2, 10.2.1, or 10.2.2; their pages intentionally remain security-specific.
3. Apple's broad ordinary-maintenance statements do not identify individual fixes for watchOS 3.1.3, 3.2.2, or 3.2.3 and therefore are not expanded.
4. No community-sourced undocumented claim was added; that requires a separate reproducible or independently corroborated evidence pass.
5. The 82 non-public milestones remain timeline-only records until beta-specific first-party sources support event-level claims.
6. Security advisories can receive later-added entries. Summaries describe Apple's currently published record for a release, not proof that every advisory entry appeared on launch day.
7. Later High Sierra supplemental, security, and point-release changes are not projected backward to the initial 10.13 event.
8. Regional, hardware, subscription, and service qualifications remain attached to Apple Pay Cash, music streaming, fitness, 4K/HDR, Apple TV app, sports, and playback-matching claims.

## Validation

- Research-batch validation passed with ${versions.length} versions, ${events.length} public events, ${eventChanges} globally consistent change keys, ${sources.length} sources, and ${citationReferences} citation references for this file.
- Inventory closure passed: 14 eligible local versions, 96 milestones, 14 public appearances, 82 non-public milestones, ${sources.length} of ${sources.length} declared sources cited, and zero build records.
- Focused launch-ingestion and research-tool tests passed: 19 of 19.
- ESLint passed for the deterministic generator.
- A second generator run reproduced the JSON byte-for-byte.
- Reviewed production plan: 107 creates, 29 revision-guarded patches, and 2,070 unchanged documents.
- Creates: 18 source documents and 89 change documents; zero version, event, or build creates. The plan included 14 version patches and 14 existing durable public-event patches.
- Mutation payload: 253,779 bytes, reported as 6.5% of the guarded limit.
- Applied production plan SHA: \`e6421d989983e1ef94925f607d12f16d1180f7ee9fd0d337fb416143c505ffbd\`.
- Production transaction \`F0eE6eK5XyVXtlnaoxwzIe\` committed successfully and the guarded apply completed with zero residual mutations.
- Approved bundle JSON SHA-256: \`85cb297ffa07694fd4163ccd892759bad9efb0634022afd5f34b63e6703ccd19\`.
- Post-apply zero-residual plan SHA: \`4a3a319cf5a40b5671b042c16ef7816e00ec147f27548e971fec786989e9de25\`.
- Local smoke checks returned HTTP 200 and rendered sourced editorial content for \`/apple/macos/10.13\`, \`/apple/watchos/4.2\`, and \`/apple/tvos/11.2\`.
`;

writeFileSync(join(here, "apple-other-2017.md"), md);
}

const moreRecords = [
  release({
    id: "version-tvos-11-0",
    releaseNotesUrl: U.tvUpdates,
    overview:
      "tvOS 11 launched on September 19, 2017 with Apple TV 4K display support, expansion of the Apple TV app, synchronized Home screens, iOS Control Center remote access, automatic AirPods connection, adaptive appearance, right-to-left scripts, broader braille-display support, and a new security baseline.",
    overviewCitations: [
      c(U.tvUpdates, "tvOS 11"),
      c(U.tv4kNews, "4K and HDR; Siri and the Apple TV App"),
      c(U.tv11Security, "Released September 19, 2017"),
      c(U.securityIndex, "tvOS 11 — 19 Sep 2017"),
    ],
    boundary:
      "The tvOS software release preceded Apple TV 4K hardware availability on September 22. Hardware-dependent 4K and HDR capabilities are described as tvOS 11 support on Apple TV 4K, not as features usable on every Apple TV on September 19.",
    boundaryCitations: [
      c(U.tvUpdates, "tvOS 11 — 4K and HDR"),
      c(U.tv4kNews, "Pricing and Availability"),
    ],
    pageCitations: [
      c(U.tvUpdates, "tvOS 11"),
      c(U.tv4kNews, "Apple TV 4K announcement"),
      c(U.tv11Security, "Released September 19, 2017"),
      c(U.securityIndex, "tvOS 11 — 19 Sep 2017"),
    ],
    summary:
      "tvOS 11 reached the public channel on September 19, 2017 with Apple TV 4K media support, cross-device and regional additions, appearance and accessibility improvements, and broad security repairs.",
    publicText:
      "Apple released tvOS 11 on September 19, 2017 for Apple TV (4th generation). Apple TV 4K, which exposed the release's 4K and HDR capabilities, became available three days later.",
    publicCitations: [
      c(U.tv11Security, "Released September 19, 2017"),
      c(U.securityIndex, "tvOS 11 — 19 Sep 2017"),
      c(U.tv4kNews, "Pricing and Availability — September 22"),
    ],
    scopeText:
      "The structured changes combine Apple's retained tvOS 11 consumer section with its Apple TV 4K announcement and security advisory. Future promises such as AirPlay 2 are not treated as shipped tvOS 11 launch features.",
    scopeCitations: [
      c(U.tvUpdates, "tvOS 11"),
      c(U.tv4kNews, "Apple TV at Home — AirPlay 2 coming later"),
      c(U.tv11Security, "tvOS 11 security content"),
    ],
    changes: [
      change({
        key: "tvos-11-0-4k-hdr",
        title: "4K, HDR10, and Dolby Vision support on Apple TV 4K",
        canonicalSummary:
          "tvOS 11 supported 4K playback and HDR10 or Dolby Vision output on Apple TV 4K.",
        category: "feature",
        action: "introduced",
        summary:
          "The software and new hardware combination enabled higher-resolution video, expanded dynamic range, automatic display-capability detection, and high-quality scaling of HD content.",
        citations: [
          c(U.tvUpdates, "tvOS 11 — 4K and High Dynamic Range"),
          c(U.tv4kNews, "4K and HDR"),
        ],
      }),
      change({
        key: "tvos-11-0-tv-app-australia-canada",
        title: "Apple TV app in Australia and Canada",
        canonicalSummary:
          "The Apple TV app expanded to Australia and Canada with its unified viewing and discovery experience.",
        category: "feature",
        action: "introduced",
        summary:
          "Users in two additional countries gained the app's cross-service watch-next, discovery, and catalog interface.",
        citations: [
          c(U.tvUpdates, "tvOS 11 — Apple TV app"),
          c(U.tv4kNews, "Siri and the Apple TV App"),
        ],
      }),
      change({
        key: "tvos-11-0-one-home-screen",
        title: "One Home Screen",
        canonicalSummary:
          "One Home Screen synchronized apps and Home screen layouts across Apple TVs signed into the same iCloud account.",
        category: "feature",
        action: "introduced",
        summary:
          "Multiple Apple TV devices could maintain a consistent installed-app and launcher arrangement through iCloud.",
        citations: [c(U.tvUpdates, "tvOS 11 — One Home Screen")],
      }),
      change({
        key: "tvos-11-0-control-center-remote",
        title: "Apple TV control from iOS Control Center",
        canonicalSummary:
          "iOS 11 devices gained an Apple TV remote control directly in Control Center.",
        category: "feature",
        action: "introduced",
        summary:
          "The release simplified access to software remote controls from compatible iPhone and iPad devices.",
        citations: [
          c(U.tvUpdates, "tvOS 11 — Control your Apple TV from Control Center"),
        ],
      }),
      change({
        key: "tvos-11-0-airpods-auto-connect",
        title: "Automatic AirPods connection",
        canonicalSummary:
          "AirPods paired with an iCloud-connected iOS device could automatically connect to Apple TV.",
        category: "feature",
        action: "introduced",
        summary:
          "The iCloud device relationship reduced manual Bluetooth pairing steps for compatible AirPods.",
        citations: [c(U.tvUpdates, "tvOS 11 — AirPods")],
      }),
      change({
        key: "tvos-11-0-automatic-appearance",
        title: "Time-based automatic appearance",
        canonicalSummary:
          "Apple TV could automatically switch its background appearance between light and dark according to time of day.",
        category: "feature",
        action: "introduced",
        summary:
          "tvOS added an adaptive interface setting that changed the system appearance without manual intervention.",
        citations: [c(U.tvUpdates, "tvOS 11 — Appearance")],
      }),
      change({
        key: "tvos-11-0-rtl-scripts",
        title: "Right-to-left display languages",
        canonicalSummary:
          "tvOS 11 added right-to-left script support, including Arabic and Hebrew.",
        category: "feature",
        action: "introduced",
        summary:
          "The Apple TV interface expanded its language layout support for right-to-left writing systems.",
        citations: [c(U.tvUpdates, "tvOS 11 — Display languages")],
      }),
      change({
        key: "tvos-11-0-braille-displays",
        title: "Expanded refreshable braille display compatibility",
        canonicalSummary:
          "Apple TV compatibility expanded to more than 70 refreshable braille displays.",
        category: "enhancement",
        action: "changed",
        summary:
          "The release broadened the range of supported tactile display hardware for VoiceOver users.",
        citations: [c(U.tvUpdates, "tvOS 11 — Accessibility")],
      }),
      securityChange({
        key: "tvos-11-0-security-baseline",
        title: "tvOS 11 security baseline",
        canonicalSummary:
          "tvOS 11 repaired vulnerabilities across TLS, networking, media and text, file systems, archives, XML, the kernel, certificates, databases, WebKit, and Wi-Fi.",
        summary:
          "Apple's living advisory records protocol hardening, content-parser and memory-safety repairs, certificate validation, and local, web, and wireless attack-surface fixes.",
        url: U.tv11Security,
        locator:
          "802.1X; CFNetwork; CoreAudio; CoreText; HFS; ImageIO; Kernel; libarchive; libxml2; Security; SQLite; WebKit; Wi-Fi",
      }),
    ],
  }),
  release({
    id: "version-tvos-11-1",
    releaseNotesUrl: U.tvUpdates,
    overview:
      "tvOS 11.1 was released on October 31, 2017 with the Apple TV app in Norway and Sweden, general performance and stability improvements, and security repairs across text, kernel, archives, WebKit, and model-scoped Wi-Fi behavior.",
    overviewCitations: [
      c(U.tvUpdates, "tvOS 11.1"),
      c(U.tv111Security, "Released October 31, 2017"),
      c(U.securityIndex, "tvOS 11.1 — 31 Oct 2017"),
    ],
    boundary:
      "Apple does not enumerate the performance and stability work, so it remains a general entry. KRACK statements retain the advisory's distinction between Apple TV 4K and Apple TV (4th generation).",
    boundaryCitations: [
      c(U.tvUpdates, "tvOS 11.1"),
      c(U.tv111Security, "Wi-Fi"),
    ],
    pageCitations: [
      c(U.tvUpdates, "tvOS 11.1"),
      c(U.tv111Security, "Released October 31, 2017"),
      c(U.securityIndex, "tvOS 11.1 — 31 Oct 2017"),
    ],
    summary:
      "tvOS 11.1 reached the public channel on October 31, 2017 with Apple TV app expansion to Norway and Sweden, general performance and stability work, and text, kernel, archive, web, and Wi-Fi repairs.",
    publicText:
      "Apple released tvOS 11.1 on October 31, 2017 for Apple TV 4K and Apple TV (4th generation). The consumer history names one regional feature expansion and otherwise summarizes maintenance broadly.",
    publicCitations: [
      c(U.tvUpdates, "tvOS 11.1"),
      c(U.tv111Security, "Released October 31, 2017"),
    ],
    scopeText:
      "The version-labeled consumer note supports the regional and general-maintenance entries. Technical details and hardware scope come from the matching security advisory.",
    scopeCitations: [
      c(U.tvUpdates, "tvOS 11.1"),
      c(U.tv111Security, "CoreText through Wi-Fi"),
    ],
    changes: [
      change({
        key: "tvos-11-1-tv-app-norway-sweden",
        title: "Apple TV app in Norway and Sweden",
        canonicalSummary:
          "The Apple TV app became available in Norway and Sweden.",
        category: "feature",
        action: "introduced",
        summary:
          "tvOS 11.1 expanded Apple's unified viewing and discovery app into two additional markets.",
        citations: [c(U.tvUpdates, "tvOS 11.1 — Apple TV app")],
      }),
      change({
        key: "tvos-11-1-performance-stability",
        title: "General performance and stability improvements",
        canonicalSummary:
          "Apple described tvOS 11.1 as including general performance and stability improvements.",
        category: "enhancement",
        action: "changed",
        summary:
          "The retained update history confirms maintenance work but does not identify individual performance or reliability changes.",
        citations: [c(U.tvUpdates, "tvOS 11.1")],
      }),
      securityChange({
        key: "tvos-11-1-system-web-security",
        title: "Text, kernel, archive, and WebKit repairs",
        canonicalSummary:
          "tvOS 11.1 addressed text denial of service, kernel code execution and process-information exposure, archive path handling, and multiple WebKit memory-corruption flaws.",
        summary:
          "Apple's advisory records local, crafted-file, and malicious-web-content risks across CoreText, the kernel, StreamingZip, and WebKit.",
        url: U.tv111Security,
        locator: "CoreText; Kernel; StreamingZip; WebKit",
      }),
      securityChange({
        key: "tvos-11-1-wifi-krack-security",
        title: "Apple TV 4K KRACK repairs",
        canonicalSummary:
          "tvOS 11.1 corrected WPA unicast and multicast nonce-reuse weaknesses on Apple TV 4K, while Apple marked the fourth-generation model unaffected by the unicast class.",
        summary:
          "The advisory preserves model-specific KRACK scope and documents improved Wi-Fi state management for the affected Apple TV 4K paths.",
        url: U.tv111Security,
        locator: "Wi-Fi — CVE-2017-13077, CVE-2017-13078, CVE-2017-13080",
      }),
    ],
  }),
  release({
    id: "version-tvos-11-2",
    releaseNotesUrl: U.tvUpdates,
    overview:
      "tvOS 11.2 was released on December 4, 2017 with further Apple TV app expansion, a US sports experience, Amazon Prime Video, original frame-rate and dynamic-range playback on Apple TV 4K, VoiceOver improvements, general maintenance, and security repairs.",
    overviewCitations: [
      c(U.tvUpdates, "tvOS 11.2"),
      c(U.tv112Security, "Released December 4, 2017"),
      c(U.securityIndex, "tvOS 11.2 — 4 Dec 2017"),
    ],
    boundary:
      "Regional qualifications are preserved: Apple TV app availability expanded to France, Germany, and the United Kingdom, while the Sports tab is identified for the United States. Original dynamic-range matching is limited to Apple TV 4K.",
    boundaryCitations: [c(U.tvUpdates, "tvOS 11.2")],
    pageCitations: [
      c(U.tvUpdates, "tvOS 11.2"),
      c(U.tv112Security, "Released December 4, 2017"),
      c(U.securityIndex, "tvOS 11.2 — 4 Dec 2017"),
    ],
    summary:
      "tvOS 11.2 reached the public channel on December 4, 2017 with regional TV and sports expansion, Prime Video, display-matching controls, accessibility and maintenance improvements, and security repairs.",
    publicText:
      "Apple released tvOS 11.2 on December 4, 2017 for Apple TV 4K and Apple TV (4th generation). Its consumer section names four feature groups in addition to general performance and stability improvements.",
    publicCitations: [
      c(U.tvUpdates, "tvOS 11.2"),
      c(U.tv112Security, "Released December 4, 2017"),
    ],
    scopeText:
      "The structured entries retain regional and hardware limitations. Security summaries distinguish the fourth-generation Apple TV's multicast KRACK repair from the Apple TV 4K repair already assigned to 11.1.",
    scopeCitations: [
      c(U.tvUpdates, "tvOS 11.2"),
      c(U.tv112Security, "App Store through Wi-Fi"),
    ],
    changes: [
      change({
        key: "tvos-11-2-performance-stability",
        title: "General performance and stability improvements",
        canonicalSummary:
          "Apple described tvOS 11.2 as including general performance and stability improvements.",
        category: "enhancement",
        action: "changed",
        summary:
          "The consumer history confirms maintenance work without enumerating individual performance or reliability changes.",
        citations: [c(U.tvUpdates, "tvOS 11.2 introduction")],
      }),
      change({
        key: "tvos-11-2-tv-app-sports-expansion",
        title: "Apple TV app expansion and US Sports tab",
        canonicalSummary:
          "The Apple TV app expanded to France, Germany, and the United Kingdom and added a US Sports tab with favorites, Up Next integration, and notifications.",
        category: "feature",
        action: "introduced",
        summary:
          "tvOS 11.2 widened regional access and introduced a sports-discovery workflow for live or upcoming games in the United States.",
        citations: [c(U.tvUpdates, "tvOS 11.2 — Apple TV App")],
      }),
      change({
        key: "tvos-11-2-amazon-prime-video",
        title: "Amazon Prime Video app availability",
        canonicalSummary:
          "Amazon Prime Video became available from the Apple TV App Store.",
        category: "feature",
        action: "introduced",
        summary:
          "The release's consumer notes mark Prime Video and its original or catalog programming as newly available on Apple TV.",
        citations: [c(U.tvUpdates, "tvOS 11.2 — Amazon Prime Video")],
      }),
      change({
        key: "tvos-11-2-frame-rate-dynamic-range",
        title: "Original frame-rate and dynamic-range matching",
        canonicalSummary:
          "Apple TV 4K gained playback matching for a video's original frame rate and dynamic range.",
        category: "feature",
        action: "introduced",
        summary:
          "Supported hardware could switch output characteristics to better preserve the source presentation rather than using one fixed format for all content.",
        citations: [c(U.tvUpdates, "tvOS 11.2 — Video playback")],
      }),
      change({
        key: "tvos-11-2-voiceover-improvements",
        title: "VoiceOver navigation, reading, and dictation improvements",
        canonicalSummary:
          "VoiceOver added Follow Focus and delayed Read Screen options while improving navigation-mode reading and dictated text-input consistency.",
        category: "enhancement",
        action: "changed",
        summary:
          "The release expanded screen-reader controls and made spoken navigation and text entry more consistent.",
        citations: [c(U.tvUpdates, "tvOS 11.2 — Accessibility")],
      }),
      securityChange({
        key: "tvos-11-2-platform-web-security",
        title: "App Store, privilege, kernel, and WebKit repairs",
        canonicalSummary:
          "tvOS 11.2 addressed App Store prompt spoofing, privilege and memory-safety issues in system frameworks and the kernel, and malicious web-content execution or spoofing.",
        summary:
          "Apple's living advisory records authentication-interface, local-privilege, kernel, information-disclosure, code-execution, and browser presentation risks.",
        url: U.tv112Security,
        locator:
          "App Store; Auto Unlock; CFNetwork Session; CoreAnimation; CoreFoundation; IOKit; IOSurface; Kernel; WebKit",
      }),
      securityChange({
        key: "tvos-11-2-fourth-gen-krack-security",
        title: "Fourth-generation Apple TV multicast KRACK repair",
        canonicalSummary:
          "tvOS 11.2 corrected the WPA multicast nonce-reuse weakness on Apple TV (4th generation), after Apple TV 4K received the corresponding repair in tvOS 11.1.",
        summary:
          "Apple's advisory explicitly distinguishes the model and prior release associated with the same KRACK class.",
        url: U.tv112Security,
        locator: "Wi-Fi — CVE-2017-13080",
      }),
    ],
  }),
  release({
    id: "version-tvos-10-2",
    releaseNotesUrl: U.tv102Security,
    overview:
      "tvOS 10.2 was released on March 27, 2017 for Apple TV (4th generation). Apple's current consumer update history does not retain a tvOS 10.2 section, so this article is limited to the version-specific security record.",
    overviewCitations: [
      c(U.tv102Security, "Released March 27, 2017"),
      c(U.securityIndex, "tvOS 10.2 — 27 Mar 2017"),
      c(U.tvUpdates, "Retained update history begins at tvOS 11"),
    ],
    boundary:
      "No surviving Apple consumer narrative was found for tvOS 10.2. The absence is not evidence that the release contained no ordinary changes; it means this batch does not assert any without a version-labeled first-party source.",
    boundaryCitations: [
      c(U.tvUpdates, "Oldest retained section: tvOS 11"),
      c(U.tv102Security, "tvOS 10.2 security content"),
    ],
    pageCitations: [
      c(U.tv102Security, "Released March 27, 2017"),
      c(U.securityIndex, "tvOS 10.2 — 27 Mar 2017"),
      c(U.tvUpdates, "Oldest retained section: tvOS 11"),
    ],
    summary:
      "tvOS 10.2 reached the public channel on March 27, 2017 with a documented security set spanning media, fonts, images, networking, JavaScript, the kernel, Keychain, certificates, libraries, and WebKit.",
    publicText:
      "Apple's security index and dedicated advisory date tvOS 10.2 to March 27, 2017 and identify Apple TV (4th generation) as the supported device.",
    publicCitations: [
      c(U.tv102Security, "Released March 27, 2017"),
      c(U.securityIndex, "tvOS 10.2 — 27 Mar 2017"),
    ],
    scopeText:
      "The structured entries organize the advisory by attack surface. They do not infer consumer features, performance changes, or ordinary bug fixes from the version number or from later tvOS histories.",
    scopeCitations: [
      c(U.tv102Security, "Audio through WebKit"),
      c(U.tvUpdates, "Oldest retained section: tvOS 11"),
    ],
    changes: [
      securityChange({
        key: "tvos-10-2-media-font-image-security",
        title: "Media, font, image, HTTP/2, and input-parser repairs",
        canonicalSummary:
          "tvOS 10.2 repaired crafted-content vulnerabilities across audio, fonts, graphics, images, HTTP/2 handling, and keyboard input.",
        summary:
          "Apple's advisory records code-execution, disclosure, denial-of-service, and undefined-behavior risks in media and data parsers.",
        url: U.tv102Security,
        locator:
          "Audio; Carbon; CoreGraphics; CoreText; FontParser; HTTPProtocol; ImageIO; Keyboards",
      }),
      securityChange({
        key: "tvos-10-2-javascript-webkit-security",
        title: "JavaScriptCore and WebKit repairs",
        canonicalSummary:
          "The release addressed JavaScript and web-content memory-safety, cross-site scripting, resource-consumption, and certificate-display risks.",
        summary:
          "The advisory documents multiple malicious-web-content paths that could lead to code execution, data exposure, spoofing, or excessive resource use.",
        url: U.tv102Security,
        locator: "JavaScriptCore; WebKit",
      }),
      securityChange({
        key: "tvos-10-2-kernel-platform-security",
        title: "Kernel and platform privilege repairs",
        canonicalSummary:
          "tvOS 10.2 corrected multiple kernel memory-corruption, race, overflow, and use-after-free paths plus related platform privilege issues.",
        summary:
          "Apple records risks ranging from restricted-memory access to root, system, elevated, or kernel-level code execution.",
        url: U.tv102Security,
        locator: "Kernel; Security",
      }),
      securityChange({
        key: "tvos-10-2-keychain-library-security",
        title: "Keychain, archive, runtime, XML, and certificate repairs",
        canonicalSummary:
          "The update improved iCloud Keychain packet validation and repaired archive, C++ runtime, XML transformation, and certificate-processing vulnerabilities.",
        summary:
          "Apple's record includes protected-secret interception risk, file-permission manipulation, memory corruption, and crafted-certificate code execution.",
        url: U.tv102Security,
        locator: "Keychain; libarchive; libc++abi; libxslt; Security",
      }),
    ],
  }),
  release({
    id: "version-tvos-10-2-1",
    releaseNotesUrl: U.tv1021Security,
    overview:
      "tvOS 10.2.1 was released on May 15, 2017 for Apple TV (4th generation). Because Apple's retained consumer history starts at tvOS 11, the supported article scope is the dedicated security advisory.",
    overviewCitations: [
      c(U.tv1021Security, "Released May 15, 2017"),
      c(U.securityIndex, "tvOS 10.2.1 — 15 May 2017"),
      c(U.tvUpdates, "Retained update history begins at tvOS 11"),
    ],
    boundary:
      "The article makes no claim about unnamed feature, performance, or stability changes. Specific statements come only from Apple's version-labeled advisory and release index.",
    boundaryCitations: [
      c(U.tvUpdates, "Oldest retained section: tvOS 11"),
      c(U.tv1021Security, "tvOS 10.2.1 security content"),
    ],
    pageCitations: [
      c(U.tv1021Security, "Released May 15, 2017"),
      c(U.securityIndex, "tvOS 10.2.1 — 15 May 2017"),
      c(U.tvUpdates, "Oldest retained section: tvOS 11"),
    ],
    summary:
      "tvOS 10.2.1 reached the public channel on May 15, 2017 with documented repairs in video, audio, data, text, system surfaces, databases, text input, JavaScriptCore, WebKit, and Web Inspector.",
    publicText:
      "Apple's security index and dedicated advisory date tvOS 10.2.1 to May 15, 2017 for Apple TV (4th generation).",
    publicCitations: [
      c(U.tv1021Security, "Released May 15, 2017"),
      c(U.securityIndex, "tvOS 10.2.1 — 15 May 2017"),
    ],
    scopeText:
      "The structured changes group Apple's security entries by subsystem. No ordinary release-note wording survives in the current Apple TV update history for this version.",
    scopeCitations: [
      c(U.tv1021Security, "AVEVideoEncoder through WebKit Web Inspector"),
      c(U.tvUpdates, "Oldest retained section: tvOS 11"),
    ],
    changes: [
      securityChange({
        key: "tvos-10-2-1-media-data-security",
        title: "Video, audio, Foundation, and text-processing repairs",
        canonicalSummary:
          "tvOS 10.2.1 repaired memory-safety and validation issues in video encoding, audio, CoreFoundation, Foundation, and CoreText.",
        summary:
          "Apple's advisory identifies kernel-privilege, restricted-memory, denial-of-service, and crafted-data code-execution risks.",
        url: U.tv1021Security,
        locator:
          "AVEVideoEncoder; CoreAudio; CoreFoundation; CoreText; Foundation",
      }),
      securityChange({
        key: "tvos-10-2-1-kernel-platform-security",
        title: "IOSurface and kernel repairs",
        canonicalSummary:
          "The update addressed an IOSurface race condition and kernel memory-safety or validation flaws.",
        summary:
          "The matching advisory records kernel-privilege code-execution and restricted-memory disclosure outcomes.",
        url: U.tv1021Security,
        locator: "IOSurface; Kernel",
      }),
      securityChange({
        key: "tvos-10-2-1-database-input-security",
        title: "SQLite and TextInput repairs",
        canonicalSummary:
          "tvOS 10.2.1 fixed multiple SQLite memory-corruption paths and a crafted-data flaw in text input.",
        summary:
          "Apple documents several SQL query code-execution risks and a separate TextInput parsing issue.",
        url: U.tv1021Security,
        locator: "SQLite; TextInput",
      }),
      securityChange({
        key: "tvos-10-2-1-web-security",
        title: "JavaScriptCore, WebKit, and Web Inspector repairs",
        canonicalSummary:
          "The release addressed web engine memory corruption, cross-site scripting, frame-loading logic, and unsigned-code execution risks.",
        summary:
          "Apple's advisory groups multiple malicious-web-content vulnerabilities across JavaScriptCore, WebKit, and its inspection tooling.",
        url: U.tv1021Security,
        locator: "JavaScriptCore; WebKit; WebKit Web Inspector",
      }),
    ],
  }),
  release({
    id: "version-tvos-10-2-2",
    releaseNotesUrl: U.tv1022Security,
    overview:
      "tvOS 10.2.2 was released on July 19, 2017 for Apple TV (4th generation). Apple's current consumer history has no retained tvOS 10.2.2 section, leaving the security advisory as the specific first-party record.",
    overviewCitations: [
      c(U.tv1022Security, "Released July 19, 2017"),
      c(U.securityIndex, "tvOS 10.2.2 — 19 Jul 2017"),
      c(U.tvUpdates, "Retained update history begins at tvOS 11"),
    ],
    boundary:
      "The page does not convert the absence of consumer notes into an assertion that this was security-only software. It records only what Apple's surviving version-specific sources can establish.",
    boundaryCitations: [
      c(U.tvUpdates, "Oldest retained section: tvOS 11"),
      c(U.tv1022Security, "tvOS 10.2.2 security content"),
    ],
    pageCitations: [
      c(U.tv1022Security, "Released July 19, 2017"),
      c(U.securityIndex, "tvOS 10.2.2 — 19 Jul 2017"),
      c(U.tvUpdates, "Oldest retained section: tvOS 11"),
    ],
    summary:
      "tvOS 10.2.2 reached the public channel on July 19, 2017 with documented Contacts, media, USB, kernel, archive, XML, XPC, WebKit, and Wi-Fi security repairs.",
    publicText:
      "Apple's security index and dedicated advisory date tvOS 10.2.2 to July 19, 2017 for Apple TV (4th generation).",
    publicCitations: [
      c(U.tv1022Security, "Released July 19, 2017"),
      c(U.securityIndex, "tvOS 10.2.2 — 19 Jul 2017"),
    ],
    scopeText:
      "All structured entries are security deltas taken from Apple's advisory. No feature or generic maintenance claim is inferred from neighboring releases.",
    scopeCitations: [
      c(U.tv1022Security, "Contacts through Wi-Fi"),
      c(U.tvUpdates, "Oldest retained section: tvOS 11"),
    ],
    changes: [
      securityChange({
        key: "tvos-10-2-2-communications-media-security",
        title: "Contacts and media-processing repairs",
        canonicalSummary:
          "tvOS 10.2.2 repaired remotely triggerable Contacts handling and a crafted-movie vulnerability in CoreAudio.",
        summary:
          "Apple documents buffer or memory corruption that could result in application termination or code execution.",
        url: U.tv1022Security,
        locator: "Contacts; CoreAudio",
      }),
      securityChange({
        key: "tvos-10-2-2-kernel-usb-security",
        title: "USB and kernel repairs",
        canonicalSummary:
          "The update addressed IOUSBFamily and kernel memory-safety vulnerabilities with system- or kernel-privilege impact.",
        summary:
          "Apple's advisory records code-execution and restricted-memory risks across the USB stack and kernel.",
        url: U.tv1022Security,
        locator: "IOUSBFamily; Kernel",
      }),
      securityChange({
        key: "tvos-10-2-2-library-xpc-security",
        title: "Archive, XML, and XPC repairs",
        canonicalSummary:
          "tvOS 10.2.2 fixed crafted archive, XML, and interprocess-communication flaws.",
        summary:
          "The advisory identifies code-execution and information-disclosure outcomes in libarchive, libxml2, and libxpc.",
        url: U.tv1022Security,
        locator: "libarchive; libxml2; libxpc",
      }),
      securityChange({
        key: "tvos-10-2-2-web-wifi-security",
        title: "WebKit and Wi-Fi repairs",
        canonicalSummary:
          "The release addressed WebKit cross-origin and memory-corruption risks plus a radio-range Wi-Fi chip code-execution vulnerability.",
        summary:
          "Apple's security record covers malicious web content and a nearby attack surface in the wireless chipset.",
        url: U.tv1022Security,
        locator: "WebKit; Wi-Fi",
      }),
    ],
  }),
  release({
    id: "version-watchos-4-0",
    releaseNotesUrl: U.watch4,
    overview:
      "watchOS 4 launched on September 19, 2017 with new watch faces, personalized Activity coaching, a rebuilt Workout experience, richer heart-rate measurements, redesigned music handling, additional built-in tools, and a broad security baseline.",
    overviewCitations: [
      c(U.watch4, "watchOS 4"),
      c(
        U.watch4Preview,
        "Intelligence; Fitness; Watch Faces and Bands",
      ),
      c(U.watch4Security, "Released September 19, 2017"),
      c(U.securityIndex, "watchOS 4 — 19 Sep 2017"),
    ],
    boundary:
      "Apple's June preview described GymKit and person-to-person Apple Pay as coming capabilities. The version history shows GymKit in 4.1 and Apple Pay Cash in 4.2, so neither is represented as part of the 4.0 public delta.",
    boundaryCitations: [
      c(U.watch4Preview, "Fitness; Person to Person Payments; Availability"),
      c(U.watch4, "watchOS 4.1; watchOS 4.2"),
    ],
    pageCitations: [
      c(U.watch4, "watchOS 4"),
      c(U.watch4Preview, "watchOS 4 preview"),
      c(U.watch4Security, "Released September 19, 2017"),
      c(U.securityIndex, "watchOS 4 — 19 Sep 2017"),
    ],
    summary:
      "watchOS 4 reached the public channel on September 19, 2017 with new faces, Activity coaching, workout and heart-rate capabilities, music changes, built-in app refinements, and security repairs.",
    publicText:
      "Apple released watchOS 4 on September 19, 2017 for all Apple Watch models. The final consumer notes provide the shipped feature set, while Apple's earlier preview supplies context without overriding later version boundaries.",
    publicCitations: [
      c(U.watch4, "watchOS 4"),
      c(U.watch4Security, "Released September 19, 2017"),
      c(U.securityIndex, "watchOS 4 — 19 Sep 2017"),
    ],
    scopeText:
      "The structured changes follow Apple's final watchOS 4 section and current security record. Region, model, and subscription qualifications are retained, and features first assigned to 4.1 or 4.2 are excluded.",
    scopeCitations: [
      c(U.watch4, "watchOS 4 through watchOS 4.2"),
      c(U.watch4Preview, "Pricing and Availability"),
      c(U.watch4Security, "watchOS 4 security content"),
    ],
    changes: [
      change({
        key: "watchos-4-0-watch-faces",
        title: "Siri, Toy Story, and Kaleidoscope faces",
        canonicalSummary:
          "watchOS 4 introduced a context-aware Siri face, animated Toy Story faces, a Kaleidoscope face, and new complications.",
        category: "feature",
        action: "introduced",
        summary:
          "The face collection expanded with proactive information, animated character designs, image-derived patterns, and complications for Siri, News, Heart Rate, Now Playing, and Messages.",
        citations: [
          c(U.watch4, "watchOS 4 — Watch Faces"),
          c(U.watch4Preview, "Intelligence; Watch Faces and Bands"),
        ],
      }),
      change({
        key: "watchos-4-0-activity-coaching",
        title: "Personalized Activity coaching and monthly challenges",
        canonicalSummary:
          "Activity gained personalized ring-closing prompts, monthly challenges, milestone celebrations, and workout metrics in sharing replies.",
        category: "feature",
        action: "introduced",
        summary:
          "The app used recent activity to tailor encouragement and goals, added full-screen achievement animations, and included workout context in social replies.",
        citations: [
          c(U.watch4, "watchOS 4 — Activity"),
          c(U.watch4Preview, "Intelligence"),
        ],
      }),
      change({
        key: "watchos-4-0-workout-redesign-hiit",
        title: "Redesigned Workout app and HIIT tracking",
        canonicalSummary:
          "The Workout app was redesigned for faster starts and added High Intensity Interval Training with specialized motion and heart-rate algorithms.",
        category: "feature",
        action: "introduced",
        summary:
          "watchOS 4 refreshed workout navigation and introduced a dedicated HIIT type intended to improve calorie estimates for interval sessions.",
        citations: [
          c(U.watch4, "watchOS 4 — Workout"),
          c(U.watch4Preview, "Fitness"),
        ],
      }),
      change({
        key: "watchos-4-0-multiple-workouts-pool-sets",
        title: "Multiple workouts and automatic pool-swim sets",
        canonicalSummary:
          "A session could combine multiple workout types, while Pool Swim automatically separated sets, strokes, pace, distance, and rest.",
        category: "feature",
        action: "introduced",
        summary:
          "The update better represented back-to-back training and added automatic set analysis for supported swimming workouts.",
        citations: [
          c(U.watch4, "watchOS 4 — Workout"),
          c(U.watch4Preview, "Fitness"),
        ],
      }),
      change({
        key: "watchos-4-0-workout-music-dnd",
        title: "Workout music controls and automatic Do Not Disturb",
        canonicalSummary:
          "Supported watches could start a synced playlist with a workout, expose music controls inside Workout, and enable Do Not Disturb for the session.",
        category: "feature",
        action: "introduced",
        summary:
          "The release reduced interruptions and made audio control more immediate during exercise, with automatic playlist startup limited to Apple Watch Series 1 and later.",
        citations: [c(U.watch4, "watchOS 4 — Workout")],
      }),
      change({
        key: "watchos-4-0-heart-rate-insights",
        title: "Expanded heart-rate graphs, measurements, and alerts",
        canonicalSummary:
          "Heart Rate gained all-day graphs, resting and walking averages, workout and recovery views, elevated-rate notifications, HRV, and VO2 Max data.",
        category: "feature",
        action: "introduced",
        summary:
          "watchOS 4 substantially broadened current and historical cardiovascular metrics, with some measurements and inactive high-rate notifications limited to Series 1 and later.",
        citations: [c(U.watch4, "watchOS 4 — Heart Rate")],
      }),
      change({
        key: "watchos-4-0-music-redesign",
        title: "Redesigned Music app and multiple synced playlists",
        canonicalSummary:
          "Music gained album-art navigation, multiple locally synced playlists, and automatic synchronization of selected Apple Music mixes.",
        category: "enhancement",
        action: "changed",
        summary:
          "The watch music experience was rebuilt for easier browsing and a larger rotating local library, with curated mixes requiring Apple Music.",
        citations: [
          c(U.watch4, "watchOS 4 — Music"),
          c(U.watch4Preview, "Intelligence — Music"),
        ],
      }),
      change({
        key: "watchos-4-0-news-flashlight",
        title: "News and flashlight tools",
        canonicalSummary:
          "watchOS 4 added a News app for story summaries and save-for-later actions plus flashlight and safety-light modes in Control Center.",
        category: "feature",
        action: "introduced",
        summary:
          "The update brought headline summaries to the wrist and added quick full-screen illumination controls.",
        citations: [
          c(U.watch4, "watchOS 4 — Other features and improvements"),
        ],
      }),
      change({
        key: "watchos-4-0-dock-list-view",
        title: "Vertical Dock and alphabetical app list",
        canonicalSummary:
          "Recent apps moved to a vertically scrolling Dock, and the app launcher gained an alphabetical list view.",
        category: "enhancement",
        action: "changed",
        summary:
          "watchOS 4 added two more linear navigation options for switching among recent apps and finding installed software.",
        citations: [
          c(U.watch4, "watchOS 4 — Other features and improvements"),
        ],
      }),
      change({
        key: "watchos-4-0-app-and-input-refinements",
        title: "Mail, Phone, Calendar, Scribble, timer, Maps, and reply refinements",
        canonicalSummary:
          "Built-in apps gained Mail composition and swipes, a phone dialer, calendar-conflict display, German Scribble, flexible timers, recent Maps locations, and richer smart replies.",
        category: "enhancement",
        action: "changed",
        summary:
          "A collection of smaller additions improved communication, scheduling, text entry, timing, navigation, and suggested responses.",
        citations: [
          c(U.watch4, "watchOS 4 — Other features and improvements"),
        ],
      }),
      securityChange({
        key: "watchos-4-0-security-baseline",
        title: "watchOS 4 security baseline",
        canonicalSummary:
          "watchOS 4 addressed network protocol, media and document parsing, file-system, kernel, archive, XML, certificate, database, and web vulnerabilities.",
        summary:
          "Apple's living advisory records a broad set of repairs, including newer TLS enablement, memory-safety and information-disclosure fixes, certificate validation, and malicious web-content handling.",
        url: U.watch4Security,
        locator:
          "802.1X; CFNetwork; CoreAudio; CoreText; HFS; ImageIO; Kernel; libarchive; libxml2; Security; SQLite; WebKit",
      }),
    ],
  }),
  release({
    id: "version-watchos-4-1",
    releaseNotesUrl: U.watch4,
    overview:
      "watchOS 4.1 was released on October 31, 2017 with Series 3 music streaming and radio, Siri music playback, GymKit, a cellular-model Wi-Fi control, multiple targeted corrections, and security repairs.",
    overviewCitations: [
      c(U.watch4, "watchOS 4.1"),
      c(U.watch41Security, "Released October 31, 2017"),
      c(U.securityIndex, "watchOS 4.1 — 31 Oct 2017"),
    ],
    boundary:
      "Music streaming and Radio are identified for Apple Watch Series 3, and the Wi-Fi disconnect control is limited to Series 3 GPS + Cellular. GymKit is assigned here because Apple's final version history places it in 4.1 rather than the 4.0 launch.",
    boundaryCitations: [
      c(U.watch4, "watchOS 4.1"),
      c(U.watch4Preview, "Fitness — GymKit preview"),
    ],
    pageCitations: [
      c(U.watch4, "watchOS 4.1"),
      c(U.watch41Security, "Released October 31, 2017"),
      c(U.securityIndex, "watchOS 4.1 — 31 Oct 2017"),
    ],
    summary:
      "watchOS 4.1 reached the public channel on October 31, 2017 with Series 3 streaming and radio, Siri music, GymKit, Wi-Fi control, reliability corrections, and scoped security repairs.",
    publicText:
      "Apple released watchOS 4.1 on October 31, 2017 for all Apple Watch models. Its user-facing feature list contains hardware-specific qualifications that remain attached to the relevant entries.",
    publicCitations: [
      c(U.watch4, "watchOS 4.1"),
      c(U.watch41Security, "Released October 31, 2017"),
    ],
    scopeText:
      "The article separates feature additions from targeted corrections and from the advisory's security work. The KRACK entries retain Apple's model-level affected and not-affected distinctions.",
    scopeCitations: [
      c(U.watch4, "watchOS 4.1"),
      c(U.watch41Security, "CoreText through Wi-Fi"),
    ],
    changes: [
      change({
        key: "watchos-4-1-music-streaming",
        title: "Apple Music and iCloud Music Library streaming",
        canonicalSummary:
          "Apple Watch Series 3 gained direct streaming from Apple Music or iCloud Music Library.",
        category: "feature",
        action: "introduced",
        summary:
          "Supported Series 3 models could access cloud-hosted music without first synchronizing each track for local playback.",
        citations: [c(U.watch4, "watchOS 4.1 — music streaming")],
      }),
      change({
        key: "watchos-4-1-radio-app",
        title: "Radio app on Apple Watch Series 3",
        canonicalSummary:
          "A new Radio app brought Beats 1, custom stations, and curated stations to Apple Watch Series 3.",
        category: "feature",
        action: "introduced",
        summary:
          "The release added live and programmed radio listening on supported Series 3 hardware.",
        citations: [c(U.watch4, "watchOS 4.1 — Radio")],
      }),
      change({
        key: "watchos-4-1-siri-music",
        title: "Siri music discovery and playback",
        canonicalSummary:
          "Siri could find, discover, and play songs, playlists, and albums from Apple Watch.",
        category: "feature",
        action: "introduced",
        summary:
          "Voice requests expanded from controls into music discovery and selection across supported catalogs.",
        citations: [c(U.watch4, "watchOS 4.1 — Siri music")],
      }),
      change({
        key: "watchos-4-1-gymkit",
        title: "GymKit equipment synchronization",
        canonicalSummary:
          "GymKit synchronized Apple Watch workout data with compatible treadmills, ellipticals, stair steppers, and indoor bikes.",
        category: "feature",
        action: "introduced",
        summary:
          "Supported equipment and the watch could exchange workout measurements to improve consistency for distance, pace, and energy-burn tracking.",
        citations: [
          c(U.watch4, "watchOS 4.1 — GymKit"),
          c(U.watch4Preview, "Fitness — GymKit"),
        ],
      }),
      change({
        key: "watchos-4-1-wifi-disconnect",
        title: "Wi-Fi disconnect control",
        canonicalSummary:
          "Control Center gained a Wi-Fi disconnect action on Apple Watch Series 3 GPS + Cellular.",
        category: "feature",
        action: "introduced",
        summary:
          "The hardware-specific control let users leave the current Wi-Fi network directly from the watch.",
        citations: [c(U.watch4, "watchOS 4.1 — Wi-Fi")],
      }),
      change({
        key: "watchos-4-1-activity-notification-fixes",
        title: "Heart Rate and Stand notification corrections",
        canonicalSummary:
          "watchOS 4.1 corrected unwanted Heart Rate notifications and missing Stand reminders or current-hour indicators.",
        category: "bugFix",
        action: "fixed",
        summary:
          "The update aligned Heart Rate alerts with the user's enabled state and repaired two Activity standing-notification display or delivery problems.",
        citations: [c(U.watch4, "watchOS 4.1 — Heart Rate and Stand fixes")],
      }),
      change({
        key: "watchos-4-1-alarm-charging-complication-fixes",
        title: "Alarm, charging, complication, and dictation corrections",
        canonicalSummary:
          "The release repaired silent-alarm haptics, first-generation charging, the sunrise/sunset complication, and mainland-China Mandarin dictation defaults.",
        category: "bugFix",
        action: "fixed",
        summary:
          "Four targeted corrections addressed tactile alerts, charging reliability on original Apple Watch hardware, missing solar information, and localization defaults.",
        citations: [
          c(
            U.watch4,
            "watchOS 4.1 — silent alarms through Mandarin dictation",
          ),
        ],
      }),
      securityChange({
        key: "watchos-4-1-security-repairs",
        title: "Text, kernel, archive, and scoped Wi-Fi repairs",
        canonicalSummary:
          "watchOS 4.1 addressed text denial of service, kernel memory and process-information issues, archive path handling, and a KRACK multicast weakness on Series 1 and Series 2.",
        summary:
          "Apple's advisory distinguishes the affected multicast Wi-Fi models from an unicast KRACK class that it says did not affect any Apple Watch model.",
        url: U.watch41Security,
        locator: "CoreText; Kernel; StreamingZip; Wi-Fi",
      }),
    ],
  }),
  release({
    id: "version-watchos-4-2",
    releaseNotesUrl: U.watch4,
    overview:
      "watchOS 4.2 was released on December 5, 2017 with Apple Pay Cash in the United States, new HomeKit accessory support, a downhill-snow-sports workout interface for third-party apps, three targeted fixes, and security repairs.",
    overviewCitations: [
      c(U.watch4, "watchOS 4.2"),
      c(U.watch42Security, "Released December 5, 2017"),
      c(U.securityIndex, "watchOS 4.2 — 5 Dec 2017"),
    ],
    boundary:
      "Apple Pay Cash is presented as a historical US-only launch capability. The snow-sports API is limited to third-party apps on Apple Watch Series 3, and the advisory's explicit no-impact Meltdown note is not converted into a shipped fix.",
    boundaryCitations: [
      c(U.watch4, "watchOS 4.2"),
      c(U.watch42Security, "No impact — Kernel (Meltdown)"),
    ],
    pageCitations: [
      c(U.watch4, "watchOS 4.2"),
      c(U.watch42Security, "Released December 5, 2017"),
      c(U.securityIndex, "watchOS 4.2 — 5 Dec 2017"),
    ],
    summary:
      "watchOS 4.2 reached the public channel on December 5, 2017 with US Apple Pay Cash, HomeKit and snow-sports support, Siri, Heart Rate, timer and alarm corrections, and security repairs.",
    publicText:
      "Apple released watchOS 4.2 on December 5, 2017 for all Apple Watch models. The consumer notes qualify some additions by country, hardware generation, or third-party app support.",
    publicCitations: [
      c(U.watch4, "watchOS 4.2"),
      c(U.watch42Security, "Released December 5, 2017"),
    ],
    scopeText:
      "The page preserves Apple's launch qualifications and separates three named reliability fixes from the advisory's platform, kernel, web, and Wi-Fi work.",
    scopeCitations: [
      c(U.watch4, "watchOS 4.2"),
      c(U.watch42Security, "Auto Unlock through Wi-Fi; No impact"),
    ],
    changes: [
      change({
        key: "watchos-4-2-apple-pay-cash",
        title: "Apple Pay Cash in Messages and Siri",
        canonicalSummary:
          "watchOS 4.2 enabled US users to send, request, and receive money through Messages or Siri with Apple Pay Cash.",
        category: "feature",
        action: "introduced",
        summary:
          "The release activated person-to-person payments on Apple Watch in the United States, subject to Apple's regional service availability.",
        citations: [c(U.watch4, "watchOS 4.2 — Apple Pay Cash")],
      }),
      change({
        key: "watchos-4-2-homekit-sprinklers-faucets",
        title: "HomeKit sprinkler and faucet support",
        canonicalSummary:
          "The Home app on Apple Watch added control support for HomeKit sprinklers and faucets.",
        category: "feature",
        action: "introduced",
        summary:
          "watchOS extended its smart-home control surface to two additional accessory categories.",
        citations: [c(U.watch4, "watchOS 4.2 — HomeKit")],
      }),
      change({
        key: "watchos-4-2-snow-sports-workouts",
        title: "Downhill snow-sports workout metrics",
        canonicalSummary:
          "Third-party workout apps could track downhill snow-sports distance, average speed, runs, and elevation descended on Apple Watch Series 3.",
        category: "developerApi",
        action: "introduced",
        summary:
          "The new workout type exposed a hardware-specific metric set for skiing and snowboarding applications.",
        citations: [c(U.watch4, "watchOS 4.2 — downhill snow sports")],
      }),
      change({
        key: "watchos-4-2-siri-weather-restart-fix",
        title: "Siri weather restart correction",
        canonicalSummary:
          "watchOS 4.2 fixed cases where asking Siri for weather information restarted Apple Watch.",
        category: "bugFix",
        action: "fixed",
        summary:
          "The update addressed a reliability failure triggered by a specific voice-assistant weather request.",
        citations: [c(U.watch4, "watchOS 4.2 — Siri weather")],
      }),
      change({
        key: "watchos-4-2-heart-rate-timer-alarm-fixes",
        title: "Heart Rate scrolling and timer or alarm dismissal fixes",
        canonicalSummary:
          "The release restored Heart Rate scrolling for affected users and allowed simultaneous timers or alarms to be dismissed independently.",
        category: "bugFix",
        action: "fixed",
        summary:
          "Two targeted corrections repaired navigation within Heart Rate and independent handling of concurrently active timing alerts.",
        citations: [
          c(U.watch4, "watchOS 4.2 — Heart Rate, timers, and alarms"),
        ],
      }),
      securityChange({
        key: "watchos-4-2-security-repairs",
        title: "Privilege, kernel, WebKit, and scoped Wi-Fi repairs",
        canonicalSummary:
          "watchOS 4.2 addressed privilege and memory-safety vulnerabilities across Auto Unlock, networking, Core frameworks, I/O, the kernel, WebKit, and remaining model-scoped KRACK exposure.",
        summary:
          "Apple's advisory documents code-execution, privilege, information-disclosure, and web-spoofing risks, while distinguishing which Apple Watch generations received the multicast Wi-Fi correction in 4.2.",
        url: U.watch42Security,
        locator:
          "Auto Unlock; CFNetwork Session; CoreAnimation; CoreFoundation; IOKit; IOSurface; Kernel; WebKit; Wi-Fi",
      }),
    ],
  }),
  release({
    id: "version-watchos-3-1-3",
    releaseNotesUrl: U.watch3,
    overview:
      "watchOS 3.1.3 was released on January 23, 2017. Apple's consumer history characterizes it only as an improvements-and-bug-fixes update, while the dedicated advisory supplies concrete security scope.",
    overviewCitations: [
      c(U.watch3, "watchOS 3.1.3"),
      c(U.watch313Security, "Released January 23, 2017"),
      c(U.securityIndex, "watchOS 3.1.3 — 23 Jan 2017"),
    ],
    boundary:
      "Apple does not identify individual ordinary fixes for this version, so the maintenance entry remains deliberately broad. More specific statements are limited to issues named in the security advisory.",
    boundaryCitations: [
      c(U.watch3, "watchOS 3.1.3"),
      c(U.watch313Security, "watchOS 3.1.3 security content"),
    ],
    pageCitations: [
      c(U.watch3, "watchOS 3.1.3"),
      c(U.watch313Security, "Released January 23, 2017"),
      c(U.securityIndex, "watchOS 3.1.3 — 23 Jan 2017"),
    ],
    summary:
      "watchOS 3.1.3 reached the public channel on January 23, 2017 with broadly described maintenance and documented authorization, privacy, unlock, parser, kernel, certificate, and web security repairs.",
    publicText:
      "Apple released watchOS 3.1.3 on January 23, 2017 for all Apple Watch models. Its consumer note says the update contains improvements and bug fixes without naming them.",
    publicCitations: [
      c(U.watch3, "watchOS 3.1.3"),
      c(U.watch313Security, "Released January 23, 2017"),
    ],
    scopeText:
      "The advisory provides the only retained version-specific technical detail. Its later revision markers are treated as updates to Apple's published record rather than evidence that every entry was disclosed on release day.",
    scopeCitations: [
      c(U.watch3, "watchOS 3.1.3"),
      c(U.watch313Security, "Accounts through WebKit"),
    ],
    changes: [
      change({
        key: "watchos-3-1-3-maintenance",
        title: "General improvements and bug fixes",
        canonicalSummary:
          "Apple described watchOS 3.1.3 as containing improvements and bug fixes without enumerating them.",
        category: "enhancement",
        action: "changed",
        summary:
          "The retained consumer record confirms a maintenance update but does not support a more specific ordinary-change claim.",
        citations: [c(U.watch3, "watchOS 3.1.3")],
      }),
      securityChange({
        key: "watchos-3-1-3-authorization-privacy-unlock",
        title: "Authorization, connection privacy, and unlock repairs",
        canonicalSummary:
          "watchOS 3.1.3 corrected app authorization reset behavior, protected an APNs client certificate, and fixed off-wrist unlocking through a paired iPhone.",
        summary:
          "Apple documents three distinct state or privacy repairs involving permissions after app removal, certificate transmission over a network, and the wrist-detection condition for Unlock with iPhone.",
        url: U.watch313Security,
        locator: "Accounts; APNs Server; Unlock with iPhone",
      }),
      securityChange({
        key: "watchos-3-1-3-content-processing-security",
        title: "Media, font, image, archive, and certificate parsing repairs",
        canonicalSummary:
          "The update repaired memory-safety and validation problems in audio, strings, fonts, images, archives, and certificate profiles.",
        summary:
          "The advisory groups multiple crafted-content risks across media and data parsers, including code execution, information disclosure, and file-overwrite outcomes.",
        url: U.watch313Security,
        locator:
          "Audio; CoreFoundation; CoreGraphics; CoreMedia Playback; CoreText; FontParser; ImageIO; libarchive; Profiles",
      }),
      securityChange({
        key: "watchos-3-1-3-system-web-security",
        title: "Kernel, platform, certificate, and WebKit repairs",
        canonicalSummary:
          "watchOS 3.1.3 addressed kernel and I/O memory-safety issues, certificate and cipher handling, privilege risks, and malicious web content.",
        summary:
          "Apple's advisory records fixes for code execution, memory disclosure, denial of service, certificate trust, 3DES defaults, root privilege, and cross-origin web behavior.",
        url: U.watch313Security,
        locator:
          "Disk Images; IOHIDFamily; IOKit; Kernel; Security; syslog; WebKit",
      }),
    ],
  }),
  release({
    id: "version-watchos-3-2",
    releaseNotesUrl: U.watch3,
    overview:
      "watchOS 3.2 launched on March 27, 2017 with third-party Siri actions, Theater Mode, three additional Scribble languages, music-sync status, general maintenance, and a substantial security update.",
    overviewCitations: [
      c(U.watch3, "watchOS 3.2"),
      c(U.watch32Security, "Released March 27, 2017"),
      c(U.securityIndex, "watchOS 3.2 — 27 Mar 2017"),
    ],
    boundary:
      "Only the four named consumer changes are treated as specific ordinary deltas. Apple's additional improvements and bug fixes remain a broad maintenance entry because the source does not enumerate them.",
    boundaryCitations: [
      c(U.watch3, "watchOS 3.2"),
      c(U.watch32Security, "watchOS 3.2 security content"),
    ],
    pageCitations: [
      c(U.watch3, "watchOS 3.2"),
      c(U.watch32Security, "Released March 27, 2017"),
      c(U.securityIndex, "watchOS 3.2 — 27 Mar 2017"),
    ],
    summary:
      "watchOS 3.2 reached the public channel on March 27, 2017 with Siri app actions, Theater Mode, expanded Scribble language support, music-sync visibility, maintenance, and security repairs.",
    publicText:
      "Apple released watchOS 3.2 on March 27, 2017 for all Apple Watch models. The consumer history names four user-facing changes and also records unspecified improvements and bug fixes.",
    publicCitations: [
      c(U.watch3, "watchOS 3.2"),
      c(U.watch32Security, "Released March 27, 2017"),
    ],
    scopeText:
      "Specific product claims come from the version-labeled consumer section, while technical security claims come from the matching advisory. No beta-only or later 3.2.x behavior is projected onto this release.",
    scopeCitations: [
      c(U.watch3, "watchOS 3.2 through watchOS 3.2.3"),
      c(U.watch32Security, "watchOS 3.2 security content"),
    ],
    changes: [
      change({
        key: "watchos-3-2-siri-app-actions",
        title: "Siri actions in App Store apps",
        canonicalSummary:
          "Siri on Apple Watch gained support for compatible third-party app actions.",
        category: "feature",
        action: "introduced",
        summary:
          "Supported apps could expose actions such as beginning workouts, sending messages, making payments, and booking rides through Siri.",
        citations: [c(U.watch3, "watchOS 3.2 — Siri")],
      }),
      change({
        key: "watchos-3-2-theater-mode",
        title: "Theater Mode",
        canonicalSummary:
          "Theater Mode combined silent behavior with a display that stayed dark during wrist raises until tapped.",
        category: "feature",
        action: "introduced",
        summary:
          "The new setting reduced audible and visual interruptions while preserving on-demand access to the watch display.",
        citations: [c(U.watch3, "watchOS 3.2 — Theater Mode")],
      }),
      change({
        key: "watchos-3-2-scribble-languages",
        title: "French, Spanish, and Italian Scribble",
        canonicalSummary:
          "Scribble input expanded to French, Spanish, and Italian.",
        category: "feature",
        action: "introduced",
        summary:
          "The handwriting-based text input method became available in three additional languages.",
        citations: [c(U.watch3, "watchOS 3.2 — Scribble")],
      }),
      change({
        key: "watchos-3-2-music-sync-progress",
        title: "Music playlist sync progress",
        canonicalSummary:
          "The Apple Watch app on iPhone began displaying music-playlist synchronization progress.",
        category: "enhancement",
        action: "changed",
        summary:
          "Users gained visibility into the transfer state of music being prepared for playback from Apple Watch.",
        citations: [c(U.watch3, "watchOS 3.2 — Music playlist sync")],
      }),
      change({
        key: "watchos-3-2-maintenance",
        title: "Additional improvements and bug fixes",
        canonicalSummary:
          "Apple recorded additional watchOS 3.2 improvements and bug fixes without itemizing them.",
        category: "enhancement",
        action: "changed",
        summary:
          "The source supports a general maintenance delta but does not identify a feature or corrected behavior beyond the named changes.",
        citations: [c(U.watch3, "watchOS 3.2 introduction")],
      }),
      securityChange({
        key: "watchos-3-2-content-processing-security",
        title: "Media, font, image, and data-processing repairs",
        canonicalSummary:
          "watchOS 3.2 repaired crafted-content vulnerabilities in audio, fonts, graphics, images, HTTP/2, keyboards, archives, and XML processing.",
        summary:
          "Apple's advisory documents memory corruption, disclosure, resource-exhaustion, and code-execution risks across content-processing components and bundled libraries.",
        url: U.watch32Security,
        locator:
          "Audio; Carbon; CoreGraphics; CoreText; FontParser; HTTPProtocol; ImageIO; Keyboards; libarchive; libc++abi; libxslt",
      }),
      securityChange({
        key: "watchos-3-2-system-certificate-web-security",
        title: "Kernel, certificate, and WebKit repairs",
        canonicalSummary:
          "The update addressed kernel privilege and memory issues, certificate parsing, and malicious web-content risks.",
        summary:
          "The matching advisory records multiple kernel code-execution paths along with root-privilege, certificate-validation, type-confusion, resource-consumption, and use-after-free repairs.",
        url: U.watch32Security,
        locator: "Kernel; Security; WebKit",
      }),
    ],
  }),
  release({
    id: "version-watchos-3-2-2",
    releaseNotesUrl: U.watch3,
    overview:
      "watchOS 3.2.2 was released on May 15, 2017. Apple retained only a general improvements-and-bug-fixes description for ordinary behavior, accompanied by a detailed security advisory.",
    overviewCitations: [
      c(U.watch3, "watchOS 3.2.2"),
      c(U.watch322Security, "Released May 15, 2017"),
      c(U.securityIndex, "watchOS 3.2.2 — 15 May 2017"),
    ],
    boundary:
      "No named consumer feature or ordinary correction is available in Apple's version history, so this page does not invent one. Specificity is confined to the advisory's security components and impacts.",
    boundaryCitations: [
      c(U.watch3, "watchOS 3.2.2"),
      c(U.watch322Security, "watchOS 3.2.2 security content"),
    ],
    pageCitations: [
      c(U.watch3, "watchOS 3.2.2"),
      c(U.watch322Security, "Released May 15, 2017"),
      c(U.securityIndex, "watchOS 3.2.2 — 15 May 2017"),
    ],
    summary:
      "watchOS 3.2.2 reached the public channel on May 15, 2017 with broadly described maintenance plus documented video, audio, data, text, database, kernel, and web security repairs.",
    publicText:
      "Apple released watchOS 3.2.2 on May 15, 2017 for all Apple Watch models. The consumer record says only that it included improvements and bug fixes.",
    publicCitations: [
      c(U.watch3, "watchOS 3.2.2"),
      c(U.watch322Security, "Released May 15, 2017"),
    ],
    scopeText:
      "The security advisory supplies the technical detail; the generic maintenance wording is preserved without attempting to map it to a specific user-facing behavior.",
    scopeCitations: [
      c(U.watch3, "watchOS 3.2.2"),
      c(U.watch322Security, "AVEVideoEncoder through WebKit"),
    ],
    changes: [
      change({
        key: "watchos-3-2-2-maintenance",
        title: "General improvements and bug fixes",
        canonicalSummary:
          "Apple described watchOS 3.2.2 as containing improvements and bug fixes without enumerating them.",
        category: "enhancement",
        action: "changed",
        summary:
          "The retained consumer entry confirms maintenance work but does not support a more specific claim.",
        citations: [c(U.watch3, "watchOS 3.2.2")],
      }),
      securityChange({
        key: "watchos-3-2-2-data-media-security",
        title: "Video, audio, data, text, and database repairs",
        canonicalSummary:
          "watchOS 3.2.2 repaired memory-safety and validation issues in video encoding, audio, Foundation data parsing, CoreText, SQLite, and text input.",
        summary:
          "Apple's advisory describes crafted-input risks including kernel privilege, restricted-memory reads, code execution, denial of service, and SQL parser corruption.",
        url: U.watch322Security,
        locator:
          "AVEVideoEncoder; CoreAudio; CoreFoundation; CoreText; Foundation; SQLite; TextInput",
      }),
      securityChange({
        key: "watchos-3-2-2-kernel-web-security",
        title: "IOSurface, kernel, and WebKit repairs",
        canonicalSummary:
          "The update addressed platform race conditions, kernel memory handling, and malicious web-content execution.",
        summary:
          "The advisory records kernel-privilege and restricted-memory risks in IOSurface and the kernel, plus multiple WebKit memory-corruption issues.",
        url: U.watch322Security,
        locator: "IOSurface; Kernel; WebKit",
      }),
    ],
  }),
  release({
    id: "version-watchos-3-2-3",
    releaseNotesUrl: U.watch3,
    overview:
      "watchOS 3.2.3 was released on July 19, 2017. Apple's consumer entry remains a general maintenance statement, while the advisory identifies repairs in communications, kernel, libraries, interprocess services, and Wi-Fi.",
    overviewCitations: [
      c(U.watch3, "watchOS 3.2.3"),
      c(U.watch323Security, "Released July 19, 2017"),
      c(U.securityIndex, "watchOS 3.2.3 — 19 Jul 2017"),
    ],
    boundary:
      "The source does not name ordinary bug fixes, so none is inferred. The Wi-Fi claim is limited to the vulnerability and hardware scope stated by Apple rather than generalized into a connectivity improvement.",
    boundaryCitations: [
      c(U.watch3, "watchOS 3.2.3"),
      c(U.watch323Security, "Contacts through Wi-Fi"),
    ],
    pageCitations: [
      c(U.watch3, "watchOS 3.2.3"),
      c(U.watch323Security, "Released July 19, 2017"),
      c(U.securityIndex, "watchOS 3.2.3 — 19 Jul 2017"),
    ],
    summary:
      "watchOS 3.2.3 reached the public channel on July 19, 2017 with general maintenance and documented repairs for Contacts, Messages, USB, kernel, archive, XML, XPC, and Wi-Fi attack surfaces.",
    publicText:
      "Apple released watchOS 3.2.3 on July 19, 2017 for all Apple Watch models. Its consumer update history gives no detail beyond improvements and bug fixes.",
    publicCitations: [
      c(U.watch3, "watchOS 3.2.3"),
      c(U.watch323Security, "Released July 19, 2017"),
    ],
    scopeText:
      "Named technical statements follow Apple's dedicated advisory. Generic consumer maintenance is not expanded into undocumented feature or reliability claims.",
    scopeCitations: [
      c(U.watch3, "watchOS 3.2.3"),
      c(U.watch323Security, "Contacts through Wi-Fi"),
    ],
    changes: [
      change({
        key: "watchos-3-2-3-maintenance",
        title: "General improvements and bug fixes",
        canonicalSummary:
          "Apple described watchOS 3.2.3 as containing improvements and bug fixes without enumerating them.",
        category: "enhancement",
        action: "changed",
        summary:
          "The retained consumer record confirms maintenance work but leaves individual ordinary changes unspecified.",
        citations: [c(U.watch3, "watchOS 3.2.3")],
      }),
      securityChange({
        key: "watchos-3-2-3-communications-security",
        title: "Contacts and Messages input-handling repairs",
        canonicalSummary:
          "watchOS 3.2.3 repaired remotely triggerable memory and resource-handling problems in Contacts and Messages.",
        summary:
          "Apple documents a Contacts buffer overflow and a Messages memory-consumption problem that could cause termination or code execution outcomes.",
        url: U.watch323Security,
        locator: "Contacts; Messages",
      }),
      securityChange({
        key: "watchos-3-2-3-system-library-security",
        title: "USB, kernel, archive, XML, and XPC repairs",
        canonicalSummary:
          "The update addressed memory-safety and information-disclosure vulnerabilities in IOUSBFamily, the kernel, libarchive, libxml2, and libxpc.",
        summary:
          "The advisory records crafted-input and local-app risks spanning code execution at system or kernel privilege and disclosure of restricted information.",
        url: U.watch323Security,
        locator: "IOUSBFamily; Kernel; libarchive; libxml2; libxpc",
      }),
      securityChange({
        key: "watchos-3-2-3-wifi-security",
        title: "Wi-Fi chip memory-safety repair",
        canonicalSummary:
          "watchOS 3.2.3 repaired a Wi-Fi memory-corruption issue that could be reached by an attacker within radio range.",
        summary:
          "Apple's advisory identifies an arbitrary-code-execution risk on the Wi-Fi chip and attributes the correction to improved memory handling.",
        url: U.watch323Security,
        locator: "Wi-Fi",
      }),
    ],
  }),
];

records.push(...moreRecords);
finish();
