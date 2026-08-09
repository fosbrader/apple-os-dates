import { articlePublishingFeatureVersion } from "./article";

export interface ArticleDeploymentReadiness {
  featureVersion: string;
  production: boolean;
  previewConfigured: boolean;
}

export function articleDeploymentIsReady(
  value: unknown,
): value is ArticleDeploymentReadiness {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<ArticleDeploymentReadiness>;

  return (
    candidate.featureVersion === articlePublishingFeatureVersion &&
    candidate.production === true &&
    candidate.previewConfigured === true
  );
}

export function productionArticleDeploymentOrigin(value: string): string {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error("--deployment-url must be a valid HTTPS URL.");
  }

  if (
    url.protocol !== "https:" ||
    url.hostname !== "www.versionrecord.com" ||
    url.username ||
    url.password ||
    url.port
  ) {
    throw new Error(
      "Article publication requires the production origin https://www.versionrecord.com.",
    );
  }

  return "https://www.versionrecord.com";
}

export async function verifyArticleDeployment(
  deploymentUrl: string,
  fetcher: typeof fetch = fetch,
): Promise<ArticleDeploymentReadiness> {
  const origin = productionArticleDeploymentOrigin(deploymentUrl);
  const response = await fetcher(`${origin}/api/news-readiness/`, {
    cache: "no-store",
    headers: { accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(
      `Article deployment readiness check failed with HTTP ${response.status}.`,
    );
  }

  const payload: unknown = await response.json();
  if (!articleDeploymentIsReady(payload)) {
    throw new Error(
      "Production does not report the required article feature and private-preview configuration.",
    );
  }

  return payload;
}
