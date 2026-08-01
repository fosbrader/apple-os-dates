const spec = (
  sourceId,
  publisher,
  canonicalUrl,
  {
    sourceClass = "contemporaneousSecondary",
    localReusePath,
    localPreferredPath,
    archiveUrl,
    archiveCapturedAt,
    roles = [
      "publicAvailability",
      "publicOrdinal",
      "appearanceDate",
      "channelIdentity",
    ],
    note,
  } = {},
) => ({
  sourceId,
  publisher,
  canonicalUrl,
  sourceClass,
  ...(localReusePath ? {localReusePath} : {}),
  ...(localPreferredPath ? {localPreferredPath} : {}),
  ...(archiveUrl ? {archiveUrl} : {}),
  ...(archiveCapturedAt ? {archiveCapturedAt} : {}),
  roles,
  note:
    note ??
    "Contemporary release reporting retained as claim-level chronology evidence.",
});

export const sourceSpecs = [
  spec(
    "imore-ios12-history",
    "iMore",
    "https://www.imore.com/how-download-ios-12-public-beta",
    {
      sourceClass: "contemporaneousLivingChronology",
      localReusePath:
        "tmp/research-evidence/beta-chronology-gap/ios-major-12-18/fresh-imore-ios12.html",
      note:
        "Rolling iOS 12 public-beta history. Only explicit retained rows are used.",
    },
  ),
  spec(
    "imore-ios13-history",
    "iMore",
    "https://www.imore.com/how-download-ios-13-public-beta",
    {
      sourceClass: "contemporaneousLivingChronology",
      localReusePath:
        "tmp/research-evidence/beta-chronology-gap/ios-major-12-18/fresh-imore-ios13.html",
      note:
        "Rolling iOS 13 public-beta history. Only explicit retained rows are used.",
    },
  ),
  spec(
    "imore-ios14-history",
    "iMore",
    "https://www.imore.com/how-download-ios-14-public-beta",
    {
      sourceClass: "contemporaneousLivingChronology",
      localReusePath:
        "tmp/research-evidence/beta-chronology-gap/ios-major-12-18/fresh-imore-ios14.html",
      note:
        "Rolling iOS 14 public-beta history. Known date and copy errors are preserved in conflicts.json.",
    },
  ),
  spec(
    "imore-ipados13-history",
    "iMore",
    "https://www.imore.com/how-download-ipados-13-public-beta",
    {
      sourceClass: "contemporaneousLivingChronology",
      localReusePath:
        "tmp/research-evidence/beta-chronology-gap/ipados-major-13-26/source-201-imore-ipados13-cycle.html",
      note:
        "Rolling iPadOS 13 public-beta history. Only explicit retained rows are used.",
    },
  ),
  spec(
    "imore-ipados14-history",
    "iMore",
    "https://www.imore.com/how-download-ipados-14-public-beta",
    {
      sourceClass: "contemporaneousLivingChronology",
      localReusePath:
        "tmp/research-evidence/beta-chronology-gap/ipados-major-13-26-second-lineage/source-01-imore-ipados14-public-beta-history.html",
      note:
        "Rolling iPadOS 14 public-beta history. Known date and copy errors are preserved in conflicts.json.",
    },
  ),
  ...[
    "12-1",
    "12-1-1",
    "12-1-2",
    "12-1-3",
    "12-2",
    "12-3",
    "12-4",
    "13-1",
    "13-2",
    "13-3",
    "13-4",
    "13-5",
    "13-6",
    "13-7",
    "14-2",
    "14-3",
    "14-4",
    "14-5",
    "14-6",
    "14-7",
  ].map((slug) =>
    spec(
      `iculture-ios-${slug}`,
      "iCulture",
      `https://www.iculture.nl/nieuws/ios-${slug}-beta/`,
      {
        sourceClass: "contemporaneousLivingChronology",
        localPreferredPath: `/tmp/ios-ipados-points-iculture/ios-${slug}-beta.html`,
        note:
          "Living Dutch cycle timeline. Local calendar rollovers and any inaccurate rows are preserved as qualifications rather than silently normalized.",
      },
    ),
  ),
  ...[
    [
      "mr-ios-12-1-pb1",
      "https://www.macrumors.com/2018/09/20/apple-seeds-first-ios-12-1-public-beta/",
    ],
    [
      "mr-ios-12-1-pb2",
      "https://www.macrumors.com/2018/10/02/apple-seeds-ios-12-1-beta-2-to-developers/",
    ],
    [
      "mr-ios-12-1-pb3",
      "https://www.macrumors.com/2018/10/09/apple-seeds-ios-12-1-beta-3-to-developers/",
    ],
    [
      "mr-ios-12-1-pb4",
      "https://www.macrumors.com/2018/10/15/apple-seeds-ios-12-1-beta-4-to-developers/",
    ],
    [
      "mr-ios-12-1-pb5",
      "https://www.macrumors.com/2018/10/22/apple-seeds-ios-12-1-beta-5-to-developers/",
    ],
    [
      "mr-ios-12-1-1-pb1",
      "https://www.macrumors.com/2018/11/01/apple-seeds-first-ios-12-1-1-public-beta/",
    ],
    [
      "mr-ios-12-1-1-pb2",
      "https://www.macrumors.com/2018/11/07/apple-seeds-ios-12-1-1-beta-2-to-developers/",
    ],
    [
      "mr-ios-12-1-1-pb3",
      "https://www.macrumors.com/2018/11/15/apple-seeds-ios-12-1-1-beta-3-to-developers/",
    ],
    [
      "mr-ios-12-1-2-pb1",
      "https://www.macrumors.com/2018/12/11/first-public-betas-ios-tvos-12-1-2-macos-10-14-3/",
    ],
    [
      "mr-ios-12-1-3-pb2",
      "https://www.macrumors.com/2018/12/19/apple-seeds-new-ios-12-1-3-beta-to-developers/",
    ],
    [
      "mr-ios-12-1-3-pb3",
      "https://www.macrumors.com/2019/01/07/apple-seeds-ios-12-1-3-beta-3-to-developers/",
    ],
    [
      "mr-ios-12-1-3-pb4",
      "https://www.macrumors.com/2019/01/10/apple-seeds-ios-12-1-3-beta-4-to-developers/",
    ],
    [
      "mr-ios-12-2-pb1",
      "https://www.macrumors.com/2019/01/28/apple-releases-ios-12-2-public-beta-1/",
    ],
    [
      "mr-ios-12-2-pb2",
      "https://www.macrumors.com/2019/02/05/apple-releases-ios-12-2-public-beta-2/",
    ],
    [
      "mr-ios-12-2-pb3",
      "https://www.macrumors.com/2019/02/20/apple-releases-ios-12-2-public-beta-3/",
    ],
    [
      "mr-ios-12-2-pb4",
      "https://www.macrumors.com/2019/03/04/apple-seeds-ios-12-2-beta-4-to-developers/",
    ],
    [
      "mr-ios-12-2-pb5",
      "https://www.macrumors.com/2019/03/11/apple-releases-ios-12-2-beta-5/",
    ],
    [
      "mr-ios-12-2-pb6",
      "https://www.macrumors.com/2019/03/18/apple-releases-ios-12-2-beta-6/",
    ],
    [
      "mr-ios-12-3-pb1",
      "https://www.macrumors.com/2019/03/28/apple-releases-ios-12-3-public-beta-1/",
    ],
    [
      "mr-ios-12-3-pb2",
      "https://www.macrumors.com/2019/04/09/apple-releases-ios-12-3-public-beta-2/",
    ],
    [
      "mr-ios-12-3-pb3",
      "https://www.macrumors.com/2019/04/23/apple-seeds-ios-12-3-public-beta-3/",
    ],
    [
      "mr-ios-12-3-pb4",
      "https://www.macrumors.com/2019/04/29/apple-releases-ios-12-3-beta-4-to-developers/",
    ],
    [
      "mr-ios-12-3-pb5",
      "https://www.macrumors.com/2019/05/07/apple-seeds-ios-12-3-beta-5-to-developers/",
    ],
    [
      "mr-ios-12-3-pb6",
      "https://www.macrumors.com/2019/05/10/apple-releases-ios-12-3-beta-6-to-developers/",
    ],
    [
      "mr-ios-12-4-pb2",
      "https://www.macrumors.com/2019/05/20/apple-seeds-ios-12-4-beta-2-to-developers/",
    ],
    [
      "mr-ios-12-4-pb3",
      "https://www.macrumors.com/2019/05/28/apple-seeds-ios-12-4-beta-3-to-developers/",
    ],
    [
      "mr-ios-12-4-dev4",
      "https://www.macrumors.com/2019/06/11/apple-seeds-ios-12-4-beta-4-to-developers/",
    ],
    [
      "mr-ios-12-4-dev5",
      "https://www.macrumors.com/2019/06/24/apple-seeds-ios-12-4-beta-5-to-developers/",
    ],
    [
      "mr-ios-12-4-dev6",
      "https://www.macrumors.com/2019/07/09/ios-12-4-developer-beta-6/",
    ],
    [
      "mr-ios-12-4-pb7",
      "https://www.macrumors.com/2019/07/16/apple-releases-ios-12-4-beta-7-to-developers/",
    ],
    [
      "mr-13-1-pb1",
      "https://www.macrumors.com/2019/08/28/apple-seeds-ios-13-1-public-beta/",
    ],
    [
      "mr-13-1-pb2",
      "https://www.macrumors.com/2019/09/04/apple-seeds-ios-13-1-beta-2-to-developers/",
    ],
    [
      "mr-13-1-pb3",
      "https://www.macrumors.com/2019/09/11/apple-seeds-ios-13-1-public-beta-3/",
    ],
    [
      "mr-13-1-pb4",
      "https://www.macrumors.com/2019/09/18/apple-seeds-ios-13-1-beta-4-to-developers/",
    ],
    [
      "mr-13-2-pb1",
      "https://www.macrumors.com/2019/10/02/apple-seeds-first-betas-of-ios-13-2-and-ipados-13-2/",
    ],
    [
      "mr-13-2-pb2",
      "https://www.macrumors.com/2019/10/10/apple-seeds-ios-13-2-beta-2-to-developers/",
    ],
    [
      "mr-13-2-pb3",
      "https://www.macrumors.com/2019/10/16/ios-13-2-beta-3/",
    ],
    [
      "mr-13-2-pb4",
      "https://www.macrumors.com/2019/10/23/apple-seeds-ios-13-2-beta-4-to-developers/",
    ],
    [
      "mr-13-3-pb1",
      "https://www.macrumors.com/2019/11/06/apple-seeds-ios-13-3-public-beta-1/",
    ],
    [
      "mr-13-3-pb2",
      "https://www.macrumors.com/2019/11/12/apple-seeds-ios-13-3-beta-2-to-developers/",
    ],
    [
      "mr-13-3-pb3",
      "https://www.macrumors.com/2019/11/20/apple-seeds-ios-13-3-beta-3-to-developers/",
    ],
    [
      "mr-13-3-pb4",
      "https://www.macrumors.com/2019/12/05/apple-seeds-ios-13-3-beta-4-to-developers/",
    ],
    [
      "mr-13-4-pb1",
      "https://www.macrumors.com/2020/02/10/apple-seeds-first-ios-13-4-public-beta/",
    ],
    [
      "mr-13-4-pb2",
      "https://www.macrumors.com/2020/02/20/apple-seeds-ios-13-4-public-beta-2/",
    ],
    [
      "mr-13-4-pb3",
      "https://www.macrumors.com/2020/02/26/apple-seeds-ios-13-4-beta-3-to-developers/",
    ],
    [
      "mr-13-4-pb4",
      "https://www.macrumors.com/2020/03/03/apple-seeds-ios-13-4-beta-4-to-developers/",
    ],
    [
      "mr-13-4-pb5",
      "https://www.macrumors.com/2020/03/10/apple-seeds-ios-13-4-beta-5-to-developers/",
    ],
    [
      "mr-13-5-pb2",
      "https://www.macrumors.com/2020/04/29/apple-seeds-third-ios-13-5-beta-to-developers/",
    ],
    [
      "mr-13-5-pb3",
      "https://www.macrumors.com/2020/05/06/apple-seeds-ios-13-5-beta-4-to-developers/",
    ],
    [
      "mr-13-6-pb2",
      "https://www.macrumors.com/2020/06/09/apple-releases-ios-13-6-beta-2-to-developers/",
    ],
    [
      "mr-13-6-pb3",
      "https://www.macrumors.com/2020/06/30/apple-seeds-ios-13-6-beta-3-to-developers/",
    ],
    [
      "mr-13-7-pb1",
      "https://www.macrumors.com/2020/08/26/apple-seeds-first-ios-13-7-beta-to-developers/",
    ],
    [
      "mr-14-2-pb1",
      "https://www.macrumors.com/2020/09/21/apple-releases-first-ios-14-2-public-beta/",
    ],
    [
      "mr-14-2-pb2",
      "https://www.macrumors.com/2020/09/30/apple-releases-ios-14-2-public-beta-2/",
    ],
    [
      "mr-14-2-pb3",
      "https://www.macrumors.com/2020/10/14/apple-releases-ios-14-2-public-beta-3/",
    ],
    [
      "mr-14-2-pb4",
      "https://www.macrumors.com/2020/10/21/apple-releases-ios-14-2-public-beta-4/",
    ],
    [
      "mr-14-3-pb1",
      "https://www.macrumors.com/2020/11/13/apple-seeds-ios-14-3-public-beta-1/",
    ],
    [
      "mr-14-3-pb2",
      "https://www.macrumors.com/2020/11/17/apple-seeds-ios-14-3-beta-2-to-developers/",
    ],
    [
      "mr-14-3-pb3",
      "https://www.macrumors.com/2020/12/02/apple-releases-ios-14-3-beta-3-to-developers/",
    ],
    [
      "mr-14-4-pb1",
      "https://www.macrumors.com/2020/12/17/apple-seeds-ios-14-4-public-beta-1/",
    ],
    [
      "mr-14-4-pb2",
      "https://www.macrumors.com/2021/01/13/apple-releases-ios-14-4-beta-2-to-developers/",
    ],
    [
      "mr-14-5-pb1",
      "https://www.macrumors.com/2021/02/04/apple-seeds-ios-14-5-beta-1-update/",
    ],
    [
      "mr-14-5-pb2",
      "https://www.macrumors.com/2021/02/17/apple-seeds-ios-14-5-public-beta-2/",
    ],
    [
      "mr-14-5-pb3",
      "https://www.macrumors.com/2021/03/03/apple-seeds-ios-14-5-public-beta-3/",
    ],
    [
      "mr-14-5-pb4",
      "https://www.macrumors.com/2021/03/15/apple-seeds-ios-14-5-beta-4-to-developers/",
    ],
    [
      "mr-14-5-pb5",
      "https://www.macrumors.com/2021/03/23/apple-seeds-ios-14-5-beta-5-to-developers/",
    ],
    [
      "mr-14-5-pb6",
      "https://www.macrumors.com/2021/03/31/apple-seeds-ios-14-5-beta-6-to-developers/",
    ],
    [
      "mr-14-5-pb7",
      "https://www.macrumors.com/2021/04/07/ios-14-5-beta-7/",
    ],
    [
      "mr-14-5-pb8",
      "https://www.macrumors.com/2021/04/13/apple-seeds-ios-14-5-beta-8-to-developers/",
    ],
    [
      "mr-14-6-pb1",
      "https://www.macrumors.com/2021/04/23/apple-seeds-first-ios-14-6-public-beta/",
    ],
    [
      "mr-14-6-pb2",
      "https://www.macrumors.com/2021/04/30/apple-seeds-ios-14-6-beta-2-to-developers/",
    ],
    [
      "mr-14-6-pb3",
      "https://www.macrumors.com/2021/05/10/apple-seeds-ios-14-6-beta-3-to-developers/",
    ],
    [
      "mr-14-7-pb1",
      "https://www.macrumors.com/2021/05/20/apple-ios-14-7-public-beta-1/",
    ],
    [
      "mr-14-7-dev2",
      "https://www.macrumors.com/2021/06/02/apple-seeds-ios-14-7-beta-2-to-developers/",
    ],
    [
      "mr-14-7-pb3",
      "https://www.macrumors.com/2021/06/14/apple-seeds-ios-14-7-beta-3/",
    ],
    [
      "mr-14-7-pb4",
      "https://www.macrumors.com/2021/06/29/apple-seeds-ios-14-7-beta-4-to-developers/",
    ],
    [
      "mr-14-7-pb5",
      "https://www.macrumors.com/2021/07/08/apple-seeds-ios-14-7-beta-5/",
    ],
  ].map(([sourceId, url]) => spec(sourceId, "MacRumors", url)),
  spec(
    "gh-ios-12-4-pb2",
    "Gadget Hacks",
    "https://ios.gadgethacks.com/news/apple-releases-second-ios-12-4-public-beta-for-iphone-software-testers-0197839/",
    {
      note:
        "Explicit Public Beta 2 appearance and explicit statement that Public Beta 1 did not ship.",
      localPreferredPath: "/tmp/gh-pb2-archive.html",
      archiveUrl:
        "https://web.archive.org/web/20190611063416id_/https://ios.gadgethacks.com/news/apple-releases-second-ios-12-4-public-beta-for-iphone-software-testers-0197839/",
      archiveCapturedAt: "2019-06-11T06:34:16Z",
    },
  ),
  spec(
    "gh-ios-12-4-pb4",
    "Gadget Hacks",
    "https://ios.gadgethacks.com/news/apple-releases-ios-12-4-public-beta-4-for-iphone-0198693/",
    {
      roles: [
        "publicAvailability",
        "publicOrdinal",
        "appearanceDate",
        "channelIdentity",
        "dateConflictResolution",
      ],
      note:
        "Explicitly places Public Beta 4 on June 12, one day after the developer seed.",
      localPreferredPath: "/tmp/gh-pb4-archive.html",
      archiveUrl:
        "https://web.archive.org/web/20190723032350id_/https://ios.gadgethacks.com/news/apple-releases-ios-12-4-public-beta-4-for-iphone-0198693/",
      archiveCapturedAt: "2019-07-23T03:23:50Z",
    },
  ),
  spec(
    "forbes-ios-12-4-pb4",
    "Forbes",
    "https://www.forbes.com/sites/anthonykarcz/2019/06/12/ios-12-4-public-beta-4-released-is-boring-heres-how-to-get-dark-mode-now/",
    {
      roles: [
        "publicAvailability",
        "publicOrdinal",
        "appearanceDate",
        "channelIdentity",
        "dateConflictResolution",
      ],
      note:
        "Independent June 12 Public Beta 4 report used to resolve the developer/public one-day split.",
    },
  ),
  spec(
    "gh-ios-12-4-pb5",
    "Gadget Hacks",
    "https://ios.gadgethacks.com/news/apple-releases-ios-12-4-beta-5-for-developers-public-beta-testers-0199665/",
    {
      localPreferredPath: "/tmp/gh-pb5-archive.html",
      archiveUrl:
        "https://web.archive.org/web/20190701000000id_/https://ios.gadgethacks.com/news/apple-releases-ios-12-4-beta-5-for-developers-public-beta-testers-0199665/",
      archiveCapturedAt:
        "nearest available replay selected by the Internet Archive for 2019-07-01",
    },
  ),
  spec(
    "gh-ios-12-4-pb6",
    "Gadget Hacks",
    "https://ios.gadgethacks.com/news/apple-just-released-ios-12-4-beta-6-for-developers-public-testers-0200909/",
    {
      localPreferredPath: "/tmp/gh-pb6-archive.html",
      archiveUrl:
        "https://web.archive.org/web/20190718111128id_/https://ios.gadgethacks.com/news/apple-just-released-ios-12-4-beta-6-for-developers-public-testers-0200909/",
      archiveCapturedAt: "2019-07-18T11:11:28Z",
    },
  ),
  spec(
    "osxd-13-1-pb1",
    "OS X Daily",
    "https://osxdaily.com/2019/08/28/ios-13-1-public-beta-1/",
  ),
  spec(
    "9to5mac-13-1-pb2",
    "9to5Mac",
    "https://9to5mac.com/2019/09/04/ios-13-1-developer-beta-2/",
  ),
  spec(
    "itopnews-13-1-pb3",
    "iTopnews",
    "https://www.itopnews.de/2019/09/ios-13-1-public-beta-3-und-ipados-13-1-public-beta-3-sind-da/",
  ),
  spec(
    "osxd-13-1-pb4",
    "OS X Daily",
    "https://osxdaily.com/2019/09/18/beta-4-of-ios-13-1-ipados-13-1-available-to-download/",
  ),
  spec(
    "corriente-13-7-pb1",
    "CoRRiENTE.top",
    "https://corriente.jp/ios13-7-ipados13-7-publicbeta/",
    {
      note:
        "Japanese report explicitly names both public platforms and states the Pacific availability date in its body.",
    },
  ),
  spec(
    "shiftdelete-ios-ipados-13-3-pb3",
    "ShiftDelete.Net",
    "https://shiftdelete.net/ios-13-3-public-beta-3-yayinlandi",
    {
      note:
        "Contemporary report explicitly names iOS 13.3 Public Beta 3 and iPadOS 13.3 Public Beta 3 on November 20.",
    },
  ),
  spec(
    "9to5mac-ios-ipados-14-1-skipped",
    "9to5Mac",
    "https://9to5mac.com/2020/09/21/ios-14-2-public-beta-release/",
    {
      roles: ["negativeSequence", "cycleBoundary"],
      note:
        "Contemporary report says Apple skipped straight to 14.2 for beta testing.",
    },
  ),
  spec(
    "mr-ios-ipados-14-1-gm-only",
    "MacRumors",
    "https://www.macrumors.com/2020/10/13/apple-releases-ios-14-1-and-ipados-14-1/",
    {
      roles: ["negativeSequence", "cycleBoundary"],
      note:
        "Records the 14.1 GM as developer-exclusive before the final release.",
    },
  ),
  spec(
    "osxd-ios-ipados-14-3-pb3",
    "OS X Daily",
    "https://osxdaily.com/2020/12/02/ios-14-3-beta-3-ipados-14-3-beta-3-available-for-testing/",
  ),
  spec(
    "purudo-ios-ipados-14-4-pb2",
    "Purudo.net",
    "https://xn--p9j1ayd.net/archives/46710",
    {
      note:
        "Japanese local-date report explicitly names iOS and iPadOS Public Beta 2; Pacific normalization is documented.",
    },
  ),
  spec(
    "itopnews-ios-ipados-14-5-pb5",
    "iTopnews",
    "https://www.itopnews.de/2021/03/ios-14-5-und-ipados-14-5-public-beta-5-ist-da/",
  ),
  spec(
    "osxd-ios-ipados-14-5-pb6",
    "OS X Daily",
    "https://osxdaily.com/2021/03/31/beta-6-of-ios-14-5-ipados-14-5-macos-big-sur-11-3-available-for-testing/",
  ),
  spec(
    "osxd-ios-ipados-14-6-pb2",
    "OS X Daily",
    "https://osxdaily.com/2021/04/30/beta-2-of-ios-14-6-ipados-14-6-available-for-testing/",
    {
      note:
        "Contemporary report explicitly names iOS 14.6 and iPadOS 14.6 Beta 2 and states that the builds were available to both developer and public beta programs.",
    },
  ),
  spec(
    "9to5mac-ios-ipados-14-8-no-beta",
    "9to5Mac",
    "https://9to5mac.com/2021/09/13/apple-releasing-ios-14-8-and-ipados-14-8-to-the-public-today/",
    {
      roles: ["negativeSequence", "releasedWithoutBetaTesting"],
      note:
        "Direct contemporary statement that iOS 14.8 was not beta-tested, in an article covering both iOS and iPadOS 14.8.",
    },
  ),
  spec(
    "mr-ios-ipados-14-8-final",
    "MacRumors",
    "https://www.macrumors.com/2021/09/13/apple-releases-ios-14-8-with-security-updates/",
    {
      roles: ["negativeSequence", "finalReleaseBoundary"],
      note:
        "Contemporary final-release boundary for both iOS and iPadOS 14.8.",
    },
  ),
];
