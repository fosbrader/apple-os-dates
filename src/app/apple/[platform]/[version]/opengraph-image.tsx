import {
  createReleaseOpenGraphImage,
  releaseOpenGraphImageSize,
} from "@/lib/opengraph-image";
import { versionOgProps } from "@/lib/release-og";
import { getVersionDetail } from "@/lib/sanity.fetch";

export const size = releaseOpenGraphImageSize;
export const contentType = "image/png";
export const alt =
  "Version Record release record with release-cycle timeline";

export default async function Image({
  params,
}: {
  params: Promise<{ platform: string; version: string }>;
}) {
  const { platform, version } = await params;
  const detail = await getVersionDetail(platform, version);

  return createReleaseOpenGraphImage(
    detail
      ? versionOgProps(detail)
      : {
          platformName: platform,
          heroSuffix: version,
          statusLine: "Release record",
          detailLine: "SOURCE-BACKED RELEASE ARCHIVE",
          cycle: [],
        },
  );
}
