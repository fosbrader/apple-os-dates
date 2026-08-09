import { getAllPlatforms, getTimelineData } from "@/lib/sanity.fetch";
import { buildTimelineViewModel } from "@/lib/view-models/timeline";

/**
 * Keep the page's small, crawlable archive summary and the interactive
 * timeline endpoint on the same normalized data model.
 */
export async function getTimelinePageData() {
  const [versions, platforms] = await Promise.all([
    getTimelineData(),
    getAllPlatforms(),
  ]);

  return {
    versions,
    timeline: buildTimelineViewModel(versions, platforms),
  };
}
