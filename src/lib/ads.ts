export function normalizeGooglePublisherId(
  value: string | undefined
): string | null {
  const normalized = value?.trim().replace(/^ca-/, "");
  return normalized && /^pub-\d{16}$/.test(normalized) ? normalized : null;
}

export const googlePublisherId = normalizeGooglePublisherId(
  process.env.GOOGLE_ADSENSE_PUBLISHER_ID
);

export const googleAdsenseAccount = googlePublisherId
  ? `ca-${googlePublisherId}`
  : null;
