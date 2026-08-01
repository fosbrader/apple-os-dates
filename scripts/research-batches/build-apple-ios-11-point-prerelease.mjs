import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import prettier from "prettier";

const here = dirname(fileURLToPath(import.meta.url));
const outputName = "apple-ios-11-point-prerelease.json";
const ledgerName = "apple-ios-11-point-prerelease.md";
const accessedAt = "2026-07-30";
const sha256 = (value) => createHash("sha256").update(value).digest("hex");

const U = {
  ios111Beta1:
    "https://www.macrumors.com/2017/09/27/apple-seeds-first-beta-of-ios-11-1-to-developers/",
  ios111PublicBeta1:
    "https://www.macrumors.com/2017/09/28/apple-releases-ios-11-1-public-beta/",
  ios111Beta2:
    "https://www.macrumors.com/2017/10/09/apple-seeds-ios-11-1-beta-2-to-developers/",
  ios111Switcher:
    "https://www.macrumors.com/2017/10/09/ios-11-1-3d-touch-app-switcher/",
  ios111Beta3:
    "https://www.macrumors.com/2017/10/16/apple-seeds-ios-11-1-beta-3-to-developers/",
  ios111Beta4:
    "https://www.macrumors.com/2017/10/20/apple-seeds-ios-11-1-beta-4-to-developers/",
  ios111Beta5:
    "https://www.macrumors.com/2017/10/23/apple-seeds-fifth-beta-of-ios-11-1-to-developers/",
  ios112Beta1:
    "https://www.macrumors.com/2017/10/30/apple-releases-first-beta-of-ios-11-2/",
  ios112PublicBeta1:
    "https://www.macrumors.com/2017/11/01/apple-first-ios-11-2-public-beta/",
  ios112Beta2X:
    "https://www.macrumors.com/2017/11/03/no-ios-11-2-beta-for-iphone-x/",
  ios112Beta2:
    "https://www.macrumors.com/2017/11/06/apple-seeds-ios-11-2-beta-2-to-developers/",
  ios112PublicBeta2:
    "https://www.macrumors.com/2017/11/07/apple-releases-ios-11-2-public-beta/",
  ios112Autocorrect:
    "https://www.macrumors.com/2017/11/07/fix-autocorrect-bug-developer-beta/",
  ios112Beta3:
    "https://www.macrumors.com/2017/11/13/apple-seeds-ios-11-2-beta-3-to-developers/",
  ios112ControlCenter:
    "https://www.macrumors.com/2017/11/13/ios-11-2-beta-3-control-center-explanations/",
  ios112Charging:
    "https://www.macrumors.com/2017/11/14/ios-11-2-faster-wireless-charging-iphone-x/",
  ios112Beta4:
    "https://www.macrumors.com/2017/11/17/apple-seeds-ios-11-2-beta-4-to-developers/",
  ios112Beta5:
    "https://www.macrumors.com/2017/11/28/apple-seeds-ios-11-2-beta-5-to-developers/",
  ios112Beta6:
    "https://www.macrumors.com/2017/12/01/apple-seeds-ios-11-2-beta-6-to-developers/",
  ios113Beta1:
    "https://www.macrumors.com/2018/01/24/apple-seeds-first-beta-of-ios-11-3-to-developers/",
  ios113PublicBeta1:
    "https://www.macrumors.com/2018/01/25/apple-releases-first-ios-11-3-public-beta/",
  ios113Beta2:
    "https://www.macrumors.com/2018/02/06/apple-seeds-ios-11-3-beta-2-to-developers/",
  ios113PublicBeta2:
    "https://www.macrumors.com/2018/02/07/apple-releases-second-ios-11-3-public-beta/",
  ios113Beta3:
    "https://www.macrumors.com/2018/02/20/apple-seeds-ios-11-3-beta-3-to-developers/",
  ios113PublicBeta3:
    "https://www.macrumors.com/2018/02/21/apple-ios-11-3-public-beta-3/",
  ios113Beta4:
    "https://www.macrumors.com/2018/03/05/apple-seeds-ios-11-3-beta-4-to-developers/",
  ios113Beta5:
    "https://www.macrumors.com/2018/03/12/apple-seeds-ios-11-3-beta-5-to-developers/",
  ios113Beta6:
    "https://www.macrumors.com/2018/03/16/apple-seeds-ios-11-3-beta-6-to-developers/",
  ios114Beta1:
    "https://www.macrumors.com/2018/04/02/apple-seeds-11-4-beta-1-to-developers/",
  ios114PublicBeta1:
    "https://www.macrumors.com/2018/04/03/apple-releases-ios-11-4-public-beta-1/",
  ios114Beta2:
    "https://www.macrumors.com/2018/04/16/apple-seeds-ios-11-4-beta-2-to-developers/",
  ios114PublicBeta2:
    "https://www.macrumors.com/2018/04/17/apple-releases-ios-11-4-public-beta-2/",
  ios114Beta3:
    "https://www.macrumors.com/2018/05/01/apple-seeds-ios-11-4-beta-4-to-developers/",
  ios114Beta4:
    "https://www.macrumors.com/2018/05/07/apple-seeds-ios-11-4-beta-4-to-developers-2/",
  ios114Usb:
    "https://www.macrumors.com/2018/05/08/ios-11-4-usb-restricted-mode/",
  ios114Beta5:
    "https://www.macrumors.com/2018/05/14/apple-seeds-ios-11-4-beta-5-to-developers/",
  ios114Beta6:
    "https://www.macrumors.com/2018/05/17/apple-seeds-ios-11-4-beta-6-to-developers/",
  ios1141Beta1:
    "https://www.macrumors.com/2018/05/30/apple-seeds-first-beta-of-ios-11-4-1/",
  ios1141PublicBeta1:
    "https://www.macrumors.com/2018/05/31/apple-seeds-ios-11-4-1-public-beta-1/",
  ios1141Beta2:
    "https://www.macrumors.com/2018/06/11/apple-seeds-ios-11-4-1-beta-2-to-developers/",
  ios1141PublicBeta2:
    "https://www.macrumors.com/2018/06/12/apple-seeds-second-ios-11-4-1-public-beta/",
  ios1141Beta3:
    "https://www.macrumors.com/2018/06/18/apple-seeds-ios-11-4-1-beta-3-to-developers/",
  ios1141Beta4:
    "https://www.macrumors.com/2018/06/25/apple-seeds-ios-11-4-1-beta-4-to-developers/",
  ios1141Beta5:
    "https://www.macrumors.com/2018/07/02/apple-seeds-ios-11-4-1-beta-5-to-developers/",
  appleIos11Updates: "https://support.apple.com/en-us/102991",
  appleIos111Sdk:
    "https://developer.apple.com/library/archive/releasenotes/General/RN-iOS-11.1/",
  appleIos112Sdk:
    "https://developer.apple.com/library/archive/releasenotes/General/RN-iOS-11.2/",
  appleIos113Preview:
    "https://www.apple.com/newsroom/2018/01/apple-previews-ios-11-3/",
  appleIos113Release:
    "https://www.apple.com/newsroom/2018/03/ios-11-3-is-available-today/",
};

const journalism = (
  url,
  title,
  publishedAt,
  topics,
  author = "Juli Clover",
) => ({
  url,
  title,
  publisher: "MacRumors",
  sourceClass: "journalism",
  author,
  publishedAt,
  topics,
});

