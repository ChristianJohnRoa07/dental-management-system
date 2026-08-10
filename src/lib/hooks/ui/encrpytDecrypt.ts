import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12; 
const AUTH_TAG_LENGTH = 16;

function getEncryptionKey(): Buffer {
  const keyHex = process.env.ENCRYPTION_KEY;

  if (!keyHex) {
    throw new Error("ENCRYPTION_KEY environment variable is not defined.");
  }

  const keyBuffer = Buffer.from(keyHex, "hex");

  if (keyBuffer.length !== 32) {
    throw new Error("ENCRYPTION_KEY must be a 64-character hex string (32 bytes).");
  }

  return keyBuffer;
}

/**
 * Encrypts a string value.
 * @returns Formatted string: `iv:authTag:encryptedData` (all hex encoded)
 */
function encrypt(text: string): string {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag().toString("hex");

  return `${iv.toString("hex")}:${authTag}:${encrypted}`;
}

/**
 * Decrypts a string produced by `encrypt()`.
 * @param encryptedString Format: `iv:authTag:encryptedData`
 */
function decrypt(encryptedString: string): string {
  const key = getEncryptionKey();

  const parts = encryptedString.split(":");
  if (parts.length !== 3) {
    throw new Error("Invalid encrypted data format.");
  }

  const [ivHex, authTagHex, encryptedText] = parts;

  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });

  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

/**
 * Helper: Encrypts any JSON-serializable object/data
 */
export function encryptObject<T>(data: T): string {
  return encrypt(JSON.stringify(data));
}

/**
 * Helper: Decrypts and parses JSON object/data
 */
export function decryptObject<T>(encryptedString: string): T {
  const decryptedText = decrypt(encryptedString);
  return JSON.parse(decryptedText) as T;
}