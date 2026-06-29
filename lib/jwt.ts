import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "3grt_session";

function getSecret() {
  const secret = process.env.SESSION_SECRET || "dev-only-secret-change-me-please-min-32-chars";
  return new TextEncoder().encode(secret);
}

export type SessionPayload = { uid: string; username: string };

export async function signToken(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}