const journalismSources = [
  [
    U.ios111Beta1,
    "Apple Seeds First Beta of iOS 11.1 to Developers",
    "2017-09-27T16:58:25.000Z",
    ["iOS 11.1", "Beta 1"],
  ],
  [
    U.ios111PublicBeta1,
    "Apple Releases First Beta of iOS 11.1 for Public Beta Testers",
    "2017-09-28T17:05:03.000Z",
    ["iOS 11.1", "Public Beta 1", "observed changes"],
  ],
  [
    U.ios111Beta2,
    "Apple Seeds Second Beta of iOS 11.1 to Developers and Public Beta Testers With New Emoji",
    "2017-10-09T17:06:02.000Z",
    ["iOS 11.1", "Beta 2", "Public Beta 2"],
  ],
  [
    U.ios111Switcher,
    "iOS 11.1 Beta 2 Brings Back 3D Touch App Switcher",
    "2017-10-09T17:51:24.000Z",
    ["iOS 11.1", "Beta 2", "3D Touch"],
  ],
  [
    U.ios111Beta3,
    "Apple Seeds Third Beta of iOS 11.1 to Developers [Update: Public Beta Available]",
    "2017-10-16T17:06:00.000Z",
    ["iOS 11.1", "Beta 3", "Public Beta 3"],
  ],
  [
    U.ios111Beta4,
    "Apple Seeds Fourth Beta of iOS 11.1 to Developers [Update: Public Beta Available]",
    "2017-10-20T17:07:16.000Z",
    ["iOS 11.1", "Beta 4", "Public Beta 4"],
  ],
  [
    U.ios111Beta5,
    "Apple Seeds Fifth Beta of iOS 11.1 to Developers and Public Beta Testers [Updated]",
    "2017-10-23T17:11:05.000Z",
    ["iOS 11.1", "Beta 5", "Public Beta 5"],
  ],
  [
    U.ios112Beta1,
    "Apple Releases First Beta of iOS 11.2 for Developers [Updated]",
    "2017-10-30T17:07:59.000Z",
    ["iOS 11.2", "Beta 1"],
  ],
  [
    U.ios112PublicBeta1,
    "Apple Releases First Beta of iOS 11.2 for Public Beta Testers",
    "2017-11-01T17:10:04.000Z",
    ["iOS 11.2", "Public Beta 1"],
  ],
  [
    U.ios112Beta2X,
    "PSA: There's No iOS 11.2 Beta for iPhone X, so Beta Testers Can't Restore From Backup [Updated]",
    "2017-11-03T16:37:07.000Z",
    ["iOS 11.2", "Beta 2", "iPhone X"],
  ],
  [
    U.ios112Beta2,
    "Apple Releases Second Beta of iOS 11.2 for Developers",
    "2017-11-06T18:04:08.000Z",
    ["iOS 11.2", "Beta 2"],
  ],
  [
    U.ios112PublicBeta2,
    "Apple Releases Second Public Beta of iOS 11.2 for Public Beta Testers",
    "2017-11-07T18:05:19.000Z",
    ["iOS 11.2", "Public Beta 2", "Apple Pay Cash"],
  ],
  [
    U.ios112Autocorrect,
    "Fix for iOS Autocorrect Bug Reportedly Arrived in Latest Developer Beta, Coming to Public Beta This Week",
    "2017-11-07T16:50:30.000Z",
    ["iOS 11.2", "Beta 2", "autocorrect"],
    "Mitchel Broussard",
  ],
  [
    U.ios112Beta3,
    "Apple Seeds Third Beta of iOS 11.2 to Developers [Update: Public Beta Available]",
    "2017-11-13T18:07:06.000Z",
    ["iOS 11.2", "Beta 3", "Public Beta 3"],
  ],
  [
    U.ios112ControlCenter,
    "iOS 11.2 Beta 3 Introduces Pop-up to Explain Control Center Wi-Fi/Bluetooth Functionality",
    "2017-11-13T19:32:55.000Z",
    ["iOS 11.2", "Beta 3", "Control Center"],
  ],
  [
    U.ios112Charging,
    "iOS 11.2 Supports Faster 7.5W Charging on iPhone 8, 8 Plus and X From Qi-Based Wireless Charging Accessories",
    "2017-11-14T06:13:49.000Z",
    ["iOS 11.2", "Beta 3", "wireless charging"],
  ],
  [
    U.ios112Beta4,
    "Apple Seeds Fourth Beta of iOS 11.2 to Developers [Update: Public Beta Available]",
    "2017-11-17T18:16:24.000Z",
    ["iOS 11.2", "Beta 4", "Public Beta 4"],
  ],
  [
    U.ios112Beta5,
    "Apple Seeds Fifth Beta of iOS 11.2 to Developers [Update: Public Beta Available]",
    "2017-11-28T18:00:54.000Z",
    ["iOS 11.2", "Beta 5", "Public Beta 5"],
  ],
  [
    U.ios112Beta6,
    "Apple Seeds Sixth Beta of iOS 11.2 to Developers and Public Beta Testers",
    "2017-12-01T18:05:13.000Z",
    ["iOS 11.2", "Beta 6", "Public Beta 6"],
  ],
  [
    U.ios113Beta1,
    "Apple Seeds First Beta of iOS 11.3 to Developers With New Animoji, Business Chat, Health Records, iCloud Messages and More",
    "2018-01-24T18:04:38.000Z",
    ["iOS 11.3", "Beta 1", "observed changes"],
  ],
  [
    U.ios113PublicBeta1,
    "Apple Releases First Beta of iOS 11.3 for Public Beta Testers",
    "2018-01-25T18:09:12.000Z",
    ["iOS 11.3", "Public Beta 1"],
  ],
  [
    U.ios113Beta2,
    "Apple Seeds Second Beta of iOS 11.3 to Developers [Updated]",
    "2018-02-06T18:01:27.000Z",
    ["iOS 11.3", "Beta 2", "Battery Health"],
  ],
  [
    U.ios113PublicBeta2,
    "Apple Releases Second Beta of iOS 11.3 for Public Beta Testers With New Battery Health Feature",
    "2018-02-07T18:08:22.000Z",
    ["iOS 11.3", "Public Beta 2"],
  ],
  [
    U.ios113Beta3,
    "Apple Seeds Third Beta of iOS 11.3 to Developers",
    "2018-02-20T17:58:45.000Z",
    ["iOS 11.3", "Beta 3"],
  ],
  [
    U.ios113PublicBeta3,
    "Apple Releases Third Beta of iOS 11.3 for Public Beta Testers",
    "2018-02-21T18:08:23.000Z",
    ["iOS 11.3", "Public Beta 3"],
  ],
  [
    U.ios113Beta4,
    "Apple Seeds Fourth Beta of iOS 11.3 to Developers [Updated]",
    "2018-03-05T18:03:24.000Z",
    ["iOS 11.3", "Beta 4", "Public Beta 4"],
  ],
  [
    U.ios113Beta5,
    "Apple Seeds Fifth Beta of iOS 11.3 to Developers [Update: Public Beta Available]",
    "2018-03-12T17:04:59.000Z",
    ["iOS 11.3", "Beta 5", "Public Beta 5"],
  ],
  [
    U.ios113Beta6,
    "Apple Seeds Sixth Beta of iOS 11.3 to Developers [Update: Public Beta Available]",
    "2018-03-16T17:02:13.000Z",
    ["iOS 11.3", "Beta 6", "Public Beta 6"],
  ],
  [
    U.ios114Beta1,
    "Apple Seeds First Beta of iOS 11.4 to Developers [Updated]",
    "2018-04-02T17:04:55.000Z",
    ["iOS 11.4", "Beta 1"],
  ],
  [
    U.ios114PublicBeta1,
    "Apple Releases First Beta of iOS 11.4 for Public Beta Testers",
    "2018-04-03T17:07:25.000Z",
    ["iOS 11.4", "Public Beta 1"],
  ],
  [
    U.ios114Beta2,
    "Apple Seeds Second Beta of iOS 11.4 to Developers",
    "2018-04-16T17:02:37.000Z",
    ["iOS 11.4", "Beta 2"],
  ],
  [
    U.ios114PublicBeta2,
    "Apple Releases Second Beta of iOS 11.4 for Public Beta Testers",
    "2018-04-17T17:17:47.000Z",
    ["iOS 11.4", "Public Beta 2"],
  ],
  [
    U.ios114Beta3,
    "Apple Seeds Third Beta of iOS 11.4 to Developers [Public Beta Available]",
    "2018-05-01T17:04:06.000Z",
    ["iOS 11.4", "Beta 3", "Public Beta 3"],
  ],
  [
    U.ios114Beta4,
    "Apple Seeds Fourth Beta of iOS 11.4 to Developers [Update: Public Beta Available]",
    "2018-05-07T17:00:03.000Z",
    ["iOS 11.4", "Beta 4", "Public Beta 4"],
  ],
  [
    U.ios114Usb,
    "iOS 11.4 Disables Lightning Connector After 7 Days, Limiting Law Enforcement Access",
    "2018-05-08T16:49:53.000Z",
    ["iOS 11.4", "USB Restricted Mode"],
  ],
  [
    U.ios114Beta5,
    "Apple Seeds Fifth Beta of iOS 11.4 to Developers [Update: Public Beta Available]",
    "2018-05-14T17:01:24.000Z",
    ["iOS 11.4", "Beta 5", "Public Beta 5"],
  ],
  [
    U.ios114Beta6,
    "Apple Seeds Sixth Beta of iOS 11.4 to Developers [Update: Public Beta Available]",
    "2018-05-17T17:04:21.000Z",
    ["iOS 11.4", "Beta 6", "Public Beta 6"],
  ],
  [
    U.ios1141Beta1,
    "Apple Seeds First Beta of iOS 11.4.1 to Developers",
    "2018-05-30T17:01:27.000Z",
    ["iOS 11.4.1", "Beta 1"],
  ],
  [
    U.ios1141PublicBeta1,
    "Apple Seeds First Beta of iOS 11.4.1 to Public Beta Testers",
    "2018-05-31T17:04:51.000Z",
    ["iOS 11.4.1", "Public Beta 1"],
  ],
  [
    U.ios1141Beta2,
    "Apple Seeds Second Beta of iOS 11.4.1 to Developers",
    "2018-06-11T17:24:08.000Z",
    ["iOS 11.4.1", "Beta 2"],
  ],
  [
    U.ios1141PublicBeta2,
    "Apple Seeds Second Beta of iOS 11.4.1 to Public Beta Testers",
    "2018-06-12T17:14:48.000Z",
    ["iOS 11.4.1", "Public Beta 2"],
  ],
  [
    U.ios1141Beta3,
    "Apple Seeds Third Beta of iOS 11.4.1 to Developers [Update: Public Beta Available]",
    "2018-06-18T17:07:18.000Z",
    ["iOS 11.4.1", "Beta 3", "Public Beta 3"],
  ],
  [
    U.ios1141Beta4,
    "Apple Seeds Fourth Beta of iOS 11.4.1 to Developers and Public Beta Testers",
    "2018-06-25T17:04:22.000Z",
    ["iOS 11.4.1", "Beta 4", "Public Beta 4"],
  ],
  [
    U.ios1141Beta5,
    "Apple Seeds Fifth Beta of iOS 11.4.1 to Developers and Public Beta Testers",
    "2018-07-02T17:06:17.000Z",
    ["iOS 11.4.1", "Beta 5", "Public Beta 5"],
  ],
].map((entry) => journalism(...entry));

const sources = [
  ...journalismSources,
  {
    url: U.appleIos11Updates,
    title: "About iOS 11 Updates",
    publisher: "Apple Support",
    sourceClass: "firstPartyDocumentation",
    author: "Apple",
    publishedAt: "2023-11-15T00:00:00.000Z",
    topics: ["iOS", "11", "consumer release notes"],
  },
  {
    url: U.appleIos113Preview,
    title: "Apple previews iOS 11.3",
    publisher: "Apple Newsroom",
    sourceClass: "firstPartyAnnouncement",
    author: "Apple",
    publishedAt: "2018-01-24T00:00:00.000Z",
    topics: ["iOS", "11.3", "developer preview"],
  },
  {
    url: U.appleIos113Release,
    title: "iOS 11.3 is available today",
    publisher: "Apple Newsroom",
    sourceClass: "firstPartyAnnouncement",
    author: "Apple",
    publishedAt: "2018-03-29T00:00:00.000Z",
    topics: ["iOS", "11.3", "public availability"],
  },
];

