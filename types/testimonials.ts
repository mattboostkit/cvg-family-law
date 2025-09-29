export type VerificationStatus = 'pending' | 'verified' | 'rejected' | 'expired';
export type PrivacyLevel = 'public' | 'anonymous' | 'blurred' | 'private';
export type TestimonialType = 'text' | 'video' | 'audio';
export type CaseOutcome = 'successful' | 'ongoing' | 'confidential' | 'partial_success';

export interface TestimonialAuthor {
  id: string;
  name?: string; // Optional for anonymous testimonials
  initials?: string; // For anonymous testimonials
  location?: string; // City/region only for privacy
  caseType: string;
  representationDate?: Date;
  isAnonymous: boolean;
}

export interface VerificationDocument {
  id: string;
  type: 'identity' | 'case_outcome' | 'sra_reference' | 'consent_form';
  status: VerificationStatus;
  uploadedAt: Date;
  verifiedAt?: Date;
  verifiedBy?: string;
  documentHash: string;
  expiresAt?: Date;
  metadata?: {
    fileName?: string;
    fileSize?: number;
    mimeType?: string;
  };
}

export interface PrivacySettings {
  level: PrivacyLevel;
  allowVideoBlurring: boolean;
  allowVoiceAlteration: boolean;
  allowNameDisplay: boolean;
  allowLocationDisplay: boolean;
  consentWithdrawn: boolean;
  consentWithdrawnAt?: Date;
}

export interface VideoMetadata {
  duration: number;
  resolution: {
    width: number;
    height: number;
  };
  thumbnailUrl?: string;
  transcript?: string;
  hasBlurredFaces: boolean;
  hasAlteredVoice: boolean;
  fileSize: number;
  mimeType: string;
}

export interface Testimonial {
  id: string;
  type: TestimonialType;
  author: TestimonialAuthor;
  content: string; // Text content for text testimonials
  videoMetadata?: VideoMetadata; // For video testimonials
  caseOutcome: CaseOutcome;
  rating?: number; // 1-5 stars
  tags: string[]; // Categories like 'child_custody', 'domestic_violence', etc.
  verificationStatus: VerificationStatus;
  verificationDocuments: VerificationDocument[];
  privacySettings: PrivacySettings;
  isPublished: boolean;
  publishedAt?: Date;
  verifiedAt?: Date;
  verifiedBy?: string;
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date; // For automatic removal
  viewCount: number;
  helpfulCount: number;
  moderatedBy?: string;
  moderatedAt?: Date;
  moderationNotes?: string;
}

export interface TestimonialSubmission {
  type: TestimonialType;
  content: string;
  caseType: string;
  caseOutcome: CaseOutcome;
  rating?: number;
  tags: string[];
  privacySettings: PrivacySettings;
  verificationDocuments: File[];
  consentGiven: boolean;
  isAnonymous: boolean;
  authorName?: string;
  authorLocation?: string;
}

export interface VerificationRequest {
  testimonialId: string;
  verificationType: 'identity' | 'case_outcome' | 'sra_compliance';
  documents: File[];
  additionalInfo?: string;
  requestedBy: string;
  requestedAt: Date;
}

export interface TestimonialVerificationResult {
  testimonialId: string;
  status: VerificationStatus;
  verifiedBy: string;
  verifiedAt: Date;
  verificationMethod: string;
  notes?: string;
  validUntil?: Date;
}

export interface TestimonialFilters {
  verificationStatus?: VerificationStatus;
  privacyLevel?: PrivacyLevel;
  caseType?: string;
  caseOutcome?: CaseOutcome;
  rating?: number;
  tags?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  isPublished?: boolean;
}

export interface TestimonialStats {
  total: number;
  verified: number;
  pending: number;
  published: number;
  anonymous: number;
  averageRating: number;
  recentActivity: {
    submissions: number;
    verifications: number;
    publications: number;
  };
}

export interface VideoUploadProgress {
  testimonialId: string;
  stage: 'uploading' | 'processing' | 'transcoding' | 'generating_thumbnail' | 'complete' | 'error';
  progress: number; // 0-100
  error?: string;
  estimatedTimeRemaining?: number;
}

export interface TestimonialCarouselProps {
  testimonials: Testimonial[];
  showVerificationBadges?: boolean;
  showVideoControls?: boolean;
  autoplay?: boolean;
  showThumbnails?: boolean;
  itemsPerView?: number;
  className?: string;
}

export interface VideoPlayerProps {
  testimonial: Testimonial;
  autoplay?: boolean;
  showControls?: boolean;
  showTranscript?: boolean;
  privacyMode?: boolean;
  onPrivacyToggle?: () => void;
  className?: string;
}

export interface VerificationBadgeProps {
  testimonial: Testimonial;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
  className?: string;
}