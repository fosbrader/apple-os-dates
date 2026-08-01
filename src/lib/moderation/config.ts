export interface ModerationConfig {
  projectId: string;
  dataset: string;
  token: string;
}

export interface TurnstileConfig {
  siteKey: string;
  secretKey: string;
}

export interface FeedIngestConfig {
  cronSecret: string;
  allowedHosts: ReadonlySet<string>;
}

export class ModerationConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ModerationConfigurationError";
  }
}

const datasetPattern = /^[a-z0-9][a-z0-9_-]{0,63}$/;
const projectIdPattern = /^[a-z0-9-]+$/;

function configuredValue(
  environment: Readonly<Record<string, string | undefined>>,
  name: string,
): string | undefined {
  const value = environment[name]?.trim();
  if (
    !value ||
    /^(?:change[-_]?me|replace_.+|your_.+_here)$/i.test(value)
  ) {
    return undefined;
  }
  return value;
}

/**
 * Moderation has a deliberately separate credential boundary. It must never
 * inherit the public dataset or the general-purpose import token.
 */
export function getModerationConfig(
  environment: Readonly<Record<string, string | undefined>> = process.env,
): ModerationConfig {
  const projectId =
    configuredValue(environment, "SANITY_MODERATION_PROJECT_ID") ??
    configuredValue(environment, "NEXT_PUBLIC_SANITY_PROJECT_ID");
  const dataset = configuredValue(environment, "SANITY_MODERATION_DATASET");
  const token = configuredValue(
    environment,
    "SANITY_MODERATION_WRITE_TOKEN",
  );
  const publicDataset = configuredValue(
    environment,
    "NEXT_PUBLIC_SANITY_DATASET",
  );

  if (!projectId || !projectIdPattern.test(projectId)) {
    throw new ModerationConfigurationError(
      "The moderation Sanity project is not configured.",
    );
  }
  if (!dataset || !datasetPattern.test(dataset)) {
    throw new ModerationConfigurationError(
      "A valid private moderation dataset is required.",
    );
  }
  if (
    dataset.toLowerCase() === "production" ||
    (publicDataset && dataset === publicDataset)
  ) {
    throw new ModerationConfigurationError(
      "Moderation must use a private dataset distinct from the public dataset.",
    );
  }
  if (!token) {
    throw new ModerationConfigurationError(
      "A dedicated moderation write token is required.",
    );
  }

  return { projectId, dataset, token };
}

export function getTurnstileConfig(
  environment: Readonly<Record<string, string | undefined>> = process.env,
): TurnstileConfig | null {
  const siteKey = configuredValue(
    environment,
    "NEXT_PUBLIC_TURNSTILE_SITE_KEY",
  );
  const secretKey = configuredValue(environment, "TURNSTILE_SECRET_KEY");

  if (!siteKey && !secretKey) return null;
  if (!siteKey || !secretKey) {
    throw new ModerationConfigurationError(
      "Turnstile requires both its public site key and private secret key.",
    );
  }

  return { siteKey, secretKey };
}

export function getFeedIngestConfig(
  environment: Readonly<Record<string, string | undefined>> = process.env,
): FeedIngestConfig {
  const cronSecret = configuredValue(environment, "CRON_SECRET");
  const hosts = configuredValue(
    environment,
    "FEED_INGEST_ALLOWED_HOSTS",
  )?.split(",")
    .map((host) => host.trim().toLowerCase().replace(/\.$/, ""))
    .filter(Boolean);

  if (!cronSecret || cronSecret.length < 24) {
    throw new ModerationConfigurationError(
      "A strong cron authorization secret is required.",
    );
  }
  if (
    !hosts?.length ||
    hosts.some(
      (host) =>
        !host.includes(".") ||
        !/^[a-z0-9.-]+$/.test(host) ||
        host.startsWith(".") ||
        host.endsWith("."),
    )
  ) {
    throw new ModerationConfigurationError(
      "At least one exact feed hostname must be allowlisted.",
    );
  }

  return {
    cronSecret,
    allowedHosts: new Set(hosts),
  };
}
