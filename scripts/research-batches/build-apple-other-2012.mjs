import { createHash } from "node:crypto";
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const accessedAt = "2026-07-30";
const reviewedAt = "2026-07-30T05:46:31Z";

const U = {
  securityIndex: "https://support.apple.com/en-us/101444",
  preview:
    "https://www.apple.com/newsroom/2012/02/16Apple-Releases-OS-X-Mountain-Lion-Developer-Preview-with-Over-100-New-Features/",
  juneAnnouncement:
    "https://www.apple.com/newsroom/2012/06/11Mountain-Lion-Available-in-July-From-Mac-App-Store/",
  launch:
    "https://www.apple.com/newsroom/2012/07/25Mountain-Lion-Available-Today-From-the-Mac-App-Store/",
  postLaunch:
    "https://www.apple.com/newsroom/2012/07/30Mountain-Lion-Downloads-Top-Three-Million/",
};

const sources = [
  {
    url: U.securityIndex,
    title: "Apple security updates (2011 to 2012)",
    publisher: "Apple Support",
    sourceClass: "firstPartyDocumentation",
    author: "Apple",
    publishedAt: "2023-08-10T00:00:00.000Z",
    topics: [
      "Apple software",
      "2012",
      "release chronology",
      "security updates",
    ],
  },
  {
    url: U.preview,
    title:
      "Apple Releases OS X Mountain Lion Developer Preview with Over 100 New Features",
    publisher: "Apple Newsroom",
    sourceClass: "firstPartyAnnouncement",
    author: "Apple",
    publishedAt: "2012-02-16T00:00:00.000Z",
    topics: ["OS X", "Mountain Lion", "10.8", "developer preview"],
  },
  {
    url: U.juneAnnouncement,
    title: "Mountain Lion Available in July From Mac App Store",
    publisher: "Apple Newsroom",
    sourceClass: "firstPartyAnnouncement",
    author: "Apple",
    publishedAt: "2012-06-11T00:00:00.000Z",
    topics: [
      "OS X",
      "Mountain Lion",
      "10.8",
      "planned availability",
      "features",
    ],
  },
  {
    url: U.launch,
    title: "Mountain Lion Available Today From the Mac App Store",
    publisher: "Apple Newsroom",
    sourceClass: "firstPartyAnnouncement",
    author: "Apple",
    publishedAt: "2012-07-25T00:00:00.000Z",
    topics: ["OS X", "Mountain Lion", "10.8", "availability", "features"],
  },
  {
    url: U.postLaunch,
    title: "Mountain Lion Downloads Top Three Million",
    publisher: "Apple Newsroom",
    sourceClass: "firstPartyAnnouncement",
    author: "Apple",
    publishedAt: "2012-07-30T00:00:00.000Z",
    topics: [
      "OS X",
      "Mountain Lion",
      "10.8",
      "post-launch confirmation",
      "downloads",
    ],
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
      "Matched Apple's July 25 public-availability announcement to the existing audited OS X Mountain Lion 10.8 public event; any additional citation supplies context without replacing launch confirmation.",
    citations,
  };
}

