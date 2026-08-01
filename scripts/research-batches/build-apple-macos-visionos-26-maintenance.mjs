import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const accessedAt = "2026-07-30";

const U = {
  macUpdates: "https://support.apple.com/en-us/122868",
  mac261Security: "https://support.apple.com/en-us/125634",
  mac262Security: "https://support.apple.com/en-us/125886",
  mac263Security: "https://support.apple.com/en-us/126348",
  visionUpdates: "https://support.apple.com/en-us/123024",
  vision261Security: "https://support.apple.com/en-us/125638",
  vision262Security: "https://support.apple.com/en-us/125891",
  vision263Security: "https://support.apple.com/en-us/126353",
};

const sources = [
  {
    url: U.macUpdates,
    title: "What's new in the updates for macOS Tahoe 26",
    publisher: "Apple Support",
    sourceClass: "firstPartyDocumentation",
    author: "Apple",
    topics: ["macOS", "Tahoe", "26", "consumer release notes"],
  },
  {
    url: U.mac261Security,
    title: "About the security content of macOS Tahoe 26.1",
    publisher: "Apple Support",
    sourceClass: "firstPartyDocumentation",
    author: "Apple",
    topics: ["macOS", "Tahoe", "26.1", "security", "CVE"],
  },
  {
    url: U.mac262Security,
    title: "About the security content of macOS Tahoe 26.2",
    publisher: "Apple Support",
    sourceClass: "firstPartyDocumentation",
    author: "Apple",
    topics: ["macOS", "Tahoe", "26.2", "security", "CVE"],
  },
  {
    url: U.mac263Security,
    title: "About the security content of macOS Tahoe 26.3",
    publisher: "Apple Support",
    sourceClass: "firstPartyDocumentation",
    author: "Apple",
    topics: ["macOS", "Tahoe", "26.3", "security", "CVE"],
  },
  {
    url: U.visionUpdates,
    title: "About visionOS 26 Updates",
    publisher: "Apple Support",
    sourceClass: "firstPartyDocumentation",
    author: "Apple",
    topics: ["visionOS", "26", "consumer release notes"],
  },
  {
    url: U.vision261Security,
    title: "About the security content of visionOS 26.1",
    publisher: "Apple Support",
    sourceClass: "firstPartyDocumentation",
    author: "Apple",
    topics: ["visionOS", "26.1", "security", "CVE"],
  },
  {
    url: U.vision262Security,
    title: "About the security content of visionOS 26.2",
    publisher: "Apple Support",
    sourceClass: "firstPartyDocumentation",
    author: "Apple",
    topics: ["visionOS", "26.2", "security", "CVE"],
  },
  {
    url: U.vision263Security,
    title: "About the security content of visionOS 26.3",
    publisher: "Apple Support",
    sourceClass: "firstPartyDocumentation",
    author: "Apple",
    topics: ["visionOS", "26.3", "security", "CVE"],
  },
];

const c = (url, locator, note) => ({
  url,
  ...(locator ? { locator } : {}),
  ...(note ? { note } : {}),
});

const ch = (
  key,
  title,
  category,
  action,
  summary,
  citations,
  verificationMethod = "Matched Apple's version-labeled update notes or security advisory to the audited public-release event.",
) => ({
  key,
  title,
  canonicalSummary: summary,
  category,
  action,
  inheritance: "delta",
  summary,
  documentedStatus: "documented",
  evidenceState: "confirmed",
  verificationMethod,
  citations,
});

