import {createHash} from 'node:crypto'
import {readFile, writeFile} from 'node:fs/promises'
import path from 'node:path'

const batchId = 'beta-chronology-gap-watchos-major-7-26'
const packetDir =
  'research-handoffs/beta-chronology-gap/watchos-major-7-26'
const evidenceDir =
  'tmp/research-evidence/beta-chronology-gap/watchos-major-7-26'
const researchCutoff = '2026-07-30'
const createdAt = new Date().toISOString()

const [manifest, observationsFile, productionSnapshot] = await Promise.all([
  readJson(`${evidenceDir}/fetch-manifest.json`),
  readJson(`${evidenceDir}/source-observations.json`),
  readJson(`${evidenceDir}/production-snapshot.json`),
])

const observations = new Map(
  observationsFile.observations.map((item) => [item.sourceId, item]),
)

const publisherFromUrl = (url) => {
  const hostname = new URL(url).hostname.replace(/^www\./, '')
  if (hostname === 'apple.com') return 'Apple'
  if (hostname === 'macrumors.com') return 'MacRumors'
  if (hostname === '9to5mac.com') return '9to5Mac'
  if (hostname === 'iculture.nl') return 'iCulture'
  if (hostname === 'appleinsider.com') return 'AppleInsider'
  if (hostname === 'imore.com') return 'iMore'
  if (hostname === 'anotherapple.com') return 'AnotherApple'
  if (hostname === 'macerkopf.de') return 'Macerkopf'
  if (hostname === 'itopnews.de') return 'iTopnews'
  return hostname
}

const authorOverrides = {
  'source-applicability-apple-watchos7': 'Apple Newsroom',
  'source-watchos8-august-archive-macrumors': 'MacRumors Staff',
  'source-watchos8-imore-rolling': 'Luke Filipowicz',
  'source-watchos9-imore-rolling': 'Luke Filipowicz',
  'source-watchos10-pb5-itopnews': 'Lukas Hermann',
}

const publishedAtOverrides = {
  'source-watchos10-pb5-itopnews': '2023-08-23T18:56:00+02:00',
}

const sourceConfig = {
  'source-applicability-apple-watchos7': {
    sourceClass: 'firstPartyAnnouncement',
    roles: ['applicabilityBoundary', 'publicProgramAnnouncement'],
    locator:
      'Newsroom body paragraph stating that watchOS 7 would be offered as a public beta for the first time.',
    notes:
      'First-party boundary evidence. It establishes that pre-watchOS 7 major cycles are outside the public-beta applicability window.',
  },
  'source-applicability-9to5-watchos-history': {
    roles: ['applicabilityBoundary', 'cycleHistory'],
    locator:
      'Section describing the first watchOS public beta and listing first-public-beta dates for watchOS 7 through watchOS 9.',
  },
  'source-watchos8-august-archive-macrumors': {
    sourceClass: 'publisherArchive',
    roles: [
      'negativeChronologyEvidence',
      'publicAvailability',
      'appearanceDate',
      'cycleClosure',
    ],
    locator:
      'August 11 entry for the iOS/iPadOS-only public wave; August 18, August 25, and August 31 watchOS public-update entries.',
    notes:
      'The archive is used both to corroborate actual August watchOS appearances and to test the disputed August 12 row.',
  },
  'source-watchos8-9to5-beta5-waiting': {
    roles: ['negativeChronologyEvidence', 'buildContext'],
    locator:
      'Lead and build paragraph stating that the August 11 seed was developer-only and public testers still had to wait.',
  },
  'source-watchos8-imore-rolling': {
    sourceClass: 'livingHowTo',
    roles: ['publicAvailability', 'publicOrdinal', 'appearanceDate', 'conflict'],
    locator:
      'Dated watchOS 8 public-beta update headings for June 30, July 16, July 28, August 18, and August 26.',
    notes:
      'Living article contains a duplicate August 26 date for Public Betas 7 and 8 and is not used alone for date resolution.',
  },
  'source-watchos9-imore-rolling': {
    sourceClass: 'livingHowTo',
    roles: ['publicAvailability', 'publicOrdinal', 'appearanceDate', 'conflict'],
    locator:
      'Dated watchOS 9 headings for Public Betas 1 through 5.',
    notes:
      'Living article gives July 6 for Public Beta 1, contrary to stronger July 11 evidence, but corroborates later ordinals.',
  },
  'source-watchos10-pb2-macrumors': {
    roles: ['publicAvailability', 'appearanceDate', 'channelIdentity'],
    locator:
      'Publication date and paragraph stating that new watchOS 10 public beta software was also available.',
    notes:
      'Corroborates the July 31 public appearance but does not itself assign the watchOS public ordinal.',
  },
  'source-watchos10-pb4-9to5mac': {
    roles: ['publicAvailability', 'appearanceDate', 'channelIdentity'],
    locator:
      'August 16 update stating that the latest watchOS 10 public beta was released.',
    notes:
      'Corroborates the appearance and date but not the watchOS public ordinal.',
  },
  'source-watchos10-pb5-macrumors': {
    roles: ['publicAvailability', 'appearanceDate', 'channelIdentity'],
    locator:
      'Publication date and lead identifying a new watchOS 10 public beta.',
    notes:
      'Corroborates the appearance and date but not the public ordinal.',
  },
  'source-watchos10-pb4-macerkopf': {
    roles: [
      'publicAvailability',
      'publicOrdinal',
      'appearanceDate',
      'channelIdentity',
    ],
    locator:
      'August 16 timestamp and 19:36 update explicitly stating that watchOS 10 Public Beta 4 was available.',
  },
  'source-watchos10-pb5-itopnews': {
    roles: [
      'publicAvailability',
      'publicOrdinal',
      'appearanceDate',
      'channelIdentity',
    ],
    locator:
      'August 23 timestamp, headline, and body explicitly identifying the fifth watchOS 10 public beta.',
  },
  'source-watchos26-pb5-9to5mac': {
    roles: ['publicAvailability', 'publicOrdinal', 'relativeDateEvidence', 'conflict'],
    locator:
      'Update paragraph identifying watchOS 26 Public Beta 5 one day after the equivalent developer release.',
    notes:
      'The update stamp is malformed as “10/26/25”; only the explicit ordinal and relative one-day statement are relied on.',
  },
  'source-watchos26-pb6-9to5mac': {
    roles: ['publicAvailability', 'appearanceDate', 'channelIdentity'],
    locator:
      'September 2 update stating that public versions of the same listed builds shipped a few hours after the developer wave.',
    notes:
      'Corroborates the public appearance and date but not the public ordinal by itself.',
  },
}