const mountainLionChanges = [
  change({
    key: "macos-10-8-icloud-account-setup",
    title: "Integrated iCloud account setup",
    canonicalSummary:
      "Mountain Lion integrated iCloud setup for Mail, Contacts, Calendar, Messages, Reminders, and Notes.",
    category: "enhancement",
    action: "changed",
    summary:
      "The release brought several built-in communication and productivity apps into one iCloud-oriented setup flow instead of treating each service as a separate account experience.",
    citations: [
      c(U.launch, "Feature list; iCloud integration"),
      c(U.postLaunch, "July 30 feature confirmation; iCloud setup"),
    ],
  }),
  change({
    key: "macos-10-8-icloud-content-sync",
    title: "Cross-device iCloud content synchronization",
    canonicalSummary:
      "Mountain Lion kept supported app data and iWork documents current across a user's Apple devices.",
    category: "enhancement",
    action: "changed",
    summary:
      "Eligible documents, notes, reminders, and other supported information could remain synchronized so work begun on a Mac or mobile Apple device could continue elsewhere.",
    citations: [
      c(U.launch, "Launch overview and feature list; iCloud and iWork"),
      c(U.postLaunch, "July 30 feature confirmation; iCloud and iWork"),
    ],
  }),
  change({
    key: "macos-10-8-messages-imessage",
    title: "Messages and iMessage on Mac",
    canonicalSummary:
      "The new Messages app replaced iChat and brought iMessage conversations to the Mac.",
    category: "feature",
    action: "introduced",
    summary:
      "Mac users gained an iMessage client for communicating with supported Macs, iPhones, iPads, and iPod touch devices, replacing iChat as the primary built-in messaging app.",
    citations: [
      c(U.launch, "Feature list; Messages"),
      c(U.postLaunch, "July 30 feature confirmation; Messages"),
    ],
  }),
  change({
    key: "macos-10-8-notification-center",
    title: "Notification Center",
    canonicalSummary:
      "Notification Center collected alerts from system services, built-in apps, and third-party apps in one place.",
    category: "feature",
    action: "introduced",
    summary:
      "Mountain Lion added a consolidated notification surface for Mail, Calendar, Messages, Reminders, system updates, and compatible third-party software.",
    citations: [
      c(U.launch, "Feature list; Notification Center"),
      c(U.postLaunch, "July 30 feature confirmation; Notification Center"),
    ],
  }),
  change({
    key: "macos-10-8-system-wide-sharing",
    title: "System-wide Sharing",
    canonicalSummary:
      "Mountain Lion added a common sharing workflow for links, photos, videos, and files.",
    category: "feature",
    action: "introduced",
    summary:
      "Apps could expose a shared system action for sending supported content without forcing users to switch to a separate app, with single sign-in support for named third-party services.",
    citations: [
      c(
        U.launch,
        "Feature list; system-wide Sharing",
        "Facebook-specific integration is excluded because Apple's launch footnote deferred it.",
      ),
      c(U.postLaunch, "July 30 feature confirmation; system-wide Sharing"),
    ],
  }),
  change({
    key: "macos-10-8-dictation",
    title: "System-wide Dictation",
    canonicalSummary:
      "Dictation accepted spoken text anywhere a compatible Apple or third-party app allowed typing.",
    category: "feature",
    action: "introduced",
    summary:
      "The release made speech-to-text input available as a system capability rather than limiting it to one built-in application.",
    citations: [
      c(U.launch, "Feature list; Dictation"),
      c(U.postLaunch, "July 30 feature confirmation; Dictation"),
    ],
  }),
  change({
    key: "macos-10-8-airplay-mirroring",
    title: "AirPlay Mirroring",
    canonicalSummary:
      "AirPlay Mirroring could send a secure stream of the Mac display at up to 1080p to an HDTV through Apple TV.",
    category: "feature",
    action: "introduced",
    summary:
      "Mountain Lion added wireless display mirroring to compatible Apple TV hardware, with Apple's final launch material raising the stated ceiling from the developer preview's 720p description to up to 1080p.",
    citations: [
      c(U.launch, "Feature list; AirPlay Mirroring"),
      c(
        U.preview,
        "Developer preview; 720p AirPlay Mirroring",
        "Used only to document the superseded preview specification.",
      ),
    ],
  }),
  change({
    key: "macos-10-8-airplay-audio",
    title: "System audio output over AirPlay",
    canonicalSummary:
      "Mountain Lion could send Mac audio to compatible AirPlay receivers or speakers.",
    category: "feature",
    action: "introduced",
    summary:
      "The public release extended its AirPlay support beyond display mirroring to compatible audio playback equipment.",
    citations: [c(U.launch, "Feature list; AirPlay audio")],
  }),
  change({
    key: "macos-10-8-game-center",
    title: "Game Center on Mac",
    canonicalSummary:
      "Mountain Lion brought Game Center and live cross-device multiplayer support to the Mac.",
    category: "feature",
    action: "introduced",
    summary:
      "The Mac joined Apple's social gaming network, allowing compatible games to connect players across Mac, iPhone, iPad, and iPod touch.",
    citations: [
      c(U.launch, "Feature list; Game Center"),
      c(U.postLaunch, "July 30 feature confirmation; Game Center"),
    ],
  }),
  change({
    key: "macos-10-8-gatekeeper",
    title: "Gatekeeper",
    canonicalSummary:
      "Gatekeeper added system controls intended to make software downloaded from the Internet safer to install.",
    category: "security",
    action: "introduced",
    summary:
      "Mountain Lion introduced a trust-policy layer for downloaded Mac applications. The structured claim stays at the mechanism confirmed by Apple's public-launch announcement and does not infer a launch CVE repair set.",
    citations: [
      c(U.launch, "Additional features; Gatekeeper"),
      c(
        U.juneAnnouncement,
        "Gatekeeper controls and Developer ID description",
        "Pre-release detail for a feature explicitly confirmed at public launch.",
      ),
    ],
  }),
  change({
    key: "macos-10-8-power-nap",
    title: "Power Nap",
    canonicalSummary:
      "Power Nap let compatible Macs refresh supported apps and system information while asleep.",
    category: "feature",
    action: "introduced",
    summary:
      "The release added a low-interruption background-update mode for supported Mac hardware; the public record does not imply that every Mountain Lion-compatible Mac supported it.",
    citations: [
      c(U.launch, "Additional features; Power Nap"),
      c(
        U.juneAnnouncement,
        "Power Nap hardware and refresh details",
        "Pre-release compatibility context for a feature explicitly confirmed at public launch.",
      ),
    ],
  }),
  change({
    key: "macos-10-8-safari-performance",
    title: "Safari performance update",
    canonicalSummary:
      "Mountain Lion included a Safari version that Apple described as faster than its predecessor.",
    category: "enhancement",
    action: "changed",
    summary:
      "Apple's public announcement characterized the bundled browser as faster. The entry preserves that as a vendor-authored launch claim and does not present it as an independent benchmark result.",
    citations: [c(U.launch, "Additional features; faster Safari")],
  }),
  change({
    key: "macos-10-8-chinese-input-dictionary",
    title: "Chinese text input and dictionary improvements",
    canonicalSummary:
      "Mountain Lion improved Chinese text input and added a Chinese Dictionary.",
    category: "enhancement",
    action: "changed",
    summary:
      "The release expanded built-in language support for Chinese users through revised text entry and a dedicated reference dictionary.",
    citations: [c(U.launch, "New features for China; input and dictionary")],
  }),
  change({
    key: "macos-10-8-china-service-setup-search",
    title: "China-focused account setup and web search",
    canonicalSummary:
      "Mountain Lion added easier setup for popular Chinese email providers and Baidu as a Safari search option.",
    category: "enhancement",
    action: "changed",
    summary:
      "The system reduced account-configuration friction for supported regional mail services and exposed a major Chinese search provider inside Safari.",
    citations: [
      c(U.launch, "New features for China; email setup and Baidu search"),
    ],
  }),
  change({
    key: "macos-10-8-china-sharing-services",
    title: "China-focused social and video sharing",
    canonicalSummary:
      "Mountain Lion integrated sharing to Sina Weibo, Youku, and Tudou.",
    category: "feature",
    action: "introduced",
    summary:
      "The system-wide sharing model included regional microblogging and video destinations for Chinese users.",
    citations: [
      c(U.launch, "New features for China; Sina Weibo, Youku, and Tudou"),
    ],
  }),
  change({
    key: "macos-10-8-app-store-upgrade-path",
    title: "Mac App Store upgrade delivery",
    canonicalSummary:
      "Mountain Lion was distributed through the Mac App Store as an upgrade from Lion or Snow Leopard.",
    category: "compatibility",
    action: "changed",
    summary:
      "Apple used the Mac App Store as the public delivery path and allowed eligible installations to move directly from either of the two preceding OS X generations.",
    citations: [
      c(U.launch, "Launch overview and Pricing & Availability"),
      c(U.postLaunch, "July 30 availability confirmation"),
    ],
  }),
  change({
    key: "macos-10-8-installation-requirements",
    title: "Mountain Lion installation baseline",
    canonicalSummary:
      "Apple required OS X 10.6.8 or later, 2 GB of memory, and 8 GB of available storage for the Mountain Lion upgrade.",
    category: "compatibility",
    action: "changed",
    summary:
      "The public launch defined minimum software, memory, and free-space requirements; model-specific feature support could still vary beyond those baseline conditions.",
    citations: [c(U.launch, "Pricing & Availability; system requirements")],
  }),
];

