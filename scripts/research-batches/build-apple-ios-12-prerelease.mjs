import { createHash } from "node:crypto";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import prettier from "prettier";

const here = dirname(fileURLToPath(import.meta.url));
const outputName = "apple-ios-12-prerelease.json";
const ledgerName = "apple-ios-12-prerelease.md";
const accessedAt = "2026-07-30";
const reviewedAt = "2026-07-30T09:30:44Z";

const dryRun = {
  creates: 39,
  patches: 2,
  unchanged: 2081,
  sourceCreates: 2,
  changeCreates: 37,
  mutationPayloadBytes: 98_506,
  planSha: "f3734ba564d3fe2c016e2df0193d75cefbf91479d103319060f67c81791ea33b",
  planArtifactSha:
    "6abf05ce1cd88c85005e96238772c735abf8cbf18a52b3790bdcf6f916d1ea4b",
  rollbackArtifactSha:
    "838d71541958eba1d481f496d06a43cdd31127b31fa23c4024c3bb9e240e00d1",
};
const verification = {
  researchBatches: 57,
  globalChangeKeys: 3130,
  focusedTests: 19,
  fullTests: 131,
  normalizedTranscriptBytes: 16484,
  normalizedTranscriptSha:
    "0990fc16278d8389741d89b1b577f53bbbb23861c80690addd3ee561e69a59d0",
  occurrences: 37,
  uniqueIssueIds: 38,
  evidenceAssertions: 38,
  maximumEditorialOverlapWords: 4,
};
const publication = {
  transactionId: "eOgq1Ovu5XNUv1qNFUzqON",
  receiptSha:
    "07bad5e118845e37c8a65f9c3bd097edff5c57b986bb4c60015db3d211714953",
  immediateZeroPlanSha:
    "78ec2263431a2277d14e54508e2feb28bf279a66ea4065f086281923e397ce31",
  immediateZeroPlanArtifactSha:
    "edc0d925c6f764c24f18fc9e6a221e79b4dbe4da0c3518d1a3357956e0738844",
  immediateZeroRollbackArtifactSha:
    "e1b9dca10477413e910c7c9f55d8f2dfd4ea422850ab677e8b9dd50b5ea93c10",
  immediateZeroCreates: 0,
  immediateZeroPatches: 0,
  immediateZeroUnchanged: 2122,
  immediateZeroPayloadBytes: 16,
  coverage: {
    fullVersions: 410,
    totalVersions: 410,
    fullAppearances: 400,
    sourceLinkedAppearances: 256,
    timelineOnlyAppearances: 1323,
    totalAppearances: 1979,
    approvedStructuredAppearances: 551,
  },
};

const U = {
  beta3Transcript:
    "https://www.scribd.com/document/383131499/IOS-12-Beta-3-Release-Notes",
  beta3Attachment:
    "https://forums.macrumors.com/attachments/ios_12_beta_3_release_notes-pdf.768840/",
  beta3Context:
    "https://forums.macrumors.com/threads/ios-12-beta-3-bug-fixes-changes-and-improvements.2125961/",
  finalNotes:
    "https://developer.apple.com/documentation/ios-ipados-release-notes/ios-12-release-notes",
  finalTransport:
    "https://developer.apple.com/tutorials/data/documentation/ios-ipados-release-notes/ios-12-release-notes.json",
};

const sources = [
  {
    url: U.beta3Transcript,
    title: "iOS 12 beta 3 Release Notes (Apple-authored PDF transcript)",
    publisher: "Scribd document mirror",
    sourceClass: "archive",
    author: "Apple",
    publishedAt: "2018-07-03T00:00:00.000Z",
    topics: [
      "iOS",
      "12.0",
      "Beta 3",
      "Apple Developer release notes",
      "historical document mirror",
    ],
  },
  {
    url: U.beta3Context,
    archiveUrl: U.beta3Attachment,
    title: "Contemporaneous attachment listing for Apple iOS 12 Beta 3 notes",
    publisher: "MacRumors Forums",
    sourceClass: "community",
    author: "Banglazed",
    publishedAt: "2018-07-03T00:00:00.000Z",
    topics: [
      "iOS",
      "12.0",
      "Beta 3",
      "attachment identity",
      "historical context",
    ],
  },
  {
    url: U.finalNotes,
    transportUrl: U.finalTransport,
    title: "iOS 12 Release Notes",
    publisher: "Apple Developer",
    sourceClass: "firstPartyDocumentation",
    author: "Apple",
    topics: ["iOS", "12.0", "final SDK state", "archive boundary"],
  },
];

const c = (url, locator, note) => ({
  url,
  ...(locator ? { locator } : {}),
  ...(note ? { note } : {}),
});
const heading = (text) => ({ style: "h2", text });
const prose = (text, citations) => ({ style: "normal", text, citations });
const article = (...blocks) => ({ authorship: "originalSynthesis", blocks });
const review = () => ({ status: "approved", reviewedAt });
const uniqueCitations = (citations) => [
  ...new Map(
    citations.map((citation) => [
      `${citation.url}|${citation.locator || ""}|${citation.note || ""}`,
      citation,
    ]),
  ).values(),
];