const noPublicOrdinal = new Set([
  'source-watchos8-august-archive-macrumors',
  'source-watchos8-pb7-macrumors',
  'source-watchos8-pb8-macrumors',
  'source-watchos8-9to5-beta5-waiting',
  'source-watchos10-pb2-macrumors',
  'source-watchos10-pb4-9to5mac',
  'source-watchos10-pb5-macrumors',
  'source-watchos26-pb6-9to5mac',
])

const sources = manifest.sources.map((capture) => {
  const observation = observations.get(capture.sourceId)
  const publisher = publisherFromUrl(capture.finalUrl)
  const isTimeline = capture.sourceId.includes('iculture-timeline')
  const config = sourceConfig[capture.sourceId] ?? {}
  const defaultRoles = [
    'publicAvailability',
    'publicOrdinal',
    'appearanceDate',
    'channelIdentity',
  ].filter(
    (role) =>
      role !== 'publicOrdinal' || !noPublicOrdinal.has(capture.sourceId),
  )

  const publishedAt =
    publishedAtOverrides[capture.sourceId] ?? observation?.publishedAt ?? null
  const publishedDateObserved =
    publishedAt?.match(/^\d{4}-\d{2}-\d{2}/)?.[0] ??
    (capture.sourceId === 'source-watchos8-august-archive-macrumors'
      ? '2021-08'
      : null)

  return {
    sourceId: capture.sourceId,
    canonicalUrl: capture.finalUrl,
    requestedUrl:
      capture.requestedUrl === capture.finalUrl ? null : capture.requestedUrl,
    title: observation?.title ?? capture.sourceId,
    publisher,
    author: authorOverrides[capture.sourceId] ?? observation?.author ?? null,
    publishedAt,
    publishedDateObserved,
    publicationDatePrecision: publishedAt
      ? publishedAt.includes('T')
        ? 'datetime'
        : 'date'
      : publishedDateObserved === '2021-08'
        ? 'month'
        : 'unknown',
    accessedAt: researchCutoff,
    archiveUrl: null,
    status: capture.ok ? 'active' : 'captureFailed',
    sourceClass:
      config.sourceClass ??
      (isTimeline ? 'livingChronology' : 'journalism'),
    roles:
      config.roles ??
      (isTimeline
        ? [
            'publicAvailability',
            'publicOrdinal',
            'appearanceDate',
            'buildClaim',
            'cycleClosure',
          ]
        : defaultRoles),
    evidence: {
      rawPath: capture.rawPath,
      rawBytes: capture.rawBytes,
      rawSha256: capture.rawSha256,
      captureMethod: 'http-html',
      locator:
        config.locator ??
        (isTimeline
          ? 'watchOS public-beta timeline list and revision-history entries.'
          : 'Headline, displayed publication date, and lead/update paragraph identifying the public-beta appearance.'),
    },
    lineage: {
      publisherFamily: publisher,
      independentForCorroboration: true,
      notes:
        config.notes ??
        (isTimeline
          ? 'Living retrospective chronology; preserved as accessed and corroborated against a distinct publisher where possible.'
          : 'Direct publisher page retained locally. Multiple pages from this publisher count as one editorial lineage.'),
    },
  }
})

