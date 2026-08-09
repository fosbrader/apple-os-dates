export const SITE_VERSION_TIME_ZONE = "America/New_York";

const versionFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: SITE_VERSION_TIME_ZONE,
  calendar: "gregory",
  numberingSystem: "latn",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

const updatedAtFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: SITE_VERSION_TIME_ZONE,
  calendar: "gregory",
  numberingSystem: "latn",
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZoneName: "short",
});

function validDate(value: Date | string): Date {
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) {
    throw new RangeError("Site version timestamps must be valid dates.");
  }
  return date;
}

export function formatSiteVersion(value: Date | string): string {
  const parts = new Map(
    versionFormatter
      .formatToParts(validDate(value))
      .map((part) => [part.type, part.value]),
  );
  const required = ["year", "month", "day", "hour", "minute"] as const;
  const values = required.map((part) => parts.get(part));

  if (values.some((part) => !part)) {
    throw new RangeError("Site version timestamp parts are incomplete.");
  }

  const [year, month, day, hour, minute] = values;
  return `${year}.${month}.${day}.${hour}${minute}`;
}

export function formatSiteUpdatedAt(value: Date | string): string {
  return updatedAtFormatter.format(validDate(value));
}

export function createSiteBuildMetadata(value = new Date()) {
  const date = validDate(value);
  return {
    version: formatSiteVersion(date),
    updatedAt: date.toISOString(),
  };
}
