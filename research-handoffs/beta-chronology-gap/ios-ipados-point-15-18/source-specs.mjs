import path from "node:path";

const spec = (
  sourceId,
  publisher,
  {
    canonicalUrl = null,
    fetchUrl = canonicalUrl,
    localReusePath,
    sourceClass = "contemporaneousSecondary",
    roles = [
      "platformApplicability",
      "exactVersion",
      "publicChannel",
      "publicOrdinal",
      "appearanceDate",
    ],
    note =
      "Contemporary release reporting retained as claim-level chronology evidence.",
    lineageIndependent = true,
  } = {},
) => ({
  sourceId,
  publisher,
  canonicalUrl,
  fetchUrl,
  ...(localReusePath ? {localReusePath} : {}),
  sourceClass,
  roles,
  note,
  lineageIndependent,
});

const versionSlug = (version) => version.replaceAll(".", "-");
const mrId = (filename) =>
  `mr-${path.basename(filename, ".html").replaceAll(/[^a-z0-9-]+/gi, "-")}`;

const iCultureVersions = [
  "15.1",
  "15.2",
  "15.3",
  "15.4",
  "15.5",
  "15.6",
  "16.1",
  "16.2",
  "16.4",
  "16.5",
  "16.6",
  "17.2",
  "17.3",
  "17.4",
  "17.5",
  "17.6",
  "18.1",
  "18.2",
  "18.3",
  "18.4",
  "18.5",
];

const iCultureSpecs = iCultureVersions.map((version) =>
  spec(`iculture-ios-${versionSlug(version)}`, "iCulture", {
    canonicalUrl: `https://www.iculture.nl/nieuws/ios-${versionSlug(version)}-beta/`,
    localReusePath:
      `tmp/research-evidence/beta-chronology-gap/ios-ipados-point-15-18/raw/iculture-ios-${versionSlug(version)}-beta.html`,
    sourceClass: "contemporaneousLivingChronology",
    note:
      "Living Dutch iOS/iPadOS cycle timeline. Developer/public mix-ups, ordinal errors, omissions, and local-calendar differences are retained in conflicts.json and never silently treated as selected-date evidence.",
  }),
);

// Retained MacRumors pages were captured by the preceding research wave. Their
// canonical URLs are read from the pages at freeze time.
const localMrFiles = [
  "apple-first-ios-15-6-public-beta.html",
  "apple-ios-16-1-ipados-16-1-new-public-betas.html",
  "apple-ios-18-5-public-beta-2.html",
  "apple-releases-first-public-beta-of-ios-17-6.html",
  "apple-releases-ios-15-3-public-beta-2.html",
  "apple-releases-ios-16-2-public-beta-1.html",
  "apple-releases-ios-16-2-public-beta-2.html",
  "apple-releases-ios-16-4-public-beta-3.html",
  "apple-releases-ios-16-5-public-beta-2.html",
  "apple-releases-ios-16-6-public-beta-4.html",
  "apple-releases-ios-17-4-public-beta.html",
  "apple-releases-ios-17-5-public-beta-1.html",
  "apple-releases-ios-17-6-public-beta-2.html",
  "apple-releases-ios-17-6-public-beta-3.html",
  "apple-releases-ios-18-1-public-beta-2.html",
  "apple-releases-ios-18-5-public-beta.html",
  "apple-releases-second-public-beta-of-ios-17-5.html",
  "apple-releases-third-public-beta-of-ios-17-5.html",
  "apple-seeds-first-ios-15-1-public-beta.html",
  "apple-seeds-first-ios-15-4-public-beta.html",
  "apple-seeds-first-ios-16-1-public-beta.html",
  "apple-seeds-first-ios-16-4-public-beta.html",
  "apple-seeds-first-ios-18-1-public-beta.html",
  "apple-seeds-ios-15-1-public-beta-2.html",
  "apple-seeds-ios-15-2-public-beta-2.html",
  "apple-seeds-ios-15-3-public-beta-1.html",
  "apple-seeds-ios-15-4-public-beta-3.html",
  "apple-seeds-ios-15-5-public-beta-1.html",
  "apple-seeds-ios-15-5-public-beta-2.html",
  "apple-seeds-ios-15-6-public-beta-2.html",
  "apple-seeds-ios-16-1-public-beta-2.html",
  "apple-seeds-ios-16-4-public-beta-2.html",
  "apple-seeds-ios-16-5-public-beta-3.html",
  "apple-seeds-ios-16-6-public-beta-2.html",
  "apple-seeds-ios-16-6-public-beta-3.html",
  "apple-seeds-ios-16-public-beta-5.html",
  "apple-seeds-ios-16-public-beta-5.html",
  "apple-seeds-ios-17-2-public-beta-1.html",
  "apple-seeds-ios-17-2-public-beta-3.html",
  "apple-seeds-ios-17-3-public-beta-1.html",
  "apple-seeds-ios-17-3-public-beta-3.html",
  "apple-seeds-ios-17-4-public-beta-2.html",
  "apple-seeds-ios-17-4-public-beta-3.html",
  "apple-seeds-ios-18-3-public-beta-2.html",
  "apple-seeds-ios-18-4-public-beta-2.html",
  "apple-seeds-ios-18-4-public-beta-3.html",
  "apple-seeds-ios-18-4-public-beta.html",
  "ios-15-2-public-beta-now-available.html",
  "ios-15-4-public-beta-2.html",
  "ios-15-6-public-beta-3.html",
  "ios-16-2-public-beta-3.html",
  "ios-16-5-public-beta-1.html",
  "ios-16-6-public-beta-1.html",
  "ios-17-2-public-beta-2.html",
  "ios-18-2-first-public-beta.html",
  "ios-18-2-public-beta-2.html",
  "ios-18-3-public-beta-1.html",
].map((filename) =>
  spec(mrId(filename), "MacRumors", {
    localReusePath: `/tmp/macrumors-public-pages/${filename}`,
    sourceClass: "contemporaneousSecondary",
    note:
      "Contemporary MacRumors public-beta report retained from the prior capture wave; canonical URL is extracted from the page.",
  }),
);