const cycleSpecs = [
  {
    version: '7.0',
    events: [
      [1, '2020-08-10', ['source-watchos7-iculture-timeline', 'source-watchos7-pb1-macrumors']],
      [2, '2020-08-20', ['source-watchos7-iculture-timeline', 'source-watchos7-pb2-macrumors']],
      [3, '2020-08-27', ['source-watchos7-iculture-timeline', 'source-watchos7-pb3-9to5mac']],
      [4, '2020-09-03', ['source-watchos7-iculture-timeline', 'source-watchos7-pb4-macrumors']],
      [5, '2020-09-10', ['source-watchos7-iculture-timeline', 'source-watchos7-pb5-macrumors']],
    ],
  },
  {
    version: '8.0',
    events: [
      [1, '2021-06-30', ['source-watchos8-iculture-timeline', 'source-watchos8-pb1-macrumors']],
      [2, '2021-07-16', ['source-watchos8-iculture-timeline', 'source-watchos8-pb2-appleinsider']],
      [
        4,
        '2021-07-28',
        [
          'source-watchos8-iculture-timeline',
          'source-watchos8-pb4-appleinsider',
          'source-watchos8-imore-rolling',
        ],
        'conflict',
      ],
      [
        6,
        '2021-08-18',
        [
          'source-watchos8-iculture-timeline',
          'source-watchos8-pb6-appleinsider',
          'source-watchos8-august-archive-macrumors',
          'source-watchos8-imore-rolling',
        ],
      ],
      [
        7,
        '2021-08-26',
        [
          'source-watchos8-iculture-timeline',
          'source-watchos8-pb7-macrumors',
          'source-watchos8-imore-rolling',
        ],
      ],
      [
        8,
        '2021-08-31',
        [
          'source-watchos8-iculture-timeline',
          'source-watchos8-pb8-macrumors',
          'source-watchos8-imore-rolling',
        ],
      ],
    ],
  },
  {
    version: '9.0',
    events: [
      [
        1,
        '2022-07-11',
        [
          'source-watchos9-iculture-timeline',
          'source-watchos9-pb1-9to5mac',
          'source-watchos9-imore-rolling',
        ],
      ],
      [2, '2022-07-29', ['source-watchos9-iculture-timeline', 'source-watchos9-pb2-macrumors', 'source-watchos9-imore-rolling']],
      [3, '2022-08-09', ['source-watchos9-iculture-timeline', 'source-watchos9-pb3-macrumors', 'source-watchos9-imore-rolling']],
      [4, '2022-08-16', ['source-watchos9-iculture-timeline', 'source-watchos9-pb4-macrumors', 'source-watchos9-imore-rolling']],
      [5, '2022-08-24', ['source-watchos9-iculture-timeline', 'source-watchos9-imore-rolling']],
    ],
  },
  {
    version: '10.0',
    events: [
      [1, '2023-07-12', ['source-watchos10-iculture-timeline', 'source-watchos10-pb1-macrumors']],
      [
        2,
        '2023-07-31',
        [
          'source-watchos10-iculture-timeline',
          'source-watchos10-pb2-macrumors',
          'source-watchos10-pb2-appleinsider',
        ],
      ],
      [3, '2023-08-09', ['source-watchos10-iculture-timeline', 'source-watchos10-pb3-9to5mac']],
      [
        4,
        '2023-08-16',
        [
          'source-watchos10-iculture-timeline',
          'source-watchos10-pb4-9to5mac',
          'source-watchos10-pb4-macerkopf',
        ],
      ],
      [
        5,
        '2023-08-23',
        [
          'source-watchos10-iculture-timeline',
          'source-watchos10-pb5-macrumors',
          'source-watchos10-pb5-itopnews',
        ],
      ],
      [6, '2023-08-29', ['source-watchos10-iculture-timeline', 'source-watchos10-pb6-appleinsider']],
    ],
  },
  {
    version: '11.0',
    events: [
      [1, '2024-07-15', ['source-watchos11-iculture-timeline', 'source-watchos11-pb1-macrumors']],
      [2, '2024-07-24', ['source-watchos11-iculture-timeline', 'source-watchos11-pb2-macrumors']],
      [3, '2024-08-06', ['source-watchos11-iculture-timeline', 'source-watchos11-pb3-macrumors']],
      [4, '2024-08-13', ['source-watchos11-iculture-timeline', 'source-watchos11-pb4-macrumors']],
      [5, '2024-08-21', ['source-watchos11-iculture-timeline', 'source-watchos11-pb5-macrumors']],
    ],
  },
  {
    version: '26.0',
    events: [
      [1, '2025-07-24', ['source-watchos26-iculture-timeline', 'source-watchos26-pb1-9to5mac']],
      [2, '2025-08-07', ['source-watchos26-iculture-timeline', 'source-watchos26-pb2-macrumors']],
      [
        3,
        '2025-08-14',
        [
          'source-watchos26-iculture-timeline',
          'source-watchos26-pb3-macrumors',
          'source-watchos26-pb3-9to5mac',
        ],
      ],
      [
        4,
        '2025-08-19',
        ['source-watchos26-iculture-timeline', 'source-watchos26-pb4-macrumors'],
        'conflict',
      ],
      [
        5,
        '2025-08-26',
        [
          'source-watchos26-iculture-timeline',
          'source-watchos26-pb5-anotherapple',
          'source-watchos26-pb5-9to5mac',
        ],
        'conflict',
      ],
      [
        6,
        '2025-09-02',
        ['source-watchos26-iculture-timeline', 'source-watchos26-pb6-9to5mac'],
        'unverified',
      ],
    ],
  },
]

const sourceById = new Map(sources.map((source) => [source.sourceId, source]))
const exactCheckByKey = new Map(
  productionSnapshot.exactChecks.map((check) => [
    `${check.releaseVersionId}/${check.routeAlias}`,
    check,
  ]),
)

