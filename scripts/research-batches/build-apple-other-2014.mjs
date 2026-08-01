import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const accessedAt = "2026-07-30";
const reviewedAt = "2026-07-30T05:38:23Z";

const U = {
  securityIndex: "https://support.apple.com/en-us/101445",
  preview:
    "https://www.apple.com/newsroom/2014/06/02Apple-Announces-OS-X-Yosemite/",
  launch:
    "https://www.apple.com/newsroom/2014/10/16OS-X-Yosemite-Available-Today-as-a-Free-Upgrade/",
  security: "https://support.apple.com/en-us/103394",
};

const sources = [
  {
    url: U.securityIndex,
    title: "Apple security updates (2014)",
    publisher: "Apple Support",
    sourceClass: "firstPartyDocumentation",
    author: "Apple",
    topics: ["Apple software", "2014", "release dates", "security updates"],
  },
  {
    url: U.preview,
    title: "Apple Announces OS X Yosemite",
    publisher: "Apple Newsroom",
    sourceClass: "firstPartyAnnouncement",
    author: "Apple",
    publishedAt: "2014-06-02T00:00:00.000Z",
    topics: ["OS X", "Yosemite", "10.10", "developer preview", "features"],
  },
  {
    url: U.launch,
    title: "OS X Yosemite Available Today as a Free Upgrade",
    publisher: "Apple Newsroom",
    sourceClass: "firstPartyAnnouncement",
    author: "Apple",
    publishedAt: "2014-10-16T00:00:00.000Z",
    topics: ["OS X", "Yosemite", "10.10", "availability", "features"],
  },
  {
    url: U.security,
    title: "About the security content of OS X Yosemite v10.10",
    publisher: "Apple Support",
    sourceClass: "firstPartyDocumentation",
    author: "Apple",
    topics: ["OS X", "Yosemite", "10.10", "security", "CVE"],
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
      "Matched Apple's dated public-launch announcement or version-specific security advisory to the existing audited Yosemite 10.10 public-release event.",
    citations,
  };
}

function securityChange({ key, title, canonicalSummary, summary, locator }) {
  return change({
    key,
    title,
    canonicalSummary,
    category: "security",
    action: "fixed",
    summary,
    citations: [c(U.security, locator)],
  });
}

