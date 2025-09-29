import { createCipheriv, createDecipheriv, randomBytes, createHash, pbkdf2Sync } from 'crypto';

export interface EncryptionKey {
  key: Buffer;
  iv: Buffer;
  salt: Buffer;
}

export interface EncryptedData {
  encrypted: Buffer;
  key: Buffer;
  iv: Buffer;
  salt: Buffer;
  algorithm: string;
}

/**
 * Generates a cryptographically secure encryption key pair
 */
export function generateEncryptionKey(password?: string): EncryptionKey {
  const algorithm = 'aes-256-gcm';
  const keyLength = 32; // 256 bits
  const ivLength = 16;  // 128 bits
  const saltLength = 32; // 256 bits

  let key: Buffer;

  if (password) {
    // Derive key from password using PBKDF2
    const salt = randomBytes(saltLength);
    key = pbkdf2Sync(password, salt, 100000, keyLength, 'sha256');
    return {
      key,
      iv: randomBytes(ivLength),
      salt
    };
  } else {
    // Generate random key for session-based encryption
    return {
      key: randomBytes(keyLength),
      iv: randomBytes(ivLength),
      salt: randomBytes(saltLength)
    };
  }
}

/**
 * Encrypts data using AES-256-GCM
 */
export function encryptData(data: string, encryptionKey: EncryptionKey): EncryptedData {
  const algorithm = 'aes-256-gcm';
  const cipher = createCipheriv(algorithm, encryptionKey.key, encryptionKey.iv);

  let encrypted = Buffer.concat([
    cipher.update(data, 'utf8'),
    cipher.final()
  ]);

  const authTag = cipher.getAuthTag();

  // Combine encrypted data with auth tag
  encrypted = Buffer.concat([encrypted, authTag]);

  return {
    encrypted,
    key: encryptionKey.key,
    iv: encryptionKey.iv,
    salt: encryptionKey.salt,
    algorithm
  };
}

/**
 * Decrypts data using AES-256-GCM
 */
export function decryptData(encryptedData: EncryptedData): string {
  const algorithm = 'aes-256-gcm';
  const authTag = encryptedData.encrypted.slice(-16); // Last 16 bytes are auth tag
  const encrypted = encryptedData.encrypted.slice(0, -16); // Everything else is encrypted data

  const decipher = createDecipheriv(algorithm, encryptedData.key, encryptedData.iv);
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final()
  ]);

  return decrypted.toString('utf8');
}

/**
 * Encrypts file data with metadata
 */
export function encryptFile(fileBuffer: Buffer, fileName: string, encryptionKey: EncryptionKey): EncryptedData {
  const fileData = {
    buffer: fileBuffer.toString('base64'),
    name: fileName,
    timestamp: new Date().toISOString(),
    size: fileBuffer.length
  };

  const jsonString = JSON.stringify(fileData);
  return encryptData(jsonString, encryptionKey);
}

/**
 * Decrypts file data and returns buffer
 */
export function decryptFile(encryptedData: EncryptedData): { buffer: Buffer; name: string; size: number } {
  const decryptedJson = decryptData(encryptedData);
  const fileData = JSON.parse(decryptedJson);

  return {
    buffer: Buffer.from(fileData.buffer, 'base64'),
    name: fileData.name,
    size: fileData.size
  };
}

/**
 * Generates a secure session key for anonymous users
 */
export function generateSessionKey(): string {
  return randomBytes(32).toString('hex');
}

/**
 * Derives encryption key from session ID and user secret
 */
export function deriveKeyFromSession(sessionId: string, userSecret: string): Buffer {
  const combined = sessionId + userSecret;
  return createHash('sha256').update(combined).digest();
}

/**
 * Creates a hash of the message content for integrity verification
 */
export function createMessageHash(message: string, timestamp: Date): string {
  const data = message + timestamp.getTime().toString();
  return createHash('sha256').update(data).digest('hex');
}

/**
 * Verifies message integrity using hash
 */
export function verifyMessageHash(message: string, timestamp: Date, expectedHash: string): boolean {
  const calculatedHash = createMessageHash(message, timestamp);
  return calculatedHash === expectedHash;
}

/**
 * Securely wipes sensitive data from memory
 */
export function secureWipe(buffer: Buffer): void {
  // Overwrite buffer with random data multiple times
  for (let i = 0; i < 3; i++) {
    buffer.fill(randomBytes(buffer.length));
  }
  buffer.fill(0);
}

/**
 * Generates emergency access key for crisis situations
 */
export function generateEmergencyKey(): { publicKey: string; privateKey: string } {
  const privateKey = randomBytes(32).toString('hex');
  const publicKey = createHash('sha256').update(privateKey).digest('hex');

  return {
    publicKey,
    privateKey
  };
}

/**
 * Validates encryption key strength
 */
export function validateEncryptionKey(key: Buffer): boolean {
  return key.length === 32; // AES-256 requires 32-byte key
}

/**
 * Secure key exchange for establishing shared encryption
 */
export function generateKeyExchangeData(): {
  publicKey: Buffer;
  privateKey: Buffer;
  exchangeKey: string;
} {
  const privateKey = randomBytes(32);
  const publicKey = randomBytes(32);

  // Create exchange key by combining and hashing
  const combined = Buffer.concat([privateKey, publicKey]);
  const exchangeKey = createHash('sha256').update(combined).digest('hex');

  return {
    publicKey,
    privateKey,
    exchangeKey
  };
}