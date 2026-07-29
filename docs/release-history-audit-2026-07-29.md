# iOS and iPadOS release-history audit

Verified July 29, 2026. This ledger records the independently re-checked
corrections applied to the canonical chronology. Dates are developer-seed
dates unless a Public Beta or Public channel is named explicitly.

## Evidence policy

- Apple Developer Releases is the first-party source for current developer
  seeds: <https://developer.apple.com/news/releases/>
- Apple security releases is the first-party source for public availability:
  <https://support.apple.com/en-us/100100>
- Apple-CDN-backed firmware records provide historical build, date, and device
  scope where Apple no longer exposes a convenient first-party archive:
  <https://theapplewiki.com/wiki/Beta_Firmware/iPhone>
- Contemporaneous reporting is used only to corroborate channel, withdrawal,
  or device-scope distinctions.

Two terminology decisions are documented rather than hidden:

- iOS/iPadOS 15.7 build `19H12` is recorded as RC on September 7, 2022.
  Some contemporaneous reports called it Beta 1, but Apple/CDN records and the
  stronger historical consensus identify it as the release candidate.
- iOS/iPadOS 13.4 build `17E255` is shown as GM on March 18, 2020. Some raw OTA
  manifests label it Beta 6, while Apple distributed it publicly as the GM
  seed.

## Verified correction register

1. iPadOS 27.0 adds Beta 3 v2 on July 13, 2026, build `24A5380l`.
   It was iPadOS-only and the same build was Public Beta 1.
2. iOS/iPadOS 26.5 adds Beta 1 v2 on April 3, 2026, build `23F5043k`.
3. iOS/iPadOS 26.4 adds Beta 3 v2 on March 5, 2026, build `23E5223k`.
4. iOS/iPadOS 26.0 adds Beta 6 v2 on August 14, 2025, build `23A5318f`.
5. iOS 26.0 Beta 1 v2 on June 13, 2025 (`23A5260u`) was iOS-only and
   limited to the iPhone 15 and iPhone 16 product families.
6. iOS/iPadOS 26.0 keeps July 22 Beta 4 (`23A5297i`), July 24 revised
   Beta 4/Public Beta 1 (`23A5297m`), and the July 25 iPhone 11-family
   corrective build (`23A5297n`) as distinct facts.
7. iOS/iPadOS 18.6 developer Beta 3 was July 14, 2025 (`22G5073b`);
   Public Beta 3 followed July 15.
8. iOS/iPadOS 18.1 Betas 1–3 were limited to Apple Intelligence-capable
   hardware. iOS adds the iPhone 16-family Beta 3 build `22B5034o` on
   September 11, 2024.
9. iOS 17.4 adds iOS-only Beta 1 v2 on January 30, 2024 (`21E5184k`);
   iPadOS received Public Beta 1 that day without a developer-seed revision.
10. iOS/iPadOS 17.3 Beta 2 on January 3, 2024 was pulled for both platforms.
11. iOS/iPadOS 17.1 developer Beta 1 was September 27, 2023
    (`21B5045h`); Public Beta 1 was September 28.
12. iOS 17.1 RC 2 on October 20, 2023 (`21B77`) applied only to the
    iPhone 15 family; it is not an iPadOS milestone.
13. iOS/iPadOS 17.0 adds revised Beta 3 on July 11, 2023 (`21A5277j`);
    the same build became Public Beta 1 on July 12.
14. iOS/iPadOS 16.3 developer Beta 2 was January 10, 2023 (`20D5035i`);
    Public Beta 2 was January 11.
15. iPadOS 16.1 stayed one beta number ahead of iOS after its August 23
    Beta 1. Shared builds began with iPadOS Beta 2/iOS Beta 1 on September 14.
16. iOS 16.0 was public September 12, 2022 (`20A362`). iPadOS 16.0 never
    shipped generally; iPadOS 16.1 was the first general iPadOS 16 release on
    October 24.
17. iOS/iPadOS 15.7 adds RC on September 7, 2022 (`19H12`).
18. iOS/iPadOS 15.6 adds RC 2 on July 15, 2022 (`19G71`).
19. iOS 15.2 RC 2 on December 10, 2021 (`19C57`) was limited to the
    iPhone 13 family; it is not an iPadOS milestone.
20. iPadOS 15.1 RC 2 on October 21, 2021 (`19B75`) was limited to the
    iPad mini 6; it is not an iOS milestone.
21. iOS/iPadOS 15.0 developer Beta 1 was June 7, 2021 (`19A5261w`).
22. iOS/iPadOS 14.6 adds Beta 3 (May 10), RC (May 17), RC 2 (May 21),
    and Public (May 24).
23. iOS/iPadOS 14.5 adds Beta 8 on April 13, 2021 (`18E5199a`).
24. iOS/iPadOS 14.5 developer Beta 3 was March 2, 2021 (`18E5164h`);
    Public Beta 3 was March 3.
