import { getAllPlatforms } from "@/lib/sanity.fetch";

export { default, generateMetadata } from "../../[platform]/page";

export async function generateStaticParams() {
  const platforms = await getAllPlatforms();
  return platforms.map((platform) => ({
    platform: platform.slug.current,
  }));
}