const version = {
  releaseVersionId: "version-macos-10-8",
  authorship: "originalSynthesis",
  releaseNotesUrl: U.launch,
  overview: article(
    heading("Release overview"),
    prose(
      "OS X Mountain Lion 10.8 became available from the Mac App Store on July 25, 2012. Its documented launch package centered on iCloud continuity, Messages, Notification Center, system sharing, Dictation, AirPlay, Game Center, Gatekeeper, Power Nap, Safari, regional services, and a lower-cost digital upgrade path.",
      [
        c(U.launch, "July 25, 2012; overview through Pricing & Availability"),
        c(U.postLaunch, "July 30 availability and feature confirmation"),
      ],
    ),
    heading("Development and release"),
    prose(
      "Apple issued a developer preview on February 16 and described a late-summer target, then announced in June that Mountain Lion would arrive in July. The July 25 announcement is the controlling source for the actual public date and shipped feature set.",
      [
        c(U.preview, "February 16 developer-preview availability"),
        c(U.juneAnnouncement, "June 11 planned July availability"),
        c(U.launch, "July 25 public availability"),
      ],
    ),
    heading("Cross-device workflow"),
    prose(
      "At launch, iCloud could configure supported built-in apps and synchronize eligible information and iWork documents. Messages extended iMessage to the Mac, while Notification Center and the common sharing layer reorganized how apps surfaced alerts and sent content.",
      [
        c(U.launch, "Feature list; iCloud through system-wide Sharing"),
        c(U.postLaunch, "July 30 feature confirmation"),
      ],
    ),
    heading("Media, input, and regional services"),
    prose(
      "Dictation worked in compatible text fields, AirPlay supported display mirroring and audio output, Game Center connected compatible multiplayer games across Apple devices, and the release added Chinese input, dictionary, account, search, microblogging, and video-sharing integrations.",
      [c(U.launch, "Feature list; Dictation through features for China")],
    ),
    heading("Launch impact"),
    prose(
      "On July 30, Apple reported more than three million Mountain Lion downloads in the first four days. That figure is retained as an attributed vendor report rather than an independently audited adoption estimate.",
      [c(U.postLaunch, "July 30 download report")],
    ),
    heading("Evidence boundary"),
    prose(
      "Structured changes require explicit support from Apple's July 25 public-launch announcement. Earlier materials are used only for development context, for a detail attached to a launch-confirmed feature, or to document a superseded claim. Facebook integration is excluded because Apple said it would arrive in a later software update; preview-only developer APIs are also excluded.",
      [
        c(U.preview, "Developer-preview feature and API sections"),
        c(U.juneAnnouncement, "Pre-release feature details; Facebook footnote"),
        c(U.launch, "Public feature list; Facebook footnote"),
      ],
    ),
    heading("Security and version boundary"),
    prose(
      "Gatekeeper is recorded as a confirmed launch security feature, but no launch CVE repair set is inferred. Apple's archived 2011–2012 security index does not list Mountain Lion 10.8 as a July 25 security release and instead begins retained Mountain Lion update coverage with 10.8.2 on September 19.",
      [
        c(U.launch, "Additional features; Gatekeeper"),
        c(
          U.securityIndex,
          "2012 security-release table; Safari 6.0 and Mountain Lion 10.8.2 entries",
        ),
      ],
    ),
  ),
  citations: [
    c(U.preview, "February 16 developer preview"),
    c(U.juneAnnouncement, "June 11 pre-release announcement"),
    c(U.launch, "July 25 public availability"),
    c(U.postLaunch, "July 30 post-launch confirmation"),
    c(U.securityIndex, "2012 security-release chronology"),
  ],
  provenanceStatus: "editoriallyVerified",
  editorialReview: review(),
};

