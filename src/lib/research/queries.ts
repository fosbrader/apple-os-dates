import { groq } from "next-sanity";

/**
 * Public API queries are deliberately split by document type. The full
 * archive is larger than Next's 2 MB data-cache entry limit, so a single
 * snapshot query would bypass the cache on every request. Keep the shared
 * projections here, then page the high-volume event and change collections
 * in the data layer.
 */

const publicCitationProjection = groq`
  {
    "_key": _key,
    locator,
    "sourceId": source._ref,
    "sourceUrl": source->canonicalUrl,
    "sourceTitle": source->title,
    "publisher": source->publisher,
    "author": source->author,
    "publicationDate": coalesce(
      source->publishedAt,
      source->publicationDate
    ),
    "accessedDate": coalesce(source->accessedAt, source->accessedDate),
    "archiveUrl": source->archiveUrl,
    "sourceClass": source->sourceClass
  }
`;

const publicChangeOccurrenceProjection = groq`
  {
    "_key": _key,
    action,
    inheritance,
    summary,
    documentedStatus,
    evidenceState,
    verificationMethod,
    publicContributorCredit,
    "applicability": array::unique(
      coalesce(applicability.deviceFamilies, []) +
      coalesce(applicability.models, []) +
      coalesce(applicability.regions, []) +
      coalesce(applicability.languages, []) +
      coalesce(applicability.audiences, [])
    ),
    "changeId": coalesce(change._ref, releaseChange._ref),
    "changeTitle": coalesce(change->title, releaseChange->title),
    citations[] ${publicCitationProjection}
  }
`;

const publicReleaseProjection = groq`
  {
    "_id": _id,
    "_updatedAt": _updatedAt,
    version,
    releaseStatus,
    publicReleaseDate,
    versionNote,
    releaseNotesUrl,
    provenanceStatus,
    "auditBatchCount": count(auditBatches),
    "overviewText": select(
      editorialReview.status == "approved" => pt::text(overview)
    ),
    milestones[] {
      _key,
      label,
      date,
      note,
      sourceUrl,
      sourceLabel,
      isRevision
    },
    releaseTrain-> {
      majorVersion,
      platform-> {
        name,
        "slug": slug.current
      }
    }
  }
`;

const publicEventProjection = groq`
  {
    "_id": _id,
    "_updatedAt": _updatedAt,
    legacySourceId,
    label,
    "routeAlias": routeAlias.current,
    channel,
    appearanceDate,
    date,
    versionLabelAtAppearance,
    availabilityState,
    isRevision,
    "audience": coalesce(applicability.audiences, []),
    "deviceScope": array::unique(
      coalesce(applicability.deviceFamilies, []) +
      coalesce(applicability.models, [])
    ),
    "regionScope": coalesce(applicability.regions, []),
    "languageScope": coalesce(applicability.languages, []),
    "note": coalesce(
      select(editorialReview.status == "approved" => summary),
      legacyNote
    ),
    provenanceStatus,
    "indexEligible": coalesce(isIndexable, false),
    "articleText": select(
      editorialReview.status == "approved" => pt::text(articleBody)
    ),
    citations[] ${publicCitationProjection},
    "changes": select(
      editorialReview.status == "approved" =>
        changes[change->editorialReview.status == "approved"]
        ${publicChangeOccurrenceProjection},
      []
    ),
    "versionId": coalesce(releaseVersion._ref, parentVersion._ref),
    "version": coalesce(releaseVersion->version, parentVersion->version),
    "family": coalesce(
      releaseVersion->releaseTrain->majorVersion,
      parentVersion->releaseTrain->majorVersion
    ),
    "platform": coalesce(
      releaseVersion->releaseTrain->platform->slug.current,
      parentVersion->releaseTrain->platform->slug.current
    ),
    "buildId": coalesce(releaseBuild._ref, build._ref),
    "buildNumber": coalesce(
      releaseBuild->buildNumber,
      build->buildNumber
    )
  }
`;

const publicBuildProjection = groq`
  {
    "_id": _id,
    "_updatedAt": _updatedAt,
    buildNumber,
    "canonicalSlug": slug.current,
    "status": availabilityState,
    "deviceScope": array::unique(
      coalesce(applicability.deviceFamilies, []) +
      coalesce(applicability.models, [])
    ),
    provenanceStatus,
    "indexEligible": coalesce(isIndexable, indexEligible, false),
    "articleText": select(
      editorialReview.status == "approved" => pt::text(articleBody)
    ),
    citations[] ${publicCitationProjection},
    "changes": select(
      editorialReview.status == "approved" =>
        changes[
          change->editorialReview.status == "approved" ||
          releaseChange->editorialReview.status == "approved"
        ] ${publicChangeOccurrenceProjection},
      []
    ),
    "versionId": coalesce(releaseVersion._ref, parentVersion._ref),
    "version": coalesce(releaseVersion->version, parentVersion->version),
    "family": coalesce(
      releaseVersion->releaseTrain->majorVersion,
      parentVersion->releaseTrain->majorVersion
    ),
    "platform": coalesce(
      releaseVersion->releaseTrain->platform->slug.current,
      parentVersion->releaseTrain->platform->slug.current
    )
  }
`;

const publicChangeProjection = groq`
  {
    "_id": _id,
    "_updatedAt": _updatedAt,
    title,
    category,
    "summary": canonicalSummary,
    citations[] ${publicCitationProjection}
  }
`;

const publicAuditBatchProjection = groq`
  {
    "_id": _id,
    title,
    status,
    "verificationDate": coalesce(verifiedAt, verificationDate),
    "methodology": pt::text(methodology),
    "scope": coalesce(platforms[]->slug.current, []),
    "snapshotIdentity": coalesce(snapshotDigest, snapshotIdentity),
    commitSha,
    citations[] ${publicCitationProjection}
  }
`;

const publicCorrectionProjection = groq`
  {
    "_id": _id,
    title,
    status,
    correctionDate,
    publishedAt,
    "reasonCategory": reasonCategory,
    "reason": publicSummary,
    "affectedTargetIds": affectedClaims[].affectedDocument._ref,
    citations[] ${publicCitationProjection},
    affectedClaims[] {
      "_key": _key,
      citations[] ${publicCitationProjection}
    }
  }
`;

export const publicResearchReleasesQuery = groq`
  *[_type == "releaseVersion"] | order(_id asc) ${publicReleaseProjection}
`;

export const publicResearchEventsCountQuery = groq`
  count(*[_type == "releaseEvent"])
`;

export const publicResearchEventsPageQuery = groq`
  *[_type == "releaseEvent"] | order(_id asc)[$offset...$end]
  ${publicEventProjection}
`;

export const publicResearchBuildsQuery = groq`
  *[_type == "releaseBuild"] | order(_id asc) ${publicBuildProjection}
`;

export const publicResearchChangesCountQuery = groq`
  count(*[
    _type == "releaseChange" &&
    editorialReview.status == "approved"
  ])
`;

export const publicResearchChangesPageQuery = groq`
  *[
    _type == "releaseChange" &&
    editorialReview.status == "approved"
  ] | order(_id asc)[$offset...$end] ${publicChangeProjection}
`;

export const publicResearchAuditBatchesQuery = groq`
  *[_type == "auditBatch"] | order(_id asc) ${publicAuditBatchProjection}
`;

export const publicResearchCorrectionsQuery = groq`
  *[
    _type == "correction" &&
    status == "published" &&
    editorialReview.status == "approved"
  ] | order(_id asc) ${publicCorrectionProjection}
`;