const candidates = cycleSpecs.flatMap((cycle) =>
  cycle.events.map(([ordinal, appearanceDate, sourceIds, status = 'confirmed']) => {
    const versionToken = cycle.version.replaceAll('.', '-')
    const releaseVersionId = `version-watchos-${versionToken}`
    const routeAlias = `public-beta-${ordinal}`
    const candidateId = `candidate:apple:watchos:${cycle.version}:${routeAlias}`
    const exactCheck = exactCheckByKey.get(`${releaseVersionId}/${routeAlias}`)
    if (!exactCheck) {
      throw new Error(`Missing production exact check for ${candidateId}`)
    }

    const blockers = ['Independent chronology review has not yet occurred.']
    if (status === 'conflict') {
      blockers.unshift(
        'A material publisher conflict must be adjudicated against the retained evidence before promotion.',
      )
    } else if (status === 'unverified') {
      blockers.unshift(
        'Only one retained lineage explicitly supplies the public ordinal; the second lineage confirms the appearance but not the ordinal.',
      )
    }

    return {
      candidateId,
      originCohortId: 'watchos-major-public-beta',
      platform: 'watchOS',
      platformId: 'platform-watchos',
      version: cycle.version,
      releaseVersionId,
      proposedIdentity: {
        label: `Public Beta ${ordinal}`,
        routeAlias,
        channel: 'publicBeta',
        appearanceDate,
        sequence: ordinal,
        isRevision: false,
        availabilityState: 'available',
        closesReleaseCycle: false,
      },
      ordinalBasis: status === 'conflict' ? 'conflicted' : 'explicit',
      candidateStatus: 'needsEvidenceReview',
      reviewDisposition:
        status === 'conflict'
          ? 'requiresConflictAdjudication'
          : status === 'unverified'
            ? 'needsSecondExactOrdinalLineage'
            : 'readyForIndependentChronologyReview',
      identityStatus: status,
      evidenceState: 'corroborated',
      productionReconciliation: {
        status: 'confirmedMissing',
        queriedAt: productionSnapshot.capturedAt,
        matchBasis:
          'Exact published-production query by releaseVersionId, channel publicBeta, and routeAlias found no match.',
        exactIdentityMatches: exactCheck.matchCount,
        matchingEventIds: exactCheck.matchingEventIds,
      },
      evidenceRefs: sourceIds.map((sourceId) => ({
        kind: 'packetSource',
        packetPath: `${packetDir}/sources.json`,
        sourceId,
        locator: sourceById.get(sourceId).evidence.locator,
        supports: evidenceSupport(sourceById.get(sourceId), ordinal),
      })),
      buildEvidenceStatus: 'absent',
      contentDisposition: 'timelineOnly',
      blockers,
      review: {
        required: true,
        reviewer: null,
        reviewedAt: null,
        notes:
          'The research agent preserved and mechanically checked the evidence but cannot count as an independent chronology reviewer.',
      },
      flags: {
        sanityMutationAllowed: false,
        publicationEligible: false,
      },
    }
  }),
)

const candidatesByVersion = Object.fromEntries(
  cycleSpecs.map((cycle) => [cycle.version, cycle.events.length]),
)
const reviewDispositionCounts = countBy(
  candidates,
  (candidate) => candidate.reviewDisposition,
)
const identityStatusCounts = countBy(
  candidates,
  (candidate) => candidate.identityStatus,
)

const assignment = {
  formatVersion: 1,
  batchId,
  createdAt,
  createdBy: 'codex-scope-beta-gap-program',
  vendor: {name: 'Apple', slug: 'apple'},
  researchCutoff,
  applicabilityBoundary: {
    firstApplicableMajorVersion: '7.0',
    basis:
      'Apple announced that watchOS 7 would be the first watchOS release offered through its public beta program.',
    sourceIds: [
      'source-applicability-apple-watchos7',
      'source-applicability-9to5-watchos-history',
    ],
  },
  scopeRule:
    'Enumerate public-beta appearances for watchOS major cycles 7.0, 8.0, 9.0, 10.0, 11.0, and 26.0 only. Exclude watchOS 27.0, all point/patch cycles, developer-only seeds, RC/GM distributions, inferred public ordinals, and disputed rows that do not survive contemporary-source review.',
  targetCount: candidates.length,
  cycles: cycleSpecs.map((cycle) => ({
    version: cycle.version,
    targetCount: cycle.events.length,
  })),
  targets: candidates.map((candidate) => ({
    candidateId: candidate.candidateId,
    platform: candidate.platform,
    platformId: candidate.platformId,
    version: candidate.version,
    releaseVersionId: candidate.releaseVersionId,
    channel: candidate.proposedIdentity.channel,
    routeAlias: candidate.proposedIdentity.routeAlias,
    displayedLabel: candidate.proposedIdentity.label,
    expectedAppearanceDate: candidate.proposedIdentity.appearanceDate,
    expectedSequence: candidate.proposedIdentity.sequence,
  })),
  explicitlyNotTargeted: [
    {
      identity: 'watchOS 8.0 Public Beta 5 on 2021-08-12',
      reason:
        'A retrospective iCulture row is contradicted by contemporary publisher chronology and same-cycle reporting. It remains not proposed pending reversal evidence.',
    },
  ],
  requiredDeliverables: [
    'assignment.json',
    'sources.json',
    'candidates.json',
    'conflicts.json',
    'report.md',
    'validation.json',
    'review.json',
  ],
  constraints: {
    researchOnly: true,
    sanityWritesAllowed: false,
    deploymentAllowed: false,
    buildInferenceAllowed: false,
    independentReviewRequired: true,
  },
  status: 'researchCompleteAwaitingIndependentReview',
}

const sourcesDocument = {
  formatVersion: 1,
  batchId,
  accessedAt: researchCutoff,
  sourceCount: sources.length,
  sources,
}

