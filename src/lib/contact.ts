function normalizeContactEmail(
  value: string | undefined
): string | undefined {
  const trimmed = value?.trim();

  if (
    !trimmed ||
    trimmed.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)
  ) {
    return undefined;
  }

  return trimmed;
}

/**
 * Use a role-based address such as corrections@example.com. This is read at
 * build time and only appears on public pages when explicitly configured.
 */
export const publicContactEmail = normalizeContactEmail(
  process.env.SITE_CONTACT_EMAIL
);

function normalizeOperatorName(
  value: string | undefined
): string | undefined {
  const trimmed = value?.trim();

  if (!trimmed || trimmed.length > 100 || /[<>{}]/.test(trimmed)) {
    return undefined;
  }

  return trimmed;
}

/**
 * Public controller/operator identity shown in the privacy notice. This can be
 * a person's name or the registered business/entity responsible for the site.
 */
export const publicOperatorName = normalizeOperatorName(
  process.env.SITE_OPERATOR_NAME
);