export const nineToFivePostIds = {
  "15.1:1": 755671,
  "15.1:2": 757220,
  "15.1:3": 759295,
  "15.1:4": 760883,
  "15.2:1": 764825,
  "15.2:2": 768066,
  "15.2:3": 769491,
  "15.2:4": 772903,
  "15.3:1": 776218,
  "15.3:2": 780512,
  "15.4:1": 784130,
  "15.4:2": 785261,
  "15.4:3": 787284,
  "15.4:4": 788721,
  "15.4:5": 789925,
  "15.5:1": 793189,
  "15.5:2": 798787,
  "15.5:3": 801280,
  "15.5:4": 802898,
  "15.6:1": 806596,
  "15.6:2": 808779,
  "15.6:3": 813264,
  "15.6:4": 816544,
  "15.6:5": 818184,
  "16.1:2": 837526,
  "16.1:3": 838834,
  "16.1:4": 839952,
  "16.1:5": 841347,
  "16.2:1": 844840,
  "16.2:2": 847251,
  "16.2:3": 848573,
  "16.2:4": 851228,
  "16.4:1": 865679,
  "16.4:2": 868333,
  "16.4:3": 869766,
  "16.4:4": 870787,
  "16.5:1": 873834,
  "16.5:2": 876118,
  "16.5:3": 878708,
  "16.5:4": 880083,
  "16.6:1": 883561,
  "16.6:2": 886152,
  "16.6:3": 891082,
  "16.6:4": 893593,
  "16.6:5": 895835,
  "17.2:1": 915819,
  "17.2:2": 916850,
  "17.2:3": 919281,
  "17.2:4": 921273,
  "17.3:1": 923482,
  "17.3:3": 927399,
  "17.4:1": 929760,
  "17.4:2": 932549,
  "17.4:3": 933563,
  "17.4:4": 934807,
  "17.5:1": 940841,
  "17.5:2": 942982,
  "17.5:3": 944434,
  "17.5:4": 945969,
  "17.6:1": 955170,
  "17.6:2": 956834,
  "17.6:3": 957908,
  "17.6:4": 958826,
  "18.1:3:ios": 972441,
  "18.1:3:ipados": 972445,
  "18.1:4": 973272,
  "18.2:1": 977015,
  "18.2:2:ios": 977895,
  "18.2:2:ipados": 977898,
  "18.2:3": 979265,
  "18.3:1:ios": 982971,
  "18.3:1:ipados": 982969,
  "18.3:2:ios": 985034,
  "18.3:2:ipados": 985033,
  "18.3:3": 985862,
  "18.4:1:ios": 991620,
  "18.4:1:ipados": 991629,
  "18.4:2:ios": 992701,
  "18.4:2:ipados": 992707,
  "18.4:3:ios": 993708,
  "18.4:3:ipados": 993717,
  "18.4:4": 994308,
  "18.5:1:ios": 996491,
  "18.5:1:ipados": 996487,
  "18.5:2": 998516,
  "18.5:3": 999095,
  "17.3:withdrawn": 926341,
};

const nineToFiveSpecs = [
  ...new Set(Object.values(nineToFivePostIds)),
].map((postId) =>
  spec(`9to5-${postId}`, "9to5Mac", {
    fetchUrl:
      `https://9to5mac.com/wp-json/wp/v2/posts/${postId}?_fields=id,date,modified,link,title,content`,
    sourceClass: "contemporaneousSecondaryApiCapture",
    note:
      "Contemporary 9to5Mac report frozen through the site's public WordPress API. Candidate routing uses it only when the retained article explicitly supports that platform and public appearance.",
  }),
);