const candidatesDocument = {
  formatVersion: 1,
  batchId,
  researchCutoff,
  candidateCount: candidates.length,
  summary: {
    byVersion: candidatesByVersion,
    byReviewDisposition: reviewDispositionCounts,
    byIdentityStatus: identityStatusCounts,
    byEvidenceState: countBy(candidates, (candidate) => candidate.evidenceState),
    buildsIncluded: 0,
    substantiveChangeClaimsIncluded: 0,
    productionSnapshot: {
      path: `${evidenceDir}/production-snapshot.json`,
      capturedAt: productionSnapshot.capturedAt,
      perspective: productionSnapshot.perspective,
      totalReleaseEvents:
        productionSnapshot.productionCounts.totalReleaseEvents,
      watchOSPublicBetaEventsAllVersions:
        productionSnapshot.productionCounts.watchOSPublicBetaEventsAllVersions,
      scopedReleaseEvents:
        productionSnapshot.productionCounts.scopedReleaseEvents,
      scopedPublicBetaEvents:
        productionSnapshot.productionCounts.scopedPublicBetaEvents,
      exactChecksRun: productionSnapshot.exactChecks.length,
    },
    importantQualification:
      'Thirty-three appearances are defensible as research candidates. No candidate is chronology-approved or publication-eligible. A formerly expected thirty-fourth row—watchOS 8 Public Beta 5 on August 12, 2021—is explicitly not proposed because contemporary evidence contradicts the later retrospective timeline.',
  },
  candidates,
}

