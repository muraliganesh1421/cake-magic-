import crypto from "crypto";

const APP_SECRET = process.env.APP_SECRET || "cakemagic-secure-production-secret-key-2026-rajahmundry";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: "OWNER" | "STAFF";
  staffId?: string;
  exp: number;
}

/**
 * Creates a signed JWT-like token for Admin & Staff sessions
 */
export function createSessionToken(user: Omit<SessionUser, "exp">, expiresInHours = 24): string {
  const payload: SessionUser = {
    ...user,
    exp: Math.floor(Date.now() / 1000) + expiresInHours * 3600,
  };

  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", APP_SECRET)
    .update(payloadB64)
    .digest("base64url");

  return `${payloadB64}.${signature}`;
}

/**
 * Verifies and decodes a signed session token
 */
export function verifySessionToken(token?: string | null): SessionUser | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [payloadB64, signature] = parts;
  const expectedSignature = crypto
    .createHmac("sha256", APP_SECRET)
    .update(payloadB64)
    .digest("base64url");

  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf-8")) as SessionUser;
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null; // Expired
    }
    return payload;
  } catch {
    return null;
  }
}