const freshSpecs = [
  spec("apple-ios15-updates", "Apple", {
    canonicalUrl: "https://support.apple.com/en-us/108051",
    sourceClass: "officialStableReleaseChronology",
    roles: ["stableReleaseBoundary", "patchApplicabilityAudit"],
    note:
      "Apple's official iOS 15 release chronology establishes the modeled patch releases and stable terminal boundaries; absence from this page alone is not treated as proof that no beta existed.",
  }),
  spec("apple-ios16-updates", "Apple", {
    canonicalUrl: "https://support.apple.com/en-us/101566",
    sourceClass: "officialStableReleaseChronology",
    roles: ["stableReleaseBoundary", "patchApplicabilityAudit"],
    note:
      "Apple's official iOS 16 release chronology establishes the modeled patch releases and stable terminal boundaries; absence from this page alone is not treated as proof that no beta existed.",
  }),
  spec("apple-ios17-updates", "Apple", {
    canonicalUrl: "https://support.apple.com/en-us/118723",
    sourceClass: "officialStableReleaseChronology",
    roles: ["stableReleaseBoundary", "patchApplicabilityAudit"],
    note:
      "Apple's official iOS 17 release chronology establishes the modeled patch releases and stable terminal boundaries; absence from this page alone is not treated as proof that no beta existed.",
  }),
  spec("apple-ios18-updates", "Apple", {
    canonicalUrl: "https://support.apple.com/en-us/121161",
    sourceClass: "officialStableReleaseChronology",
    roles: ["stableReleaseBoundary", "patchApplicabilityAudit"],
    note:
      "Apple's official iOS 18 release chronology establishes the modeled patch releases and stable terminal boundaries; absence from this page alone is not treated as proof that no beta existed.",
  }),
  spec("apple-security-ios-ipados-15-7", "Apple", {
    canonicalUrl: "https://support.apple.com/en-us/102837",
    sourceClass: "officialStableReleaseRecord",
    roles: ["stableReleaseBoundary", "platformApplicability"],
    note:
      "Apple's official security record establishes the September 12, 2022 final release of both iOS 15.7 and iPadOS 15.7.",
  }),
  spec("appleinsider-ios-ipados-15-7-rc", "AppleInsider", {
    canonicalUrl:
      "https://appleinsider.com/articles/22/09/07/apple-provides-ios-157-ipados-157-macos-126-betas-to-testers",
    sourceClass: "contemporaneousReleaseCandidateReport",
    roles: ["releaseCandidateBoundary", "platformApplicability"],
    note:
      "Contemporary report identifies the September 7 iOS 15.7 and iPadOS 15.7 seeds as release candidates. Its generic beta wording is not promoted to a numbered public-beta identity.",
  }),
  spec("9to5-ios-15-7-beta1-label", "9to5Mac", {
    canonicalUrl:
      "https://9to5mac.com/2022/09/07/ios-15-7-beta-1-now-available/",
    sourceClass: "contemporaneousConflictingLabel",
    roles: ["conflict", "releaseCandidateBoundary"],
    note:
      "Contemporary headline labels the September 7 seed beta 1. It is retained as conflicting terminology because release-candidate and final-release evidence identifies this as the terminal RC build, not a separately established Public Beta 1.",
  }),
  spec("iclarified-ios-ipados-16-7-rc", "iClarified", {
    canonicalUrl:
      "https://www.iclarified.com/91392/apple-releases-ios-167-rc-and-ipados-167-rc-to-developers-download/amp",
    sourceClass: "contemporaneousReleaseCandidateReport",
    roles: ["releaseCandidateBoundary", "platformApplicability"],
    note:
      "Contemporary report identifies the first observed iOS/iPadOS 16.7 seed as a release candidate distributed to developers.",
  }),
  spec("iclarified-ios-ipados-17-7-rc", "iClarified", {
    canonicalUrl:
      "https://www.iclarified.com/94839/apple-releases-ios-177-rc-and-ipados-177-rc-download",
    sourceClass: "contemporaneousReleaseCandidateReport",
    roles: ["releaseCandidateBoundary", "platformApplicability"],
    note:
      "Contemporary report identifies the first observed iOS/iPadOS 17.7 seed as a release candidate distributed to developers.",
  }),
  spec("9to5-ios-18-7-public-label", "9to5Mac", {
    canonicalUrl:
      "https://9to5mac.com/2025/09/09/apple-rolls-out-betas-for-ios-18-7-macos-15-7-and-macos-14-8/",
    sourceClass: "contemporaneousConflictingLabel",
    roles: ["conflict", "apparentPublicDistribution"],
    note:
      "Contemporary report calls build 22H20 an iOS 18.7 public beta. RC and final build records show that the same build is the release candidate/final build, so no separately numbered Public Beta 1 identity is proposed.",
  }),
  spec("ipswdev-ios-ipados-18-7-rc", "IPSW.dev", {
    canonicalUrl: "https://ipsw.dev/build/22H20",
    sourceClass: "retrospectiveBuildIndex",
    roles: ["releaseCandidateBoundary", "buildIdentity"],
    note:
      "Build index identifies 22H20 as the September 9, 2025 iOS/iPadOS 18.7 release candidate. It is used to disambiguate a publisher's generic public-beta label, not to infer a public ordinal.",
  }),
  spec("kobonemi-ios-ipados-15-1-pb4", "Kobonemi", {
    canonicalUrl:
      "https://www.kobonemi.com/entry/2021/10/14/iOS-15.1-and-iPadOS-15.1-Public-Beta-4",
    note:
      "Japanese contemporary report explicitly identifies iOS and iPadOS 15.1 Public Beta 4. Its October 14 JST publication normalizes to October 13 in America/Los_Angeles.",
  }),
  spec("macerkopf-ios-ipados-15-1-pb4", "Macerkopf", {
    canonicalUrl:
      "https://www.macerkopf.de/2021/10/13/ios-15-1-ipados-15-1-beta-4-ist-da/",
  }),
  spec("osxd-ios-ipados-15-5-pb4", "OS X Daily", {
    canonicalUrl:
      "https://osxdaily.com/2022/05/03/beta-4-of-macos-monterey-12-4-ios-15-5-pados-15-5-available-for-testing/",
  }),
  spec("osxd-ios-ipados-15-5-pb3", "OS X Daily", {
    canonicalUrl:
      "https://osxdaily.com/2022/04/26/beta-3-of-ios-15-5-ipados-15-5-macos-monterey-12-4-released-for-testing/",
    note:
      "Contemporary report explicitly identifies iOS and iPadOS 15.5 beta 3 as available to both developer- and public-beta testers.",
  }),
  spec("ithinkdiff-ios-ipados-15-6-cycle", "iThinkDifferent", {
    canonicalUrl:
      "https://www.ithinkdiff.com/ios-15-6-ipados-15-6-beta/",
    sourceClass: "contemporaneousLivingChronology",
  }),
  spec("iclarified-ios-ipados-16-6-pb2", "iClarified", {
    canonicalUrl:
      "https://www.iclarified.com/90770/apple-releases-second-public-beta-of-ios-166-ipados-166-macos-135-download",
  }),
  spec("osxd-ios-ipados-16-2-pb4", "OS X Daily", {
    canonicalUrl:
      "https://osxdaily.com/2022/12/01/beta-4-of-ios-16-2-ipados-16-2-and-macos-ventura-13-1-available-for-testing/",
  }),
  spec("osxd-ios-ipados-17-5-pb3", "OS X Daily", {
    canonicalUrl:
      "https://osxdaily.com/2024/04/24/beta-3-of-ios-17-5-macos-sonoma-14-5-ipados-17-5-available-for-testing/",
    note:
      "Contemporary report explicitly identifies iOS and iPadOS 17.5 beta 3 as available to both developer- and public-beta testers.",
  }),
  spec("osxd-ios-ipados-17-5-pb4", "OS X Daily", {
    canonicalUrl:
      "https://osxdaily.com/2024/04/30/beta-4-of-macos-sonoma-14-5-ios-17-5-ipados-17-5-available-for-testing/",
    note:
      "Contemporary report explicitly identifies iOS and iPadOS 17.5 beta 4 as available through both beta programs.",
  }),
  spec("mactrast-ios-ipados-17-6-pb4", "MacTrast", {
    canonicalUrl:
      "https://www.mactrast.com/2024/07/apple-seeds-fourth-betas-of-ios-17-6-and-ipados-17-6-to-developers-and-public-beta-testers/",
  }),
  spec("monomaniac-april-2025", "Monomaniac Garage", {
    canonicalUrl: "https://www.monomaniacgarage.com/2025/04/",
    sourceClass: "contemporaneousTesterInstallChronology",
    note:
      "Japanese first-person installation posts explicitly identify iOS and iPadOS 18.5 Public Beta 3 build 22F5068a. April 29 JST represents April 28 in America/Los_Angeles.",
  }),
  spec("kobonemi-ios-ipados-18-3-pb3", "Kobonemi", {
    canonicalUrl:
      "https://www.kobonemi.com/entry/2025/01/15/iOS-18.3-and-iPadOS-18.3-and-macOS-15.3-and-tvOS-18.3-and-visionOS-2.3-and-watchOS-11.3-Beta-3",
    note:
      "Japanese contemporary report explicitly identifies the third public betas of iOS and iPadOS 18.3. Its January 16 JST update normalizes to January 15 or 16 in America/Los_Angeles only when the retained timestamp supports that conversion; the selected candidate date remains qualified by the independent Pacific-time report.",
  }),
  spec("kobonemi-ios-ipados-18-4-pb4", "Kobonemi", {
    canonicalUrl:
      "https://www.kobonemi.com/entry/2025/03/18/iOS-18.4-and-iPadOS-18.4-and-macOS-15.4-and-tvOS-18.4-and-visionOS-2.4-and-watchOS-11.4-Beta-4",
    note:
      "Japanese contemporary report explicitly identifies the fourth public betas of iOS and iPadOS 18.4. Its March 18 JST publication normalizes to March 17 in America/Los_Angeles.",
  }),
  spec("imore-ipados16-history", "iMore", {
    canonicalUrl:
      "https://www.imore.com/how-download-ipados-16-public-beta",
    sourceClass: "contemporaneousLivingChronology",
    note:
      "Rolling iPadOS 16 public-beta history retained for the 16/16.1 campaign-numbering conflict.",
  }),
  spec("appleinsider-ipados16-1-aug24", "AppleInsider", {
    canonicalUrl:
      "https://appleinsider.com/articles/22/08/24/apple-releases-new-round-of-public-betas-for-ios-16-tvos-16-watchos-9-ipados-161",
  }),
  spec("appleinsider-ipados16-1-oct4", "AppleInsider", {
    canonicalUrl:
      "https://appleinsider.com/articles/22/10/04/apple-seeds-fourth-ios-161-and-tvos-161-fifth-ipados-161-betas-to-developers",
    sourceClass: "contemporaneousConflictContext",
    note:
      "Contemporary report used only to preserve the iPadOS 16.1 campaign-numbering conflict: it labels the October 4 developer appearance as iPadOS 16.1 beta 5 while public chronologies use a different ordinal.",
  }),
  spec("telegram-applepro-ios-ipados-18-1-pb4", "Apple Pro Daily News", {
    canonicalUrl: "https://t.me/s/aaplpro/23258",
    sourceClass: "contemporaneousChannelPost",
    note:
      "Contemporary post explicitly lists iOS and iPadOS 18.1 Public Beta 4 build 22B5075a.",
  }),
  spec("mr-ios-ipados-15-6-pb5", "MacRumors", {
    canonicalUrl:
      "https://www.macrumors.com/2022/07/05/apple-seeds-ios-15-6-beta-5-to-developers/",
  }),
  spec("mr-ios-16-1-pb4", "MacRumors", {
    canonicalUrl:
      "https://www.macrumors.com/2022/10/04/apple-seeds-ios-16-1-beta-4-to-developers/",
  }),
  spec("mr-ios-16-1-pb5", "MacRumors", {
    canonicalUrl:
      "https://www.macrumors.com/2022/10/11/apple-seeds-ios-16-1-beta-5-to-developers/",
  }),
  spec("mr-ios-ipados-16-2-pb4", "MacRumors", {
    canonicalUrl: "https://www.macrumors.com/2022/12/01/ios-16-2-beta-4/",
  }),
  spec("mr-ios-ipados-16-6-pb5", "MacRumors", {
    canonicalUrl:
      "https://www.macrumors.com/2023/07/10/apple-seeds-ios-16-6-beta-5-to-developers/",
  }),
  spec("mr-ios-ipados-17-2-pb4", "MacRumors", {
    canonicalUrl:
      "https://www.macrumors.com/2023/11/28/apple-releases-ios-17-2-beta-4/",
  }),
  spec("mr-ios-ipados-17-5-pb4", "MacRumors", {
    canonicalUrl:
      "https://www.macrumors.com/2024/04/30/ios-17-5-beta-4-developers/",
  }),
  spec("mr-ios-ipados-18-1-pb4", "MacRumors", {
    canonicalUrl:
      "https://www.macrumors.com/2024/10/14/apple-seeds-seventh-developer-beta-ios-18-1/",
  }),
  spec("mr-ios-ipados-18-2-pb3", "MacRumors", {
    canonicalUrl:
      "https://www.macrumors.com/2024/11/20/apple-ios-18-2-fourth-beta/",
  }),
  spec("mr-ios-ipados-18-3-pb3", "MacRumors", {
    canonicalUrl:
      "https://www.macrumors.com/2025/01/16/apple-seeds-ios-18-3-beta-3/",
  }),
  spec("mr-ios-ipados-18-4-pb4", "MacRumors", {
    canonicalUrl:
      "https://www.macrumors.com/2025/03/17/apple-seeds-ios-18-4-beta-4/",
  }),
  spec("mr-ios-ipados-18-5-pb3", "MacRumors", {
    canonicalUrl:
      "https://www.macrumors.com/2025/04/28/apple-seeds-ios-18-5-beta-4/",
  }),
  spec("mr-ios-ipados-17-3-beta2-withdrawn", "MacRumors", {
    canonicalUrl:
      "https://www.macrumors.com/2024/01/03/apple-pulls-ios-17-3-beta-2/",
    roles: ["withdrawal", "negativePublicBoundary"],
  }),
];