const event = {
  target: {
    releaseVersionId: "version-macos-10-8",
    routeAlias: "public",
  },
  authorship: "originalSynthesis",
  summary:
    "OS X Mountain Lion 10.8 reached the public channel on July 25, 2012 with cross-device services, communication, notifications, sharing, media, input, security, regional, delivery, and compatibility changes.",
  article: article(
    heading("Public release"),
    prose(
      "Apple made OS X Mountain Lion available on July 25, 2012 as a Mac App Store download for eligible Lion and Snow Leopard systems. A separate July 30 follow-up in Apple's publication trail confirms the release had been available for four days.",
      [
        c(U.launch, "July 25, 2012; availability and upgrade path"),
        c(U.postLaunch, "July 30 report; four days of availability"),
      ],
    ),
    heading("Confirmed shipped scope"),
    prose(
      "The structured entries summarize the public announcement's iCloud setup and synchronization, Messages, Notification Center, sharing, Dictation, AirPlay, Game Center, Gatekeeper, Power Nap, Safari, China-focused services, Mac App Store delivery, and installation requirements.",
      [c(U.launch, "Feature list through Pricing & Availability")],
    ),
    heading("Preview versus public evidence"),
    prose(
      "The February record is explicitly a developer preview, not a public release. The June announcement describes planned July behavior, while the July 25 page controls the launch record. Developer-only graphics, video, Multi-Touch, and other API claims that were not repeated in the public-launch material are not promoted into structured public changes.",
      [
        c(U.preview, "Developer-preview availability and API sections"),
        c(U.juneAnnouncement, "Planned July availability"),
        c(U.launch, "July 25 public availability and feature list"),
      ],
    ),
    heading("Explicitly deferred at launch"),
    prose(
      "Although Facebook integration appears in Apple's launch feature list, the page's footnote says that integration would arrive in an upcoming Mountain Lion software update. It is therefore not recorded as introduced in the 10.8 launch delta.",
      [c(U.launch, "Facebook feature item and deferral footnote")],
    ),
    heading("AirPlay specification change"),
    prose(
      "Apple described AirPlay Mirroring as 720p in the February developer preview but as up to 1080p in the final July announcement. The structured launch record uses the final public specification and preserves the earlier number only as superseded development context.",
      [
        c(U.preview, "Developer preview; 720p AirPlay Mirroring"),
        c(U.launch, "Public feature list; up-to-1080p AirPlay Mirroring"),
      ],
    ),
    heading("Version and security boundary"),
    prose(
      "This page represents the initial 10.8 release only. Apple's archived index later lists 10.8.2 on September 19 and identifies 10.8 and 10.8.1 as its predecessors, but those point versions have no durable local releaseVersion routes. The index also omits a launch-specific 10.8 security advisory, so no later security fix is projected backward.",
      [
        c(
          U.securityIndex,
          "OS X Mountain Lion 10.8.2 — 19 Sep 2012; available-for column",
        ),
        c(
          U.securityIndex,
          "July 25 Safari 6.0 and Xcode 4.4 entries; no Mountain Lion 10.8 entry",
        ),
      ],
    ),
  ),
  citations: [
    c(U.preview, "February 16 developer preview"),
    c(U.juneAnnouncement, "June 11 planned availability"),
    c(U.launch, "July 25 public availability"),
    c(U.postLaunch, "July 30 post-launch confirmation"),
    c(U.securityIndex, "2012 security-release chronology"),
  ],
  changes: mountainLionChanges,
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
    item.publicReleaseDate?.startsWith("2012-"),
);
const [eligible] = eligibleSeedVersions;

