import crypto from "crypto";

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function generateToken() {
  return crypto.randomBytes(32).toString("base64url");
}

export function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}