const yosemiteChanges = [
  change({
    key: "macos-10-10-system-design",
    title: "Redesigned system appearance",
    canonicalSummary:
      "Yosemite refreshed the Mac interface with streamlined toolbars, translucency, redesigned icons, and a new system typeface.",
    category: "enhancement",
    action: "changed",
    summary:
      "The public release reworked core visual surfaces while retaining familiar Mac interaction patterns, giving content more room and using translucent sidebars and controls to convey context.",
    citations: [
      c(U.launch, "System redesign paragraphs"),
      c(U.preview, "June 2 design announcement"),
    ],
  }),
  change({
    key: "macos-10-10-handoff",
    title: "Handoff between Mac and iOS devices",
    canonicalSummary:
      "Handoff let supported Mac and iOS apps transfer an in-progress activity from one nearby device to another.",
    category: "feature",
    action: "introduced",
    summary:
      "A user could begin work such as composing mail or browsing the web on one supported device and continue the same activity on another, subject to Apple's Continuity requirements.",
    citations: [
      c(U.launch, "Continuity paragraph; Handoff"),
      c(U.preview, "Continuity and Handoff paragraphs"),
    ],
  }),
  change({
    key: "macos-10-10-instant-hotspot",
    title: "Instant Hotspot",
    canonicalSummary:
      "Instant Hotspot simplified connecting a Mac to a nearby iPhone's personal hotspot.",
    category: "feature",
    action: "introduced",
    summary:
      "Yosemite exposed an eligible iPhone hotspot through the Mac's network workflow without a separate manual setup sequence; carrier availability still applied.",
    citations: [
      c(U.launch, "Continuity paragraph; Instant Hotspot; footnotes"),
      c(U.preview, "Continuity paragraph; carrier qualification"),
    ],
  }),
  change({
    key: "macos-10-10-cross-platform-airdrop",
    title: "AirDrop between Mac and iOS",
    canonicalSummary:
      "AirDrop expanded to exchange content directly between supported Macs and iOS devices.",
    category: "enhancement",
    action: "changed",
    summary:
      "The release removed the earlier same-platform boundary from Apple's nearby file-sharing workflow, allowing compatible Mac and iOS devices to send content to one another.",
    citations: [c(U.launch, "Continuity paragraph; AirDrop")],
  }),
  change({
    key: "macos-10-10-sms-mms-relay",
    title: "SMS and MMS relay on Mac",
    canonicalSummary:
      "Messages on Mac could display and send SMS and MMS traffic relayed through a nearby iPhone.",
    category: "feature",
    action: "introduced",
    summary:
      "Yosemite extended the Mac messaging experience beyond iMessage by using a compatible iPhone to relay carrier text and multimedia messages across a user's devices.",
    citations: [
      c(U.launch, "Continuity paragraph; SMS messages"),
      c(U.preview, "Continuity paragraph; SMS and MMS"),
    ],
  }),
  change({
    key: "macos-10-10-iphone-calling",
    title: "iPhone calls on Mac",
    canonicalSummary:
      "A Mac could place and receive cellular calls through a nearby compatible iPhone.",
    category: "feature",
    action: "introduced",
    summary:
      "The Continuity calling path let the Mac act as a speakerphone for the user's iPhone, with Apple's cellular-charge and device-capability qualifications still in force.",
    citations: [
      c(U.launch, "Continuity paragraph; iPhone calls; footnotes"),
      c(U.preview, "Continuity calling paragraph; cellular qualification"),
    ],
  }),
  change({
    key: "macos-10-10-notification-center-today-widgets",
    title: "Notification Center Today view and widgets",
    canonicalSummary:
      "Notification Center gained a Today view with Apple information panels and support for downloadable widgets.",
    category: "feature",
    action: "introduced",
    summary:
      "The new view collected timely information such as calendars, weather, stocks, reminders, clocks, and social activity, and it could be extended with compatible Mac App Store widgets.",
    citations: [
      c(U.launch, "Feature list; Today view"),
      c(U.preview, "Today view paragraph"),
    ],
  }),
  change({
    key: "macos-10-10-spotlight-rich-results",
    title: "Spotlight rich results",
    canonicalSummary:
      "Spotlight moved to a prominent desktop search interface and added results from Apple services, maps, reference material, the web, news, and showtimes.",
    category: "enhancement",
    action: "changed",
    summary:
      "Yosemite broadened Spotlight from local search into a combined discovery surface that could return contextual information from several online and on-device categories.",
    citations: [
      c(U.launch, "Feature list; Spotlight"),
      c(U.preview, "Spotlight paragraph"),
    ],
  }),
  change({
    key: "macos-10-10-icloud-drive",
    title: "iCloud Drive in Finder",
    canonicalSummary:
      "iCloud Drive exposed cloud files as a Finder location with folders, tags, search, and access from supported Apple devices and Windows PCs.",
    category: "feature",
    action: "introduced",
    summary:
      "The release gave users a general-purpose file hierarchy for organizing arbitrary document types in iCloud and reaching them across supported platforms.",
    citations: [
      c(U.launch, "Feature list; iCloud Drive"),
      c(U.preview, "iCloud Drive paragraph"),
    ],
  }),
  change({
    key: "macos-10-10-safari-redesign-efficiency",
    title: "Streamlined Safari with efficiency improvements",
    canonicalSummary:
      "Safari adopted a simplified interface, while Apple reported faster browsing performance and longer Mac battery life for web and Netflix HD video.",
    category: "enhancement",
    action: "changed",
    summary:
      "The Yosemite launch positioned Safari around a content-first layout and efficiency gains. The performance and battery statements are Apple's launch claims rather than independent benchmark findings.",
    citations: [
      c(U.launch, "Feature list; Safari"),
      c(
        U.preview,
        "Safari design, standards, and Apple testing footnotes",
        "Used only to explain the scope and test-qualified nature of Apple's own performance claims.",
      ),
    ],
  }),
  change({
    key: "macos-10-10-mail-markup",
    title: "Markup in Mail",
    canonicalSummary:
      "Mail added tools for annotating images and completing or signing forms and PDFs without leaving a message.",
    category: "feature",
    action: "introduced",
    summary:
      "The composer gained an integrated attachment-editing workflow for common review, annotation, form-completion, and signature tasks.",
    citations: [
      c(U.launch, "Feature list; Mail Markup"),
      c(U.preview, "Mail paragraph; Markup"),
    ],
  }),
  change({
    key: "macos-10-10-mail-drop",
    title: "Mail Drop for large attachments",
    canonicalSummary:
      "Mail Drop provided an Apple-hosted delivery path for attachments as large as 5 GB.",
    category: "feature",
    action: "introduced",
    summary:
      "Yosemite let Mail users send files that would commonly exceed email attachment limits, with the launch material setting a maximum size of 5 GB.",
    citations: [
      c(U.launch, "Feature list; Mail Drop"),
      c(U.preview, "Mail paragraph; Mail Drop"),
    ],
  }),
  change({
    key: "macos-10-10-messages-group-controls",
    title: "Expanded Messages conversation controls",
    canonicalSummary:
      "Messages added controls for group membership, shared locations, conversation attachments, and notification muting.",
    category: "enhancement",
    action: "changed",
    summary:
      "The public release made group threads easier to manage by allowing participant changes, location viewing, quick attachment access, and per-conversation notification suppression.",
    citations: [c(U.launch, "Feature list; Messages")],
  }),
  change({
    key: "macos-10-10-itunes-12-redesign",
    title: "iTunes 12 redesign and Recents",
    canonicalSummary:
      "iTunes 12 introduced a new interface, simpler library-to-store navigation, and a Recents view for recently acquired or played media.",
    category: "enhancement",
    action: "changed",
    summary:
      "The bundled media app was reorganized to reduce friction between a user's collection and store discovery while surfacing recent activity in one place.",
    citations: [c(U.launch, "Feature list; iTunes 12")],
  }),
  change({
    key: "macos-10-10-family-sharing",
    title: "Family Sharing purchases",
    canonicalSummary:
      "Family Sharing let participating family members browse and download one another's eligible Apple media and Mac App Store purchases.",
    category: "feature",
    action: "introduced",
    summary:
      "Yosemite brought the shared-purchase side of Apple's family account model to the Mac across supported iTunes, iBooks, and Mac App Store content.",
    citations: [c(U.launch, "Feature list; Family Sharing")],
  }),
  change({
    key: "macos-10-10-swift",
    title: "Swift development language",
    canonicalSummary:
      "Yosemite's developer platform included Apple's new Swift programming language for building OS X and iOS software.",
    category: "developerApi",
    action: "introduced",
    summary:
      "Apple presented Swift as a modern language integrated into its application-development stack, with goals that included interactivity, reliability, and safer implementation.",
    citations: [c(U.launch, "Developer platform paragraph; Swift")],
  }),
  change({
    key: "macos-10-10-spritekit-scenekit",
    title: "Expanded SpriteKit and SceneKit game tools",
    canonicalSummary:
      "SpriteKit gained richer motion, lighting, and physics workflows and could be combined with SceneKit for animated 3D scenes.",
    category: "developerApi",
    action: "changed",
    summary:
      "The Yosemite developer stack expanded Apple's first-party frameworks for constructing two-dimensional game behavior and integrating it with three-dimensional scene content.",
    citations: [
      c(U.launch, "Developer platform paragraph; SpriteKit and SceneKit"),
    ],
  }),
  change({
    key: "macos-10-10-free-upgrade-compatibility",
    title: "Free Mac App Store upgrade and hardware baseline",
    canonicalSummary:
      "Apple distributed Yosemite as a free Mac App Store upgrade for Macs from 2009 onward and selected 2007 and 2008 models.",
    category: "compatibility",
    action: "changed",
    summary:
      "The broad installation baseline remained wider than the eligibility for every Continuity capability; Apple separately noted that some cross-device features required newer Bluetooth LE and Wi-Fi hardware and iOS 8.1.",
    citations: [
      c(U.launch, "Pricing & Availability; Continuity footnotes"),
      c(U.securityIndex, "OS X Yosemite v10.10 — 16 Oct 2014"),
    ],
  }),
  securityChange({
    key: "macos-10-10-network-transport-security",
    title: "Network credential and transport repairs",
    canonicalSummary:
      "Yosemite's security baseline addressed Wi-Fi credential exposure, AFP address disclosure, Bluetooth pairing, certificate policy, and SSL 3.0 transport risks.",
    summary:
      "Apple's advisory records hardening across enterprise Wi-Fi authentication, file sharing, Bluetooth input connections, certificate trust, and Secure Transport, including its response to the SSL 3.0 CBC weakness.",
    locator:
      "802.1X; AFP File Server; Bluetooth; Certificate Trust Policy; Secure Transport",
  }),
  securityChange({
    key: "macos-10-10-access-session-signing-security",
    title: "Access control, session, and code-signing repairs",
    canonicalSummary:
      "The release tightened app sandbox access, screen-lock behavior, encrypted-volume state, account sessions, configuration profiles, and application signature validation.",
    summary:
      "The version-specific advisory documents authorization, state-management, persistence, and signature-validation corrections spanning the sandbox, Dock, storage encryption, Lost Mode, login, profiles, SecurityAgent, and code signing.",
    locator:
      "App Sandbox; CFPreferences; CoreStorage; Dock; fdesetup; iCloud Find My Mac; LaunchServices; LoginWindow; MCX Desktop Config Profiles; Security; Security - Code Signing",
  }),
  securityChange({
    key: "macos-10-10-kernel-driver-filesystem-security",
    title: "Kernel, driver, and filesystem repairs",
    canonicalSummary:
      "Yosemite repaired memory-safety, validation, disclosure, privilege, and denial-of-service vulnerabilities in drivers, IOKit, filesystems, and the kernel.",
    summary:
      "Apple's advisory covers graphics and input drivers, IOKit data queues, HFS handling, Mach ports, IPv6 processing, system-control sockets, and early-boot hardening randomness.",
    locator: "IOAcceleratorFamily; IOHIDFamily; IOKit; Kernel security content",
  }),
  securityChange({
    key: "macos-10-10-app-library-security",
    title: "Application and bundled-library repairs",
    canonicalSummary:
      "The initial Yosemite security release updated server components and repaired issues in Mail, file sharing, QuickTime, Safari, and related system services.",
    summary:
      "Apple documented Apache and Bash updates plus corrections for unintended mail recipients, file-sharing state, malicious audio processing, Safari history and push behavior, and ASN.1 parsing. The advisory also states that Safari 8 incorporated Safari 7.1 security content.",
    locator:
      "apache; Bash; Mail; NetFS Client Framework; QuickTime; Safari; Security; Safari 8 note",
  }),
];

