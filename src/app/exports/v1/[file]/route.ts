import { getPublicResearchDatasets } from "@/lib/research/data";
import {
  createResearchEnvelope,
  researchExportManifest,
  researchExportReadme,
  serializeResearchCsv,
} from "@/lib/research/serialize";
import {
  RESEARCH_DATASET_NAMES,
  type ResearchDatasetName,
} from "@/lib/research/types";

export const revalidate = 300;

const PUBLIC_CACHE =
  "public, max-age=0, s-maxage=300, stale-while-revalidate=86400";

function commonHeaders(contentType: string): HeadersInit {
  return {
    "Content-Type": contentType,
    "Cache-Control": PUBLIC_CACHE,
    "Access-Control-Allow-Origin": "*",
    "X-Content-Type-Options": "nosniff",
    // Raw dataset payloads are for reuse, not the search index; the
    // future /exports/ landing page is the indexable surface.
    "X-Robots-Tag": "noindex, noarchive",
  };
}

function datasetFile(
  file: string,
): { dataset: ResearchDatasetName; format: "json" | "csv" } | null {
  const match = /^([a-z]+)\.(json|csv)$/.exec(file);
  if (!match) return null;
  const dataset = match[1] as ResearchDatasetName;
  if (!RESEARCH_DATASET_NAMES.includes(dataset)) return null;
  return { dataset, format: match[2] as "json" | "csv" };
}

function notFoundResponse(): Response {
  return Response.json(
    { error: "Unknown export file" },
    {
      status: 404,
      headers: {
        "Cache-Control": "public, max-age=300",
        "X-Content-Type-Options": "nosniff",
      },
    },
  );
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ file: string }> },
): Promise<Response> {
  const { file } = await context.params;
  const generatedAt = new Date().toISOString();

  if (file === "README.txt") {
    return new Response(researchExportReadme(), {
      headers: {
        ...commonHeaders("text/plain; charset=utf-8"),
        "Content-Disposition": 'inline; filename="README.txt"',
      },
    });
  }

  if (file === "manifest.json") {
    return Response.json(researchExportManifest(generatedAt), {
      headers: {
        ...commonHeaders("application/json; charset=utf-8"),
        "Content-Disposition": 'inline; filename="manifest.json"',
      },
    });
  }

  const parsed = datasetFile(file);
  if (!parsed) return notFoundResponse();

  try {
    const datasets = await getPublicResearchDatasets();

    if (parsed.format === "csv") {
      return new Response(
        serializeResearchCsv(
          parsed.dataset,
          datasets[parsed.dataset],
        ),
        {
          headers: {
            ...commonHeaders("text/csv; charset=utf-8"),
            "Content-Disposition": `attachment; filename="${file}"`,
          },
        },
      );
    }

    const envelope = createResearchEnvelope(
      parsed.dataset,
      datasets,
      generatedAt,
    );
    return new Response(JSON.stringify(envelope), {
      headers: {
        ...commonHeaders("application/json; charset=utf-8"),
        "Content-Disposition": `attachment; filename="${file}"`,
      },
    });
  } catch (error) {
    console.error("Public research export failed", error);
    return Response.json(
      { error: "Export is temporarily unavailable" },
      {
        status: 503,
        headers: {
          "Cache-Control": "no-store",
          "Retry-After": "60",
          "X-Content-Type-Options": "nosniff",
        },
      },
    );
  }
}
