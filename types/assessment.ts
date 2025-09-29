// Assessment Types for Domestic Abuse Risk Assessment Tool

export type RiskLevel = 'low' | 'medium' | 'high';

export type QuestionType = 'yes-no' | 'multiple-choice' | 'scale' | 'text' | 'emergency-check';

export interface AssessmentQuestion {
  id: string;
  category: AssessmentCategory;
  type: QuestionType;
  question: string;
  description?: string;
  options?: string[];
  required: boolean;
  weight: number; // Weight for scoring (1-10)
  triggersEmergency?: boolean; // If true, bypasses assessment for emergency
}

export type AssessmentCategory =
  | 'physical-safety'
  | 'emotional-abuse'
  | 'financial-control'
  | 'children-impact'
  | 'living-situation'
  | 'incident-history'
  | 'support-network'
  | 'legal-protection';

export interface QuestionResponse {
  questionId: string;
  answer: string | number | boolean;
  skipped?: boolean;
}

export interface AssessmentResponses {
  responses: QuestionResponse[];
  startedAt: Date;
  completedAt?: Date;
  currentStep: number;
  isEmergency: boolean;
}

export interface RiskScore {
  totalScore: number;
  maxPossibleScore: number;
  percentage: number;
  level: RiskLevel;
  categoryScores: Record<AssessmentCategory, number>;
}

export interface AssessmentResult {
  id: string;
  responses: AssessmentResponses;
  score: RiskScore;
  recommendations: Recommendation[];
  emergencyContacts: EmergencyContact[];
  generatedAt: Date;
  expiresAt: Date;
}

export interface Recommendation {
  id: string;
  type: 'immediate' | 'short-term' | 'long-term';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  actions: string[];
  resources?: Resource[];
}

export interface Resource {
  id: string;
  name: string;
  type: 'helpline' | 'website' | 'service' | 'app';
  url?: string;
  phone?: string;
  description: string;
  available24_7?: boolean;
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  service: string;
  available: boolean;
  description: string;
}

export interface AssessmentSettings {
  enableEmailResults: boolean;
  enableSaveResults: boolean;
  autoDeleteAfter: number; // days
  encryptLocalStorage: boolean;
}

export interface PrivacySettings {
  deleteAfterUse: boolean;
  shareWithTrustedContact: boolean;
  trustedContactEmail?: string;
  anonymizeResults: boolean;
}

// Constants for risk level thresholds
export const RISK_THRESHOLDS = {
  LOW_MAX: 30,
  MEDIUM_MAX: 70,
  HIGH_MIN: 71
} as const;

// Emergency trigger questions
export const EMERGENCY_QUESTIONS = [
  'immediate-danger',
  'recent-violence',
  'threat-to-life'
] as const;