const conflictsDocument = {
  formatVersion: 1,
  batchId,
  conflictCount: 9,
  conflicts: [
    {
      conflictId: 'watchos-public-beta-applicability-boundary',
      severity: 'scopeBoundary',
      subject: 'Whether watchOS major cycles before 7.0 require public-beta rows',
      positions: [
        {
          position: 'watchos7WasFirst',
          sources: [
            'source-applicability-apple-watchos7',
            'source-applicability-9to5-watchos-history',
          ],
          summary:
            'Apple announced watchOS 7 as the first watchOS public beta, independently restated by 9to5Mac.',
        },
      ],
      decision: {
        disposition: 'excludePreWatchOS7MajorCyclesAsNotApplicable',
        confidence: 'high',
        rationale:
          'The first-party boundary directly answers applicability; zero public-beta events before watchOS 7 is not a chronology gap.',
      },
    },
    {
      conflictId: 'watchos8-july28-public-ordinal',
      severity: 'material',
      subject: 'Whether the July 28, 2021 watchOS 8 public seed was Public Beta 3 or Public Beta 4',
      positions: [
        {
          position: 'publicBeta4',
          sources: [
            'source-watchos8-iculture-timeline',
            'source-watchos8-pb4-appleinsider',
          ],
          summary:
            'Two publisher lineages label the July 28 public wave as the fourth public beta; iCulture says Public Beta 3 was skipped.',
        },
        {
          position: 'publicBeta3',
          sources: ['source-watchos8-imore-rolling'],
          summary:
            'iMore labels the same July 28 appearance Public Beta 3.',
        },
      ],
      decision: {
        disposition: 'proposePublicBeta4ButKeepConflicted',
        confidence: 'medium',
        rationale:
          'The Public Beta 4 label has two lineages and an explicit skipped-number explanation, but the contradictory publisher label prevents promotion without review.',
      },
      reversalEvidence:
        'A preserved Apple public-beta UI, Apple seed record, or additional contemporary source that unambiguously displays the public ordinal.',
    },
    {
      conflictId: 'watchos8-august12-retrospective-row',
      severity: 'material',
      subject: 'Whether watchOS 8 had a Public Beta 5 appearance on August 12, 2021',
      positions: [
        {
          position: 'appearanceOnAugust12',
          sources: ['source-watchos8-iculture-timeline'],
          summary:
            'The later iCulture chronology lists Public Beta 5 on August 12 with build 19R5323g.',
        },
        {
          position: 'noWatchOSPublicAppearanceOnAugust12',
          sources: [
            'source-watchos8-august-archive-macrumors',
            'source-watchos8-9to5-beta5-waiting',
          ],
          summary:
            'Contemporary coverage identifies the August 11 public wave as iOS/iPadOS-only, says watchOS public testers still had to wait, and next records a watchOS public wave on August 18.',
        },
      ],
      decision: {
        disposition: 'doNotProposePublicBeta5',
        confidence: 'high',
        rationale:
          'Contemporary negative chronology outweighs a single later retrospective row. The evidence supports six watchOS 8 public appearances, not seven.',
      },
      reversalEvidence:
        'A contemporary August 12 source, Apple seed record, or preserved device screenshot showing watchOS 8 Public Beta 5/build 19R5323g available to public testers.',
    },
    {
      conflictId: 'watchos8-public-beta8-date',
      severity: 'material',
      subject: 'Whether watchOS 8 Public Beta 8 appeared August 26 or August 31, 2021',
      positions: [
        {
          position: 'august31',
          sources: [
            'source-watchos8-iculture-timeline',
            'source-watchos8-pb8-macrumors',
            'source-watchos8-august-archive-macrumors',
          ],
          summary:
            'The chronology and contemporary MacRumors update place the public availability on August 31.',
        },
        {
          position: 'august26Duplicate',
          sources: ['source-watchos8-imore-rolling'],
          summary:
            'The living iMore article gives August 26 for both Public Beta 7 and Public Beta 8.',
        },
      ],
      decision: {
        disposition: 'resolveAs2021-08-31',
        confidence: 'high',
        rationale:
          'The independent contemporary update and archive agree with the detailed chronology; the duplicate iMore date is internally inconsistent.',
      },
    },
    {
      conflictId: 'watchos9-public-beta1-date',
      severity: 'material',
      subject: 'Whether watchOS 9 Public Beta 1 appeared July 6 or July 11, 2022',
      positions: [
        {
          position: 'july11',
          sources: [
            'source-watchos9-iculture-timeline',
            'source-watchos9-pb1-9to5mac',
          ],
          summary:
            'The chronology and 9to5Mac update identify July 11 as the first public-beta appearance.',
        },
        {
          position: 'july6',
          sources: ['source-watchos9-imore-rolling'],
          summary:
            'The living iMore article gives July 6, the developer Beta 3 date, for the first public beta.',
        },
      ],
      decision: {
        disposition: 'resolveAs2022-07-11',
        confidence: 'high',
        rationale:
          'Two independent lineages identify July 11; the July 6 entry appears to transfer the developer seed date to the public audience.',
      },
    },
    {
      conflictId: 'watchos10-public-beta2-date',
      severity: 'nonMaterial',
      subject: 'Whether watchOS 10 Public Beta 2 appeared July 31 or August 1, 2023',
      positions: [
        {
          position: 'july31',
          sources: [
            'source-watchos10-iculture-timeline',
            'source-watchos10-pb2-macrumors',
          ],
          summary:
            'Two lineages record a new watchOS 10 public beta on July 31; iCulture explicitly calls it Public Beta 2.',
        },
        {
          position: 'august1',
          sources: ['source-watchos10-pb2-appleinsider'],
          summary:
            'AppleInsider published August 1 and describes Public Beta 2 as newly available.',
        },
      ],
      decision: {
        disposition: 'resolveAs2023-07-31',
        confidence: 'high',
        rationale:
          'The July 31 same-day appearance report plus the explicit chronology outweigh a likely next-day reporting lag.',
      },
    },
    {
      conflictId: 'watchos11-public-beta5-internal-copy',
      severity: 'nonMaterial',
      subject: 'MacRumors internal fourth/fifth wording on the August 21, 2024 article',
      positions: [
        {
          position: 'publicBeta5',
          sources: [
            'source-watchos11-iculture-timeline',
            'source-watchos11-pb5-macrumors',
          ],
          summary:
            'The MacRumors headline and following sentence say fifth, and iCulture independently lists Public Beta 5.',
        },
        {
          position: 'fourthInLeadTypo',
          sources: ['source-watchos11-pb5-macrumors'],
          summary:
            'The first MacRumors sentence says fourth before its next sentence says fifth.',
        },
      ],
      decision: {
        disposition: 'resolveAsPublicBeta5',
        confidence: 'high',
        rationale:
          'The headline, chronology, and article sequence make the isolated “fourth” wording an internal copy error.',
      },
    },
    {
      conflictId: 'watchos26-public-beta4-date',
      severity: 'material',
      subject: 'Whether watchOS 26 Public Beta 4 appeared August 18 or August 19, 2025',
      positions: [
        {
          position: 'august18',
          sources: ['source-watchos26-iculture-timeline'],
          summary:
            'The later iCulture chronology assigns Public Beta 4 to August 18.',
        },
        {
          position: 'august19',
          sources: ['source-watchos26-pb4-macrumors'],
          summary:
            'A dedicated contemporary report states that Apple released the fourth public beta on August 19, one day after the developer seed.',
        },
      ],
      decision: {
        disposition: 'propose2025-08-19ButKeepConflicted',
        confidence: 'medium',
        rationale:
          'The dedicated public-channel report is more specific and contemporary, but a second independent date source is still desirable.',
      },
      reversalEvidence:
        'A first-party public seed record or another contemporary report that establishes the public availability date.',
    },
    {
      conflictId: 'watchos26-public-beta5-date',
      severity: 'material',
      subject: 'Whether watchOS 26 Public Beta 5 appeared August 25 or August 26, 2025',
      positions: [
        {
          position: 'august25',
          sources: ['source-watchos26-pb5-anotherapple'],
          summary:
            'AnotherApple reports Public Beta 5 as available on August 25.',
        },
        {
          position: 'august26',
          sources: [
            'source-watchos26-iculture-timeline',
            'source-watchos26-pb5-9to5mac',
          ],
          summary:
            'iCulture explicitly dates Public Beta 5 to August 26, while 9to5Mac says it followed the August 25 developer seed by one day.',
        },
      ],
      decision: {
        disposition: 'propose2025-08-26ButKeepConflicted',
        confidence: 'medium',
        rationale:
          'Two lineages support the next-day date, but 9to5Mac’s malformed update stamp and the contrary same-day report warrant independent review.',
      },
      reversalEvidence:
        'A first-party public seed record or timestamped device evidence for Public Beta 5.',
    },
  ],
  excludedAppearances: [
    {
      identity: 'watchOS 8.0 Public Beta 5 — 2021-08-12',
      reason:
        'Not proposed because contemporary sources contradict the sole later retrospective row.',
    },
    {
      identity: 'watchOS 1.0 through watchOS 6.x public betas',
      reason:
        'Not applicable: Apple identified watchOS 7 as its first public-beta cycle.',
    },
    {
      identity: 'watchOS 27.0 and all point/patch cycles',
      reason: 'Explicitly outside this packet’s assigned scope.',
    },
    {
      identity: 'Developer-only seeds, RC/GM, and final public releases',
      reason:
        'Audience and channel boundaries are preserved; these are not public-beta appearances.',
    },
  ],
  reviewState: 'readyForIndependentChronologyReview',
}

