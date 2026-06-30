/**
 * Converts a base64 data URL to a proxy URL served by /api/img.
 * External URLs are returned unchanged.
 * The key encodes where to fetch the image from the DB.
 */
export function toProxyUrl(value: string | null | undefined, key: string): string {
  if (!value) return value ?? "";
  if (value.startsWith("data:image")) {
    return `/api/img?k=${encodeURIComponent(key)}`;
  }
  return value;
}
