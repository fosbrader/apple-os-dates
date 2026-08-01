import { groq } from "next-sanity";

// All platforms ordered by sortOrder
export const allPlatformsQuery = groq`
  *[_type == "platform"] | order(sortOrder asc) {
    _id,
    name,
    slug,
    color,
    sortOrder
  }
`;

// All versions for a platform (by slug)
export const platformVersionsQuery = groq`
  *[_type == "releaseVersion" && releaseTrain->platform->slug.current == $platform] | order(version desc) {
    _id,
    "updatedAt": _updatedAt,
    version,
    releaseStatus,
    provenanceStatus,
    publicReleaseDate,
    versionNote,
    milestones,
    "milestoneCount": count(milestones),
    "firstBetaDate": milestones[0].date,
    "lastMilestoneDate": milestones[count(milestones) - 1].date,
    releaseTrain-> {
      _id,
      displayName,
      majorVersion,
      platform-> {
        _id,
        name,
        slug,
        color,
        sortOrder
      }
    }
  }
`;

// Single version with all milestones
export const versionDetailQuery = groq`
  *[_type == "releaseVersion" && releaseTrain->platform->slug.current == $platform && version == $version][0] {
    _id,
    "updatedAt": _updatedAt,
    version,
    releaseNotesUrl,
    keyFeatures,
    releaseStatus,
    publicReleaseDate,
    versionNote,
    overview[] {
      ...,
      asset-> {
        url,
        metadata {
          dimensions
        }
      },
      sourceCitation {
        _key,
        locator,
        "context": note,
        quotedText,
        source-> {
          _id,
          title,
          canonicalUrl,
          publisher,
          author,
          publishedAt,
          accessedAt,
          archiveUrl,
          sourceClass
        }
      },
      markDefs[] {
        ...,
        "context": note,
        source-> {
          _id,
          title,
          canonicalUrl,
          publisher,
          author,
          publishedAt,
          accessedAt,
          archiveUrl,
          sourceClass
        }
      }
    },
    citations[] {
      _key,
      locator,
      "context": note,
      quotedText,
      source-> {
        _id,
        title,
        canonicalUrl,
        publisher,
        author,
        publishedAt,
        accessedAt,
        archiveUrl,
        sourceClass
      }
    },
    provenanceStatus,
    "auditBatches": auditBatches[]-> {
      _id,
      title,
      verifiedAt,
      "scopeSummary": summary
    },
    editorialReview {
      status,
      reviewedAt
    },
    milestones,
    releaseTrain-> {
      _id,
      displayName,
      majorVersion,
      platform-> {
        _id,
        name,
        slug,
        color,
        sortOrder
      }
    }
  }
`;

// Active betas. Legacy records infer status from the absence of a public date.
export const activeBetasQuery = groq`
  *[
    _type == "releaseVersion" &&
    (
      releaseStatus == "active" ||
      (!defined(releaseStatus) && !defined(publicReleaseDate))
    )
  ] {
    _id,
    version,
    releaseStatus,
    publicReleaseDate,
    versionNote,
    milestones,
    releaseTrain-> {
      _id,
      displayName,
      majorVersion,
      platform-> {
        _id,
        name,
        slug,
        color,
        sortOrder
      }
    }
  } | order(releaseTrain->platform->sortOrder asc)
`;

// Recent releases. Explicitly superseded cycles never qualify as released.
export const recentReleasesQuery = groq`
  *[
    _type == "releaseVersion" &&
    defined(publicReleaseDate) &&
    (
      releaseStatus == "released" ||
      !defined(releaseStatus)
    )
  ] | order(publicReleaseDate desc) [0...10] {
    _id,
    version,
    releaseStatus,
    publicReleaseDate,
    versionNote,
    milestones,
    "milestoneCount": count(milestones),
    releaseTrain-> {
      _id,
      displayName,
      majorVersion,
      platform-> {
        _id,
        name,
        slug,
        color,
        sortOrder
      }
    }
  }
`;

