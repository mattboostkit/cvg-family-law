// Testimonial Management System with Verification and Privacy Controls
// Handles testimonial submission, verification, and GDPR compliance

import crypto from 'crypto';
import {
  Testimonial,
  TestimonialSubmission,
  VerificationRequest,
  TestimonialVerificationResult,
  PrivacySettings,
  TestimonialAuthor,
  VerificationDocument,
  VerificationStatus,
  VideoUploadProgress,
  TestimonialStats,
  TestimonialFilters,
  CaseOutcome
} from '@/types/testimonials';
import { generateChecksum, encryptData, decryptData, generateSessionToken } from './encryption';

// In-memory storage for demonstration - in production, use a database
const testimonials: Testimonial[] = [];
const verificationRequests: VerificationRequest[] = [];
const uploadProgress: Map<string, VideoUploadProgress> = new Map();

// Configuration
const CONSENT_RETENTION_DAYS = 2555; // 7 years for legal compliance
const VERIFICATION_EXPIRY_DAYS = 365; // 1 year
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];

/**
 * Generates a unique testimonial ID
 */
export function generateTestimonialId(): string {
  return `testimonial_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`;
}

/**
 * Generates a unique verification document ID
 */
export function generateVerificationDocumentId(): string {
  return `verification_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`;
}

/**
 * Creates a testimonial author object with privacy controls
 */
export function createTestimonialAuthor(
  caseType: string,
  isAnonymous: boolean = false,
  name?: string,
  location?: string
): TestimonialAuthor {
  const author: TestimonialAuthor = {
    id: generateSessionToken(),
    caseType,
    isAnonymous
  };

  if (!isAnonymous && name) {
    author.name = name;
    author.initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
  } else {
    author.initials = 'AN'; // Anonymous
  }

  if (location && !isAnonymous) {
    author.location = location;
  }

  return author;
}

/**
 * Creates privacy settings for a testimonial
 */
export function createPrivacySettings(
  level: 'public' | 'anonymous' | 'blurred' | 'private' = 'public',
  options: Partial<PrivacySettings> = {}
): PrivacySettings {
  return {
    level,
    allowVideoBlurring: options.allowVideoBlurring ?? (level === 'blurred'),
    allowVoiceAlteration: options.allowVoiceAlteration ?? false,
    allowNameDisplay: options.allowNameDisplay ?? (level === 'public'),
    allowLocationDisplay: options.allowLocationDisplay ?? false,
    consentWithdrawn: false,
    ...options
  };
}

/**
 * Submits a new testimonial for review
 */
export async function submitTestimonial(submission: TestimonialSubmission): Promise<Testimonial> {
  // Validate submission
  if (!submission.consentGiven) {
    throw new Error('Consent must be given to submit a testimonial');
  }

  if (submission.type === 'video' && (!submission.verificationDocuments || submission.verificationDocuments.length === 0)) {
    throw new Error('Video testimonials require verification documents');
  }

  // Create testimonial object
  const testimonial: Testimonial = {
    id: generateTestimonialId(),
    type: submission.type,
    author: createTestimonialAuthor(
      submission.caseType,
      submission.isAnonymous,
      submission.authorName,
      submission.authorLocation
    ),
    content: submission.content,
    caseOutcome: submission.caseOutcome,
    rating: submission.rating,
    tags: submission.tags,
    verificationStatus: 'pending',
    verificationDocuments: [],
    privacySettings: submission.privacySettings,
    isPublished: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    expiresAt: new Date(Date.now() + CONSENT_RETENTION_DAYS * 24 * 60 * 60 * 1000),
    viewCount: 0,
    helpfulCount: 0
  };

  // Process verification documents
  if (submission.verificationDocuments) {
    for (const file of submission.verificationDocuments) {
      const document = await processVerificationDocument(file, testimonial.id);
      testimonial.verificationDocuments.push(document);
    }
  }

  // Store testimonial
  testimonials.push(testimonial);

  return testimonial;
}

/**
 * Processes a verification document upload
 */
export async function processVerificationDocument(
  file: File,
  testimonialId: string
): Promise<VerificationDocument> {
  const documentId = generateVerificationDocumentId();
  const fileBuffer = Buffer.from(await file.arrayBuffer());
  const checksum = generateChecksum(fileBuffer);

  // Validate file
  if (fileBuffer.length > 10 * 1024 * 1024) { // 10MB limit for documents
    throw new Error('Verification document must be under 10MB');
  }

  const document: VerificationDocument = {
    id: documentId,
    type: determineDocumentType(file.name, file.type),
    status: 'pending',
    uploadedAt: new Date(),
    documentHash: checksum,
    metadata: {
      fileName: file.name,
      fileSize: fileBuffer.length,
      mimeType: file.type
    }
  };

  return document;
}

/**
 * Determines document type based on filename and MIME type
 */