const releases = [
  {
    id: "version-macos-26-1",
    label: "macOS Tahoe 26.1",
    date: "2025-11-03",
    updates: U.macUpdates,
    security: U.mac261Security,
    overview:
      "macOS Tahoe 26.1 added an opacity choice for Liquid Glass, extended Apple Music AutoMix to AirPlay, improved FaceTime audio under constrained network conditions, and changed default protections for existing child accounts.",
    securityOverview:
      "Apple's advisory records a broad security pass across authorization, privacy, code-signing, sandbox, file-system, media, kernel, Safari, and WebKit surfaces. The grouped entries below are a reader-oriented index, not a replacement for the full CVE bulletin.",
    changes: [
      ch(
        "macos-26-1-liquid-glass-tint",
        "Tinted Liquid Glass appearance",
        "enhancement",
        "introduced",
        "A new appearance control let users choose the original clear Liquid Glass material or a more opaque tinted presentation in apps.",
        [c(U.macUpdates, "macOS Tahoe 26.1 — Liquid Glass setting")],
      ),
      ch(
        "macos-26-1-automix-airplay",
        "Apple Music AutoMix over AirPlay",
        "enhancement",
        "changed",
        "Apple Music's AutoMix transitions became available when playback was sent over AirPlay.",
        [c(U.macUpdates, "macOS Tahoe 26.1 — Apple Music AutoMix")],
      ),
      ch(
        "macos-26-1-facetime-low-bandwidth-audio",
        "FaceTime audio in low-bandwidth conditions",
        "enhancement",
        "changed",
        "FaceTime received an audio-quality improvement for calls operating with limited network bandwidth.",
        [c(U.macUpdates, "macOS Tahoe 26.1 — FaceTime audio quality")],
      ),
      ch(
        "macos-26-1-child-account-protection-defaults",
        "Child-account protection defaults",
        "behavior",
        "changed",
        "Communication Safety and adult-site filtering became default-on protections for existing child accounts in the documented 13–17 age range, with the exact age varying by region.",
        [
          c(
            U.macUpdates,
            "macOS Tahoe 26.1 — Communication Safety and Web content filters",
          ),
        ],
      ),
      ch(
        "macos-26-1-authorization-privacy-hardening",
        "Authorization and privacy hardening",
        "security",
        "fixed",
        "Apple documented repairs for sensitive-data exposure, embedded-view screenshots, logging, permissions, and authorization across account, application, and system services.",
        [
          c(
            U.mac261Security,
            "Apple Account, App Store, Contacts, FileProvider, and privacy-related entries",
          ),
        ],
      ),
      ch(
        "macos-26-1-code-signing-sandbox-filesystem",
        "Code-signing, sandbox, and file-system protections",
        "security",
        "fixed",
        "The update tightened code-signing downgrade checks, sandbox and entitlement boundaries, symbolic-link handling, installer behavior, and access to protected file-system locations.",
        [
          c(
            U.mac261Security,
            "AppleMobileFileIntegrity, Assets, CloudKit, Disk Images, Installer, Sandbox, and TCC entries",
          ),
        ],
      ),
      ch(
        "macos-26-1-safari-webkit-security",
        "Safari and WebKit security repairs",
        "security",
        "fixed",
        "Safari spoofing and privacy issues were addressed alongside multiple WebKit memory-safety, cross-origin, and process-stability vulnerabilities.",
        [c(U.mac261Security, "Safari, WebKit, and WebKit Canvas entries")],
      ),
    ],
  },
  {
    id: "version-macos-26-2",
    label: "macOS Tahoe 26.2",
    date: "2025-12-12",
    updates: U.macUpdates,
    security: U.mac262Security,
    overview:
      "macOS Tahoe 26.2 introduced Edge Light for video calls, richer Podcast navigation, new Games-library and controller tools, AirDrop verification codes, Freeform tables, and several News, Music, and reliability refinements.",
    securityOverview:
      "The accompanying advisory covers payment-token access, communications privacy, sandbox and Gatekeeper boundaries, kernel privileges, media parsing, and WebKit. Apple's exploited-in-the-wild language concerns targeted attacks on versions of iOS before iOS 26; it is not evidence that macOS 26.2 itself had been exploited.",
    changes: [
      ch(
        "macos-26-2-edge-light",
        "Edge Light for video calls",
        "feature",
        "introduced",
        "Edge Light used the Mac display as a configurable virtual light during low-light video calls, with pointer-aware behavior and an automatic option on supported newer Macs.",
        [c(U.macUpdates, "macOS Tahoe 26.2 — Edge Light")],
      ),
      ch(
        "macos-26-2-podcasts-navigation",
        "Podcast chapters and mentioned-show links",
        "enhancement",
        "introduced",
        "Podcasts added automatically generated episode chapters and direct links to other shows mentioned in an episode.",
        [c(U.macUpdates, "macOS Tahoe 26.2 — Podcasts")],
      ),
      ch(
        "macos-26-2-games-library-challenges-controllers",
        "Games filters, challenge banners, and controllers",
        "enhancement",
        "changed",
        "The Games app gained library filters, real-time challenge-leader banners, and support for working with connected controllers.",
        [c(U.macUpdates, "macOS Tahoe 26.2 — Games")],
      ),
      ch(
        "macos-26-2-airdrop-codes",
        "AirDrop verification codes",
        "security",
        "introduced",
        "AirDrop could require a receiver-displayed code when sharing with an unknown contact, adding an explicit verification step.",
        [c(U.macUpdates, "macOS Tahoe 26.2 — AirDrop codes")],
      ),
      ch(
        "macos-26-2-freeform-tables",
        "Tables in Freeform",
        "feature",
        "introduced",
        "Freeform boards gained resizable tables whose cells could contain text, images, documents, and drawings.",
        [c(U.macUpdates, "macOS Tahoe 26.2 — Tables in Freeform")],
      ),
      ch(
        "macos-26-2-news-music-discovery",
        "News and Music discovery refinements",
        "enhancement",
        "changed",
        "News added topic-section shortcuts in its sidebar, while Apple Music surfaced Favorite Songs in Top Picks.",
        [
          c(
            U.macUpdates,
            "macOS Tahoe 26.2 — Apple News Section links and Favorite Songs",
          ),
        ],
      ),
      ch(
        "macos-26-2-prerelease-album-playback",
        "Pre-release album playback timing",
        "bugFix",
        "fixed",
        "Apple fixed a Music-library condition in which a pre-release album could remain unavailable immediately after its scheduled release time.",
        [c(U.macUpdates, "macOS Tahoe 26.2 — pre-release albums")],
      ),
      ch(
        "macos-26-2-calling-privacy-authentication",
        "Calling and authentication protections",
        "security",
        "fixed",
        "The security update addressed FaceTime caller-ID spoofing, unintended password-field exposure during remote control, call-history logging, and sensitive App Store token access.",
        [
          c(
            U.mac262Security,
            "App Store, Call History, Calling Framework, and FaceTime entries",
          ),
        ],
      ),
      ch(
        "macos-26-2-sandbox-gatekeeper-kernel",
        "Sandbox, Gatekeeper, and kernel hardening",
        "security",
        "fixed",
        "Apple tightened sandboxed file access, file bookmarks, Gatekeeper validation, and kernel privilege and memory boundaries.",
        [
          c(
            U.mac262Security,
            "AppSandbox, File Bookmark, Kernel, LaunchServices, and related entries",
          ),
        ],
      ),
      ch(
        "macos-26-2-webkit-targeted-attack-fixes",
        "WebKit security fixes with targeted-attack context",
        "security",
        "fixed",
        "The bulletin includes multiple WebKit memory-safety repairs. Apple linked two entries to an extremely sophisticated attack against specific individuals on versions of iOS before iOS 26, not to observed exploitation of macOS Tahoe 26.2.",
        [
          c(
            U.mac262Security,
            "WebKit entries for CVE-2025-43529 and CVE-2025-14174",
          ),
        ],
      ),
    ],
  },
  {
    id: "version-macos-26-3",
    label: "macOS Tahoe 26.3",
    date: "2026-02-11",
    updates: U.macUpdates,
    security: U.mac263Security,
    overview:
      "macOS Tahoe 26.3 was a maintenance release that Apple described as providing important bug fixes and security updates rather than a named consumer feature set.",
    securityOverview:
      "Apple's detailed advisory spans access control, privilege boundaries, media and file parsing, networking, privacy, sandboxing, and web components. The dyld exploitation note refers to targeted attacks on versions of iOS before iOS 26, not to a confirmed macOS 26.3 compromise.",
    changes: [
      ch(
        "macos-26-3-important-bug-fixes",
        "Important maintenance fixes",
        "bugFix",
        "fixed",
        "Apple classified 26.3 as an important bug-fix release but did not publish a more granular consumer-facing defect list.",
        [c(U.macUpdates, "macOS Tahoe 26.3")],
      ),
      ch(
        "macos-26-3-privilege-access-control",
        "Privilege and access-control repairs",
        "security",
        "fixed",
        "The advisory documents root-privilege, sandbox-escape, protected-data, and authorization fixes across CoreServices, Remote Management, Security, Setup Assistant, and related frameworks.",
        [
          c(
            U.mac263Security,
            "CoreServices, Remote Management, Security, Setup Assistant, and Sandbox entries",
          ),
        ],
      ),
      ch(
        "macos-26-3-foundation-privacy-input",
        "Foundation and privacy protections",
        "security",
        "fixed",
        "Apple repaired Foundation paths that could expose sensitive data, monitor keystrokes without permission, or access protected information, together with logging and temporary-file privacy issues.",
        [
          c(
            U.mac263Security,
            "Foundation, Focus, Game Center, Messages, and Notification Center entries",
          ),
        ],
      ),
      ch(
        "macos-26-3-media-file-processing",
        "Media and file-processing safety",
        "security",
        "fixed",
        "Bounds, memory, and validation work covered ImageIO, Model I/O, CoreAudio, libexpat, GPU drivers, and other crafted-file paths.",
        [
          c(
            U.mac263Security,
            "CoreAudio, GPU Drivers, ImageIO, libexpat, and Model I/O entries",
          ),
        ],
      ),
      ch(
        "macos-26-3-network-kernel-hardening",
        "Network and kernel hardening",
        "security",
        "fixed",
        "The release addressed crafted Bluetooth denial of service, arbitrary-file writing through CFNetwork, kernel traffic interception, and kernel memory or stability problems.",
        [c(U.mac263Security, "Bluetooth, CFNetwork, and Kernel entries")],
      ),
      ch(
        "macos-26-3-dyld-targeted-attack-context",
        "dyld memory-corruption repair",
        "security",
        "fixed",
        "Apple fixed a dyld memory-corruption path and said the underlying issue may have been used in a highly targeted attack on versions of iOS before iOS 26; the advisory does not say macOS 26.3 was exploited.",
        [c(U.mac263Security, "dyld — CVE-2026-20700")],
      ),
      ch(
        "macos-26-3-mail-safari-sandbox",
        "Mail, Safari, and sandbox protections",
        "security",
        "fixed",
        "Apple corrected remote-content handling in Mail, Safari history access, sandbox permissions, Screen Time access controls, and related sensitive-data paths.",
        [c(U.mac263Security, "Mail, Safari, Sandbox, and Screen Time entries")],
      ),
    ],
  },
  {
    id: "version-visionos-26-1",
    label: "visionOS 26.1",
    date: "2025-11-03",
    updates: U.visionUpdates,
    security: U.vision261Security,
    overview:
      "visionOS 26.1 expanded the Apple Vision Pro companion app to iPad, added companion-device control for AirPlay viewing, and improved playback information inside Spatial Gallery.",
    securityOverview:
      "Apple's advisory documents privacy, sandbox, kernel, media, and WebKit repairs for all Apple Vision Pro models. Security groups below summarize representative affected surfaces without reproducing the full bulletin.",
    changes: [
      ch(
        "visionos-26-1-ipad-companion-app",
        "Apple Vision Pro app on iPad",
        "feature",
        "introduced",
        "With iPadOS 26.1, the Apple Vision Pro companion app expanded to iPad for discovering spatial content and viewing device information.",
        [c(U.visionUpdates, "visionOS 26.1 — Apple Vision Pro app for iPad")],
      ),
      ch(
        "visionos-26-1-companion-airplay-control",
        "Companion-device AirPlay control",
        "enhancement",
        "introduced",
        "The Vision Pro app on iPhone and iPad could enable AirPlay so another display could show the wearer's Apple Vision Pro experience.",
        [
          c(
            U.visionUpdates,
            "visionOS 26.1 — Apple Vision Pro app AirPlay control",
          ),
        ],
      ),
      ch(
        "visionos-26-1-spatial-gallery-controls",
        "Spatial Gallery video controls",
        "enhancement",
        "changed",
        "Immersive Spatial Gallery videos began showing playback controls and duration information.",
        [c(U.visionUpdates, "visionOS 26.1 — Spatial Gallery")],
      ),
      ch(
        "visionos-26-1-privacy-sandbox-protections",
        "Privacy and sandbox protections",
        "security",
        "fixed",
        "Apple addressed embedded-view screenshots, app fingerprinting, protected-data access, entitlement boundaries, logging, and user-preference handling.",
        [
          c(
            U.vision261Security,
            "Apple Account, Assets, Find My, Installer, Notes, and Sandbox Profiles entries",
          ),
        ],
      ),
      ch(
        "visionos-26-1-kernel-media-safety",
        "Kernel and media-processing safety",
        "security",
        "fixed",
        "The update repaired kernel memory and stability issues plus crafted-media paths in CoreText and Model I/O.",
        [
          c(
            U.vision261Security,
            "Apple Neural Engine, CoreText, Kernel, and Model I/O entries",
          ),
        ],
      ),
      ch(
        "visionos-26-1-safari-webkit-security",
        "Safari and WebKit security repairs",
        "security",
        "fixed",
        "Safari spoofing and privacy issues were fixed alongside WebKit cross-origin, memory-safety, and process-stability vulnerabilities.",
        [c(U.vision261Security, "Safari, WebKit, and WebKit Canvas entries")],
      ),
    ],
  },
  {
    id: "version-visionos-26-2",
    label: "visionOS 26.2",
    date: "2025-12-12",
    updates: U.visionUpdates,
    security: U.vision262Security,
    overview:
      "visionOS 26.2 expanded Travel Mode beyond airplanes and trains, enabled hand-drawn input from supported spatial accessories in PencilKit apps, and brought structured tables to Freeform.",
    securityOverview:
      "Its advisory includes calling identity, hidden-photo authentication, kernel privilege, HID-device, privacy, and WebKit work. Apple's targeted-attack wording again concerns versions of iOS before iOS 26 rather than confirmed exploitation of visionOS 26.2.",
    changes: [
      ch(
        "visionos-26-2-travel-mode-cars-buses",
        "Travel Mode for cars and buses",
        "feature",
        "introduced",
        "Travel Mode expanded so passengers could use Apple Vision Pro in cars and buses in addition to airplanes and trains.",
        [c(U.visionUpdates, "visionOS 26.2 — Travel Mode")],
      ),
      ch(
        "visionos-26-2-spatial-accessory-drawing",
        "Hand-drawn input from spatial accessories",
        "feature",
        "introduced",
        "Supported spatial accessories could provide hand-drawn input in Notes, Freeform, and other PencilKit-enabled apps.",
        [
          c(
            U.visionUpdates,
            "visionOS 26.2 — spatial accessories and PencilKit",
          ),
        ],
      ),
      ch(
        "visionos-26-2-freeform-tables",
        "Tables in Freeform",
        "feature",
        "introduced",
        "Freeform added automatically resizing table cells that could contain text, images, documents, and drawings.",
        [c(U.visionUpdates, "visionOS 26.2 — Tables in Freeform")],
      ),
      ch(
        "visionos-26-2-calling-photos-privacy",
        "Calling and photo privacy protections",
        "security",
        "fixed",
        "The security update addressed FaceTime caller-ID spoofing, remote-control password exposure, and a path that could reveal Hidden album photos without authentication.",
        [
          c(
            U.vision262Security,
            "Calling Framework, FaceTime, and Photos entries",
          ),
        ],
      ),
      ch(
        "visionos-26-2-kernel-hid-system-security",
        "Kernel, HID, and system hardening",
        "security",
        "fixed",
        "Apple fixed a kernel privilege issue, multiple crafted-HID crash paths, payment-token permissions, installed-app enumeration, and other protected-data exposures.",
        [
          c(
            U.vision262Security,
            "App Store, Icons, Kernel, Messages, Multi-Touch, and Screen Time entries",
          ),
        ],
      ),
      ch(
        "visionos-26-2-webkit-targeted-attack-fixes",
        "WebKit security fixes with targeted-attack context",
        "security",
        "fixed",
        "Multiple WebKit memory-safety issues were repaired. Apple associated two with attacks on specific individuals using versions of iOS before iOS 26, not with observed exploitation of visionOS 26.2.",
        [
          c(
            U.vision262Security,
            "WebKit entries for CVE-2025-43529 and CVE-2025-14174",
          ),
        ],
      ),
    ],
  },
  {
    id: "version-visionos-26-3",
    label: "visionOS 26.3",
    date: "2026-02-11",
    updates: U.visionUpdates,
    security: U.vision263Security,
    overview:
      "visionOS 26.3 was a maintenance release for Apple Vision Pro that Apple described as providing important bug fixes and security updates, without a named consumer feature list.",
    securityOverview:
      "The version-specific advisory covers privilege boundaries, media processing, networking, privacy, sandboxing, and dynamic-loader security. Its exploitation statement is expressly about versions of iOS before iOS 26.",
    changes: [
      ch(
        "visionos-26-3-important-bug-fixes",
        "Important maintenance fixes",
        "bugFix",
        "fixed",
        "Apple classified the release as an important bug-fix update but did not enumerate individual consumer defects.",
        [c(U.visionUpdates, "visionOS 26.3")],
      ),
      ch(
        "visionos-26-3-coreservices-privilege",
        "CoreServices privilege and data protections",
        "security",
        "fixed",
        "CoreServices repairs addressed root-privilege paths, directory handling, environment-variable validation, and sensitive-data access.",
        [c(U.vision263Security, "CoreServices entries")],
      ),
      ch(
        "visionos-26-3-image-media-processing",
        "Image and media-processing safety",
        "security",
        "fixed",
        "The update corrected ImageIO information-disclosure paths, CoreAudio and CoreMedia memory issues, and Model I/O bounds handling.",
        [
          c(
            U.vision263Security,
            "CoreAudio, CoreMedia, ImageIO, and Model I/O entries",
          ),
        ],
      ),
      ch(
        "visionos-26-3-kernel-network-hardening",
        "Kernel and network hardening",
        "security",
        "fixed",
        "Apple fixed kernel privilege, stability, and traffic-interception issues together with Bluetooth denial of service and CFNetwork arbitrary-file writing.",
        [c(U.vision263Security, "Bluetooth, CFNetwork, and Kernel entries")],
      ),
      ch(
        "visionos-26-3-dyld-targeted-attack-context",
        "dyld memory-corruption repair",
        "security",
        "fixed",
        "A dynamic-loader memory-corruption issue was fixed; Apple's observed-attack note is limited to highly targeted use against versions of iOS before iOS 26 and does not say visionOS 26.3 was exploited.",
        [c(U.vision263Security, "dyld — CVE-2026-20700")],
      ),
      ch(
        "visionos-26-3-sandbox-messages-shortcuts",
        "Sandbox, Messages, and Shortcuts protections",
        "security",
        "fixed",
        "The release tightened sandbox permissions, symbolic-link handling in Messages, directory-path validation in Shortcuts, and related sensitive-data boundaries.",
        [c(U.vision263Security, "Messages, Sandbox, and Shortcuts entries")],
      ),
    ],
  },
];