// All data for timeline visualization
export const timelineDataQuery = groq`
  *[_type == "releaseVersion"] {
    _id,
    "updatedAt": _updatedAt,
    version,
    releaseStatus,
    publicReleaseDate,
    milestones,
    releaseTrain-> {
      _id,
      displayName,
      majorVersion,
      platform-> {
        _id,
        name,
        slug,
        color,
        sortOrder
      }
    }
  } | order(releaseTrain->platform->sortOrder asc, version desc)
`;

// Analytics: all versions with milestones for computation
export const analyticsDataQuery = groq`
  *[_type == "releaseVersion"] {
    _id,
    "updatedAt": _updatedAt,
    version,
    releaseStatus,
    publicReleaseDate,
    milestones,
    releaseTrain-> {
      _id,
      displayName,
      majorVersion,
      platform-> {
        _id,
        name,
        slug,
        color,
        sortOrder
      }
    }
  }
`;

// Completed releases used by the version-detail comparison and prediction UI.
export const completedVersionsQuery = groq`
  *[
    _type == "releaseVersion" &&
    defined(publicReleaseDate) &&
    (releaseStatus == "released" || !defined(releaseStatus)) &&
    releaseTrain->platform->slug.current == $platform &&
    version != $version
  ] {
    _id,
    version,
    releaseStatus,
    publicReleaseDate,
    milestones,
    releaseTrain-> {
      _id,
      displayName,
      majorVersion,
      platform-> {
        _id,
        name,
        slug,
        color,
        sortOrder
      }
    }
  }
`;

// Lightweight index for static params and sitemap generation.
export const allVersionRoutesQuery = groq`
  *[
    _type == "releaseVersion" &&
    defined(version) &&
    defined(releaseTrain->platform->slug.current)
  ] {
    "platform": releaseTrain->platform->slug.current,
    version,
    "updatedAt": _updatedAt
  }
`;

// Release trains for a platform
export const platformTrainsQuery = groq`
  *[_type == "releaseTrain" && platform->slug.current == $platform] | order(majorVersion desc) {
    _id,
    displayName,
    majorVersion,
    releaseYear,
    platform-> {
      _id,
      name,
      slug,
      color,
      sortOrder
    }
  }
`;

