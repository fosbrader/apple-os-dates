import {
  createPublicApiListResponse,
  enforcePublicApiRateLimit,
  publicApiErrorResponse,
  publicApiJson,
  publicApiOptions,
  resolvePublicApiDataset,
  validatePublicApiListRequest,
} from "@/lib/public-api";
import { getPublicResearchDatasets } from "@/lib/research/data";

export const revalidate = 300;

export async function GET(
  request: Request,
  context: { params: Promise<{ dataset: string }> },
): Promise<Response> {
  try {
    await enforcePublicApiRateLimit(request);
    const { dataset: value } = await context.params;
    const dataset = resolvePublicApiDataset(value);
    const parsedRequest = validatePublicApiListRequest(dataset, request.url);
    const generatedAt = new Date().toISOString();
    const datasets = await getPublicResearchDatasets();
    return publicApiJson(
      createPublicApiListResponse(
        dataset,
        datasets,
        request.url,
        generatedAt,
        parsedRequest,
      ),
    );
  } catch (error) {
    return publicApiErrorResponse(error);
  }
}

export function OPTIONS(): Response {
  return publicApiOptions();
}
