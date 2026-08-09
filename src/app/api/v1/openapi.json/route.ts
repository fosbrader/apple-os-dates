import {
  enforcePublicApiRateLimit,
  publicApiErrorResponse,
  publicApiJson,
  publicApiOptions,
} from "@/lib/public-api";
import { createPublicApiOpenApi } from "@/lib/public-api/openapi";

export const revalidate = 300;

export async function GET(request: Request): Promise<Response> {
  try {
    await enforcePublicApiRateLimit(request);
    return publicApiJson(createPublicApiOpenApi());
  } catch (error) {
    return publicApiErrorResponse(error);
  }
}

export function OPTIONS(): Response {
  return publicApiOptions();
}