const exactMrFiles = {
  "15.1:1": "apple-seeds-first-ios-15-1-public-beta.html",
  "15.1:2": "apple-seeds-ios-15-1-public-beta-2.html",
  "15.2:1": "ios-15-2-public-beta-now-available.html",
  "15.2:2": "apple-seeds-ios-15-2-public-beta-2.html",
  "15.3:1": "apple-seeds-ios-15-3-public-beta-1.html",
  "15.3:2": "apple-releases-ios-15-3-public-beta-2.html",
  "15.4:1": "apple-seeds-first-ios-15-4-public-beta.html",
  "15.4:2": "ios-15-4-public-beta-2.html",
  "15.4:3": "apple-seeds-ios-15-4-public-beta-3.html",
  "15.5:1": "apple-seeds-ios-15-5-public-beta-1.html",
  "15.5:2": "apple-seeds-ios-15-5-public-beta-2.html",
  "15.6:1": "apple-first-ios-15-6-public-beta.html",
  "15.6:2": "apple-seeds-ios-15-6-public-beta-2.html",
  "15.6:3": "ios-15-6-public-beta-3.html",
  "16.1:1": "apple-seeds-first-ios-16-1-public-beta.html",
  "16.1:2": "apple-seeds-ios-16-1-public-beta-2.html",
  "16.2:1": "apple-releases-ios-16-2-public-beta-1.html",
  "16.2:2": "apple-releases-ios-16-2-public-beta-2.html",
  "16.2:3": "ios-16-2-public-beta-3.html",
  "16.4:1": "apple-seeds-first-ios-16-4-public-beta.html",
  "16.4:2": "apple-seeds-ios-16-4-public-beta-2.html",
  "16.4:3": "apple-releases-ios-16-4-public-beta-3.html",
  "16.5:1": "ios-16-5-public-beta-1.html",
  "16.5:2": "apple-releases-ios-16-5-public-beta-2.html",
  "16.5:3": "apple-seeds-ios-16-5-public-beta-3.html",
  "16.6:1": "ios-16-6-public-beta-1.html",
  "16.6:2": "apple-seeds-ios-16-6-public-beta-2.html",
  "16.6:3": "apple-seeds-ios-16-6-public-beta-3.html",
  "16.6:4": "apple-releases-ios-16-6-public-beta-4.html",
  "17.2:1": "apple-seeds-ios-17-2-public-beta-1.html",
  "17.2:2": "ios-17-2-public-beta-2.html",
  "17.2:3": "apple-seeds-ios-17-2-public-beta-3.html",
  "17.3:1": "apple-seeds-ios-17-3-public-beta-1.html",
  "17.3:3": "apple-seeds-ios-17-3-public-beta-3.html",
  "17.4:1": "apple-releases-ios-17-4-public-beta.html",
  "17.4:2": "apple-seeds-ios-17-4-public-beta-2.html",
  "17.4:3": "apple-seeds-ios-17-4-public-beta-3.html",
  "17.5:1": "apple-releases-ios-17-5-public-beta-1.html",
  "17.5:2": "apple-releases-second-public-beta-of-ios-17-5.html",
  "17.5:3": "apple-releases-third-public-beta-of-ios-17-5.html",
  "17.6:1": "apple-releases-first-public-beta-of-ios-17-6.html",
  "17.6:2": "apple-releases-ios-17-6-public-beta-2.html",
  "17.6:3": "apple-releases-ios-17-6-public-beta-3.html",
  "18.1:1": "apple-seeds-first-ios-18-1-public-beta.html",
  "18.1:2": "apple-releases-ios-18-1-public-beta-2.html",
  "18.2:1": "ios-18-2-first-public-beta.html",
  "18.2:2": "ios-18-2-public-beta-2.html",
  "18.3:1": "ios-18-3-public-beta-1.html",
  "18.3:2": "apple-seeds-ios-18-3-public-beta-2.html",
  "18.4:1": "apple-seeds-ios-18-4-public-beta.html",
  "18.4:2": "apple-seeds-ios-18-4-public-beta-2.html",
  "18.4:3": "apple-seeds-ios-18-4-public-beta-3.html",
  "18.5:1": "apple-releases-ios-18-5-public-beta.html",
  "18.5:2": "apple-ios-18-5-public-beta-2.html",
};

