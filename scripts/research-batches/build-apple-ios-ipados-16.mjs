import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const IOS_NOTES = "https://support.apple.com/en-us/101566";
const IPADOS_NOTES = "https://support.apple.com/en-us/108050";
const SECURITY_INDEX = "https://support.apple.com/en-us/100100";
const IOS_NEWSROOM =
  "https://www.apple.com/newsroom/2022/09/ios-16-is-available-today/";
const IPADOS_NEWSROOM =
  "https://www.apple.com/newsroom/2022/10/ipados-16-is-available-today/";
const IOS_DEVELOPER =
  "https://developer.apple.com/documentation/ios-ipados-release-notes/ios-16-release-notes";
const IPADOS_DEVELOPER =
  "https://developer.apple.com/documentation/ios-ipados-release-notes/ipados-16-release-notes";
const SHARED_16_4_DEVELOPER =
  "https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-16_4-release-notes";
const SHARED_16_5_DEVELOPER =
  "https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-16_5-release-notes";
const SHARED_16_6_DEVELOPER =
  "https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-16_6-release-notes";

const reviewedAt = "2026-07-29T23:45:00Z";
const review = {
  status: "approved",
  reviewedAt,
};

const citation = (url, locator, note) => ({
  url,
  ...(locator ? { locator } : {}),
  ...(note ? { note } : {}),
});

const paragraph = (text, citations) => ({
  text,
  citations,
});

const version = ({
  platform,
  number,
  releaseNotesUrl,
  paragraphs,
  citations,
}) => ({
  releaseVersionId: `version-${platform.toLowerCase()}-${number.replaceAll(".", "-")}`,
  authorship: "originalSynthesis",
  releaseNotesUrl,
  overview: {
    authorship: "originalSynthesis",
    blocks: paragraphs,
  },
  citations,
  provenanceStatus: "editoriallyVerified",
  editorialReview: review,
});

const change = ({
  platform,
  number,
  slug,
  title,
  canonicalSummary,
  category,
  action,
  summary,
  sourceUrl,
  locator,
}) => ({
  key: `${platform.toLowerCase()}-${number.replaceAll(".", "-")}-${slug}`,
  title,
  canonicalSummary,
  category,
  action,
  inheritance: "delta",
  summary,
  documentedStatus: "documented",
  evidenceState: "confirmed",
  citations: [citation(sourceUrl, locator)],
});

const event = ({
  platform,
  number,
  summary,
  sourceUrl,
  locator,
  extraCitations = [],
  changes,
}) => ({
  target: {
    releaseVersionId: `version-${platform.toLowerCase()}-${number.replaceAll(".", "-")}`,
    routeAlias: "public",
  },
  authorship: "originalSynthesis",
  summary,
  citations: [citation(sourceUrl, locator), ...extraCitations],
  changes,
  provenanceStatus: "editoriallyVerified",
  editorialReview: review,
  isIndexable: true,
});