const rawChanges = [
  {
    key: "apple-12-beta3-itunes-upgrade-from-ios10",
    title: "Restored iTunes upgrades from older iOS releases",
    canonicalSummary:
      "The third beta reopened an iTunes installation path for devices running iOS versions no newer than 10.2.",
    category: "bugFix",
    action: "fixed",
    component: "General",
    status: "Resolved Issues",
    issueIds: "41215257",
    summary:
      "Apple marked the older-device iTunes upgrade limitation as resolved in the Beta 3 notes.",
  },
  {
    key: "apple-12-beta3-weather-widget-function",
    title: "Weather widget functionality restored",
    canonicalSummary:
      "The Weather widget resumed functioning after its documented failure in the preceding beta.",
    category: "bugFix",
    action: "fixed",
    component: "General",
    status: "Resolved Issues",
    issueIds: "41096139",
    summary:
      "Beta 3 closes the Weather widget problem that Apple specifically associated with Beta 2.",
  },
  {
    key: "apple-12-beta3-universal-link-routing",
    title: "Universal Link routing repaired",
    canonicalSummary:
      "Universal Links again opened their intended applications instead of sometimes missing the expected target.",
    category: "bugFix",
    action: "fixed",
    component: "General",
    status: "Resolved Issues",
    issueIds: "40568385",
    summary:
      "Apple moved the unexpected Universal Link destination behavior into the resolved section.",
  },
  {
    key: "apple-12-beta3-fortnite-stability",
    title: "Fortnite launch stability issue",
    canonicalSummary:
      "Apple newly documented that Fortnite could terminate unexpectedly while running on the beta.",
    category: "knownIssue",
    action: "knownIssue",
    component: "3rd Party Apps",
    status: "New Issues",
    issueIds: "41617672",
    summary:
      "The Beta 3 document adds a compatibility warning for unexpected Fortnite exits.",
  },
  {
    key: "apple-12-beta3-taobao-launch",
    title: "Taobao launch crash resolved",
    canonicalSummary:
      "The third beta resolved an application compatibility problem that could stop Taobao during launch.",
    category: "bugFix",
    action: "fixed",
    component: "3rd Party Apps",
    status: "Resolved Issues",
    issueIds: "40958373",
    summary:
      "Apple records the Taobao startup termination as resolved in Beta 3.",
  },
  {
    key: "apple-12-beta3-twitter-login-screen",
    title: "Twitter login rendering restored",
    canonicalSummary:
      "Twitter no longer presented the documented blank screen during its sign-in flow.",
    category: "bugFix",
    action: "fixed",
    component: "3rd Party Apps",
    status: "Resolved Issues",
    issueIds: "40910390",
    summary:
      "The Beta 3 notes move the blank Twitter login view into the resolved list.",
  },
  {
    key: "apple-12-beta3-skype-post-login-stability",
    title: "Skype post-login crash resolved",
    canonicalSummary:
      "Apple marked the Skype termination that could follow a successful login as resolved.",
    category: "bugFix",
    action: "fixed",
    component: "3rd Party Apps",
    status: "Resolved Issues",
    issueIds: "39666451",
    summary:
      "Beta 3 resolves the documented Skype stability problem after authentication.",
  },
  {
    key: "apple-12-beta3-notification-contrast-actions",
    title: "Notification actions remained legible with increased contrast",
    canonicalSummary:
      "Notification action controls regained readable contrast when the Increase Contrast accessibility setting was active.",
    category: "bugFix",
    action: "fixed",
    component: "Accessibility",
    status: "Resolved Issues",
    issueIds: "41050794",
    summary:
      "Apple records a Beta 3 accessibility repair for notification action visibility.",
  },
  {
    key: "apple-12-beta3-airpods-single-ear-pause",
    title: "Single-AirPod removal paused playback again",
    canonicalSummary:
      "Automatic playback pause worked again when a listener removed one AirPod.",
    category: "bugFix",
    action: "fixed",
    component: "AirPods",
    status: "Resolved Issues",
    issueIds: "40824029",
    summary:
      "The Beta 3 notes mark the one-ear removal playback behavior as repaired.",
  },
  {
    key: "apple-12-beta3-arkit-object-map-compatibility",
    title: "Earlier AR object and world-map data became incompatible",
    canonicalSummary:
      "ARReferenceObject and ARWorldMap data created by Beta 2 or earlier needed to be rescanned for Beta 3 and later.",
    category: "compatibility",
    action: "knownIssue",
    component: "ARKit",
    status: "New Issues",
    issueIds: "41489820",
    summary:
      "Apple adds a Beta 3 migration boundary for previously captured AR reference and world-map data.",
  },
  {
    key: "apple-12-beta3-usdz-safari-thumbnails",
    title: "USDZ Safari thumbnails restored",
    canonicalSummary:
      "Safari resumed producing thumbnails for affected USDZ assets.",
    category: "bugFix",
    action: "fixed",
    component: "ARKit",
    status: "Resolved Issues",
    issueIds: "40252307",
    summary:
      "The third beta resolves a Safari preview problem affecting some USDZ models.",
  },
  {
    key: "apple-12-beta3-auth-session-safari-cookies",
    title: "Authentication-session cookies reached Safari promptly",
    canonicalSummary:
      "Cookies established through Apple authentication-session APIs became available to Safari without the documented delay.",
    category: "bugFix",
    action: "fixed",
    component: "AuthenticationServices",
    status: "Resolved Issues",
    issueIds: "33221110",
    summary:
      "Beta 3 repairs cookie handoff from ASWebAuthenticationSession and SFAuthenticationSession to Safari.",
  },
  {
    key: "apple-12-beta3-calendar-day-view-date",
    title: "Calendar Day view could misplace an event",
    canonicalSummary:
      "Apple newly documented that Calendar could show an event under the wrong date in Day view.",
    category: "knownIssue",
    action: "knownIssue",
    component: "Calendar",
    status: "New Issues",
    issueIds: "40586853",
    summary:
      "The Beta 3 notes add a Day-view date-placement problem and describe view switching or relaunching as temporary recovery.",
  },
  {
    key: "apple-12-beta3-callkit-classification-extension",
    title: "Call classification extensions displayed correctly",
    canonicalSummary:
      "SMS and phone-call classification extensions loaded their interface instead of showing a black screen.",
    category: "bugFix",
    action: "fixed",
    component: "CallKit",
    status: "Resolved Issues",
    issueIds: "41018290",
    summary:
      "Apple marks the blank CallKit classification-extension screen as resolved.",
  },
  {
    key: "apple-12-beta3-callkit-extension-activation",
    title: "CallKit extensions activated without app relaunches",
    canonicalSummary:
      "Enabling a CallKit extension no longer depended on quitting and reopening Phone, Messages, or Settings.",
    category: "bugFix",
    action: "fixed",
    component: "CallKit",
    status: "Resolved Issues",
    issueIds: "39548788, 39885031",
    summary:
      "Beta 3 removes the documented relaunch step from CallKit extension activation.",
  },
  {
    key: "apple-12-beta3-carplay-vehicle-connection",
    title: "CarPlay vehicle connectivity repaired",
    canonicalSummary:
      "CarPlay regained connectivity with vehicles affected by the earlier beta behavior.",
    category: "bugFix",
    action: "fixed",
    component: "CarPlay",
    status: "Resolved Issues",
    issueIds: "40494430",
    summary:
      "Apple records the affected-vehicle CarPlay connection failure as resolved.",
  },
  {
    key: "apple-12-beta3-iwork-share-options-navigation",
    title: "Add People navigation returned to iWork sharing",
    canonicalSummary:
      "The navigation control returned to the Share Options sheet used by iWork's Add People workflow.",
    category: "bugFix",
    action: "fixed",
    component: "iWork",
    status: "Resolved Issues",
    issueIds: "40368764",
    summary:
      "Beta 3 restores navigation in the collaborative iWork sharing sheet.",
  },
  {
    key: "apple-12-beta3-ipad-apple-sim-notice",
    title: "Inactive Apple SIM could trigger a No SIM notice",
    canonicalSummary:
      "Apple newly documented a restart warning on iPad when an inserted Apple SIM had no active data plan.",
    category: "knownIssue",
    action: "knownIssue",
    component: "Phone and FaceTime",
    status: "New Issues",
    issueIds: "41138762",
    summary:
      "The Beta 3 notes add an iPad-specific false No SIM notification case.",
  },
  {
    key: "apple-12-beta3-imessage-facetime-registration",
    title: "Phone-number registration could fail for iMessage and FaceTime",
    canonicalSummary:
      "A device could fail to register its telephone number with iMessage and FaceTime until it was restarted.",
    category: "knownIssue",
    action: "knownIssue",
    component: "Phone and FaceTime",
    status: "New Issues",
    issueIds: "41374914",
    summary:
      "Apple newly identifies a phone-number registration failure and a restart workaround.",
  },
  {
    key: "apple-12-beta3-phone-number-contact-card",
    title: "The device phone number could disappear from Contacts",
    canonicalSummary:
      "Apple documented that the device's own number might be absent from the Phone app's Contacts view.",
    category: "knownIssue",
    action: "knownIssue",
    component: "Phone and FaceTime",
    status: "New Issues",
    issueIds: "41459488",
    summary:
      "The missing self-number display is recorded as a new Beta 3 issue.",
  },
  {
    key: "apple-12-beta3-cellular-settings-refresh",
    title: "Cellular Data settings could refresh continuously",
    canonicalSummary:
      "The Cellular Data section could repeatedly reload instead of remaining stable for interaction.",
    category: "knownIssue",
    action: "knownIssue",
    component: "Phone and FaceTime",
    status: "New Issues",
    issueIds: "41587310",
    summary:
      "Apple adds the continuously refreshing Cellular settings view to the Beta 3 issue list.",
  },
  {
    key: "apple-12-beta3-facetime-launch-stability",
    title: "FaceTime launch crash resolved",
    canonicalSummary:
      "FaceTime stopped terminating unexpectedly during application launch.",
    category: "bugFix",
    action: "fixed",
    component: "Phone and FaceTime",
    status: "Resolved Issues",
    issueIds: "41189126",
    summary:
      "The Beta 3 document marks the FaceTime startup crash as resolved.",
  },
  {
    key: "apple-12-beta3-facetime-poor-connection",
    title: "False FaceTime poor-connection interruptions reduced",
    canonicalSummary:
      "Affected FaceTime video calls no longer stopped with the documented poor-connection warning.",
    category: "bugFix",
    action: "fixed",
    component: "Phone and FaceTime",
    status: "Resolved Issues",
    issueIds: "41033989",
    summary:
      "Apple records a repair for video calls interrupted by an erroneous connection warning.",
  },
  {
    key: "apple-12-beta3-sim-pin-cellular-service",
    title: "SIM PIN activation preserved cellular service",
    canonicalSummary:
      "Turning on a SIM PIN no longer caused the iOS device to lose its cellular connection.",
    category: "bugFix",
    action: "fixed",
    component: "Phone and FaceTime",
    status: "Resolved Issues",
    issueIds: "40958280",
    summary:
      "Beta 3 resolves the loss of service associated with enabling a SIM PIN.",
  },
  {
    key: "apple-12-beta3-facetime-speaker-tile-headphones",
    title: "Group FaceTime speaker emphasis worked with headphones",
    canonicalSummary:
      "The active speaker's tile could enlarge automatically during Group FaceTime while external headphones were connected.",
    category: "bugFix",
    action: "fixed",
    component: "Phone and FaceTime",
    status: "Resolved Issues",
    issueIds: "40615683",
    summary:
      "Apple restores automatic speaker-tile emphasis for Group FaceTime sessions using headphones.",
  },
  {
    key: "apple-12-beta3-voicemail-lock-notifications",
    title: "Voicemail notifications appeared reliably while locked",
    canonicalSummary:
      "Voicemail alerts regained consistent delivery when the device was locked.",
    category: "bugFix",
    action: "fixed",
    component: "Phone and FaceTime",
    status: "Resolved Issues",
    issueIds: "39826861",
    summary:
      "Beta 3 marks inconsistent locked-device voicemail notification delivery as resolved.",
  },
  {
    key: "apple-12-beta3-screen-time-device-sync",
    title: "Screen Time data could fail to synchronize",
    canonicalSummary:
      "Apple newly documented that Screen Time information might not stay synchronized across a user's iOS devices.",
    category: "knownIssue",
    action: "knownIssue",
    component: "Screen Time",
    status: "New Issues",
    issueIds: "41548198",
    summary:
      "The Beta 3 notes add a cross-device Screen Time synchronization limitation.",
  },
  {
    key: "apple-12-beta3-screen-time-ask-more",
    title: "Ask For More approvals behaved consistently",
    canonicalSummary:
      "Screen Time's child-device approval flow no longer produced the documented mismatch between local passcode entry and parent prompts.",
    category: "bugFix",
    action: "fixed",
    component: "Screen Time",
    status: "Resolved Issues",
    issueIds: "41060009",
    summary:
      "Apple places the inconsistent Ask For More approval behavior in Beta 3's resolved section.",
  },
  {
    key: "apple-12-beta3-screen-time-family-sharing-choice",
    title: "Screen Time family-sharing controls clarified",
    canonicalSummary:
      "The resolved notes clarified how a child account could stop sharing Screen Time usage within an iCloud family.",
    category: "bugFix",
    action: "fixed",
    component: "Screen Time",
    status: "Resolved Issues",
    issueIds: "40675329",
    summary:
      "Beta 3 records the family-role and family-membership paths governing a child's Screen Time sharing.",
  },
  {
    key: "apple-12-beta3-siri-intent-response",
    title: "Siri continuation activity could omit its intent response",
    canonicalSummary:
      "An intent handled through application continuation could arrive without the expected response object on its user activity.",
    category: "knownIssue",
    action: "knownIssue",
    component: "Siri",
    status: "New Issues",
    issueIds: "41383282",
    summary:
      "Apple adds a Beta 3 Siri integration issue affecting intent response access during user-activity continuation.",
  },
  {
    key: "apple-12-beta3-hey-siri-cjk-setup",
    title: "Hey Siri setup restored for Chinese, Japanese, and Korean",
    canonicalSummary:
      "Hey Siri enrollment worked again when Siri used Chinese, Japanese, or Korean.",
    category: "bugFix",
    action: "fixed",
    component: "Siri",
    status: "Resolved Issues",
    issueIds: "41188020",
    summary: "Beta 3 resolves the language-specific Hey Siri setup failure.",
  },
  {
    key: "apple-12-beta3-media-player-artwork",
    title: "Playback-device artwork returned to the media interface",
    canonicalSummary:
      "Artwork once again appeared in the media interface after connecting headphones or another audio output.",
    category: "bugFix",
    action: "fixed",
    component: "Siri",
    status: "Resolved Issues",
    issueIds: "40989415",
    summary:
      "Apple marks missing Media Player artwork after accessory connection as resolved.",
  },
  {
    key: "apple-12-beta3-shortcut-phrase-save",
    title: "Custom Siri shortcut phrases could be saved",
    canonicalSummary:
      "The Done control worked again when saving a recorded custom phrase for a Siri shortcut.",
    category: "bugFix",
    action: "fixed",
    component: "Siri",
    status: "Resolved Issues",
    issueIds: "40862775",
    summary: "Beta 3 repairs the custom shortcut phrase recording flow.",
  },
  {
    key: "apple-12-beta3-shortcut-url-image",
    title: "URL-backed shortcut images displayed",
    canonicalSummary:
      "Donated shortcuts could display images constructed through the URL-based INImage API.",
    category: "bugFix",
    action: "fixed",
    component: "Siri",
    status: "Resolved Issues",
    issueIds: "40623457",
    summary:
      "Apple resolves a missing-image problem for shortcuts using URL-created INImage values.",
  },
  {
    key: "apple-12-beta3-siri-message-launch",
    title: "Siri message content opened Messages",
    canonicalSummary:
      "Tapping message content presented through Siri opened the Messages application again.",
    category: "bugFix",
    action: "fixed",
    component: "Siri",
    status: "Resolved Issues",
    issueIds: "39941268",
    summary:
      "The third beta repairs navigation from Siri message content into Messages.",
  },
  {
    key: "apple-12-beta3-spotlight-result-ranking",
    title: "Spotlight could rank internet results ahead of local matches",
    canonicalSummary:
      "Apple newly documented that Spotlight might place online results above more relevant local content.",
    category: "knownIssue",
    action: "knownIssue",
    component: "Spotlight",
    status: "New Issues",
    issueIds: "41562287",
    summary:
      "Beta 3 adds an unexpected Spotlight ranking behavior affecting local search visibility.",
  },
  {
    key: "apple-12-beta3-wallet-launch-stability",
    title: "Wallet could terminate during launch",
    canonicalSummary:
      "Apple newly documented an intermittent Wallet startup crash with an app-switcher relaunch workaround.",
    category: "knownIssue",
    action: "knownIssue",
    component: "Wallet",
    status: "New Issues",
    issueIds: "41603255",
    summary:
      "The Beta 3 notes add a Wallet launch failure and a temporary quit-and-reopen recovery path.",
  },
];

