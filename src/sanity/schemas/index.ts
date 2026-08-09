import { platform } from "./platform";
import { releaseTrain } from "./releaseTrain";
import { releaseVersion } from "./releaseVersion";
import { betaMilestone } from "./betaMilestone";
import { source } from "./source";
import { auditBatch } from "./auditBatch";
import {
  blockContent,
  citation,
  editorialImage,
  editorialReview,
  releaseApplicability,
  seoMetadata,
} from "./editorialTypes";
import { changeOccurrence, releaseChange } from "./releaseChange";
import { releaseBuild } from "./releaseBuild";
import { releaseEvent } from "./releaseEvent";
import { correction, correctionClaim } from "./correction";
import { sitePage, siteSettings } from "./siteContent";

export const schemaTypes = [
  // Shared objects must be registered before documents that reference them.
  citation,
  releaseApplicability,
  editorialReview,
  seoMetadata,
  editorialImage,
  blockContent,
  changeOccurrence,
  correctionClaim,

  // Existing chronology.
  platform,
  releaseTrain,
  releaseVersion,
  betaMilestone,

  // Source-backed release archive.
  source,
  auditBatch,
  releaseChange,
  releaseBuild,
  releaseEvent,
  correction,
  sitePage,
  siteSettings,
];
