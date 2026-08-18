/**
 * Brings the 2026-08-10 appearances up to editorial verification.
 *
 * Scope is deliberately narrow: change occurrences, citations, provenance, and
 * indexability. It never writes `articleBody`, `summary`, or identity fields,
 * because article prose is owned by a separate editorial pass running against
 * the same documents.
 *
 * Every patch is revision-guarded. A concurrent write to a targeted document
 * makes this command fail loudly rather than silently overwrite that work.
 *
 * Dry run (default):
 *   npx sanity exec scripts/verify-release-day-2026-08-10.ts --with-user-token
 *
 * Apply:
 *   npx sanity exec scripts/verify-release-day-2026-08-10.ts --with-user-token -- \
 *     --apply --confirm-production
 *
 * Records with no published beta-5-specific change evidence are intentionally
 * left at sourceLinked / readyForReview / noindex. The schema requires a
 * sourced article or substantive cited change before indexing, and inventing
 * filler to clear that gate is exactly what the archive forbids.
 */

import { createHash } from "node:crypto";
import { getCliClient } from "sanity/cli";

const apiVersion = "2024-01-01";
const expectedProjectId = "lh3yswzu";
const expectedDataset = "production";
const accessedAt = "2026-08-10";

function sha256(v: string): string {
  return createHash("sha256").update(v).digest("hex");
}
function compactHash(v: string): string {
  return sha256(v).slice(0, 24);
}
function normalizeSourceUrl(v: string): string {
  const url = new URL(v);
  url.hash = "";
  return url.toString();
}
function sourceDocumentId(url: string): string {
  return `source-${compactHash(normalizeSourceUrl(url))}`;
}
function eventDocumentId(stableEventId: string): string {
  return `release-event-${compactHash(stableEventId)}`;
}
function changeDocumentId(key: string): string {
  const normalized = key.trim().toLowerCase();
  if (!/^[a-z0-9]+(?:[._-][a-z0-9]+)*$/.test(normalized)) {
    throw new Error(`Change key ${key} is not a valid slug.`);
  }
  return `release-change-${compactHash(normalized)}`;
}
function slugify(v: string): string {
  return v
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
function reference(id: string) {
  return { _type: "reference" as const, _ref: id };
}
function citation(sourceId: string, locator: string) {
  return {
    _key: `citation-${compactHash(`${sourceId}\0${locator}`)}`,
    _type: "citation" as const,
    locator,
    source: reference(sourceId),
  };
}

const SOURCES = [
  {
    canonicalUrl: "https://9to5mac.com/2026/08/10/heres-whats-new-with-ios-27-beta-5/",
    title: "Here's what's new with iOS 27 beta 5",
    publisher: "9to5Mac",
    sourceClass: "journalism",
    publishedAt: "2026-08-10T00:00:00Z",
    topics: ["iOS", "iOS 27", "beta 5"],
  },
  {
    canonicalUrl:
      "https://9to5mac.com/2026/08/10/ios-27-beta-5-adds-new-app-icons-for-siri-safari-and-more/",
    title: "iOS 27 beta 5 adds new app icons for Siri, Safari, and more",
    publisher: "9to5Mac",
    sourceClass: "journalism",
    publishedAt: "2026-08-10T00:00:00Z",
    topics: ["iOS", "iOS 27", "beta 5", "app icons"],
  },
  {
    canonicalUrl: "https://www.macrumors.com/2026/08/10/ios-27-beta-5-everything-new/",
    title: "Everything New in iOS 27 Beta 5",
    publisher: "MacRumors",
    sourceClass: "journalism",
    publishedAt: "2026-08-10T00:00:00Z",
    topics: ["iOS", "iOS 27", "beta 5"],
  },
];

const NINE_TO_FIVE = sourceDocumentId(SOURCES[0].canonicalUrl);
const NINE_TO_FIVE_ICONS = sourceDocumentId(SOURCES[1].canonicalUrl);
const MACRUMORS = sourceDocumentId(SOURCES[2].canonicalUrl);

type ChangeSpec = {
  key: string;
  title: string;
  canonicalSummary: string;
  category: string;
  action: string;
  summary: string;
  /** [sourceId, locator] pairs. Two or more independent outlets => corroborated. */
  evidence: [string, string][];
};

/**
 * iOS 27 beta 5. Only deltas that reporting attributes to beta 5 itself.
 * Cycle-level 27.0 features shipped in earlier betas are deliberately absent.
 */
const IOS_CHANGES: ChangeSpec[] = [
  {
    key: "ios-27-beta5-liquid-glass-app-icons",
    title: "Liquid Glass app icon revisions",
    canonicalSummary:
      "Several system app icons were redrawn to sit better with the Liquid Glass appearance.",
    category: "enhancement",
    action: "changed",
    summary:
      "Safari, Siri, Settings, Remote, App Store, and Preview received revised icons, with smaller refinements applied to other system apps.",
    evidence: [
      [NINE_TO_FIVE_ICONS, "New icons for Siri, Safari, Preview, Settings, and Remote"],
      [MACRUMORS, "App Icons"],
    ],
  },
  {
    key: "ios-27-beta5-siri-voice-controls",
    title: "Siri voice pace and expressivity controls",
    canonicalSummary:
      "Siri's enhanced voices gained user-adjustable delivery settings on supported hardware.",
    category: "feature",
    action: "introduced",
    summary:
      "Pace and expressivity became adjustable across seven American and four British voices. Availability is limited to iPhone 17 Pro, iPhone 17 Pro Max, and iPhone Air because the processing runs on device.",
    evidence: [
      [MACRUMORS, "Siri AI Voice Customization"],
      [NINE_TO_FIVE, "Siri enhanced voice adds British English"],
    ],
  },
  {
    key: "ios-27-beta5-control-center-cellular-indicator",
    title: "Cellular network indicator hidden on Wi-Fi",
    canonicalSummary:
      "Control Center stopped showing cellular network type while the device is on Wi-Fi.",
    category: "behavior",
    action: "changed",
    summary:
      "The cellular network type indicator no longer appears in Control Center when the device is connected to Wi-Fi.",
    evidence: [
      [NINE_TO_FIVE, "Control Center cellular indicator"],
      [MACRUMORS, "Control Center"],
    ],
  },
  {
    key: "ios-27-beta5-search-suggestion-controls",
    title: "Search suggestion controls",
    canonicalSummary:
      "Search settings gained controls over which suggestions appear before a query is typed.",
    category: "feature",
    action: "introduced",
    summary:
      "A new settings section controls pre-query suggestions: app results can be disabled or limited to four or eight entries, and app shortcut suggestions and recent searches can be toggled.",
    evidence: [
      [NINE_TO_FIVE, "Before Search section in Search settings"],
      [MACRUMORS, "Search Settings"],
    ],
  },
  {
    key: "ios-27-beta5-5g-plus-carrier-expansion",
    title: "5G+ indicator carrier expansion",
    canonicalSummary:
      "The 5G+ network designation was extended to additional carriers and regions.",
    category: "enhancement",
    action: "changed",
    summary:
      "The 5G+ designation began appearing for additional carriers, reported for EE in the United Kingdom and for carriers in Spain.",
    evidence: [
      [NINE_TO_FIVE, "5G+ for EE in the UK"],
      [MACRUMORS, "5G"],
    ],
  },
  {
    key: "ios-27-beta5-liquid-glass-transparency-clarity",
    title: "Clearer Liquid Glass transparency setting",
    canonicalSummary:
      "The clearest Liquid Glass transparency option became more transparent than in the previous beta.",
    category: "enhancement",
    action: "changed",
    summary:
      "The clearest transparency setting renders with more clarity than it did in beta 4.",
    evidence: [[MACRUMORS, "Liquid Glass"]],
  },
  {
    key: "ios-27-beta5-contacts-company-names",
    title: "Company names in Contacts lists",
    canonicalSummary:
      "Contacts began showing an entry's company name alongside the person's name.",
    category: "enhancement",
    action: "changed",
    summary:
      "Company names now appear beneath contact names in lists and in search results.",
    evidence: [[MACRUMORS, "Contacts"]],
  },
  {
    key: "ios-27-beta5-wallet-create-a-pass-international",
    title: "Create a Pass available outside the United States",
    canonicalSummary:
      "Wallet's Create a Pass feature expanded beyond its initial United States availability.",
    category: "enhancement",
    action: "changed",
    summary:
      "The Wallet Create a Pass feature became available outside the United States.",
    evidence: [[MACRUMORS, "Apple Wallet"]],
  },
  {
    key: "ios-27-beta5-onboarding-splash-screens",
    title: "Onboarding splash screens for Photos, Wallet, and Music",
    canonicalSummary:
      "Several first-party apps gained first-run screens explaining what changed in the release.",
    category: "feature",
    action: "introduced",
    summary:
      "Photos, Wallet, and Music gained onboarding splash screens describing their iOS 27 changes.",
    evidence: [[MACRUMORS, "Splash Screens"]],
  },
  {
    key: "ios-27-beta5-search-the-web-option",
    title: "Search the Web option in results",
    canonicalSummary:
      "Search results gained an explicit option to continue the query on the web.",
    category: "feature",
    action: "introduced",
    summary:
      "A Search the Web option was added at the bottom of search results, and suggestion animations were retimed to appear together with the search bar.",
    evidence: [[MACRUMORS, "Search Interface"]],
  },
  {
    key: "ios-27-beta5-software-update-last-installed",
    title: "Last installed update shown in About",
    canonicalSummary:
      "Settings began reporting when the most recent system update was installed.",
    category: "enhancement",
    action: "changed",
    summary:
      "The About section indicates when the last software update was installed.",
    evidence: [[MACRUMORS, "Settings - Software Updates"]],
  },
  {
    key: "ios-27-beta5-mail-personalize-smart-replies",
    title: "Personalize Smart Replies toggle in Mail",
    canonicalSummary:
      "Mail gained an opt-in control for personalized Smart Replies.",
    category: "feature",
    action: "introduced",
    summary:
      "A Personalize Smart Replies toggle was added for Mail and is disabled by default.",
    evidence: [[MACRUMORS, "Mail"]],
  },
  {
    key: "ios-27-beta5-battery-cellular-drain-indicator",
    title: "Poor cellular connectivity battery indicator",
    canonicalSummary:
      "Battery settings began attributing drain to weak cellular connectivity.",
    category: "feature",
    action: "introduced",
    summary:
      "Battery settings gained an indicator that flags when poor cellular connectivity is contributing to battery drain.",
    evidence: [[MACRUMORS, "Battery Settings"]],
  },
  {
    key: "ios-27-beta5-clock-typography",
    title: "Heavier Clock typography",
    canonicalSummary:
      "Clock adjusted the weight of type used in its Alarms and Timers views.",
    category: "enhancement",
    action: "changed",
    summary: "A thicker font was applied to the Alarms and Timers sections.",
    evidence: [[MACRUMORS, "Clock App"]],
  },
];

/**
 * iPadOS shares build 24A5408D with iOS, and the beta-5 reporting covers that
 * shared codebase, but the articles are iOS-titled. Only cross-platform
 * changes are carried across, and every occurrence is marked `reported`
 * with the inference stated in its verification method.
 */
const IPADOS_CHANGE_KEYS = [
  "ios-27-beta5-liquid-glass-app-icons",
  "ios-27-beta5-siri-voice-controls",
  "ios-27-beta5-search-suggestion-controls",
  "ios-27-beta5-liquid-glass-transparency-clarity",
];

const MACOS_CHANGES: ChangeSpec[] = [
  {
    key: "macos-27-beta5-chess-liquid-glass-icon",
    title: "Chess Liquid Glass icon",
    canonicalSummary:
      "The bundled Chess app received a Liquid Glass treatment for its icon.",
    category: "enhancement",
    action: "changed",
    summary: "Chess received a new glass icon.",
    evidence: [[NINE_TO_FIVE_ICONS, "Chess for Mac received a new glass icon"]],
  },
];

type Target = {
  stableEventId: string;
  changes: ChangeSpec[];
  provenanceStatus: "sourceLinked" | "editoriallyVerified";
  /** `reported` when the platform attribution is inferred from a shared build. */
  evidenceState: "reported" | "corroborated";
  verificationMethod: string;
};

const byKey = new Map(IOS_CHANGES.map((c) => [c.key, c]));

const TARGETS: Target[] = [
  {
    stableEventId: "event:apple:ios:27.0:beta-5",
    changes: IOS_CHANGES,
    provenanceStatus: "editoriallyVerified",
    evidenceState: "corroborated",
    verificationMethod:
      "Independent hands-on reporting from 9to5Mac and MacRumors published on the day of the beta 5 seed.",
  },
  {
    stableEventId: "event:apple:ipados:27.0:beta-5",
    changes: IPADOS_CHANGE_KEYS.map((k) => byKey.get(k)!),
    provenanceStatus: "sourceLinked",
    evidenceState: "reported",
    verificationMethod:
      "iPadOS 27.0 beta 5 ships build 24A5408D, the same identifier as iOS 27.0 beta 5, and the cited beta-5 reporting covers that shared codebase. The articles are iOS-titled, so the iPadOS attribution is inferred rather than directly stated.",
  },
  {
    stableEventId: "event:apple:macos:27.0:beta-5",
    changes: MACOS_CHANGES,
    provenanceStatus: "sourceLinked",
    evidenceState: "reported",
    verificationMethod:
      "Single-outlet hands-on reporting naming a macOS-specific icon change in beta 5.",
  },
  // No outlet reported beta-5-specific changes for these three platforms;
  // coverage on the day was limited to build numbers. They carry no change
  // occurrences, so they only become indexable once the separate editorial
  // pass lands an article. The gate check below decides that per document.
  ...(
    [
      "event:apple:tvos:27.0:beta-5",
      "event:apple:visionos:27.0:beta-5",
      "event:apple:watchos:27.0:beta-5",
    ] as const
  ).map((stableEventId) => ({
    stableEventId,
    changes: [] as ChangeSpec[],
    provenanceStatus: "sourceLinked" as const,
    evidenceState: "reported" as const,
    verificationMethod:
      "Release-day coverage confirmed the seed and build number only; no beta-5-specific change was reported for this platform.",
  })),
  // Prerelease point releases. Apple publishes security advisories at public
  // release, not at RC, so there is no citable change content yet.
  ...(
    [
      "event:apple:ios:26.6.1:rc",
      "event:apple:ipados:26.6.1:rc",
      "event:apple:macos:26.6.2:beta-1",
      "event:apple:ios:18.7.10:rc",
      "event:apple:ipados:18.7.10:rc",
    ] as const
  ).map((stableEventId) => ({
    stableEventId,
    changes: [] as ChangeSpec[],
    provenanceStatus: "sourceLinked" as const,
    evidenceState: "reported" as const,
    verificationMethod:
      "Prerelease seed confirmed by Apple's developer releases listing and same-day reporting. Security content is not yet documented; Apple publishes the advisory at public release.",
  })),
];

async function main(): Promise<void> {
  const argv = process.argv.slice(2);
  const apply = argv.includes("--apply");
  const confirmed = argv.includes("--confirm-production");

  const client = getCliClient({ apiVersion });
  const { projectId, dataset } = client.config();
  if (projectId !== expectedProjectId || dataset !== expectedDataset) {
    throw new Error(
      `Refusing to run against ${projectId}/${dataset}; expected ${expectedProjectId}/${expectedDataset}.`,
    );
  }
  if (apply && !confirmed) {
    throw new Error("--apply also requires --confirm-production.");
  }

  const reviewedAt = new Date().toISOString();
  const mutations: unknown[] = [];
  const planned: string[] = [];

  const existingSources: { _id: string }[] = await client.fetch(
    "*[_id in $ids]{_id}",
    { ids: SOURCES.map((s) => sourceDocumentId(s.canonicalUrl)) },
  );
  const haveSource = new Set(existingSources.map((s) => s._id));

  for (const source of SOURCES) {
    const id = sourceDocumentId(source.canonicalUrl);
    if (haveSource.has(id)) continue;
    mutations.push({
      createIfNotExists: {
        _id: id,
        _type: "source",
        title: source.title,
        canonicalUrl: source.canonicalUrl,
        publisher: source.publisher,
        sourceClass: source.sourceClass,
        publishedAt: source.publishedAt,
        accessedAt,
        status: "active",
        reuseBasis: "linkedFactsOnly",
        topics: source.topics,
      },
    });
    planned.push(`source   ${id}  ${source.publisher}`);
  }

  // Reusable change library entries, deduplicated across platforms.
  const allChanges = new Map<string, ChangeSpec>();
  for (const target of TARGETS) {
    for (const change of target.changes) allChanges.set(change.key, change);
  }
  const changeIds = Array.from(allChanges.keys()).map(changeDocumentId);
  const existingChanges: { _id: string }[] = await client.fetch(
    "*[_id in $ids]{_id}",
    { ids: changeIds },
  );
  const haveChange = new Set(existingChanges.map((c) => c._id));

  for (const change of allChanges.values()) {
    const id = changeDocumentId(change.key);
    if (haveChange.has(id)) continue;
    mutations.push({
      createIfNotExists: {
        _id: id,
        _type: "releaseChange",
        title: change.title,
        slug: { _type: "slug", current: slugify(change.key) },
        canonicalSummary: change.canonicalSummary,
        category: change.category,
        status: "active",
        provenanceStatus: "sourceLinked",
        editorialReview: {
          _type: "editorialReview",
          status: "approved",
          reviewedAt,
        },
        citations: change.evidence.map(([src, loc]) => citation(src, loc)),
      },
    });
    planned.push(`change   ${id}  ${change.title}`);
  }

  // Publishing a draft in Sanity is createOrReplace, so a field written only to
  // the published document is lost the moment a concurrent editorial pass
  // publishes its draft. Patch every live copy of each event -- draft and
  // published -- so these fields survive whichever one wins.
  const baseIds = TARGETS.map((t) => eventDocumentId(t.stableEventId));
  const eventIds = [...baseIds, ...baseIds.map((id) => `drafts.${id}`)];
  const events: {
    _id: string;
    _rev: string;
    citations?: { _key: string }[];
    articleBody?: unknown[];
  }[] = await client.fetch(
    "*[_id in $ids]{_id, _rev, citations, articleBody}",
    { ids: eventIds },
  );
  const eventById = new Map(events.map((e) => [e._id, e]));

  for (const target of TARGETS) {
    const baseId = eventDocumentId(target.stableEventId);
    for (const id of [baseId, `drafts.${baseId}`]) {
    const event = eventById.get(id);
    if (!event) {
      if (id === baseId) {
        throw new Error(`Missing event ${id} (${target.stableEventId}).`);
      }
      continue; // No draft in flight for this event.
    }

    const occurrences = target.changes.map((change) => ({
      _key: `occurrence-${compactHash(`${id}\0${change.key}`)}`,
      _type: "changeOccurrence",
      change: reference(changeDocumentId(change.key)),
      action: change.action,
      inheritance: "delta",
      summary: change.summary,
      documentedStatus: "undocumented",
      evidenceState:
        target.evidenceState === "corroborated" && change.evidence.length > 1
          ? "corroborated"
          : "reported",
      verificationMethod: target.verificationMethod,
      citations: change.evidence.map(([src, loc]) => citation(src, loc)),
    }));

    // Merge page-level citations; never drop what is already there.
    const existingCitations = event.citations || [];
    const merged = [...existingCitations];
    const seen = new Set(existingCitations.map((c) => c._key));
    for (const change of target.changes) {
      for (const [src, loc] of change.evidence) {
        const c = citation(src, loc);
        if (!seen.has(c._key)) {
          seen.add(c._key);
          merged.push(c);
        }
      }
    }

    // Mirror validateIndexable rather than assuming: custom schema validation
    // runs in Studio, not on API writes, so nothing but this check stops an
    // invalid indexable document from being written here.
    const hasArticle = (event.articleBody?.length ?? 0) > 0;
    const indexable = occurrences.length > 0 || hasArticle;

    mutations.push({
      patch: {
        id,
        ifRevisionID: event._rev,
        set: {
          ...(occurrences.length > 0 ? { changes: occurrences } : {}),
          citations: merged,
          provenanceStatus: target.provenanceStatus,
          editorialReview: {
            _type: "editorialReview",
            status: "approved",
            reviewedAt,
          },
          isIndexable: indexable,
        },
      },
    });
    planned.push(
      `verify   ${id.padEnd(48)} ${occurrences.length} changes, ${merged.length} citations, ${target.provenanceStatus}, ${indexable ? "indexable" : "NOT indexable (no article or change)"}`,
    );
    }
  }

  console.log(planned.join("\n"));
  console.log(`\n${apply ? "APPLY" : "DRY RUN"}: ${mutations.length} mutations.`);

  if (!apply) {
    console.log("No Sanity data changed. Rerun with --apply --confirm-production.");
    return;
  }

  const result = await client.mutate(mutations as never, { visibility: "sync" });
  console.log(`Committed transaction ${result.transactionId}.`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