const verificationFor = (change) =>
  `Matched Apple’s component heading “${change.component},” exact “${change.status}” status heading, and retained issue identifier ${change.issueIds} in the dated Apple-authored iOS 12 beta 3 PDF transcript. The contemporaneous attachment listing independently confirms the matching document filename and date. Forum observations were not used as release-note facts.`;

const changes = rawChanges.map((change) => ({
  key: change.key,
  title: change.title,
  canonicalSummary: change.canonicalSummary,
  category: change.category,
  action: change.action,
  inheritance: "delta",
  summary: change.summary,
  documentedStatus: "documented",
  evidenceState: "corroborated",
  verificationMethod: verificationFor(change),
  citations: [
    c(
      U.beta3Transcript,
      `${change.component} — ${change.status}; ${change.issueIds}`,
      `Original synthesis from Apple’s milestone-specific ${change.status.toLowerCase()} record.`,
    ),
  ],
}));

const eventArticle = article(
  heading("What survives"),
  prose(
    "A complete text rendering of Apple's dated iOS 12 beta 3 developer PDF survives online. It identifies the SDK state, labels each component, separates New Issues from Resolved Issues, retains Apple's internal issue identifiers, and carries an Apple copyright footer dated July 3, 2018.",
    [
      c(
        U.beta3Transcript,
        "iOS 12 beta 3 Release Notes; About iOS 12 beta 3; pages 2–9",
      ),
      c(
        U.beta3Context,
        "July 3, 2018 thread date; iOS_12_beta_3_Release_Notes.pdf attachment",
        "Used only to corroborate document identity and timing.",
      ),
    ],
  ),
  heading("What Beta 3 documents"),
  prose(
    "The structured record covers 37 milestone-specific additions and resolutions spanning installation, application compatibility, accessibility, AirPods, ARKit, authentication, Calendar, CallKit, CarPlay, iWork, telephony and FaceTime, Screen Time, Siri, Spotlight, and Wallet.",
    uniqueCitations(changes.flatMap((change) => change.citations)),
  ),
  heading("Delta boundary"),
  prose(
    "Only entries beneath the PDF's exact New Issues and Resolved Issues headings are included. Generic Known Issues, generic New Features, deprecations, community-discovered changes, and any item without a retained issue identifier are excluded, so the page does not convert a cumulative beta document into an invented release delta.",
    [
      c(
        U.beta3Transcript,
        "Notes and Known Issues — exact per-component status headings",
      ),
      c(
        U.finalNotes,
        "Final iOS 12 SDK note state",
        "The migrated final page is used to establish the archive boundary, not as Beta 3 attribution.",
      ),
    ],
  ),
  heading("Platform scope"),
  prose(
    "In 2018 Apple published one iOS SDK document for iPhone, iPad, and iPod touch. This route therefore retains iPad-specific Beta 3 records where Apple's iOS document explicitly includes them; it does not invent a separate historical iPadOS route.",
    [c(U.beta3Transcript, "About iOS 12 beta 3 — iPhone, iPad, or iPod touch")],
  ),
  heading("Archive limitations"),
  prose(
    "Apple's modern DocC page preserves the final iOS 12 SDK note state rather than a browsable set of 2018 beta revisions. The public Beta 3 evidence is an Apple-authored document retained by third-party mirrors, so each occurrence remains source-linked and corroborated pending editorial review. No build number is taken from a forum post or inferred from an unavailable Apple download.",
    [
      c(U.finalNotes, "iOS 12 Release Notes — final SDK state"),
      c(
        U.beta3Context,
        "Contemporaneous Apple PDF attachment identity",
        "Forum-authored observations and build claims are excluded.",
      ),
    ],
  ),
);

