import * as fs from "node:fs";
import * as path from "node:path";
import {
  validateReleaseData,
  type ReleaseData,
} from "./lib/release-data-validation";

const seedPath = path.join(__dirname, "seed-data.json");
const data = JSON.parse(fs.readFileSync(seedPath, "utf8")) as ReleaseData;
const issues = validateReleaseData(data);

for (const issue of issues) {
  const output = `[${issue.severity.toUpperCase()}] ${issue.code} ${issue.path}: ${issue.message}`;
  if (issue.severity === "error") console.error(output);
  else console.warn(output);
}

const errors = issues.filter((issue) => issue.severity === "error");
if (errors.length) {
  throw new Error(
    `Release data failed validation with ${errors.length} error(s).`,
  );
}

console.log(
  `Validated ${data.releaseVersions.length} versions and ${data.releaseVersions.reduce((sum, version) => sum + version.milestones.length, 0)} milestones.`,
);