25. iOS/iPadOS 14.3 adds RC 2 on December 10, 2020 (`18C66`).
26. iOS/iPadOS 14.2 adds developer Beta 4 on October 20, 2020
    (`18B5083a`).
27. iOS/iPadOS 14.1 adds GM on October 13 and Public on October 20,
    both build `18A8395`.
28. iOS/iPadOS 13.7 build `17H33` on August 26, 2020 was Beta 1, not GM.
29. The June 1, 2020 opening seed of the 13.6 cycle was labeled
    iOS/iPadOS 13.5.5 Beta 1 (`17G5035d`); the cycle was renamed at Beta 2.
30. The first two 13.5-cycle seeds were labeled 13.4.5 Beta 1 and Beta 2.
    The May 14 “Beta 5” entry is removed; it belonged to watchOS. GM was
    May 18 (`17F75`).
31. iOS/iPadOS 13.4 Beta 4 was March 3, 2020 (`17E5249a`).
32. iOS/iPadOS 13.4 build `17E255` on March 18 is recorded as GM.
33. iOS/iPadOS 13.3 Beta 2 was November 12, 2019 (`17C5038a`).
34. iOS/iPadOS 13.3 Beta 3 was November 20, 2019 (`17C5046a`).
35. iOS 13.0 GM/Public was iPhone/iPod-only. iPadOS 13.0 was
    beta-tested but superseded before public release; iPadOS 13.1 was the
    first public iPadOS release on September 24, 2019.
36. iOS 12.4 Beta 4 was June 11, 2019 (`16G5046d`).
37. iOS 12.4 Beta 7 was July 16, 2019 (`16G5077a`).
38. The nonexistent iOS 12.1.1 Beta 4 on November 29, 2018 is removed;
    that seed belonged to tvOS.
39. iOS 11.3 Beta 6 was March 16, 2018 (`15E5216a`).
40. iOS 11.0 Beta 6 was August 14, 2017 (`15A5354b`); August 15 was
    Public Beta 5.
41. iOS 11.0 adds the revised developer Beta 2 on June 26, 2017
    (`15A5304j`) and records Public Beta 1 as a separate same-day channel event.
42. The September 7, 2016 iOS 10 GM and September 13 Public release were
    actually version 10.0.1, build `14A403`.

One additional channel correction is included: iOS/iPadOS 15 Beta 2 was
revised to `19A5281j` on June 30, 2021, and Public Beta 1 launched separately
that day with the same build.

## Corroborating historical sources

- 26.x firmware: <https://theapplewiki.com/wiki/Beta_Firmware/iPhone/26.x>
- 18.x firmware: <https://theapplewiki.com/wiki/Beta_Firmware/iPhone/18.x>
- 17.x firmware: <https://theapplewiki.com/wiki/Beta_Firmware/iPhone/17.x>
- 16.x firmware: <https://theapplewiki.com/wiki/Beta_Firmware/iPhone/16.x>
- 15.x firmware: <https://theapplewiki.com/wiki/Beta_Firmware/iPhone/15.x>
- 14.x firmware: <https://theapplewiki.com/wiki/Beta_Firmware/iPhone/14.x>
- 14.1 firmware keys: <https://theapplewiki.com/wiki/Firmware_Keys/14.x>
- 13.x firmware: <https://theapplewiki.com/wiki/Beta_Firmware/iPhone/13.x>
- 12.x firmware: <https://theapplewiki.com/wiki/Beta_Firmware/iPhone/12.x>
- 11.x firmware: <https://theapplewiki.com/wiki/Beta_Firmware/iPhone/11.x>
- iOS 18.1 iPhone 16 scope:
  <https://www.macrumors.com/2024/09/11/ios-18-1-beta-3-iphone-16/>
- iOS 17.1 RC 2 scope:
  <https://www.macrumors.com/2023/10/20/apple-releases-ios-17-1-rc-2/>
- iPadOS 15.1 RC 2 scope:
  <https://www.macrumors.com/2021/10/21/apple-releases-ipados-15-1-rc-2/>
- iOS 15.2 RC 2 scope:
  <https://www.macrumors.com/2021/12/10/apple-releases-ios-15-2-rc-2/>
- iOS 14.5 developer/Public Beta 3 separation:
  <https://www.macrumors.com/2021/03/03/apple-seeds-ios-14-5-public-beta-3/>
- iOS 11 revised Beta 2:
  <https://www.macrumors.com/2017/06/26/apple-revised-ios-11-developer-beta-2/>
- iOS 11 Public Beta 1:
  <https://www.macrumors.com/2017/06/26/ios-11-first-public-beta/>
- iOS 14.6 public release:
  <https://support.apple.com/en-us/103130>

At the time of verification, Apple’s archive still showed iOS/iPadOS 27
Beta 4 (`24A5390f`, July 20, 2026) as the latest 27.0 developer seed and
iOS/iPadOS 26.6 (`23G71`, July 27, 2026) as public.