function determineDocumentType(fileName: string, mimeType: string): VerificationDocument['type'] {
  const name = fileName.toLowerCase();

  if (name.includes('identity') || name.includes('id') || mimeType.includes('image')) {
    return 'identity';
  }

  if (name.includes('case') || name.includes('court') || name.includes('outcome')) {
    return 'case_outcome';
  }

  if (name.includes('sra') || name.includes('solicitor')) {
    return 'sra_reference';
  }

  if (name.includes('consent')) {
    return 'consent_form';
  }

  return 'identity'; // Default
}

/**
 * Verifies a testimonial with SRA compliance
 */
export async function verifyTestimonial(
  testimonialId: string,
  verificationBy: string,
  verificationMethod: string,
  notes?: string
): Promise<TestimonialVerificationResult> {
  const testimonial = testimonials.find(t => t.id === testimonialId);
  if (!testimonial) {
    throw new Error('Testimonial not found');
  }

  // Validate verification documents
  const requiredDocs = testimonial.verificationDocuments.filter(doc =>
    doc.type === 'identity' || doc.type === 'case_outcome'
  );

  if (requiredDocs.length === 0) {
    throw new Error('No verification documents found');
  }

  // Check if verification documents are valid
  const validDocs = requiredDocs.filter(doc => doc.status === 'verified');
  if (validDocs.length === 0) {
    throw new Error('Verification documents must be validated first');
  }

  // Update testimonial verification status
  testimonial.verificationStatus = 'verified';
  testimonial.verifiedAt = new Date();
  testimonial.verifiedBy = verificationBy;
  testimonial.updatedAt = new Date();

  const result: TestimonialVerificationResult = {
    testimonialId,
    status: 'verified',
    verifiedBy: verificationBy,
    verifiedAt: new Date(),
    verificationMethod,
    notes,
    validUntil: new Date(Date.now() + VERIFICATION_EXPIRY_DAYS * 24 * 60 * 60 * 1000)
  };

  return result;
}

/**
 * Withdraws consent for a testimonial (GDPR compliance)
 */
export async function withdrawConsent(testimonialId: string, reason?: string): Promise<void> {
  const testimonial = testimonials.find(t => t.id === testimonialId);
  if (!testimonial) {
    throw new Error('Testimonial not found');
  }

  testimonial.privacySettings.consentWithdrawn = true;
  testimonial.privacySettings.consentWithdrawnAt = new Date();
  testimonial.isPublished = false;
  testimonial.updatedAt = new Date();

  // Add withdrawal reason to moderation notes
  testimonial.moderationNotes = `Consent withdrawn: ${reason || 'No reason provided'}`;
}

/**
 * Gets testimonials with filtering and pagination
 */
export function getTestimonials(
  filters: TestimonialFilters = {},
  limit: number = 50,
  offset: number = 0
): Testimonial[] {
  let filtered = [...testimonials];

  // Apply filters
  if (filters.verificationStatus) {
    filtered = filtered.filter(t => t.verificationStatus === filters.verificationStatus);
  }

  if (filters.privacyLevel) {
    filtered = filtered.filter(t => t.privacySettings.level === filters.privacyLevel);
  }

  if (filters.caseType) {
    filtered = filtered.filter(t => t.author.caseType === filters.caseType);
  }

  if (filters.caseOutcome) {
    filtered = filtered.filter(t => t.caseOutcome === filters.caseOutcome);
  }

  if (filters.rating) {
    filtered = filtered.filter(t => t.rating === filters.rating);
  }

  if (filters.tags && filters.tags.length > 0) {
    filtered = filtered.filter(t =>
      filters.tags!.some(tag => t.tags.includes(tag))
    );
  }

  if (filters.dateRange) {
    filtered = filtered.filter(t =>
      t.createdAt >= filters.dateRange!.start &&
      t.createdAt <= filters.dateRange!.end
    );
  }

  if (filters.isPublished !== undefined) {
    filtered = filtered.filter(t => t.isPublished === filters.isPublished);
  }

  // Apply pagination
  return filtered.slice(offset, offset + limit);
}

/**
 * Gets published testimonials for public display
 */
export function getPublishedTestimonials(
  limit: number = 10,
  caseType?: string
): Testimonial[] {
  return getTestimonials(
    {
      isPublished: true,
      verificationStatus: 'verified',
      caseType
    },
    limit
  );
}

/**
 * Gets testimonial statistics
 */
export function getTestimonialStats(): TestimonialStats {
  const total = testimonials.length;
  const verified = testimonials.filter(t => t.verificationStatus === 'verified').length;
  const pending = testimonials.filter(t => t.verificationStatus === 'pending').length;
  const published = testimonials.filter(t => t.isPublished).length;
  const anonymous = testimonials.filter(t => t.author.isAnonymous).length;

  const ratings = testimonials.filter(t => t.rating).map(t => t.rating!);
  const averageRating = ratings.length > 0
    ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
    : 0;

  return {
    total,
    verified,
    pending,
    published,
    anonymous,
    averageRating: Math.round(averageRating * 10) / 10,
    recentActivity: {
      submissions: testimonials.filter(t =>
        t.createdAt > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      ).length,
      verifications: testimonials.filter(t =>
        t.verificationStatus === 'verified' &&
        t.verifiedAt && t.verifiedAt > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      ).length,
      publications: testimonials.filter(t =>
        t.isPublished &&
        t.publishedAt && t.publishedAt > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      ).length
    }
  };
}