const sourceByUrl = new Map(sources.map((source) => [source.url, source]));
const citationKey = (url, locator) => `${url}\0${locator}`;
const exactAnchorByLocator = new Map([
  [
    "multiple emoji suggestions predictive text",
    "add multiple emoji suggestions to the predictive text options",
  ],
  [
    "updated camera icon under Restrictions",
    "an updated camera icon under Restrictions",
  ],
  [
    "animation tapping status bar scroll upwards",
    "a new animation when tapping the status bar to scroll upwards",
  ],
  ["faster unlock animation", "a faster unlock animation"],
  ["new Unicode 10 emoji", "new Unicode 10 emoji"],
  [
    "emoji small design changes dolphin octopus",
    "small design changes in iOS 11.1, including the dolphin, octopus",
  ],
  [
    "3D Touch App Switcher returned",
    "Apple has reintroduced the 3D Touch App Switcher gesture",
  ],
  [
    "Reachability bug Cover Screen Notifications",
    "fixes a Reachability bug that prevented the iOS 11 Cover Screen",
  ],
  [
    "security fixes WPA2 Wi-Fi KRACK",
    "addresses a serious vulnerability in the WPA2 Wi-Fi standard",
  ],
  [
    "Calculator animation issue numbers symbols ignored",
    "a fix for an animation issue that caused the Calculator app to work improperly",
  ],
  [
    "Calculator rapid-input mechanism",
    "caused some numbers and symbols to be ignored when entered in rapid succession",
  ],
  [
    "Now Playing controlling Apple TV Control Center",
    "a new Now Playing option for controlling content on the Apple TV in Control Center",
  ],
  ["redesigned camera emoji", "redesigned camera emoji"],
  [
    "loading animation Live Photos effects",
    "a new loading animation for Live Photos effects",
  ],
  [
    "TV app Sweden Norway",
    "introduce the TV app for Sweden and Norway",
  ],
  [
    "released new beta iOS 11.2 iPhone X",
    "Apple has released a new beta of iOS 11.2 for the iPhone X",
  ],
  [
    "discounted introductory pricing auto-renewable subscriptions",
    "discounted introductory pricing for auto-renewable subscriptions",
  ],
  [
    "autocorrect bug latest developer beta fix",
    "the bug has been fixed in the second iOS 11.2 developer beta",
  ],
  [
    "pop-up explain Control Center Wi-Fi Bluetooth",
    "pop-ups explain that Bluetooth and Wi-Fi will be disabled temporarily rather than permanently",
  ],
  [
    "7.5W charging iPhone 8 Plus X",
    "iPhone 8, iPhone 8 Plus, and iPhone X are able to charge at 7.5 watts",
  ],
  [
    "Apple Pay Cash person-to-person payments Messages Wallet",
    "public beta testers to test Apple Pay cash starting with today's iOS 11.2 beta",
  ],
  [
    "ARKit 1.5 vertical surfaces irregularly shaped",
    "recognize and place virtual objects on vertical surfaces like walls and doors",
  ],
  [
    "recognize position of 2D images signs posters",
    "recognize the position of 2D images such as signs, posters, and artwork",
  ],
  [
    "camera 50 percent greater resolution auto-focus",
    "camera now has 50 percent greater resolution and supports auto-focus",
  ],
  [
    "dragon bear skull lion Animoji",
    "four new Animoji, giving iPhone X users the ability to express themselves",
  ],
  [
    "Health Records hospitals clinics existing Health app",
    "Health Records feature brings together hospitals, clinics and the existing Health app",
  ],
  [
    "Apple News new Video group For You",
    "a new Video group in For You, and improved Top Stories",
  ],
  [
    "HomeKit software authentication existing accessories",
    "HomeKit software authentication provides a great new way for developers",
  ],
  [
    "Advanced Mobile Location automatically send current location",
    "automatically send a user's current location when making a call to emergency services",
  ],
  [
    "Messages in iCloud sync across devices",
    "it reintroduces iCloud Messages, a feature that was removed from the initial iOS 11 release",
  ],
  [
    "AirPlay 2 multi-room audio Home app",
    "AirPlay 2 features have been introduced in iOS 11.3 and tvOS 11.3",
  ],
  [
    "iBooks app renamed Books",
    'a new name for "iBooks," which is now just "Books"',
  ],
  [
    "App Store Updates version number update size",
    "shows the version number and download size of all updates",
  ],
  [
    "privacy icon personal information",
    "a new Privacy screen and icon that will show up whenever Apple asks you for info",
  ],
  [
    "Battery Health maximum capacity service",
    "details on current maximum capacity, current operating performance",
  ],
  [
    "Peak Performance Capability disable performance management",
    "it offers a toggle to turn it off",
  ],
  [
    "does not support sixth-generation iPod touch",
    "current beta does not support the 6th-generation iPod touch",
  ],
  [
    "support for sixth-generation iPod touch restored",
    "newest beta of iOS 11.3 adds support for the iPod touch",
  ],
  [
    "AirPlay 2 functionality removed",
    "it removes AirPlay 2 features that were present in previous betas",
  ],
  [
    "Health Record feature analytics data sharing",
    "share Health Record analytics with Apple",
  ],
  [
    "Books naming change reverted iBooks",
    'the renamed "Books" app has reverted to its original "iBooks" name',
  ],
  [
    "ClassKit framework education features",
    "the new ClassKit framework Apple introduced at its March event",
  ],
  [
    "Messages in iCloud re-introduced",
    "Messages on iCloud is present in the iOS 11.4 beta after being removed from iOS 11.3",
  ],
  [
    "AirPlay 2 features re-introduced",
    "as are AirPlay 2 features",
  ],
  [
    "HomePod stereo support not functional",
    "Stereo support for the HomePod is included, but the feature doesn't work properly",
  ],
  [
    "HomePod stereo sound mention removed",
    "Mentions of the non-functional HomePod stereo pairing feature have been removed",
  ],
  [
    "PRODUCT RED wallpaper iPhone 8 Plus",
    "Apple has added a new (PRODUCT)RED wallpaper for the iPhone 8 and iPhone 8 Plus",
  ],
  [
    "mentions feature removed Apple release notes",
    "Mentions of the feature were removed from Apple's release notes",
  ],
  [
    "USB Restricted Mode first introduced iOS 11.3 beta",
    "USB Restricted Mode was actually first introduced in the iOS 11.3 beta",
  ],
]);
const exactAnchorByCitation = new Map([
  [
    citationKey(U.appleIos11Updates, "iOS 11.1 public boundary"),
    "iOS 11.1 introduces over 70 new emoji and includes bug fixes and improvements",
  ],
  [
    citationKey(U.appleIos11Updates, "iOS 11.2 public boundary"),
    "iOS 11.2 introduces Apple Pay Cash to send, request, and receive money from friends and family with Apple Pay",
  ],
  [
    citationKey(U.appleIos11Updates, "iOS 11.3 public boundary"),
    "iOS 11.3 introduces new features including ARKit 1.5",
  ],
  [
    citationKey(U.appleIos113Release, "iOS 11.3 public boundary"),
    "iOS 11.3 is available today",
  ],
  [
    citationKey(U.appleIos11Updates, "iOS 11.4 public boundary"),
    "iOS 11.4 includes AirPlay 2 multi-room audio, support for HomePod stereo pairs, and Messages in iCloud",
  ],
  [
    citationKey(U.appleIos11Updates, "iOS 11.4.1 public boundary"),
    "iOS 11.4.1 includes bug fixes and improves the security of your iPhone or iPad",
  ],
  [
    citationKey(U.ios112Beta2X, "Beta 2 iOS 11.2"),
    "Apple has released a new beta of iOS 11.2 for the iPhone X",
  ],
  [
    citationKey(U.ios111Beta5, "iOS 11.1 beta feature inventory"),
    "Apple Seeds Fifth Beta of iOS 11.1 to Developers and Public Beta Testers",
  ],
  [
    citationKey(U.ios112Beta4, "iOS 11.2 beta feature inventory"),
    "Apple Seeds Fourth Beta of iOS 11.2 to Developers",
  ],
  [
    citationKey(U.ios112Beta5, "iOS 11.2 beta feature inventory"),
    "Apple Seeds Fifth Beta of iOS 11.2 to Developers",
  ],
  [
    citationKey(U.ios112Beta6, "iOS 11.2 beta feature inventory"),
    "Apple Seeds Sixth Beta of iOS 11.2 to Developers and Public Beta Testers",
  ],
  [
    citationKey(U.ios113Beta5, "iOS 11.3 beta feature inventory"),
    "Apple Seeds Fifth Beta of iOS 11.3 to Developers",
  ],
  [
    citationKey(U.ios113Beta6, "iOS 11.3 beta feature inventory"),
    "Apple Seeds Sixth Beta of iOS 11.3 to Developers",
  ],
  [
    citationKey(U.ios114Beta3, "iOS 11.4 beta feature inventory"),
    "Apple Seeds Third Beta of iOS 11.4 to Developers",
  ],
  [
    citationKey(U.ios114Beta4, "iOS 11.4 beta feature inventory"),
    "Apple Seeds Fourth Beta of iOS 11.4 to Developers",
  ],
  [
    citationKey(U.ios114Beta5, "iOS 11.4 beta feature inventory"),
    "Apple Seeds Fifth Beta of iOS 11.4 to Developers",
  ],
  [
    citationKey(U.ios1141Beta1, "iOS 11.4.1 beta feature inventory"),
    "We don't know what new features are included in the iOS 11.4.1 beta",
  ],
  [
    citationKey(U.ios1141Beta2, "iOS 11.4.1 beta feature inventory"),
    "No new features were discovered in the first iOS 11.4.1 beta",
  ],
  [
    citationKey(U.ios1141Beta3, "iOS 11.4.1 beta feature inventory"),
    "No new features were discovered in the first two iOS 11.4.1 betas",
  ],
  [
    citationKey(U.ios1141Beta4, "iOS 11.4.1 beta feature inventory"),
    "No new features were discovered in the first three iOS 11.4.1 betas",
  ],
  [
    citationKey(U.ios1141Beta5, "iOS 11.4.1 beta feature inventory"),
    "No new features were discovered in the first four iOS 11.4.1 betas",
  ],
]);
const identityLocator =
  /^(?:Public )?Beta \d+ (?:iOS [0-9.]+|public beta testers)$/;
const cite = (url, locator, note) => {
  const exactAnchor =
    exactAnchorByCitation.get(citationKey(url, locator)) ||
    exactAnchorByLocator.get(locator) ||
    (identityLocator.test(locator) ? sourceByUrl.get(url)?.title : null);
  assert(exactAnchor, `exact citation anchor for ${url} — ${locator}`);
  return {
    url,
    locator: `${locator} — ${exactAnchor}`,
    note,
  };
};
const identityNote = "Contemporary milestone identity and audience.";
const observedNote =
  "Contemporary observation, independently paraphrased and narrowly scoped.";
const firstPartyNote =
  "First-party announcement used for the stated developer-preview scope.";
const boundaryNote =
  "Later first-party material defines the public boundary, not prerelease timing.";
const maintenanceNote =
  "The negative finding is limited to what this retained report catalogued.";
