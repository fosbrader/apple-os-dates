import {
  createPublicApiSearchResponse,
  enforcePublicApiRateLimit,
  publicApiErrorResponse,
  publicApiJson,
  publicApiOptions,
  validatePublicApiSearchRequest,
} from "@/lib/public-api";
import { getResearchSearchIndex } from "@/lib/research/search";

export const revalidate = 300;

export async function GET(request: Request): Promise<Response> {
  try {
    await enforcePublicApiRateLimit(request);
    const parsedRequest = validatePublicApiSearchRequest(request.url);
    const generatedAt = new Date().toISOString();
    const index = await getResearchSearchIndex(generatedAt);
    return publicApiJson(
      createPublicApiSearchResponse(index, request.url, parsedRequest),
    );
  } catch (error) {
    return publicApiErrorResponse(error);
  }
}

export function OPTIONS(): Response {
  return publicApiOptions();
}