const heading = (text) => ({ style: "h2", text });
const prose = (text, citations) => ({ text, citations });
const article = (...blocks) => ({ authorship: "originalSynthesis", blocks });
const reviewedAt = "2026-07-30T04:29:07Z";
const review = () => ({ status: "approved", reviewedAt });

const versions = releases.map((release) => {
  const citations = [
    c(release.security, `${release.label} — Released ${release.date}`),
    c(release.updates, release.label),
    c(release.security, `${release.label} — security content`),
  ];

  return {
    releaseVersionId: release.id,
    authorship: "originalSynthesis",
    releaseNotesUrl: release.updates,
    overview: article(
      heading("Release overview"),
      prose(
        `${release.label} reached the public channel on ${new Date(
          `${release.date}T00:00:00.000Z`,
        ).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
          timeZone: "UTC",
        })}. ${release.overview}`,
        citations.slice(0, 2),
      ),
      heading("Documented security record"),
      prose(release.securityOverview, [citations[2]]),
    ),
    citations,
    provenanceStatus: "editoriallyVerified",
    editorialReview: review(),
  };
});

const events = releases.map((release) => {
  const citations = [
    c(release.security, `${release.label} — Released ${release.date}`),
    c(release.updates, release.label),
    c(release.security, `${release.label} — security content`),
  ];

  return {
    target: { releaseVersionId: release.id, routeAlias: "public" },
    authorship: "originalSynthesis",
    summary: `${release.label} reached the public channel on ${release.date}. ${release.overview}`,
    article: article(
      heading("Public release"),
      prose(
        `Apple's dated security record places the public ${release.label} appearance on ${release.date}. This page covers that public release and does not project cumulative notes onto an earlier beta.`,
        citations.slice(0, 2),
      ),
      heading("What changed"),
      prose(release.overview, [citations[1]]),
      heading("Security and evidence boundary"),
      prose(release.securityOverview, [citations[2]]),
    ),
    citations,
    changes: release.changes,
    provenanceStatus: "editoriallyVerified",
    editorialReview: review(),
    isIndexable: true,
  };
});

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
  join(here, "apple-macos-visionos-26-maintenance.json"),
  `${JSON.stringify(bundle, null, 2)}\n`,
);