// First-class channel appearances for a version. The projection intentionally
// normalizes schema names to the long-lived app read model.
export const versionEventsQuery = groq`
  *[
    _type == "releaseEvent" &&
    releaseVersion->releaseTrain->platform->slug.current == $platform &&
    releaseVersion->version == $version
  ] | order(appearanceDate asc, sequence asc, label asc) {
    _id,
    "updatedAt": _updatedAt,
    "slug": routeAlias,
    label,
    "normalizedChannel": select(
      channel == "developerBeta" => "developer",
      channel == "publicBeta" => "publicBeta",
      channel == "releaseCandidate" => "releaseCandidate",
      channel == "goldenMaster" => "gm",
      channel == "public" => "public",
      channel == "securityResponse" => "securityResponse",
      channel == "recovery" => "recovery",
      "other"
    ),
    "date": appearanceDate,
    versionLabelAtAppearance,
    sequence,
    availabilityState,
    "note": coalesce(
      select(editorialReview.status == "approved" => summary),
      legacyNote
    ),
    "summary": select(
      editorialReview.status == "approved" => summary
    ),
    "deviceScope": coalesce(applicability.deviceFamilies, []) + coalesce(applicability.models, []),
    "regionScope": applicability.regions,
    "languageScope": applicability.languages,
    "audienceScope": applicability.audiences,
    isRevision,
    closesReleaseCycle,
    legacySourceId,
    legacyNote,
    provenanceStatus,
    editorialReview {
      status,
      reviewedAt
    },
    isIndexable,
    seo {
      title,
      description,
      noIndex
    },
    build-> {
      _id,
      buildNumber,
      "displayBuildNumber": buildNumber,
      slug,
      availabilityState,
      provenanceStatus,
      "indexEligible": isIndexable,
      editorialReview {
        status,
        reviewedAt
      }
    },
    articleBody[] {
      ...,
      asset-> {
        url,
        metadata {
          dimensions
        }
      },
      sourceCitation {
        _key,
        locator,
        "context": note,
        quotedText,
        source-> {
          _id,
          title,
          canonicalUrl,
          publisher,
          author,
          publishedAt,
          accessedAt,
          archiveUrl,
          sourceClass
        }
      },
      markDefs[] {
        ...,
        "context": note,
        source-> {
          _id,
          title,
          canonicalUrl,
          publisher,
          author,
          publishedAt,
          accessedAt,
          archiveUrl,
          sourceClass
        }
      }
    },
    citations[] {
      _key,
      locator,
      "context": note,
      quotedText,
      source-> {
        _id,
        title,
        canonicalUrl,
        publisher,
        author,
        publishedAt,
        accessedAt,
        archiveUrl,
        sourceClass
      }
    },
    "auditBatches": auditBatches[]-> {
      _id,
      title,
      verifiedAt,
      "scopeSummary": summary
    },
    changes[change->editorialReview.status == "approved"] {
      _key,
      action,
      inheritance,
      summary,
      documentedStatus,
      evidenceState,
      verificationMethod,
      "applicability": coalesce(applicability.deviceFamilies, []) +
        coalesce(applicability.models, []) +
        coalesce(applicability.regions, []) +
        coalesce(applicability.languages, []) +
        coalesce(applicability.audiences, []),
      publicContributorCredit,
      change-> {
        _id,
        title,
        slug,
        category,
        "summary": canonicalSummary
      },
      citations[] {
        _key,
        locator,
        "context": note,
        quotedText,
        source-> {
          _id,
          title,
          canonicalUrl,
          publisher,
          author,
          publishedAt,
          accessedAt,
          archiveUrl,
          sourceClass
        }
      }
    },
    "relatedEvents": relatedEvents[]-> {
      _id,
      label,
      "date": appearanceDate
    }
  }
`;

// Structured changes attached anywhere in a version. Event occurrences cover
// appearances whose build is unresolved; build occurrences cover verified
// builds. The fetch layer adds target context and collision-proof keys.
export const versionChangesQuery = groq`
  {
    "eventTargets": *[
      _type == "releaseEvent" &&
      releaseVersion->releaseTrain->platform->slug.current == $platform &&
      releaseVersion->version == $version &&
      editorialReview.status == "approved" &&
      count(changes[change->editorialReview.status == "approved"]) > 0
    ] | order(appearanceDate asc, sequence asc, label asc) {
      _id,
      label,
      "slug": routeAlias,
      "date": appearanceDate,
      changes[change->editorialReview.status == "approved"] {
        _key,
        action,
        inheritance,
        summary,
        documentedStatus,
        evidenceState,
        verificationMethod,
        "applicability": coalesce(applicability.deviceFamilies, []) +
          coalesce(applicability.models, []) +
          coalesce(applicability.regions, []) +
          coalesce(applicability.languages, []) +
          coalesce(applicability.audiences, []),
        publicContributorCredit,
        change-> {
          _id,
          title,
          slug,
          category,
          "summary": canonicalSummary
        },
        citations[] {
          _key,
          locator,
          "context": note,
          quotedText,
          source-> {
            _id,
            title,
            canonicalUrl,
            publisher,
            author,
            publishedAt,
            accessedAt,
            archiveUrl,
            sourceClass
          }
        }
      }
    },
    "buildTargets": *[
      _type == "releaseBuild" &&
      releaseVersion->releaseTrain->platform->slug.current == $platform &&
      releaseVersion->version == $version &&
      editorialReview.status == "approved" &&
      count(changes[change->editorialReview.status == "approved"]) > 0
    ] | order(buildNumber asc) {
      _id,
      buildNumber,
      slug,
      changes[change->editorialReview.status == "approved"] {
        _key,
        action,
        inheritance,
        summary,
        documentedStatus,
        evidenceState,
        verificationMethod,
        "applicability": coalesce(applicability.deviceFamilies, []) +
          coalesce(applicability.models, []) +
          coalesce(applicability.regions, []) +
          coalesce(applicability.languages, []) +
          coalesce(applicability.audiences, []),
        publicContributorCredit,
        change-> {
          _id,
          title,
          slug,
          category,
          "summary": canonicalSummary
        },
        citations[] {
          _key,
          locator,
          "context": note,
          quotedText,
          source-> {
            _id,
            title,
            canonicalUrl,
            publisher,
            author,
            publishedAt,
            accessedAt,
            archiveUrl,
            sourceClass
          }
        }
      }
    }
  }
`;

