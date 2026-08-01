import { RESEARCH_EXPORT_LICENSE_URL } from "@/lib/research/types";
import { absoluteUrl, siteName, siteXUrl } from "@/lib/site";

type StructuredDataPrimitive = string | number | boolean | null;

export type StructuredDataValue =
  | StructuredDataPrimitive
  | StructuredDataValue[]
  | { [key: string]: StructuredDataValue | undefined };

interface FactualDatasetInput {
  name: string;
  description: string;
  "@type"?: never;
  creator?: never;
  publisher?: never;
  license?: never;
  isPartOf?: string;
  [key: string]: StructuredDataValue | undefined;
}

type FactualDatasetOutput<T extends FactualDatasetInput> = Omit<
  T,
  "@type" | "creator" | "publisher" | "license"
> & {
  "@type": "Dataset";
  creator: ReturnType<typeof versionRecordOrganization>;
  publisher: ReturnType<typeof versionRecordOrganization>;
  license: string;
};

export function appleReleaseDatasetId(): string {
  return `${absoluteUrl("/apple/")}#release-dataset`;
}

export function versionRecordOrganization() {
  return {
    "@type": "Organization" as const,
    "@id": `${absoluteUrl("/")}#organization`,
    name: siteName,
    url: absoluteUrl("/"),
    sameAs: [siteXUrl],
  };
}

/**
 * Use only for factual structured records. Editorial prose, third-party
 * material, design, media, logos, and trademarks are outside this license.
 */
export function factualDataset<const T extends FactualDatasetInput>(
  input: T
): FactualDatasetOutput<T> {
  return {
    ...input,
    "@type": "Dataset" as const,
    creator: versionRecordOrganization(),
    publisher: versionRecordOrganization(),
    license: RESEARCH_EXPORT_LICENSE_URL,
  } as FactualDatasetOutput<T>;
}
