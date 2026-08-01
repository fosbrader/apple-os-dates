import { createHash } from "node:crypto";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import prettier from "prettier";

const here = dirname(fileURLToPath(import.meta.url));
const outputName = "apple-ios-11-prerelease.json";
const ledgerName = "apple-ios-11-prerelease.md";
const accessedAt = "2026-07-30";
const reviewedAt = "2026-07-30T10:06:46Z";

const dryRun = {
  creates: 93,
  patches: 7,
  unchanged: 2075,
  sourceCreates: 8,
  changeCreates: 85,
  mutationPayloadBytes: 310_129,
  planSha: "9348884dffedd100b754ae2aa1688eddbbccb325ae9cb7b57ec58f383f742975",
  planArtifactSha:
    "c8ef8a845da9d6d7617cdbe958dc0e6614a82adc1fd96ffd6a47172fd8606dc5",
  rollbackArtifactSha:
    "e7a25ab76092af7aa0fff868ceb1489de7b414a41c46ab8335e595b84b20aba1",
};
const verification = {
  researchBatches: 60,
  globalChangeKeys: 3540,
  focusedTests: 19,
  fullTests: 131,
  beta1LocatorAssertions: 7,
  beta2HtmlBytes: 189_281,
  beta2DistinctIssueIds: 182,
  beta2LocatorAssertions: 4,
  laterDeltaAssertions: 74,
  maximumEditorialOverlapWords: 5,
};
const publication = {
  transactionId: "F0eE6eK5XyVXtlnaoyKD0d",
  receiptSha:
    "b97ae2fc5913632fb002ce3012817f13a4ab37fb52c3a4a2588e1942c47a4c1a",
  immediateZeroPlanSha:
    "a4d6ec1f7602de124baac3e0e2be37cf84a7b7b947ae9d8d5a4ae0d58f2d559c",
  immediateZeroPlanArtifactSha:
    "596b55d1b900adbbca23cd01db5f874a80ac8f74497e2abbfc2f31c4b2213283",
  immediateZeroRollbackArtifactSha:
    "2d4def4cb9bba5d5ffd56f216b5b5bc6b647c0b01e64ed0296f69514e731864e",
  immediateZeroCreates: 0,
  immediateZeroPatches: 0,
  immediateZeroUnchanged: 2175,
  immediateZeroPayloadBytes: 16,
  coverage: {
    fullVersions: 410,
    totalVersions: 410,
    fullAppearances: 409,
    sourceLinkedAppearances: 256,
    timelineOnlyAppearances: 1314,
    totalAppearances: 1979,
    approvedStructuredAppearances: 560,
  },
};

const U = {
  beta1:
    "https://www.redmondpie.com/ios-11-beta-1-release-notes-changes-and-known-issues-according-to-apple/",
  beta1Image:
    "https://cdn.redmondpie.com/wp-content/uploads/2017/06/iOS_11_beta_Release_Notes-5.png",
  beta2: "https://9to5mac.com/2017/06/21/apple-ios-11-beta-2/",
  beta3:
    "https://forums.macrumors.com/attachments/ios_11_beta_3_release_notes-pdf.707997/",
  beta4:
    "https://forums.macrumors.com/attachments/ios_11_beta_4_release_notes-pdf.709879/",
  beta5:
    "https://forums.macrumors.com/attachments/beta-5-release-notes-pdf.711935/",
  beta5Archive:
    "https://web.archive.org/web/20250817114753id_/https://forums.macrumors.com/attachments/beta-5-release-notes-pdf.711935/",
  beta6:
    "https://forums.macrumors.com/attachments/ios_11_beta_6_release_notes-pdf.712922/",
  beta7:
    "https://forums.macrumors.com/attachments/ios_11_beta_7_release_notes-pdf.713953/",
  beta8:
    "https://forums.macrumors.com/attachments/ios_11_beta_8_release_notes-pdf.714880/",
  beta10:
    "https://forums.macrumors.com/attachments/ios_11_beta_10_release_notes-pdf.716168/",
  finalNotes:
    "https://developer.apple.com/library/archive/releasenotes/General/RN-iOSSDK-11/",
};

