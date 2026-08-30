import "server-only";
import { client } from "./client";

/**
 * Vercel uses the deployment-specific read token. Local operations retain the
 * established read-only SANITY_API_TOKEN fallback documented by this project.
 */
const readToken =
  process.env.SANITY_API_READ_TOKEN?.trim() ||
  process.env.SANITY_API_TOKEN?.trim();

export const serverReadClient = client.withConfig({
  ...(readToken ? { token: readToken } : {}),
  perspective: "published",
  useCdn: !readToken,
});