const version = {
  releaseVersionId: "version-macos-10-10",
  authorship: "originalSynthesis",
  releaseNotesUrl: U.launch,
  overview: article(
    heading("Release overview"),
    prose(
      "OS X Yosemite 10.10 reached the Mac App Store on October 16, 2014. The major release combined a broad visual redesign with Continuity, cloud-file, search, notification, browser, mail, messaging, media, family-account, developer-platform, compatibility, and security changes.",
      [
        c(U.launch, "October 16, 2014; launch overview and feature list"),
        c(U.securityIndex, "OS X Yosemite v10.10 — 16 Oct 2014"),
        c(U.security, "OS X Yosemite v10.10 security content"),
      ],
    ),
    heading("Development and release"),
    prose(
      "Apple announced Yosemite on June 2 and made a developer preview available that day. It also announced a customer beta program for later in the summer. The retained launch announcement then confirms October 16 as the public availability date; this article attaches editorial content only to that durable public route.",
      [
        c(U.preview, "June 2, 2014; developer preview and beta-program timing"),
        c(U.launch, "October 16, 2014; Pricing & Availability"),
      ],
    ),
    heading("Design and cross-device workflow"),
    prose(
      "The release revised core interface materials and typography while adding several ways for compatible Macs and iOS devices to cooperate: activity handoff, easier hotspot access, cross-platform AirDrop, carrier-message relay, and iPhone calling.",
      [
        c(U.launch, "System redesign and Continuity paragraphs"),
        c(U.preview, "Design and Continuity paragraphs"),
      ],
    ),
    heading("Apps, services, and developer platform"),
    prose(
      "Yosemite added Today widgets, broader Spotlight results, Finder-based iCloud Drive, new Safari and Mail workflows, richer Messages controls, iTunes 12, and Family Sharing. Apple also tied the release to Swift and expanded SpriteKit and SceneKit tooling.",
      [
        c(U.launch, "Feature list and developer platform paragraph"),
        c(U.preview, "Apps and developer platform paragraphs"),
      ],
    ),
    heading("Evidence boundary"),
    prose(
      "The structured public-release changes below require confirmation in Apple's October launch material or its version-specific 10.10 advisory. June-only preview details are not promoted into public deltas, later 10.10.x fixes are not projected backward, comparative Safari statements remain attributed to Apple, and no build number or undocumented behavior is inferred.",
      [
        c(U.preview, "June 2 developer-preview scope"),
        c(U.launch, "October 16 public-launch scope and test qualifications"),
        c(U.securityIndex, "OS X Yosemite v10.10 and v10.10.1 release lines"),
        c(U.security, "OS X Yosemite v10.10 security content"),
      ],
    ),
  ),
  citations: [
    c(U.preview, "June 2, 2014"),
    c(U.launch, "October 16, 2014"),
    c(U.securityIndex, "OS X Yosemite v10.10 — 16 Oct 2014"),
    c(U.security, "OS X Yosemite v10.10"),
  ],
  provenanceStatus: "editoriallyVerified",
  editorialReview: review(),
};

