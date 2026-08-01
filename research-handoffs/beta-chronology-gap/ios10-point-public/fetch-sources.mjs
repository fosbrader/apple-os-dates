import {createHash} from "node:crypto";
import {mkdir, writeFile} from "node:fs/promises";
import path from "node:path";

const batchId = "beta-chronology-gap-ios10-point-public";
const evidenceRoot =
  "tmp/research-evidence/beta-chronology-gap/ios10-point-public";
const rawDir = path.join(evidenceRoot, "raw");
const selectedDir = path.join(evidenceRoot, "selected");
const capturedAt = new Date().toISOString();

const candidateId = (version, sequence) =>
  `candidate:apple:ios:${version}:public-beta-${sequence}`;

const commonRoles = [
  "publicAvailability",
  "publicOrdinal",
  "appearanceDate",
  "channelIdentity",
];

const source = ({
  sourceId,
  canonicalUrl,
  publisher,
  publishedDateObserved,
  candidates,
  title = null,
  author = null,
  roles = commonRoles,
  sourceClass = "journalism",
  locator = "Page metadata, headline, and candidate-specific article lead or update paragraph.",
  supportNote = "Contemporary report supports the public-beta identity and appearance chronology.",
  independentForCorroboration = true,
}) => ({
  sourceId,
  canonicalUrl,
  publisher,
  publishedDateObserved,
  candidateIds: candidates.map(([version, sequence]) =>
    candidateId(version, sequence),
  ),
  title,
  author,
  roles,
  sourceClass,
  locator,
  supportNote,
  independentForCorroboration,
});