const changeCount = events.reduce(
  (total, releaseEvent) => total + releaseEvent.changes.length,
  0,
);
const citationCount = JSON.stringify(bundle).match(/"url":/g)?.length ?? 0;

const md = `# Apple macOS and visionOS 26 maintenance research batch

## Result

This source-backed bundle covers the six existing local macOS Tahoe and
visionOS 26.1–26.3 release-version records and their durable public
appearances. It contains original synthesis rather than copied release-note
prose.

- 6 version articles and 6 public-release articles
- ${changeCount} structured, documented, confirmed changes
- ${sources.length} first-party Apple sources
- ${citationCount} source declarations and citation references
- 0 builds and 0 prerelease-event enrichments
- All records are \`editoriallyVerified\`, \`approved\`, and indexable after
  review at \`${reviewedAt}\`

## Exact local coverage

| Platform | Versions |
| --- | --- |
| macOS | 26.1, 26.2, 26.3 |
| visionOS | 26.1, 26.2, 26.3 |

Every target exists in \`scripts/seed-data.json\` with one same-date Public
milestone. The bundle uses only
\`{releaseVersionId, routeAlias: "public"}\` selectors and leaves all beta and
release-candidate events untouched.

## Evidence policy

- Consumer features come from Apple's version-labeled macOS Tahoe or visionOS
  update history.
- Release dates and security claims come from Apple's version-specific
  security advisories.
- Security occurrences group related surfaces for reader navigation; they do
  not claim to replace the complete CVE bulletin.
- Apple's exploitation language in the 26.2 WebKit and 26.3 dyld advisories is
  preserved precisely: it concerns extremely targeted attacks on versions of
  iOS before iOS 26. The articles do not imply that macOS 26.2/26.3 or
  visionOS 26.2/26.3 were observed being exploited.
- Generic maintenance notes remain generic. No unnamed bug is invented for
  either 26.3 release.
- No undocumented or community claim was promoted during this first-party
  pass.

## Source ledger

${sources.map((source) => `- <${source.url}> — ${source.title}`).join("\n")}

All pages were checked on ${accessedAt}. Apple Support pages are living
documents, so the archive stores the access date and uses section-level
locators rather than treating the current page-revision date as the original
publication time.

## Known gaps

1. The audited local catalog stops this cohort at 26.3 even though Apple's
   living update histories now list later 26.x maintenance releases. Those
   missing version records require the separately guarded version-creation
   workflow and are not silently invented here.
2. Apple does not enumerate the consumer bug fixes in macOS 26.3 or visionOS
   26.3. Those pages remain intentionally narrower than 26.1 and 26.2.
3. No complete, release-by-release first-party build-number set was established,
   so this batch creates no build documents.

## Validation

Run:

\`\`\`sh
npm run research:validate
node --import tsx --test tests/launch-content-ingestion.test.ts tests/launch-content-manifest.test.ts
npx sanity exec scripts/ingest-launch-content.ts --with-user-token -- --content scripts/research-batches/apple-macos-visionos-26-maintenance.json
\`\`\`

## Guarded production apply

- 48 creates: 6 sources and ${changeCount} release changes
- 14 revision-guarded patches: 6 release versions, 6 public events, and
  metadata on 2 reused sources
- 0 version, event, or build creates
- 112,595-byte mutation payload, 2.9% of the guarded limit
- Exact applied plan SHA:
  \`ac8033fc4441c9c3f83d683f3ffec6a5fee8263642c58907f5cc5c99d43ebeba\`
- Transaction: \`tt1fSB5HY9GAB0YLyxpn5A\`
- The ingestion pipeline committed the transaction and verified zero residual
  mutations.
`;

writeFileSync(join(here, "apple-macos-visionos-26-maintenance.md"), md);