const sources = [
  {
    url: U.beta1,
    archiveUrl: U.beta1Image,
    title: "iOS 11 beta 1 Release Notes (Apple-authored composite image)",
    publisher: "Redmond Pie document image",
    sourceClass: "archive",
    author: "Apple",
    publishedAt: "2017-06-06T03:26:52.000Z",
    topics: [
      "iOS",
      "11.0",
      "Beta 1",
      "Apple Developer release notes",
      "historical document mirror",
    ],
  },
  {
    url: U.beta2,
    title: "iOS 11 beta 2 Release Notes (Apple-authored transcript)",
    publisher: "9to5Mac transcript",
    sourceClass: "archive",
    author: "Apple",
    publishedAt: "2017-06-21T20:03:24.000Z",
    topics: [
      "iOS",
      "11.0",
      "Beta 2",
      "Apple Developer release notes",
      "historical transcript",
    ],
  },
  {
    url: U.beta3,
    title: "iOS 11 beta 3 Release Notes",
    publisher: "MacRumors Forums document mirror",
    sourceClass: "archive",
    author: "Apple",
    publishedAt: "2017-07-10T00:00:00.000Z",
    topics: ["iOS", "11.0", "Beta 3", "Apple Developer release notes"],
  },
  {
    url: U.beta4,
    title: "iOS 11 beta 4 Release Notes",
    publisher: "MacRumors Forums document mirror",
    sourceClass: "archive",
    author: "Apple",
    publishedAt: "2017-07-24T00:00:00.000Z",
    topics: ["iOS", "11.0", "Beta 4", "Apple Developer release notes"],
  },
  {
    url: U.beta5,
    archiveUrl: U.beta5Archive,
    title: "iOS 11 beta 5 Release Notes",
    publisher: "MacRumors Forums document mirror",
    sourceClass: "archive",
    author: "Apple",
    publishedAt: "2017-08-07T00:00:00.000Z",
    topics: ["iOS", "11.0", "Beta 5", "Apple Developer release notes"],
  },
  {
    url: U.beta6,
    title: "iOS 11 beta 6 Release Notes",
    publisher: "MacRumors Forums document mirror",
    sourceClass: "archive",
    author: "Apple",
    publishedAt: "2017-08-14T00:00:00.000Z",
    topics: ["iOS", "11.0", "Beta 6", "Apple Developer release notes"],
  },
  {
    url: U.beta7,
    title: "iOS 11 beta 7 Release Notes",
    publisher: "MacRumors Forums document mirror",
    sourceClass: "archive",
    author: "Apple",
    publishedAt: "2017-08-21T00:00:00.000Z",
    topics: ["iOS", "11.0", "Beta 7", "Apple Developer release notes"],
  },
  {
    url: U.finalNotes,
    title: "iOS 11 SDK Release Notes",
    publisher: "Apple Developer",
    sourceClass: "firstPartyDocumentation",
    author: "Apple",
    publishedAt: "2017-09-19T00:00:00.000Z",
    topics: ["iOS", "11.0", "final SDK state", "archive boundary"],
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

const change = (
  key,
  title,
  canonicalSummary,
  category,
  action,
  component,
  status,
  issueIds,
  summary,
  boundary,
) => ({
  key,
  title,
  canonicalSummary,
  category,
  action,
  component,
  status,
  issueIds,
  summary,
  boundary,
});

const eventSpecs = [
  {
    alias: "beta-1",
    label: "Beta 1",
    source: U.beta1,
    method:
      "The initial-state selection is limited to seven records under exact New Features headings in the Apple-authored composite image. Generic known issues and the surrounding publisher article are excluded.",
    evidence:
      "The retained composite is 600×9,426 pixels, carries Apple’s copyright footer, and preserves exact component headings and issue identifiers.",
    changes: [
      change(
        "apple-11-beta1-background-session-scheduling",
        "Background transfers gained future scheduling",
        "Developers could schedule background URL-session work to begin later and describe expected upload and download sizes.",
        "developerApi",
        "introduced",
        "Foundation",
        "New Features",
        "27866330",
        "The first beta documented scheduling controls for deferred background network tasks.",
        "initial",
      ),
      change(
        "apple-11-beta1-urlsession-progress",
        "URL-session tasks exposed unified progress",
        "URLSessionTask adopted progress reporting so clients could observe transfer completion through one consistent mechanism.",
        "developerApi",
        "introduced",
        "Foundation",
        "New Features",
        "30834550",
        "Apple’s initial notes introduce progress reporting across URL-session tasks.",
        "initial",
      ),
      change(
        "apple-11-beta1-brotli-http",
        "HTTP Brotli decoding arrived",
        "URLSession added transparent Brotli content decoding for applications built with the iOS 11 SDK.",
        "developerApi",
        "introduced",
        "Foundation",
        "New Features",
        "27724985",
        "The Beta 1 document records Brotli as a newly supported HTTP content encoding.",
        "initial",
      ),
      change(
        "apple-11-beta1-safari-sync",
        "Safari adopted a new bookmark sync system",
        "Safari began migrating bookmarks and Reading List data to a redesigned synchronization system after a user’s devices reached iOS 11.",
        "feature",
        "introduced",
        "Safari",
        "New Features",
        "22936727",
        "Apple’s initial notes describe a silent migration to the new Safari synchronization system.",
        "initial",
      ),
      change(
        "apple-11-beta1-hindi-dictation-keyboards",
        "Hindi dictation and transliteration keyboards expanded",
        "Siri gained Hindi dictation while the system added three Hindi keyboard layouts, including transliteration options.",
        "feature",
        "introduced",
        "Siri",
        "New Features",
        "28833099",
        "The Beta 1 notes connect Hindi dictation with new Devanagari and transliteration keyboard choices.",
        "initial",
      ),
      change(
        "apple-11-beta1-siri-voice-expansion",
        "Siri added and upgraded international voices",
        "Siri expanded voice choices across several languages and refreshed Japanese and Chinese voices.",
        "feature",
        "introduced",
        "Siri",
        "New Features",
        "32221950",
        "Apple documented a broad international voice expansion in the first beta.",
        "initial",
      ),
      change(
        "apple-11-beta1-siri-translation",
        "Siri introduced English translation requests",
        "Siri began translating requests from US English into five languages: French, German, Italian, Spanish, and Chinese.",
        "feature",
        "introduced",
        "Siri",
        "New Features",
        "32221937",
        "The initial release notes identify the first supported language set for Siri translation.",
        "initial",
      ),
    ],
  },
  {
    alias: "beta-2",
    label: "Beta 2",
    source: U.beta2,
    method:
      "Only Apple-authored transcript records that explicitly say Beta 2, starting in Beta 2, or compare Beta 2 with Beta 1 are retained. The publisher’s separate discovered-changes section is excluded.",
    evidence:
      "The retained page contains the complete Apple note transcript beneath an explicit Beta 2 release-note heading for iOS 11 and 182 distinct eight-digit issue identifiers.",
    changes: [
      change(
        "apple-11-beta2-bluetooth-l2cap",
        "Bluetooth LE L2CAP became fully available",
        "The second beta enabled the full Low Energy L2CAP channel implementation.",
        "developerApi",
        "introduced",
        "Bluetooth",
        "Resolved Issues",
        "32493297",
        "Apple’s record explicitly identifies Beta 2 as the point of full LE L2CAP functionality.",
        "selfIdentifying",
      ),
      change(
        "apple-11-beta2-driving-mode",
        "Do Not Disturb While Driving switched on",
        "Do Not Disturb While Driving became enabled in the second developer beta.",
        "feature",
        "introduced",
        "Do Not Disturb",
        "Resolved Issues",
        "32232545",
        "The Apple-authored transcript explicitly dates feature enablement to Beta 2.",
        "selfIdentifying",
      ),
      change(
        "apple-11-beta2-sharing-compatibility",
        "Wi-Fi credential sharing required matching beta generations",
        "Wi-Fi password and Personal Hotspot sharing in Beta 2 did not interoperate with devices still using Beta 1.",
        "compatibility",
        "knownIssue",
        "Networking",
        "Known Issues",
        "32500217",
        "Apple documents a cross-beta compatibility boundary for credential and hotspot sharing.",
        "selfIdentifying",
      ),
      change(
        "apple-11-beta2-drag-move-policy",
        "Drag-and-drop move policy tightened",
        "Cross-application drag operations stopped advertising move semantics beginning with the second beta.",
        "behavior",
        "changed",
        "UIKit",
        "Known Issues",
        "32416557",
        "The transcript explicitly marks the allowsMoveOperation behavior change as starting in Beta 2.",
        "selfIdentifying",
      ),
    ],
  },
  {
    alias: "beta-3",
    label: "Beta 3",
    source: U.beta3,
    previousSource: U.beta2,
    method:
      "Selection requires an exact issue identifier present in the Beta 3 PDF but absent from the complete 182-identifier Beta 2 transcript. This avoids treating carried records as a Beta 3 delta.",
    evidence:
      "The 21-page Apple PDF contains 196 bullet records and 183 distinct issue identifiers; the issue-inventory comparison isolates 16 additions.",
    changes: [
      change(
        "apple-11-beta3-offloaded-backup-restore",
        "Offloaded apps could inflate restored backups",
        "Restoring an offloaded application from both an iTunes backup and library could install it twice and consume extra space.",
        "knownIssue",
        "knownIssue",
        "App Store",
        "New Issues",
        "31461664",
        "Beta 3 newly records a duplicate restoration path for offloaded applications.",
        "added",
      ),
      change(
        "apple-11-beta3-calendar-drag-crash",
        "Calendar drag operations could crash",
        "Dragging an item into Calendar could terminate the application.",
        "knownIssue",
        "knownIssue",
        "Calendar",
        "New Issues",
        "33039833",
        "The Beta 3 issue inventory adds a Calendar failure during drag and drop.",
        "added",
      ),
      change(
        "apple-11-beta3-control-center-wifi",
        "Control Center Wi-Fi became a temporary disconnect",
        "The Wi-Fi control disconnected the active network while leaving networking available for later automatic reconnection.",
        "behavior",
        "changed",
        "Control Center",
        "New Features",
        "32299242",
        "Apple introduces the revised Control Center Wi-Fi behavior in the third beta notes.",
        "added",
      ),
      change(
        "apple-11-beta3-empty-header-compatibility",
        "Empty URL-session headers reverted",
        "Apple removed a Beta 2 URLSession behavior that had used empty strings to suppress HTTP headers.",
        "compatibility",
        "changed",
        "Foundation",
        "New Issues",
        "32959604",
        "The record explicitly identifies Beta 3 as restoring the earlier header behavior for compatibility.",
        "added",
      ),
      change(
        "apple-11-beta3-pac-url-loading",
        "Proxy scripts could block URL loading",
        "URLSession and NSURLConnection could fail when the device used certain proxy auto-configuration files.",
        "knownIssue",
        "knownIssue",
        "Foundation",
        "New Issues",
        "32883776",
        "Beta 3 adds a proxy-configuration failure affecting Apple networking clients.",
        "added",
      ),
      change(
        "apple-11-beta3-itunes-restore-icons",
        "Restores could temporarily omit app identities",
        "An iTunes restore could leave application names and icons absent until synchronization and installation finished.",
        "knownIssue",
        "knownIssue",
        "iTunes",
        "New Issues",
        "32543667",
        "Apple newly documents incomplete app identity display during a restore.",
        "added",
      ),
      change(
        "apple-11-beta3-keyboard-state",
        "Keyboard choices could fail to persist",
        "Changes among keyboard modes, layouts, and recent emoji could be lost.",
        "knownIssue",
        "knownIssue",
        "Keyboards",
        "New Issues",
        "33092873",
        "The Beta 3 notes add a persistence problem affecting several keyboard preferences.",
        "added",
      ),
      change(
        "apple-11-beta3-maps-driving-directions",
        "Siri directions worked during driving mode",
        "Siri regained the ability to request Maps directions while Do Not Disturb While Driving was active.",
        "bugFix",
        "fixed",
        "Maps",
        "Resolved Issues",
        "32273986",
        "Apple places the driving-mode Maps interaction in Beta 3’s resolved list.",
        "added",
      ),
      change(
        "apple-11-beta3-multipath-testing",
        "Multipath networking gained a developer switch",
        "Developer settings added a control for testing URL-session multipath modes across Wi-Fi and cellular links.",
        "developerApi",
        "introduced",
        "Networking",
        "New Features",
        "32927263",
        "The third beta introduces a system setting for multipath networking experiments.",
        "added",
      ),
      change(
        "apple-11-beta3-authentication-session-api",
        "Safari authentication sessions gained a dedicated API",
        "SFAuthenticationSession provided a system-mediated web authentication flow with callback handling.",
        "developerApi",
        "introduced",
        "SafariServices",
        "New Features",
        "32433374",
        "Apple adds the authentication-session API to the Beta 3 framework notes.",
        "added",
      ),
      change(
        "apple-11-beta3-safari-activity-order",
        "Custom Safari activities moved forward",
        "Custom activities supplied to Safari view controllers appeared nearer the front of the sharing interface by default.",
        "enhancement",
        "changed",
        "SafariServices",
        "New Features",
        "32661540",
        "Beta 3 changes the default placement of developer-provided Safari activities.",
        "added",
      ),
      change(
        "apple-11-beta3-siri-finnish-notebook",
        "Finnish notebook commands could fail across utterances",
        "Multi-part Finnish SiriKit requests in the notebook domain did not complete correctly.",
        "knownIssue",
        "knownIssue",
        "Siri",
        "New Issues",
        "32272318",
        "Apple adds a language-specific SiriKit limitation for notebook commands.",
        "added",
      ),
      change(
        "apple-11-beta3-siri-request-context",
        "Siri could carry context into a later request",
        "Information from an earlier Siri interaction could influence a later request even after the interface closed.",
        "knownIssue",
        "knownIssue",
        "Siri",
        "New Issues",
        "33148434",
        "Beta 3 newly identifies stale request context in Siri.",
        "added",
      ),
      change(
        "apple-11-beta3-siri-long-press-timeout",
        "Holding Home could stall Siri",
        "Keeping the Home button pressed throughout a spoken request could make Siri hang or time out.",
        "knownIssue",
        "knownIssue",
        "Siri",
        "New Issues",
        "33086511",
        "The third beta notes add a Siri timeout tied to an extended button hold.",
        "added",
      ),
      change(
        "apple-11-beta3-siri-carplay-send",
        "CarPlay’s Siri send control could error",
        "Using the on-screen Send action for a Siri message in CarPlay could fail.",
        "knownIssue",
        "knownIssue",
        "Siri",
        "New Issues",
        "33160022",
        "Apple newly records a message-send failure in the CarPlay Siri interface.",
        "added",
      ),
      change(
        "apple-11-beta3-vision-coreml-vectors",
        "Vision accepted more Core ML output types",
        "Vision expanded beyond classifier models to support additional Core ML feature-vector results.",
        "developerApi",
        "fixed",
        "Vision",
        "Resolved Issues",
        "32944774",
        "The resolved record contrasts Beta 3 support with the classifier-only behavior of Beta 2 and earlier.",
        "added",
      ),
    ],
  },
  {
    alias: "beta-4",
    label: "Beta 4",
    source: U.beta4,
    previousSource: U.beta3,
    method:
      "The Beta 4 PDF was parsed against Beta 3 by component, status heading, issue identifier, and normalized record text. A carried Metal statement explicitly attributed to Beta 2 and a grammar-only SafariServices edit are excluded.",
    evidence:
      "The 22-page Beta 4 PDF contains 206 bullets and 192 distinct issue identifiers. Twenty-two substantive additions or status transitions survive the exclusions.",
    changes: [
      change(
        "apple-11-beta4-itunes-32bit-sync",
        "iTunes synchronized 32-bit apps correctly",
        "The incomplete app entry left by synchronizing 32-bit applications through iTunes was resolved.",
        "bugFix",
        "fixed",
        "32-bit Apps",
        "Resolved Issues",
        "32356790",
        "Beta 4 moves the 32-bit synchronization defect from known to resolved.",
        "statusChange",
      ),
      change(
        "apple-11-beta4-vsco-import",
        "Recent photos imported into VSCO",
        "VSCO stopped returning the documented error when importing newly captured photographs.",
        "bugFix",
        "fixed",
        "3rd Party Apps",
        "Resolved Issues",
        "32582234",
        "Apple marks the recent-photo VSCO import problem as resolved.",
        "statusChange",
      ),
      change(
        "apple-11-beta4-citi-launch",
        "Citi Mobile launch crash resolved",
        "Citi Mobile no longer terminated during application launch.",
        "bugFix",
        "fixed",
        "3rd Party Apps",
        "Resolved Issues",
        "31336493",
        "Beta 4 closes the previously documented Citi Mobile startup failure.",
        "statusChange",
      ),
      change(
        "apple-11-beta4-pinterest-email-login",
        "Pinterest email sign-in recovered",
        "Users regained the ability to authenticate to Pinterest with an email address.",
        "bugFix",
        "fixed",
        "3rd Party Apps",
        "Resolved Issues",
        "31866166",
        "Apple moves Pinterest email authentication into the resolved section.",
        "statusChange",
      ),
      change(
        "apple-11-beta4-airplay-windowed-video",
        "Windowed-video AirPlay could crash applications",
        "Invoking AirPlay while video was not full screen could terminate Apple and third-party applications.",
        "knownIssue",
        "knownIssue",
        "AirPlay",
        "New Issues",
        "33331364",
        "The fourth beta adds an AirPlay crash affecting several windowed-video applications.",
        "added",
      ),
      change(
        "apple-11-beta4-child-apple-id",
        "Phone-number Apple IDs could create child accounts",
        "Accounts whose Apple ID was a telephone number regained child-account creation in Family Sharing.",
        "bugFix",
        "fixed",
        "Apple ID",
        "Resolved Issues",
        "32130392",
        "Beta 4 resolves the child-account creation restriction for phone-number identities.",
        "statusChange",
      ),
      change(
        "apple-11-beta4-facetime-live-photos-default",
        "FaceTime Live Photos defaulted off",
        "Most devices initially presented FaceTime Live Photos in the off state.",
        "knownIssue",
        "knownIssue",
        "FaceTime",
        "New Issues",
        "33322822",
        "Apple introduces a default-state limitation for FaceTime Live Photos.",
        "added",
      ),
      change(
        "apple-11-beta4-item-provider-progress",
        "Item-provider progress advanced correctly",
        "NSItemProvider’s exposed progress began tracking completion reported by the underlying data provider.",
        "bugFix",
        "fixed",
        "Foundation",
        "Resolved Issues",
        "32385051",
        "Beta 4 resolves stalled proportional progress reporting for item providers.",
        "statusChange",
      ),
      change(
        "apple-11-beta4-ibooks-redownload",
        "Purchased books downloaded again after deletion",
        "A store purchase could be downloaded again after its local copy was removed.",
        "bugFix",
        "fixed",
        "iBooks",
        "Resolved Issues",
        "32775084",
        "Apple closes the documented repeat-download failure for purchased books.",
        "statusChange",
      ),
      change(
        "apple-11-beta4-ibooks-pdf-bookmarks",
        "PDF bookmark editing stopped freezing iBooks",
        "Adding or deleting a bookmark in a PDF no longer made iBooks unresponsive.",
        "bugFix",
        "fixed",
        "iBooks",
        "Resolved Issues",
        "32625432",
        "The fourth beta resolves a PDF bookmark stability problem.",
        "statusChange",
      ),
      change(
        "apple-11-beta4-dep-icloud-backups",
        "DEP-enrolled iPads gained iCloud backup",
        "iPads enrolled through the Device Enrollment Program could use iCloud backups.",
        "bugFix",
        "fixed",
        "iCloud",
        "Resolved Issues",
        "32027587",
        "Beta 4 lifts the documented iCloud backup restriction on DEP-enrolled iPads.",
        "statusChange",
      ),
      change(
        "apple-11-beta4-najdi-keyboard",
        "A Najdi Arabic keyboard was added",
        "The keyboard catalog expanded with an Arabic layout for the Najdi dialect.",
        "feature",
        "introduced",
        "Keyboards",
        "New Features",
        "29187663",
        "Apple adds the Najdi Arabic keyboard in the fourth beta document.",
        "added",
      ),
      change(
        "apple-11-beta4-keyboard-state",
        "Keyboard state changes persisted",
        "Selections such as one-handed mode, keyboard type, and recent emoji remained saved.",
        "bugFix",
        "fixed",
        "Keyboards",
        "Resolved Issues",
        "33092873",
        "Beta 4 resolves the keyboard preference persistence issue introduced in Beta 3.",
        "statusChange",
      ),
      change(
        "apple-11-beta4-phone-recents-selection",
        "Phone recents could dial the wrong row",
        "A delayed call-history refresh could cause the second recent number to be dialed when the first row was selected.",
        "knownIssue",
        "knownIssue",
        "Phone",
        "New Issues",
        "33094744",
        "Apple adds a selection hazard caused by stale ordering in Phone recents.",
        "added",
      ),
      change(
        "apple-11-beta4-content-blocker-memory",
        "Safari content-blocker memory increase was removed",
        "Safari returned content-blocker loading memory to the level used before Beta 3.",
        "bugFix",
        "fixed",
        "Safari",
        "Resolved Issues",
        "32330531",
        "The Beta 4 notes close the temporary content-blocker memory regression.",
        "statusChange",
      ),
      change(
        "apple-11-beta4-tls-ciphersuite-version",
        "Some cipher suites required TLS 1.2",
        "Cipher suites defined by TLS 1.2 could no longer be negotiated with older protocol versions across Apple platforms.",
        "compatibility",
        "knownIssue",
        "Security",
        "New Issues",
        "33140907",
        "Beta 4 adds a cross-platform TLS negotiation restriction.",
        "added",
      ),
      change(
        "apple-11-beta4-music-cellular-accounting",
        "Music downloads could be misclassified in cellular usage",
        "Cellular traffic for music downloads could appear under Wi-Fi Services instead of iTunes Accounts.",
        "knownIssue",
        "knownIssue",
        "Settings",
        "New Issues",
        "32353045",
        "Apple newly documents inaccurate attribution in the cellular usage interface.",
        "added",
      ),
      change(
        "apple-11-beta4-siri-china-emergency",
        "Siri could skip emergency-number disambiguation",
        "On Chinese networks, Siri could dial without distinguishing among the available emergency numbers.",
        "knownIssue",
        "knownIssue",
        "Siri",
        "New Issues",
        "31805684",
        "The fourth beta adds a regional emergency-number selection issue.",
        "added",
      ),
      change(
        "apple-11-beta4-siri-knowledge-layout",
        "Siri knowledge results could render poorly outside US English",
        "General-knowledge and Wikipedia answers could show interface and layout defects in other languages.",
        "knownIssue",
        "knownIssue",
        "Siri",
        "New Issues",
        "33404897",
        "Apple adds a localization-related presentation problem for Siri results.",
        "added",
      ),
      change(
        "apple-11-beta4-siri-long-press-timeout",
        "Extended Home-button Siri requests completed",
        "Siri no longer stalled when the Home button remained pressed through an entire spoken request.",
        "bugFix",
        "fixed",
        "Siri",
        "Resolved Issues",
        "33086511",
        "Beta 4 resolves the long-button-hold timeout documented in Beta 3.",
        "statusChange",
      ),
      change(
        "apple-11-beta4-siri-carplay-send",
        "CarPlay’s Siri send control worked",
        "The on-screen Send action completed Siri-authored messages in CarPlay without the earlier error.",
        "bugFix",
        "fixed",
        "Siri",
        "Resolved Issues",
        "33160022",
        "Apple moves the CarPlay message-send failure into Beta 4’s resolved list.",
        "statusChange",
      ),
      change(
        "apple-11-beta4-touchid-simulator",
        "Simulator Touch ID authentication was unreliable",
        "The iOS 11 Simulator’s LocalAuthentication implementation mishandled Touch ID.",
        "knownIssue",
        "knownIssue",
        "Touch ID",
        "New Issues",
        "33355624",
        "Beta 4 adds a simulator-only Touch ID framework limitation.",
        "added",
      ),
    ],
  },
  {
    alias: "beta-5",
    label: "Beta 5",
    source: U.beta5,
    previousSource: U.beta4,
    method:
      "The Beta 5 state was compared with Beta 4 by component, status, issue identifier, and normalized text. Two wording-only carried records—Bluetooth L2CAP and Safari blocker memory—are excluded.",
    evidence:
      "The 23-page Beta 5 PDF contains 215 bullets and 200 distinct issue identifiers. Its current attachment and archived replay are byte-identical.",
    changes: [
      change(
        "apple-11-beta5-airplay-windowed-video",
        "Windowed-video AirPlay stopped crashing apps",
        "Applications no longer terminated when AirPlay was selected from video outside full-screen presentation.",
        "bugFix",
        "fixed",
        "AirPlay",
        "Resolved Issues",
        "33331364",
        "Beta 5 resolves the multi-application AirPlay crash introduced in Beta 4.",
        "statusChange",
      ),
      change(
        "apple-11-beta5-camera-calibration-data",
        "Camera calibration data returned without depth capture",
        "AVCapturePhoto supplied calibration information when calibration delivery was enabled without also requiring depth data.",
        "bugFix",
        "fixed",
        "AVFoundation",
        "Resolved Issues",
        "32209427",
        "Apple closes the calibration-data delivery dependency in Beta 5.",
        "statusChange",
      ),
      change(
        "apple-11-beta5-calendar-drag",
        "Calendar accepted dragged items",
        "Dragging an item into Calendar no longer caused the application to fail.",
        "bugFix",
        "fixed",
        "Calendar",
        "Resolved Issues",
        "33039833",
        "Beta 5 moves the Calendar drag crash from known to resolved.",
        "statusChange",
      ),
      change(
        "apple-11-beta5-facetime-live-photos-default",
        "FaceTime Live Photos defaulted on",
        "FaceTime Live Photos returned to an enabled default state.",
        "bugFix",
        "fixed",
        "FaceTime",
        "Resolved Issues",
        "33322822",
        "Apple reverses the disabled default documented in Beta 4.",
        "statusChange",
      ),
      change(
        "apple-11-beta5-simulator-local-documents",
        "Simulator-local documents could not reopen",
        "Documents saved to local storage in Simulator could fail to load through the document browser.",
        "knownIssue",
        "knownIssue",
        "Files App",
        "New Issues",
        "32947101",
        "Beta 5 adds a Simulator document-browser persistence issue.",
        "added",
      ),
      change(
        "apple-11-beta5-streamtask-pac",
        "Proxy evaluation could break nonsecure streams",
        "A failed automatic-proxy evaluation could prevent nonsecure URLSession stream tasks from connecting.",
        "knownIssue",
        "knownIssue",
        "Foundation",
        "New Issues",
        "33609198",
        "Apple adds a stream-task failure tied to WPAD or PAC evaluation errors.",
        "added",
      ),
      change(
        "apple-11-beta5-health-favorites",
        "Recent Health favorites disappeared",
        "Favorites added during early iOS 11 betas could be missing, while favorites from before iOS 11 were restored.",
        "knownIssue",
        "knownIssue",
        "Health app",
        "New Issues",
        "30774300",
        "The Beta 5 notes establish a data-state boundary for Health favorites.",
        "added",
      ),
      change(
        "apple-11-beta5-messages-in-icloud",
        "Messages in iCloud was withdrawn",
        "Apple removed Messages in iCloud from the beta and deferred it to a later iOS 11 software update.",
        "removal",
        "removed",
        "Messages",
        "New Issues",
        "",
        "The Beta 5 document explicitly records the feature’s removal and later return plan.",
        "added",
      ),
      change(
        "apple-11-beta5-message-compose-insertion",
        "Message extensions inserted into compose sheets",
        "MSMessage content supplied through the standard message composer no longer produced an empty staging area.",
        "bugFix",
        "fixed",
        "Messages",
        "Resolved Issues",
        "32087732",
        "Beta 5 resolves message-extension insertion in the compose interface.",
        "statusChange",
      ),
      change(
        "apple-11-beta5-conference-call-display",
        "Conference calls showed only one participant number",
        "The Phone interface could display a single number during a multiparty conference call.",
        "knownIssue",
        "knownIssue",
        "Phone",
        "New Issues",
        "33325487",
        "Apple adds a participant-display limitation for conference calls.",
        "added",
      ),
      change(
        "apple-11-beta5-voicemail-controls",
        "Voicemail controls could become disabled",
        "Listening to a voicemail could leave the Greeting and Edit controls unavailable.",
        "knownIssue",
        "knownIssue",
        "Phone",
        "New Issues",
        "33351538",
        "Beta 5 newly documents disabled controls in the Voicemail tab.",
        "added",
      ),
      change(
        "apple-11-beta5-phone-recents-refresh",
        "Phone recents refreshed before selection",
        "Call-history ordering updated correctly, removing the stale-row dialing hazard.",
        "bugFix",
        "fixed",
        "Phone",
        "Resolved Issues",
        "33094744",
        "The Beta 5 notes resolve the wrong-row selection issue added in Beta 4.",
        "statusChange",
      ),
      change(
        "apple-11-beta5-siri-china-emergency",
        "Siri distinguished Chinese emergency numbers",
        "Siri began disambiguating among the emergency numbers available on Chinese networks.",
        "bugFix",
        "fixed",
        "Siri",
        "Resolved Issues",
        "31805684",
        "Apple resolves the regional emergency-number selection problem.",
        "statusChange",
      ),
      change(
        "apple-11-beta5-touchid-simulator",
        "Simulator Touch ID authentication recovered",
        "Touch ID authentication through LocalAuthentication worked again in Apple’s iOS 11 Simulator.",
        "bugFix",
        "fixed",
        "Touch ID",
        "Resolved Issues",
        "33355624",
        "Beta 5 closes the simulator-only authentication issue introduced in Beta 4.",
        "statusChange",
      ),
      change(
        "apple-11-beta5-navigation-search-controller",
        "Navigation search controllers supported scroll views",
        "A navigation item’s search controller worked with view controllers backed by a scroll view.",
        "bugFix",
        "fixed",
        "UIKit",
        "Resolved Issues",
        "32511772",
        "Apple resolves a UIKit search-controller integration limitation.",
        "statusChange",
      ),
      change(
        "apple-11-beta5-vision-landmarks-swift",
        "Vision landmark regions were unavailable to Swift",
        "Swift code could not use the two-dimensional face-landmark region type.",
        "knownIssue",
        "knownIssue",
        "Vision",
        "New Issues",
        "33191123",
        "Beta 5 adds a Swift availability gap in the Vision framework.",
        "added",
      ),
      change(
        "apple-11-beta5-xcode-disabled-extension",
        "Debugging a disabled Messages extension could crash",
        "Starting a debug session for a disabled Messages extension could terminate Messages.",
        "knownIssue",
        "knownIssue",
        "Xcode",
        "New Issues",
        "33657938",
        "Apple adds an Xcode workflow hazard involving disabled Messages extensions.",
        "added",
      ),
      change(
        "apple-11-beta5-xcode-cover-sheet",
        "Simulator Cover Sheet could not be opened",
        "After a simulated device started, the lock-screen notification surface could fail to pull down.",
        "knownIssue",
        "knownIssue",
        "Xcode",
        "New Issues",
        "33274699",
        "Beta 5 adds a Simulator interaction issue affecting Cover Sheet.",
        "added",
      ),
    ],
  },
  {
    alias: "beta-6",
    label: "Beta 6",
    source: U.beta6,
    previousSource: U.beta5,
    method:
      "The Beta 6 document was compared directly with Beta 5. Only new records and genuine transitions from known or new issues into Resolved Issues are retained.",
    evidence:
      "The 23-page Beta 6 PDF contains 218 bullets and 203 distinct issue identifiers; the semantic comparison isolates 15 records.",
    changes: [
      change(
        "apple-11-beta6-audiobus-launch",
        "Audiobus 3 could crash on launch",
        "Audiobus 3 could terminate while starting on the sixth beta.",
        "knownIssue",
        "knownIssue",
        "3rd Party Apps",
        "New Issues",
        "33764353",
        "Apple adds an application-compatibility warning for Audiobus 3.",
        "added",
      ),
      change(
        "apple-11-beta6-directv-launch",
        "DIRECTV launch crash resolved",
        "The DIRECTV application no longer terminated during startup.",
        "bugFix",
        "fixed",
        "3rd Party Apps",
        "Resolved Issues",
        "29533442",
        "Beta 6 moves the DIRECTV startup problem into the resolved list.",
        "statusChange",
      ),
      change(
        "apple-11-beta6-app-store-audio",
        "App Store launches preserved audio playback",
        "Opening the App Store no longer interrupted audio already playing.",
        "bugFix",
        "fixed",
        "App Store",
        "Resolved Issues",
        "32043325",
        "Apple resolves the App Store audio interruption in Beta 6.",
        "statusChange",
      ),
      change(
        "apple-11-beta6-family-setup-verification",
        "Family setup opened after payment verification",
        "Family setup launched normally after an Apple Music family purchase that required payment verification.",
        "bugFix",
        "fixed",
        "Family Sharing",
        "Resolved Issues",
        "32056496",
        "Beta 6 repairs the payment-verification path into Family setup.",
        "statusChange",
      ),
      change(
        "apple-11-beta6-family-invitations",
        "Pending family invitations appeared",
        "Family Sharing settings displayed invitations that had not yet been accepted.",
        "bugFix",
        "fixed",
        "Family Sharing",
        "Resolved Issues",
        "32602074",
        "The sixth beta restores pending invitation visibility.",
        "statusChange",
      ),
      change(
        "apple-11-beta6-family-storage-confirmation",
        "iCloud family-storage confirmation closed",
        "The confirmation interface dismissed after iCloud storage was shared with family members.",
        "bugFix",
        "fixed",
        "Family Sharing",
        "Resolved Issues",
        "32458127",
        "Apple resolves a stuck confirmation screen in the storage-sharing flow.",
        "statusChange",
      ),
      change(
        "apple-11-beta6-family-location-sharing",
        "Family location sharing activated",
        "Enabling location sharing for family members correctly turned on the underlying setting.",
        "bugFix",
        "fixed",
        "Family Sharing",
        "Resolved Issues",
        "32746961",
        "Beta 6 closes the Family Sharing location-activation failure.",
        "statusChange",
      ),
      change(
        "apple-11-beta6-child-terms",
        "Child Apple ID terms no longer froze",
        "The terms acceptance screen remained responsive while creating a child account.",
        "bugFix",
        "fixed",
        "Family Sharing",
        "Resolved Issues",
        "32365952",
        "Apple resolves the frozen terms screen in child-account creation.",
        "statusChange",
      ),
      change(
        "apple-11-beta6-now-playing-item",
        "Music-player current-item assignment worked",
        "Setting the current item on MPMusicPlayerController produced the expected result.",
        "bugFix",
        "fixed",
        "Media",
        "Resolved Issues",
        "32258814",
        "Beta 6 repairs programmatic now-playing item selection.",
        "statusChange",
      ),
      change(
        "apple-11-beta6-notes-reinstall",
        "Notes worked after backup-based reinstallation",
        "Reinstalling Notes after restoring a backup in which it was absent no longer left the application unusable.",
        "bugFix",
        "fixed",
        "Notes",
        "Resolved Issues",
        "32499971",
        "Apple resolves a Notes restoration and reinstallation failure.",
        "statusChange",
      ),
      change(
        "apple-11-beta6-pencil-rotation",
        "Rotation no longer disabled Apple Pencil",
        "Changing device orientation stopped making Apple Pencil input unavailable in Notes.",
        "bugFix",
        "fixed",
        "Notes",
        "Resolved Issues",
        "32020094",
        "The sixth beta fixes an orientation-related Apple Pencil interruption.",
        "statusChange",
      ),
      change(
        "apple-11-beta6-conference-call-display",
        "Conference calls displayed all participant numbers",
        "The Phone interface showed every number in a multiparty conference call.",
        "bugFix",
        "fixed",
        "Phone",
        "Resolved Issues",
        "33325487",
        "Beta 6 resolves the single-participant display limitation from Beta 5.",
        "statusChange",
      ),
      change(
        "apple-11-beta6-att-plan-number",
        "AT&T data-plan purchases could leave stale settings",
        "Buying an AT&T iPad data plan could fail to update the cellular data number shown in About.",
        "knownIssue",
        "knownIssue",
        "Settings",
        "New Issues",
        "33043804",
        "Apple adds an account-display issue following AT&T plan activation.",
        "added",
      ),
      change(
        "apple-11-beta6-setup-progress",
        "Setup Assistant progress bars completed accurately",
        "Reset synchronization and backup guidance no longer appeared to stall near completion.",
        "bugFix",
        "fixed",
        "Setup Assistant",
        "Resolved Issues",
        "32715751",
        "Beta 6 resolves misleading progress indicators in Setup Assistant.",
        "statusChange",
      ),
      change(
        "apple-11-beta6-sirikit-extension-version",
        "Simulator could load the wrong SiriKit extension version",
        "After installing a SiriKit extension in Simulator, Siri could report that another version was in use.",
        "knownIssue",
        "knownIssue",
        "SiriKit",
        "New Issues",
        "33663314",
        "The sixth beta adds a Simulator extension-version conflict.",
        "added",
      ),
    ],
  },
  {
    alias: "beta-7",
    label: "Beta 7",
    source: U.beta7,
    previousSource: U.beta6,
    method:
      "The Beta 7 PDF was compared directly with Beta 6. Line-wrap-only and carried records were normalized away; three substantive records remain.",
    evidence:
      "The 23-page Beta 7 PDF contains 221 bullets and 204 distinct issue identifiers. Apple assigns issue 30567424 to both the new Classroom item and a carried CloudKit item, so the locator always includes the component.",
    changes: [
      change(
        "apple-11-beta7-bluetooth-state-semantics",
        "Bluetooth state reflected Control Center limits",
        "CBManagerState distinguished the restricted Control Center state from full Bluetooth availability through updated powered-off semantics.",
        "developerApi",
        "changed",
        "Bluetooth",
        "New Features",
        "33226095",
        "Beta 7 documents how Core Bluetooth reports a user-limited radio state.",
        "added",
      ),
      change(
        "apple-11-beta7-classroom-complex-passcode",
        "Complex-passcode Shared iPad users needed manual login",
        "Shared iPad students with complex passcodes could not sign in by selecting their Classroom list icon.",
        "knownIssue",
        "knownIssue",
        "Classroom",
        "New Issues",
        "30567424",
        "Apple adds a Classroom sign-in limitation and identifies manual credential entry as the workaround.",
        "added",
      ),
      change(
        "apple-11-beta7-tls-version-restriction",
        "TLS cipher-suite restriction was removed",
        "Apple withdrew the rule that had limited RFC 5246 cipher suites to TLS 1.2 negotiation.",
        "compatibility",
        "fixed",
        "Security",
        "Resolved Issues",
        "33140907",
        "Beta 7 reverses the cross-platform TLS restriction introduced in Beta 4.",
        "statusChange",
      ),
    ],
  },
];

const sourceByUrl = new Map(sources.map((source) => [source.url, source]));
const verificationFor = (spec, item) => {
  const identity = item.issueIds
    ? `issue ${item.issueIds}`
    : "the issue-less milestone statement";
  if (item.boundary === "initial") {
    return `Matched Apple’s “${item.component}” component, exact “${item.status}” heading, and ${identity} in the Apple-authored Beta 1 composite image. Surrounding publisher prose was excluded.`;
  }
  if (item.boundary === "selfIdentifying") {
    return `Matched Apple’s “${item.component}” component, exact “${item.status}” heading, and ${identity} in the complete Beta 2 transcript. The selected record explicitly names Beta 2 or contrasts it with Beta 1; the publisher’s discovered-changes section was excluded.`;
  }
  if (spec.alias === "beta-3") {
    return `Matched Apple’s “${item.component}” component, exact “${item.status}” heading, and ${identity} in the Beta 3 PDF. Its issue identifier is absent from all 182 distinct identifiers in the complete Beta 2 transcript.`;
  }
  return `Matched Apple’s “${item.component}” component, exact “${item.status}” heading, and ${identity} in ${spec.label}; then compared the normalized record with ${eventSpecs.find((candidate) => candidate.source === spec.previousSource)?.label || "the preceding retained state"} by component, status, text, and identifier.`;
};

const changesFor = (spec) =>
  spec.changes.map((item) => ({
    key: item.key,
    title: item.title,
    canonicalSummary: item.canonicalSummary,
    category: item.category,
    action: item.action,
    inheritance: "delta",
    summary: item.summary,
    documentedStatus: "documented",
    evidenceState: "corroborated",
    verificationMethod: verificationFor(spec, item),
    citations: uniqueCitations([
      c(
        spec.source,
        `${item.component} — ${item.status}${item.issueIds ? `; ${item.issueIds}` : "; issue-less Messages in iCloud removal statement"}`,
        "Original synthesis from the Apple-authored milestone record.",
      ),
      ...(spec.previousSource
        ? [
            c(
              spec.previousSource,
              `Predecessor boundary for ${item.component}${item.issueIds ? `; ${item.issueIds}` : ""}`,
              item.boundary === "statusChange"
                ? "The preceding retained state records the prior status or behavior."
                : "The preceding retained state was checked to prevent carried-note attribution.",
            ),
          ]
        : []),
    ]),
  }));

const eventArticle = (spec, changes) =>
  article(
    heading("Evidence that survives"),
    prose(
      `${spec.evidence} The source is Apple-authored developer material retained by a public historical mirror, so this page records the mirror provenance instead of presenting it as an Apple-hosted beta archive.`,
      [
        c(
          spec.source,
          `${sourceByUrl.get(spec.source)?.title}; exact component and status headings`,
        ),
      ],
    ),
    heading(`What ${spec.label} documents`),
    prose(
      `This structured snapshot contains ${changes.length} narrowly attributed feature, behavior, compatibility, issue, or resolution records. Each occurrence keeps its Apple component, status heading, and issue identifier where Apple supplied one.`,
      uniqueCitations(changes.flatMap((item) => item.citations)),
    ),
    heading("Delta boundary"),
    prose(
      spec.method,
      uniqueCitations([
        c(spec.source, `${spec.label} retained note state`),
        ...(spec.previousSource
          ? [
              c(
                spec.previousSource,
                "Predecessor retained note state",
                "Used only for boundary comparison.",
              ),
            ]
          : []),
      ]),
    ),
    heading("Archive limitations"),
    prose(
      "The article does not reproduce Apple’s document, import publisher commentary, claim an exhaustive user-visible changelog, or infer a build number. Apple’s final archived SDK page establishes the final-document boundary but is not used to assign final-state records to this beta.",
      [
        c(
          U.finalNotes,
          "iOS 11 SDK Release Notes; revision iOS1100 - IRN1; updated September 19, 2017",
          "Final-state boundary only.",
        ),
      ],
    ),
  );

const events = eventSpecs.map((spec) => {
  const changes = changesFor(spec);
  return {
    target: {
      releaseVersionId: "version-ios-11-0",
      routeAlias: spec.alias,
    },
    authorship: "originalSynthesis",
    summary: `${spec.label} is represented by ${changes.length} narrowly attributed Apple-developer-note records. Carried cumulative notes, publisher observations, and unsupported build claims are excluded.`,
    article: eventArticle(spec, changes),
    citations: uniqueCitations([
      c(spec.source, `${spec.label} retained Apple-authored note state`),
      ...(spec.previousSource
        ? [
            c(
              spec.previousSource,
              "Predecessor retained note state",
              "Boundary comparison only.",
            ),
          ]
        : []),
      c(
        U.finalNotes,
        "Final archived iOS 11 SDK note state",
        "Archive-boundary comparison only.",
      ),
      ...changes.flatMap((item) => item.citations),
    ]),
    changes,
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
  versions: [],
  events,
  builds: [],
};

const expectedSeedInventory = [
  {
    platform: "iOS",
    majorVersion: 11,
    version: "11.0",
    releaseStatus: "released",
    publicReleaseDate: "2017-09-19",
    milestones: [
      ["Beta 1", "2017-06-05", false, undefined],
      ["Beta 2", "2017-06-21", false, undefined],
      [
        "Beta 2 Update",
        "2017-06-26",
        true,
        "Build 15A5304j; revised developer seed for select older devices",
      ],
      ["Public Beta 1", "2017-06-26", false, "Build 15A5304j"],
      ["Beta 3", "2017-07-10", false, undefined],
      ["Beta 4", "2017-07-24", false, undefined],
      ["Beta 5", "2017-08-07", false, undefined],
      ["Beta 6", "2017-08-14", false, undefined],
      ["Beta 7", "2017-08-21", false, undefined],
      ["Beta 8", "2017-08-28", false, undefined],
      ["Beta 9", "2017-08-31", false, undefined],
      ["Beta 10", "2017-09-06", false, undefined],
      ["GM", "2017-09-12", false, undefined],
      ["Public", "2017-09-19", false, undefined],
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
  .filter((version) => version.platform === "iOS" && version.version === "11.0")
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
    "The exact local iOS 11.0 seed inventory changed; re-audit the cohort before regenerating.",
  );
}

const expectedCounts = new Map([
  ["beta-1", 7],
  ["beta-2", 4],
  ["beta-3", 16],
  ["beta-4", 22],
  ["beta-5", 18],
  ["beta-6", 15],
  ["beta-7", 3],
]);
const expectedRoutes = new Set(
  [...expectedCounts.keys()].map((alias) => `version-ios-11-0/${alias}`),
);
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
  events.length !== expectedCounts.size ||
  changeCount !== 85 ||
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
      event.changes.length !== expectedCounts.get(event.target.routeAlias) ||
      event.changes.some(
        (item) =>
          item.evidenceState !== "corroborated" ||
          item.inheritance !== "delta" ||
          item.documentedStatus !== "documented" ||
          /build-identity|community-observation|seed-identity/i.test(item.key),
      ),
  )
) {
  throw new Error("The expected iOS 11 prerelease bundle closure failed.");
}

const selectedIssueIds = events.flatMap((event) =>
  event.changes
    .map(
      (item) =>
        eventSpecs
          .find((spec) => spec.alias === event.target.routeAlias)
          ?.changes.find((candidate) => candidate.key === item.key)?.issueIds,
    )
    .filter(Boolean),
);
if (
  selectedIssueIds.length !== 84 ||
  selectedIssueIds.some((issueIds) => !/^[0-9]{8}$/.test(issueIds))
) {
  throw new Error(
    "Expected exactly 84 issue-bearing occurrences plus the issue-less Beta 5 Messages removal.",
  );
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
      `iOS 11 prerelease change definition drifted for ${occurrence.key}.`,
    );
  }
  localChangeDefinitions.set(occurrence.key, definition);
}
const uniqueLocalChangeKeys = [...localChangeDefinitions.keys()];
if (uniqueLocalChangeKeys.length !== 85) {
  throw new Error(
    `Expected 85 stable iOS 11 prerelease definitions; found ${uniqueLocalChangeKeys.length}.`,
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
    for (const item of owner.changes || []) {
      if (!otherChangeKeys.has(item.key)) otherChangeKeys.set(item.key, file);
    }
  }
}
const collisions = uniqueLocalChangeKeys.filter((key) =>
  otherChangeKeys.has(key),
);
if (collisions.length > 0) {
  throw new Error(
    `iOS 11 prerelease change keys collide with existing content: ${collisions
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
const routeRows = eventSpecs
  .map(
    (spec) =>
      `| iOS | ${spec.label} | \`${spec.alias}\` | ${spec.changes.length} |`,
  )
  .join("\n");

const md = `# Apple iOS 11 prerelease archive batch

## Result

\`${outputName}\` is the reviewed overlay for seven existing iOS 11.0
prerelease routes. It combines a preserved Apple-authored Beta 1 image, a
complete Apple-authored Beta 2 transcript, and byte-verifiable Apple Developer
PDFs for Beta 3 through Beta 7.

- ${events.length} substantive event overlays and no release-version overlays
- ${changeCount} milestone-specific occurrences across
  ${uniqueLocalChangeKeys.length} stable, collision-checked definitions
- ${sources.length} declared and used sources with ${citationCount} citation
  references
- zero builds, build-number claims, route creation, Public-route changes, or
  community-observation changes
- every event is \`editoriallyVerified\`, approved at \`${reviewedAt}\`, and
  \`isIndexable: true\`

## Reviewed route closure

| Platform | Milestone | Existing alias | Selected changes |
| --- | --- | --- | ---: |
${routeRows}

The seven other iOS 11.0 milestones remain outside the manifest.

## Evidence method

1. Beta 1 is an Apple-authored composite image retained by Redmond Pie. Selection
   is limited to seven issue-bearing records beneath exact New Features headings.
2. Beta 2 survives as a complete Apple-authored transcript beneath a clearly
   bounded release-note heading on 9to5Mac. Only four records that explicitly
   identify Beta 2 or compare it with Beta 1 are retained. Publisher-authored
   discoveries are excluded.
3. Beta 3 has 183 distinct issue identifiers versus 182 in the Beta 2 transcript.
   Sixteen identifiers occur in Beta 3 but not Beta 2; those exact component and
   status records form the Beta 3 selection.
4. Beta 4 through Beta 7 use adjacent-state comparisons over normalized record
   text, component, Apple status heading, and issue identifier. Carried records,
   line-wrap changes, and grammar-only edits are excluded.
5. Beta 8 and Beta 10 PDFs were also audited. Beta 8 is semantically identical to
   Beta 7 after pagination normalization, while the complete Beta 10 note body is
   byte-for-byte text-identical to Beta 8. Those routes therefore receive no
   invented structured change.

## Raw evidence ledger

| State | Public artifact | Pages or dimensions | Bullets | Distinct issue IDs | SHA-256 | Use |
| --- | --- | ---: | ---: | ---: | --- | --- |
| Beta 1 | Redmond Pie composite of Apple notes | 600×9,426 px | not asserted | not asserted | \`b6264488634bfdaec3f23183e565db8fe3fabf4565e8df9609b95a4d0f115d90\` | Seven exact New Features records |
| Beta 2 | 9to5Mac Apple-note transcript HTML | complete transcript | not asserted | 182 | \`7f3e2620a52821f050e5a53c5f9560b025276f54cce8e81464580f1777826a67\` | Four self-identifying records and Beta 3 boundary |
| Beta 3 | Apple Developer PDF mirror | 21 | 196 | 183 | \`757a79972d5ca81528320de73da8e60e2ec56c705968619948aed197699cb02e\` | 16 identifier additions |
| Beta 4 | Apple Developer PDF mirror | 22 | 206 | 192 | \`91621db35343b59c3c9f2ad51d4267cdd884445d00f98ef032e8f79adcf6d494\` | 22 semantic additions or transitions |
| Beta 5 | Apple Developer PDF mirror | 23 | 215 | 200 | \`21af50f7fcc3e382af83d20dd6a02dedca0813aacb0281ad0096b22664f159fe\` | 18 semantic additions or transitions |
| Beta 6 | Apple Developer PDF mirror | 23 | 218 | 203 | \`d3ea6612d158e723e97afd5f8c2bb580d683da4c0a65cb0f2aeabed9572a44f2\` | 15 semantic additions or transitions |
| Beta 7 | Apple Developer PDF mirror | 23 | 221 | 204 | \`8480a2c5f33f8e365ce6ebf67c0f66d618565df550a24f3f392f3e0e0123251c\` | Three semantic additions or transitions |
| Beta 8 | Apple Developer PDF mirror; two byte-identical mirrors | 23 | 221 | 204 | \`5a8dcf0a477f175b793cc5210dc47e50cfc5f8cf987f413e798c34a94e5c181b\` | Evidence gap: no semantic note delta from Beta 7 |
| Beta 10 | Apple Developer PDF mirror | 23 | 221 | 204 | \`1bcab8180b5bc7200058b57195ed1a9c7b0d253132bcc91aeeb2c9ba7807c5e0\` | Evidence gap: note body identical to Beta 8 |
| Final archive | Apple iOS 11 SDK archive, revision \`iOS1100 - IRN1\` | HTML | not asserted | not asserted | \`b7e9368fc21e3e0f5c53a3f2c7052ad984dddee9fb6647743881eb0943074512\` | Final-state boundary only |

The Beta 5 current MacRumors attachment and its Internet Archive replay are
byte-identical. Beta 8’s MacRumors attachment and iPhoneTricks archive replay are
also byte-identical. PDF hashes cover the complete original bytes downloaded on
${accessedAt}; the Beta 1 and Beta 2 hashes cover the retained image and fetched
HTML response respectively.

## Exact evidence gaps

- Beta 2 Update and Public Beta 1 share the June 26 seed/build identity in the
  local timeline, but no separate Apple-authored note state isolates either
  route. Both remain timeline-only.
- Beta 8 has a titled Apple PDF, but its semantic note body repeats Beta 7.
- No complete Beta 9 Apple note state was found. The route remains timeline-only.
- Beta 10 has a titled Apple PDF, but its note body is identical to Beta 8. The
  missing Beta 9 state prevents an adjacent-state claim beyond that exact
  equality.
- No separate GM Apple note document was found. Apple’s final archive is dated
  Public release day and is not back-attributed to GM.
- Public is already owned by \`apple-ios-11.json\` and is untouched.
- No build number is taken from publisher prose, forum posts, or unavailable
  Apple download pages.
- Apple’s Beta 7 document assigns issue \`30567424\` to both the new Classroom
  record and a carried CloudKit record. The Classroom occurrence is retained
  with an exact component locator; no global uniqueness is claimed for Apple’s
  internal identifiers.

## Copyright and attribution controls

- All article, title, summary, and canonical-summary fields are original
  synthesis.
- Apple-authored source documents are linked, titled, and credited; no PDF,
  transcript, screenshot, or long source excerpt is checked into the repository.
- Publisher-written feature lists and forum observations are excluded.
- The raw documents are used as factual evidence for component, status, issue ID,
  and milestone boundaries, not republished as substitute copies.

## Source ledger

All declared sources were accessed on ${accessedAt}.

${sourceLedger}

Additional audited but non-manifest evidence:

- [iOS 11 beta 8 Release Notes](${U.beta8}) — Apple Developer PDF mirrored by
  MacRumors Forums.
- [iOS 11 beta 10 Release Notes](${U.beta10}) — Apple Developer PDF mirrored by
  MacRumors Forums.

## Closure guards

- Exact comparison against the local iOS 11.0 seed record and all 14 milestones
- Exact seven-route allowlist with Public and every unsupported prerelease route
  excluded
- Zero versions, zero builds, and zero unsupported route mutations
- Collision scan across every other research-batch JSON plus
  \`apple-launch-content-2026.json\`
- ${changeCount} occurrences resolve to exactly
  ${uniqueLocalChangeKeys.length} stable local definitions
- 84 issue-bearing occurrences plus one exact, issue-less Beta 5 Messages
  removal
- Complete unique source declaration/use closure
- Deterministic formatted JSON SHA-256: \`${jsonSha}\`

## Publication and validation record

The generator's route, collision, review-state, evidence-boundary, source, and
citation guards pass before either artifact is written.

Independent editorial and evidence review:

- all seven event articles and all ${changeCount} occurrences are
  \`editoriallyVerified\`, were approved at \`${reviewedAt}\`, and are indexable
- the 600×9,426 Beta 1 image reproduced its recorded SHA-256 and all
  ${verification.beta1LocatorAssertions} selected component, status, and issue
  locators were checked against the visible Apple-authored document
- the ${verification.beta2HtmlBytes.toLocaleString("en-US")}-byte Beta 2 HTML
  response reproduced its recorded SHA-256, contains
  ${verification.beta2DistinctIssueIds} distinct issue identifiers, and all
  ${verification.beta2LocatorAssertions} milestone-specific selections
  reconciled
- the Beta 3 through Beta 8 and Beta 10 downloads reproduced every PDF hash in
  the raw ledger; all ${verification.laterDeltaAssertions} selected Beta 3–7
  delta records matched their exact component, status, and issue entries
- adjacent-state parsing returned 24 candidate Beta 4 rows and 20 candidate
  Beta 5 rows; the four excluded records are the documented carried or
  wording-only edits, leaving 22 and 18 substantive selections
- Beta 8 produced zero semantic rows against Beta 7, and Beta 10 produced zero
  against Beta 8
- Apple's final archive reproduced its recorded SHA-256 and exact
  \`iOS1100 - IRN1\` revision marker
- the independent copyright scan found a maximum contiguous reader-facing
  overlap of ${verification.maximumEditorialOverlapWords} words

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
- all seven patches targeted the exact existing Beta 1–7 route documents and
  set only article, change, citation, approved review, provenance, summary, and
  indexability fields
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

All seven published routes were fetched independently from the running local
site. Every response returned its full archival article, all expected structured
change titles, References, and its primary source. No response returned
placeholder copy or a \`noindex\` directive.

| Canonical route | HTTP | Full article | Expected changes | References | Primary source | Placeholder | Noindex |
| --- | ---: | --- | --- | --- | --- | --- | --- |
| \`/apple/ios/11.0/beta-1/\` | 200 | yes | 7/7 | yes | yes | no | no |
| \`/apple/ios/11.0/beta-2/\` | 200 | yes | 4/4 | yes | yes | no | no |
| \`/apple/ios/11.0/beta-3/\` | 200 | yes | 16/16 | yes | yes | no | no |
| \`/apple/ios/11.0/beta-4/\` | 200 | yes | 22/22 | yes | yes | no | no |
| \`/apple/ios/11.0/beta-5/\` | 200 | yes | 18/18 | yes | yes | no | no |
| \`/apple/ios/11.0/beta-6/\` | 200 | yes | 15/15 | yes | yes | no | no |
| \`/apple/ios/11.0/beta-7/\` | 200 | yes | 3/3 | yes | yes | no | no |

Final verification on ${accessedAt}:

- \`npm run research:validate\`:
  ${verification.researchBatches} batches validated; this batch reports
  ${events.length} events, ${changeCount} change occurrences,
  ${sources.length} sources, and ${citationCount} citation references;
  ${verification.globalChangeKeys.toLocaleString("en-US")} change keys remain
  globally consistent
- full repository suite: ${verification.fullTests} tests passed
- focused ingestion and manifest suite: ${verification.focusedTests} tests
  passed
- all ${changeCount} selected source locators and adjacent-state assertions
  reconciled
- independent copyright-similarity scan: maximum contiguous overlap of
  ${verification.maximumEditorialOverlapWords} words
- ESLint, Prettier check, and focused \`git diff --check\`: passed
- deterministic regeneration: the formatted JSON SHA-256 remained
  \`${jsonSha}\`
- final production dry run reproduced
  ${publication.immediateZeroCreates} creates,
  ${publication.immediateZeroPatches} patches,
  ${publication.immediateZeroUnchanged.toLocaleString("en-US")} unchanged
  documents, the ${publication.immediateZeroPayloadBytes}-byte payload, and
  plan SHA \`${publication.immediateZeroPlanSha}\`
- the final planner reported “No Sanity data changed”

Reproduce with:

\`\`\`sh
node scripts/research-batches/build-apple-ios-11-prerelease.mjs
npm run research:validate
node --import tsx --test tests/launch-content-ingestion.test.ts tests/launch-content-manifest.test.ts
npx eslint scripts/research-batches/build-apple-ios-11-prerelease.mjs
npx prettier --check scripts/research-batches/build-apple-ios-11-prerelease.mjs scripts/research-batches/apple-ios-11-prerelease.json scripts/research-batches/apple-ios-11-prerelease.md
npx sanity exec scripts/ingest-launch-content.ts --with-user-token -- --content scripts/research-batches/apple-ios-11-prerelease.json
\`\`\`

The final command is intentionally a post-publication dry run and must
reproduce the zero plan above. Do not add \`--apply\`.
`;

const formattedMd = await prettier.format(md, { filepath: ledgerName });
writeFileSync(join(here, ledgerName), formattedMd);
