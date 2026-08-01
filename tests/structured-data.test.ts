import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { RESEARCH_EXPORT_LICENSE_URL } from "../src/lib/research/types";
import {
  appleReleaseDatasetId,
  factualDataset,
  versionRecordOrganization,
} from "../src/lib/structured-data";

test("factual datasets include a typed creator, publisher, and scoped license", () => {
  const dataset = factualDataset({
    "@id": "https://www.versionrecord.com/apple/ios/#release-dataset",
    url: "https://www.versionrecord.com/apple/ios/",
    name: "iOS Release History",
    description:
      "Factual structured records of iOS versions, channel appearances, builds, and public-release dates.",
    isPartOf: appleReleaseDatasetId(),
  });
  const organization = versionRecordOrganization();

  assert.equal(dataset["@type"], "Dataset");
  assert.deepEqual(dataset.creator, organization);
  assert.deepEqual(dataset.publisher, organization);
  assert.equal(dataset.license, RESEARCH_EXPORT_LICENSE_URL);
  assert.equal(typeof dataset.isPartOf, "string");
  assert.match(dataset.isPartOf as string, /\/apple\/#release-dataset$/);
});

test("factual dataset ownership and licensing fields cannot be overridden", () => {
  const dataset = factualDataset({
    name: "Override guard",
    description: "A runtime regression fixture.",
    "@type": "Thing",
    creator: { "@type": "Person", name: "Untrusted caller" },
    publisher: "Untrusted caller",
    license: "https://example.com/restrictive-license",
  } as unknown as Parameters<typeof factualDataset>[0]);
  const organization = versionRecordOrganization();

  assert.equal(dataset["@type"], "Dataset");
  assert.deepEqual(dataset.creator, organization);
  assert.deepEqual(dataset.publisher, organization);
  assert.equal(dataset.license, RESEARCH_EXPORT_LICENSE_URL);
});

test("source code routes Dataset markup through the complete factual dataset factory", () => {
  const sourceRoot = path.resolve(process.cwd(), "src");
  const factoryPath = path.resolve(
    sourceRoot,
    "lib/structured-data.ts",
  );
  const sourceFiles = readdirSync(sourceRoot, {
    recursive: true,
    withFileTypes: true,
  })
    .filter(
      (entry) =>
        entry.isFile() &&
        /\.(?:[cm]?[jt]sx?)$/.test(entry.name),
    )
    .map((entry) => path.join(entry.parentPath, entry.name))
    .filter((file) => path.resolve(file) !== factoryPath);
  const directDatasetNodes = sourceFiles.filter((file) =>
    /["']@type["']\s*:\s*["']Dataset["']/.test(
      readFileSync(file, "utf8"),
    ),
  );

  assert.deepEqual(
    directDatasetNodes.map((file) => path.relative(sourceRoot, file)),
    [],
    "Dataset literals can bypass the required creator, publisher, and license metadata",
  );
});