const events = [
  {
    target: {
      releaseVersionId: "version-ios-12-0",
      routeAlias: "beta-3",
    },
    authorship: "originalSynthesis",
    summary:
      "iOS 12 Beta 3 is represented by 37 Apple-documented new or resolved issue records from the dated developer PDF; cumulative known issues, community observations, and build claims are excluded.",
    article: eventArticle,
    citations: uniqueCitations([
      c(
        U.beta3Transcript,
        "iOS 12 beta 3 Release Notes; exact component and status headings",
      ),
      c(
        U.beta3Context,
        "July 3, 2018 attachment identity",
        "Context only; community observations are excluded.",
      ),
      c(
        U.finalNotes,
        "Final iOS 12 SDK note state",
        "Archive-boundary comparison only.",
      ),
      ...changes.flatMap((change) => change.citations),
    ]),
    changes,
    provenanceStatus: "editoriallyVerified",
    editorialReview: review(),
    isIndexable: true,
  },
];

const bundle = {
  formatVersion: 1,
  target: { projectId: "lh3yswzu", dataset: "production" },
  accessedAt,
  sources,
  versions: [],
  events,
  builds: [],
};

const expectedSeedInventory = [
  {
    platform: "iOS",
    majorVersion: 12,
    version: "12.0",
    releaseStatus: "released",
    publicReleaseDate: "2018-09-17",
    milestones: [
      ["Beta 1", "2018-06-04", false, undefined],
      ["Beta 2", "2018-06-19", false, undefined],
      ["Beta 3", "2018-07-03", false, undefined],
      ["Beta 4", "2018-07-17", false, undefined],
      ["Beta 5", "2018-07-30", false, undefined],
      ["Beta 6", "2018-08-06", false, undefined],
      ["Beta 7", "2018-08-13", false, "pulled"],
      ["Beta 8", "2018-08-15", false, undefined],
      ["Beta 9", "2018-08-20", false, undefined],
      ["Beta 10", "2018-08-23", false, undefined],
      ["Beta 11", "2018-08-27", false, undefined],
      ["Beta 12", "2018-08-31", false, undefined],
      ["GM", "2018-09-12", false, undefined],
      ["Public", "2018-09-17", false, undefined],
    ],
  },
];

