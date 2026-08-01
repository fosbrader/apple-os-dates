const source = (
  sourceId,
  publisher,
  canonicalUrl,
  {
    sourceClass = "contemporaneousSecondary",
    indexedExtract,
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
  ...(indexedExtract ? {indexedExtract} : {}),
  roles,
  note:
    note ??
    "Retained claim-level evidence for the watchOS version, public audience, displayed ordinal, and/or Pacific appearance date.",
});

const living = (sourceId, canonicalUrl, note) =>
  source(sourceId, "iCulture", canonicalUrl, {
    sourceClass: "contemporaneousLivingChronology",
    note,
  });

const negative = (sourceId, publisher, canonicalUrl, note) =>
  source(sourceId, publisher, canonicalUrl, {
    roles: ["negativeBoundary", "audienceDistinction", "appearanceDate"],
    note,
  });

export const sourceSpecs = [
  source(
    "apple-watchos7-boundary",
    "Apple",
    "https://www.apple.com/newsroom/2020/06/watchos-7-adds-significant-personalization-health-and-fitness-features-to-apple-watch/",
    {
      sourceClass: "firstParty",
      localReusePath:
        "tmp/research-evidence/beta-chronology-gap/watchos-major-7-26/source-001-apple-watchos7-first-public-beta.html",
      roles: ["applicabilityBoundary", "publicProgramIdentity"],
      note:
        "Apple's watchOS 7 announcement establishes that watchOS 7 was the platform's first public-beta program release.",
    },
  ),
  source(
    "imore7-public-rolling",
    "iMore",
    "https://www.imore.com/how-download-watchos-7-public-beta",
    {
      sourceClass: "contemporaneousLivingChronology",
      note:
        "Living public-beta chronology with explicit watchOS 7.1, 7.2, 7.4, 7.5, and 7.6 public entries. Its broad 7.2 rows are retained alongside contrary/withdrawal evidence and are not treated as sufficient by themselves.",
    },
  ),
  living(
    "iculture-71-cycle",
    "https://www.iculture.nl/nieuws/watchos-7-1-beta/",
    "Cycle chronology retaining explicit watchOS 7.1 Public Beta 1 and Public Beta 2 rows.",
  ),
  source(
    "iphonecanada-72-pb2",
    "iPhone in Canada",
    "https://www.iphoneincanada.ca/2020/11/18/ios-14-3-beta-2-download-and-more-released-for-developers-public-beta-testers/",
    {
      note:
        "Contemporary public-tester release report listing watchOS 7.2 Beta 2 on November 18.",
    },
  ),
  living(
    "iculture-72-cycle",
    "https://www.iculture.nl/nieuws/watchos-7-2-beta/",
    "Retained cycle chronology used to distinguish developer-only or unestablished sequence positions from the supported public appearance.",
  ),
  source(
    "9to5-73-pb2",
    "9to5Mac",
    "https://9to5mac.com/2021/01/13/ios-14-4-beta-2-developers/",
    {
      note:
        "Article updated on January 13 Pacific to state that watchOS 7.3 Beta 2 was available to public beta testers.",
    },
  ),
  source(
    "mr-73-pb2",
    "MacRumors",
    "https://www.macrumors.com/2021/01/13/apple-seeds-watchos-7-3-beta-2-to-developers/",
    {
      note:
        "Platform-specific Beta 2 report updated for public availability on January 13 Pacific.",
    },
  ),
  negative(
    "cultofmac-73-pb1-negative",
    "Cult of Mac",
    "https://www.cultofmac.com/news/apple-ios-14-4-beta-1-ipados-watchos-7-3",
    "Contemporary boundary report identifying the first watchOS 7.3 seed as developer-only while iOS/iPadOS entered public testing.",
  ),
  living(
    "iculture-74-cycle",
    "https://www.iculture.nl/nieuws/watchos-7-4-beta/",
    "Cycle chronology with Public Beta 1–5 rows; it retains developer-only Beta 6 and omits a separate public row for Beta 7.",
  ),
  source(
    "kob-74-pb2",
    "Kobonemi",
    "https://www.kobonemi.com/entry/2021/02/18/iOS-14.5-iPadOS_14.5-watchOS-7.4-Public-Beta-2",
  ),
  source(
    "kob-74-pb3",
    "Kobonemi",
    "https://www.kobonemi.com/entry/2021/03/06/watchOS-7.4-Public-Beta-3",
  ),
  source(
    "macerkopf-74-pb3",
    "Macerkopf",
    "https://www.macerkopf.de/2021/03/05/apple-veroeffentlicht-beta-3-zu-watchos-7-4/",
    {
      note:
        "Contemporary platform report updated to identify the third watchOS 7.4 beta as publicly available.",
    },
  ),
  source(
    "ithinkdiff-74-pb4",
    "iThinkDiff",
    "https://www.ithinkdiff.com/apple-beta-4-watchos-7-4-tvos-14-5/?share=x",
  ),
  source(
    "kob-74-pb5",
    "Kobonemi",
    "https://www.kobonemi.com/entry/2021/03/24/iOS-14.5-and-iPadOS-14.5-Public-Beta-5",
    {
      note:
        "Contemporary Public Beta 5 report explicitly including watchOS 7.4.",
    },
  ),
  source(
    "9to5-74-pb7",
    "9to5Mac",
    "https://9to5mac.com/2021/04/07/apple-releases-watchos-7-4-beta-7-with-iphone-mask-unlock-to-developers/",
    {
      note:
        "Platform-specific Beta 7 report updated for public beta availability on April 7 Pacific.",
    },
  ),
  source(
    "ithinkdiff-74-pb7",
    "iThinkDiff",
    "https://www.ithinkdiff.com/beta-7-ios-14-5-watchos-7-4-tvos-14-5/?share=x",
    {
      note:
        "Independent same-day report explicitly stating that watchOS 7.4 Beta 7 reached developers and public beta testers.",
    },
  ),
  source(
    "kob-75-pb1",
    "Kobonemi",
    "https://www.kobonemi.com/entry/2021/04/24/iOS-14.6-and-iPadOS-14.6-Public-Beta-1",
    {
      note:
        "Public Beta 1 report explicitly including watchOS 7.5; Japanese timestamp maps to April 23 Pacific.",
    },
  ),
  source(
    "9to5-75-pb2",
    "9to5Mac",
    "https://9to5mac.com/2021/04/30/apple-releases-second-developer-beta-of-watchos-7-5-to-developers/",
    {
      note:
        "Platform-specific Beta 2 report updated for public availability on April 30 Pacific.",
    },
  ),
  source(
    "kob-75-pb2",
    "Kobonemi",
    "https://www.kobonemi.com/entry/2021/05/01/iOS-14.6-and-iPadOS-14.6-Public-Beta-2",
    {
      note:
        "Public Beta 2 report explicitly including watchOS 7.5; Japanese timestamp maps to April 30 Pacific.",
    },
  ),
  source(
    "9to5-75-pb3",
    "9to5Mac",
    "https://9to5mac.com/2021/05/10/apple-releases-third-developer-beta-of-watchos-7-5-to-developers/",
    {
      note:
        "Platform-specific Beta 3 report updated to state the same-day public beta appearance.",
    },
  ),
  source(
    "purudo-75-pb3",
    "Purudo",
    "https://xn--p9j1ayd.net/archives/48750",
    {
      note:
        "Independent report explicitly naming watchOS 7.5 Public Beta 3 for Beta Software Program members; Japanese publication day maps to May 10 Pacific.",
    },
  ),
  source(
    "kob-76-pb1",
    "Kobonemi",
    "https://www.kobonemi.com/entry/2021/05/21/iOS-14.7-and-iPadOS-14.7-and-watchOS-7.6-Public-Beta-1",
    {
      note:
        "Explicit watchOS 7.6 Public Beta 1 report; Japanese publication day maps to May 20 Pacific.",
    },
  ),
  source(
    "wccftech-76-pb1",
    "Wccftech",
    "https://wccftech.com/apple-releases-beta-1-of-ios-14-7-ipados-14-7-tvos-14-7-watchos-7-6-and-macos-big-sur-11-5-to-developers/",
    {
      note:
        "Article update explicitly identifies watchOS 7.6 Public Beta 1 on May 20.",
    },
  ),
  source(
    "9to5-76-pb3",
    "9to5Mac",
    "https://9to5mac.com/2021/06/15/apple-releases-ios-14-7-watchos-7-6-and-macos-11-5-beta-3-to-developers/",
    {
      note:
        "Beta 3 article updated for same-day public availability, explicitly including watchOS 7.6.",
    },
  ),
  source(
    "9to5-76-pb4",
    "9to5Mac",
    "https://9to5mac.com/2021/06/29/apple-releases-ios-14-7-beta-4-to-developers-more/",
    {
      note:
        "Beta 4 article updated for same-day public availability, explicitly including watchOS 7.6.",
    },
  ),
  source(
    "kob-76-pb5",
    "Kobonemi",
    "https://www.kobonemi.com/entry/2021/07/09/iOS-14.7-and-iPadOS-14.7-and-watchOS-7.6-Public-Beta-5",
    {
      note:
        "Explicit watchOS 7.6 Public Beta 5 report; Japanese publication day maps to July 8 Pacific.",
    },
  ),
  source(
    "nishiki-76-pb5",
    "Nishiki Pro",
    "https://nishikiout.net/entry/2021/07/09/090649",
    {
      note:
        "Independent explicit watchOS 7.6 Public Beta 5 report; Japanese publication day maps to July 8 Pacific.",
    },
  ),
  living(
    "iculture-76-cycle",
    "https://www.iculture.nl/nieuws/watchos-7-6-beta/",
    "Cycle chronology retained for the missing Public Beta 2 position and its omission of Public Beta 5.",
  ),
  source(
    "forbes-81-first",
    "Forbes",
    "https://www.forbes.com/sites/anthonykarcz/2021/09/29/apple-fixes-unlock-with-watch-feature-in-ios-151-public-beta-2/",
    {
      note:
        "Conflict source explicitly calling the September 29 watchOS 8.1 appearance Public Beta 1.",
    },
  ),
  source(
    "kob-81-pb2",
    "Kobonemi",
    "https://www.kobonemi.com/entry/_2021/09/30/iOS-15.1-and-iPadOS-15.1-and-watchOS-8.1-and-tvOS-15.1-Public-Beta-2",
    {
      note:
        "Conflict source explicitly calling the same September 29 Pacific appearance Public Beta 2.",
    },
  ),
  source(
    "geeky-81-first",
    "Geeky Gadgets",
    "https://www.geeky-gadgets.com/whats-new-in-watchos-8-1-beta-2-video/",
    {
      note:
        "Conflict corroboration identifying watchOS 8.1 Beta 2 as available to developers and public testers.",
    },
  ),
  source(
    "imore8-public-rolling",
    "iMore",
    "https://www.imore.com/how-download-watchos-8-public-beta",
    {
      sourceClass: "contemporaneousLivingChronology",
      localReusePath:
        "tmp/research-evidence/beta-chronology-gap/watchos-major-7-26/source-017-imore-watchos8-rolling.html",
      note:
        "Hash-reused living public-beta chronology with explicit retained rows for the relevant watchOS 8 point-cycle appearances.",
    },
  ),
  source(
    "9to5-81-pb3",
    "9to5Mac",
    "https://9to5mac.com/2021/10/07/apple-seeds-watchos-8-1-beta-3-to-all-developers/",
    {
      note:
        "Platform-specific Beta 3 report updated for public tester availability on October 7.",
    },
  ),
  source(
    "kob-81-pb4",
    "Kobonemi",
    "https://www.kobonemi.com/entry/2021/10/14/iOS-15.1-and-iPadOS-15.1-Public-Beta-4",
    {
      note:
        "Public Beta 4 report explicitly including watchOS 8.1; Japanese publication maps to October 13 Pacific.",
    },
  ),
  source(
    "itopnews-81-pb4",
    "iTopnews",
    "https://www.itopnews.de/2021/10/ios-15-1-public-beta-4-ist-da/",
    {
      note:
        "Independent report stating that the fourth betas included watchOS 8.1 and were released to public testers.",
    },
  ),
  source(
    "9to5-83-pb1",
    "9to5Mac",
    "https://9to5mac.com/2021/10/28/whats-new-in-ios-15-2/",
    {
      note:
        "Beta 1 article updated on October 28 to state that watchOS 8.3 was rolling out to public beta testers.",
    },
  ),
  source(
    "ontop-83-pb1",
    "ONTOP",
    "https://ontop.vn/bai-viet/apple-phat-hanh-ios-15-2-watchos-8-3-public-beta-1-29966/",
    {
      indexedExtract: {
        indexProvider: "OpenAI Web Search",
        indexedAt: "2026-03-31",
        title:
          "Apple phát hành iOS 15.2, watchOS 8.3 Public beta 1",
        publishedLabel: "29/10/2021",
        excerpt: "Cách cập nhật watchOS 8.3 Public beta 1",
        originalFetchFailure: "HTTP 522",
      },
      note:
        "Independent explicit watchOS 8.3 Public Beta 1 report; its October 29 Vietnam publication day maps to the October 28 Pacific release window. Direct capture returned HTTP 522, so the packet retains a labeled search-index extract rather than an error page.",
    },
  ),
  source(
    "macerkopf-83-pb2",
    "Macerkopf",
    "https://www.macerkopf.de/2021/11/10/ios-15-2-ipados-15-2-public-beta-2-ist-da/",
    {
      note:
        "Public Beta 2 report explicitly including watchOS 8.3 on November 10.",
    },
  ),
  source(
    "kob-83-pb3",
    "Kobonemi",
    "https://www.kobonemi.com/entry/2021/11/17/iOS-15.2-and-iPadOS-15.2-and-watchOS-8.3-and-tvOS-15.2-and-macOS-12.1-Beta-3",
    {
      note:
        "Explicit watchOS 8.3 Public Beta 3 report; Japanese publication day maps to November 16 Pacific.",
    },
  ),
  negative(
    "9to5-83-pb3-dev",
    "9to5Mac",
    "https://9to5mac.com/2021/11/16/apple-releases-ios-15-2-beta-3-and-more-to-developers/",
    "Same-day independent report establishing watchOS 8.3 Beta 3 only for developers; retained to show that it does not independently corroborate the public audience.",
  ),
  source(
    "kob-83-pb4",
    "Kobonemi",
    "https://www.kobonemi.com/entry/2021/12/03/iOS-15.2-and-iPadOS-15.2-and-watchOS-8.3-and-tvOS-15.2-Public-Beta-4",
    {
      note:
        "Explicit watchOS 8.3 Public Beta 4 report; Japanese publication day maps to December 2 Pacific.",
    },
  ),
  source(
    "9to5-83-pb4",
    "9to5Mac",
    "https://9to5mac.com/2021/12/02/apple-rolling-out-ios-15-2-beta-4-to-developers-as-public-release-nears/",
    {
      note:
        "Beta 4 article updated for same-day public beta distribution, explicitly including watchOS 8.3.",
    },
  ),
  source(
    "kob-84-pb1",
    "Kobonemi",
    "https://www.kobonemi.com/entry/2021/12/18/iOS-15.3-and-iPadOS-15.3-and-watchOS-8.4-and-tvOS-15.3-Beta-1",
    {
      note:
        "Living report updated for watchOS 8.4 Public Beta 1 on December 21 Japan time, mapping to December 20 Pacific.",
    },
  ),
  source(
    "ontop-84-pb1",
    "ONTOP",
    "https://ontop.vn/bai-viet/apple-phat-hanh-ios-15-3-watchos-8-4-public-beta-1-32234/",
    {
      indexedExtract: {
        indexProvider: "OpenAI Web Search",
        indexedAt: "2026-03-31",
        title:
          "Apple phát hành iOS 15.3, watchOS 8.4 Public beta 1",
        publishedLabel: "21/12/2021",
        excerpt: "Cách cập nhật watchOS 8.4 Public beta 1",
        originalFetchFailure: "HTTP 522",
      },
      note:
        "Independent explicit watchOS 8.4 Public Beta 1 report; its December 21 Vietnam publication day maps to the December 20 Pacific release window. Direct capture returned HTTP 522, so the packet retains a labeled search-index extract rather than an error page.",
    },
  ),
  negative(
    "cultofmac-84-pb1-negative",
    "Cult of Mac",
    "https://www.cultofmac.com/news/first-ios-15-3-beta-is-all-bug-fixes",
    "Same-day timing boundary: at publication, Cult of Mac still identified watchOS 8.4 as developer-only while other platforms were public.",
  ),
  living(
    "iculture-84-cycle",
    "https://www.iculture.nl/nieuws/watchos-8-4-beta/",
    "Cycle chronology retaining an explicit Public Beta 2 row.",
  ),
  source(
    "9to5-84-pb2",
    "9to5Mac",
    "https://9to5mac.com/2022/01/13/apple-releases-ios-15-3-beta-2-for-developers/",
    {
      note:
        "Beta 2 report updated for public tester availability, explicitly including watchOS 8.4.",
    },
  ),
  source(
    "ithinkdiff-85-cycle",
    "iThinkDiff",
    "https://www.ithinkdiff.com/watchos-8-5-beta/",
    {
      sourceClass: "contemporaneousLivingChronology",
      note:
        "Living watchOS 8.5 cycle report retaining explicit public-beta entries.",
    },
  ),
  source(
    "kob-85-pb1",
    "Kobonemi",
    "https://www.kobonemi.com/entry/2022/01/28/iOS-15.4-and-iPadOS-15.4-and-watchOS-8.5-and-tvOS-15.4-and-macOS-12.3-Beta-1",
  ),
  source(
    "kob-85-pb2",
    "Kobonemi",
    "https://www.kobonemi.com/entry/2022/02/09/iOS-15.4-and-iPadOS-15.4-and-watchOS-8.5-and-tvOS-15.4-and-macOS-12.3-Beta-2",
  ),
  source(
    "kob-85-pb3",
    "Kobonemi",
    "https://www.kobonemi.com/entry/2022/02/16/iOS-15.4-and-iPadOS-15.4-and-watchOS-8.5-and-tvOS-15.4-and-macOS-12.3-Beta-3",
  ),
  source(
    "kob-85-pb4",
    "Kobonemi",
    "https://www.kobonemi.com/entry/2022/02/23/iOS-15.4-and-iPadOS-15.4-and-watchOS-8.5-and-tvOS-15.4-and-macOS-12.3-Beta-4",
  ),
  source(
    "9to5-85-pb4",
    "9to5Mac",
    "https://9to5mac.com/2022/02/23/apple-releases-watchos-8-5-beta-4-as-rc-version-approaches/",
    {
      note:
        "Platform-specific Beta 4 report updated for public availability on February 23.",
    },
  ),
  source(
    "9to5-85-pb5",
    "9to5Mac",
    "https://9to5mac.com/2022/03/02/apple-releases-watchos-8-5-beta-5-developers/",
    {
      note:
        "Conflict source whose title/update identifies Public Beta 5 on March 2 but whose body contains a Beta 4 typo.",
    },
  ),
  living(
    "iculture-85-cycle",
    "https://www.iculture.nl/nieuws/watchos-8-5-beta/",
    "Conflict chronology dating Public Beta 4 one day earlier and omitting a separate Public Beta 5 row.",
  ),
  source(
    "ithinkdiff-86-cycle",
    "iThinkDiff",
    "https://www.ithinkdiff.com/watchos-8-6-beta-developers/",
    {
      sourceClass: "contemporaneousLivingChronology",
      note:
        "Only retained publisher explicitly identifying the April 6 seed as watchOS 8.6 Public Beta 1.",
    },
  ),
  negative(
    "geeky-86-pb1-negative",
    "Geeky Gadgets",
    "https://www.geeky-gadgets.com/apple-releases-watchos-8-6-beta-1-06-04-2022/",
    "Same-day report describing watchOS 8.6 Beta 1 as developer-only and saying public availability was expected later.",
  ),
  source(
    "9to5-86-pb2",
    "9to5Mac",
    "https://9to5mac.com/2022/04/20/apple-releases-beta-2-ios-15-5-ipados-tvos-watchos-8-6/",
    {
      note:
        "Beta 2 report updated to state that the releases, including watchOS 8.6, reached public testers.",
    },
  ),
  negative(
    "geeky-86-pb2-negative",
    "Geeky Gadgets",
    "https://www.geeky-gadgets.com/watchos-8-6-beta-2-released-to-developers-20-04-2022/",
    "Same-day report identifying the seed as developer-only and saying public availability was still expected.",
  ),
  source(
    "9to5-86-pb3",
    "9to5Mac",
    "https://9to5mac.com/2022/04/27/apple-releases-watchos-8-6-beta-3-to-developers/",
    {
      note:
        "Platform-specific report explicitly updated for Public Beta 3 on April 27.",
    },
  ),
  source(
    "9to5-86-pb4",
    "9to5Mac",
    "https://9to5mac.com/2022/05/04/watchos-8-6-beta-4-available/",
    {
      note:
        "Platform-specific report explicitly updated for Public Beta 4 on May 4.",
    },
  ),
  living(
    "iculture-87-cycle",
    "https://www.iculture.nl/nieuws/watchos-8-7-beta/",
    "Cycle chronology with explicit Public Beta 1 through Public Beta 5 rows.",
  ),
  source(
    "9to5-87-pb1",
    "9to5Mac",
    "https://9to5mac.com/2022/05/19/ios-15-6-beta-1-available-public-beta-testers/",
    {
      note:
        "Public Beta 1 report explicitly including watchOS 8.7.",
    },
  ),
  source(
    "9to5-87-pb2",
    "9to5Mac",
    "https://9to5mac.com/2022/06/01/ios-15-6-beta-2-now-available/",
    {
      note:
        "Beta 2 report updated for public availability and explicitly including watchOS 8.7.",
    },
  ),
  source(
    "9to5-87-pb4",
    "9to5Mac",
    "https://9to5mac.com/2022/06/28/ios-15-6-beta-4-available-developers/",
    {
      note:
        "Beta 4 report updated for public availability and explicitly including watchOS 8.7.",
    },
  ),
  source(
    "kob-87-pb5",
    "Kobonemi",
    "https://www.kobonemi.com/entry/2022/07/06/iOS-15.6-and-iPadOS-15.6-and-watchOS-8.7-and-tvOS-15.6-and-macOS-12.5-Beta-5",
    {
      note:
        "Explicit watchOS 8.7 Public Beta 5 report; Japanese publication day maps to July 5 Pacific.",
    },
  ),
  source(
    "9to5-91-pb2",
    "9to5Mac",
    "https://9to5mac.com/2022/09/21/ios-16-1-public-beta-2/",
    {
      note:
        "Public Beta 2 report explicitly including watchOS 9.1.",
    },
  ),
  source(
    "mr-91-pb2",
    "MacRumors",
    "https://www.macrumors.com/2022/09/21/apple-seeds-ios-16-1-public-beta-2/",
    {
      note:
        "Independent Public Beta 2 report explicitly including watchOS 9.1.",
    },
  ),
  source(
    "9to5-91-pb3",
    "9to5Mac",
    "https://9to5mac.com/2022/09/28/ios-16-1-public-beta-3/",
    {
      note:
        "Public Beta 3 report explicitly including watchOS 9.1.",
    },
  ),
  source(
    "maclife-91-pb3",
    "Mac Life",
    "https://www.maclife.de/news/ios-161-public-beta-3-jetzt-verfuegbar-100121403.html",
    {
      note:
        "Independent report explicitly including watchOS 9.1 Public Beta 3.",
    },
  ),
  source(
    "9to5-91-pb4",
    "9to5Mac",
    "https://9to5mac.com/2022/10/06/watchos-9-1-beta-4-now-available/",
    {
      note:
        "Platform-specific Public Beta 4 report.",
    },
  ),
  source(
    "times-91-pb4",
    "The Times of India",
    "https://timesofindia.indiatimes.com/gadgets-news/apple-starts-rolling-out-watchos-9-1-beta-4-to-public-beta-users/articleshow/94697938.cms",
    {
      note:
        "Independent platform-specific report explicitly identifying Public Beta 4.",
    },
  ),
  source(
    "9to5-91-pb5",
    "9to5Mac",
    "https://9to5mac.com/2022/10/12/watchos-9-1-beta-5-update-now-available/",
    {
      note:
        "Platform-specific report updated for Public Beta 5 on October 12.",
    },
  ),
  source(
    "imore9-public-rolling",
    "iMore",
    "https://www.imore.com/how-download-watchos-9-public-beta",
    {
      sourceClass: "contemporaneousLivingChronology",
      localReusePath:
        "tmp/research-evidence/beta-chronology-gap/watchos-major-7-26/source-024-imore-watchos9-rolling.html",
      note:
        "Hash-reused watchOS 9 public-beta chronology, including the watchOS 9.1 Public Beta 5 appearance.",
    },
  ),
  negative(
    "kob-91-pb1-negative",
    "Kobonemi",
    "https://www.kobonemi.com/entry/2022/09/15/iOS-16.1-and-watchOS-9.1-and-tvOS-16.1-Beta-1-and-iPadOS-16.1-Beta-2",
    "Contemporary report explicitly saying the first watchOS 9.1 seed was not yet public.",
  ),
  source(
    "9to5-264-pb1",
    "9to5Mac",
    "https://9to5mac.com/2026/02/17/apple-releases-public-beta-1-for-watchos-26-4-tvos-26-4-more/",
  ),
  source(
    "mr-264-pb1",
    "MacRumors",
    "https://www.macrumors.com/2026/02/17/ios-26-4-public-beta-1/",
    {
      note:
        "Independent first-public-beta report explicitly including watchOS 26.4.",
    },
  ),
  source(
    "mr-264-pb2",
    "MacRumors",
    "https://www.macrumors.com/2026/02/24/apple-seeds-macos-tahoe-26-4-public-beta-2/",
    {
      note:
        "Second-public-beta report explicitly including watchOS 26.4.",
    },
  ),
  source(
    "buchi-264-pb2",
    "Buchi Gadget",
    "https://buchi-gadget.com/articles/2026-02-25-041950-ktm",
    {
      note:
        "Independent February 24 Pacific report explicitly stating that watchOS 26.4 Public Beta 2 was released to general testers.",
    },
  ),
  negative(
    "mr-264-pb3-negative",
    "MacRumors",
    "https://www.macrumors.com/2026/03/05/apple-seeds-revised-ios-26-4-beta-3/",
    "Report mentions a third watchOS 26.4 beta but does not establish a public audience or displayed public ordinal.",
  ),
  negative(
    "mr-264-pb4-negative",
    "MacRumors",
    "https://www.macrumors.com/2026/03/09/apple-seeds-watchos-26-4-beta-4/",
    "Platform-specific report establishes Developer Beta 4 only; it does not establish a watchOS public appearance.",
  ),
  source(
    "9to5-264-pb4-reported",
    "9to5Mac",
    "https://9to5mac.com/2026/03/09/apple-releases-beta-4-for-ipados-26-4-tvos-26-4-and-more/",
    {
      note:
        "Full-lineup Beta 4 report updated to say public betas rolled out later. It is retained as one affirmative lineage but is insufficient alone to establish the exact watchOS Public Beta 4 identity.",
    },
  ),
  source(
    "mr-265-pb1",
    "MacRumors",
    "https://www.macrumors.com/2026/04/03/apple-first-ios-26-5-public-beta/",
    {
      note:
        "First-public-beta report explicitly including watchOS 26.5.",
    },
  ),
  source(
    "9to5-265-pb1",
    "9to5Mac",
    "https://9to5mac.com/2026/04/03/apple-releases-public-betas-for-ipados-26-5-watchos-26-5-and-more/",
    {
      note:
        "Independent report explicitly identifying watchOS 26.5 Public Beta 1.",
    },
  ),
  source(
    "mr-265-pb2",
    "MacRumors",
    "https://www.macrumors.com/2026/04/14/apple-seeds-ios-26-5-public-beta-2/",
    {
      note:
        "Second-public-beta report explicitly including watchOS 26.5.",
    },
  ),
  source(
    "9to5-265-pb2",
    "9to5Mac",
    "https://9to5mac.com/2026/04/14/apple-releases-public-beta-2-for-ipados-26-5-tvos-26-5-and-more/",
    {
      note:
        "Independent report explicitly identifying watchOS 26.5 Public Beta 2.",
    },
  ),
  source(
    "9to5-265-pb3",
    "9to5Mac",
    "https://9to5mac.com/2026/04/21/public-beta-3-for-ipados-26-5-watchos-26-5-and-more-available-now/",
  ),
  source(
    "tuttotech-265-pb3",
    "TuttoTech",
    "https://www.tuttotech.net/news/2026/04/20/apple-beta-3-ios-26-5-ipados-macos-tahoe-watchos-tvos-visionos-dettagli-download.html",
    {
      note:
        "Independent article updated April 21 to state that the third public betas, explicitly including watchOS 26.5, had begun rolling out.",
    },
  ),
  source(
    "9to5-265-pb4",
    "9to5Mac",
    "https://9to5mac.com/2026/04/27/apple-releases-beta-4-for-ipados-26-5-tvos-26-5-and-more/",
    {
      note:
        "Beta 4 article updated to say that public versions, including watchOS 26.5, rolled out later the same day.",
    },
  ),
  negative(
    "mr-265-pb4-dev",
    "MacRumors",
    "https://www.macrumors.com/2026/04/27/apple-seeds-watchos-26-5-beta-4/",
    "Same-day platform-specific report establishes Developer Beta 4 only and does not independently corroborate the public appearance.",
  ),
  source(
    "mr-266-pb1",
    "MacRumors",
    "https://www.macrumors.com/2026/05/28/apple-seeds-ios-26-6-public-beta-1/",
    {
      note:
        "First-public-beta report explicitly including watchOS 26.6.",
    },
  ),
  source(
    "9to5-266-pb1",
    "9to5Mac",
    "https://9to5mac.com/2026/05/28/apple-releases-public-beta-for-ipados-26-6-tvos-26-6-and-watchos-26-6/",
  ),
  source(
    "mr-266-pb2",
    "MacRumors",
    "https://www.macrumors.com/2026/06/16/apple-ios-26-6-public-beta-2/",
    {
      note:
        "Second-public-beta report explicitly including watchOS 26.6.",
    },
  ),
  source(
    "9to5-266-pb2",
    "9to5Mac",
    "https://9to5mac.com/2026/06/16/macos-26-6-beta-2-rolling-out-now-plus-ipados-26-6-watchos-26-6-tvos-26-6-more/",
    {
      note:
        "Beta 2 report updated for public distribution and explicitly including watchOS 26.6.",
    },
  ),
  source(
    "mr-266-pb3",
    "MacRumors",
    "https://www.macrumors.com/2026/06/30/ios-26-6-public-beta-3/",
    {
      note:
        "Public Beta 3 report explicitly including watchOS 26.6 on June 30.",
    },
  ),
  source(
    "9to5-266-pb3",
    "9to5Mac",
    "https://9to5mac.com/2026/06/29/beta-3-for-ipados-26-6-watchos-26-6-and-more-now-available/",
    {
      note:
        "June 29 developer article updated June 30 for public beta availability.",
    },
  ),
  source(
    "mr-266-pb4",
    "MacRumors",
    "https://www.macrumors.com/2026/07/07/apple-seeds-ios-26-6-public-beta-4/",
    {
      note:
        "Public Beta 4 report explicitly including watchOS 26.6.",
    },
  ),
  source(
    "9to5-266-pb5",
    "9to5Mac",
    "https://9to5mac.com/2026/07/13/apple-rolls-beta-5-for-ipados-26-6-tvos-26-6-watchos-26-6-more/",
    {
      note:
        "Developer article updated July 14 to state that Public Beta 5 was available; retained for the date conflict.",
    },
  ),
  negative(
    "mr-266-pb5-dev",
    "MacRumors",
    "https://www.macrumors.com/2026/07/13/apple-seeds-watchos-26-6-beta-5/",
    "July 13 platform-specific report establishes the developer seed only.",
  ),
  living(
    "iculture-266-cycle",
    "https://www.iculture.nl/nieuws/watchos-26-6-beta/",
    "Living chronology retained because its Public Beta 3 and Public Beta 5 dates conflict with independently observed public-update dates.",
  ),
];
