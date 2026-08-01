export interface VendorAdapter {
  slug: string;
  name: string;
  legalName: string;
}

/**
 * Apple is the only implemented catalog today. Keeping its public identity in
 * one adapter prevents vendor literals from leaking through route and export
 * code, while leaving room for intentionally designed future catalogs.
 */
export const APPLE_VENDOR = {
  slug: "apple",
  name: "Apple",
  legalName: "Apple Inc.",
} as const satisfies VendorAdapter;

export const VENDOR_ADAPTERS = {
  [APPLE_VENDOR.slug]: APPLE_VENDOR,
} as const;

export type VendorSlug = keyof typeof VENDOR_ADAPTERS;

export function vendorPath(vendor: VendorSlug): string {
  return `/${encodeURIComponent(vendor)}/`;
}

export function vendorPlatformPath(
  vendor: VendorSlug,
  platform: string,
): string {
  return `${vendorPath(vendor)}${encodeURIComponent(platform)}/`;
}