const retrospectiveNote =
  "A later same-publisher recap supports the mechanism, not its first appearance.";

const definitions = new Map();
const occurrence = ({
  suffix,
  title,
  canonicalSummary,
  category,
  action,
  inheritance = "delta",
  documentedStatus = "undocumented",
  evidenceState = "reported",
  verificationMethod,
  citations,
  summary = canonicalSummary,
}) => {
  const key = `apple-ios-11-point-prerelease-${suffix}`;
  const definition = { title, canonicalSummary, category };
  const previous = definitions.get(key);
  if (previous) assert.deepEqual(definition, previous, `${key} definition`);
  else definitions.set(key, definition);
  return {
    key,
    ...definition,
    action,
    inheritance,
    summary,
    documentedStatus,
    evidenceState,
    verificationMethod:
      verificationMethod ||
      "Matched the bounded state to retained evidence and rewrote it in original language.",
    citations,
  };
};
const reuse = (suffix, fields) =>
  occurrence({
    suffix,
    ...definitions.get(`apple-ios-11-point-prerelease-${suffix}`),
    ...fields,
  });
const reported = (input) => occurrence(input);
const confirmed = (input) =>
  occurrence({
    documentedStatus: "documented",
    evidenceState: "confirmed",
    verificationMethod:
      "Matched this bounded preview claim in Apple material and restated it independently.",
    ...input,
  });

const reportedCitation = (url, locator) => cite(url, locator, observedNote);
const appleCitation = (url, locator) => cite(url, locator, firstPartyNote);
const maintenance = (versionCode, url, first) => {
  const displayVersion = {
    111: "11.1",
    112: "11.2",
    113: "11.3",
    114: "11.4",
    1141: "11.4.1",
  }[versionCode];
  const fields = {
    action: first ? "introduced" : "changed",
    inheritance: first ? "delta" : "cumulative",
    citations: [
      cite(
        url,
        `iOS ${displayVersion} beta feature inventory`,
        maintenanceNote,
      ),
    ],
  };
  if (!first) return reuse(`${versionCode}-maintenance-inventory`, fields);
  return reported({
    suffix: `${versionCode}-maintenance-inventory`,
    title: "Retained coverage added no outward feature",
    canonicalSummary:
      "The cited milestone report catalogued no newly observed user-facing addition for that seed.",
    category: "other",
    ...fields,
  });
};

const devChanges = new Map();
const setChanges = (version, alias, changes) =>
  devChanges.set(`${version}/${alias}`, changes);

setChanges("11.1", "beta-1", [
  reported({
    suffix: "111-predictive-emoji-options",
    title: "Predictive typing offered several emoji choices",
    canonicalSummary:
      "Emoji-related words could surface multiple symbols in the keyboard suggestion row.",
    category: "enhancement",
    action: "introduced",
    citations: [
      reportedCitation(
        U.ios111PublicBeta1,
        "multiple emoji suggestions predictive text",
      ),
    ],
  }),
  reported({
    suffix: "111-restrictions-camera-artwork",
    title: "Restrictions showed revised camera artwork",
    canonicalSummary:
      "The camera entry under parental restrictions received a different icon.",
    category: "enhancement",
    action: "changed",
    citations: [
      reportedCitation(
        U.ios111PublicBeta1,
        "updated camera icon under Restrictions",
      ),
    ],
  }),
  reported({
    suffix: "111-status-bar-scroll-motion",
    title: "Status-bar scrolling gained new motion",
    canonicalSummary:
      "Tapping the status area to return upward used a revised transition.",
    category: "behavior",
    action: "changed",
    citations: [
      reportedCitation(
        U.ios111PublicBeta1,
        "animation tapping status bar scroll upwards",
      ),
    ],
  }),
  reported({
    suffix: "111-unlock-animation-speed",
    title: "Unlocking completed with quicker animation",
    canonicalSummary:
      "The device-unlock transition played more rapidly in the first seed.",
    category: "behavior",
    action: "changed",
    citations: [
      reportedCitation(U.ios111PublicBeta1, "faster unlock animation"),
    ],
  }),
]);
setChanges("11.1", "beta-2", [
  reported({
    suffix: "111-unicode-10-emoji",
    title: "Unicode 10 emoji joined the keyboard",
    canonicalSummary:
      "The second seed added Apple artwork for the Unicode 10 character set.",
    category: "feature",
    action: "introduced",
    citations: [reportedCitation(U.ios111Beta2, "new Unicode 10 emoji")],
  }),
  reported({
    suffix: "111-existing-emoji-redesign",
    title: "Several existing emoji were redrawn",
    canonicalSummary:
      "A selection of animal symbols received more detailed visual treatments.",
    category: "enhancement",
    action: "changed",
    citations: [
      reportedCitation(
        U.ios111Beta2,
        "emoji small design changes dolphin octopus",
      ),
    ],
  }),
  reported({
    suffix: "111-3d-touch-app-switcher",
    title: "Edge-press multitasking gesture returned",
    canonicalSummary:
      "Pressure at the display’s left edge once again opened the application switcher.",
    category: "feature",
    action: "introduced",
    citations: [
      reportedCitation(U.ios111Switcher, "3D Touch App Switcher returned"),
    ],
  }),
]);
setChanges("11.1", "beta-3", [
  reported({
    suffix: "111-reachability-notification-cover",
    title: "Reachability restored notification access",
    canonicalSummary:
      "The lowered interface could again expose the notification cover at mid-screen.",
    category: "bugFix",
    action: "fixed",
    citations: [
      reportedCitation(
        U.ios111Beta3,
        "Reachability bug Cover Screen Notifications",
      ),
    ],
  }),
]);
setChanges("11.1", "beta-4", [
  reported({
    suffix: "111-krack-wifi-mitigation",
    title: "WPA2 key-reinstallation weakness was addressed",
    canonicalSummary:
      "The seed carried Apple’s mitigation for the Wi-Fi protocol attack known as KRACK.",
    category: "security",
    action: "fixed",
    documentedStatus: "partiallyDocumented",
    citations: [
      reportedCitation(U.ios111Beta4, "security fixes WPA2 Wi-Fi KRACK"),
    ],
  }),
]);
setChanges("11.1", "beta-5", [maintenance("111", U.ios111Beta5, true)]);

setChanges("11.2", "beta-1", [
  reported({
    suffix: "112-calculator-rapid-input",
    title: "Calculator accepted rapid sequences reliably",
    canonicalSummary:
      "Eliminating its animation kept rapidly entered numbers and symbols from being lost.",
    category: "bugFix",
    action: "fixed",
    citations: [
      reportedCitation(
        U.ios112Beta1,
        "Calculator animation issue numbers symbols ignored",
      ),
      cite(
        U.ios112PublicBeta2,
        "Calculator rapid-input mechanism",
        retrospectiveNote,
      ),
    ],
  }),
  reported({
    suffix: "112-control-center-apple-tv",
    title: "Control Center gained Apple TV playback controls",
    canonicalSummary:
      "A Now Playing target could operate media running on an Apple television device.",
    category: "feature",
    action: "introduced",
    citations: [
      reportedCitation(
        U.ios112Beta1,
        "Now Playing controlling Apple TV Control Center",
      ),
    ],
  }),
  reported({
    suffix: "112-camera-emoji-artwork",
    title: "Camera emoji artwork changed",
    canonicalSummary:
      "Apple revised the visual design used for the camera symbol.",
    category: "enhancement",
    action: "changed",
    citations: [reportedCitation(U.ios112Beta1, "redesigned camera emoji")],
  }),
  reported({
    suffix: "112-live-photo-effect-loading",
    title: "Live Photo effects showed loading progress",
    canonicalSummary:
      "Applying an effect to a Live Photo displayed a newly animated wait state.",
    category: "enhancement",
    action: "introduced",
    citations: [
      reportedCitation(U.ios112Beta1, "loading animation Live Photos effects"),
    ],
  }),
  reported({
    suffix: "112-tv-app-nordic-expansion",
    title: "TV application reached two Nordic markets",
    canonicalSummary:
      "The television discovery application appeared for users in Norway and Sweden.",
    category: "compatibility",
    action: "introduced",
    citations: [reportedCitation(U.ios112Beta1, "TV app Sweden Norway")],
  }),
]);
setChanges("11.2", "beta-2-2017-11-03", [
  reported({
    suffix: "112-iphone-x-beta-availability",
    title: "iPhone X received a separate beta build",
    canonicalSummary:
      "Apple distributed an iPhone X-compatible 11.2 seed before the general second beta.",
    category: "compatibility",
    action: "introduced",
    citations: [
      reportedCitation(U.ios112Beta2X, "released new beta iOS 11.2 iPhone X"),
    ],
  }),
]);
setChanges("11.2", "beta-2-2017-11-06", [
  reported({
    suffix: "112-subscription-introductory-pricing",
    title: "Renewing subscriptions gained introductory pricing",
    canonicalSummary:
      "Developers could offer discounted opening terms to new customers of auto-renewing subscriptions.",
    category: "developerApi",
    action: "introduced",
    documentedStatus: "partiallyDocumented",
    citations: [
      reportedCitation(
        U.ios112Beta2,
        "discounted introductory pricing auto-renewable subscriptions",
      ),
    ],
  }),
  reported({
    suffix: "112-autocorrect-i-symbol",
    title: "Letter-I autocorrection fix was reported",
    canonicalSummary:
      "Contemporary coverage said the second developer beta corrected the unintended replacement of a typed capital I.",
    category: "bugFix",
    action: "fixed",
    citations: [
      reportedCitation(
        U.ios112Autocorrect,
        "autocorrect bug latest developer beta fix",
      ),
    ],
  }),
]);
setChanges("11.2", "beta-3", [
  reported({
    suffix: "112-control-center-radio-explanations",
    title: "Wireless toggles received explanatory cards",
    canonicalSummary:
      "First use of the Wi-Fi and Bluetooth controls displayed guidance about their disconnect behavior.",
    category: "enhancement",
    action: "introduced",
    citations: [
      reportedCitation(
        U.ios112ControlCenter,
        "pop-up explain Control Center Wi-Fi Bluetooth",
      ),
    ],
  }),
  reported({
    suffix: "112-wireless-charging-75w",
    title: "Qi charging reached 7.5 watts",
    canonicalSummary:
      "Compatible iPhone 8 and X hardware could draw more than the earlier five-watt limit.",
    category: "enhancement",
    action: "introduced",
    citations: [
      reportedCitation(U.ios112Charging, "7.5W charging iPhone 8 Plus X"),
    ],
  }),
]);
setChanges("11.2", "beta-4", [maintenance("112", U.ios112Beta4, true)]);
setChanges("11.2", "beta-5", [maintenance("112", U.ios112Beta5, false)]);
setChanges("11.2", "beta-6", [maintenance("112", U.ios112Beta6, false)]);