const event = {
  target: {
    releaseVersionId: "version-macos-10-10",
    routeAlias: "public",
  },
  authorship: "originalSynthesis",
  summary:
    "OS X Yosemite 10.10 reached the public channel on October 16, 2014 with a redesigned Mac experience, new cross-device workflows, expanded apps and services, developer technologies, broad compatibility, and a documented security baseline.",
  article: article(
    heading("Public release"),
    prose(
      "Apple made Yosemite available on October 16, 2014 as a free download from the Mac App Store. Apple's archived 2014 security index independently places OS X Yosemite v10.10 on the same date and lists Mac OS X 10.6.8 or later as the upgrade audience.",
      [
        c(U.launch, "October 16, 2014; Pricing & Availability"),
        c(U.securityIndex, "OS X Yosemite v10.10 — 16 Oct 2014"),
      ],
    ),
    heading("What this page records"),
    prose(
      "The release entries synthesize the confirmed launch package across system design, Continuity, Notification Center, Spotlight, iCloud Drive, Safari, Mail, Messages, iTunes, Family Sharing, developer frameworks, installation compatibility, and the initial Yosemite security advisory.",
      [
        c(U.launch, "Launch overview through developer platform paragraph"),
        c(U.security, "OS X Yosemite v10.10 security content"),
      ],
    ),
    heading("Availability qualifications"),
    prose(
      "Apple described a broad Mac hardware baseline but imposed narrower requirements on some Continuity features. Those features depended on iOS 8.1 and, in some cases, newer Bluetooth LE and Wi-Fi capabilities; hotspot and calling also remained subject to carrier service and possible cellular charges.",
      [c(U.launch, "Pricing & Availability and feature footnotes")],
    ),
    heading("Version boundary"),
    prose(
      "This event is the initial 10.10 public release only. Apple's 2014 index separately lists 10.10.1 on November 17, but the local catalog has no corresponding durable version route, so that point release and its fixes are excluded rather than folded into Yosemite 10.10.",
      [
        c(
          U.securityIndex,
          "OS X Yosemite v10.10 — 16 Oct 2014; OS X Yosemite v10.10.1 — 17 Nov 2014",
        ),
      ],
    ),
  ),
  citations: [
    c(U.launch, "October 16, 2014; Pricing & Availability"),
    c(U.securityIndex, "OS X Yosemite v10.10 — 16 Oct 2014"),
    c(U.security, "OS X Yosemite v10.10"),
  ],
  changes: yosemiteChanges,
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
    item.publicReleaseDate?.startsWith("2014-"),
);

