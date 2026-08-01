import { isIP } from "node:net";

const blockedHostnameSuffixes = [
  ".internal",
  ".local",
  ".localhost",
  ".localdomain",
  ".home",
  ".lan",
  ".test",
  ".invalid",
  ".example",
  ".onion",
];

const trackingParameters = new Set([
  "fbclid",
  "gclid",
  "dclid",
  "mc_cid",
  "mc_eid",
  "igshid",
  "mkt_tok",
  "ref_src",
]);

export function isBlockedIpv4(address: string): boolean {
  const octets = address.split(".").map(Number);
  if (
    octets.length !== 4 ||
    octets.some((octet) => !Number.isInteger(octet) || octet < 0 || octet > 255)
  ) {
    return true;
  }

  const [a, b] = octets;
  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 0) ||
    (a === 192 && b === 168) ||
    (a === 192 && b === 88) ||
    (a === 198 && (b === 18 || b === 19)) ||
    (a === 198 && b === 51) ||
    (a === 203 && b === 0) ||
    a >= 224
  );
}

function firstIpv6Hextet(address: string): number {
  return Number.parseInt(address.split(":")[0] || "0", 16);
}

export function isBlockedIpv6(address: string): boolean {
  const normalized = address.toLowerCase().split("%")[0];
  if (
    normalized === "::" ||
    normalized === "::1" ||
    normalized.startsWith("::ffff:")
  ) {
    const mapped = normalized.slice("::ffff:".length);
    return !mapped || isBlockedIpv4(mapped);
  }

  if (
    normalized.startsWith("64:ff9b:") ||
    normalized.startsWith("100:") ||
    normalized.startsWith("2001:db8:") ||
    normalized.startsWith("2002:")
  ) {
    return true;
  }

  const first = firstIpv6Hextet(normalized);
  return (
    (first & 0xfe00) === 0xfc00 || // unique-local fc00::/7
    (first & 0xffc0) === 0xfe80 || // link-local fe80::/10
    (first & 0xff00) === 0xff00 || // multicast ff00::/8
    (first & 0xffc0) === 0x0000 // unspecified and other special low ranges
  );
}

export function isBlockedIpAddress(address: string): boolean {
  const family = isIP(address);
  if (family === 4) return isBlockedIpv4(address);
  if (family === 6) return isBlockedIpv6(address);
  return true;
}

export function isPublicHttpsUrl(value: string): boolean {
  try {
    const url = new URL(value);
    const hostname = url.hostname.toLowerCase().replace(/\.$/, "");

    if (
      url.protocol !== "https:" ||
      url.username ||
      url.password ||
      (url.port && url.port !== "443") ||
      !hostname ||
      !hostname.includes(".") ||
      hostname === "localhost" ||
      blockedHostnameSuffixes.some((suffix) => hostname.endsWith(suffix)) ||
      isIP(hostname) !== 0
    ) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

export function canonicalizePublicHttpsUrl(value: string): string | null {
  const trimmed = value.trim();
  if (!isPublicHttpsUrl(trimmed)) return null;

  const url = new URL(trimmed);
  url.hash = "";
  for (const name of [...url.searchParams.keys()]) {
    const normalizedName = name.toLowerCase();
    if (
      normalizedName.startsWith("utm_") ||
      trackingParameters.has(normalizedName)
    ) {
      url.searchParams.delete(name);
    }
  }
  url.searchParams.sort();

  return url.toString();
}