const sources = [
  // iOS 10.1
  source({
    sourceId: "source-ios101-pb1-9to5mac",
    canonicalUrl:
      "https://9to5mac.com/2016/09/22/apple-seeds-ios-10-1-public-beta-portrait-mode/?extended-comments=1",
    publisher: "9to5Mac",
    publishedDateObserved: "2016-09-22",
    candidates: [["10.1", 1]],
  }),
  source({
    sourceId: "source-ios101-pb1-idb",
    canonicalUrl:
      "https://www.idownloadblog.com/2016/09/22/apple-releases-ios-10-1-beta-1-to-public-testers/",
    publisher: "iDownloadBlog",
    publishedDateObserved: "2016-09-22",
    candidates: [["10.1", 1]],
  }),
  source({
    sourceId: "source-ios101-pb2-macrumors",
    canonicalUrl:
      "https://www.macrumors.com/2016/10/05/apple-seeds-ios-10-1-public-beta-2/",
    publisher: "MacRumors",
    publishedDateObserved: "2016-10-05",
    candidates: [["10.1", 2]],
  }),
  source({
    sourceId: "source-ios101-pb2-idevice",
    canonicalUrl:
      "https://www.idevice.ro/2016/10/05/ios-10-1-public-beta-2/",
    publisher: "iDevice.ro",
    publishedDateObserved: "2016-10-05",
    candidates: [["10.1", 2]],
  }),
  source({
    sourceId: "source-ios101-pb3-macrumors",
    canonicalUrl:
      "https://www.macrumors.com/2016/10/10/apple-seeds-ios-10-1-beta-3-to-developers/",
    publisher: "MacRumors",
    publishedDateObserved: "2016-10-10",
    candidates: [["10.1", 3]],
    locator:
      "Page metadata, headline, article lead, and update stating availability to public beta testers.",
  }),
  source({
    sourceId: "source-ios101-pb3-iphonetricks",
    canonicalUrl:
      "https://www.iphonetricks.org/ios-10-1-developer-and-public-beta-3-now-available-for-testing/",
    publisher: "iPhoneTricks.org",
    publishedDateObserved: "2016-10-10",
    candidates: [["10.1", 3]],
  }),
  source({
    sourceId: "source-ios101-pb3-9to5mac",
    canonicalUrl:
      "https://9to5mac.com/2016/10/10/ios-10-1-beta-3-tvos-10-0-1/",
    publisher: "9to5Mac",
    publishedDateObserved: "2016-10-10",
    candidates: [["10.1", 3]],
    locator:
      "Page metadata and article lead reporting the third iOS 10.1 beta while identifying the non-developer public beta as active.",
    supportNote:
      "Same-day reporting corroborates the third iOS 10.1 seed and active public channel; MacRumors supplies the explicit public-tester identity.",
  }),
  source({
    sourceId: "source-ios101-pb3-macerkopf",
    canonicalUrl:
      "https://www.macerkopf.de/2016/10/10/ios-10-1-beta-3-steht-als-download-bereit/",
    publisher: "Macerkopf",
    publishedDateObserved: "2016-10-10",
    candidates: [["10.1", 3]],
    locator:
      "Headline, publication metadata, and dated update explicitly stating that iOS 10.1 Public Beta 3 was available.",
    supportNote:
      "Independent contemporary update explicitly corroborates the Public Beta 3 identity; its next-day local update is consistent with the October 10 U.S. appearance.",
  }),
  source({
    sourceId: "source-ios101-pb3-idevice",
    canonicalUrl:
      "https://www.idevice.ro/2016/10/11/instalare-ios-10-1-public-beta-3-pe-iphone-si-ipad/",
    publisher: "iDevice.ro",
    publishedDateObserved: "2016-10-11",
    candidates: [["10.1", 3]],
    locator:
      "Headline, publication metadata, and article lead stating that Public Beta 3 was offered the prior evening.",
    supportNote:
      "Independent next-day report explicitly identifies Public Beta 3 and supports the October 10 U.S. appearance date through its prior-evening wording.",
  }),
  source({
    sourceId: "source-ios101-pb4-idb",
    canonicalUrl:
      "https://www.idownloadblog.com/2016/10/17/apple-seeds-ios-10-1-beta-4-to-developers-and-public-beta-testers/",
    publisher: "iDownloadBlog",
    publishedDateObserved: "2016-10-17",
    candidates: [["10.1", 4]],
  }),
  source({
    sourceId: "source-ios101-pb4-neowin",
    canonicalUrl:
      "https://www.neowin.net/news/apple-releases-ios-101-beta-4-to-developers-and-public-beta-testers/",
    publisher: "Neowin",
    publishedDateObserved: "2016-10-17",
    candidates: [["10.1", 4]],
  }),
  source({
    sourceId: "source-ios101-pb4-cultofmac",
    canonicalUrl:
      "https://www.cultofmac.com/news/public-testers-can-now-get-ios-10-1-beta-4",
    publisher: "Cult of Mac",
    publishedDateObserved: "2016-10-17",
    candidates: [["10.1", 4]],
    locator:
      "Page metadata, headline, and article lead explicitly reporting the fourth iOS 10.1 beta for public testers.",
  }),
  source({
    sourceId: "source-ios101-pb5-macrumors",
    canonicalUrl:
      "https://www.macrumors.com/2016/10/19/apple-seeds-ios-10-1-beta-5-to-developers/",
    publisher: "MacRumors",
    publishedDateObserved: "2016-10-19",
    candidates: [["10.1", 5]],
    supportNote:
      "Contemporary report supports Public Beta 5 on 2016-10-19 and limits this seed to iPhone 7 and iPhone 7 Plus.",
  }),
  source({
    sourceId: "source-ios101-pb5-iculture",
    canonicalUrl:
      "https://www.iculture.nl/nieuws/ios-10-1-beta-5-portretfunctie/",
    publisher: "iCulture",
    publishedDateObserved: "2016-10-19",
    candidates: [["10.1", 5]],
    supportNote:
      "Contemporary report supports Public Beta 5 on 2016-10-19 and limits this seed to iPhone 7 and iPhone 7 Plus.",
  }),

  // iOS 10.2
  source({
    sourceId: "source-ios102-pb1-macrumors",
    canonicalUrl:
      "https://www.macrumors.com/2016/11/01/apple-releases-ios-10-2-public-beta-1/",
    publisher: "MacRumors",
    publishedDateObserved: "2016-11-01",
    candidates: [["10.2", 1]],
  }),
  source({
    sourceId: "source-ios102-pb1-9to5mac",
    canonicalUrl:
      "https://9to5mac.com/2016/11/01/ios-10-2-public-beta-1/",
    publisher: "9to5Mac",
    publishedDateObserved: "2016-11-01",
    candidates: [["10.2", 1]],
  }),
  source({
    sourceId: "source-ios102-pb2-macrumors",
    canonicalUrl:
      "https://www.macrumors.com/2016/11/08/apple-releases-ios-10-2-public-beta-2/",
    publisher: "MacRumors",
    publishedDateObserved: "2016-11-08",
    candidates: [["10.2", 2]],
  }),
  source({
    sourceId: "source-ios102-pb2-idb",
    canonicalUrl:
      "https://www.idownloadblog.com/2016/11/08/ios-10-2-beta-2-now-available-to-public-beta-testers/",
    publisher: "iDownloadBlog",
    publishedDateObserved: "2016-11-08",
    candidates: [["10.2", 2]],
  }),
  source({
    sourceId: "source-ios102-pb3-neowin",
    canonicalUrl:
      "https://www.neowin.net/news/apple-releases-ios-102-and-macos-10122-public-beta-3-watchos-311-developer-beta-3/",
    publisher: "Neowin",
    publishedDateObserved: "2016-11-15",
    candidates: [["10.2", 3]],
    supportNote:
      "Standalone contemporary public-beta report explicitly dates Public Beta 3 to 2016-11-15.",
  }),
  source({
    sourceId: "source-ios102-pb3-idevice",
    canonicalUrl:
      "https://www.idevice.ro/2016/11/15/instaleaza-ios-10-2-public-beta-3-iphone-ipad/",
    publisher: "iDevice.ro",
    publishedDateObserved: "2016-11-15",
    candidates: [["10.2", 3]],
    supportNote:
      "Standalone contemporary public-beta report supports Public Beta 3 availability on 2016-11-15.",
  }),
  source({
    sourceId: "source-ios102-pb3-macrumors-update",
    canonicalUrl:
      "https://www.macrumors.com/2016/11/14/apple-seeds-ios-10-2-beta-3-to-developers/",
    publisher: "MacRumors",
    publishedDateObserved: "2016-11-14",
    candidates: [["10.2", 3]],
    roles: ["publicAvailability", "publicOrdinal", "dateConflict"],
    locator:
      "Original developer article metadata dated 2016-11-14 and untimestamped update stating public-beta availability.",
    supportNote:
      "Supports the ordinal and eventual public availability, but not a 2016-11-14 public appearance because the public update is not timestamped.",
  }),
  source({
    sourceId: "source-ios102-pb3-thinkapple",
    canonicalUrl:
      "https://thinkapple.pl/2016/11/15/publiczna-beta-3-ios-10-2/",
    publisher: "ThinkApple",
    publishedDateObserved: "2016-11-15",
    candidates: [["10.2", 3]],
    locator:
      "Headline, publication date, and article lead explicitly identifying iOS 10.2 Public Beta 3 and public-tester availability.",
    supportNote:
      "Independent standalone report corroborates Public Beta 3 on 2016-11-15 and distinguishes it from the prior developer seed.",
  }),
  source({
    sourceId: "source-ios102-pb3-iphonefaq",
    canonicalUrl: "https://www.iphonefaq.org/archives/975750",
    publisher: "The iPhone FAQ",
    publishedDateObserved: "2016-11-15",
    candidates: [["10.2", 3]],
    locator:
      "Page metadata, headline, and article lead reporting the third iOS 10.2 public beta on 2016-11-15.",
    supportNote:
      "Independent same-day report corroborates the Public Beta 3 appearance date; obvious version-number typos elsewhere in the article are not relied upon.",
  }),
  source({
    sourceId: "source-ios102-pb4-macrumors",
    canonicalUrl:
      "https://www.macrumors.com/2016/11/28/apple-seeds-ios-10-2-beta-4-to-developers/",
    publisher: "MacRumors",
    publishedDateObserved: "2016-11-28",
    candidates: [["10.2", 4]],
    locator:
      "Page metadata, headline, article lead, and update stating availability to public beta testers.",
  }),
  source({
    sourceId: "source-ios102-pb4-neowin",
    canonicalUrl:
      "https://www.neowin.net/news/ios-102-and-macos-10122-sierra-beta-4-now-available-to-public-beta-testers/",
    publisher: "Neowin",
    publishedDateObserved: "2016-11-28",
    candidates: [["10.2", 4]],
  }),
  source({
    sourceId: "source-ios102-pb4-macerkopf",
    canonicalUrl:
      "https://www.macerkopf.de/2016/11/28/ios-10-2-beta-4-ist-da/",
    publisher: "Macerkopf",
    publishedDateObserved: "2016-11-28",
    candidates: [["10.2", 4]],
    locator:
      "Headline, publication metadata, and same-day update explicitly stating that iOS 10.2 Public Beta 4 was available.",
  }),
  source({
    sourceId: "source-ios102-pb5-macrumors",
    canonicalUrl:
      "https://www.macrumors.com/2016/12/02/apple-seeds-ios-10-2-beta-5/",
    publisher: "MacRumors",
    publishedDateObserved: "2016-12-02",
    candidates: [["10.2", 5]],
  }),
  source({
    sourceId: "source-ios102-pb5-appleinsider",
    canonicalUrl:
      "https://appleinsider.com/articles/16/12/02/apple-ios-102-beta-5-available-for-developers-and-public-second-release-in-a-week",
    publisher: "AppleInsider",
    publishedDateObserved: "2016-12-02",
    candidates: [["10.2", 5]],
  }),
  source({
    sourceId: "source-ios102-pb6-9to5mac",
    canonicalUrl:
      "https://9to5mac.com/2016/12/05/ios-10-2-beta-6/",
    publisher: "9to5Mac",
    publishedDateObserved: "2016-12-05",
    candidates: [["10.2", 6]],
  }),
  source({
    sourceId: "source-ios102-pb6-venturebeat",
    canonicalUrl:
      "https://venturebeat.com/ai/apple-releases-ios-10-2-public-beta-6",
    publisher: "VentureBeat",
    publishedDateObserved: "2016-12-05",
    candidates: [["10.2", 6]],
  }),
  source({
    sourceId: "source-ios102-pb7-9to5mac",
    canonicalUrl:
      "https://9to5mac.com/2016/12/07/ios-10-2-beta-7/",
    publisher: "9to5Mac",
    publishedDateObserved: "2016-12-07",
    candidates: [["10.2", 7]],
  }),
  source({
    sourceId: "source-ios102-pb7-mobilesyrup",
    canonicalUrl:
      "https://mobilesyrup.com/2016/12/07/apple-releases-ios-10-2-beta-7-to-public-testers/",
    publisher: "MobileSyrup",
    publishedDateObserved: "2016-12-07",
    candidates: [["10.2", 7]],
  }),

  // iOS 10.2.1
  source({
    sourceId: "source-ios1021-pb1-macrumors",
    canonicalUrl:
      "https://www.macrumors.com/2016/12/15/ios-10-12-1-sierra-10-12-3-public-betas/",
    publisher: "MacRumors",
    publishedDateObserved: "2016-12-15",
    candidates: [["10.2.1", 1]],
  }),
  source({
    sourceId: "source-ios1021-pb1-idb",
    canonicalUrl:
      "https://www.idownloadblog.com/2016/12/15/ios-10-2-1-and-macos-sierra-10-12-3-now-available-to-public-beta-testers/",
    publisher: "iDownloadBlog",
    publishedDateObserved: "2016-12-15",
    candidates: [["10.2.1", 1]],
  }),
  source({
    sourceId: "source-ios1021-pb2-macrumors",
    canonicalUrl:
      "https://www.macrumors.com/2016/12/21/apple-releases-ios-10-2-1-public-beta-2/",
    publisher: "MacRumors",
    publishedDateObserved: "2016-12-21",
    candidates: [["10.2.1", 2]],
  }),
  source({
    sourceId: "source-ios1021-pb2-appleinsider",
    canonicalUrl:
      "https://appleinsider.com/articles/16/12/21/apple-brings-second-ios-1021-macos-10123-betas-to-public-testers",
    publisher: "AppleInsider",
    publishedDateObserved: "2016-12-21",
    candidates: [["10.2.1", 2]],
  }),
  source({
    sourceId: "source-ios1021-pb3-macrumors",
    canonicalUrl:
      "https://www.macrumors.com/2017/01/09/apple-seeds-ios-10-2-1-beta-3-to-developers/",
    publisher: "MacRumors",
    publishedDateObserved: "2017-01-09",
    candidates: [["10.2.1", 3]],
    locator:
      "Page metadata, headline, article lead, and update stating third public-beta availability.",
  }),
  source({
    sourceId: "source-ios1021-pb3-osxdaily",
    canonicalUrl:
      "https://osxdaily.com/2017/01/09/beta-3-of-ios-10-2-1-macos-10-12-3-watchos-3-1-3-tvos-10-1-1/",
    publisher: "OS X Daily",
    publishedDateObserved: "2017-01-09",
    candidates: [["10.2.1", 3]],
    roles: ["supportingContext", "availabilityAmbiguity"],
    locator:
      "Article lead and paragraph warning that public versions typically roll out soon after developer seeds.",
    supportNote:
      "Supports the beta-3 cycle and date context but does not independently state that Public Beta 3 was already available.",
    independentForCorroboration: false,
  }),
  source({
    sourceId: "source-ios1021-pb3-idevicecentral-video",
    canonicalUrl: "https://www.youtube.com/watch?v=-UQ1uJT4Jdc",
    publisher: "iDevice Central",
    publishedDateObserved: "2017-01-09",
    candidates: [["10.2.1", 3]],
    title:
      "iOS 10.2.1 Beta 3 | iOS 10.2 Jailbreak | Everything You Need To Know",
    sourceClass: "contemporaneousVideoWitness",
    locator:
      "Video publication date, title, and description explicitly identifying iOS 10.2.1 Public Beta 3.",
    supportNote:
      "Independent contemporaneous video description supports Public Beta 3 on 2017-01-09, but it is retained as a witness rather than a second editorial publisher.",
  }),
  source({
    sourceId: "source-ios1021-pb4-macrumors",
    canonicalUrl:
      "https://www.macrumors.com/2017/01/12/apple-seeds-ios-10-2-1-beta-4-to-developers/",
    publisher: "MacRumors",
    publishedDateObserved: "2017-01-12",
    candidates: [["10.2.1", 4]],
  }),
  source({
    sourceId: "source-ios1021-pb4-appleinsider",
    canonicalUrl:
      "https://appleinsider.com/articles/17/01/12/apple-seeds-ios-1021-beta-to-developers-and-public-testers",
    publisher: "AppleInsider",
    publishedDateObserved: "2017-01-12",
    candidates: [["10.2.1", 4]],
  }),

  // iOS 10.3
  source({
    sourceId: "source-ios103-pb1-macrumors",
    canonicalUrl:
      "https://www.macrumors.com/2017/01/26/apple-seeds-first-ios-10-3-public-beta/",
    publisher: "MacRumors",
    publishedDateObserved: "2017-01-26",
    candidates: [["10.3", 1]],
  }),
  source({
    sourceId: "source-ios103-pb1-9to5mac",
    canonicalUrl:
      "https://9to5mac.com/2017/01/26/10-3-public-beta-1/",
    publisher: "9to5Mac",
    publishedDateObserved: "2017-01-26",
    candidates: [["10.3", 1]],
  }),
  source({
    sourceId: "source-ios103-pb2-macrumors",
    canonicalUrl:
      "https://www.macrumors.com/2017/02/07/apple-releases-ios-10-3-public-beta-2/",
    publisher: "MacRumors",
    publishedDateObserved: "2017-02-07",
    candidates: [["10.3", 2]],
  }),
  source({
    sourceId: "source-ios103-pb2-neowin",
    canonicalUrl:
      "https://www.neowin.net/news/apple-seeds-ios-103-beta-2-to-public-beta-testers/",
    publisher: "Neowin",
    publishedDateObserved: "2017-02-07",
    candidates: [["10.3", 2]],
  }),
  source({
    sourceId: "source-ios103-pb2-9to5mac",
    canonicalUrl:
      "https://9to5mac.com/2017/02/07/ios-10-3-public-beta-2/",
    publisher: "9to5Mac",
    publishedDateObserved: "2017-02-07",
    candidates: [["10.3", 2]],
  }),
  source({
    sourceId: "source-ios103-pb3-macrumors",
    canonicalUrl:
      "https://www.macrumors.com/2017/02/21/apple-ios-10-3-public-beta-3/",
    publisher: "MacRumors",
    publishedDateObserved: "2017-02-21",
    candidates: [["10.3", 3]],
  }),
  source({
    sourceId: "source-ios103-pb3-9to5mac",
    canonicalUrl:
      "https://9to5mac.com/2017/02/21/ios-10-3-public-beta-3/",
    publisher: "9to5Mac",
    publishedDateObserved: "2017-02-21",
    candidates: [["10.3", 3]],
  }),
  source({
    sourceId: "source-ios103-pb4-redmondpie",
    canonicalUrl:
      "https://www.redmondpie.com/download-public-beta-4-of-ios-10.3-and-macos-10.12.4-tvos-10.2-beta-4-now-available/",
    publisher: "Redmond Pie",
    publishedDateObserved: "2017-02-28",
    candidates: [["10.3", 4]],
    supportNote:
      "Standalone contemporary report explicitly says the public seed followed the prior day's developer seed, supporting 2017-02-28.",
  }),
  source({
    sourceId: "source-ios103-pb4-idevice",
    canonicalUrl:
      "https://www.idevice.ro/2017/02/28/ios-10-3-public-beta-4-a-fost-lansat/",
    publisher: "iDevice.ro",
    publishedDateObserved: "2017-02-28",
    candidates: [["10.3", 4]],
    supportNote:
      "Standalone contemporary public-beta report supports availability on 2017-02-28.",
  }),
  source({
    sourceId: "source-ios103-pb4-macrumors-update",
    canonicalUrl:
      "https://www.macrumors.com/2017/02/27/ios-10-3-beta-4/",
    publisher: "MacRumors",
    publishedDateObserved: "2017-02-27",
    candidates: [["10.3", 4]],
    roles: ["publicAvailability", "publicOrdinal", "dateConflict"],
    locator:
      "Original developer article metadata dated 2017-02-27 and untimestamped update stating public-beta availability.",
    supportNote:
      "Supports the ordinal and eventual public availability, but not a 2017-02-27 public appearance because the public update is not timestamped.",
  }),
  source({
    sourceId: "source-ios103-pb5-macrumors",
    canonicalUrl:
      "https://www.macrumors.com/2017/03/08/apple-seeds-ios-10-3-beta-5-to-developers/",
    publisher: "MacRumors",
    publishedDateObserved: "2017-03-08",
    candidates: [["10.3", 5]],
    locator:
      "Page metadata, headline, article lead, and update stating fifth public-beta availability.",
  }),
  source({
    sourceId: "source-ios103-pb5-idevice",
    canonicalUrl:
      "https://www.idevice.ro/2017/03/09/ios-10-3-public-beta-5-iphone-ipad/",
    publisher: "iDevice.ro",
    publishedDateObserved: "2017-03-09",
    candidates: [["10.3", 5]],
    locator:
      "Headline, page date, and article lead stating the seed was released the prior night.",
    supportNote:
      "Next-morning report explicitly supports a 2017-03-08 public appearance.",
  }),
  source({
    sourceId: "source-ios103-pb6-macrumors",
    canonicalUrl:
      "https://www.macrumors.com/2017/03/13/apple-seeds-ios-10-3-beta-6-to-developers/",
    publisher: "MacRumors",
    publishedDateObserved: "2017-03-13",
    candidates: [["10.3", 6]],
    locator:
      "Page metadata, headline, article lead, and update stating sixth public-beta availability.",
  }),
  source({
    sourceId: "source-ios103-pb6-idevice",
    canonicalUrl:
      "https://www.idevice.ro/2017/03/14/ios-10-3-public-beta-6-iphone-ipad/",
    publisher: "iDevice.ro",
    publishedDateObserved: "2017-03-14",
    candidates: [["10.3", 6]],
    locator:
      "Headline, page date, and article lead stating the seed was released the prior night.",
    supportNote:
      "Next-morning report supports the 2017-03-13 America/Los_Angeles appearance date.",
  }),
  source({
    sourceId: "source-ios103-pb7-macrumors",
    canonicalUrl: "https://www.macrumors.com/2017/03/16/ios-10-3-beta-7/",
    publisher: "MacRumors",
    publishedDateObserved: "2017-03-16",
    candidates: [["10.3", 7]],
  }),
  source({
    sourceId: "source-ios103-pb7-appleinsider",
    canonicalUrl:
      "https://appleinsider.com/articles/17/03/16/seventh-betas-of-macos-10124-and-ios-103-released-for-developer-testing",
    publisher: "AppleInsider",
    publishedDateObserved: "2017-03-16",
    candidates: [["10.3", 7]],
    locator:
      "Page metadata, headline, article lead, and update stating public-beta availability.",
  }),

  // iOS 10.3.2
  source({
    sourceId: "source-ios1032-pb1-macrumors",
    canonicalUrl:
      "https://www.macrumors.com/2017/03/29/ios-10-3-2-first-public-beta/",
    publisher: "MacRumors",
    publishedDateObserved: "2017-03-29",
    candidates: [["10.3.2", 1]],
    supportNote:
      "Contemporary report supports the first public appearance and the initial lack of 32-bit-device binaries.",
  }),
  source({
    sourceId: "source-ios1032-pb1-appleinsider",
    canonicalUrl:
      "https://appleinsider.com/articles/17/03/29/apple-releases-first-public-beta-for-ios-1032-still-no-32-bit-version-available",
    publisher: "AppleInsider",
    publishedDateObserved: "2017-03-29",
    candidates: [["10.3.2", 1]],
    supportNote:
      "Contemporary report supports the first public appearance and the initial lack of 32-bit-device binaries.",
  }),
  source({
    sourceId: "source-ios1032-pb2-macrumors",
    canonicalUrl:
      "https://www.macrumors.com/2017/04/11/apple-seeds-second-ios-10-3-2-public-beta/",
    publisher: "MacRumors",
    publishedDateObserved: "2017-04-11",
    candidates: [["10.3.2", 2]],
  }),
  source({
    sourceId: "source-ios1032-pb2-appleinsider",
    canonicalUrl:
      "https://appleinsider.com/articles/17/04/11/apple-seeds-second-public-betas-of-ios-1032-macos-10125",
    publisher: "AppleInsider",
    publishedDateObserved: "2017-04-11",
    candidates: [["10.3.2", 2]],
  }),
  source({
    sourceId: "source-ios1032-pb3-9to5mac",
    canonicalUrl:
      "https://9to5mac.com/2017/04/18/ios-10-3-2-macos-10-12-5-public-beta-3/",
    publisher: "9to5Mac",
    publishedDateObserved: "2017-04-18",
    candidates: [["10.3.2", 3]],
    supportNote:
      "Standalone public-beta report explicitly says the public seed followed the prior day's developer seed, supporting 2017-04-18.",
  }),
  source({
    sourceId: "source-ios1032-pb3-idevice",
    canonicalUrl:
      "https://www.idevice.ro/2017/04/18/ios-10-3-2-public-beta-3-iphone-ipad/",
    publisher: "iDevice.ro",
    publishedDateObserved: "2017-04-18",
    candidates: [["10.3.2", 3]],
    supportNote:
      "Standalone contemporary public-beta report supports availability on 2017-04-18.",
  }),
  source({
    sourceId: "source-ios1032-pb3-macrumors-update",
    canonicalUrl:
      "https://www.macrumors.com/2017/04/17/apple-seeds-ios-10-3-2-beta-3-to-developers/",
    publisher: "MacRumors",
    publishedDateObserved: "2017-04-17",
    candidates: [["10.3.2", 3]],
    roles: ["publicAvailability", "publicOrdinal", "dateConflict"],
    locator:
      "Original developer article metadata dated 2017-04-17 and untimestamped update stating public-beta availability.",
    supportNote:
      "Supports the ordinal and eventual public availability, but not a 2017-04-17 public appearance because the public update is not timestamped.",
  }),
  source({
    sourceId: "source-ios1032-pb4-macrumors",
    canonicalUrl:
      "https://www.macrumors.com/2017/04/24/apple-seeds-ios-10-3-2-beta-4-to-developers/",
    publisher: "MacRumors",
    publishedDateObserved: "2017-04-24",
    candidates: [["10.3.2", 4]],
    locator:
      "Page metadata, headline, article lead, and update stating fourth public-beta availability.",
  }),
  source({
    sourceId: "source-ios1032-pb4-idevice",
    canonicalUrl:
      "https://www.idevice.ro/2017/04/25/instaleaza-ios-10-3-2-public-beta-4-iphone-ipad/",
    publisher: "iDevice.ro",
    publishedDateObserved: "2017-04-25",
    candidates: [["10.3.2", 4]],
    locator:
      "Headline, page date, and article lead stating the seed was available since the prior day.",
    supportNote:
      "Next-day report explicitly supports a 2017-04-24 public appearance.",
  }),
  source({
    sourceId: "source-ios1032-pb5-macrumors",
    canonicalUrl:
      "https://www.macrumors.com/2017/04/27/apple-seeds-ios-10-3-2-beta-5-to-developers/",
    publisher: "MacRumors",
    publishedDateObserved: "2017-04-27",
    candidates: [["10.3.2", 5]],
    locator:
      "Page metadata, headline, article lead, and update stating fifth public-beta availability.",
  }),
  source({
    sourceId: "source-ios1032-pb5-macerkopf",
    canonicalUrl:
      "https://www.macerkopf.de/2017/04/27/ios-10-3-2-beta-5-ist-da/",
    publisher: "Macerkopf",
    publishedDateObserved: "2017-04-27",
    candidates: [["10.3.2", 5]],
    locator:
      "Headline, publication date, article lead, and update stating Public Beta 5 is available.",
  }),

  // iOS 10.3.3
  source({
    sourceId: "source-ios1033-pb1-macrumors",
    canonicalUrl:
      "https://www.macrumors.com/2017/05/17/apple-seeds-first-ios-10-3-3-public-beta/",
    publisher: "MacRumors",
    publishedDateObserved: "2017-05-17",
    candidates: [["10.3.3", 1]],
  }),
  source({
    sourceId: "source-ios1033-pb1-9to5mac",
    canonicalUrl:
      "https://9to5mac.com/2017/05/17/ios-10-3-3-public-beta/",
    publisher: "9to5Mac",
    publishedDateObserved: "2017-05-17",
    candidates: [["10.3.3", 1]],
  }),
  source({
    sourceId: "source-ios1033-pb2-macrumors",
    canonicalUrl:
      "https://www.macrumors.com/2017/05/30/apple-seeds-ios-10-3-3-beta-2-to-developers/",
    publisher: "MacRumors",
    publishedDateObserved: "2017-05-30",
    candidates: [["10.3.3", 2]],
    locator:
      "Page metadata, headline, article lead, and update stating second public-beta availability.",
  }),
  source({
    sourceId: "source-ios1033-pb2-9to5mac",
    canonicalUrl:
      "https://9to5mac.com/2017/05/30/ios-10-3-3-public-beta-2/",
    publisher: "9to5Mac",
    publishedDateObserved: "2017-05-30",
    candidates: [["10.3.3", 2]],
  }),
  source({
    sourceId: "source-ios1033-pb3-macrumors",
    canonicalUrl:
      "https://www.macrumors.com/2017/06/13/apple-seeds-ios-10-3-3-beta-3-to-developers/",
    publisher: "MacRumors",
    publishedDateObserved: "2017-06-13",
    candidates: [["10.3.3", 3]],
    locator:
      "Page metadata, headline, article lead, and update stating third public-beta availability.",
  }),
  source({
    sourceId: "source-ios1033-pb3-macerkopf",
    canonicalUrl:
      "https://www.macerkopf.de/2017/06/13/ios-10-3-3-beta-3-ist-da/",
    publisher: "Macerkopf",
    publishedDateObserved: "2017-06-13",
    candidates: [["10.3.3", 3]],
    locator:
      "Headline, publication date, article lead, and update stating Public Beta 3 is available.",
  }),
  source({
    sourceId: "source-ios1033-pb3-zollotech-video",
    canonicalUrl: "https://www.youtube.com/watch?v=HrH1bfWw-5g",
    publisher: "zollotech",
    publishedDateObserved: "2017-06-13",
    candidates: [["10.3.3", 3]],
    title: "iOS 10.3.3 Beta 3 - What's New?",
    sourceClass: "contemporaneousVideoWitness",
    locator:
      "Video upload timestamp, title, and description explicitly stating same-day release to developers and public beta testers.",
    supportNote:
      "Independent contemporary first-hand video description directly supports Public Beta 3 on 2017-06-13.",
  }),
  source({
    sourceId: "source-ios1033-pb4-macrumors",
    canonicalUrl:
      "https://www.macrumors.com/2017/06/22/apple-seeds-ios-10-3-3-beta-4-to-developers/",
    publisher: "MacRumors",
    publishedDateObserved: "2017-06-22",
    candidates: [["10.3.3", 4]],
    locator:
      "Page metadata, headline, article lead, and update stating fourth public-beta availability.",
  }),
  source({
    sourceId: "source-ios1033-pb4-geekygadgets",
    canonicalUrl:
      "https://www.geeky-gadgets.com/apple-releases-ios-10-3-3-beta-4/",
    publisher: "Geeky Gadgets",
    publishedDateObserved: "2017-06-23",
    candidates: [["10.3.3", 4]],
    supportNote:
      "Next-day publisher report corroborates Public Beta 4 availability; it is reporting-lag evidence rather than the sole date source.",
  }),
  source({
    sourceId: "source-ios1033-pb4-zollotech-video",
    canonicalUrl: "https://www.youtube.com/watch?v=X4Qx5PkEKho",
    publisher: "zollotech",
    publishedDateObserved: "2017-06-22",
    candidates: [["10.3.3", 4]],
    title: "iOS 10.3.3 Beta 4 - What's New?",
    sourceClass: "contemporaneousVideoWitness",
    locator:
      "Video publication date, title, and description explicitly stating release to developers and public beta testers.",
    supportNote:
      "Independent contemporaneous first-hand video description supports Public Beta 4 on 2017-06-22.",
  }),
  source({
    sourceId: "source-ios1033-pb5-macrumors",
    canonicalUrl:
      "https://www.macrumors.com/2017/06/28/apple-seeds-ios-10-3-3-beta-5-to-developers/",
    publisher: "MacRumors",
    publishedDateObserved: "2017-06-28",
    candidates: [["10.3.3", 5]],
    locator:
      "Page metadata, headline, article lead, and update stating fifth public-beta availability.",
  }),
  source({
    sourceId: "source-ios1033-pb5-idevice",
    canonicalUrl:
      "https://www.idevice.ro/2017/06/29/instaleaza-ios-10-3-3-public-beta-5-iphone-ipad/",
    publisher: "iDevice.ro",
    publishedDateObserved: "2017-06-29",
    candidates: [["10.3.3", 5]],
    locator:
      "Headline, page date, and article lead stating the seed was available since the prior day.",
    supportNote:
      "Next-day report supports a 2017-06-28 public appearance.",
  }),
  source({
    sourceId: "source-ios1033-pb6-macrumors",
    canonicalUrl:
      "https://www.macrumors.com/2017/07/05/apple-seeds-ios-10-3-3-beta-6/",
    publisher: "MacRumors",
    publishedDateObserved: "2017-07-05",
    candidates: [["10.3.3", 6]],
  }),
  source({
    sourceId: "source-ios1033-pb6-neowin",
    canonicalUrl:
      "https://www.neowin.net/news/apple-seeds-new-builds-of-ios-1033-macos-10126-sierra-and-tvos-1022/",
    publisher: "Neowin",
    publishedDateObserved: "2017-07-05",
    candidates: [["10.3.3", 6]],
    locator:
      "Page metadata, headline, article lead, and update stating public-beta availability.",
  }),
  source({
    sourceId: "source-ios1033-pb6-macobserver",
    canonicalUrl:
      "https://www.macobserver.com/news/ios-10-3-3-beta-6-available/",
    publisher: "The Mac Observer",
    publishedDateObserved: "2017-07-05",
    candidates: [["10.3.3", 6]],
    locator:
      "Page metadata, headline, and article lead explicitly stating beta 6 availability to developers and public testers.",
  }),
];