if (
  eligibleSeedVersions.length !== 1 ||
  eligible.platform !== "macOS" ||
  eligible.majorVersion !== 10 ||
  eligible.version !== "10.8" ||
  eligible.versionNote !== "Mountain Lion" ||
  eligible.publicReleaseDate !== "2012-07-25" ||
  eligible.milestones.length !== 2 ||
  eligible.milestones[0]?.label !== "Beta 1" ||
  eligible.milestones[0]?.date !== "2012-02-16" ||
  eligible.milestones[1]?.label !== "Public" ||
  eligible.milestones[1]?.date !== "2012-07-25"
) {
  throw new Error(
    "The 2012 non-iOS/iPadOS seed inventory changed; re-audit this cohort before regenerating.",
  );
}

const otherOwners = [];
for (const file of readdirSync(here).filter(
  (name) => name.endsWith(".json") && name !== "apple-other-2012.json",
)) {
  const candidate = JSON.parse(readFileSync(join(here, file), "utf8"));
  if (
    candidate.versions?.some(
      (item) => item.releaseVersionId === "version-macos-10-8",
    ) ||
    candidate.events?.some(
      (item) => item.target?.releaseVersionId === "version-macos-10-8",
    )
  ) {
    otherOwners.push(file);
  }
}
if (otherOwners.length > 0) {
  throw new Error(
    `The 2012 Mountain Lion route is already owned by: ${otherOwners.join(", ")}`,
  );
}

