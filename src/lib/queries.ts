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
    publicReleaseDate,
    versionNote,
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
    count(milestones) >= 2 &&
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