/**
 * Publishes a verified testimonial
 */
export async function publishTestimonial(testimonialId: string, moderatedBy: string): Promise<Testimonial> {
  const testimonial = testimonials.find(t => t.id === testimonialId);
  if (!testimonial) {
    throw new Error('Testimonial not found');
  }

  if (testimonial.verificationStatus !== 'verified') {
    throw new Error('Only verified testimonials can be published');
  }

  if (testimonial.privacySettings.consentWithdrawn) {
    throw new Error('Cannot publish testimonial with withdrawn consent');
  }

  testimonial.isPublished = true;
  testimonial.publishedAt = new Date();
  testimonial.moderatedBy = moderatedBy;
  testimonial.moderatedAt = new Date();
  testimonial.updatedAt = new Date();

  return testimonial;
}

/**
 * Updates video upload progress
 */
export function updateVideoUploadProgress(
  testimonialId: string,
  progress: VideoUploadProgress
): void {
  uploadProgress.set(testimonialId, progress);
}

/**
 * Gets video upload progress
 */
export function getVideoUploadProgress(testimonialId: string): VideoUploadProgress | undefined {
  return uploadProgress.get(testimonialId);
}

/**
 * Anonymizes testimonial data for privacy compliance
 */
export function anonymizeTestimonial(testimonial: Testimonial): Testimonial {
  const anonymized = { ...testimonial };

  if (anonymized.privacySettings.level === 'anonymous' || anonymized.author.isAnonymous) {
    anonymized.author.name = undefined;
    anonymized.author.location = undefined;
    anonymized.author.initials = 'AN';
  }

  if (anonymized.privacySettings.level === 'blurred') {
    // Mark for video blurring if it's a video testimonial
    if (anonymized.type === 'video' && anonymized.videoMetadata) {
      anonymized.videoMetadata = {
        duration: anonymized.videoMetadata.duration,
        resolution: anonymized.videoMetadata.resolution,
        hasBlurredFaces: true,
        hasAlteredVoice: anonymized.privacySettings.allowVoiceAlteration,
        fileSize: anonymized.videoMetadata.fileSize,
        mimeType: anonymized.videoMetadata.mimeType,
        thumbnailUrl: anonymized.videoMetadata.thumbnailUrl,
        transcript: anonymized.videoMetadata.transcript
      };
    }
  }

  return anonymized;
}

/**
 * Validates testimonial content for appropriateness
 */
export function validateTestimonialContent(content: string): { valid: boolean; reason?: string } {
  if (content.length < 10) {
    return { valid: false, reason: 'Testimonial must be at least 10 characters long' };
  }

  if (content.length > 2000) {
    return { valid: false, reason: 'Testimonial must be under 2000 characters' };
  }

  // Check for inappropriate content (basic validation)
  const inappropriateWords = ['spam', 'inappropriate'];
  const lowerContent = content.toLowerCase();

  for (const word of inappropriateWords) {
    if (lowerContent.includes(word)) {
      return { valid: false, reason: 'Content contains inappropriate language' };
    }
  }

  return { valid: true };
}

/**
 * Generates verification badge data for display
 */
export function getVerificationBadgeData(testimonial: Testimonial): {
  isVerified: boolean;
  badgeText: string;
  badgeColor: string;
  expiresAt?: Date;
} {
  if (testimonial.verificationStatus === 'verified') {
    return {
      isVerified: true,
      badgeText: 'Verified Testimonial',
      badgeColor: 'green',
      expiresAt: new Date(Date.now() + VERIFICATION_EXPIRY_DAYS * 24 * 60 * 60 * 1000)
    };
  }

  if (testimonial.verificationStatus === 'pending') {
    return {
      isVerified: false,
      badgeText: 'Under Review',
      badgeColor: 'yellow'
    };
  }

  return {
    isVerified: false,
    badgeText: 'Verification Required',
    badgeColor: 'gray'
  };
}

/**
 * Exports testimonial data for GDPR compliance
 */
export function exportTestimonialData(testimonialId: string): {
  testimonial: Testimonial;
  verificationDocuments: VerificationDocument[];
  privacySettings: PrivacySettings;
  auditTrail: {
    createdAt: Date;
    updatedAt: Date;
    publishedAt?: Date;
    verifiedAt?: Date;
    moderatedAt?: Date;
  };
} {
  const testimonial = testimonials.find(t => t.id === testimonialId);
  if (!testimonial) {
    throw new Error('Testimonial not found');
  }

  return {
    testimonial: anonymizeTestimonial(testimonial),
    verificationDocuments: testimonial.verificationDocuments,
    privacySettings: testimonial.privacySettings,
    auditTrail: {
      createdAt: testimonial.createdAt,
      updatedAt: testimonial.updatedAt,
      publishedAt: testimonial.publishedAt,
      verifiedAt: testimonial.verifiedAt,
      moderatedAt: testimonial.moderatedAt
    }
  };
}