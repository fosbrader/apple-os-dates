const source = (
  sourceId,
  publisher,
  canonicalUrl,
  {
    sourceClass = "contemporaneousSecondary",
    localReusePath,
    note,
    roles = [
      "publicAvailability",
      "publicOrdinal",
      "appearanceDate",
      "channelIdentity",
    ],
  } = {},
) => ({
  sourceId,
  publisher,
  canonicalUrl,
  sourceClass,
  ...(localReusePath ? {localReusePath} : {}),
  roles,
  note:
    note ??
    "Retained claim-level evidence for the platform, version, public audience, displayed ordinal, and/or Pacific appearance date.",
});

const living = (sourceId, canonicalUrl, note) =>
  source(sourceId, "iCulture", canonicalUrl, {
    sourceClass: "contemporaneousLivingChronology",
    note,
  });

const reusedMobile26 = (sourceId, publisher, canonicalUrl, filename, note) =>
  source(sourceId, publisher, canonicalUrl, {
    localReusePath: `tmp/research-evidence/beta-chronology-gap/mobile26-public/raw/${filename}`,
    note:
      note ??
      "Hash-verifiable raw capture reused from the completed mobile26-public packet; the retained article also explicitly names the macOS public appearance.",
  });

export const sourceSpecs = [
  living(
    "iculture-151-cycle",
    "https://www.iculture.nl/nieuws/macos-sequoia-15-1-beta/",
    "Living macOS 15.1 timeline. Its Public Beta 3 row is one calendar day later than the retained Pacific date and is preserved as a conflict.",
  ),
  source(
    "9to5-151-cycle",
    "9to5Mac",
    "https://9to5mac.com/guides/macos-sequoia-15-1/",
    {
      sourceClass: "contemporaneousLivingChronology",
      note:
        "Cycle archive retains the separate Public Beta 1–4 headlines and Pacific publication dates.",
    },
  ),
  source(
    "mr-151-pb3-update",
    "MacRumors",
    "https://www.macrumors.com/2024/10/07/apple-seeds-macos-sequoia-15-1-beta-6/",
    {
      note:
        "Developer-beta article updated for same-day public availability. It independently establishes the October 7 public appearance, while 9to5Mac supplies the displayed Public Beta 3 ordinal.",
    },
  ),
  living(
    "iculture-152-cycle",
    "https://www.iculture.nl/nieuws/macos-sequoia-15-2-beta/",
    "Living macOS 15.2 timeline with explicit Public Beta 1–3 rows.",
  ),
  source(
    "9to5-152-cycle",
    "9to5Mac",
    "https://9to5mac.com/guides/macos-sequoia-15-2/",
    {
      sourceClass: "contemporaneousLivingChronology",
      note:
        "Cycle archive retains separate Public Beta 1–3 reports and dates.",
    },
  ),
  source(
    "9to5-153-cycle",
    "9to5Mac",
    "https://9to5mac.com/guides/macos-sequoia-15-3/",
    {
      sourceClass: "contemporaneousLivingChronology",
      note:
        "Cycle archive retains the first, second, and third public appearances; the beta-3 article was updated when public distribution began.",
    },
  ),
  source(
    "mr-153-pb1",
    "MacRumors",
    "https://www.macrumors.com/2024/12/18/ios-18-3-public-beta-1/",
  ),
  source(
    "mr-153-pb2",
    "MacRumors",
    "https://www.macrumors.com/2025/01/08/apple-seeds-ios-18-3-public-beta-2/",
  ),
  source(
    "osxdaily-153-pb3",
    "OS X Daily",
    "https://osxdaily.com/2025/01/16/beta-3-of-ios-18-3-ipados-18-3-macos-sequoia-15-3-available-for-beta-testers/",
    {
      note:
        "Same-day independent report identifies macOS Sequoia 15.3 Beta 3 as available to Apple beta-program participants. Its page imagery labels the releases public betas; 9to5Mac independently states public-beta-tester availability.",
    },
  ),
  source(
    "9to5-154-cycle",
    "9to5Mac",
    "https://9to5mac.com/guides/macos-sequoia-15-4/",
    {
      sourceClass: "contemporaneousLivingChronology",
      note:
        "Cycle archive retains explicit Public Beta 1–4 reports and Pacific dates.",
    },
  ),
  source(
    "mr-154-pb1",
    "MacRumors",
    "https://www.macrumors.com/2025/02/24/apple-seeds-ios-18-4-public-beta/",
  ),
  source(
    "mr-154-pb2",
    "MacRumors",
    "https://www.macrumors.com/2025/03/04/apple-seeds-ios-18-4-public-beta-2/",
  ),
  source(
    "mr-154-pb3",
    "MacRumors",
    "https://www.macrumors.com/2025/03/11/apple-seeds-ios-18-4-public-beta-3/",
  ),
  source(
    "osxdaily-154-pb4",
    "OS X Daily",
    "https://osxdaily.com/2025/03/17/beta-4-of-ios-18-4-ipados-18-4-macos-sequoia-15-4-available-for-testing/",
    {
      note:
        "Same-day independent report identifies macOS Sequoia 15.4 Beta 4 as available through Apple's beta program. 9to5Mac independently and explicitly supplies the Public Beta 4 audience and label.",
    },
  ),
  source(
    "9to5-155-cycle",
    "9to5Mac",
    "https://9to5mac.com/guides/macos-sequoia-15-5/",
    {
      sourceClass: "contemporaneousLivingChronology",
      note:
        "Cycle archive explicitly establishes Public Beta 1 and 2 and retains the April 28 public update to the developer-beta-4 article.",
    },
  ),
  source(
    "mr-155-pb1",
    "MacRumors",
    "https://www.macrumors.com/2025/04/15/apple-releases-ios-18-5-public-beta/",
  ),
  source(
    "mr-155-pb2",
    "MacRumors",
    "https://www.macrumors.com/2025/04/22/apple-ios-18-5-public-beta-2/",
  ),
  source(
    "mr-155-pb3",
    "MacRumors",
    "https://www.macrumors.com/2025/04/28/apple-seeds-fourth-beta-of-macos-sequoia-15-5/",
    {
      note:
        "Developer-beta-4 article updated for a same-day public appearance; it corroborates distribution/date but does not independently display the public ordinal.",
    },
  ),
  source(
    "monomaniac-155-pb3",
    "Monomaniac Garage",
    "https://www.monomaniacgarage.com/macos-sequoia-15-5-public-beta-3-24f5068b/",
    {
      note:
        "Contemporary installation record explicitly displays macOS Sequoia 15.5 Public Beta 3 and build 24F5068b.",
    },
  ),
  living(
    "iculture-155-cycle",
    "https://www.iculture.nl/nieuws/macos-sequoia-15-5-beta/",
    "Living timeline retained because its Public Beta 4 label conflicts with explicit Public Beta 3 evidence.",
  ),
  source(
    "iclarified-155-conflict",
    "iClarified",
    "https://www.iclarified.com/97024/apple-releases-public-betas-of-ios-185-ipados-185-macos-sequoia-155-download",
    {
      note:
        "Conflict source: article date and cycle position are the first public appearance, but retained text calls it the third public beta.",
    },
  ),
  source(
    "mr-156-pb3",
    "MacRumors",
    "https://www.macrumors.com/2025/07/15/apple-releases-ios-18-6-public-beta-3/",
  ),
  source(
    "iclarified-156-pb3",
    "iClarified",
    "https://www.iclarified.com/97887/apple-releases-public-beta-3-of-ios-186-ipados-186-macos-sequoia-156-download",
  ),
  living(
    "iculture-156-cycle",
    "https://www.iculture.nl/nieuws/macos-sequoia-15-6-beta/",
    "Living timeline contains only a Public Beta 3 row; absence of Public Beta 1 and 2 is preserved as a negative finding, not converted into inferred events.",
  ),
  reusedMobile26(
    "mr-261-pb1",
    "MacRumors",
    "https://www.macrumors.com/2025/09/24/apple-releases-ios-26-1-public-beta-1/",
    "source-macrumors-261-pb1.raw.html",
  ),
  reusedMobile26(
    "mr-261-pb2",
    "MacRumors",
    "https://www.macrumors.com/2025/10/07/apple-seeds-ios-26-1-public-beta-2/",
    "source-macrumors-261-pb2.raw.html",
  ),
  reusedMobile26(
    "mr-261-pb3",
    "MacRumors",
    "https://www.macrumors.com/2025/10/14/apple-seeds-ios-26-1-public-beta-3/",
    "source-macrumors-261-pb3.raw.html",
  ),
  reusedMobile26(
    "mr-261-pb4",
    "MacRumors",
    "https://www.macrumors.com/2025/10/20/apple-seeds-ios-26-1-public-beta-4/",
    "source-macrumors-261-pb4.raw.html",
  ),
  living(
    "iculture-261-cycle",
    "https://www.iculture.nl/nieuws/macos-tahoe-26-1-beta/",
    "Living macOS Tahoe 26.1 timeline with explicit Public Beta 1–4 rows.",
  ),
  source(
    "9to5-262-pb1",
    "9to5Mac",
    "https://9to5mac.com/macos-tahoe-26-1-beta-1/",
    {
      note:
        "The legacy slug now serves the macOS Tahoe 26.2 beta-1 article; its November 7 update explicitly identifies the first public beta.",
    },
  ),
  source(
    "9to5-262-pb2",
    "9to5Mac",
    "https://9to5mac.com/2025/11/13/macos-tahoe-26-2-public-beta-2/",
  ),
  source(
    "9to5-262-pb3",
    "9to5Mac",
    "https://9to5mac.com/2025/11/18/macos-tahoe-26-2-public-beta-3-released/",
  ),
  source(
    "mr-262-pb1",
    "MacRumors",
    "https://www.macrumors.com/2025/11/07/apple-releases-first-macos-tahoe-26-2-public-beta/",
  ),
  source(
    "mr-262-pb2",
    "MacRumors",
    "https://www.macrumors.com/2025/11/13/apple-macos-tahoe-26-2-public-beta-2/",
  ),
  source(
    "mactrast-262-pb3",
    "MacTrast",
    "https://www.mactrast.com/2025/11/third-macos-tahoe-26-2-public-beta-is-now-available/",
  ),
  source(
    "mactech-262-conflict",
    "MacTech",
    "https://www.mactech.com/2025/11/18/apple-releases-new-public-betas-of-macos-tahoe-26-2-ios-26-2-ipados-26-2-tvos-26-2-watchos-26-2/",
    {
      note:
        "Conflict source that calls the November 18 macOS appearance the second public beta.",
    },
  ),
  living(
    "iculture-262-cycle",
    "https://www.iculture.nl/nieuws/macos-26-2-beta/",
    "Living cycle article says public testing is available but retains no public rows; treated as an omission conflict.",
  ),
  source(
    "9to5-263-pb1",
    "9to5Mac",
    "https://9to5mac.com/2025/12/17/macos-26-3-public-beta-1/",
  ),
  source(
    "9to5-263-pb2",
    "9to5Mac",
    "https://9to5mac.com/2026/01/13/public-beta-2-for-macos-tahoe-26-3-ipados-26-3-more-now-available/",
  ),
  source(
    "9to5-263-pb3",
    "9to5Mac",
    "https://9to5mac.com/2026/01/27/public-beta-3-for-macos-tahoe-26-3-ipados-26-3-and-more-now-available/",
  ),
  living(
    "iculture-263-cycle",
    "https://www.iculture.nl/nieuws/macos-26-3-beta/",
    "Living macOS Tahoe 26.3 timeline with explicit Public Beta 1–3 rows.",
  ),
  source(
    "9to5-264-pb1",
    "9to5Mac",
    "https://9to5mac.com/2026/02/17/macos-tahoe-26-4-public-beta-debuts-heres-whats-new/",
  ),
  source(
    "mr-264-pb1",
    "MacRumors",
    "https://www.macrumors.com/2026/02/17/macos-tahoe-26-4-public-beta-1/",
  ),
  source(
    "mr-264-pb2",
    "MacRumors",
    "https://www.macrumors.com/2026/02/24/apple-seeds-macos-tahoe-26-4-public-beta-2/",
  ),
  source(
    "mactrast-264-pb2",
    "MacTrast",
    "https://www.mactrast.com/2026/02/second-macos-tahoe-26-4-public-beta-is-now-available/",
  ),
  source(
    "mr-264-pb3",
    "MacRumors",
    "https://www.macrumors.com/2026/03/04/apple-releases-macos-tahoe-26-4-public-beta-3/",
  ),
  source(
    "mactrast-264-pb3",
    "MacTrast",
    "https://www.mactrast.com/2026/03/third-macos-tahoe-26-4-public-beta-is-now-available/",
    {
      note:
        "Same-day independent report explicitly identifies the third public beta and its March 4 appearance.",
    },
  ),
  source(
    "9to5-264-pb4",
    "9to5Mac",
    "https://9to5mac.com/2026/03/09/macos-26-4-beta-4-now-available-heres-whats-coming/",
  ),
  source(
    "mr-264-pb4",
    "MacRumors",
    "https://www.macrumors.com/2026/03/09/apple-seeds-macos-tahoe-26-4-beta-4/",
    {
      note:
        "Developer-beta article updated for public availability; 9to5Mac independently supplies the explicit Public Beta 4 label.",
    },
  ),
  living(
    "iculture-264-cycle",
    "https://www.iculture.nl/nieuws/macos-tahoe-26-4-beta/",
    "Living timeline stops after Public Beta 2; retained as an omission conflict for Public Beta 3 and 4.",
  ),
  reusedMobile26(
    "mr-265-pb1",
    "MacRumors",
    "https://www.macrumors.com/2026/04/03/apple-first-ios-26-5-public-beta/",
    "source-macrumors-265-pb1.raw.html",
  ),
  source(
    "technopat-265-pb1",
    "Technopat",
    "https://www.technopat.net/2026/04/04/macos-tahoe-26-5-public-beta-1-yayinlandi/",
    {
      note:
        "Turkish report explicitly identifies Public Beta 1; its April 4 local publication corresponds to the April 3 Pacific appearance.",
    },
  ),
  source(
    "9to5-265-pb2",
    "9to5Mac",
    "https://9to5mac.com/2026/04/21/macos-26-5-public-beta-2-now-available/",
  ),
  reusedMobile26(
    "mr-265-pb2",
    "MacRumors",
    "https://www.macrumors.com/2026/04/21/apple-releases-ios-26-5-public-beta-3/",
    "source-macrumors-265-pb3.raw.html",
    "Reused combined report explicitly says iOS/iPadOS Public Beta 3 but macOS Tahoe Public Beta 2.",
  ),
  source(
    "9to5-265-pb3",
    "9to5Mac",
    "https://9to5mac.com/2026/04/27/apple-releases-macos-26-5-beta-4-heres-what-to-expect/",
    {
      note:
        "Developer-beta-4 article update explicitly identifies macOS Public Beta 3 and explains the skipped public seed.",
    },
  ),
  source(
    "monomaniac-265-pb3",
    "Monomaniac Garage",
    "https://www.monomaniacgarage.com/macos-tahoe-26-5-public-beta-3-25f5068a/",
  ),
  living(
    "iculture-265-cycle",
    "https://www.iculture.nl/nieuws/macos-tahoe-26-5-beta/",
    "Conflict source whose table incorrectly adds an April 14 public appearance and shifts later public ordinals.",
  ),
  reusedMobile26(
    "mr-265-apr14-negative",
    "MacRumors",
    "https://www.macrumors.com/2026/04/14/apple-seeds-ios-26-5-public-beta-2/",
    "source-macrumors-265-pb2.raw.html",
    "Negative evidence: the April 14 public release names iOS, iPadOS, tvOS, and watchOS but omits macOS.",
  ),
  reusedMobile26(
    "mr-266-pb1",
    "MacRumors",
    "https://www.macrumors.com/2026/05/28/apple-seeds-ios-26-6-public-beta-1/",
    "source-macrumors-266-pb1.raw.html",
  ),
  reusedMobile26(
    "mr-266-pb2",
    "MacRumors",
    "https://www.macrumors.com/2026/06/16/apple-ios-26-6-public-beta-2/",
    "source-macrumors-266-pb2.raw.html",
  ),
  reusedMobile26(
    "mr-266-pb3",
    "MacRumors",
    "https://www.macrumors.com/2026/06/30/ios-26-6-public-beta-3/",
    "source-macrumors-266-pb3.raw.html",
  ),
  reusedMobile26(
    "mr-266-pb4",
    "MacRumors",
    "https://www.macrumors.com/2026/07/07/apple-seeds-ios-26-6-public-beta-4/",
    "source-macrumors-266-pb4.raw.html",
  ),
  living(
    "iculture-266-cycle",
    "https://www.iculture.nl/nieuws/macos-tahoe-26-6-beta/",
    "Living timeline with explicit Public Beta 1–5 rows; its Public Beta 3 date matches the developer seed and conflicts with Pacific public-distribution reporting.",
  ),
  source(
    "9to5-266-pb5",
    "9to5Mac",
    "https://9to5mac.com/2026/07/13/macos-26-6-beta-5-now-available-heres-whats-coming/",
    {
      note:
        "Developer-beta-5 article update explicitly identifies macOS 26.6 Public Beta 5.",
    },
  ),
  source(
    "monomaniac-266-pb5",
    "Monomaniac Garage",
    "https://www.monomaniacgarage.com/macos-tahoe-26-6-public-beta-5-25g5065a/",
  ),
];