const decodeHtml = (value) =>
  value
    .replaceAll(/&nbsp;/gi, " ")
    .replaceAll(/&amp;/gi, "&")
    .replaceAll(/&quot;/gi, '"')
    .replaceAll(/&#0*39;|&apos;/gi, "'")
    .replaceAll(/&#0*34;/gi, '"')
    .replaceAll(/&lt;/gi, "<")
    .replaceAll(/&gt;/gi, ">")
    .replaceAll(/&#8216;|&#x2018;/gi, "‘")
    .replaceAll(/&#8217;|&#x2019;/gi, "’")
    .replaceAll(/&#8220;|&#x201c;/gi, "“")
    .replaceAll(/&#8221;|&#x201d;/gi, "”")
    .replaceAll(/&#8211;|&#x2013;/gi, "–")
    .replaceAll(/&#8212;|&#x2014;/gi, "—")
    .replaceAll(/&#(\d+);/g, (_, code) =>
      String.fromCodePoint(Number(code)),
    )
    .replaceAll(/&#x([0-9a-f]+);/gi, (_, code) =>
      String.fromCodePoint(Number.parseInt(code, 16)),
    );

const stripHtml = (value) =>
  decodeHtml(
    value
      .replaceAll(/<!--[\s\S]*?-->/g, " ")
      .replaceAll(
        /<(script|style|svg|noscript|template)[^>]*>[\s\S]*?<\/\1>/gi,
        " ",
      )
      .replaceAll(/<(br|\/p|\/div|\/li|\/h[1-6]|\/blockquote)>/gi, "\n")
      .replaceAll(/<[^>]+>/g, " "),
  )
    .replaceAll(/\r/g, "")
    .replaceAll(/[ \t]+/g, " ")
    .replaceAll(/\n[ \t]+/g, "\n")
    .replaceAll(/\n{3,}/g, "\n\n")
    .trim();

const firstMatch = (text, patterns) => {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) return stripHtml(match[1]);
  }
  return null;
};

const firstJsonString = (text, key) => {
  const pattern = new RegExp(
    `"${key}"\\s*:\\s*"((?:\\\\.|[^"\\\\])*)"`,
    "i",
  );
  const match = text.match(pattern);
  if (!match?.[1]) return null;
  try {
    return stripHtml(JSON.parse(`"${match[1]}"`));
  } catch {
    return stripHtml(match[1]);
  }
};

const selectArticle = (html) => {
  const candidates = [
    ["article", /<article\b[^>]*>([\s\S]*?)<\/article>/i],
    [".post-content", /<[^>]+class=["'][^"']*post-content[^"']*["'][^>]*>([\s\S]*?)<\/(?:div|section)>/i],
    ["main", /<main\b[^>]*>([\s\S]*?)<\/main>/i],
    ["body", /<body\b[^>]*>([\s\S]*?)<\/body>/i],
  ];
  for (const [selector, pattern] of candidates) {
    const match = html.match(pattern);
    const text = match?.[1] ? stripHtml(match[1]) : "";
    if (text.length >= 120) return {selector, text: text.slice(0, 40_000)};
  }
  return {selector: "document", text: stripHtml(html).slice(0, 40_000)};
};

const sha256 = (value) =>
  createHash("sha256").update(value).digest("hex");

const fetchWithRetry = async (url, attempts = 3) => {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, {
        redirect: "follow",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/131.0 Safari/537.36 VersionRecordResearch/1.0",
          Accept:
            "text/html,application/xhtml+xml,application/json;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.8",
        },
      });
      const bytes = Buffer.from(await response.arrayBuffer());
      if (!response.ok || bytes.byteLength < 100) {
        throw new Error(
          `HTTP ${response.status}; ${bytes.byteLength} response bytes`,
        );
      }
      return {
        bytes,
        finalUrl: response.url,
        status: response.status,
        contentType: response.headers.get("content-type"),
      };
    } catch (error) {
      lastError = error;
      if (attempt < attempts) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 500));
      }
    }
  }
  throw lastError;
};

await Promise.all([
  mkdir(rawDir, {recursive: true}),
  mkdir(selectedDir, {recursive: true}),
]);

const observations = [];
for (const [index, item] of sources.entries()) {
  try {
    const fetched = await fetchWithRetry(item.canonicalUrl);
    const html = fetched.bytes.toString("utf8");
    const rawPath = path.join(rawDir, `${item.sourceId}.raw.html`);
    const selectedPath = path.join(
      selectedDir,
      `${item.sourceId}.selected.txt`,
    );
    const article = selectArticle(html);
    const parsedTitle = firstMatch(html, [
      /"headline"\s*:\s*"([^"]+)"/i,
      /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i,
      /<title[^>]*>([\s\S]*?)<\/title>/i,
    ]);
    const parsedPublishedAt = firstMatch(html, [
      /"datePublished"\s*:\s*"([^"]+)"/i,
      /property=["']article:published_time["'][^>]+content=["']([^"']+)["']/i,
      /name=["']date["'][^>]+content=["']([^"']+)["']/i,
      /"publishDate"\s*:\s*"([^"]+)"/i,
      /"uploadDate"\s*:\s*"([^"]+)"/i,
    ]);
    const parsedModifiedAt = firstMatch(html, [
      /"dateModified"\s*:\s*"([^"]+)"/i,
      /property=["']article:modified_time["'][^>]+content=["']([^"']+)["']/i,
    ]);
    const parsedAuthor = firstMatch(html, [
      /"author"\s*:\s*\{[^{}]{0,800}?"name"\s*:\s*"([^"]+)"/i,
      /"author"\s*:\s*"([^"]+)"/i,
      /name=["']author["'][^>]+content=["']([^"']+)["']/i,
    ]);
    const parsedDescription = firstJsonString(html, "shortDescription");
    const selectedText = [
      `SOURCE ID: ${item.sourceId}`,
      `REQUESTED URL: ${item.canonicalUrl}`,
      `FINAL URL: ${fetched.finalUrl}`,
      `OBSERVED TITLE: ${item.title ?? parsedTitle ?? "unknown"}`,
      `OBSERVED PUBLISHED: ${parsedPublishedAt ?? item.publishedDateObserved}`,
      `OBSERVED MODIFIED: ${parsedModifiedAt ?? "unknown"}`,
      `OBSERVED AUTHOR: ${item.author ?? parsedAuthor ?? "unknown"}`,
      ...(parsedDescription
        ? [`OBSERVED DESCRIPTION: ${parsedDescription}`]
        : []),
      `SELECTOR: ${article.selector}`,
      "",
      article.text,
    ].join("\n");
    await Promise.all([
      writeFile(rawPath, fetched.bytes),
      writeFile(selectedPath, selectedText, "utf8"),
    ]);
    observations.push({
      ...item,
      captureStatus: "captured",
      capturedAt,
      finalUrl: fetched.finalUrl,
      httpStatus: fetched.status,
      contentType: fetched.contentType,
      parsed: {
        title: item.title ?? parsedTitle,
        publishedAt: parsedPublishedAt,
        modifiedAt: parsedModifiedAt,
        author: item.author ?? parsedAuthor,
        description: parsedDescription,
      },
      evidence: {
        rawPath,
        rawBytes: fetched.bytes.byteLength,
        rawSha256: sha256(fetched.bytes),
        selectedPath,
        selectedSelector: article.selector,
        selectedTextBytes: Buffer.byteLength(selectedText),
        selectedTextSha256: sha256(selectedText),
        captureMethod: "http-html",
        locator: item.locator,
      },
    });
  } catch (error) {
    observations.push({
      ...item,
      captureStatus: "failed",
      capturedAt,
      error: error instanceof Error ? error.message : String(error),
      evidence: null,
    });
  }
  process.stdout.write(
    `[${String(index + 1).padStart(2, "0")}/${sources.length}] ${item.sourceId}: ${observations.at(-1).captureStatus}\n`,
  );
}

await Promise.all([
  writeFile(
    path.join(evidenceRoot, "source-plan.json"),
    `${JSON.stringify(
      {
        formatVersion: 1,
        batchId,
        sourceCount: sources.length,
        sources,
      },
      null,
      2,
    )}\n`,
  ),
  writeFile(
    path.join(evidenceRoot, "source-observations.json"),
    `${JSON.stringify(
      {
        formatVersion: 1,
        batchId,
        capturedAt,
        sourceCount: observations.length,
        capturedCount: observations.filter(
          (item) => item.captureStatus === "captured",
        ).length,
        failedCount: observations.filter(
          (item) => item.captureStatus === "failed",
        ).length,
        observations,
      },
      null,
      2,
    )}\n`,
  ),
]);

console.log(
  JSON.stringify(
    {
      sourceCount: observations.length,
      capturedCount: observations.filter(
        (item) => item.captureStatus === "captured",
      ).length,
      failed: observations
        .filter((item) => item.captureStatus === "failed")
        .map((item) => ({
          sourceId: item.sourceId,
          error: item.error,
        })),
    },
    null,
    2,
  ),
);