setChanges("11.3", "beta-1", [
  confirmed({
    suffix: "113-arkit-surface-mapping",
    title: "ARKit understood more surface shapes",
    canonicalSummary:
      "Version 1.5 recognized vertical planes and mapped irregular horizontal forms more accurately.",
    category: "developerApi",
    action: "introduced",
    citations: [
      appleCitation(
        U.appleIos113Preview,
        "ARKit 1.5 vertical surfaces irregularly shaped",
      ),
    ],
  }),
  confirmed({
    suffix: "113-arkit-image-recognition",
    title: "ARKit recognized flat reference images",
    canonicalSummary:
      "Applications could locate posters, signs, and artwork inside an augmented scene.",
    category: "developerApi",
    action: "introduced",
    citations: [
      appleCitation(
        U.appleIos113Preview,
        "recognize position of 2D images signs posters",
      ),
    ],
  }),
  confirmed({
    suffix: "113-arkit-camera-quality",
    title: "AR camera capture became sharper",
    canonicalSummary:
      "The real-world camera feed gained higher resolution and automatic focus.",
    category: "enhancement",
    action: "changed",
    citations: [
      appleCitation(
        U.appleIos113Preview,
        "camera 50 percent greater resolution auto-focus",
      ),
    ],
  }),
  confirmed({
    suffix: "113-four-animoji",
    title: "Four additional Animoji appeared",
    canonicalSummary:
      "The iPhone X character set gained four additions: lion, skull, bear, and dragon.",
    category: "feature",
    action: "introduced",
    citations: [
      appleCitation(U.appleIos113Preview, "dragon bear skull lion Animoji"),
    ],
  }),
  confirmed({
    suffix: "113-health-records",
    title: "Health assembled provider medical records",
    canonicalSummary:
      "Participating institutions could supply encrypted clinical information in one patient-controlled view.",
    category: "feature",
    action: "introduced",
    citations: [
      appleCitation(
        U.appleIos113Preview,
        "Health Records hospitals clinics existing Health app",
      ),
    ],
  }),
  confirmed({
    suffix: "113-news-video-group",
    title: "News added a dedicated video group",
    canonicalSummary:
      "The For You area collected prominent daily video coverage alongside revised top stories.",
    category: "enhancement",
    action: "introduced",
    citations: [
      appleCitation(U.appleIos113Preview, "Apple News new Video group For You"),
    ],
  }),
  confirmed({
    suffix: "113-homekit-software-authentication",
    title: "HomeKit accepted software authentication",
    canonicalSummary:
      "Accessory makers gained a software route for adding HomeKit support to existing products.",
    category: "developerApi",
    action: "introduced",
    citations: [
      appleCitation(
        U.appleIos113Preview,
        "HomeKit software authentication existing accessories",
      ),
    ],
  }),
  confirmed({
    suffix: "113-advanced-mobile-location",
    title: "Emergency calls supported AML location",
    canonicalSummary:
      "In participating countries, emergency dialing could automatically transmit the caller’s current position.",
    category: "feature",
    action: "introduced",
    citations: [
      appleCitation(
        U.appleIos113Preview,
        "Advanced Mobile Location automatically send current location",
      ),
    ],
  }),
  reported({
    suffix: "113-messages-in-icloud",
    title: "Messages synchronization through iCloud returned",
    canonicalSummary:
      "The first seed restored the iCloud Messages feature that had been removed before iOS 11 shipped.",
    category: "feature",
    action: "introduced",
    citations: [
      reportedCitation(U.ios113Beta1, "Messages in iCloud sync across devices"),
    ],
  }),
  reported({
    suffix: "113-airplay-2",
    title: "AirPlay 2 multiroom testing resumed",
    canonicalSummary:
      "The seed restored multiroom audio controls and exposed Apple TV inside the Home application.",
    category: "feature",
    action: "introduced",
    citations: [
      reportedCitation(U.ios113Beta1, "AirPlay 2 multi-room audio Home app"),
    ],
  }),
  reported({
    suffix: "113-books-name",
    title: "iBooks temporarily became Books",
    canonicalSummary:
      "The built-in reading application dropped the leading letter from its displayed name.",
    category: "behavior",
    action: "changed",
    citations: [reportedCitation(U.ios113Beta1, "iBooks app renamed Books")],
  }),
  reported({
    suffix: "113-app-store-update-metadata",
    title: "App updates exposed version and size",
    canonicalSummary:
      "The Updates list once again showed each package’s release number and download weight.",
    category: "enhancement",
    action: "introduced",
    citations: [
      reportedCitation(
        U.ios113Beta1,
        "App Store Updates version number update size",
      ),
    ],
  }),
  reported({
    suffix: "113-data-privacy-explanations",
    title: "System data requests gained privacy context",
    canonicalSummary:
      "A new icon and explanatory screen clarified when Apple asked to use personal information.",
    category: "enhancement",
    action: "introduced",
    citations: [
      reportedCitation(U.ios113Beta1, "privacy icon personal information"),
    ],
  }),
]);
setChanges("11.3", "beta-2", [
  reported({
    suffix: "113-battery-capacity-service",
    title: "Battery settings reported capacity and service need",
    canonicalSummary:
      "Supported iPhones displayed estimated maximum charge capacity and a repair recommendation when warranted.",
    category: "feature",
    action: "introduced",
    citations: [
      reportedCitation(
        U.ios113Beta2,
        "Battery Health maximum capacity service",
      ),
    ],
  }),
  reported({
    suffix: "113-performance-management-control",
    title: "Performance management became visible and reversible",
    canonicalSummary:
      "Owners could see whether shutdown protection had engaged and turn that throttling off.",
    category: "feature",
    action: "introduced",
    citations: [
      reportedCitation(
        U.ios113Beta2,
        "Peak Performance Capability disable performance management",
      ),
    ],
  }),
  reported({
    suffix: "113-ipod-touch-support",
    title: "Sixth-generation iPod touch was unsupported",
    canonicalSummary:
      "Apple’s second seed could not be installed on the sixth-generation music player.",
    category: "knownIssue",
    action: "knownIssue",
    documentedStatus: "partiallyDocumented",
    citations: [
      reportedCitation(
        U.ios113Beta2,
        "does not support sixth-generation iPod touch",
      ),
    ],
  }),
]);
setChanges("11.3", "beta-3", [
  reuse("113-ipod-touch-support", {
    action: "fixed",
    citations: [
      reportedCitation(
        U.ios113Beta3,
        "support for sixth-generation iPod touch restored",
      ),
    ],
    summary:
      "The third seed again installed on the sixth-generation iPod touch.",
  }),
  reuse("113-airplay-2", {
    action: "removed",
    citations: [
      reportedCitation(U.ios113Beta3, "AirPlay 2 functionality removed"),
    ],
    summary:
      "The third seed withdrew the AirPlay 2 controls that had appeared earlier.",
  }),
  reported({
    suffix: "113-health-records-analytics",
    title: "Health Records added analytics sharing",
    canonicalSummary:
      "An opt-in control allowed de-identified Health Records usage information to be sent to Apple.",
    category: "enhancement",
    action: "introduced",
    citations: [
      reportedCitation(
        U.ios113Beta3,
        "Health Record feature analytics data sharing",
      ),
    ],
  }),
]);
setChanges("11.3", "beta-4", [
  reuse("113-books-name", {
    action: "removed",
    citations: [
      reportedCitation(U.ios113Beta4, "Books naming change reverted iBooks"),
    ],
    summary:
      "The fourth seed restored the iBooks label, ending the temporary Books name.",
  }),
]);
setChanges("11.3", "beta-5", [maintenance("113", U.ios113Beta5, true)]);
setChanges("11.3", "beta-6", [maintenance("113", U.ios113Beta6, false)]);

setChanges("11.4", "beta-1", [
  reported({
    suffix: "114-classkit",
    title: "ClassKit framework entered developer testing",
    canonicalSummary:
      "Education applications gained APIs for reporting assigned learning activities and progress.",
    category: "developerApi",
    action: "introduced",
    citations: [
      reportedCitation(U.ios114Beta1, "ClassKit framework education features"),
    ],
  }),
  reuse("113-messages-in-icloud", {
    action: "changed",
    citations: [
      reportedCitation(U.ios114Beta1, "Messages in iCloud re-introduced"),
    ],
    summary:
      "Messages in iCloud resurfaced after being omitted from the 11.3 public build.",
  }),
  reuse("113-airplay-2", {
    action: "changed",
    citations: [
      reportedCitation(U.ios114Beta1, "AirPlay 2 features re-introduced"),
    ],
    summary:
      "AirPlay 2 reappeared after its removal during the 11.3 test cycle.",
  }),
  reported({
    suffix: "114-homepod-stereo-note",
    title: "HomePod stereo pairing remained nonfunctional",
    canonicalSummary:
      "The first seed exposed signs of paired-speaker support without matching HomePod test software.",
    category: "knownIssue",
    action: "knownIssue",
    citations: [
      reportedCitation(U.ios114Beta1, "HomePod stereo support not functional"),
    ],
  }),
]);
setChanges("11.4", "beta-2", [
  reuse("114-homepod-stereo-note", {
    action: "removed",
    citations: [
      reportedCitation(U.ios114Beta2, "HomePod stereo sound mention removed"),
    ],
    summary: "The second seed removed the earlier HomePod stereo reference.",
  }),
  reported({
    suffix: "114-product-red-wallpaper",
    title: "Red iPhone models gained matching wallpaper",
    canonicalSummary:
      "iPhone 8 and 8 Plus units in PRODUCT(RED) received a coordinated background image.",
    category: "enhancement",
    action: "introduced",
    citations: [
      reportedCitation(U.ios114Beta2, "PRODUCT RED wallpaper iPhone 8 Plus"),
    ],
  }),
]);
setChanges("11.4", "beta-3", [maintenance("114", U.ios114Beta3, true)]);
setChanges("11.4", "beta-4", [maintenance("114", U.ios114Beta4, false)]);
setChanges("11.4", "beta-5", [maintenance("114", U.ios114Beta5, false)]);
setChanges("11.4", "beta-6", [
  reported({
    suffix: "114-usb-restricted-note",
    title: "USB restriction mention disappeared",
    canonicalSummary:
      "By the sixth seed, retained coverage said Apple had removed the prerelease note describing timed Lightning data limits.",
    category: "removal",
    action: "removed",
    documentedStatus: "partiallyDocumented",
    citations: [
      reportedCitation(
        U.ios114Beta6,
        "mentions feature removed Apple release notes",
      ),
      reportedCitation(
        U.ios114Usb,
        "USB Restricted Mode first introduced iOS 11.3 beta",
      ),
    ],
  }),
]);

