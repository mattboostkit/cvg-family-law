// Document and Data Encryption Utilities
// Uses AES-256 encryption for maximum security

import crypto from 'crypto';
import {
  Document,
  User,
  SecurityQuestion,
  Message,
  SharedDocument,
  AuditLog
} from '@/types/client-portal';

// Encryption configuration
const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32; // 256 bits
const IV_LENGTH = 16;  // 128 bits
const TAG_LENGTH = 16; // 128 bits
const SALT_LENGTH = 32; // 256 bits

// Master key for encryption (in production, this should come from environment variables)
const MASTER_KEY = process.env.ENCRYPTION_MASTER_KEY || 'fallback-master-key-change-in-production';

/**
 * Generates a cryptographically secure encryption key
 */
export function generateEncryptionKey(): string {
  return crypto.randomBytes(KEY_LENGTH).toString('hex');
}

/**
 * Generates a cryptographically secure salt
 */
export function generateSalt(): string {
  return crypto.randomBytes(SALT_LENGTH).toString('hex');
}

/**
 * Derives an encryption key from a password using PBKDF2
 */
export function deriveKeyFromPassword(password: string, salt: string): Buffer {
  return crypto.pbkdf2Sync(
    password,
    salt,
    100000, // High iteration count for security
    KEY_LENGTH,
    'sha256'
  );
}

/**
 * Encrypts data using AES-256-GCM
 */
export function encryptData(data: string, key: string): {
  encrypted: string;
  iv: string;
  tag: string;
  salt: string;
} {
  const salt = generateSalt();
  const derivedKey = deriveKeyFromPassword(key, salt);
  const iv = crypto.randomBytes(IV_LENGTH);

  const cipher = crypto.createCipher(ALGORITHM, derivedKey);
  cipher.setAAD(Buffer.from('additional-auth-data')); // Additional authenticated data

  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const tag = cipher.getAuthTag();

  return {
    encrypted,
    iv: iv.toString('hex'),
    tag: tag.toString('hex'),
    salt
  };
}

/**
 * Decrypts data using AES-256-GCM
 */
export function decryptData(
  encryptedData: {
    encrypted: string;
    iv: string;
    tag: string;
    salt: string;
  },
  key: string
): string {
  try {
    const derivedKey = deriveKeyFromPassword(key, encryptedData.salt);
    const decipher = crypto.createDecipher(ALGORITHM, derivedKey);
    decipher.setAuthTag(Buffer.from(encryptedData.tag, 'hex'));
    decipher.setAAD(Buffer.from('additional-auth-data'));

    let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  } catch (error) {
    throw new Error('Failed to decrypt data. Invalid key or corrupted data.');
  }
}

/**
 * Encrypts a file buffer
 */
export function encryptFile(fileBuffer: Buffer, key: string): {
  encrypted: Buffer;
  iv: string;
  tag: string;
  salt: string;
} {
  const salt = generateSalt();
  const derivedKey = deriveKeyFromPassword(key, salt);
  const iv = crypto.randomBytes(IV_LENGTH);

  const cipher = crypto.createCipher(ALGORITHM, derivedKey);
  cipher.setAAD(Buffer.from('file-encryption'));

  const encrypted = Buffer.concat([
    cipher.update(fileBuffer),
    cipher.final()
  ]);

  const tag = cipher.getAuthTag();

  return {
    encrypted,
    iv: iv.toString('hex'),
    tag: tag.toString('hex'),
    salt
  };
}

/**
 * Decrypts a file buffer
 */
export function decryptFile(
  encryptedFile: {
    encrypted: Buffer;
    iv: string;
    tag: string;
    salt: string;
  },
  key: string
): Buffer {
  try {
    const derivedKey = deriveKeyFromPassword(key, encryptedFile.salt);
    const decipher = crypto.createDecipher(ALGORITHM, derivedKey);
    decipher.setAuthTag(Buffer.from(encryptedFile.tag, 'hex'));
    decipher.setAAD(Buffer.from('file-encryption'));

    return Buffer.concat([
      decipher.update(encryptedFile.encrypted),
      decipher.final()
    ]);
  } catch (error) {
    throw new Error('Failed to decrypt file. Invalid key or corrupted data.');
  }
}

/**
 * Generates a secure hash for passwords
 */
export function hashPassword(password: string): string {
  const salt = generateSalt();
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha256').toString('hex');
  return `${salt}:${hash}`;
}

/**
 * Verifies a password against its hash
 */
export function verifyPassword(password: string, hashedPassword: string): boolean {
  const [salt, hash] = hashedPassword.split(':');
  const verifyHash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha256').toString('hex');
  return hash === verifyHash;
}

/**
 * Generates a secure session token
 */
export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Generates a secure document checksum
 */
export function generateChecksum(data: Buffer | string): string {
  const hash = crypto.createHash('sha256');
  hash.update(typeof data === 'string' ? Buffer.from(data) : data);
  return hash.digest('hex');
}

/**
 * Encrypts sensitive user data
 */
export function encryptUserData(user: User): {
  encryptedData: string;
  key: string;
} {
  const key = generateEncryptionKey();
  const dataToEncrypt = JSON.stringify({
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    phoneNumber: user.phoneNumber,
    securityQuestions: user.securityQuestions
  });

  const encrypted = encryptData(dataToEncrypt, key);
  return {
    encryptedData: JSON.stringify(encrypted),
    key
  };
}

/**
 * Decrypts sensitive user data
 */
export function decryptUserData(encryptedData: string, key: string): Partial<User> {
  const encrypted = JSON.parse(encryptedData);
  const decrypted = decryptData(encrypted, key);
  return JSON.parse(decrypted);
}

/**
 * Encrypts security question answers
 */
export function encryptSecurityQuestion(question: SecurityQuestion, key: string): SecurityQuestion {
  const answer = encryptData(question.answer, key);
  return {
    ...question,
    answer: JSON.stringify(answer)
  };
}

/**
 * Decrypts security question answers
 */
export function decryptSecurityQuestion(question: SecurityQuestion, key: string): SecurityQuestion {
  const encrypted = JSON.parse(question.answer);
  const answer = decryptData(encrypted, key);
  return {
    ...question,
    answer
  };
}

/**
 * Encrypts message content
 */
export function encryptMessage(message: Message, key: string): Message {
  if (!message.isEncrypted) {
    const encrypted = encryptData(message.content, key);
    return {
      ...message,
      content: JSON.stringify(encrypted),
      isEncrypted: true
    };
  }
  return message;
}

/**
 * Decrypts message content
 */
export function decryptMessage(message: Message, key: string): Message {
  if (message.isEncrypted && typeof message.content === 'string') {
    try {
      const encrypted = JSON.parse(message.content);
      const content = decryptData(encrypted, key);
      return {
        ...message,
        content,
        isEncrypted: false
      };
    } catch (error) {
      // If decryption fails, return original message
      return message;
    }
  }
  return message;
}

/**
 * Generates a secure share token for document sharing
 */
export function generateShareToken(): string {
  return crypto.randomBytes(24).toString('hex');
}

/**
 * Creates an audit log hash for integrity verification
 */
export function createAuditHash(log: AuditLog): string {
  const data = `${log.userId}-${log.action}-${log.resource}-${log.resourceId}-${log.timestamp.getTime()}`;
  return generateChecksum(data);
}

/**
 * Validates file integrity using checksum
 */
export function validateFileIntegrity(fileBuffer: Buffer, expectedChecksum: string): boolean {
  const actualChecksum = generateChecksum(fileBuffer);
  return actualChecksum === expectedChecksum;
}