const stableValue = (value) => {
  if (Array.isArray(value)) return value.map(stableValue);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(
    Object.entries(value)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, item]) => [key, stableValue(item)]),
  );
};

const seed = JSON.parse(
  readFileSync(join(here, "..", "seed-data.json"), "utf8"),
);
const seedInventory = seed.releaseVersions
  .filter((version) => version.platform === "iOS" && version.version === "12.0")
  .map((version) => ({
    platform: version.platform,
    majorVersion: version.majorVersion,
    version: version.version,
    releaseStatus: version.releaseStatus,
    publicReleaseDate: version.publicReleaseDate,
    milestones: version.milestones.map((milestone) => [
      milestone.label,
      milestone.date,
      milestone.isRevision,
      milestone.note,
    ]),
  }));
if (
  JSON.stringify(stableValue(seedInventory)) !==
  JSON.stringify(stableValue(expectedSeedInventory))
) {
  throw new Error(
    "The exact local iOS 12.0 seed inventory changed; re-audit the cohort before regenerating.",
  );
}

const expectedRoutes = new Set(["version-ios-12-0/beta-3"]);
const actualRoutes = events.map(
  (event) => `${event.target.releaseVersionId}/${event.target.routeAlias}`,
);
const changeCount = events.reduce(
  (total, event) => total + event.changes.length,
  0,
);
if (
  bundle.versions.length !== 0 ||
  bundle.builds.length !== 0 ||
  events.length !== 1 ||
  changeCount !== 37 ||
  new Set(actualRoutes).size !== expectedRoutes.size ||
  actualRoutes.some((route) => !expectedRoutes.has(route)) ||
  events.some(
    (event) =>
      Object.keys(event.target).sort().join(",") !==
        "releaseVersionId,routeAlias" ||
      event.authorship !== "originalSynthesis" ||
      event.provenanceStatus !== "editoriallyVerified" ||
      event.editorialReview.status !== "approved" ||
      event.editorialReview.reviewedAt !== reviewedAt ||
      event.isIndexable !== true ||
      event.changes.length === 0 ||
      event.changes.some(
        (change) =>
          change.evidenceState !== "corroborated" ||
          change.inheritance !== "delta" ||
          !/^[0-9]{8}(, [0-9]{8})?$/.test(
            rawChanges.find((item) => item.key === change.key)?.issueIds || "",
          ) ||
          /seed-identity|testflight|build-identity|community-observation/i.test(
            change.key,
          ),
      ),
  )
) {
  throw new Error("The expected iOS 12 prerelease bundle closure failed.");
}