const versionRows = [
  {
    platform: "ios",
    number: "16.0",
    releaseNotesUrl: IOS_NOTES,
    paragraphs: [
      paragraph(
        "iOS 16 made the Lock Screen a configurable surface for photos, typography, widgets, and notifications, with different Lock Screens linked to Focus modes. It also expanded Messages with editing, undo send, unread markers, SharePlay, and collaboration.",
        [citation(IOS_NOTES, "iOS 16 — Lock Screen, Focus, and Messages")],
      ),
      paragraph(
        "Mail gained scheduling and follow-up tools, while Safari added shared tab groups and passkeys. Live Text could work with paused video, Visual Look Up could separate a subject from its background, and Maps introduced multi-stop driving routes. Hardware, language, and regional requirements varied by feature.",
        [
          citation(
            IOS_NOTES,
            "iOS 16 — Mail, Safari and Passkeys, Live Text, Visual Look Up, and Maps",
          ),
          citation(IOS_NEWSROOM, "Availability"),
        ],
      ),
    ],
    citations: [
      citation(IOS_NOTES, "iOS 16"),
      citation(IOS_NEWSROOM, "iOS 16 is available today"),
      citation(IOS_DEVELOPER, "iOS 16 Release Notes"),
    ],
  },
  {
    platform: "ios",
    number: "16.0.1",
    releaseNotesUrl: IOS_NOTES,
    paragraphs: [
      paragraph(
        "iOS 16.0.1 was an iPhone 14-family launch correction. It addressed activation failures in iMessage and FaceTime, soft-looking photos when zooming in landscape orientation on iPhone 14 Pro Max, and authentication failures in enterprise single sign-on apps.",
        [citation(IOS_NOTES, "iOS 16.0.1")],
      ),
      paragraph(
        "Apple recommended the update specifically for iPhone 14 and iPhone 14 Pro users. The scope was narrow: it fixed launch-day reliability problems rather than adding to the broader iOS 16 feature set.",
        [citation(IOS_NOTES, "iOS 16.0.1")],
      ),
    ],
    citations: [citation(IOS_NOTES, "iOS 16.0.1")],
  },
  {
    platform: "ios",
    number: "16.0.2",
    releaseNotesUrl: IOS_NOTES,
    paragraphs: [
      paragraph(
        "iOS 16.0.2 concentrated on early post-launch defects. Apple documented camera vibration and blurred photos in some third-party apps on iPhone 14 Pro models, black screens during setup, and copy-and-paste permission prompts appearing more often than intended.",
        [citation(IOS_NOTES, "iOS 16.0.2")],
      ),
      paragraph(
        "The update also restored VoiceOver availability after some restarts and corrected touch input on certain serviced iPhone X, XR, and 11 displays. Apple separately directed readers to its security-release index for security content.",
        [
          citation(IOS_NOTES, "iOS 16.0.2"),
          citation(SECURITY_INDEX, "Apple security releases"),
        ],
      ),
    ],
    citations: [
      citation(IOS_NOTES, "iOS 16.0.2"),
      citation(SECURITY_INDEX, "Apple security releases"),
    ],
  },
  {
    platform: "ios",
    number: "16.0.3",
    releaseNotesUrl: IOS_NOTES,
    paragraphs: [
      paragraph(
        "iOS 16.0.3 was another focused reliability update for the iPhone 14 generation. It addressed delayed or missing notifications on iPhone 14 Pro models, low microphone volume during CarPlay calls, and slow camera launches or mode changes.",
        [citation(IOS_NOTES, "iOS 16.0.3")],
      ),
      paragraph(
        "Apple also fixed a Mail crash triggered after receiving a malformed message. The public notes describe this as a bug-fix and security update, with security details maintained in Apple’s separate bulletin collection.",
        [
          citation(IOS_NOTES, "iOS 16.0.3"),
          citation(SECURITY_INDEX, "Apple security releases"),
        ],
      ),
    ],
    citations: [
      citation(IOS_NOTES, "iOS 16.0.3"),
      citation(SECURITY_INDEX, "Apple security releases"),
    ],
  },
  {
    platform: "ios",
    number: "16.1",
    releaseNotesUrl: IOS_NOTES,
    paragraphs: [
      paragraph(
        "iOS 16.1 delivered several features announced for the iOS 16 cycle but not present in 16.0. It introduced iCloud Shared Photo Library, third-party Live Activities, Apple Fitness+ access without an Apple Watch, and secure sharing for supported Wallet keys.",
        [
          citation(
            IOS_NOTES,
            "iOS 16.1 — iCloud Shared Photo Library, Live Activities, Fitness+, and Wallet",
          ),
        ],
      ),
      paragraph(
        "The update also added Matter support and Clean Energy Charging, while correcting problems in Messages, Dynamic Island reachability, and CarPlay connections through VPN apps. Availability still depended on device, service, and region.",
        [
          citation(
            IOS_NOTES,
            "iOS 16.1 — Home, Clean Energy Charging, and fixes",
          ),
        ],
      ),
    ],
    citations: [citation(IOS_NOTES, "iOS 16.1")],
  },
  {
    platform: "ios",
    number: "16.1.1",
    releaseNotesUrl: IOS_NOTES,
    paragraphs: [
      paragraph(
        "iOS 16.1.1 was a maintenance release rather than a feature update. Apple’s public note records bug fixes and security updates and recommends the release for all users, without identifying consumer-facing fixes individually.",
        [citation(IOS_NOTES, "iOS 16.1.1")],
      ),
      paragraph(
        "Because the consumer note does not enumerate specific defects, this record keeps the scope general instead of attributing fixes from another version. Apple’s security index is retained as the path to its version-specific security bulletins.",
        [
          citation(IOS_NOTES, "iOS 16.1.1"),
          citation(SECURITY_INDEX, "Apple security releases"),
        ],
      ),
    ],
    citations: [
      citation(IOS_NOTES, "iOS 16.1.1"),
      citation(SECURITY_INDEX, "Apple security releases"),
    ],
  },
  {
    platform: "ios",
    number: "16.1.2",
    releaseNotesUrl: IOS_NOTES,
    paragraphs: [
      paragraph(
        "iOS 16.1.2 was a small compatibility and safety-tuning release. Apple documented improved compatibility with wireless carriers and further Crash Detection optimization for the iPhone 14 and iPhone 14 Pro families.",
        [citation(IOS_NOTES, "iOS 16.1.2")],
      ),
      paragraph(
        "The notes also classify the update as carrying important security changes. No additional feature claims are inferred here; the page reflects only the two public enhancements Apple listed for this version.",
        [
          citation(IOS_NOTES, "iOS 16.1.2"),
          citation(SECURITY_INDEX, "Apple security releases"),
        ],
      ),
    ],
    citations: [
      citation(IOS_NOTES, "iOS 16.1.2"),
      citation(SECURITY_INDEX, "Apple security releases"),
    ],
  },
  {
    platform: "ios",
    number: "16.2",
    releaseNotesUrl: IOS_NOTES,
    paragraphs: [
      paragraph(
        "iOS 16.2 introduced Freeform, Apple Music Sing, and Advanced Data Protection for iCloud. It also expanded Always-On display controls on supported iPhone 14 Pro models and added Lock Screen widgets for sleep and medications.",
        [
          citation(
            IOS_NOTES,
            "iOS 16.2 — Freeform, Apple Music Sing, Advanced Data Protection, and Lock Screen",
          ),
        ],
      ),
      paragraph(
        "Game Center gained SharePlay support, Home communication reliability was revised, and AirDrop’s Everyone setting began returning to Contacts Only after ten minutes. The update also included fixes for Messages search, Notes syncing, and Crash Detection.",
        [
          citation(
            IOS_NOTES,
            "iOS 16.2 — Game Center, Home, and additional improvements",
          ),
        ],
      ),
    ],
    citations: [citation(IOS_NOTES, "iOS 16.2")],
  },
  {
    platform: "ios",
    number: "16.3",
    releaseNotesUrl: IOS_NOTES,
    paragraphs: [
      paragraph(
        "iOS 16.3 added physical Security Keys as an optional second factor for Apple ID, introduced the Unity wallpaper, and supported the second-generation HomePod. It also changed the Emergency SOS button gesture to reduce accidental calls.",
        [
          citation(
            IOS_NOTES,
            "iOS 16.3 — Unity wallpaper, Security Keys, HomePod, and Emergency SOS",
          ),
        ],
      ),
      paragraph(
        "The release corrected shared Freeform drawing visibility, Lock Screen wallpaper and widget issues, and several Siri behaviors. Apple also documented a display wake artifact on iPhone 14 Pro Max among the resolved problems.",
        [citation(IOS_NOTES, "iOS 16.3 — fixes")],
      ),
    ],
    citations: [citation(IOS_NOTES, "iOS 16.3")],
  },
  {
    platform: "ios",
    number: "16.3.1",
    releaseNotesUrl: IOS_NOTES,
    paragraphs: [
      paragraph(
        "iOS 16.3.1 was a corrective release for iCloud, Siri, and Crash Detection. It addressed iCloud settings that could stop responding or display incorrectly when apps used iCloud, plus Siri requests to Find My that could fail.",
        [citation(IOS_NOTES, "iOS 16.3.1")],
      ),
      paragraph(
        "Apple also made additional Crash Detection optimizations for iPhone 14 models and classified the update as including security corrections. The release did not introduce a new consumer feature set.",
        [
          citation(IOS_NOTES, "iOS 16.3.1"),
          citation(SECURITY_INDEX, "Apple security releases"),
        ],
      ),
    ],
    citations: [
      citation(IOS_NOTES, "iOS 16.3.1"),
      citation(SECURITY_INDEX, "Apple security releases"),
    ],
  },
  {
    platform: "ios",
    number: "16.4",
    releaseNotesUrl: IOS_NOTES,
    paragraphs: [
      paragraph(
        "iOS 16.4 added 21 emoji, push notifications for Home Screen web apps, Voice Isolation for cellular calls, and broader duplicate detection inside iCloud Shared Photo Library. An accessibility setting could automatically dim video containing flashes or strobe effects.",
        [citation(IOS_NOTES, "iOS 16.4 — enhancements and bug fixes")],
      ),
      paragraph(
        "For developers, Apple moved beta enrollment into Software Update for eligible program members and documented new Matter accessory update support. The release also addressed Ask to Buy, Matter thermostat, and Crash Detection problems.",
        [
          citation(
            SHARED_16_4_DEVELOPER,
            "Beta enrollment for iPhone and iPad — New Features; Home — New Features",
          ),
          citation(IOS_NOTES, "iOS 16.4 — fixes"),
        ],
      ),
    ],
    citations: [
      citation(IOS_NOTES, "iOS 16.4"),
      citation(SHARED_16_4_DEVELOPER, "iOS & iPadOS 16.4 Release Notes"),
    ],
  },
  {
    platform: "ios",
    number: "16.4.1",
    releaseNotesUrl: IOS_NOTES,
    paragraphs: [
      paragraph(
        "iOS 16.4.1 corrected two visible regressions from the preceding release: the pushing-hands emoji could fail to offer skin-tone variations, and Siri could fail to respond in some cases.",
        [citation(IOS_NOTES, "iOS 16.4.1")],
      ),
      paragraph(
        "Apple also classified 16.4.1 as a security update. This record keeps the feature scope limited to the two consumer-facing fixes Apple listed and points separately to Apple’s security-release archive.",
        [
          citation(IOS_NOTES, "iOS 16.4.1"),
          citation(SECURITY_INDEX, "Apple security releases"),
        ],
      ),
    ],
    citations: [
      citation(IOS_NOTES, "iOS 16.4.1"),
      citation(SECURITY_INDEX, "Apple security releases"),
    ],
  },
  {
    platform: "ios",
    number: "16.5",
    releaseNotesUrl: IOS_NOTES,
    paragraphs: [
      paragraph(
        "iOS 16.5 added a Pride Celebration Lock Screen wallpaper and reorganized sports coverage in Apple News with a dedicated Sports tab plus score and schedule cards that linked into individual game pages.",
        [citation(IOS_NOTES, "iOS 16.5 — enhancements")],
      ),
      paragraph(
        "The release also fixed an unresponsive Spotlight state, CarPlay podcast loading failures, and Screen Time settings that could reset or fail to synchronize. Developer notes separately expanded what shared Home administrators could do with Matter accessories.",
        [
          citation(IOS_NOTES, "iOS 16.5 — fixes"),
          citation(
            SHARED_16_5_DEVELOPER,
            "Home — New Features and Resolved Issues",
          ),
        ],
      ),
    ],
    citations: [
      citation(IOS_NOTES, "iOS 16.5"),
      citation(SHARED_16_5_DEVELOPER, "iOS & iPadOS 16.5 Release Notes"),
    ],
  },
  {
    platform: "ios",
    number: "16.5.1",
    releaseNotesUrl: IOS_NOTES,
    paragraphs: [
      paragraph(
        "iOS 16.5.1 was a narrowly scoped maintenance update. Its one named consumer fix restored charging when using Apple’s Lightning to USB 3 Camera Adapter.",
        [citation(IOS_NOTES, "iOS 16.5.1")],
      ),
      paragraph(
        "Apple also described the release as carrying important security fixes. The record does not turn that general statement into unlisted vulnerability claims; security detail remains attributable to Apple’s bulletin index.",
        [
          citation(IOS_NOTES, "iOS 16.5.1"),
          citation(SECURITY_INDEX, "Apple security releases"),
        ],
      ),
    ],
    citations: [
      citation(IOS_NOTES, "iOS 16.5.1"),
      citation(SECURITY_INDEX, "Apple security releases"),
    ],
  },
  {
    platform: "ios",
    number: "16.6",
    releaseNotesUrl: IOS_NOTES,
    paragraphs: [
      paragraph(
        "iOS 16.6 was primarily a bug-fix and security release in Apple’s consumer notes. The corresponding developer notes identify a concrete Home correction: pairing the first Matter accessory in a new Home from the nearby-accessories list no longer failed.",
        [
          citation(IOS_NOTES, "iOS 16.6"),
          citation(SHARED_16_6_DEVELOPER, "Home — Resolved Issues"),
        ],
      ),
      paragraph(
        "Apple also documented a return to pre-16.3 behavior for negative baseline offsets applied across an entire UILabel attributed-text run. This page separates that developer-facing behavior from the broader, unnamed maintenance work.",
        [citation(SHARED_16_6_DEVELOPER, "Xcode — Known Issues")],
      ),
    ],
    citations: [
      citation(IOS_NOTES, "iOS 16.6"),
      citation(SHARED_16_6_DEVELOPER, "iOS & iPadOS 16.6 Release Notes"),
    ],
  },
  {
    platform: "ios",
    number: "16.6.1",
    releaseNotesUrl: IOS_NOTES,
    paragraphs: [
      paragraph(
        "iOS 16.6.1 was a security-only maintenance release in Apple’s public description. Apple recommended the update for all users but did not list a consumer-facing feature or ordinary bug fix on the cumulative iOS 16 notes page.",
        [citation(IOS_NOTES, "iOS 16.6.1")],
      ),
      paragraph(
        "Accordingly, this record preserves the narrow documented scope and does not borrow changes from iOS 16.6 or iOS 16.7. Apple’s security index is linked for its version-specific bulletin trail.",
        [
          citation(IOS_NOTES, "iOS 16.6.1"),
          citation(SECURITY_INDEX, "Apple security releases"),
        ],
      ),
    ],
    citations: [
      citation(IOS_NOTES, "iOS 16.6.1"),
      citation(SECURITY_INDEX, "Apple security releases"),
    ],
  },
  {
    platform: "ios",
    number: "16.7",
    releaseNotesUrl: IOS_NOTES,
    paragraphs: [
      paragraph(
        "iOS 16.7 continued maintenance for devices remaining on the iOS 16 branch. Apple’s public release note describes important bug fixes and security updates, without enumerating a new feature or naming an individual consumer defect.",
        [citation(IOS_NOTES, "iOS 16.7")],
      ),
      paragraph(
        "The page therefore records the release as a maintenance and security checkpoint rather than inventing a more specific change list. Detailed vulnerability information remains attributable to Apple’s security-release archive.",
        [
          citation(IOS_NOTES, "iOS 16.7"),
          citation(SECURITY_INDEX, "Apple security releases"),
        ],
      ),
    ],
    citations: [
      citation(IOS_NOTES, "iOS 16.7"),
      citation(SECURITY_INDEX, "Apple security releases"),
    ],
  },
  {
    platform: "ipados",
    number: "16.0",
    releaseNotesUrl: IPADOS_DEVELOPER,
    paragraphs: [
      paragraph(
        "iPadOS 16.0 belongs to the pre-release history, but it did not become the first generally available iPadOS 16 build. Apple’s public launch announcement began iPadOS 16 availability with iPadOS 16.1 on October 24, 2022.",
        [
          citation(IPADOS_NEWSROOM, "Availability"),
          citation(
            IPADOS_NOTES,
            "About iPadOS 16 Updates — version index begins at iPadOS 16.1",
          ),
        ],
      ),
      paragraph(
        "The 16.0 cycle still matters historically because its betas and developer documentation introduced the iPadOS 16 SDK and informed testing before the superseding 16.1 public release. This page intentionally distinguishes a tested release cycle from public availability.",
        [citation(IPADOS_DEVELOPER, "iPadOS 16 Release Notes")],
      ),
    ],
    citations: [
      citation(IPADOS_DEVELOPER, "iPadOS 16 Release Notes"),
      citation(IPADOS_NEWSROOM, "iPadOS 16 is available today"),
      citation(IPADOS_NOTES, "About iPadOS 16 Updates"),
    ],
  },
  {
    platform: "ipados",
    number: "16.1",
    releaseNotesUrl: IPADOS_NOTES,
    paragraphs: [
      paragraph(
        "iPadOS 16.1 was the first generally available iPadOS 16 release. It introduced Stage Manager on supported iPads, iCloud Shared Photo Library, Messages editing and collaboration, expanded Mail tools, Safari passkeys and shared tab groups, and a Weather app designed for iPad.",
        [
          citation(IPADOS_NOTES, "iPadOS 16.1"),
          citation(IPADOS_NEWSROOM, "iPadOS 16 is available today"),
        ],
      ),
      paragraph(
        "The release also added professional display modes, improved dictation and Live Text workflows, and new Home, Maps, News, and accessibility capabilities. Device, language, and regional limits varied across the feature set.",
        [
          citation(
            IPADOS_NOTES,
            "iPadOS 16.1 — New Display Modes through Accessibility",
          ),
        ],
      ),
    ],
    citations: [
      citation(IPADOS_NOTES, "iPadOS 16.1"),
      citation(IPADOS_NEWSROOM, "iPadOS 16 is available today"),
      citation(IPADOS_DEVELOPER, "iPadOS 16 Release Notes"),
    ],
  },
  {
    platform: "ipados",
    number: "16.2",
    releaseNotesUrl: IPADOS_NOTES,
    paragraphs: [
      paragraph(
        "iPadOS 16.2 introduced Freeform, Apple Music Sing, and Advanced Data Protection for iCloud. On supported iPads, Stage Manager gained external-display output up to 6K and could place four apps on the iPad display plus four on the external display.",
        [
          citation(
            IPADOS_NOTES,
            "iPadOS 16.2 — Freeform, Stage Manager, Apple Music Sing, and Advanced Data Protection",
          ),
        ],
      ),
      paragraph(
        "The update also added Game Center SharePlay, improved Home accessory communication, revised AirDrop’s Everyone duration, and fixed several collaboration and synchronization issues. Feature availability remained dependent on compatible hardware and region.",
        [
          citation(
            IPADOS_NOTES,
            "iPadOS 16.2 — Game Center, Home, and additional improvements",
          ),
        ],
      ),
    ],
    citations: [citation(IPADOS_NOTES, "iPadOS 16.2")],
  },
  {
    platform: "ipados",
    number: "16.3",
    releaseNotesUrl: IPADOS_NOTES,
    paragraphs: [
      paragraph(
        "iPadOS 16.3 added physical Security Keys as an optional second factor for Apple ID and support for the second-generation HomePod. It also addressed Freeform strokes that could disappear from shared boards.",
        [citation(IPADOS_NOTES, "iPadOS 16.3 — enhancements and fixes")],
      ),
      paragraph(
        "Additional corrections covered Siri music requests and other reliability or security work described by Apple. This was a smaller update than 16.2, with account protection and targeted fixes forming the documented center of the release.",
        [
          citation(IPADOS_NOTES, "iPadOS 16.3"),
          citation(SECURITY_INDEX, "Apple security releases"),
        ],
      ),
    ],
    citations: [
      citation(IPADOS_NOTES, "iPadOS 16.3"),
      citation(SECURITY_INDEX, "Apple security releases"),
    ],
  },
  {
    platform: "ipados",
    number: "16.4",
    releaseNotesUrl: IPADOS_NOTES,
    paragraphs: [
      paragraph(
        "iPadOS 16.4 added 21 emoji, Home Screen web-app notifications, and wider duplicate detection in iCloud Shared Photo Library. Supported M2 iPad Pro models gained Apple Pencil hover previews that accounted for tilt and azimuth.",
        [citation(IPADOS_NOTES, "iPadOS 16.4 — enhancements")],
      ),
      paragraph(
        "The release also introduced an accessibility option to dim flashing video and corrected Apple Pencil responsiveness, Ask to Buy delivery, and Matter thermostat behavior. Eligible developers could enroll devices in betas directly through Software Update.",
        [
          citation(IPADOS_NOTES, "iPadOS 16.4 — fixes"),
          citation(
            SHARED_16_4_DEVELOPER,
            "Beta enrollment for iPhone and iPad — New Features",
          ),
        ],
      ),
    ],
    citations: [
      citation(IPADOS_NOTES, "iPadOS 16.4"),
      citation(SHARED_16_4_DEVELOPER, "iOS & iPadOS 16.4 Release Notes"),
    ],
  },
  {
    platform: "ipados",
    number: "16.5",
    releaseNotesUrl: IPADOS_NOTES,
    paragraphs: [
      paragraph(
        "iPadOS 16.5 added a Sports tab and richer score and schedule cards to Apple News. It also fixed Spotlight responsiveness and Screen Time settings that could reset or fail to synchronize across devices.",
        [citation(IPADOS_NOTES, "iPadOS 16.5")],
      ),
      paragraph(
        "Apple’s developer notes added another Home capability: shared administrators could pair and add Matter accessories. The same notes documented several Matter software-update and shared-administrator corrections.",
        [
          citation(
            SHARED_16_5_DEVELOPER,
            "Home — New Features and Resolved Issues",
          ),
        ],
      ),
    ],
    citations: [
      citation(IPADOS_NOTES, "iPadOS 16.5"),
      citation(SHARED_16_5_DEVELOPER, "iOS & iPadOS 16.5 Release Notes"),
    ],
  },
  {
    platform: "ipados",
    number: "16.6",
    releaseNotesUrl: IPADOS_NOTES,
    paragraphs: [
      paragraph(
        "iPadOS 16.6 was primarily a maintenance and security release in Apple’s consumer documentation. The developer notes identify a specific Home fix for pairing the first Matter accessory in a new Home through the nearby-accessories list.",
        [
          citation(IPADOS_NOTES, "iPadOS 16.6"),
          citation(SHARED_16_6_DEVELOPER, "Home — Resolved Issues"),
        ],
      ),
      paragraph(
        "Apple also documented a UILabel baseline-offset behavior change relevant to developers. Keeping those named items distinct from the general maintenance statement avoids assigning unsupported fixes to the release.",
        [citation(SHARED_16_6_DEVELOPER, "Xcode — Known Issues")],
      ),
    ],
    citations: [
      citation(IPADOS_NOTES, "iPadOS 16.6"),
      citation(SHARED_16_6_DEVELOPER, "iOS & iPadOS 16.6 Release Notes"),
    ],
  },
];