const iCultureId = (version) => `iculture-ios-${versionSlug(version)}`;
const postIdFor = ({platform, version, sequence}) =>
  nineToFivePostIds[
    `${version}:${sequence}:${platform === "iOS" ? "ios" : "ipados"}`
  ] ?? nineToFivePostIds[`${version}:${sequence}`];
const nineToFiveId = (key) => {
  const id = nineToFivePostIds[key];
  if (!id) throw new Error(`No 9to5 source mapped for ${key}`);
  return `9to5-${id}`;
};
const nineToFiveIdFor = (item) => {
  const id = postIdFor(item);
  if (!id) {
    throw new Error(
      `No 9to5 source mapped for ${item.platform} ${item.version} PB${item.sequence}`,
    );
  }
  return `9to5-${id}`;
};
const exactMrIdFor = ({version, sequence}) => {
  const filename = exactMrFiles[`${version}:${sequence}`];
  return filename ? mrId(filename) : null;
};

const keyOf = ({platform, version, sequence}) =>
  `${platform}:${version}:${sequence}`;

export const sourceIdsForCandidate = (item) => {
  const key = keyOf(item);
  const iCulture = iCultureId(item.version);
  const exactMr = exactMrIdFor(item);

  const overrides = {
    "iOS:15.1:2": [exactMr, nineToFiveId("15.1:2")],
    "iPadOS:15.1:2": [exactMr, nineToFiveId("15.1:2")],
    "iOS:15.1:4": [
      "kobonemi-ios-ipados-15-1-pb4",
      "macerkopf-ios-ipados-15-1-pb4",
    ],
    "iPadOS:15.1:4": [
      "kobonemi-ios-ipados-15-1-pb4",
      "macerkopf-ios-ipados-15-1-pb4",
    ],
    "iOS:15.5:4": [iCulture, "osxd-ios-ipados-15-5-pb4"],
    "iPadOS:15.5:4": [iCulture, "osxd-ios-ipados-15-5-pb4"],
    "iPadOS:15.5:3": [
      iCulture,
      "osxd-ios-ipados-15-5-pb3",
    ],
    "iOS:15.6:1": [exactMr, nineToFiveId("15.6:1")],
    "iPadOS:15.6:1": [exactMr, nineToFiveId("15.6:1")],
    "iOS:15.6:4": [iCulture, "ithinkdiff-ios-ipados-15-6-cycle"],
    "iPadOS:15.6:4": [iCulture, "ithinkdiff-ios-ipados-15-6-cycle"],
    "iOS:15.6:5": [iCulture, "mr-ios-ipados-15-6-pb5"],
    "iPadOS:15.6:5": [iCulture, "mr-ios-ipados-15-6-pb5"],
    "iOS:16.1:4": [iCulture, "mr-ios-16-1-pb4"],
    "iOS:16.1:5": [iCulture, "mr-ios-16-1-pb5"],
    "iOS:16.2:4": [
      "mr-ios-ipados-16-2-pb4",
      "osxd-ios-ipados-16-2-pb4",
    ],
    "iPadOS:16.2:4": [
      "mr-ios-ipados-16-2-pb4",
      "osxd-ios-ipados-16-2-pb4",
    ],
    "iPadOS:16.6:2": [
      exactMr,
      "iclarified-ios-ipados-16-6-pb2",
    ],
    "iOS:16.6:5": [iCulture, "mr-ios-ipados-16-6-pb5"],
    "iPadOS:16.6:5": [iCulture, "mr-ios-ipados-16-6-pb5"],
    "iOS:17.2:4": [iCulture, "mr-ios-ipados-17-2-pb4"],
    "iPadOS:17.2:4": [iCulture, "mr-ios-ipados-17-2-pb4"],
    "iOS:17.4:2": [exactMr, nineToFiveId("17.4:2")],
    "iOS:17.5:2": [exactMr, nineToFiveId("17.5:2")],
    "iPadOS:17.5:2": [exactMr, iCulture],
    "iOS:17.5:3": [exactMr, nineToFiveId("17.5:3")],
    "iPadOS:17.5:3": [exactMr, "osxd-ios-ipados-17-5-pb3"],
    "iOS:17.5:4": [
      "mr-ios-ipados-17-5-pb4",
      nineToFiveId("17.5:4"),
    ],
    "iPadOS:17.5:4": [
      "mr-ios-ipados-17-5-pb4",
      "osxd-ios-ipados-17-5-pb4",
    ],
    "iOS:17.6:1": [exactMr, nineToFiveId("17.6:1")],
    "iPadOS:17.6:1": [exactMr, nineToFiveId("17.6:1")],
    "iOS:17.6:2": [exactMr, nineToFiveId("17.6:2")],
    "iPadOS:17.6:2": [exactMr, nineToFiveId("17.6:2")],
    "iOS:17.6:3": [exactMr, nineToFiveId("17.6:3")],
    "iPadOS:17.6:3": [exactMr, nineToFiveId("17.6:3")],
    "iOS:17.6:4": [
      "mactrast-ios-ipados-17-6-pb4",
      nineToFiveId("17.6:4"),
    ],
    "iPadOS:17.6:4": [
      "mactrast-ios-ipados-17-6-pb4",
      nineToFiveId("17.6:4"),
    ],
    "iOS:18.1:3": [iCulture, nineToFiveId("18.1:3:ios")],
    "iPadOS:18.1:3": [
      iCulture,
      nineToFiveId("18.1:3:ipados"),
    ],
    "iOS:18.1:4": [
      "mr-ios-ipados-18-1-pb4",
      "telegram-applepro-ios-ipados-18-1-pb4",
    ],
    "iPadOS:18.1:4": [
      "mr-ios-ipados-18-1-pb4",
      "telegram-applepro-ios-ipados-18-1-pb4",
    ],
    "iPadOS:18.2:3": [iCulture, "mr-ios-ipados-18-2-pb3"],
    "iOS:18.3:2": [exactMr, nineToFiveId("18.3:2:ios")],
    "iPadOS:18.3:2": [
      exactMr,
      nineToFiveId("18.3:2:ipados"),
    ],
    "iPadOS:18.3:3": [
      iCulture,
      "kobonemi-ios-ipados-18-3-pb3",
    ],
    "iOS:18.4:3": [exactMr, nineToFiveId("18.4:3:ios")],
    "iOS:18.4:4": [
      nineToFiveId("18.4:4"),
      "kobonemi-ios-ipados-18-4-pb4",
    ],
    "iPadOS:18.4:4": [
      nineToFiveId("18.4:4"),
      "kobonemi-ios-ipados-18-4-pb4",
    ],
    "iOS:18.5:3": [
      "mr-ios-ipados-18-5-pb3",
      "monomaniac-april-2025",
    ],
    "iPadOS:18.5:3": [
      "mr-ios-ipados-18-5-pb3",
      "monomaniac-april-2025",
    ],
  };
  if (overrides[key]) return overrides[key].filter(Boolean);

  if (item.platform === "iPadOS" && item.version === "16.1") {
    const conflictSources = {
      1: [
        mrId("apple-seeds-ios-16-public-beta-5.html"),
        "appleinsider-ipados16-1-aug24",
        "imore-ipados16-history",
      ],
      2: [
        iCulture,
        mrId("apple-seeds-first-ios-16-1-public-beta.html"),
        "imore-ipados16-history",
      ],
      3: [iCulture, "9to5-837526", "imore-ipados16-history"],
      4: [
        mrId("apple-ios-16-1-ipados-16-1-new-public-betas.html"),
        "9to5-838834",
        "imore-ipados16-history",
      ],
      5: [
        iCulture,
        "9to5-839952",
        "appleinsider-ipados16-1-oct4",
      ],
      6: [iCulture, "9to5-841347", "imore-ipados16-history"],
    };
    return conflictSources[item.sequence];
  }

  if (exactMr) return [iCulture, exactMr];
  return [iCulture, nineToFiveIdFor(item)];
};

