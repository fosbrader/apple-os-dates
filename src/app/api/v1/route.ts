import {
  createPublicApiManifest,
  enforcePublicApiRateLimit,
  publicApiErrorResponse,
  publicApiJson,
  publicApiOptions,
} from "@/lib/public-api";

export const revalidate = 300;

export async function GET(request: Request): Promise<Response> {
  try {
    await enforcePublicApiRateLimit(request);
    return publicApiJson(createPublicApiManifest());
  } catch (error) {
    return publicApiErrorResponse(error);
  }
}

export function OPTIONS(): Response {
  return publicApiOptions();
}
