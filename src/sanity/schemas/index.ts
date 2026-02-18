import { platform } from "./platform";
import { releaseTrain } from "./releaseTrain";
import { releaseVersion } from "./releaseVersion";
import { betaMilestone } from "./betaMilestone";

export const schemaTypes = [
  platform,
  releaseTrain,
  releaseVersion,
  betaMilestone,
];