setChanges("11.4.1", "beta-1", [maintenance("1141", U.ios1141Beta1, true)]);
setChanges("11.4.1", "beta-2", [maintenance("1141", U.ios1141Beta2, false)]);
setChanges("11.4.1", "beta-3", [maintenance("1141", U.ios1141Beta3, false)]);
setChanges("11.4.1", "beta-4", [maintenance("1141", U.ios1141Beta4, false)]);
setChanges("11.4.1", "beta-5", [maintenance("1141", U.ios1141Beta5, false)]);

const versionRoutes = [
  {
    version: "11.1",
    boundaryUrls: [U.appleIos11Updates],
    developer: [
      ["beta-1", "Beta 1", "2017-09-27", 1, U.ios111Beta1],
      ["beta-2", "Beta 2", "2017-10-09", 2, U.ios111Beta2],
      ["beta-3", "Beta 3", "2017-10-16", 3, U.ios111Beta3],
      ["beta-4", "Beta 4", "2017-10-20", 4, U.ios111Beta4],
      ["beta-5", "Beta 5", "2017-10-23", 5, U.ios111Beta5],
    ],
    public: [
      ["public-beta-1", "Public Beta 1", "2017-09-28", 1, U.ios111PublicBeta1],
      ["public-beta-2", "Public Beta 2", "2017-10-09", 2, U.ios111Beta2],
      ["public-beta-3", "Public Beta 3", "2017-10-16", 3, U.ios111Beta3],
      ["public-beta-4", "Public Beta 4", "2017-10-20", 4, U.ios111Beta4],
      ["public-beta-5", "Public Beta 5", "2017-10-23", 5, U.ios111Beta5],
    ],
  },
  {
    version: "11.2",
    boundaryUrls: [U.appleIos11Updates],
    developer: [
      ["beta-1", "Beta 1", "2017-10-30", 1, U.ios112Beta1],
      ["beta-2-2017-11-03", "Beta 2", "2017-11-03", 2, U.ios112Beta2X],
      ["beta-2-2017-11-06", "Beta 2", "2017-11-06", 2, U.ios112Beta2],
      ["beta-3", "Beta 3", "2017-11-13", 3, U.ios112Beta3],
      ["beta-4", "Beta 4", "2017-11-17", 4, U.ios112Beta4],
      ["beta-5", "Beta 5", "2017-11-28", 5, U.ios112Beta5],
      ["beta-6", "Beta 6", "2017-12-01", 6, U.ios112Beta6],
    ],
    public: [
      ["public-beta-1", "Public Beta 1", "2017-11-01", 1, U.ios112PublicBeta1],
      ["public-beta-2", "Public Beta 2", "2017-11-07", 2, U.ios112PublicBeta2],
      ["public-beta-3", "Public Beta 3", "2017-11-13", 3, U.ios112Beta3],
      ["public-beta-4", "Public Beta 4", "2017-11-17", 4, U.ios112Beta4],
      ["public-beta-5", "Public Beta 5", "2017-11-28", 5, U.ios112Beta5],
      ["public-beta-6", "Public Beta 6", "2017-12-01", 6, U.ios112Beta6],
    ],
  },
  {
    version: "11.3",
    boundaryUrls: [U.appleIos113Release, U.appleIos11Updates],
    developer: [
      ["beta-1", "Beta 1", "2018-01-24", 1, U.ios113Beta1],
      ["beta-2", "Beta 2", "2018-02-06", 2, U.ios113Beta2],
      ["beta-3", "Beta 3", "2018-02-20", 3, U.ios113Beta3],
      ["beta-4", "Beta 4", "2018-03-05", 4, U.ios113Beta4],
      ["beta-5", "Beta 5", "2018-03-12", 5, U.ios113Beta5],
      ["beta-6", "Beta 6", "2018-03-16", 6, U.ios113Beta6],
    ],
    public: [
      ["public-beta-1", "Public Beta 1", "2018-01-25", 1, U.ios113PublicBeta1],
      ["public-beta-2", "Public Beta 2", "2018-02-07", 2, U.ios113PublicBeta2],
      ["public-beta-3", "Public Beta 3", "2018-02-21", 3, U.ios113PublicBeta3],
      ["public-beta-4", "Public Beta 4", "2018-03-05", 4, U.ios113Beta4],
      ["public-beta-5", "Public Beta 5", "2018-03-12", 5, U.ios113Beta5],
      ["public-beta-6", "Public Beta 6", "2018-03-16", 6, U.ios113Beta6],
    ],
  },
  {
    version: "11.4",
    boundaryUrls: [U.appleIos11Updates],
    developer: [
      ["beta-1", "Beta 1", "2018-04-02", 1, U.ios114Beta1],
      ["beta-2", "Beta 2", "2018-04-16", 2, U.ios114Beta2],
      ["beta-3", "Beta 3", "2018-05-01", 3, U.ios114Beta3],
      ["beta-4", "Beta 4", "2018-05-07", 4, U.ios114Beta4],
      ["beta-5", "Beta 5", "2018-05-14", 5, U.ios114Beta5],
      ["beta-6", "Beta 6", "2018-05-17", 6, U.ios114Beta6],
    ],
    public: [
      ["public-beta-1", "Public Beta 1", "2018-04-03", 1, U.ios114PublicBeta1],
      ["public-beta-2", "Public Beta 2", "2018-04-17", 2, U.ios114PublicBeta2],
      ["public-beta-3", "Public Beta 3", "2018-05-01", 3, U.ios114Beta3],
      ["public-beta-4", "Public Beta 4", "2018-05-07", 4, U.ios114Beta4],
      ["public-beta-5", "Public Beta 5", "2018-05-14", 5, U.ios114Beta5],
      ["public-beta-6", "Public Beta 6", "2018-05-17", 6, U.ios114Beta6],
    ],
  },
  {
    version: "11.4.1",
    boundaryUrls: [U.appleIos11Updates],
    developer: [
      ["beta-1", "Beta 1", "2018-05-30", 1, U.ios1141Beta1],
      ["beta-2", "Beta 2", "2018-06-11", 2, U.ios1141Beta2],
      ["beta-3", "Beta 3", "2018-06-18", 3, U.ios1141Beta3],
      ["beta-4", "Beta 4", "2018-06-25", 4, U.ios1141Beta4],
      ["beta-5", "Beta 5", "2018-07-02", 5, U.ios1141Beta5],
    ],
    public: [
      ["public-beta-1", "Public Beta 1", "2018-05-31", 1, U.ios1141PublicBeta1],
      ["public-beta-2", "Public Beta 2", "2018-06-12", 2, U.ios1141PublicBeta2],
      ["public-beta-3", "Public Beta 3", "2018-06-18", 3, U.ios1141Beta3],
      ["public-beta-4", "Public Beta 4", "2018-06-25", 4, U.ios1141Beta4],
      ["public-beta-5", "Public Beta 5", "2018-07-02", 5, U.ios1141Beta5],
    ],
  },
];

// The seed migration already owns these developer routes in production. An
// overlay must preserve its deterministic legacy identity rather than mint a
// duplicate event or attempt an identity rewrite. Public-beta routes below are
// genuinely new and use the canonical event:apple namespace.
const ownedDeveloperStableIds = new Map([
  ["11.1/beta-1", "version-ios-11-1:m-432dacc67f65"],
  ["11.1/beta-2", "version-ios-11-1:m-7c169bfd2cc8"],
  ["11.1/beta-3", "version-ios-11-1:m-96eaec4b472a"],
  ["11.1/beta-4", "version-ios-11-1:m-c471d4d9158f"],
  ["11.1/beta-5", "version-ios-11-1:m-d1457b7fc607"],
  ["11.2/beta-1", "version-ios-11-2:m-662b85da7064"],
  ["11.2/beta-2-2017-11-03", "version-ios-11-2:m-7f3279e7e655"],
  ["11.2/beta-2-2017-11-06", "version-ios-11-2:m-7e6fee94c73b"],
  ["11.2/beta-3", "version-ios-11-2:m-ebbcf7289ac7"],
  ["11.2/beta-4", "version-ios-11-2:m-c0f6e59a2bdf"],
  ["11.2/beta-5", "version-ios-11-2:m-82393b4a7c5b"],
  ["11.2/beta-6", "version-ios-11-2:m-73eb31aade10"],
  ["11.3/beta-1", "version-ios-11-3:m-832c5748b02b"],
  ["11.3/beta-2", "version-ios-11-3:m-e9c1a5895fc0"],
  ["11.3/beta-3", "version-ios-11-3:m-293e5476c031"],
  ["11.3/beta-4", "version-ios-11-3:m-e3039e5d092c"],
  ["11.3/beta-5", "version-ios-11-3:m-137599224926"],
  ["11.3/beta-6", "version-ios-11-3:m-467286ba3d81"],
  ["11.4/beta-1", "version-ios-11-4:m-9d892bc27987"],
  ["11.4/beta-2", "version-ios-11-4:m-5ab69b7b6d3a"],
  ["11.4/beta-3", "version-ios-11-4:m-16203fd55d68"],
  ["11.4/beta-4", "version-ios-11-4:m-50f4bb47c380"],
  ["11.4/beta-5", "version-ios-11-4:m-64b8ec7218d5"],
  ["11.4/beta-6", "version-ios-11-4:m-08fde7d7f6e4"],
  ["11.4.1/beta-1", "version-ios-11-4-1:m-98d4e53703f4"],
  ["11.4.1/beta-2", "version-ios-11-4-1:m-e4571896e60b"],
  ["11.4.1/beta-3", "version-ios-11-4-1:m-f14302cf3420"],
  ["11.4.1/beta-4", "version-ios-11-4-1:m-c4a48c9be28d"],
  ["11.4.1/beta-5", "version-ios-11-4-1:m-8cf3a9454d45"],
]);