// Minimal first-class event projection used to keep the legacy milestone-shaped
// analytics/read model working while releaseEvent is the canonical CMS record.
export const releaseEventsForVersionsQuery = groq`
  *[
    _type == "releaseEvent" &&
    releaseVersion._ref in $releaseVersionIds
  ] | order(appearanceDate asc, sequence asc, label asc) {
    _id,
    "updatedAt": _updatedAt,
    "releaseVersionId": releaseVersion._ref,
    "slug": routeAlias,
    label,
    "normalizedChannel": select(
      channel == "developerBeta" => "developer",
      channel == "publicBeta" => "publicBeta",
      channel == "releaseCandidate" => "releaseCandidate",
      channel == "goldenMaster" => "gm",
      channel == "public" => "public",
      channel == "securityResponse" => "securityResponse",
      channel == "recovery" => "recovery",
      "other"
    ),
    "date": appearanceDate,
    sequence,
    availabilityState,
    "note": coalesce(
      select(editorialReview.status == "approved" => summary),
      legacyNote
    ),
    "deviceScope": coalesce(applicability.deviceFamilies, []) +
      coalesce(applicability.models, []),
    "regionScope": applicability.regions,
    "languageScope": applicability.languages,
    "audienceScope": applicability.audiences,
    isRevision,
    legacySourceId,
    citations[] {
      _key,
      locator,
      "context": note,
      source-> {
        _id,
        title,
        canonicalUrl,
        publisher,
        author,
        publishedAt,
        accessedAt,
        archiveUrl,
        sourceClass
      }
    },
    build-> {
      _id,
      buildNumber,
      "displayBuildNumber": buildNumber,
      slug,
      availabilityState,
      provenanceStatus,
      "indexEligible": isIndexable
    }
  }
`;

