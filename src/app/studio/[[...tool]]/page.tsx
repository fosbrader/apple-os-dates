import type { Metadata } from "next";
import { metadata as studioMetadata, NextStudio } from "next-sanity/studio";
import config from "@/sanity/sanity.config";

export const dynamic = "force-static";

export const metadata: Metadata = {
  ...studioMetadata,
  robots: {
    index: false,
    follow: false,
  },
};

export { viewport } from "next-sanity/studio";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
