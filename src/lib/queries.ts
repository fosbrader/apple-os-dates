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
    version,
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
    version,
    releaseNotesUrl,
    keyFeatures,
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

// Active betas (no public release date yet)
export const activeBetasQuery = groq`
  *[_type == "releaseVersion" && !defined(publicReleaseDate)] {
    _id,
    version,
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

// Recent releases (last 10 with public release dates)
export const recentReleasesQuery = groq`
  *[_type == "releaseVersion" && defined(publicReleaseDate)] | order(publicReleaseDate desc) [0...10] {
    _id,
    version,
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
    version,
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
    version,
    publicReleaseDate,
    milestones,
    releaseTrain-> {
      majorVersion,
      platform-> {
        name,
        slug,
        color
      }
    }
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