export const releaseEventDetailQuery = groq`
  *[
    _type == "releaseEvent" &&
    releaseVersion->releaseTrain->platform->slug.current == $platform &&
    releaseVersion->version == $version &&
    routeAlias.current == $event
  ][0] {
    _id,
    "updatedAt": _updatedAt,
    "slug": routeAlias,
    label,
    "normalizedChannel": select(
      channel == "developerBeta" => "developer",
      channel == "publicBeta" => "publicBeta",
      channel == "releaseCandidate" => "releaseCandidate",
      channel == "goldenMaster" => "gm",
      channel == "public" => "public",
      channel == "securityResponse" => "securityResponse",
      channel == "recovery" => "recovery",
      "other"
    ),
    "date": appearanceDate,
    versionLabelAtAppearance,
    sequence,
    availabilityState,
    "note": coalesce(
      select(editorialReview.status == "approved" => summary),
      legacyNote
    ),
    "summary": select(
      editorialReview.status == "approved" => summary
    ),
    "deviceScope": coalesce(applicability.deviceFamilies, []) + coalesce(applicability.models, []),
    "regionScope": applicability.regions,
    "languageScope": applicability.languages,
    "audienceScope": applicability.audiences,
    isRevision,
    closesReleaseCycle,
    legacySourceId,
    legacyNote,
    provenanceStatus,
    editorialReview {
      status,
      reviewedAt
    },
    isIndexable,
    seo {
      title,
      description,
      noIndex
    },
    build-> {
      _id,
      buildNumber,
      "displayBuildNumber": buildNumber,
      slug,
      availabilityState,
      provenanceStatus,
      "indexEligible": isIndexable,
      editorialReview {
        status,
        reviewedAt
      }
    },
    articleBody[] {
      ...,
      asset-> {
        url,
        metadata {
          dimensions
        }
      },
      sourceCitation {
        _key,
        locator,
        "context": note,
        quotedText,
        source-> {
          _id,
          title,
          canonicalUrl,
          publisher,
          author,
          publishedAt,
          accessedAt,
          archiveUrl,
          sourceClass
        }
      },
      markDefs[] {
        ...,
        "context": note,
        source-> {
          _id,
          title,
          canonicalUrl,
          publisher,
          author,
          publishedAt,
          accessedAt,
          archiveUrl,
          sourceClass
        }
      }
    },
    citations[] {
      _key,
      locator,
      "context": note,
      quotedText,
      source-> {
        _id,
        title,
        canonicalUrl,
        publisher,
        author,
        publishedAt,
        accessedAt,
        archiveUrl,
        sourceClass
      }
    },
    "auditBatches": auditBatches[]-> {
      _id,
      title,
      verifiedAt,
      "scopeSummary": summary
    },
    changes[change->editorialReview.status == "approved"] {
      _key,
      action,
      inheritance,
      summary,
      documentedStatus,
      evidenceState,
      verificationMethod,
      "applicability": coalesce(applicability.deviceFamilies, []) +
        coalesce(applicability.models, []) +
        coalesce(applicability.regions, []) +
        coalesce(applicability.languages, []) +
        coalesce(applicability.audiences, []),
      publicContributorCredit,
      change-> {
        _id,
        title,
        slug,
        category,
        "summary": canonicalSummary
      },
      citations[] {
        _key,
        locator,
        "context": note,
        quotedText,
        source-> {
          _id,
          title,
          canonicalUrl,
          publisher,
          author,
          publishedAt,
          accessedAt,
          archiveUrl,
          sourceClass
        }
      }
    }
  }
`;

export const releaseBuildDetailQuery = groq`
  *[
    _type == "releaseBuild" &&
    releaseVersion->releaseTrain->platform->slug.current == $platform &&
    releaseVersion->version == $version &&
    slug.current == $build
  ][0] {
    _id,
    "updatedAt": _updatedAt,
    buildNumber,
    "displayBuildNumber": buildNumber,
    slug,
    availabilityState,
    summary,
    provenanceStatus,
    "indexEligible": isIndexable,
    seo {
      title,
      description,
      noIndex
    },
    editorialReview {
      status,
      reviewedAt
    },
    "deviceScope": coalesce(applicability.deviceFamilies, []) + coalesce(applicability.models, []),
    "regionScope": applicability.regions,
    "languageScope": applicability.languages,
    "audienceScope": applicability.audiences,
    releaseVersion-> {
      _id,
      version,
      releaseStatus,
      releaseTrain-> {
        _id,
        displayName,
        majorVersion,
        releaseYear,
        platform-> {
          _id,
          name,
          slug,
          color,
          sortOrder
        }
      }
    },
    platform-> {
      _id,
      name,
      slug,
      color,
      sortOrder
    },
    articleBody[] {
      ...,
      asset-> {
        url,
        metadata {
          dimensions
        }
      },
      sourceCitation {
        _key,
        locator,
        "context": note,
        quotedText,
        source-> {
          _id,
          title,
          canonicalUrl,
          publisher,
          author,
          publishedAt,
          accessedAt,
          archiveUrl,
          sourceClass
        }
      },
      markDefs[] {
        ...,
        "context": note,
        source-> {
          _id,
          title,
          canonicalUrl,
          publisher,
          author,
          publishedAt,
          accessedAt,
          archiveUrl,
          sourceClass
        }
      }
    },
    citations[] {
      _key,
      locator,
      "context": note,
      quotedText,
      source-> {
        _id,
        title,
        canonicalUrl,
        publisher,
        author,
        publishedAt,
        accessedAt,
        archiveUrl,
        sourceClass
      }
    },
    "auditBatches": auditBatches[]-> {
      _id,
      title,
      verifiedAt,
      "scopeSummary": summary
    },
    changes[change->editorialReview.status == "approved"] {
      _key,
      action,
      inheritance,
      summary,
      documentedStatus,
      evidenceState,
      verificationMethod,
      "applicability": coalesce(applicability.deviceFamilies, []) +
        coalesce(applicability.models, []) +
        coalesce(applicability.regions, []) +
        coalesce(applicability.languages, []) +
        coalesce(applicability.audiences, []),
      publicContributorCredit,
      change-> {
        _id,
        title,
        slug,
        category,
        "summary": canonicalSummary
      },
      citations[] {
        _key,
        locator,
        "context": note,
        quotedText,
        source-> {
          _id,
          title,
          canonicalUrl,
          publisher,
          author,
          publishedAt,
          accessedAt,
          archiveUrl,
          sourceClass
        }
      }
    },
    "events": *[
      _type == "releaseEvent" &&
      build._ref == ^._id
    ] | order(appearanceDate asc) {
      _id,
      "slug": routeAlias,
      label,
      "normalizedChannel": select(
        channel == "developerBeta" => "developer",
        channel == "publicBeta" => "publicBeta",
        channel == "releaseCandidate" => "releaseCandidate",
        channel == "goldenMaster" => "gm",
        channel == "public" => "public",
        channel == "securityResponse" => "securityResponse",
        channel == "recovery" => "recovery",
        "other"
      ),
      "date": appearanceDate,
      availabilityState,
      versionLabelAtAppearance,
      isRevision,
      provenanceStatus,
      isIndexable,
      citations[] {
        _key,
        locator,
        "context": note,
        quotedText,
        source-> {
          _id,
          title,
          canonicalUrl,
          publisher,
          author,
          publishedAt,
          accessedAt,
          archiveUrl,
          sourceClass
        }
      }
    }
  }
`;