const reviewDocument = {
  formatVersion: 1,
  batchId,
  reviewedAt: researchCutoff,
  reviewer: 'codex-scope-beta-gap-program-self-check',
  independentOfResearcher: false,
  verdict: 'pendingIndependentReview',
  candidateVerdict: {
    readyForIndependentChronologyReview: candidates
      .filter(
        (candidate) =>
          candidate.reviewDisposition ===
          'readyForIndependentChronologyReview',
      )
      .map((candidate) => candidate.candidateId),
    needsSecondExactOrdinalLineage: candidates
      .filter(
        (candidate) =>
          candidate.reviewDisposition === 'needsSecondExactOrdinalLineage',
      )
      .map((candidate) => candidate.candidateId),
    requiresConflictAdjudication: candidates
      .filter(
        (candidate) =>
          candidate.reviewDisposition === 'requiresConflictAdjudication',
      )
      .map((candidate) => candidate.candidateId),
  },
  checks: {
    jsonParsed: true,
    sourceIdsUnique: unique(sources.map((source) => source.sourceId)),
    candidateIdsUnique: unique(
      candidates.map((candidate) => candidate.candidateId),
    ),
    allReferencesResolve: candidates.every((candidate) =>
      candidate.evidenceRefs.every((ref) => sourceById.has(ref.sourceId)),
    ),
    rawEvidenceArtifactsReproduced: sources.length,
    candidateProductionResultsAligned: candidates.every(
      (candidate) =>
        candidate.productionReconciliation.exactIdentityMatches === 0,
    ),
    allCandidateChannelsArePublicBeta: candidates.every(
      (candidate) => candidate.proposedIdentity.channel === 'publicBeta',
    ),
    allCandidateExactProductionMatches: 0,
    watchOS8August12Promoted: false,
    sanityMutationPerformed: false,
  },
  requiredIndependentReview: [
    'Reproduce every candidate’s primary locator from the retained raw capture.',
    'Adjudicate the watchOS 8 ordinal and August 12 exclusion before any data write.',
    'Adjudicate the watchOS 26 Public Beta 4 and 5 date conflicts.',
    'Obtain a second exact-ordinal lineage for watchOS 26 Public Beta 6, or explicitly approve the one-lineage ordinal evidence gate.',
    'Repeat exact production reconciliation immediately before any separately authorized Sanity mutation.',
  ],
  authorization: {
    chronologyApprovedCandidateCount: 0,
    publicationEligible: false,
    sanityMutationAllowed: false,
    deploymentAllowed: false,
  },
}

const report = `# watchOS major-cycle public-beta chronology, watchOS 7–26

## Outcome

This packet identifies **33 defensible public-beta appearance candidates** across the assigned watchOS major cycles:

| Major cycle | Defensible appearances | Proposed public labels |
| --- | ---: | --- |
| watchOS 7.0 | 5 | 1–5 |
| watchOS 8.0 | 6 | 1, 2, 4, 6, 7, 8 |
| watchOS 9.0 | 5 | 1–5 |
| watchOS 10.0 | 6 | 1–6 |
| watchOS 11.0 | 5 | 1–5 |
| watchOS 26.0 | 6 | 1–6 |

The total is **33, not the initially expected 34**. The removed row is the claimed watchOS 8 Public Beta 5 appearance on August 12, 2021.

## Why the watchOS 8 count changed

A later iCulture timeline lists Public Beta 5 on August 12. Contemporary evidence does not support it:

- MacRumors’ August archive records the August 11 public wave as iOS/iPadOS-only and next records a watchOS public update on August 18.
- 9to5Mac’s August 11 watchOS Beta 5 report says public testers still had to wait.
- The same cycle’s surviving public labels are inconsistent across publishers, so developer numbers were not transferred into public identities.

The August 12 row is retained in \`conflicts.json\` as \`notProposed\`, together with the exact evidence needed to reverse that decision.

## Applicability boundary

Apple’s watchOS 7 announcement says this was the first watchOS release offered through the public beta program. That makes pre-watchOS 7 zeros historically correct rather than missing data. This packet therefore begins at watchOS 7.0 and does not manufacture earlier public-beta events.

## Evidence quality

All 33 proposed appearances have two publisher lineages supporting that a public-channel appearance occurred. Exact ordinal quality is narrower:

- Most labels are explicit in at least two retained lineages.
- watchOS 26 Public Beta 6 has one explicit-ordinal lineage plus a second lineage that confirms the public appearance/date without assigning the public ordinal.
- watchOS 8 Public Beta 4 and watchOS 26 Public Betas 4 and 5 remain conflict-blocked.

No build was copied from a developer seed or inferred through payload equivalence. Source pages may report builds, but this candidate packet intentionally leaves build fields absent.

## Production reconciliation

The read-only published-production snapshot was captured at ${productionSnapshot.capturedAt}.

- Total published \`releaseEvent\` documents: ${productionSnapshot.productionCounts.totalReleaseEvents}
- Published watchOS \`publicBeta\` events across all versions: ${productionSnapshot.productionCounts.watchOSPublicBetaEventsAllVersions}
- Published events in the six scoped release versions: ${productionSnapshot.productionCounts.scopedReleaseEvents}
- Published scoped \`publicBeta\` events: ${productionSnapshot.productionCounts.scopedPublicBetaEvents}
- Exact route checks run: ${productionSnapshot.exactChecks.length}
- Exact candidate matches found: 0

The snapshot checked the original 34 expected aliases, including the now-rejected watchOS 8 Public Beta 5 route. Production absence is confirmed; absence alone never proves an event existed.

## Promotion gates

This is a research handoff, not an ingestion manifest.

1. An independent reviewer must reproduce the evidence locators and adjudicate the material conflicts.
2. The one remaining one-lineage ordinal case needs another exact-ordinal source or an explicit evidence-gate decision.
3. Exact production queries must be rerun immediately before any separately authorized write.
4. No candidate may be published merely because its proposed route is empty.

## Safety and copyright

No Sanity mutation, stable event-ID creation, code deployment, or publication occurred. The report is original synthesis. Source pages are referenced with publisher credit and retained locally only as evidence captures; no article text is republished as release-note copy.
`