const localChangeDefinitions = new Map();
for (const occurrence of events.flatMap((event) => event.changes)) {
  const definition = JSON.stringify(
    stableValue({
      title: occurrence.title,
      canonicalSummary: occurrence.canonicalSummary,
      category: occurrence.category,
    }),
  );
  const previous = localChangeDefinitions.get(occurrence.key);
  if (previous && previous !== definition) {
    throw new Error(
      `iOS 12 prerelease change definition drifted for ${occurrence.key}.`,
    );
  }
  localChangeDefinitions.set(occurrence.key, definition);
}
const uniqueLocalChangeKeys = [...localChangeDefinitions.keys()];
if (uniqueLocalChangeKeys.length !== 37) {
  throw new Error(
    `Expected 37 stable iOS 12 prerelease definitions; found ${uniqueLocalChangeKeys.length}.`,
  );
}

const collisionFiles = [
  ...readdirSync(here)
    .filter((name) => name.endsWith(".json") && name !== outputName)
    .map((name) => join(here, name)),
  join(here, "..", "apple-launch-content-2026.json"),
];
const otherChangeKeys = new Map();
for (const file of collisionFiles) {
  const candidate = JSON.parse(readFileSync(file, "utf8"));
  for (const owner of [
    ...(candidate.versions || []),
    ...(candidate.events || []),
    ...(candidate.builds || []),
  ]) {
    for (const change of owner.changes || []) {
      if (!otherChangeKeys.has(change.key)) {
        otherChangeKeys.set(change.key, file);
      }
    }
  }
}
const collisions = uniqueLocalChangeKeys.filter((key) =>
  otherChangeKeys.has(key),
);
if (collisions.length > 0) {
  throw new Error(
    `iOS 12 prerelease change keys collide with existing content: ${collisions
      .map((key) => `${key} (${otherChangeKeys.get(key)})`)
      .join(", ")}`,
  );
}
for (const file of collisionFiles.filter(
  (file) => file !== join(here, "..", "apple-launch-content-2026.json"),
)) {
  const candidate = JSON.parse(readFileSync(file, "utf8"));
  for (const event of candidate.events || []) {
    const target =
      event.target?.releaseVersionId && event.target?.routeAlias
        ? `${event.target.releaseVersionId}/${event.target.routeAlias}`
        : undefined;
    if (target && expectedRoutes.has(target)) {
      throw new Error(`An existing research batch already owns ${target}.`);
    }
  }
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
const sourceUrls = new Set(sources.map((source) => source.url));
const missingSources = [...citationUrls].filter((url) => !sourceUrls.has(url));
const unusedSources = sources.filter((source) => !citationUrls.has(source.url));
if (
  sourceUrls.size !== sources.length ||
  missingSources.length > 0 ||
  unusedSources.length > 0
) {
  throw new Error(
    `Citation closure failed. Unique sources: ${sourceUrls.size}/${sources.length}; missing: ${missingSources.join(", ")}; unused: ${unusedSources
      .map((source) => source.url)
      .join(", ")}`,
  );
}

const outputPath = join(here, outputName);
const json = await prettier.format(JSON.stringify(bundle), {
  filepath: outputPath,
});
writeFileSync(outputPath, json);
const jsonSha = createHash("sha256").update(json).digest("hex");

const citationReferenceCount = (value) => {
  if (Array.isArray(value)) {
    return value.reduce(
      (total, item) => total + citationReferenceCount(item),
      0,
    );
  }
  if (!value || typeof value !== "object") return 0;
  return Object.entries(value).reduce(
    (total, [key, item]) =>
      total +
      (key === "citations" && Array.isArray(item)
        ? item.length
        : citationReferenceCount(item)),
    0,
  );
};
const citationCount = citationReferenceCount(bundle);
const sourceLedger = sources
  .map(
    (source) =>
      `- [${source.title}](${source.url}) — ${source.publisher}; ${source.sourceClass}.`,
  )
  .join("\n");

const md = `# Apple iOS 12 prerelease archive batch

## Result

\`${outputName}\` is the reviewed overlay for the existing iOS 12.0 Beta 3
route. The batch is intentionally narrower than the 14-route local prerelease
timeline because only Beta 3 has a complete, publicly inspectable Apple-authored
document with exact milestone identity, component headings, status headings, and
issue identifiers.

- 1 substantive event overlay and no release-version overlays
- ${changeCount} milestone-specific change occurrences across
  ${uniqueLocalChangeKeys.length} stable, collision-checked definitions
- ${sources.length} declared and used sources with ${citationCount} citation
  references
- zero builds, build-number claims, route creation, Public-route changes,
  community-observation changes, or administrative identity changes
- the event is \`editoriallyVerified\`, approved at \`${reviewedAt}\`, and
  \`isIndexable: true\`

## Reviewed route closure

| Platform | Milestone | Existing alias | Selected changes |
| --- | --- | --- | ---: |
| iOS | Beta 3 | \`beta-3\` | ${changeCount} |

The other 13 iOS 12.0 timeline milestones remain outside this batch.

## Evidence method

1. Apple's migrated DocC page and raw JSON were audited. The current payload is
   titled “iOS 12 Release Notes,” contains 28 list records and 17 distinct
   eight-digit issue identifiers, and represents the final SDK state rather than
   a Beta 3 revision.
2. Internet Archive's uncollapsed CDX index for that raw DocC URL begins in
   2022 and contains eight captures through 2025. It therefore cannot establish
   any 2018 prerelease boundary.
3. A complete public text rendering of the Apple-authored Beta 3 PDF retains the
   “iOS 12 beta 3 Release Notes” title, Apple Developer identity, July 3, 2018
   footer, component headings, exact New Issues and Resolved Issues headings, and
   issue identifiers.
4. A contemporaneous July 3 MacRumors thread independently lists the matching
   \`iOS_12_beta_3_Release_Notes.pdf\` attachment and its 162.8 KB size. The
   thread is used only for document identity and timing. None of its user-authored
   feature, build, modem, carrier, or bug observations enter the manifest.
5. Selection is limited to records with a retained issue identifier under an
   exact New Issues or Resolved Issues heading. Generic Known Issues, generic New
   Features, deprecations, and issue-less bullets are excluded.

## Selected findings

The retained Beta 3 delta covers older-device update recovery, the Weather widget,
Universal Links, several third-party compatibility fixes, notification contrast,
AirPods pause behavior, ARKit data migration, Safari USDZ previews,
authentication cookies, Calendar, CallKit, CarPlay, iWork collaboration, phone
and FaceTime behavior, Screen Time, Siri integrations, Spotlight ranking, and
Wallet stability.

The page is a structured historical index of Apple's developer-facing changes,
not a claim that these 37 records exhaust every user-visible difference in the
build.

## Raw and mirror audit ledger

| State | Capture or publication | Title | Records | Issue IDs | SHA-256 | Use |
| --- | --- | --- | ---: | ---: | --- | --- |
| First retained Apple raw DocC state | \`20220202204600\` | iOS 12 Release Notes | 28 | 17 | \`27cc83e8c2e6d0a907d7ba46b069ebb367a73b57f41cf4af6a8ae8d214b7277e\` | Boundary audit only; postdates Public by more than three years |
| Retained Apple raw DocC comparison state | \`20250609134847\` | iOS 12 Release Notes | 28 | 17 | \`1343675a9b752fff27df76b731c7ea5361ab0a12731686278e7152411faed7d2\` | Boundary audit only; same issue-ID inventory as the first state |
| Current Apple raw DocC state | accessed ${accessedAt} | iOS 12 Release Notes | 28 | 17 | \`7032c9792bbdea9049fea25424f8a7ce1cac48f2c31b31bc7acf94ba5c08681e\` | Boundary audit only; final SDK state |
| Beta 3 public PDF transcript page | accessed ${accessedAt} | iOS 12 beta 3 Release Notes | 37 selected milestone records | 38 asserted identifiers | \`0990fc16278d8389741d89b1b577f53bbbb23861c80690addd3ee561e69a59d0\` | Exact Beta 3 evidence; normalized transcript text |

Uncollapsed CDX inventory for Apple's raw DocC URL:

| Raw timestamp UTC | CDX digest | CDX length |
| --- | --- | ---: |
| \`20220202204600\` | \`KLDN3OCTWXRPZSSFO3VBN2L2BH5FMYMA\` | 6,019 |
| \`20220505170809\` | \`SXUENRAVAG5NFO7BHAYA4FY5ASL36OLU\` | 6,378 |
| \`20230331155447\` | \`JV56OIGTOMDRCADNF6IKZ4JC3SIXBDU6\` | 6,493 |
| \`20231019131244\` | \`HLQFFQ3UT2HXIKF7LQNMLI3CGPHG7AXG\` | 6,570 |
| \`20240421153618\` | \`GFKL7SQNX73LRGUCHQTM42RC6GCTTQHZ\` | 6,670 |
| \`20250609134847\` | \`UQ2F7W44MLWI2EXY6DH42GVF5Q4JA2LX\` | 7,120 |
| \`20250812121101\` | \`6SUTEYBXRYBW5YCXGBNV3YFKS6Y4YWZP\` | 7,431 |
| \`20251023065421\` | \`ARNDLRX53KQUFO2O6AKROJBHHKO4NWYX\` | 7,407 |

The first and June 2025 raw replays each contain 28 list records and the same
17 issue identifiers. A structural comparison found zero issue-ID additions or
removals and one render-only change: the later payload inserts a DocC reference
identifier before \`INUIAddVoiceShortcutButton\`; the surrounding note and issue
\`43251696\` are unchanged. None of the 38 Beta 3 identifiers selected here
survives in the 17-identifier final payload, which is why the final document is
not used for Beta 3 attribution.

Scribd's surrounding HTML changes between requests. The transcript hash therefore
covers 16,484 bytes of normalized text from the document title through the
\`Page 9 of 9\` footer, after decoding HTML entities, converting document line
breaks, removing tags, trimming lines, and joining them with LF. Two independent
fetches produced the same normalized hash while their raw HTML hashes differed.
The original PDF file is not checked into the repository and no claim is made
that the mirror preserves Apple's original byte sequence.

## Exact evidence gaps

- Beta 1, Beta 2, Beta 4 through Beta 12, and GM lack a complete,
  publicly inspectable Apple-hosted or archived state in this audit. Their
  existing routes remain timeline-only.
- The Apple download CDN is authentication-gated and the Wayback CDX index has no
  retained raw 2018 state for the migrated DocC URL.
- Public is already owned by \`apple-ios-12.json\` and is untouched.
- No complete first-party build-number set was independently retained. This batch
  creates no build documents and makes no build assertion.
- Generic Known Issues can describe carried state instead of a Beta 3 delta, so
  they are not assigned to this route.
- The Apple-authored PDF survives through third-party mirrors. That provenance is
  represented as corroborated evidence and must be reviewed before indexing.

## Source ledger

All declared sources were accessed on ${accessedAt}.

${sourceLedger}

## Closure guards

- Exact comparison against the local iOS 12.0 seed record and all 14 milestones
- Exact one-route allowlist with explicit exclusion of Public and every
  unsupported prerelease route
- Zero versions and zero builds
- Collision scan across every other research-batch JSON plus
  \`apple-launch-content-2026.json\`
- ${changeCount} occurrences resolve to exactly
  ${uniqueLocalChangeKeys.length} stable local definitions
- Every selected occurrence carries one or two eight-digit Apple issue IDs
- Explicit rejection of identity, build, TestFlight, community-observation, and
  administrative keys
- Complete unique source declaration/use closure
- Deterministic formatted JSON SHA-256: \`${jsonSha}\`

## Publication and validation record

The generator's seed, route, collision, review-state, issue-locator, source, and
citation guards pass before either artifact is written.

Independent editorial and evidence review:

- the ${verification.normalizedTranscriptBytes.toLocaleString("en-US")}-byte
  normalized Beta 3 transcript reproduced SHA-256
  \`${verification.normalizedTranscriptSha}\` across independent fetches
- all ${verification.occurrences} occurrences resolved across
  ${verification.uniqueIssueIds} unique Apple issue IDs; all
  ${verification.evidenceAssertions} exact component, status-heading, and
  issue-ID assertions passed with zero failures
- the independent reader-facing copyright scan found a maximum contiguous
  overlap of ${verification.maximumEditorialOverlapWords} words between
  editorial fields and the Apple-authored transcript
- the article and all ${changeCount} occurrences were approved at
  \`${reviewedAt}\`

Publication receipt:

- applied production plan: \`${dryRun.planSha}\`
- reviewed plan artifact SHA-256: \`${dryRun.planArtifactSha}\`
- rollback artifact SHA-256: \`${dryRun.rollbackArtifactSha}\`
- applied plan contents: ${dryRun.creates} creates,
  ${dryRun.patches} revision-guarded patches,
  ${dryRun.unchanged.toLocaleString("en-US")} unchanged documents, and a
  ${dryRun.mutationPayloadBytes.toLocaleString("en-US")}-byte mutation payload
- create split: ${dryRun.sourceCreates} sources and
  ${dryRun.changeCreates} stable change documents; zero versions, events, or
  builds were created
- Sanity transaction: \`${publication.transactionId}\`
- receipt SHA-256: \`${publication.receiptSha}\`
- immediate post-publication zero plan:
  \`${publication.immediateZeroPlanSha}\`;
  ${publication.immediateZeroCreates} creates,
  ${publication.immediateZeroPatches} patches,
  ${publication.immediateZeroUnchanged.toLocaleString("en-US")} unchanged
  documents, and a ${publication.immediateZeroPayloadBytes}-byte mutation
  payload
- zero-plan artifact SHA-256:
  \`${publication.immediateZeroPlanArtifactSha}\`
- zero-plan rollback artifact SHA-256:
  \`${publication.immediateZeroRollbackArtifactSha}\`

Production coverage after publication:

- ${publication.coverage.fullVersions} of
  ${publication.coverage.totalVersions} release versions have full
  version-level coverage
- ${publication.coverage.totalAppearances.toLocaleString("en-US")}
  appearances: ${publication.coverage.fullAppearances} full articles,
  ${publication.coverage.sourceLinkedAppearances} source-linked records, and
  ${publication.coverage.timelineOnlyAppearances.toLocaleString("en-US")}
  timeline-only records
- ${publication.coverage.approvedStructuredAppearances} appearances have
  approved structured changes

## Settled canonical route verification

The published route was fetched independently from the running local site. Its
response returned the full archival article, evidence and change sections,
References with the Scribd transcript source, and \`index, follow\`; it returned
neither a timeline placeholder nor \`noindex\`.

| Canonical route | HTTP | Full article | Evidence | Changes | References | Scribd | Index |
| --------------- | ---: | ------------ | -------- | ------- | ---------- | ------ | ----- |
| \`/apple/ios/12.0/beta-3/\` | 200 | yes | yes | yes | yes | yes | yes |

Final verification on ${accessedAt}:

- \`npm run research:validate\`:
  ${verification.researchBatches} batches validated; this batch reports
  ${events.length} event, ${changeCount} change occurrences,
  ${sources.length} sources, and ${citationCount} citation references;
  ${verification.globalChangeKeys.toLocaleString("en-US")} change keys remain
  globally consistent
- full repository suite: ${verification.fullTests} tests passed
- focused ingestion and manifest suite: ${verification.focusedTests} tests
  passed
- all ${verification.evidenceAssertions} exact evidence assertions passed with
  zero failures
- independent copyright-similarity scan: maximum contiguous overlap of
  ${verification.maximumEditorialOverlapWords} words
- ESLint, Prettier check, and focused \`git diff --check\`: passed
- deterministic regeneration: the formatted JSON SHA-256 is \`${jsonSha}\`
- final production dry run reproduced
  ${publication.immediateZeroCreates} creates,
  ${publication.immediateZeroPatches} patches,
  ${publication.immediateZeroUnchanged.toLocaleString("en-US")} unchanged
  documents, the ${publication.immediateZeroPayloadBytes}-byte payload, and
  plan SHA \`${publication.immediateZeroPlanSha}\`
- the final planner reported “No Sanity data changed”

Reproduce with:

\`\`\`sh
node scripts/research-batches/build-apple-ios-12-prerelease.mjs
npm run research:validate
node --import tsx --test tests/launch-content-ingestion.test.ts tests/launch-content-manifest.test.ts
npx eslint scripts/research-batches/build-apple-ios-12-prerelease.mjs
npx prettier --check scripts/research-batches/build-apple-ios-12-prerelease.mjs scripts/research-batches/apple-ios-12-prerelease.json scripts/research-batches/apple-ios-12-prerelease.md
npx sanity exec scripts/ingest-launch-content.ts --with-user-token -- --content scripts/research-batches/apple-ios-12-prerelease.json
\`\`\`

The final command is intentionally a post-publication dry run and must
reproduce the zero plan above. Do not add \`--apply\`.
`;

const formattedMd = await prettier.format(md, { filepath: ledgerName });
writeFileSync(join(here, ledgerName), formattedMd);