const eventSpecs = [];
for (const routeGroup of versionRoutes) {
  const versionId = `version-ios-${routeGroup.version.replaceAll(".", "-")}`;
  for (const [
    alias,
    label,
    date,
    sequence,
    identityUrl,
  ] of routeGroup.developer) {
    eventSpecs.push({
      versionId,
      version: routeGroup.version,
      alias,
      label,
      date,
      sequence,
      channel: "developerBeta",
      identityUrl,
      boundaryUrls: routeGroup.boundaryUrls,
      changes: devChanges.get(`${routeGroup.version}/${alias}`),
      stableEventId: ownedDeveloperStableIds.get(
        `${routeGroup.version}/${alias}`,
      ),
    });
  }
  routeGroup.public.forEach(
    ([alias, label, date, sequence, identityUrl], index) => {
      const suffix = `${routeGroup.version.replaceAll(".", "")}-public-beta-distribution`;
      const fields = {
        action: index === 0 ? "introduced" : "changed",
        inheritance: index === 0 ? "delta" : "cumulative",
        citations: [
          cite(identityUrl, `${label} public beta testers`, identityNote),
        ],
        summary: `${label} extended iOS ${routeGroup.version} testing to enrolled members of Apple’s public program.`,
      };
      const distribution =
        index === 0
          ? reported({
              suffix,
              title: "Public beta distribution continued",
              canonicalSummary:
                "Apple extended the prerelease build to enrolled members of its public testing program.",
              category: "other",
              ...fields,
            })
          : reuse(suffix, fields);
      const changes = [distribution];
      if (routeGroup.version === "11.2" && alias === "public-beta-2") {
        changes.push(
          reported({
            suffix: "112-apple-pay-cash-testing",
            title: "Apple Pay Cash testing opened",
            canonicalSummary:
              "Eligible testers could send person-to-person payments in Messages and hold received funds in Wallet.",
            category: "feature",
            action: "introduced",
            citations: [
              reportedCitation(
                U.ios112PublicBeta2,
                "Apple Pay Cash person-to-person payments Messages Wallet",
              ),
            ],
          }),
        );
      }
      eventSpecs.push({
        versionId,
        version: routeGroup.version,
        alias,
        label,
        date,
        sequence,
        channel: "publicBeta",
        identityUrl,
        boundaryUrls: routeGroup.boundaryUrls,
        changes,
        stableEventId: `event:apple:ios:${routeGroup.version}:${alias}`,
      });
    },
  );
}

assert(
  eventSpecs.every((spec) => spec.changes?.length),
  "every route has a bounded structured record",
);
assert.equal(eventSpecs.length, 57, "exact point-release route count");
assert.equal(
  ownedDeveloperStableIds.size,
  29,
  "owned developer identity count",
);
assert(
  eventSpecs
    .filter((spec) => spec.channel === "developerBeta")
    .every(
      (spec) =>
        spec.stableEventId ===
        ownedDeveloperStableIds.get(`${spec.version}/${spec.alias}`),
    ),
  "all developer routes reuse exact owned stable identities",
);

const seed = JSON.parse(readFileSync(join(here, "..", "seed-data.json")));
const expectedSeed = [
  [
    "11.1",
    "2017-10-31",
    [
      ["Beta 1", "2017-09-27"],
      ["Beta 2", "2017-10-09"],
      ["Beta 3", "2017-10-16"],
      ["Beta 4", "2017-10-20"],
      ["Beta 5", "2017-10-23"],
      ["Public", "2017-10-31"],
    ],
  ],
  [
    "11.2",
    "2017-12-02",
    [
      ["Beta 1", "2017-10-30"],
      ["Beta 2", "2017-11-03"],
      ["Beta 2", "2017-11-06"],
      ["Beta 3", "2017-11-13"],
      ["Beta 4", "2017-11-17"],
      ["Beta 5", "2017-11-28"],
      ["Beta 6", "2017-12-01"],
      ["Public", "2017-12-02"],
    ],
  ],
  [
    "11.3",
    "2018-03-29",
    [
      ["Beta 1", "2018-01-24"],
      ["Beta 2", "2018-02-06"],
      ["Beta 3", "2018-02-20"],
      ["Beta 4", "2018-03-05"],
      ["Beta 5", "2018-03-12"],
      ["Beta 6", "2018-03-16"],
      ["Public", "2018-03-29"],
    ],
  ],
  [
    "11.4",
    "2018-05-29",
    [
      ["Beta 1", "2018-04-02"],
      ["Beta 2", "2018-04-16"],
      ["Beta 3", "2018-05-01"],
      ["Beta 4", "2018-05-07"],
      ["Beta 5", "2018-05-14"],
      ["Beta 6", "2018-05-17"],
      ["Public", "2018-05-29"],
    ],
  ],
  [
    "11.4.1",
    "2018-07-09",
    [
      ["Beta 1", "2018-05-30"],
      ["Beta 2", "2018-06-11"],
      ["Beta 3", "2018-06-18"],
      ["Beta 4", "2018-06-25"],
      ["Beta 5", "2018-07-02"],
      ["Public", "2018-07-09"],
    ],
  ],
];
assert.deepEqual(
  seed.releaseVersions
    .filter(
      (item) =>
        item.platform === "iOS" &&
        expectedSeed.some(([version]) => version === item.version),
    )
    .map((item) => [
      item.version,
      item.publicReleaseDate,
      item.milestones.map((milestone) => [milestone.label, milestone.date]),
    ]),
  expectedSeed,
  "exact iOS 11 point-release seed closure",
);

const publicBatch = JSON.parse(
  readFileSync(join(here, "apple-ios-11.json"), "utf8"),
);
for (const [version] of expectedSeed) {
  const versionId = `version-ios-${version.replaceAll(".", "-")}`;
  const overlay = publicBatch.versions.find(
    (item) => item.releaseVersionId === versionId,
  );
  const event = publicBatch.events.find(
    (item) =>
      item.target?.releaseVersionId === versionId &&
      item.target?.routeAlias === "public",
  );
  assert(overlay, `${versionId} approved public overlay`);
  assert.equal(overlay.editorialReview?.status, "approved");
  assert(event, `${versionId} approved Public route`);
  assert.equal(event.editorialReview?.status, "approved");
  assert.equal(event.isIndexable, true);
}