export const negativeEvidenceSourceIds = [
  "apple-ios15-updates",
  "apple-ios16-updates",
  "apple-ios17-updates",
  "apple-ios18-updates",
  "apple-security-ios-ipados-15-7",
  "appleinsider-ios-ipados-15-7-rc",
  "9to5-ios-15-7-beta1-label",
  "iclarified-ios-ipados-16-7-rc",
  "iclarified-ios-ipados-17-7-rc",
  "9to5-ios-18-7-public-label",
  "ipswdev-ios-ipados-18-7-rc",
  "9to5-926341",
  "mr-ios-ipados-17-3-beta2-withdrawn",
  "mr-ios-ipados-18-5-pb3",
  "monomaniac-april-2025",
  "iculture-ios-15-6",
  "iculture-ios-16-6",
  "iculture-ios-17-3",
  "iculture-ios-18-5",
];

const catalog = [
  ...iCultureSpecs,
  ...localMrFiles,
  ...nineToFiveSpecs,
  ...freshSpecs,
];
const catalogById = new Map(catalog.map((source) => [source.sourceId, source]));

export const usedSourceIdsFor = (appearances) => [
  ...new Set([
    ...appearances.flatMap(sourceIdsForCandidate),
    ...negativeEvidenceSourceIds,
  ]),
].sort();

export const sourceSpecsFor = (appearances) =>
  usedSourceIdsFor(appearances).map((sourceId) => {
    const source = catalogById.get(sourceId);
    if (!source) throw new Error(`Missing source spec ${sourceId}`);
    return source;
  });
