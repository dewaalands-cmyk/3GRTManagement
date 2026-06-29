import { scryptSync, randomBytes, timingSafeEqual } from "crypto";

// Format tersimpan: "salt:hash"
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, key] = stored.split(":");
  if (!salt || !key) return false;
  const keyBuf = Buffer.from(key, "hex");
  const testBuf = scryptSync(password, salt, 64);
  return keyBuf.length === testBuf.length && timingSafeEqual(keyBuf, testBuf);
}