const uniqueCitations = (citations) => [
  ...new Map(
    citations.map((citation) => [
      `${citation.url}|${citation.locator}|${citation.note}`,
      citation,
    ]),
  ).values(),
];
const events = eventSpecs.map((spec) => {
  const identityCitation = cite(
    spec.identityUrl,
    `${spec.label} iOS ${spec.version}`,
    identityNote,
  );
  const changeCitations = uniqueCitations(
    spec.changes.flatMap((change) => change.citations),
  );
  const boundaryCitations = spec.boundaryUrls.map((url) =>
    cite(url, `iOS ${spec.version} public boundary`, boundaryNote),
  );
  return {
    target: {
      releaseVersionId: spec.versionId,
      routeAlias: spec.alias,
    },
    identity: {
      releaseVersionId: spec.versionId,
      platformId: "platform-ios",
      stableEventId: spec.stableEventId,
      label: spec.label,
      routeAlias: spec.alias,
      channel: spec.channel,
      appearanceDate: spec.date,
      sequence: spec.sequence,
      isRevision: false,
      availabilityState: "available",
      closesReleaseCycle: false,
    },
    authorship: "originalSynthesis",
    summary: `${spec.label} is a source-linked iOS ${spec.version} historical candidate with ${spec.changes.length} bounded ${spec.changes.length === 1 ? "record" : "records"} and an explicit evidence boundary.`,
    article: {
      authorship: "originalSynthesis",
      blocks: [
        { style: "h2", text: "Milestone identity" },
        {
          style: "normal",
          text: `Contemporary coverage places ${spec.label} on ${spec.date}. This candidate records the ${spec.channel === "publicBeta" ? "public-testing audience" : "developer distribution"} without inferring an unpublished build or route.`,
          citations: [identityCitation],
        },
        { style: "h2", text: "Indexed evidence" },
        {
          style: "normal",
          text: `The page preserves ${spec.changes.length} narrowly bounded ${spec.changes.length === 1 ? "occurrence" : "occurrences"}. Reader-facing language is original synthesis, and the citations distinguish observation from Apple documentation.`,
          citations: changeCitations,
        },
        { style: "h2", text: "Evidence limits" },
        {
          style: "normal",
          text: `The later public record closes the iOS ${spec.version} cycle. It corroborates shipped state only and does not move any feature backward to this milestone.`,
          citations: boundaryCitations,
        },
      ],
    },
    citations: uniqueCitations([
      identityCitation,
      ...changeCitations,
      ...boundaryCitations,
    ]),
    changes: spec.changes,
    provenanceStatus: "sourceLinked",
    editorialReview: { status: "readyForReview" },
    isIndexable: false,
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

const declaredUrls = new Set(sources.map((source) => source.url));
assert.equal(declaredUrls.size, sources.length, "unique source URLs");
const citedUrls = new Set();
const visit = (value) => {
  if (Array.isArray(value)) {
    for (const item of value) visit(item);
    return;
  }
  if (!value || typeof value !== "object") return;
  for (const [key, child] of Object.entries(value)) {
    if (key === "citations") {
      for (const citation of child) citedUrls.add(citation.url);
    } else visit(child);
  }
};
visit(bundle);
assert.deepEqual(citedUrls, declaredUrls, "declared source/use closure");

let occurrenceCount = 0;
const localDefinitions = new Map();
for (const event of events) {
  assert.equal(event.provenanceStatus, "sourceLinked");
  assert.deepEqual(event.editorialReview, { status: "readyForReview" });
  assert.equal(event.isIndexable, false);
  assert.notEqual(event.target.routeAlias, "public");
  for (const change of event.changes) {
    occurrenceCount += 1;
    assert(change.citations.length > 0, `${change.key} citations`);
    assert(
      change.key.startsWith("apple-ios-11-point-prerelease-"),
      `${change.key} namespace`,
    );
    const definition = {
      title: change.title,
      canonicalSummary: change.canonicalSummary,
      category: change.category,
    };
    const previous = localDefinitions.get(change.key);
    if (previous) assert.deepEqual(definition, previous, change.key);
    else localDefinitions.set(change.key, definition);
  }
}
assert.equal(occurrenceCount, 89, "occurrence count");
assert.equal(localDefinitions.size, 51, "stable definition count");
assert.deepEqual(bundle.versions, [], "no version overlays");
assert.deepEqual(bundle.builds, [], "no build documents");

const recurrence = new Map();
for (const event of events) {
  for (const change of event.changes) {
    recurrence.set(change.key, [
      ...(recurrence.get(change.key) || []),
      `${event.target.releaseVersionId}/${event.target.routeAlias}:${change.action}`,
    ]);
  }
}
assert.deepEqual(
  recurrence.get("apple-ios-11-point-prerelease-113-airplay-2"),
  [
    "version-ios-11-3/beta-1:introduced",
    "version-ios-11-3/beta-3:removed",
    "version-ios-11-4/beta-1:changed",
  ],
  "AirPlay 2 transition",
);
assert.deepEqual(
  recurrence.get("apple-ios-11-point-prerelease-113-ipod-touch-support"),
  ["version-ios-11-3/beta-2:knownIssue", "version-ios-11-3/beta-3:fixed"],
  "iPod touch transition",
);
assert.deepEqual(
  recurrence.get("apple-ios-11-point-prerelease-113-books-name"),
  ["version-ios-11-3/beta-1:changed", "version-ios-11-3/beta-4:removed"],
  "Books naming transition",
);

const routeKeys = new Set(
  events.map(
    (event) => `${event.target.releaseVersionId}\0${event.target.routeAlias}`,
  ),
);
const stableIds = new Set(events.map((event) => event.identity.stableEventId));
for (const name of readdirSync(here).filter(
  (entry) => entry.endsWith(".json") && entry !== outputName,
)) {
  const other = JSON.parse(readFileSync(join(here, name), "utf8"));
  for (const event of other.events || []) {
    const routeKey =
      event.target?.releaseVersionId && event.target?.routeAlias
        ? `${event.target.releaseVersionId}\0${event.target.routeAlias}`
        : null;
    assert(
      !routeKey || !routeKeys.has(routeKey),
      `${name} already owns ${routeKey?.replace("\0", "/")}`,
    );
    assert(
      !event.identity?.stableEventId ||
        !stableIds.has(event.identity.stableEventId),
      `${name} already owns ${event.identity?.stableEventId}`,
    );
    for (const change of event.changes || []) {
      const local = localDefinitions.get(change.key);
      if (!local) continue;
      assert.deepEqual(
        {
          title: change.title,
          canonicalSummary: change.canonicalSummary,
          category: change.category,
        },
        local,
        `${name} ${change.key} global definition`,
      );
    }
  }
}

const formattedJson = await prettier.format(JSON.stringify(bundle), {
  filepath: outputName,
});
const jsonSha = sha256(formattedJson);
writeFileSync(join(here, outputName), formattedJson);

const citationReferences = [];
const collectCitations = (value) => {
  if (Array.isArray(value)) {
    for (const item of value) collectCitations(item);
    return;
  }
  if (!value || typeof value !== "object") return;
  for (const [key, child] of Object.entries(value)) {
    if (key === "citations") citationReferences.push(...child);
    else collectCitations(child);
  }
};
collectCitations(bundle);
const routeRows = eventSpecs
  .map(
    (spec) =>
      `| iOS ${spec.version} | ${spec.label} | \`${spec.alias}\` | ${spec.date} | ${spec.changes.length} |`,
  )
  .join("\n");
const sourceLedger = sources
  .map(
    (source) =>
      `- [${source.title}](${source.url}) — ${source.publisher}; ${source.sourceClass}.`,
  )
  .join("\n");

const md = `# Apple iOS 11 point-release prerelease archive batch

## Result

\`${outputName}\` is a review-only archive candidate for the externally
defensible iOS 11.1 through 11.4.1 beta routes. It leaves the approved Public
pages and the independently owned iOS 11.0 prerelease batch untouched.

- ${events.length} identity-backed event candidates
- ${occurrenceCount} milestone occurrences across ${localDefinitions.size} stable definitions
- ${sources.length} declared and used sources with ${citationReferences.length} citation references
- zero version overlays, build documents, Public patches, approval timestamps, or indexable events
- every candidate is \`sourceLinked\`, \`readyForReview\`, and \`isIndexable: false\`

## Exact route closure

| Release | Historical milestone | Route alias | Appearance | Records |
| --- | --- | --- | --- | ---: |
${routeRows}

## Evidence method

1. Same-day or near-contemporary reports establish distribution identity,
   audience, and observed per-seed changes.
2. Apple’s archived 11.1 and 11.2 SDK pages and its 11.3 announcement provide
   first-party context without manufacturing beta timing.
3. Public-beta pages describe audience and distribution; feature deltas stay on
   the route where the retained source first supports them.
4. Negative inventories say only that the cited article did not identify a new
   outward feature. They are not claims that a binary contained no changes.
5. Stable definitions preserve the iPod-support, AirPlay 2, Books-name,
   Messages-in-iCloud, and HomePod-note transitions.

## Exact gaps and exclusions

- No route is relabeled as a release candidate or GM. The sixth 11.2 report
  speculated that it might be final, but did not document a separately
  distributed RC/GM.
- Messages in iCloud was absent from the public 11.3 release, but no retained
  page ties its removal to one exact 11.3 beta. The archive therefore records
  its Beta 1 appearance and its 11.4 return, not an invented removal route.
- USB Restricted Mode was observed during 11.4 testing and traced to 11.3
  testing, but the retained material does not identify its first exact seed.
  Only the Beta 6 disappearance of Apple’s note is attached to a route.
- The migrated seed owns two date-qualified iOS 11.2 Beta 2 aliases:
  \`beta-2-2017-11-03\` is the iPhone X distribution and
  \`beta-2-2017-11-06\` is the general distribution.
- Public-only point patches remain owned by \`apple-ios-11.json\`; this batch
  creates no candidates for 11.1.1, 11.1.2, 11.2.1, or other patch releases.
- Build numbers are not converted into release-build documents.

## Copyright and attribution controls

- Every title, summary, occurrence explanation, and article block is original
  synthesis.
- Every factual occurrence has a claim-level citation and a bounded locator.
- No article body, screenshot, transcript, or long quotation is committed.
- The executable evidence audit pins raw and normalized source states and
  enforces a maximum five-word contiguous overlap target.

## Source ledger

All sources were accessed on ${accessedAt}.

${sourceLedger}

## Closure guards

- Exact local seed comparison for iOS 11.1, 11.2, 11.3, 11.4, and 11.4.1
- Approved and indexable Public ownership assertion against \`apple-ios-11.json\`
- Exact reuse of 29 seed-migrated developer stable IDs and route aliases
- Canonical \`event:apple:ios:…\` identities only for 28 genuinely new
  public-beta routes
- Exact 57-route closure and explicit iPhone X limited Beta 2 route
- No version, build, Public-route, approval, indexability, apply, or deploy path
- Batch namespace: \`apple-ios-11-point-prerelease-\`
- Collision scan across every other research-batch JSON
- ${occurrenceCount} occurrences resolve to exactly ${localDefinitions.size} stable definitions
- Complete unique source declaration/use closure
- Deterministic formatted JSON SHA-256: \`${jsonSha}\`

## Production dry plan

- Status: passed twice against \`lh3yswzu/production\` on ${accessedAt}
  without \`--apply\`; no Sanity data changed
- Both runs: 126 creates, 29 revision-guarded patches, and 2,072 unchanged
  documents
- Creates: 47 sources, 28 new public-beta events, and 51 stable changes; two
  already owned Apple sources are reused unchanged
- Patches: 29 seed-migrated developer events; zero source, version, Public,
  build, or approval-state patches
- Mutation payload: 386,774 bytes, or 9.9% of the guarded limit
- Plan SHA: \`669eb292b89f15aeb7325a87f260f46722b0b44b2d16c42053015fb0bf085a25\`
- Plan artifact SHA-256:
  \`e887da4c2d336062e0d86b278524abd80b46466ebf71deed6baa7a92d9723f70\`
- Rollback artifact SHA-256:
  \`a9d3a80509f73a55fcca05cb339b06cdfc6bdc49746ad7a7cc3388bdae0789b8\`
- Rollback coverage: all 126 create IDs and all 29 revision-guarded restore
  documents
- Rollback digest:
  \`1800f72c7084a660f255d7850088f828b219bd2531752c91a377956ced29c31d\`

The first attempted plan correctly stopped on an identity mismatch because the
seed migration already owned the developer routes. The final manifest does not
rewrite those identities: it pins their exact live stable IDs and aliases, and
the two successful plans prove the split between 29 overlays and 28 new routes.

## Reproduction

\`\`\`sh
node scripts/research-batches/audit-ios11-point-prerelease.mjs tmp/ios11-point-evidence
node scripts/research-batches/build-apple-ios-11-point-prerelease.mjs
npm run research:validate
node --import tsx --test tests/launch-content-ingestion.test.ts tests/launch-content-manifest.test.ts
npx eslint scripts/research-batches/build-apple-ios-11-point-prerelease.mjs scripts/research-batches/audit-ios11-point-prerelease.mjs
npx prettier --check scripts/research-batches/build-apple-ios-11-point-prerelease.mjs scripts/research-batches/audit-ios11-point-prerelease.mjs scripts/research-batches/apple-ios-11-point-prerelease.json scripts/research-batches/apple-ios-11-point-prerelease.md
npx sanity exec scripts/ingest-launch-content.ts --with-user-token -- --content scripts/research-batches/apple-ios-11-point-prerelease.json
\`\`\`
`;

const formattedMd = await prettier.format(md, { filepath: ledgerName });
writeFileSync(join(here, ledgerName), formattedMd);

console.log(`Wrote ${outputName}`);
console.log(`Wrote ${ledgerName}`);
console.log(`${events.length} events`);
console.log(`${occurrenceCount} occurrences`);
console.log(`${localDefinitions.size} stable changes`);
console.log(`${sources.length} sources`);
console.log(`${citationReferences.length} citation references`);
console.log(`JSON SHA-256 ${jsonSha}`);