await Promise.all([
  writeJson(`${packetDir}/assignment.json`, assignment),
  writeJson(`${packetDir}/sources.json`, sourcesDocument),
  writeJson(`${packetDir}/candidates.json`, candidatesDocument),
  writeJson(`${packetDir}/conflicts.json`, conflictsDocument),
  writeFile(`${packetDir}/report.md`, report),
  writeJson(`${packetDir}/review.json`, reviewDocument),
])

const rawHashChecks = []
for (const source of sources) {
  const raw = await readFile(source.evidence.rawPath)
  rawHashChecks.push({
    sourceId: source.sourceId,
    matches:
      createHash('sha256').update(raw).digest('hex') ===
      source.evidence.rawSha256,
  })
}

const lockNames = [
  'assignment.json',
  'sources.json',
  'candidates.json',
  'conflicts.json',
  'report.md',
  'review.json',
]
const fileLocks = {}
for (const filename of lockNames) {
  const contents = await readFile(path.join(packetDir, filename))
  fileLocks[filename] = {
    bytes: contents.byteLength,
    sha256: createHash('sha256').update(contents).digest('hex'),
  }
}

const validation = {
  formatVersion: 1,
  batchId,
  validatedAt: new Date().toISOString(),
  validator: 'codex-scope-beta-gap-program',
  status: 'passedSelfCheckPendingIndependentReview',
  checks: {
    exactTargetClosure: candidates.length === 33,
    assignmentTargetCount: assignment.targetCount,
    candidateCount: candidates.length,
    sourceCount: sources.length,
    successfulRawCaptureCount: manifest.successfulCaptureCount,
    uniqueCandidateIds: unique(
      candidates.map((candidate) => candidate.candidateId),
    ),
    uniqueSourceIds: unique(sources.map((source) => source.sourceId)),
    allEvidenceRefsResolve: candidates.every((candidate) =>
      candidate.evidenceRefs.every((ref) => sourceById.has(ref.sourceId)),
    ),
    rawHashesReproduced: rawHashChecks.every((check) => check.matches),
    rawHashFailureSourceIds: rawHashChecks
      .filter((check) => !check.matches)
      .map((check) => check.sourceId),
    publicOrdinalsNeverInferredFromDeveloperBuilds: candidates.every(
      (candidate) => candidate.ordinalBasis !== 'inferredFromPairedDeveloper',
    ),
    exactProductionMatches: candidates.reduce(
      (sum, candidate) =>
        sum + candidate.productionReconciliation.exactIdentityMatches,
      0,
    ),
    watchOSPublicBetaEventsInProduction:
      productionSnapshot.productionCounts.watchOSPublicBetaEventsAllVersions,
    scopedPublicBetaEventsInProduction:
      productionSnapshot.productionCounts.scopedPublicBetaEvents,
    watchOS8August12CandidateCreated: candidates.some(
      (candidate) =>
        candidate.version === '8.0' &&
        candidate.proposedIdentity.appearanceDate === '2021-08-12',
    ),
    outOfScopeVersionsPresent: candidates.some(
      (candidate) =>
        candidate.version === '27.0' ||
        !['7.0', '8.0', '9.0', '10.0', '11.0', '26.0'].includes(
          candidate.version,
        ),
    ),
    buildsIncluded: candidates.filter((candidate) => candidate.build).length,
    sanityWritesPerformed: 0,
    deploymentsPerformed: 0,
    independentEvidenceReviewComplete: false,
  },
  expectedCycleCounts: candidatesByVersion,
  fileLocks,
  rawEvidence: {
    captureManifestPath: `${evidenceDir}/fetch-manifest.json`,
    sourceObservationsPath: `${evidenceDir}/source-observations.json`,
    productionSnapshotPath: `${evidenceDir}/production-snapshot.json`,
  },
  limitations: [
    'The researcher performed the mechanical self-check; this is not an independent evidence review.',
    'Living chronology and how-to pages can change after publication, so the retained raw hashes are part of the audit trail.',
    'One candidate has only one retained lineage that explicitly supplies the public ordinal.',
    'Three candidates remain materially conflict-blocked.',
  ],
}

await writeJson(`${packetDir}/validation.json`, validation)

function evidenceSupport(source, ordinal) {
  if (source.roles.includes('negativeChronologyEvidence')) {
    return 'Tests the disputed chronology boundary and prevents an unsupported public appearance from being inferred.'
  }
  if (source.roles.includes('publicOrdinal')) {
    return `Explicitly supports Public Beta ${ordinal} and/or its dated public-channel appearance.`
  }
  return 'Independently corroborates the public-channel appearance and date without being treated as exact ordinal evidence.'
}

function countBy(items, keyFn) {
  const result = {}
  for (const item of items) {
    const key = keyFn(item)
    result[key] = (result[key] ?? 0) + 1
  }
  return result
}

function unique(items) {
  return new Set(items).size === items.length
}

async function readJson(filename) {
  return JSON.parse(await readFile(filename, 'utf8'))
}

async function writeJson(filename, value) {
  await writeFile(filename, `${JSON.stringify(value, null, 2)}\n`)
}
