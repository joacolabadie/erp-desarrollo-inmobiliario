import crypto from "crypto";

type NormalizeEmailArgs = {
  email: string;
};

type HashTokenArgs = {
  token: string;
};

export function normalizeEmail({ email }: NormalizeEmailArgs) {
  return email.trim().toLowerCase();
}

export function generateToken() {
  return crypto.randomBytes(32).toString("base64url");
}

export function hashToken({ token }: HashTokenArgs) {
  return crypto.createHash("sha256").update(token).digest("hex");
}
