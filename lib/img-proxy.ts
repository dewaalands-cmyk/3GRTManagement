/**
 * Converts a base64 data URL to a proxy URL served by /api/img.
 * External URLs are returned unchanged.
 * The key encodes where to fetch the image from the DB.
 * Pass `version` (a unix-ms timestamp) to bust CDN cache after content changes.
 */
export function toProxyUrl(value: string | null | undefined, key: string, version?: number): string {
  if (!value) return value ?? "";
  if (value.startsWith("data:image")) {
    const v = version ? `&v=${version}` : "";
    return `/api/img?k=${encodeURIComponent(key)}${v}`;
  }
  return value;
}
