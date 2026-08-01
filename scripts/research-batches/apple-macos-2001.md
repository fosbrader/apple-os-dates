# Apple 2001 Mac OS X public-release research batch

## Result

`apple-macos-2001.json` enriches every existing local Mac OS X Public release in calendar year 2001: versions 10.0 and 10.1. Both articles are copyright-safe original synthesis grounded primarily in retained Apple material.

- 2 of 2 eligible local versions have source-linked overview articles.
- 2 of 2 same-date Public routes have release-specific summaries and articles.
- 50 structured change occurrences are attached to those Public routes: 11 features, 10 enhancements, 8 developer-platform changes, 8 compatibility or distribution changes, 12 security changes, and 1 behavior change.
- 10 sources are declared and used: 8 retained Apple Newsroom announcements, 1 Apple Support security chronology, and 1 contemporaneous TidBITS report.
- The citation audit counts 162 claim-level or page-level references.
- Both selectors contain only `releaseVersionId` plus `routeAlias: "public"`.
- All four overlays are `editoriallyVerified` and `approved` as of
  `2026-07-30T06:26:13Z`; both events are indexable.
- No prerelease route, point version, server record, build, or missing identity
  is created.

## Exact local closure

| Existing record      | Local version note | Seed milestones | Seed Public date | Structured changes | Event article blocks |
| -------------------- | ------------------ | --------------: | ---------------- | -----------------: | -------------------: |
| `version-macos-10-0` | Cheetah            |               1 | 2001-03-24       |                 21 |                   14 |
| `version-macos-10-1` | Puma               |               1 | 2001-09-25       |                 29 |                   16 |
| **Total**            |                    |           **2** |                  |             **50** |               **30** |

These are the only local `macOS` records whose `publicReleaseDate` falls in 2001. Each has exactly one non-revision Public milestone matching its local date. No existing research batch owned either deterministic version ID or any `macos-10-0-*` / `macos-10-1-*` change key when this generator was created.

## Timeline, naming, and evidence audit

Fifteen points require explicit editorial awareness:

1. The local platform family is the modern `macOS` label. Apple's 2001 sources call the product Mac OS X, which is retained throughout reader-facing prose.
2. The local version notes are “Cheetah” and “Puma.” The retained Apple public-release material does not use those nicknames, so the articles do not present them as 2001 launch branding.
3. Version 10.0's March 24 date has direct first-party support from both Apple's January announcement and final March launch notice.
4. Version 10.1 has a genuine availability split. Apple announced the finished client release on September 25 and scheduled broad retail and free store pickup for September 29. TidBITS documents free upgrade CDs at Apple's Seybold booth during the conference. The audited September 25 route is preserved, but it is not described as the start of universal retail availability.
5. The Mac OS X Public Beta shipped in September 2000 and informed 10.0, but it is absent from the seed and no prerelease record is created.
6. Apple's July 10.1 preview is used only where the September release announcement confirms the same shipped feature. No preview event or preview-only claim is added.
7. Apple's May 1 announcement identifies music-CD burning and stability work as 10.0.2. Those changes do not belong to initial 10.0 and are explicitly excluded.
8. Apple's retained security chronology has no initial 10.0 correction block. It first names OpenSSH under 10.0.1 and FTP/NTP fixes under 10.0.2. The 10.0 Kerberos occurrence is a launch security capability, not a vulnerability repair.
9. The same Apple chronology has an exact initial `Mac OS X 10.1` heading. Initial security changes are synthesized only from that block; the October 19 update, Internet Explorer 5.1.1, and later 10.1.x headings remain outside the event.
10. Closely related security items are grouped at coherent boundaries: fetchmail input flaws, Java applet isolation, network-stack hardening, daemon denial of service, and local utility safety. Individual conditions and severity remain visible.
11. The retained tcsh security entry uses inconsistent redirection-operator notation between its label and explanation. The synthesis records the file-overwrite boundary without choosing one operator.
12. Mac OS X Server 10.1 was separately announced on September 25. Its server-only storage, NetBoot, directory, database, web, and streaming changes are excluded.
13. Publicly circulated build numbers are not first-party release identities in this cohort and no build record is created.
14. Historical US pricing, package contents, and hardware requirements are time-bounded launch facts, not current purchase or compatibility advice.
15. Apple-supplied application counts, developer counts, benchmark multipliers, and partner statements are labeled vendor-reported and are not converted into independent adoption, quality, or compatibility conclusions.

