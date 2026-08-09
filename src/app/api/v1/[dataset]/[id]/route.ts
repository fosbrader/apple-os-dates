import {
  createPublicApiDetailResponse,
  enforcePublicApiRateLimit,
  publicApiErrorResponse,
  publicApiJson,
  publicApiOptions,
  resolvePublicApiDataset,
  validatePublicApiRecordId,
} from "@/lib/public-api";
import { getPublicResearchDatasets } from "@/lib/research/data";

export const revalidate = 300;

export async function GET(
  request: Request,
  context: { params: Promise<{ dataset: string; id: string }> },
): Promise<Response> {
  try {
    await enforcePublicApiRateLimit(request);
    const { dataset: value, id } = await context.params;
    const dataset = resolvePublicApiDataset(value);
    const recordId = validatePublicApiRecordId(id);
    const generatedAt = new Date().toISOString();
    const datasets = await getPublicResearchDatasets();
    return publicApiJson(
      createPublicApiDetailResponse(
        dataset,
        recordId,
        datasets,
        request.url,
        generatedAt,
      ),
    );
  } catch (error) {
    return publicApiErrorResponse(error);
  }
}

export function OPTIONS(): Response {
  return publicApiOptions();
}