const changes = (platform, number, sourceUrl, rows) =>
  rows.map(
    ([
      slug,
      title,
      canonicalSummary,
      category,
      action,
      summary,
      locator,
      overrideUrl,
    ]) =>
      change({
        platform,
        number,
        slug,
        title,
        canonicalSummary,
        category,
        action,
        summary,
        sourceUrl: overrideUrl || sourceUrl,
        locator,
      }),
  );

const eventRows = [
  event({
    platform: "ios",
    number: "16.0",
    summary:
      "The public iOS 16 release rebuilt Lock Screen personalization and expanded communication, productivity, sign-in, and visual-recognition workflows.",
    sourceUrl: IOS_NOTES,
    locator: "iOS 16",
    extraCitations: [citation(IOS_NEWSROOM, "iOS 16 is available today")],
    changes: changes("ios", "16.0", IOS_NOTES, [
      [
        "lock-screen-personalization",
        "Configurable Lock Screens",
        "iOS Lock Screens can combine photos, typography, widgets, notification layouts, and multiple saved configurations.",
        "feature",
        "introduced",
        "iOS 16 made the Lock Screen configurable with photo effects, fonts, colors, widgets, notification layouts, and multiple switchable designs.",
        "iOS 16 — Lock Screen",
      ],
      [
        "focus-linking-filters",
        "Lock Screen Focus linking and filters",
        "Focus modes can link to Lock Screens and filter selected content inside supported applications.",
        "feature",
        "introduced",
        "A saved Lock Screen could activate its linked Focus, while Focus filters limited selected content in apps such as Calendar, Mail, Messages, and Safari.",
        "iOS 16 — Focus",
      ],
      [
        "messages-edit-unsend",
        "Messages editing and undo send",
        "Messages can be edited shortly after sending, recalled within a shorter window, and marked unread for later attention.",
        "feature",
        "introduced",
        "Messages added editing, undo send, unread markers, SharePlay, and collaboration invitations with thread activity.",
        "iOS 16 — Messages",
      ],
      [
        "live-text-video-visual-lookup",
        "Live Text in video and subject lifting",
        "Live Text can recognize text in paused video, while Visual Look Up can isolate supported subjects from image backgrounds.",
        "feature",
        "introduced",
        "Supported devices could interact with text in paused video and lift a recognized photo subject for use in other apps.",
        "iOS 16 — Live Text and Visual Look Up",
      ],
      [
        "passkeys-shared-tab-groups",
        "Passkeys and Shared Tab Groups",
        "Safari adds passkey sign-in and collaborative tab groups synchronized across supported Apple devices.",
        "feature",
        "introduced",
        "Safari introduced passkeys as a password alternative and let participants collaborate in shared tab groups.",
        "iOS 16 — Safari and Passkeys",
      ],
    ]),
  }),
  event({
    platform: "ios",
    number: "16.0.1",
    summary:
      "The iPhone 14-family launch update fixed activation, photo rendering, and enterprise authentication problems.",
    sourceUrl: IOS_NOTES,
    locator: "iOS 16.0.1",
    changes: changes("ios", "16.0.1", IOS_NOTES, [
      [
        "message-facetime-activation",
        "iMessage and FaceTime activation fix",
        "iMessage and FaceTime activation can complete correctly on affected iPhone 14-family devices.",
        "bugFix",
        "fixed",
        "Apple corrected an activation failure affecting iMessage and FaceTime.",
        "iOS 16.0.1",
      ],
      [
        "landscape-zoom-photo-softness",
        "iPhone 14 Pro Max landscape zoom fix",
        "Photos retain expected sharpness when zoomed in landscape orientation on iPhone 14 Pro Max.",
        "bugFix",
        "fixed",
        "The update fixed soft-looking photos while zooming in landscape orientation on iPhone 14 Pro Max.",
        "iOS 16.0.1",
      ],
      [
        "enterprise-sso-authentication",
        "Enterprise single sign-on authentication fix",
        "Enterprise single sign-on applications can authenticate correctly on affected devices.",
        "bugFix",
        "fixed",
        "Apple corrected failed authentication in enterprise single sign-on apps.",
        "iOS 16.0.1",
      ],
    ]),
  }),
  event({
    platform: "ios",
    number: "16.0.2",
    summary:
      "This early corrective release addressed camera, setup, paste-permission, accessibility, and serviced-display defects.",
    sourceUrl: IOS_NOTES,
    locator: "iOS 16.0.2",
    changes: changes("ios", "16.0.2", IOS_NOTES, [
      [
        "third-party-camera-vibration",
        "Third-party camera vibration fix",
        "The camera no longer vibrates and blurs captures in the documented third-party app scenario on iPhone 14 Pro models.",
        "bugFix",
        "fixed",
        "Apple corrected camera vibration and blurred photos in some third-party apps on iPhone 14 Pro and Pro Max.",
        "iOS 16.0.2",
      ],
      [
        "paste-permission-frequency",
        "Paste permission prompt frequency fix",
        "Copying and pasting between apps no longer triggers permission prompts more often than intended.",
        "bugFix",
        "fixed",
        "The release reduced excessive permission prompts during cross-app copy and paste.",
        "iOS 16.0.2",
      ],
      [
        "voiceover-after-restart",
        "VoiceOver restart availability fix",
        "VoiceOver remains available after restarting affected devices.",
        "bugFix",
        "fixed",
        "Apple fixed a state in which VoiceOver could be unavailable after a reboot.",
        "iOS 16.0.2",
      ],
      [
        "serviced-display-touch",
        "Serviced display touch-input fix",
        "Touch input responds on affected serviced displays for supported older iPhone models.",
        "bugFix",
        "fixed",
        "The update restored touch response on some serviced iPhone X, XR, and 11 displays.",
        "iOS 16.0.2",
      ],
    ]),
  }),
  event({
    platform: "ios",
    number: "16.0.3",
    summary:
      "iOS 16.0.3 fixed several iPhone 14-family reliability problems and a malformed-message crash in Mail.",
    sourceUrl: IOS_NOTES,
    locator: "iOS 16.0.3",
    changes: changes("ios", "16.0.3", IOS_NOTES, [
      [
        "iphone-14-pro-notifications",
        "iPhone 14 Pro notification delivery fix",
        "Calls and application notifications arrive without the documented delay or omission on iPhone 14 Pro models.",
        "bugFix",
        "fixed",
        "Apple corrected delayed or missing incoming-call and app notifications on iPhone 14 Pro and Pro Max.",
        "iOS 16.0.3",
      ],
      [
        "carplay-microphone-volume",
        "CarPlay call microphone-volume fix",
        "CarPlay phone calls use expected microphone volume on affected iPhone 14 devices.",
        "bugFix",
        "fixed",
        "The update corrected low microphone volume during CarPlay calls on iPhone 14 models.",
        "iOS 16.0.3",
      ],
      [
        "iphone-14-pro-camera-launch",
        "iPhone 14 Pro camera responsiveness fix",
        "The Camera app launches and changes modes without the documented delay on iPhone 14 Pro models.",
        "bugFix",
        "fixed",
        "Apple fixed slow Camera launches and mode switching on iPhone 14 Pro and Pro Max.",
        "iOS 16.0.3",
      ],
      [
        "mail-malformed-message-crash",
        "Malformed Mail message crash fix",
        "Mail no longer crashes at launch after receiving the documented malformed email.",
        "security",
        "fixed",
        "The release corrected a Mail launch crash caused by receiving a malformed message.",
        "iOS 16.0.3",
      ],
    ]),
  }),
  event({
    platform: "ios",
    number: "16.1",
    summary:
      "iOS 16.1 completed several deferred parts of the iOS 16 feature set, including shared photo libraries, Live Activities, Matter, and Clean Energy Charging.",
    sourceUrl: IOS_NOTES,
    locator: "iOS 16.1",
    changes: changes("ios", "16.1", IOS_NOTES, [
      [
        "shared-photo-library",
        "iCloud Shared Photo Library",
        "A separate iCloud photo library lets as many as six participants contribute, edit, and manage shared photos and videos.",
        "feature",
        "introduced",
        "iOS 16.1 introduced a separate shared library with contribution rules, library filters, shared editing, and camera integration.",
        "iOS 16.1 — iCloud Shared Photo Library",
      ],
      [
        "live-activities",
        "Third-party Live Activities",
        "Supported third-party apps can present continuously updated information on the Lock Screen and Dynamic Island.",
        "feature",
        "introduced",
        "Live Activities from third-party apps became available on the Lock Screen and, on supported models, in Dynamic Island.",
        "iOS 16.1 — Live Activities",
      ],
      [
        "fitness-plus-without-watch",
        "Fitness+ without Apple Watch",
        "Apple Fitness+ can be used on iPhone without pairing an Apple Watch.",
        "feature",
        "introduced",
        "Apple Fitness+ became available to iPhone users who did not own an Apple Watch.",
        "iOS 16.1 — Fitness+",
      ],
      [
        "matter-support",
        "Matter smart-home support",
        "Apple Home can work with supported accessories based on the cross-ecosystem Matter standard.",
        "compatibility",
        "introduced",
        "The Home platform added support for Matter-compatible smart-home accessories.",
        "iOS 16.1 — Home",
      ],
      [
        "clean-energy-charging",
        "Clean Energy Charging",
        "iPhone can selectively charge when lower-carbon electricity is expected to be available in supported locations.",
        "feature",
        "introduced",
        "Clean Energy Charging added an optional charging strategy intended to reduce carbon impact when local conditions support it.",
        "iOS 16.1 — Clean Energy Charging",
      ],
    ]),
  }),
  event({
    platform: "ios",
    number: "16.1.1",
    summary:
      "Apple characterized iOS 16.1.1 as a recommended maintenance release containing bug fixes and security updates.",
    sourceUrl: IOS_NOTES,
    locator: "iOS 16.1.1",
    extraCitations: [citation(SECURITY_INDEX, "Apple security releases")],
    changes: changes("ios", "16.1.1", IOS_NOTES, [
      [
        "maintenance-security",
        "Maintenance and security corrections",
        "The release contains Apple-documented bug fixes and security updates whose consumer-facing details were not individually enumerated.",
        "bugFix",
        "fixed",
        "Apple documented general bug and security corrections but did not list individual consumer-facing changes on the cumulative notes page.",
        "iOS 16.1.1",
      ],
    ]),
  }),
  event({
    platform: "ios",
    number: "16.1.2",
    summary:
      "iOS 16.1.2 improved carrier compatibility and adjusted Crash Detection behavior on iPhone 14 models.",
    sourceUrl: IOS_NOTES,
    locator: "iOS 16.1.2",
    changes: changes("ios", "16.1.2", IOS_NOTES, [
      [
        "wireless-carrier-compatibility",
        "Wireless carrier compatibility improvements",
        "The release improves compatibility between iPhone and supported wireless carrier networks.",
        "compatibility",
        "changed",
        "Apple documented improved compatibility with wireless carriers.",
        "iOS 16.1.2",
      ],
      [
        "crash-detection-tuning",
        "Crash Detection optimization",
        "Crash Detection behavior is tuned on iPhone 14 and iPhone 14 Pro models.",
        "enhancement",
        "changed",
        "The update further optimized Crash Detection on the iPhone 14 family.",
        "iOS 16.1.2",
      ],
    ]),
  }),
  event({
    platform: "ios",
    number: "16.2",
    summary:
      "iOS 16.2 added Freeform, Apple Music Sing, Advanced Data Protection, richer Lock Screen tools, and revised AirDrop behavior.",
    sourceUrl: IOS_NOTES,
    locator: "iOS 16.2",
    changes: changes("ios", "16.2", IOS_NOTES, [
      [
        "freeform",
        "Freeform collaborative canvas",
        "Freeform provides a flexible shared canvas for drawings, notes, images, files, and other material.",
        "feature",
        "introduced",
        "The new Freeform app supported collaborative canvases with files, images, notes, and finger drawing.",
        "iOS 16.2 — Freeform",
      ],
      [
        "apple-music-sing",
        "Apple Music Sing",
        "Apple Music Sing provides adjustable vocals and enhanced time-synchronized lyrics for supported songs.",
        "feature",
        "introduced",
        "Apple Music added adjustable vocal levels and beat-by-beat lyrics for supported sing-along tracks.",
        "iOS 16.2 — Apple Music Sing",
      ],
      [
        "advanced-data-protection",
        "Advanced Data Protection for iCloud",
        "Advanced Data Protection expands end-to-end encryption to additional iCloud data categories when enabled.",
        "security",
        "introduced",
        "The optional protection expanded end-to-end encryption to 23 iCloud data categories, including Backup, Notes, and Photos.",
        "iOS 16.2 — Advanced Data Protection for iCloud",
      ],
      [
        "always-on-controls-widgets",
        "Always-On display controls and Lock Screen widgets",
        "Supported iPhone models gain additional Always-On display choices and Lock Screen widgets for sleep and medications.",
        "enhancement",
        "introduced",
        "iPhone 14 Pro models could hide wallpaper or notifications in Always-On mode, while sleep and medication widgets became available.",
        "iOS 16.2 — Lock Screen",
      ],
      [
        "airdrop-ten-minute-limit",
        "AirDrop Everyone duration limit",
        "AirDrop automatically returns from Everyone to Contacts Only after ten minutes.",
        "behavior",
        "changed",
        "The Everyone receiving setting began reverting to Contacts Only after ten minutes.",
        "iOS 16.2 — additional improvements",
      ],
    ]),
  }),
  event({
    platform: "ios",
    number: "16.3",
    summary:
      "iOS 16.3 strengthened Apple ID sign-in, added HomePod support and a commemorative wallpaper, and revised Emergency SOS activation.",
    sourceUrl: IOS_NOTES,
    locator: "iOS 16.3",
    changes: changes("ios", "16.3", IOS_NOTES, [
      [
        "apple-id-security-keys",
        "Security Keys for Apple ID",
        "Apple ID can require a compatible physical security key during two-factor sign-in on new devices.",
        "security",
        "introduced",
        "Users could strengthen Apple ID two-factor authentication by requiring a physical security key during new-device sign-in.",
        "iOS 16.3 — Security Keys for Apple ID",
      ],
      [
        "unity-wallpaper",
        "Unity Lock Screen wallpaper",
        "A Unity wallpaper commemorates Black history and culture for Black History Month.",
        "feature",
        "introduced",
        "The release added a Unity wallpaper honoring Black history and culture.",
        "iOS 16.3 — Unity wallpaper",
      ],
      [
        "homepod-second-generation",
        "Second-generation HomePod support",
        "iOS supports setup and use of the second-generation HomePod.",
        "compatibility",
        "introduced",
        "The second-generation HomePod became supported.",
        "iOS 16.3 — HomePod",
      ],
      [
        "emergency-sos-gesture",
        "Revised Emergency SOS gesture",
        "Emergency SOS calls require holding the side and a volume button and then releasing, reducing unintended calls.",
        "behavior",
        "changed",
        "Apple changed the Emergency SOS button gesture to require a hold-and-release sequence.",
        "iOS 16.3 — Emergency SOS",
      ],
    ]),
  }),
  event({
    platform: "ios",
    number: "16.3.1",
    summary:
      "This corrective release addressed iCloud settings, Siri requests to Find My, and Crash Detection behavior.",
    sourceUrl: IOS_NOTES,
    locator: "iOS 16.3.1",
    changes: changes("ios", "16.3.1", IOS_NOTES, [
      [
        "icloud-settings-responsiveness",
        "iCloud settings responsiveness fix",
        "iCloud settings remain responsive and display correctly when applications use iCloud.",
        "bugFix",
        "fixed",
        "Apple corrected iCloud settings that could stop responding or display incorrectly.",
        "iOS 16.3.1",
      ],
      [
        "siri-find-my",
        "Siri Find My request fix",
        "Siri can complete supported Find My requests correctly.",
        "bugFix",
        "fixed",
        "The update fixed Siri requests to Find My that could fail.",
        "iOS 16.3.1",
      ],
      [
        "crash-detection-optimization",
        "Crash Detection optimization",
        "Crash Detection behavior is further tuned on iPhone 14 and iPhone 14 Pro models.",
        "enhancement",
        "changed",
        "Apple made additional Crash Detection optimizations for the iPhone 14 family.",
        "iOS 16.3.1",
      ],
    ]),
  }),
  event({
    platform: "ios",
    number: "16.4",
    summary:
      "iOS 16.4 expanded emoji, web-app notifications, calling, Photos, accessibility, Matter, and developer-beta enrollment.",
    sourceUrl: IOS_NOTES,
    locator: "iOS 16.4",
    extraCitations: [
      citation(
        SHARED_16_4_DEVELOPER,
        "Beta enrollment for iPhone and iPad — New Features",
      ),
    ],
    changes: changes("ios", "16.4", IOS_NOTES, [
      [
        "new-emoji",
        "Twenty-one additional emoji",
        "The emoji keyboard adds 21 designs spanning animals, gestures, and objects.",
        "feature",
        "introduced",
        "The emoji keyboard gained 21 additional characters.",
        "iOS 16.4 — enhancements",
      ],
      [
        "home-screen-web-push",
        "Home Screen web-app notifications",
        "Web applications added to the Home Screen can deliver notifications with permission.",
        "feature",
        "introduced",
        "Home Screen web apps gained notification support.",
        "iOS 16.4 — enhancements",
      ],
      [
        "cellular-voice-isolation",
        "Voice Isolation for cellular calls",
        "Voice Isolation can prioritize the speaker’s voice and reduce ambient sound during cellular calls.",
        "enhancement",
        "introduced",
        "Cellular calls gained Voice Isolation to emphasize the user’s voice over surrounding noise.",
        "iOS 16.4 — enhancements",
      ],
      [
        "shared-library-duplicate-detection",
        "Shared Library duplicate detection",
        "Photos can detect duplicate photos and videos within an iCloud Shared Photo Library.",
        "enhancement",
        "introduced",
        "The Duplicates album expanded to iCloud Shared Photo Library content.",
        "iOS 16.4 — enhancements",
      ],
      [
        "flashing-light-dimming",
        "Automatic flashing-light dimming",
        "An accessibility setting can automatically dim video when flashes or strobe effects are detected.",
        "feature",
        "introduced",
        "Users could enable automatic dimming for detected flashes or strobe effects in video.",
        "iOS 16.4 — enhancements",
      ],
      [
        "settings-beta-enrollment",
        "Settings-based developer beta enrollment",
        "Eligible Apple Developer Program members can enable device betas directly from Software Update while signed in with the enrolled Apple ID.",
        "developerApi",
        "introduced",
        "Developer beta enrollment moved into Settings > General > Software Update for eligible program members.",
        "Beta enrollment for iPhone and iPad — New Features",
        SHARED_16_4_DEVELOPER,
      ],
    ]),
  }),
  event({
    platform: "ios",
    number: "16.4.1",
    summary:
      "iOS 16.4.1 corrected pushing-hands emoji variants and intermittent Siri response failures.",
    sourceUrl: IOS_NOTES,
    locator: "iOS 16.4.1",
    changes: changes("ios", "16.4.1", IOS_NOTES, [
      [
        "pushing-hands-skin-tones",
        "Pushing-hands emoji skin-tone fix",
        "The pushing-hands emoji presents its supported skin-tone variants.",
        "bugFix",
        "fixed",
        "The update restored skin-tone variations for the pushing-hands emoji.",
        "iOS 16.4.1",
      ],
      [
        "siri-response",
        "Siri response reliability fix",
        "Siri responds in the affected cases where it previously failed.",
        "bugFix",
        "fixed",
        "Apple corrected cases in which Siri did not respond.",
        "iOS 16.4.1",
      ],
    ]),
  }),
  event({
    platform: "ios",
    number: "16.5",
    summary:
      "iOS 16.5 added Pride and sports content while fixing Spotlight, CarPlay Podcasts, Screen Time, and several Matter workflows.",
    sourceUrl: IOS_NOTES,
    locator: "iOS 16.5",
    extraCitations: [
      citation(
        SHARED_16_5_DEVELOPER,
        "Home — New Features and Resolved Issues",
      ),
    ],
    changes: changes("ios", "16.5", IOS_NOTES, [
      [
        "pride-celebration-wallpaper",
        "Pride Celebration wallpaper",
        "A Pride Celebration Lock Screen wallpaper honors LGBTQ+ community and culture.",
        "feature",
        "introduced",
        "The release added a Pride Celebration Lock Screen wallpaper.",
        "iOS 16.5 — enhancements",
      ],
      [
        "apple-news-sports",
        "Apple News Sports tab and game cards",
        "Apple News provides dedicated sports navigation and richer score and schedule cards linked to game detail pages.",
        "enhancement",
        "introduced",
        "Apple News gained a Sports tab and game-linked score and schedule cards for followed teams and leagues.",
        "iOS 16.5 — enhancements",
      ],
      [
        "spotlight-responsiveness",
        "Spotlight responsiveness fix",
        "Spotlight remains responsive in the affected search state.",
        "bugFix",
        "fixed",
        "Apple corrected an issue that could leave Spotlight unresponsive.",
        "iOS 16.5 — fixes",
      ],
      [
        "carplay-podcasts-loading",
        "CarPlay Podcasts loading fix",
        "Podcasts content loads correctly in CarPlay in the affected scenario.",
        "bugFix",
        "fixed",
        "The update fixed Podcasts content failing to load in CarPlay.",
        "iOS 16.5 — fixes",
      ],
      [
        "screen-time-sync",
        "Screen Time settings synchronization fix",
        "Screen Time settings retain their values and synchronize across devices in the affected cases.",
        "bugFix",
        "fixed",
        "Apple fixed Screen Time settings that could reset or fail to sync across devices.",
        "iOS 16.5 — fixes",
      ],
      [
        "matter-shared-admin-pairing",
        "Matter pairing by shared Home administrators",
        "A shared Home administrator can pair and add supported Matter accessories.",
        "enhancement",
        "introduced",
        "Shared Home administrators gained the ability to pair and add Matter accessories.",
        "Home — New Features",
        SHARED_16_5_DEVELOPER,
      ],
    ]),
  }),
  event({
    platform: "ios",
    number: "16.5.1",
    summary:
      "The maintenance release restored charging through Apple’s Lightning to USB 3 Camera Adapter and included security corrections.",
    sourceUrl: IOS_NOTES,
    locator: "iOS 16.5.1",
    extraCitations: [citation(SECURITY_INDEX, "Apple security releases")],
    changes: changes("ios", "16.5.1", IOS_NOTES, [
      [
        "camera-adapter-charging",
        "Lightning to USB 3 Camera Adapter charging fix",
        "Devices can charge correctly while using Apple’s Lightning to USB 3 Camera Adapter.",
        "bugFix",
        "fixed",
        "The update fixed charging failures with the Lightning to USB 3 Camera Adapter.",
        "iOS 16.5.1",
      ],
      [
        "security-corrections",
        "Security corrections",
        "The release includes Apple-documented security corrections, with individual vulnerability details maintained in Apple’s security bulletins.",
        "security",
        "fixed",
        "Apple classified iOS 16.5.1 as carrying important security fixes.",
        "iOS 16.5.1",
      ],
    ]),
  }),
  event({
    platform: "ios",
    number: "16.6",
    summary:
      "iOS 16.6 combined general maintenance with a documented Matter pairing correction and a developer-facing text-layout behavior change.",
    sourceUrl: IOS_NOTES,
    locator: "iOS 16.6",
    extraCitations: [
      citation(
        SHARED_16_6_DEVELOPER,
        "Home — Resolved Issues; Xcode — Known Issues",
      ),
    ],
    changes: changes("ios", "16.6", IOS_NOTES, [
      [
        "matter-first-accessory-pairing",
        "First Matter accessory pairing fix",
        "The first Matter accessory in a new Home can pair when selected from the nearby-accessories list.",
        "bugFix",
        "fixed",
        "Apple fixed a failure when pairing the first Matter accessory in a new Home from the nearby list.",
        "Home — Resolved Issues",
        SHARED_16_6_DEVELOPER,
      ],
      [
        "uilabel-negative-baseline-offset",
        "UILabel negative baseline-offset behavior",
        "A negative baseline offset covering an entire UILabel attributed-text run again lowers text within the label bounds.",
        "behavior",
        "changed",
        "The full-run negative baseline-offset behavior returned to its pre-16.3 text positioning.",
        "Xcode — Known Issues",
        SHARED_16_6_DEVELOPER,
      ],
      [
        "maintenance-security",
        "Maintenance and security corrections",
        "The release contains Apple-documented bug fixes and security updates whose consumer-facing details were not individually enumerated.",
        "bugFix",
        "fixed",
        "Apple’s consumer notes classify the release as containing bug fixes and security updates.",
        "iOS 16.6",
      ],
    ]),
  }),
  event({
    platform: "ios",
    number: "16.6.1",
    summary:
      "Apple described iOS 16.6.1 as an important security update recommended for all users.",
    sourceUrl: IOS_NOTES,
    locator: "iOS 16.6.1",
    extraCitations: [citation(SECURITY_INDEX, "Apple security releases")],
    changes: changes("ios", "16.6.1", IOS_NOTES, [
      [
        "security-corrections",
        "Security corrections",
        "The release includes Apple-documented security corrections, with individual vulnerability details maintained in Apple’s security bulletins.",
        "security",
        "fixed",
        "The public notes characterize iOS 16.6.1 as an important security-fix release.",
        "iOS 16.6.1",
      ],
    ]),
  }),
  event({
    platform: "ios",
    number: "16.7",
    summary:
      "iOS 16.7 maintained the iOS 16 branch with bug fixes and security updates rather than a new feature set.",
    sourceUrl: IOS_NOTES,
    locator: "iOS 16.7",
    extraCitations: [citation(SECURITY_INDEX, "Apple security releases")],
    changes: changes("ios", "16.7", IOS_NOTES, [
      [
        "maintenance-security",
        "Maintenance and security corrections",
        "The release contains Apple-documented bug fixes and security updates whose consumer-facing details were not individually enumerated.",
        "bugFix",
        "fixed",
        "Apple documented important bug and security fixes without listing individual consumer-facing changes.",
        "iOS 16.7",
      ],
    ]),
  }),
  event({
    platform: "ipados",
    number: "16.1",
    summary:
      "The first public iPadOS 16 release introduced Stage Manager and broadened collaboration, communication, web sign-in, display, and weather workflows.",
    sourceUrl: IPADOS_NOTES,
    locator: "iPadOS 16.1",
    extraCitations: [citation(IPADOS_NEWSROOM, "iPadOS 16 is available today")],
    changes: changes("ipados", "16.1", IPADOS_NOTES, [
      [
        "stage-manager",
        "Stage Manager multitasking",
        "Supported iPads can arrange overlapping, resizable application windows into reusable groups with recent apps available alongside.",
        "feature",
        "introduced",
        "Stage Manager introduced overlapping and resizable windows, recent-app switching, and saved app groups on supported iPads.",
        "iPadOS 16.1 — Stage Manager",
      ],
      [
        "shared-photo-library",
        "iCloud Shared Photo Library",
        "A separate iCloud photo library lets as many as six participants contribute, edit, and manage shared photos and videos.",
        "feature",
        "introduced",
        "A separate shared library added contribution rules, filters, shared editing, and camera integration.",
        "iPadOS 16.1 — iCloud Shared Photo Library",
      ],
      [
        "messages-collaboration",
        "Messages editing and collaboration",
        "Messages adds editing, undo send, unread markers, SharePlay, and shared-project collaboration updates.",
        "feature",
        "introduced",
        "Messages gained post-send controls and could initiate collaborative work while surfacing project activity in the thread.",
        "iPadOS 16.1 — Messages",
      ],
      [
        "safari-passkeys-shared-tabs",
        "Safari passkeys and Shared Tab Groups",
        "Safari adds passkey sign-in and collaborative tab groups synchronized across supported Apple devices.",
        "feature",
        "introduced",
        "Safari introduced passkeys and collaborative Shared Tab Groups.",
        "iPadOS 16.1 — Safari and Passkeys",
      ],
      [
        "weather-app",
        "Weather app for iPad",
        "A Weather application optimized for iPad provides animated conditions, detailed maps, and interactive forecast modules.",
        "feature",
        "introduced",
        "iPad gained a Weather app with large-screen layouts, full-screen maps, and tappable forecast detail.",
        "iPadOS 16.1 — Weather",
      ],
    ]),
  }),
  event({
    platform: "ipados",
    number: "16.2",
    summary:
      "iPadOS 16.2 added Freeform, external-display Stage Manager, Apple Music Sing, Advanced Data Protection, and several collaboration improvements.",
    sourceUrl: IPADOS_NOTES,
    locator: "iPadOS 16.2",
    changes: changes("ipados", "16.2", IPADOS_NOTES, [
      [
        "freeform",
        "Freeform collaborative canvas",
        "Freeform provides a flexible shared canvas for drawings, notes, images, files, and other material.",
        "feature",
        "introduced",
        "Freeform launched on iPad with Apple Pencil and finger drawing plus a collaborative canvas for mixed media.",
        "iPadOS 16.2 — Freeform",
      ],
      [
        "stage-manager-external-display",
        "Stage Manager external-display support",
        "Supported iPads can run Stage Manager on an external display up to 6K and move windows and files between displays.",
        "enhancement",
        "introduced",
        "Stage Manager expanded to supported external displays, with up to four apps on each display and cross-display drag and drop.",
        "iPadOS 16.2 — Stage Manager",
      ],
      [
        "apple-music-sing",
        "Apple Music Sing",
        "Apple Music Sing provides adjustable vocals and enhanced time-synchronized lyrics for supported songs.",
        "feature",
        "introduced",
        "Apple Music added adjustable vocals and enhanced lyrics for supported sing-along tracks.",
        "iPadOS 16.2 — Apple Music Sing",
      ],
      [
        "advanced-data-protection",
        "Advanced Data Protection for iCloud",
        "Advanced Data Protection expands end-to-end encryption to additional iCloud data categories when enabled.",
        "security",
        "introduced",
        "The optional protection expanded end-to-end encryption to 23 iCloud data categories.",
        "iPadOS 16.2 — Advanced Data Protection for iCloud",
      ],
      [
        "airdrop-ten-minute-limit",
        "AirDrop Everyone duration limit",
        "AirDrop automatically returns from Everyone to Contacts Only after ten minutes.",
        "behavior",
        "changed",
        "The Everyone receiving setting began reverting to Contacts Only after ten minutes.",
        "iPadOS 16.2 — additional improvements",
      ],
    ]),
  }),
  event({
    platform: "ipados",
    number: "16.3",
    summary:
      "iPadOS 16.3 strengthened Apple ID sign-in, added second-generation HomePod support, and fixed Freeform and Siri problems.",
    sourceUrl: IPADOS_NOTES,
    locator: "iPadOS 16.3",
    changes: changes("ipados", "16.3", IPADOS_NOTES, [
      [
        "apple-id-security-keys",
        "Security Keys for Apple ID",
        "Apple ID can require a compatible physical security key during two-factor sign-in on new devices.",
        "security",
        "introduced",
        "Apple ID gained optional physical Security Keys for stronger two-factor sign-in.",
        "iPadOS 16.3 — Security Keys for Apple ID",
      ],
      [
        "homepod-second-generation",
        "Second-generation HomePod support",
        "iPadOS supports setup and use of the second-generation HomePod.",
        "compatibility",
        "introduced",
        "The release added support for the second-generation HomePod.",
        "iPadOS 16.3 — HomePod",
      ],
      [
        "freeform-shared-drawing",
        "Freeform shared-drawing visibility fix",
        "Drawing strokes made with Apple Pencil or a finger remain visible on affected shared Freeform boards.",
        "bugFix",
        "fixed",
        "Apple corrected strokes that could disappear from shared Freeform boards.",
        "iPadOS 16.3 — fixes",
      ],
      [
        "siri-music-requests",
        "Siri music-request fix",
        "Siri responds correctly to affected music requests.",
        "bugFix",
        "fixed",
        "The update fixed cases in which Siri did not respond correctly to music requests.",
        "iPadOS 16.3 — fixes",
      ],
    ]),
  }),
  event({
    platform: "ipados",
    number: "16.4",
    summary:
      "iPadOS 16.4 expanded emoji, Apple Pencil hover, web-app notifications, Photos, accessibility, and settings-based beta enrollment.",
    sourceUrl: IPADOS_NOTES,
    locator: "iPadOS 16.4",
    extraCitations: [
      citation(
        SHARED_16_4_DEVELOPER,
        "Beta enrollment for iPhone and iPad — New Features",
      ),
    ],
    changes: changes("ipados", "16.4", IPADOS_NOTES, [
      [
        "new-emoji",
        "Twenty-one additional emoji",
        "The emoji keyboard adds 21 designs spanning animals, gestures, and objects.",
        "feature",
        "introduced",
        "The emoji keyboard gained 21 additional characters.",
        "iPadOS 16.4 — enhancements",
      ],
      [
        "pencil-hover-angle-preview",
        "Apple Pencil hover angle preview",
        "Supported M2 iPad Pro models preview an Apple Pencil mark using the pencil’s tilt and azimuth before contact.",
        "enhancement",
        "introduced",
        "Apple Pencil hover began previewing a mark’s angle using tilt and azimuth on supported M2 iPad Pro models.",
        "iPadOS 16.4 — enhancements",
      ],
      [
        "home-screen-web-push",
        "Home Screen web-app notifications",
        "Web applications added to the Home Screen can deliver notifications with permission.",
        "feature",
        "introduced",
        "Home Screen web apps gained notification support.",
        "iPadOS 16.4 — enhancements",
      ],
      [
        "shared-library-duplicate-detection",
        "Shared Library duplicate detection",
        "Photos can detect duplicate photos and videos within an iCloud Shared Photo Library.",
        "enhancement",
        "introduced",
        "The Duplicates album expanded to iCloud Shared Photo Library content.",
        "iPadOS 16.4 — enhancements",
      ],
      [
        "flashing-light-dimming",
        "Automatic flashing-light dimming",
        "An accessibility setting can automatically dim video when flashes or strobe effects are detected.",
        "feature",
        "introduced",
        "Users could enable automatic dimming for detected flashes or strobe effects in video.",
        "iPadOS 16.4 — enhancements",
      ],
      [
        "settings-beta-enrollment",
        "Settings-based developer beta enrollment",
        "Eligible Apple Developer Program members can enable device betas directly from Software Update while signed in with the enrolled Apple ID.",
        "developerApi",
        "introduced",
        "Developer beta enrollment moved into Settings > General > Software Update for eligible program members.",
        "Beta enrollment for iPhone and iPad — New Features",
        SHARED_16_4_DEVELOPER,
      ],
    ]),
  }),
  event({
    platform: "ipados",
    number: "16.5",
    summary:
      "iPadOS 16.5 expanded Apple News sports coverage, fixed Spotlight and Screen Time, and broadened Matter administration.",
    sourceUrl: IPADOS_NOTES,
    locator: "iPadOS 16.5",
    extraCitations: [
      citation(
        SHARED_16_5_DEVELOPER,
        "Home — New Features and Resolved Issues",
      ),
    ],
    changes: changes("ipados", "16.5", IPADOS_NOTES, [
      [
        "apple-news-sports",
        "Apple News Sports tab and game cards",
        "Apple News provides dedicated sports navigation and richer score and schedule cards linked to game detail pages.",
        "enhancement",
        "introduced",
        "Apple News gained a Sports tab and game-linked score and schedule cards for followed teams and leagues.",
        "iPadOS 16.5 — enhancements",
      ],
      [
        "spotlight-responsiveness",
        "Spotlight responsiveness fix",
        "Spotlight remains responsive in the affected search state.",
        "bugFix",
        "fixed",
        "Apple corrected an issue that could leave Spotlight unresponsive.",
        "iPadOS 16.5 — fixes",
      ],
      [
        "screen-time-sync",
        "Screen Time settings synchronization fix",
        "Screen Time settings retain their values and synchronize across devices in the affected cases.",
        "bugFix",
        "fixed",
        "Apple fixed Screen Time settings that could reset or fail to sync across devices.",
        "iPadOS 16.5 — fixes",
      ],
      [
        "matter-shared-admin-pairing",
        "Matter pairing by shared Home administrators",
        "A shared Home administrator can pair and add supported Matter accessories.",
        "enhancement",
        "introduced",
        "Shared Home administrators gained the ability to pair and add Matter accessories.",
        "Home — New Features",
        SHARED_16_5_DEVELOPER,
      ],
    ]),
  }),
  event({
    platform: "ipados",
    number: "16.6",
    summary:
      "iPadOS 16.6 combined general maintenance with a documented Matter pairing correction and a developer-facing text-layout behavior change.",
    sourceUrl: IPADOS_NOTES,
    locator: "iPadOS 16.6",
    extraCitations: [
      citation(
        SHARED_16_6_DEVELOPER,
        "Home — Resolved Issues; Xcode — Known Issues",
      ),
    ],
    changes: changes("ipados", "16.6", IPADOS_NOTES, [
      [
        "matter-first-accessory-pairing",
        "First Matter accessory pairing fix",
        "The first Matter accessory in a new Home can pair when selected from the nearby-accessories list.",
        "bugFix",
        "fixed",
        "Apple fixed a failure when pairing the first Matter accessory in a new Home from the nearby list.",
        "Home — Resolved Issues",
        SHARED_16_6_DEVELOPER,
      ],
      [
        "uilabel-negative-baseline-offset",
        "UILabel negative baseline-offset behavior",
        "A negative baseline offset covering an entire UILabel attributed-text run again lowers text within the label bounds.",
        "behavior",
        "changed",
        "The full-run negative baseline-offset behavior returned to its pre-16.3 text positioning.",
        "Xcode — Known Issues",
        SHARED_16_6_DEVELOPER,
      ],
      [
        "maintenance-security",
        "Maintenance and security corrections",
        "The release contains Apple-documented bug fixes and security updates whose consumer-facing details were not individually enumerated.",
        "bugFix",
        "fixed",
        "Apple’s consumer notes classify the release as containing bug fixes and security updates.",
        "iPadOS 16.6",
      ],
    ]),
  }),
];

