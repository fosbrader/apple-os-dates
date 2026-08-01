import { groq } from "next-sanity";

/**
 * This query deliberately projects an explicit public-field allowlist.
 * Private moderation records and internal editorial fields are not selected.
 *
 * Several coalesced field names keep the read model compatible while the
 * first-class event/build schemas are rolled out. They can be narrowed after
 * the migration without changing the public export contract.
 */
export const publicResearchSnapshotQuery = groq`
{
  "releases": *[_type == "releaseVersion"] {
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
  },
  "events": *[_type == "releaseEvent"] {
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
    citations[] {
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
    },
    "changes": select(
      editorialReview.status == "approved" =>
        changes[change->editorialReview.status == "approved"] {
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
        "changeId": change._ref,
        "changeTitle": change->title,
        citations[] {
          "_key": _key,
          locator,
          "sourceId": source._ref,
          "sourceUrl": source->canonicalUrl,
          "sourceTitle": source->title,
          "publisher": source->publisher,
          "author": source->author,
          "publicationDate": source->publishedAt,
          "accessedDate": source->accessedAt,
          "archiveUrl": source->archiveUrl,
          "sourceClass": source->sourceClass
        }
      },
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
  },
  "builds": *[_type == "releaseBuild"] {
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
    citations[] {
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
    },
    "changes": select(
      editorialReview.status == "approved" =>
        changes[
          change->editorialReview.status == "approved" ||
          releaseChange->editorialReview.status == "approved"
        ] {
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
        citations[] {
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
          "accessedDate": coalesce(
            source->accessedAt,
            source->accessedDate
          ),
          "archiveUrl": source->archiveUrl,
          "sourceClass": source->sourceClass
        }
      },
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
  },
  "changes": *[
    _type == "releaseChange" &&
    editorialReview.status == "approved"
  ] {
    "_id": _id,
    "_updatedAt": _updatedAt,
    title,
    category,
    "summary": canonicalSummary,
    citations[] {
      "_key": _key,
      locator,
      "sourceId": source._ref,
      "sourceUrl": source->canonicalUrl,
      "sourceTitle": source->title,
      "publisher": source->publisher,
      "author": source->author,
      "publicationDate": source->publishedAt,
      "accessedDate": source->accessedAt,
      "archiveUrl": source->archiveUrl,
      "sourceClass": source->sourceClass
    }
  },
  "auditBatches": *[_type == "auditBatch"] {
    "_id": _id,
    title,
    status,
    "verificationDate": coalesce(verifiedAt, verificationDate),
    "methodology": pt::text(methodology),
    "scope": coalesce(platforms[]->slug.current, []),
    "snapshotIdentity": coalesce(snapshotDigest, snapshotIdentity),
    commitSha,
    citations[] {
      "_key": _key,
      locator,
      "sourceId": source._ref,
      "sourceUrl": source->canonicalUrl,
      "sourceTitle": source->title,
      "publisher": source->publisher,
      "author": source->author,
      "publicationDate": source->publishedAt,
      "accessedDate": source->accessedAt,
      "archiveUrl": source->archiveUrl,
      "sourceClass": source->sourceClass
    }
  },
  "corrections": *[
    _type == "correction" &&
    status == "published" &&
    editorialReview.status == "approved"
  ] {
    "_id": _id,
    title,
    status,
    correctionDate,
    publishedAt,
    "reasonCategory": reasonCategory,
    "reason": publicSummary,
    "affectedTargetIds": affectedClaims[].affectedDocument._ref,
    citations[] {
      "_key": _key,
      locator,
      "sourceId": source._ref,
      "sourceUrl": source->canonicalUrl,
      "sourceTitle": source->title,
      "publisher": source->publisher,
      "author": source->author,
      "publicationDate": source->publishedAt,
      "accessedDate": source->accessedAt,
      "archiveUrl": source->archiveUrl,
      "sourceClass": source->sourceClass
    },
    affectedClaims[] {
      "_key": _key,
      citations[] {
        "_key": _key,
        locator,
        "sourceId": source._ref,
        "sourceUrl": source->canonicalUrl,
        "sourceTitle": source->title,
        "publisher": source->publisher,
        "author": source->author,
        "publicationDate": source->publishedAt,
        "accessedDate": source->accessedAt,
        "archiveUrl": source->archiveUrl,
        "sourceClass": source->sourceClass
      }
    }
  }
}
`;