if (
  bundle.versions.length !== 1 ||
  bundle.events.length !== 1 ||
  bundle.builds.length !== 0 ||
  bundle.events[0].changes.length !== 17
) {
  throw new Error("The expected 2012 bundle closure no longer holds.");
}

if (
  Object.keys(bundle.events[0].target).sort().join(",") !==
    "releaseVersionId,routeAlias" ||
  bundle.events[0].target.releaseVersionId !== "version-macos-10-8" ||
  bundle.events[0].target.routeAlias !== "public"
) {
  throw new Error("The Mountain Lion event target is no longer durable.");
}

for (const item of mountainLionChanges) {
  if (
    item.documentedStatus !== "documented" ||
    item.evidenceState !== "confirmed" ||
    item.inheritance !== "delta" ||
    !item.citations.some((citation) => citation.url === U.launch)
  ) {
    throw new Error(
      `Change ${item.key} is not a launch-confirmed documented delta.`,
    );
  }
}

if (
  mountainLionChanges.some((item) =>
    `${item.key} ${item.title}`.toLowerCase().includes("facebook"),
  )
) {
  throw new Error(
    "Facebook integration was deferred and cannot be a Mountain Lion launch change.",
  );
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

const json = `${JSON.stringify(bundle, null, 2)}\n`;
writeFileSync(join(here, "apple-other-2012.json"), json);
const jsonSha = createHash("sha256").update(json).digest("hex");

const md = `# Apple 2012 non-iPhone research batch

## Result

\`apple-other-2012.json\` is a source-backed launch-content bundle for every existing local non-iOS/iPadOS release version whose audited public appearance falls in 2012. The exact cohort is one data-rich OS X Mountain Lion 10.8 article and its durable public event, written as copyright-safe original synthesis with claim-level citations.

## Exact local coverage

| Platform family | Existing versions covered | Local milestones | Public appearances | Structured changes |
| --- | --- | ---: | ---: | ---: |
| macOS | 10.8 (Mountain Lion) | 2 | 1 | ${mountainLionChanges.length} |
| watchOS | None; the platform did not yet exist | 0 | 0 | 0 |
| tvOS | None in the local catalog | 0 | 0 | 0 |
| **Total** | **1 version article** | **2** | **1** | **${mountainLionChanges.length}** |

The local Mountain Lion record contains a February 16 milestone labeled \`Beta 1\` and a July 25 public milestone. Apple's February announcement precisely describes the first date as a developer preview for Mac Developer Program members. This bundle enriches only the existing public route through \`releaseVersionId: "version-macos-10-8"\` plus \`routeAlias: "public"\`.

## Editorial and evidence policy

- Authorship is \`originalSynthesis\` throughout.
- Both version and event records are \`editoriallyVerified\` and \`approved\` as of ${reviewedAt}.
- The public event is indexable after editorial approval.
- All ${mountainLionChanges.length} changes are \`documented\`, \`confirmed\`, and public-release \`delta\` entries.
- Every structured change cites Apple's July 25 public-availability announcement; earlier sources can add context but never substitute for final confirmation.
- No undocumented-change claim is included.
- No preview-only API or behavior is promoted into the July public release.
- No 10.8.1, 10.8.2, or later cumulative change is projected backward.
- No build record is included and no build number is inferred.
- Apple's browser-performance statement and download total remain attributed vendor claims, not independent measurements.
- Apple product and service names are used nominatively; no Apple artwork, logos, screenshots, or copied publisher body text is included.

## Inventory, preview, and chronology boundaries

1. Seed closure is exact: macOS-family version 10.8, named Mountain Lion, is the only non-iOS/iPadOS record with a 2012 public appearance. It has exactly two local milestones.
2. No other checked-in research batch owns \`version-macos-10-8\`; the generator verifies sole ownership before writing this bundle.
3. Apple's February 16 page is explicitly a developer preview. It documents the development trail, but the bundle attaches no article or change set to the non-public milestone.
4. Apple's June 11 page promised July availability. It provides pre-release context for features later named at launch but is not treated as proof of the exact public date.
5. Apple's July 25 page controls the public date and every structured launch change. Apple's July 30 follow-up supplies post-launch confirmation and reports more than three million downloads over four days.
6. Facebook integration appears in the July feature list but is explicitly deferred by the same page to an upcoming software update. It is excluded from the 10.8 launch delta.
7. The February preview described AirPlay Mirroring as 720p; the final July page says up to 1080p. The launch record uses the final specification and documents the preview number only as superseded context.
8. The historical product name is OS X Mountain Lion. The local information architecture groups the release under the \`macOS\` platform family while preserving Apple's contemporaneous naming in editorial prose.

## Source ledger

All ${sources.length} declared sources are human-readable first-party Apple pages checked on ${accessedAt}; all ${sources.length} are cited by the bundle.

- <${U.securityIndex}> — archived 2011–2012 security chronology and the later 10.8.2 boundary
- <${U.preview}> — February 16 developer-preview availability and preview-only claims
- <${U.juneAnnouncement}> — planned July availability and pre-release feature detail
- <${U.launch}> — July 25 public availability, confirmed shipped scope, compatibility, and the Facebook deferral
- <${U.postLaunch}> — July 30 post-launch confirmation and Apple-reported download count

Apple Support pages are archived or living documents and can display revision dates much later than the historical release. Mapping therefore uses the explicitly labeled release lines and dated Newsroom pages, not the current page-revision timestamp.

## Known gaps and anomalies

1. Apple's archived 2011–2012 security index does not list OS X Mountain Lion 10.8 as a July 25 security release. It lists Xcode 4.4 and Safari 6.0 that day, then Mountain Lion 10.8.2 on September 19.
2. No surviving first-party, launch-specific Mountain Lion 10.8 security advisory was found. Gatekeeper is therefore recorded as a launch feature, while no CVE repair group is inferred.
3. The security index documents 10.8.2 and names 10.8.1 as an eligible predecessor. Neither point version has an existing local \`releaseVersion\` route, so this batch creates neither and imports no later change.
4. Apple's launch announcement confirms a faster Safari but does not provide a reproducible benchmark in the retained page. The structured entry preserves the statement as an attributed vendor claim.
5. The February and June pages contain more detailed developer, security, Safari, Messages, and Power Nap descriptions than the July launch page. Only details tied to an explicitly launch-confirmed feature are used, and preview-only developer APIs remain outside the structured change set.
6. No community-sourced undocumented claim was added; that requires a separate reproducible or independently corroborated evidence pass.
7. The public article does not treat Apple's more-than-200-features headline as 200 independently verified changes. It records ${mountainLionChanges.length} distinct claims supported by the retained public announcement.

## Validation

- Research-batch validation passed with ${bundle.versions.length} version, ${bundle.events.length} public event, ${mountainLionChanges.length} globally consistent change keys, ${sources.length} sources, and ${citationReferenceCount(bundle)} citation references for this file.
- Inventory closure passed and is enforced inside the generator: exactly 1 eligible seed version, 2 milestones, 1 public appearance, 1 non-public milestone, ${sources.length} of ${sources.length} declared sources cited, sole batch ownership, and zero build records.
- The launch-content schema assertion passed.
- Focused launch-ingestion and launch-manifest tests passed: 19 of 19.
- ESLint and Prettier checks passed for the deterministic generator.
- A second generator run reproduced the JSON and Markdown byte-for-byte.
- Reviewed production plan: 21 creates, 3 revision-guarded patches, and 2,081 unchanged documents.
- Creates: 4 source documents and ${mountainLionChanges.length} change documents; zero version, event, or build creates. The plan included the existing Mountain Lion version patch, the existing durable public-event patch, and one source metadata patch.
- Mutation payload: 60,442 bytes, reported as 1.5% of the guarded limit.
- Applied production plan SHA: \`1f7aa762abffe8cd65360edee97a80b8612ce43171270f3ba59adc8e547001d9\`.
- Production transaction \`eOgq1Ovu5XNUv1qNFUdpwF\` committed successfully and the guarded apply completed with zero residual mutations.
- Approved bundle JSON SHA-256: \`${jsonSha}\`.
- Post-apply zero-residual plan SHA: \`530b79e829b677ac060fabd44b771cd9b62551f649ec46925ab1197a1af7f044\`.
- Local smoke checks returned HTTP 200 and rendered sourced editorial content for \`/apple/macos/10.8\`.
`;

writeFileSync(join(here, "apple-other-2012.md"), md);