## Release-change inventory

| Version | Reader-facing scope                                                                                                                                                                                                                                                                                                                                                     |
| ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 10.0    | Darwin and BSD UNIX; protected memory and preemptive multitasking; symmetric multiprocessing; Quartz/PDF; OpenGL; QuickTime 5; Aqua and Dock; Classic, Carbon, Cocoa, and Java 2; bundled internet apps; iTools/iDisk; dynamic memory; portable power; automatic networking/PPPoE; fonts; printers; multi-user controls; Kerberos security; retail package and hardware |
| 10.1    | Systemwide performance; movable Dock; status controls; file-extension handling; optical-disc burning and DVD playback; Image Capture; bundled iTunes/iMovie; SMB and multiprotocol networking; WebDAV iDisk; printing; OpenGL/GeForce3; ColorSync; audio; AppleScript/SOAP/XML; CD upgrade paths; hardware; 11 grouped first-party security corrections                 |

## Verified source set

All nine URLs resolved to the named page during research on 2026-07-30.

### Mac OS X 10.0

- [Apple’s Mac OS X to Ship on March 24](https://www.apple.com/newsroom/2001/01/09Apples-Mac-OS-X-to-Ship-on-March-24/)
- [Mac OS X Hits Stores This Weekend](https://www.apple.com/newsroom/2001/03/21Mac-OS-X-Hits-Stores-This-Weekend/)
- [More than 10,000 Developers Working on Mac OS X Solutions](https://www.apple.com/newsroom/2001/03/21More-than-10-000-Developers-Working-on-Mac-OS-X-Solutions/)
- [Apple Releases Mac OS X Update with CD Burning](https://www.apple.com/newsroom/2001/05/01Apple-Releases-Mac-OS-X-Update-with-CD-Burning/) — used only to enforce the 10.0.2 boundary

### Mac OS X 10.1

- [Apple Previews Next Version of Mac OS X](https://www.apple.com/newsroom/2001/07/18Apple-Previews-Next-Version-of-Mac-OS-X/)
- [First Major Upgrade to Mac OS X Hits Stores This Weekend](https://www.apple.com/newsroom/2001/09/25First-Major-Upgrade-to-Mac-OS-X-Hits-Stores-This-Weekend/)
- [More than 1,400 Third-Party Applications Now Available for Mac OS X v10.1](https://www.apple.com/newsroom/2001/09/25More-than-1-400-Third-Party-Applications-Now-Available-for-Mac-OS-X-v10-1/)
- [Major Mac OS X Server v10.1 Update Now Available](https://www.apple.com/newsroom/2001/09/25Major-Mac-OS-X-Server-v10-1-Update-Now-Available/) — used only to enforce the client/server boundary
- [Apple security updates (August, 2003 and earlier)](https://support.apple.com/en-us/104191)
- [Free Mac OS X 10.1 Upgrade Available 29-Sep-01](https://tidbits.com/2001/09/26/free-mac-os-x-10-1-upgrade-available-29-sep-01/)

TidBITS is classified as journalism and is used only to clarify physical CD distribution and Seybold access. It is not substituted for Apple's feature or security documentation.

## Editorial and copyright method

All page summaries, article paragraphs, canonical summaries, and occurrence descriptions are newly written. Citations carry exact feature, section, component, date, or chronology locators rather than copying source paragraphs.

Historical product, framework, protocol, and application names are used nominatively. Press-release superlatives, trademark symbols, partner endorsements, lengthy quotations, and boilerplate are excluded. Vendor benchmarks and ecosystem totals are paraphrased and attributed.

Related upstream security fixes are combined only where they share an intelligible component or threat boundary. The source's conditions remain visible: local-user access for crontab and open(), untrusted applets for Java isolation, remote packets for tcpdump and firewall handling, service-account execution for telnetd, and denial of service for rwhod or timed.

## Evidence limits

- Apple's retained 10.0 launch pages are detailed feature announcements, not a conventional itemized release-note document.
- No initial 10.0 component-level security correction is asserted.
- Version 10.1's September 25 seed date is not represented as the broad retail date; that date was September 29 in Apple's own announcement.
- Security descriptions rely on Apple's retained chronology because several linked 2001 upstream advisories are no longer reliably available. The manifest cites Apple's surviving summaries rather than inventing missing advisory detail.
- OpenSSL 0.9.6b remains `partiallyDocumented` because Apple's page says it contains multiple fixes without enumerating them.
- No undocumented or community-only behavior is added merely to increase coverage.
- Public Beta, 10.0.x, 10.1.x, server-only content, and builds are intentionally absent.

## Validation

- JSON parsing and launch-content schema validation passed. The repository validator accepted all 40 concurrent research batches and 2,092 globally consistent change keys.
- Seed comparison: 2 exact 2001 versions, 2 version overlays, and 2 Public-event overlays, with no missing or extra identities.
- Target check: both event selectors contain only `releaseVersionId` and `routeAlias: "public"`.
- Citation closure: every citation URL has one source declaration and every declared source is used.
- Change identity: all 50 local keys are unique and did not collide with the existing batch corpus during generation.
- Review state: all four overlays are `editoriallyVerified` and `approved`
  as of `2026-07-30T06:26:13Z`; both events have `isIndexable: true`.
- Deterministic bundle SHA-256: `c8b925dc40d6c1e10d3cf7c9e8a368ea1410e6a40cdb8922e7255b7d5c7905d4`.
- A second generator run reproduced the JSON byte for byte at the same SHA-256.
- Focused launch-content ingestion and manifest tests passed 19 of 19.
- ESLint passed for the generator, and Prettier passed for the generator, JSON, and ledger.
- The approved production dry run reported 59 creates, 4
  revision-guarded patches, and 2,081 unchanged documents. Creates were
  exactly 9 sources and 50 release changes; no version, event, or build
  document was created.
- The four guarded patches target the two existing Public events and two
  existing version records. Event patches set only article body, changes,
  citations, editorial review, indexing state, provenance status, and
  summary. Version patches set only citations, editorial review, overview,
  provenance status, and release-notes URL. No field is unset and no document
  is deleted.
- Approved production plan SHA-256:
  `58e0b8284369500b3cf300ae9f0d486891f91c8b97293a791512e85c4e9542b6`;
  mutation payload: 156,427 bytes (4.0% of the guarded limit).
- Serialized plan artifact SHA-256:
  `03d181b378ec03ef02f5764c7ec35a8fd127b623d8bfbcffefd1720cc41ab278`;
  rollback artifact SHA-256:
  `e5a2bf8b1996ad55ccd8f6ee59c19753f4aef788ab598c25a8d1465c8f98030a`.
- Production apply committed and zero-residual verified in transaction
  `tt1fSB5HY9GAB0YLyyAr3z`.
- The post-apply dry run reported 0 creates, 0 patches, and 2,144 unchanged
  documents. Its plan SHA is
  `19555536e3f76a93fe879e847077590107ceb03bb80c72a56e9359bf6c2abeed`.
- The representative local routes `/apple/macos/10.0` and
  `/apple/macos/10.1` returned HTTP 200 with full articles, references, and
  indexable metadata. Their `/public` aliases returned the expected canonical
  redirects.
- Root and independent editorial review approved the copyright-safe synthesis,
  evidence boundaries, chronology disclosures, provenance, and indexing state
  at `2026-07-30T06:26:13Z`.

## Human approval checklist

- [x] Accept period-public Mac OS X naming while retaining the local nickname fields only as catalog metadata.
- [x] Accept the September 25 announcement/limited-access versus September 29 broad-retail distinction for 10.1.
- [x] Accept the explicit exclusion of Public Beta, point releases, server content, and builds.
- [x] Accept 10.0's security capability without inferring initial vulnerability repairs.
- [x] Accept the 10.1 security grouping and the package-level OpenSSL evidence limit.
- [x] Make both events indexable after source and editorial review.

## Reproduction

```bash
node scripts/research-batches/build-apple-macos-2001.mjs
npm run research:validate
node --import tsx --test tests/launch-content-ingestion.test.ts tests/launch-content-manifest.test.ts
npx eslint scripts/research-batches/build-apple-macos-2001.mjs
npx prettier --check scripts/research-batches/build-apple-macos-2001.mjs scripts/research-batches/apple-macos-2001.json scripts/research-batches/apple-macos-2001.md
npx sanity exec scripts/ingest-launch-content.ts --with-user-token -- --content scripts/research-batches/apple-macos-2001.json
```

The final command is a dry run only. The exact reviewed production apply is
recorded in the validation receipt after it is committed; the generator never
performs that apply itself.
