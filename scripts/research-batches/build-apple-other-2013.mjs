import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const accessedAt = "2026-07-30";
const reviewedAt = "2026-07-30T05:42:52Z";

const U = {
  securityIndex: "https://support.apple.com/en-us/100502",
  preview:
    "https://www.apple.com/newsroom/2013/06/10Apple-Releases-Developer-Preview-of-OS-X-Mavericks-With-More-Than-200-New-Features/",
  launch:
    "https://www.apple.com/newsroom/2013/10/23OS-X-Mavericks-Available-Today-Free-from-the-Mac-App-Store/",
  power:
    "https://www.apple.com/media/us/osx/2013/docs/OSX_Power_Efficiency_Technology_Overview.pdf",
  security: "https://support.apple.com/en-us/103373",
};

const sources = [
  {
    url: U.securityIndex,
    title: "Apple security updates (2013)",
    publisher: "Apple Support",
    sourceClass: "firstPartyDocumentation",
    author: "Apple",
    topics: ["Apple software", "2013", "release dates", "security updates"],
  },
  {
    url: U.preview,
    title:
      "Apple Releases Developer Preview of OS X Mavericks With More Than 200 New Features",
    publisher: "Apple Newsroom",
    sourceClass: "firstPartyAnnouncement",
    author: "Apple",
    publishedAt: "2013-06-10T00:00:00.000Z",
    topics: ["OS X", "Mavericks", "10.9", "developer preview", "features"],
  },
  {
    url: U.launch,
    title: "OS X Mavericks Available Today Free from the Mac App Store",
    publisher: "Apple Newsroom",
    sourceClass: "firstPartyAnnouncement",
    author: "Apple",
    publishedAt: "2013-10-22T00:00:00.000Z",
    topics: ["OS X", "Mavericks", "10.9", "availability", "features"],
  },
  {
    url: U.power,
    title: "Power Efficiency in OS X",
    publisher: "Apple",
    sourceClass: "firstPartyDocumentation",
    author: "Apple",
    topics: [
      "OS X",
      "Mavericks",
      "10.9",
      "power efficiency",
      "developer technology",
    ],
  },
  {
    url: U.security,
    title: "About the security content of OS X Mavericks v10.9",
    publisher: "Apple Support",
    sourceClass: "firstPartyDocumentation",
    author: "Apple",
    topics: ["OS X", "Mavericks", "10.9", "security", "CVE"],
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
      "Matched Apple's dated public-launch material, October 2013 technical documentation, or version-specific security advisory to the existing audited Mavericks 10.9 public-release event.",
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

const mavericksChanges = [
  change({
    key: "macos-10-9-ibooks",
    title: "iBooks on Mac",
    canonicalSummary:
      "Mavericks brought iBooks libraries, store access, reading position, notes, and highlights to the Mac.",
    category: "feature",
    action: "introduced",
    summary:
      "The new Mac app connected a user's eligible book collection and reading state across supported Apple devices, extending Apple's reading service beyond iPhone and iPad.",
    citations: [
      c(U.launch, "Feature list; iBooks"),
      c(U.preview, "iBooks paragraph"),
    ],
  }),
  change({
    key: "macos-10-9-maps",
    title: "Maps on Mac",
    canonicalSummary:
      "Mavericks added a desktop Maps app with trip planning that could send directions to an iPhone for navigation.",
    category: "feature",
    action: "introduced",
    summary:
      "The public release created a Mac planning surface for Apple Maps and a handoff path that moved a prepared route to a supported iPhone for voice guidance.",
    citations: [
      c(U.launch, "Feature list; Maps"),
      c(U.preview, "Maps paragraph"),
    ],
  }),
  change({
    key: "macos-10-9-calendar-travel-context",
    title: "Calendar travel context",
    canonicalSummary:
      "Calendar added estimated travel time along with event-related map and weather context.",
    category: "enhancement",
    action: "changed",
    summary:
      "The redesigned scheduling app could place appointments in geographic context and estimate the time required to reach them.",
    citations: [c(U.launch, "Feature list; Calendar")],
  }),
  change({
    key: "macos-10-9-safari-shared-links",
    title: "Safari Shared Links",
    canonicalSummary:
      "Safari added Shared Links, a unified view of web links posted by followed Twitter and LinkedIn accounts.",
    category: "feature",
    action: "introduced",
    summary:
      "The browser gained a social discovery feed that collected links from supported accounts inside Safari instead of requiring separate service views.",
    citations: [
      c(U.launch, "Feature list; Safari Shared Links"),
      c(U.preview, "Safari paragraph; Shared Links"),
    ],
  }),
  change({
    key: "macos-10-9-icloud-keychain",
    title: "iCloud Keychain",
    canonicalSummary:
      "iCloud Keychain stored supported website credentials, payment-card details, and Wi-Fi passwords and synchronized them to trusted devices.",
    category: "feature",
    action: "introduced",
    summary:
      "Mavericks introduced an encrypted Apple-managed credential store intended to reduce repeated entry of common account, network, and checkout information across a user's devices.",
    citations: [
      c(U.launch, "Feature list; iCloud Keychain"),
      c(
        U.preview,
        "Additional features; iCloud Keychain and AES-256 description",
      ),
    ],
  }),
  change({
    key: "macos-10-9-multiple-displays",
    title: "Expanded multiple-display support",
    canonicalSummary:
      "Mavericks improved multi-display use so windowed and full-screen apps could operate on the chosen display without a separate configuration step.",
    category: "enhancement",
    action: "changed",
    summary:
      "The release reduced restrictions around full-screen workflows across more than one display and made the desktop arrangement more independent per screen.",
    citations: [
      c(U.launch, "Feature list; multi-display support"),
      c(U.preview, "Multiple displays paragraph"),
    ],
  }),
  change({
    key: "macos-10-9-interactive-notifications",
    title: "Interactive notifications",
    canonicalSummary:
      "Notifications gained inline actions for replying to messages, responding to FaceTime calls, and deleting email.",
    category: "feature",
    action: "introduced",
    summary:
      "Users could complete several common communication actions directly from a notification without switching away from the application they were using.",
    citations: [
      c(U.launch, "Feature list; interactive Notifications"),
      c(U.preview, "Additional features; interactive Notifications"),
    ],
  }),
  change({
    key: "macos-10-9-finder-tabs",
    title: "Finder Tabs",
    canonicalSummary:
      "Finder Tabs consolidated multiple file-browser views into one window with separate tabs.",
    category: "feature",
    action: "introduced",
    summary:
      "Mavericks brought a tabbed workflow to Finder so users could organize several locations in a single window and reduce desktop clutter.",
    citations: [
      c(U.launch, "Feature list; Finder Tabs"),
      c(U.preview, "Finder Tabs paragraph"),
    ],
  }),
  change({
    key: "macos-10-9-finder-tags",
    title: "Finder Tags",
    canonicalSummary:
      "Finder Tags provided a metadata-based way to organize and retrieve files stored locally or in iCloud.",
    category: "feature",
    action: "introduced",
    summary:
      "Users could classify documents by project or category independently of their folder location and browse those classifications from Finder.",
    citations: [
      c(U.launch, "Feature list; Finder Tags"),
      c(U.preview, "Finder Tags paragraph"),
    ],
  }),
  change({
    key: "macos-10-9-timer-coalescing",
    title: "Timer Coalescing",
    canonicalSummary:
      "Timer Coalescing aligned noncritical timer work so the processor could remain idle for longer intervals.",
    category: "feature",
    action: "introduced",
    summary:
      "The operating system shifted eligible timer execution within small priority-sensitive windows, combining wakeups from multiple processes to reduce unnecessary CPU activity.",
    citations: [
      c(U.launch, "Core technologies; Timer Coalescing"),
      c(U.power, "Pages 3–4; Timer Coalescing"),
    ],
  }),
  change({
    key: "macos-10-9-app-nap",
    title: "App Nap",
    canonicalSummary:
      "App Nap reduced CPU, disk, and network activity for eligible applications that were not visible or actively needed.",
    category: "feature",
    action: "introduced",
    summary:
      "Mavericks could place qualifying background apps into a lower-power state using timer and I/O throttling plus reduced process priority, while excluding foreground and certain active applications.",
    citations: [
      c(U.launch, "Core technologies; App Nap"),
      c(U.power, "Pages 2–3; App Nap"),
    ],
  }),
  change({
    key: "macos-10-9-compressed-memory",
    title: "Compressed Memory",
    canonicalSummary:
      "Compressed Memory reduced the footprint of inactive data and restored it when needed.",
    category: "feature",
    action: "introduced",
    summary:
      "When memory pressure increased, Mavericks compressed inactive contents in place to preserve responsiveness and available capacity rather than treating them at full size.",
    citations: [
      c(U.launch, "Core technologies; Compressed Memory"),
      c(U.preview, "Core technologies; Compressed Memory"),
    ],
  }),
  change({
    key: "macos-10-9-integrated-graphics-performance",
    title: "Integrated graphics optimizations",
    canonicalSummary:
      "Mavericks improved integrated-graphics performance through optimized OpenCL support and dynamic video-memory allocation.",
    category: "enhancement",
    action: "changed",
    summary:
      "The release adjusted compute and memory handling for Macs with integrated graphics, with the performance characterization coming from Apple's launch material.",
    citations: [c(U.launch, "Core technologies; integrated graphics")],
  }),
  change({
    key: "macos-10-9-centralized-task-scheduling",
    title: "Centralized Task Scheduling",
    canonicalSummary:
      "Centralized Task Scheduling deferred or suppressed eligible maintenance and background work while a Mac was on battery power.",
    category: "feature",
    action: "introduced",
    summary:
      "The system coordinated recurring background tasks around power state so nonessential work could happen later or only while external power was available.",
    citations: [c(U.power, "Page 3; Centralized Task Scheduling")],
  }),
  change({
    key: "macos-10-9-energy-usage-visibility",
    title: "Per-app energy visibility",
    canonicalSummary:
      "Activity Monitor and the battery menu exposed application energy use to help identify software consuming significant power.",
    category: "feature",
    action: "introduced",
    summary:
      "Mavericks added user-facing diagnostics for current and historical energy demand, including a battery-menu signal for applications using substantial energy.",
    citations: [
      c(U.power, "Pages 5–6; Activity Monitor and Battery status menu"),
    ],
  }),
  change({
    key: "macos-10-9-power-developer-tools",
    title: "Power measurement tools and APIs",
    canonicalSummary:
      "Mavericks added powermetrics and energy-management APIs that helped developers inspect usage and communicate scheduling needs.",
    category: "developerApi",
    action: "introduced",
    summary:
      "Developers gained command-line CPU power metrics plus interfaces for long-running operations and timer tolerance, complementing the system's automatic power management.",
    citations: [
      c(U.power, "Pages 6–7; powermetrics and APIs"),
      c(U.preview, "Xcode 5 energy-use tooling"),
    ],
  }),
  change({
    key: "macos-10-9-free-upgrade-compatibility",
    title: "Free upgrade and Mountain Lion hardware baseline",
    canonicalSummary:
      "Apple offered Mavericks free through the Mac App Store to Macs capable of running Mountain Lion, with direct upgrades from Snow Leopard, Lion, or Mountain Lion.",
    category: "compatibility",
    action: "changed",
    summary:
      "The release established a no-cost major OS X upgrade and retained the preceding Mountain Lion hardware baseline, while allowing installation from three prior system generations.",
    citations: [
      c(U.launch, "Pricing & Availability"),
      c(U.securityIndex, "OS X Mavericks v10.9 — 22 Oct 2013"),
    ],
  }),
  securityChange({
    key: "macos-10-9-network-session-security",
    title: "Firewall, session, and transport repairs",
    canonicalSummary:
      "Mavericks repaired application-firewall enforcement, Safari session-cookie clearing, and encrypted-transport weaknesses.",
    summary:
      "Apple's advisory records corrections to blocked-app handling, removal of reset Safari session cookies, and adoption of TLS 1.2 in CFNetwork to mitigate weaknesses in older protocol modes.",
    locator: "Application Firewall; CFNetwork; CFNetwork SSL",
  }),
  securityChange({
    key: "macos-10-9-sandbox-file-launch-security",
    title: "Sandbox, launch, and filename repairs",
    canonicalSummary:
      "The initial security baseline tightened sandboxed process launches, unsafe log-entry links, and deceptive filename-extension display.",
    summary:
      "The advisory describes an App Sandbox escape path, changes Console links to preview rather than execute directly, and filters unsafe Unicode characters that could disguise a file extension.",
    locator: "App Sandbox; Console; LaunchServices",
  }),
  securityChange({
    key: "macos-10-9-display-input-lock-security",
    title: "Display, input, authorization, and screen-lock repairs",
    canonicalSummary:
      "Mavericks addressed lock-screen visibility, secure-input capture, administrator authorization, delayed locking, hibernation wake, and power-management lock behavior.",
    summary:
      "Apple documents state, validation, and authorization corrections spanning CoreGraphics, security preferences, power assertions, and two separate screen-lock paths.",
    locator:
      "CoreGraphics; Power Management; Security - Authorization; Screen Lock",
  }),
  securityChange({
    key: "macos-10-9-kernel-driver-runtime-security",
    title: "Kernel, driver, extension, and runtime repairs",
    canonicalSummary:
      "The release repaired memory, validation, disclosure, privilege, persistence, and denial-of-service problems across the kernel, drivers, extensions, and runtime loader.",
    summary:
      "Apple's advisory covers Bluetooth and USB controllers, IOKit and serial drivers, dyld persistence, multiple kernel interfaces and network paths, and authorization for loaded kernel-extension management.",
    locator:
      "Bluetooth; dyld; IOKitUser; IOSerialFamily; Kernel; Kext Management; USB",
  }),
  securityChange({
    key: "macos-10-9-mail-remote-service-security",
    title: "Mail and remote-service repairs",
    canonicalSummary:
      "Mavericks corrected Mail authentication, signature display, and transport behavior along with Screen Sharing and guest-log exposure.",
    summary:
      "The advisory records safer account-authentication selection, accurate signed-message presentation, improved Kerberos mail transport handling, a VNC username vulnerability repair, and tighter guest access to prior log messages.",
    locator:
      "Mail Accounts; Mail Header Display; Mail Networking; Screen Sharing Server; syslog",
  }),
  securityChange({
    key: "macos-10-9-library-certificate-security",
    title: "Bundled-library and certificate repairs",
    canonicalSummary:
      "The initial release updated curl, Perl, Python, and Ruby security behavior and tightened certificate and directory-service handling.",
    summary:
      "Apple's advisory documents library updates for code-execution, denial-of-service, and transport risks, disables most use of MD5-signed X.509 certificates, and corrects OpenLDAP and smart-card certificate checks.",
    locator:
      "curl; Libc; OpenLDAP; perl; python; ruby; Security; Security - Smart Card Services",
  }),
];

const version = {
  releaseVersionId: "version-macos-10-9",
  authorship: "originalSynthesis",
  releaseNotesUrl: U.launch,
  overview: article(
    heading("Release overview"),
    prose(
      "OS X Mavericks 10.9 reached the Mac App Store on October 22, 2013. The major release combined new Maps and iBooks apps with Finder organization, multi-display work, interactive notifications, credential syncing, browser and calendar changes, power and memory technologies, developer tooling, a free-upgrade policy, and a broad security baseline.",
      [
        c(U.launch, "October 22, 2013; launch overview and feature list"),
        c(U.securityIndex, "OS X Mavericks v10.9 — 22 Oct 2013"),
        c(U.power, "OS X Mavericks Power Technologies"),
        c(U.security, "OS X Mavericks v10.9 security content"),
      ],
    ),
    heading("Development and release"),
    prose(
      "Apple released the Mavericks developer preview to Mac Developer Program members on June 10 and said the public version would arrive from the Mac App Store in the fall. The retained launch announcement and security index both identify October 22 as public availability.",
      [
        c(U.preview, "June 10, 2013; preview availability"),
        c(U.launch, "October 22, 2013; Pricing & Availability"),
        c(U.securityIndex, "OS X Mavericks v10.9 — 22 Oct 2013"),
      ],
    ),
    heading("Apps and desktop workflow"),
    prose(
      "Mavericks extended Apple services to the Mac through iBooks, Maps, and iCloud Keychain, while adding travel context in Calendar, Shared Links in Safari, actionable notifications, independent multi-display work, and tab-and-tag organization in Finder.",
      [
        c(U.launch, "Feature list"),
        c(U.preview, "Apps, Finder, displays, and notifications paragraphs"),
      ],
    ),
    heading("Efficiency and platform technology"),
    prose(
      "Timer Coalescing, App Nap, Compressed Memory, centralized task scheduling, graphics optimizations, energy-usage views, powermetrics, and scheduling APIs formed the documented performance and power package. These descriptions follow Apple's launch-era technical record and do not treat Apple's performance characterizations as independent benchmarks.",
      [
        c(U.launch, "Core technologies paragraph"),
        c(U.power, "Pages 2–7; Mavericks power technologies"),
      ],
    ),
    heading("Evidence boundary"),
    prose(
      "The structured public-release changes require support from Apple's October launch announcement, October technical paper, or version-specific 10.9 advisory. June-only preview details are not promoted into public deltas, 10.9.1 and later work is not projected backward, and no build number or undocumented behavior is inferred.",
      [
        c(U.preview, "June 10 developer-preview scope"),
        c(U.launch, "October 22 public-launch scope"),
        c(U.securityIndex, "OS X Mavericks v10.9 and v10.9.1 release lines"),
        c(U.power, "October 2013 footer and Mavericks scope"),
        c(U.security, "OS X Mavericks v10.9 security content"),
      ],
    ),
  ),
  citations: [
    c(U.preview, "June 10, 2013"),
    c(U.launch, "October 22, 2013"),
    c(U.securityIndex, "OS X Mavericks v10.9 — 22 Oct 2013"),
    c(U.power, "OS X Mavericks Power Technologies"),
    c(U.security, "OS X Mavericks v10.9"),
  ],
  provenanceStatus: "editoriallyVerified",
  editorialReview: review(),
};

const event = {
  target: {
    releaseVersionId: "version-macos-10-9",
    routeAlias: "public",
  },
  authorship: "originalSynthesis",
  summary:
    "OS X Mavericks 10.9 reached the public channel on October 22, 2013 with new apps and Finder workflows, expanded desktop and notification behavior, power and memory technologies, free-upgrade compatibility, and documented security repairs.",
  article: article(
    heading("Public release"),
    prose(
      "Apple made Mavericks available on October 22, 2013 as a free Mac App Store download. Apple's archived 2013 security index independently assigns the same date and lists Mac OS X 10.6.8 or later as the available-for baseline.",
      [
        c(U.launch, "October 22, 2013; Pricing & Availability"),
        c(U.securityIndex, "OS X Mavericks v10.9 — 22 Oct 2013"),
      ],
    ),
    heading("What this page records"),
    prose(
      "The structured entries synthesize the confirmed public package across iBooks, Maps, Calendar, Safari, iCloud Keychain, displays, notifications, Finder, energy use, memory, graphics, developer diagnostics, compatibility, and the initial Mavericks security advisory.",
      [
        c(U.launch, "Launch overview through core technologies"),
        c(U.power, "Mavericks power technologies"),
        c(U.security, "OS X Mavericks v10.9 security content"),
      ],
    ),
    heading("Date and availability boundary"),
    prose(
      "The Apple Newsroom URL contains a path segment dated October 23, but the page header and dateline say October 22, and Apple's separate 2013 security index also says October 22. The article therefore retains the local October 22 date and treats the URL path as an archival routing inconsistency.",
      [
        c(
          U.launch,
          "URL path /2013/10/23; page header and dateline October 22, 2013",
        ),
        c(U.securityIndex, "OS X Mavericks v10.9 — 22 Oct 2013"),
      ],
    ),
    heading("Version boundary"),
    prose(
      "This event represents the initial 10.9 public release only. Apple's 2013 index separately lists Mavericks 10.9.1 on December 16, but the local catalog has no corresponding durable version route, so that update is excluded rather than merged into 10.9.",
      [
        c(
          U.securityIndex,
          "OS X Mavericks v10.9 — 22 Oct 2013; OS X Mavericks v10.9.1 — 16 Dec 2013",
        ),
      ],
    ),
  ),
  citations: [
    c(U.launch, "October 22, 2013; Pricing & Availability"),
    c(U.securityIndex, "OS X Mavericks v10.9 — 22 Oct 2013"),
    c(U.power, "OS X Mavericks Power Technologies"),
    c(U.security, "OS X Mavericks v10.9"),
  ],
  changes: mavericksChanges,
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
    item.publicReleaseDate?.startsWith("2013-"),
);

if (
  eligibleSeedVersions.length !== 1 ||
  eligibleSeedVersions[0].platform !== "macOS" ||
  eligibleSeedVersions[0].version !== "10.9" ||
  eligibleSeedVersions[0].publicReleaseDate !== "2013-10-22" ||
  eligibleSeedVersions[0].milestones.length !== 2
) {
  throw new Error(
    "The 2013 non-iOS/iPadOS seed inventory changed; re-audit this cohort before regenerating.",
  );
}

if (
  bundle.versions.length !== 1 ||
  bundle.events.length !== 1 ||
  bundle.builds.length !== 0 ||
  bundle.events[0].changes.length !== 23
) {
  throw new Error("The expected 2013 bundle closure no longer holds.");
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
writeFileSync(join(here, "apple-other-2013.json"), json);
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

const md = `# Apple 2013 non-iPhone research batch

## Result

\`apple-other-2013.json\` is a source-backed launch-content bundle for every existing local non-iOS/iPadOS release version whose audited public appearance falls in 2013. The exact cohort is one data-rich OS X Mavericks 10.9 article and its durable public event, written as copyright-safe original synthesis with claim-level citations.

## Exact local coverage

| Platform family | Existing versions covered | Local milestones | Public appearances | Structured changes |
| --- | --- | ---: | ---: | ---: |
| macOS | 10.9 (Mavericks) | 2 | 1 | ${mavericksChanges.length} |
| watchOS | None; the platform did not yet exist | 0 | 0 | 0 |
| tvOS | None in the local catalog | 0 | 0 | 0 |
| **Total** | **1 version article** | **2** | **1** | **${mavericksChanges.length}** |

The local Mavericks record contains a June 10 milestone labeled \`Beta 1\` and an October 22 public milestone. Apple's June announcement precisely identifies the June 10 software as a developer preview for Mac Developer Program members. This bundle enriches only the durable public route through \`releaseVersionId: "version-macos-10-9"\` plus \`routeAlias: "public"\`.

## Editorial and evidence policy

- Authorship is \`originalSynthesis\` throughout.
- Both version and event records are \`editoriallyVerified\` and \`approved\` as of ${reviewedAt}.
- The public event is indexable after editorial approval.
- All ${mavericksChanges.length} changes are \`documented\`, \`confirmed\`, and public-release \`delta\` entries.
- No undocumented-change claim is included.
- No June-only preview feature is silently promoted into the October public release.
- No 10.9.1 or later cumulative change is projected backward.
- No build record is included and no build number is inferred.
- Apple's performance and efficiency descriptions remain attributed first-party claims rather than independent benchmark findings.
- Security entries group related remediation surfaces without reproducing Apple's advisory prose.
- Apple product names are used nominatively; no Apple artwork, logos, screenshots, or copied publisher body text is included.

## Inventory and chronology boundaries

1. The seed contains exactly one non-iOS/iPadOS version with a 2013 public appearance: macOS-family record 10.9, named Mavericks, with two local milestones.
2. Apple's June 10 announcement confirms a same-day developer preview. The batch does not attach event content to that non-public milestone.
3. The launch announcement's URL contains \`/2013/10/23\`, but its visible press-release date and dateline both say October 22. Apple's separate security index also dates Mavericks 10.9 to October 22, so the local October 22 public date is retained.
4. The product was named OS X Mavericks in Apple's 2013 material. The local information architecture groups the historical release under the \`macOS\` platform family; editorial copy retains the historical OS X name.
5. Apple's archived index separately lists OS X Mavericks 10.9.1 on December 16, 2013. The local catalog has no 10.9.1 releaseVersion record, so this existing-record-only batch does not create or merge that point release.
6. Apple's 2013 index also lists releases under the historical Apple TV software naming scheme. The local catalog has no corresponding 2013 tvOS version routes, and this batch does not relabel or manufacture them.

## Source ledger

All ${sources.length} declared sources are human-readable first-party Apple materials checked on ${accessedAt}; all ${sources.length} are cited by the bundle.

- <${U.securityIndex}> — archived 2013 release chronology, Mavericks 10.9 availability, and the missing 10.9.1 boundary
- <${U.preview}> — June 10 developer-preview availability and launch-season feature context
- <${U.launch}> — October 22 public availability, confirmed launch features, compatibility, and the URL/date anomaly
- <${U.power}> — October 2013 technical detail for Mavericks power technologies, user diagnostics, tools, and APIs
- <${U.security}> — version-specific Mavericks 10.9 security content

Apple Support pages are living or archived documents and can display publication or revision dates later than the historical release. Historical mapping therefore uses the explicitly labeled version and release line, not the page's current revision timestamp.

## Known gaps

1. OS X Mavericks 10.9.1 is an Apple-documented 2013 release absent from the scoped local catalog. It remains out of scope until an inventory expansion creates a durable version and event record.
2. The Newsroom launch page's path says October 23 while its own visible date and a separate first-party index say October 22. No one-day shift is made from the URL path.
3. The seed's June 10 \`Beta 1\` label is broader than Apple's precise \`developer preview\` wording. This batch does not alter the seed or attach beta-specific release notes.
4. Preview-only details that Apple did not repeat in the October launch announcement or launch-era technical record are not structured as confirmed public deltas.
5. No community-sourced undocumented claim was added; that requires a separate reproducible or independently corroborated evidence pass.
6. The security advisory is a retained document that can receive later editorial revisions. These summaries describe Apple's currently published record for 10.9, not proof that every line appeared in its present wording on launch day.
7. The power-efficiency paper is Apple-authored technical material. Its qualitative and quantitative performance characterizations are vendor claims, not independent test results.

## Validation

- Research-batch validation passed with ${bundle.versions.length} version, ${bundle.events.length} public event, ${mavericksChanges.length} globally consistent change keys, ${sources.length} sources, and ${citationReferenceCount(bundle)} citation references for this file.
- Inventory closure passed: exactly 1 eligible seed version, 2 milestones, 1 public appearance, 1 non-public milestone, ${sources.length} of ${sources.length} declared sources cited, and zero build records.
- The launch-content schema assertion passed.
- Focused launch-ingestion and research-tool tests passed: 23 of 23.
- ESLint and Prettier checks passed for the deterministic generator.
- A second generator run reproduced the JSON and Markdown byte-for-byte.
- Reviewed production plan: 27 creates, 3 revision-guarded patches, and 2,081 unchanged documents.
- Creates: 4 source documents and ${mavericksChanges.length} change documents; zero version, event, or build creates. The plan included the existing Mavericks version patch, the existing durable public-event patch, and one source metadata patch.
- Mutation payload: 66,203 bytes, reported as 1.7% of the guarded limit.
- Applied production plan SHA: \`a81de2d38eb227bc9dc20169abadd26fc72adcf5f692981a7ea9a4af22603c87\`.
- Production transaction \`eOgq1Ovu5XNUv1qNFUdiMZ\` committed successfully and the guarded apply completed with zero residual mutations.
- Approved bundle JSON SHA-256: \`${jsonSha}\`.
- Post-apply zero-residual plan SHA: \`16618b525036d9c980c615260da688abdc297f8c75b7f610f64757f655a36c00\`.
- Local smoke checks returned HTTP 200 and rendered sourced editorial content for \`/apple/macos/10.9\`.
`;

writeFileSync(join(here, "apple-other-2013.md"), md);
