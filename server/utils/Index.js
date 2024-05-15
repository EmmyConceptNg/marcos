import crypto from "crypto";
import dotenv from 'dotenv';

const envFile =
  process.env.NODE_ENV === "production" ? ".env.production" : ".env.local";

dotenv.config({ path: envFile });

const algorithm = "aes-256-cbc";
const secretKeyHex = process.env.SECRET_KEY; // This should be a 64-character hexadecimal string
const secretKey = Buffer.from(secretKeyHex, 'hex'); // Convert hex string to Buffer
const iv = crypto.randomBytes(16); // Initialization vector

export function encrypt(text) {
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  let encrypted = cipher.update(String(text));
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return { iv: iv.toString("hex"), content: encrypted.toString("hex") };
}

export function decrypt(hash) {
  const decipher = crypto.createDecipheriv(
    algorithm,
    secretKey,
    Buffer.from(hash.iv, "hex")
  );
  let decrypted = decipher.update(Buffer.from(hash.content, "hex"));
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}
