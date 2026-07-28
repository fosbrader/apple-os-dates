const configuredBasePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export const basePath =
  configuredBasePath === "/" ? "" : configuredBasePath.replace(/\/+$/, "");

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://fosbrader.github.io/apple-os-dates"
).replace(/\/+$/, "");

export const siteOrigin = new URL(siteUrl).origin;
export const siteHost = new URL(siteUrl).host;

export function withBasePath(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${basePath}${normalizedPath}`;
}
