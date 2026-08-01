import {
  createReleaseOpenGraphImage,
  releaseOpenGraphImageSize,
} from "@/lib/opengraph-image";
import { eventOgProps } from "@/lib/release-og";
import {
  getReleaseEventDetail,
  getVersionDetail,
} from "@/lib/sanity.fetch";

export const size = releaseOpenGraphImageSize;
export const contentType = "image/png";
export const alt =
  "Version Record release appearance record with release-cycle timeline";

export default async function Image({
  params,
}: {
  params: Promise<{
    platform: string;
    version: string;
    event: string;
  }>;
}) {
  const { platform, version, event } = await params;
  const [release, releaseEvent] = await Promise.all([
    getVersionDetail(platform, version),
    getReleaseEventDetail(platform, version, event),
  ]);

  return createReleaseOpenGraphImage(
    release && releaseEvent
      ? eventOgProps(release, releaseEvent)
      : {
          platformName: platform,
          heroSuffix: `${version} ${event.replace(/-/g, " ")}`,
          statusLine: "Release appearance record",
          detailLine: "SOURCE-BACKED RELEASE ARCHIVE",
          cycle: [],
        },
  );
}