const bundle = {
  formatVersion: 1,
  target: {
    projectId: "lh3yswzu",
    dataset: "production",
  },
  accessedAt: "2026-07-29",
  sources: [
    {
      url: IOS_NOTES,
      title: "About iOS 16 Updates",
      publisher: "Apple Support",
      sourceClass: "firstPartyDocumentation",
      topics: ["iOS", "16", "consumer release notes"],
    },
    {
      url: IPADOS_NOTES,
      title: "About iPadOS 16 Updates",
      publisher: "Apple Support",
      sourceClass: "firstPartyDocumentation",
      topics: ["iPadOS", "16", "consumer release notes"],
    },
    {
      url: SECURITY_INDEX,
      title: "Apple security releases",
      publisher: "Apple Support",
      sourceClass: "firstPartyDocumentation",
      topics: ["Apple software", "security bulletins"],
    },
    {
      url: IOS_NEWSROOM,
      title: "iOS 16 is available today",
      publisher: "Apple Newsroom",
      sourceClass: "firstPartyAnnouncement",
      publishedAt: "2022-09-12T12:00:00Z",
      topics: ["iOS", "16", "public launch"],
    },
    {
      url: IPADOS_NEWSROOM,
      title: "iPadOS 16 is available today",
      publisher: "Apple Newsroom",
      sourceClass: "firstPartyAnnouncement",
      publishedAt: "2022-10-24T12:00:00Z",
      topics: ["iPadOS", "16", "public launch"],
    },
    {
      url: IOS_DEVELOPER,
      title: "iOS 16 Release Notes",
      publisher: "Apple Developer",
      sourceClass: "developerDocs",
      topics: ["iOS", "16", "SDK"],
    },
    {
      url: IPADOS_DEVELOPER,
      title: "iPadOS 16 Release Notes",
      publisher: "Apple Developer",
      sourceClass: "developerDocs",
      topics: ["iPadOS", "16", "SDK"],
    },
    {
      url: SHARED_16_4_DEVELOPER,
      title: "iOS & iPadOS 16.4 Release Notes",
      publisher: "Apple Developer",
      sourceClass: "developerDocs",
      topics: ["iOS", "iPadOS", "16.4", "SDK"],
    },
    {
      url: SHARED_16_5_DEVELOPER,
      title: "iOS & iPadOS 16.5 Release Notes",
      publisher: "Apple Developer",
      sourceClass: "developerDocs",
      topics: ["iOS", "iPadOS", "16.5", "SDK"],
    },
    {
      url: SHARED_16_6_DEVELOPER,
      title: "iOS & iPadOS 16.6 Release Notes",
      publisher: "Apple Developer",
      sourceClass: "developerDocs",
      topics: ["iOS", "iPadOS", "16.6", "SDK"],
    },
  ],
  versions: versionRows.map(version),
  events: eventRows,
  builds: [],
};

const output = join(
  dirname(fileURLToPath(import.meta.url)),
  "apple-ios-ipados-16.json",
);
writeFileSync(output, `${JSON.stringify(bundle, null, 2)}\n`);

console.log(
  `Wrote ${bundle.versions.length} versions, ${bundle.events.length} events, and ${bundle.events.reduce((sum, item) => sum + item.changes.length, 0)} change occurrences to ${output}`,
);
