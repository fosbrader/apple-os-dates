import {
  createReleaseOpenGraphImage,
  releaseOpenGraphImageSize,
} from "@/lib/opengraph-image";
import { buildOgProps } from "@/lib/release-og";
import { getReleaseBuildDetail } from "@/lib/sanity.fetch";

export const size = releaseOpenGraphImageSize;
export const contentType = "image/png";
export const alt =
  "Version Record verified build record with channel appearances";

export default async function Image({
  params,
}: {
  params: Promise<{
    platform: string;
    version: string;
    build: string;
  }>;
}) {
  const { platform, version, build } = await params;
  const detail = await getReleaseBuildDetail(platform, version, build);

  return createReleaseOpenGraphImage(
    detail
      ? buildOgProps(detail)
      : {
          platformName: platform,
          heroSuffix: `Build ${build.toUpperCase()}`,
          statusLine: `${platform} ${version}`,
          detailLine: "SOURCE-BACKED RELEASE ARCHIVE",
          cycle: [],
        },
  );
}