export const allBuildRoutesQuery = groq`
  *[
    _type == "releaseBuild" &&
    defined(slug.current) &&
    defined(releaseVersion->version) &&
    defined(releaseVersion->releaseTrain->platform->slug.current)
  ] {
    "platform": releaseVersion->releaseTrain->platform->slug.current,
    "version": releaseVersion->version,
    "build": slug.current,
    "updatedAt": _updatedAt,
    "indexEligible": isIndexable == true &&
      editorialReview.status == "approved" &&
      seo.noIndex != true
  }
`;

export const allEventRoutesQuery = groq`
  *[
    _type == "releaseEvent" &&
    defined(routeAlias.current) &&
    defined(releaseVersion->version) &&
    defined(releaseVersion->releaseTrain->platform->slug.current)
  ] {
    "platform": releaseVersion->releaseTrain->platform->slug.current,
    "version": releaseVersion->version,
    "event": routeAlias.current,
    "build": build->slug.current,
    "updatedAt": _updatedAt,
    "indexEligible": isIndexable == true &&
      editorialReview.status == "approved" &&
      seo.noIndex != true
  }
`;

export const publishedCorrectionsQuery = groq`
  *[
    _type == "correction" &&
    status == "published" &&
    editorialReview.status == "approved"
  ] | order(correctionDate desc) {
    _id,
    "updatedAt": _updatedAt,
    title,
    slug,
    correctionDate,
    reasonCategory,
    publicSummary,
    publishedAt,
    affectedClaims[] {
      _key,
      claim,
      previousValue,
      correctedValue,
      resolution,
      affectedDocument-> {
        _id,
        _type,
        title,
        version,
        label,
        buildNumber
      },
      citations[] {
        _key,
        locator,
        "context": note,
        quotedText,
        source-> {
          _id,
          title,
          canonicalUrl,
          publisher,
          author,
          publishedAt,
          accessedAt,
          archiveUrl,
          sourceClass
        }
      }
    },
    citations[] {
      _key,
      locator,
      "context": note,
      quotedText,
      source-> {
        _id,
        title,
        canonicalUrl,
        publisher,
        author,
        publishedAt,
        accessedAt,
        archiveUrl,
        sourceClass
      }
    }
  }
`;