if (
  eligibleSeedVersions.length !== 1 ||
  eligibleSeedVersions[0].platform !== "macOS" ||
  eligibleSeedVersions[0].version !== "10.10" ||
  eligibleSeedVersions[0].publicReleaseDate !== "2014-10-16" ||
  eligibleSeedVersions[0].milestones.length !== 2
) {
  throw new Error(
    "The 2014 non-iOS/iPadOS seed inventory changed; re-audit this cohort before regenerating.",
  );
}

if (
  bundle.versions.length !== 1 ||
  bundle.events.length !== 1 ||
  bundle.builds.length !== 0 ||
  bundle.events[0].changes.length !== 22
) {
  throw new Error("The expected 2014 bundle closure no longer holds.");
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
writeFileSync(join(here, "apple-other-2014.json"), json);
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

const md = `# Apple 2014 non-iPhone research batch

## Result

\`apple-other-2014.json\` is a source-backed launch-content bundle for every existing local non-iOS/iPadOS release version whose audited public appearance falls in 2014. The exact cohort is one data-rich OS X Yosemite 10.10 article and its durable public event, written as original synthesis with claim-level citations.

## Exact local coverage

| Platform family | Existing versions covered | Local milestones | Public appearances | Structured changes |
| --- | --- | ---: | ---: | ---: |
| macOS | 10.10 (Yosemite) | 2 | 1 | ${yosemiteChanges.length} |
| watchOS | None; the platform did not yet exist | 0 | 0 | 0 |
| tvOS | None in the local catalog | 0 | 0 | 0 |
| **Total** | **1 version article** | **2** | **1** | **${yosemiteChanges.length}** |

The local Yosemite record contains a June 2 milestone labeled \`Beta 1\` and an October 16 public milestone. Apple's June announcement calls the June 2 software a developer preview and says a separate customer beta program would follow during the summer. This bundle enriches only the durable public route through \`releaseVersionId: "version-macos-10-10"\` plus \`routeAlias: "public"\`.

## Editorial and evidence policy

- Authorship is \`originalSynthesis\` throughout.
- Both version and event records are \`editoriallyVerified\` and \`approved\` as of ${reviewedAt}.
- The public event is indexable after editorial approval.
- All ${yosemiteChanges.length} changes are \`documented\`, \`confirmed\`, and public-release \`delta\` entries.
- No undocumented-change claim is included.
- No June-only preview feature is silently promoted into the October public release.
- No 10.10.1 or later cumulative change is projected backward.
- No build record is included and no build number is inferred.
- Apple's comparative Safari statements are identified as Apple claims, not independent benchmark findings.
- Security entries group related remediation surfaces without reproducing Apple's advisory prose.
- Apple product names are used nominatively; no Apple artwork, logos, screenshots, or copied publisher body text is included.

## Inventory and chronology boundaries

1. The seed contains exactly one non-iOS/iPadOS version with a 2014 public appearance: macOS-family record 10.10, named Yosemite, with two local milestones.
2. Apple's June 2 announcement confirms a developer preview on the local beta date and announces a later customer beta program. Because the local seed has no separate public-beta route, this batch creates no beta event content and makes no claim about the later beta's exact date.
3. Apple's October launch announcement and archived 2014 security index both support the existing October 16 public date.
4. The product was named OS X Yosemite in Apple's 2014 material. The local information architecture groups the historical release under the \`macOS\` platform family; the editorial copy retains the historical OS X name.
5. Apple's archived index separately lists OS X Yosemite 10.10.1 on November 17, 2014. The local catalog has no 10.10.1 releaseVersion record, so this existing-record-only batch does not create or merge that point release.
6. Apple's 2014 index also lists several releases under the historical Apple TV software naming scheme. The local catalog has no corresponding 2014 tvOS version routes, and this batch does not relabel or manufacture them.

## Source ledger

All ${sources.length} declared sources are human-readable first-party Apple pages checked on ${accessedAt}; all ${sources.length} are cited by the bundle.

- <${U.securityIndex}> — archived 2014 release chronology, Yosemite 10.10 availability, and the missing 10.10.1 boundary
- <${U.preview}> — June 2 announcement, same-day developer preview, later customer-beta plan, and launch-season feature context
- <${U.launch}> — October 16 public availability, confirmed launch features, compatibility, and qualifications
- <${U.security}> — version-specific Yosemite 10.10 security content

Apple Support pages are living or archived documents and can display publication or revision dates later than the historical release. Historical mapping therefore uses the explicitly labeled version and release line, not the page's current revision timestamp.

## Known gaps

1. OS X Yosemite 10.10.1 is an Apple-documented 2014 release absent from the scoped local catalog. It remains out of scope until an inventory expansion creates a durable version and event record.
2. The seed's June 2 \`Beta 1\` label is broader than Apple's precise \`developer preview\` wording. The date is supported, but this batch does not alter the seed or attach beta-specific release notes.
3. The customer OS X Beta Program announced for later in summer 2014 has no separate local event route and is not created here.
4. Preview-only details that Apple did not repeat in its October public-launch material are not structured as confirmed public deltas.
5. No community-sourced undocumented claim was added; that requires a separate reproducible or independently corroborated evidence pass.
6. The security advisory is a retained document that can receive later editorial revisions. These summaries describe Apple's currently published record for 10.10, not proof that every line appeared in its present wording on launch day.
7. Feature availability remains subject to Apple's original hardware, operating-system, service, carrier, and network qualifications.

## Validation

- Research-batch validation passed with ${bundle.versions.length} version, ${bundle.events.length} public event, ${yosemiteChanges.length} globally consistent change keys, ${sources.length} sources, and ${citationReferenceCount(bundle)} citation references for this file.
- Inventory closure passed: exactly 1 eligible seed version, 2 milestones, 1 public appearance, 1 non-public milestone, ${sources.length} of ${sources.length} declared sources cited, and zero build records.
- The launch-content schema assertion passed.
- Focused launch-ingestion and research-tool tests passed: 23 of 23.
- ESLint and Prettier checks passed for the deterministic generator.
- A second generator run reproduced the JSON and Markdown byte-for-byte.
- Reviewed production plan: 25 creates, 3 revision-guarded patches, and 2,081 unchanged documents.
- Creates: 3 source documents and ${yosemiteChanges.length} change documents; zero version, event, or build creates. The plan included the existing Yosemite version patch, the existing durable public-event patch, and one source metadata patch.
- Mutation payload: 61,912 bytes, reported as 1.6% of the guarded limit.
- Applied production plan SHA: \`00daa7a4f0383830ba911953a9441c3980f255814b9620331f544d5e486aa49c\`.
- Production transaction \`eOgq1Ovu5XNUv1qNFUdZPj\` committed successfully and the guarded apply completed with zero residual mutations.
- Approved bundle JSON SHA-256: \`${jsonSha}\`.
- Post-apply zero-residual plan SHA: \`11359cc4b14e0393c1295e6886c24c0bb003e5cc5a91ba7262c3d93e44189fb5\`.
- Local smoke checks returned HTTP 200 and rendered sourced editorial content for \`/apple/macos/10.10\`.
`;

writeFileSync(join(here, "apple-other-2014.md"), md);
