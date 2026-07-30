import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

const SALT_LENGTH = 32;
const KEY_LENGTH = 64;

/**
 * Hash a password using scrypt with a random salt.
 * Returns a string in the format: salt:hash (both hex-encoded)
 */
export function hashPassword(password: string): string {
  const salt = randomBytes(SALT_LENGTH).toString("hex");
  const hash = scryptSync(password, salt, KEY_LENGTH).toString("hex");
  return `${salt}:${hash}`;
}

/**
 * Verify a password against a stored hash (salt:hash format).
 */
export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;

  const hashBuffer = scryptSync(password, salt, KEY_LENGTH);
  const storedBuffer = Buffer.from(hash, "hex");

  if (hashBuffer.length !== storedBuffer.length) return false;

  return timingSafeEqual(hashBuffer, storedBuffer);
}

/**
 * Generate a cryptographically secure random token (for sessions).
 */
export function generateToken(): string {
  return randomBytes(48).toString("hex");
}

/**
 * Generate a readable temporary password (for first access).
 */
export function generateTempPassword(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  let password = "";
  for (let i = 0; i < 10; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}
