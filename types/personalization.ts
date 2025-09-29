// Personalization Types for Domestic Abuse Law Firm Website

export interface UserSituation {
  emergencyLevel: 'none' | 'low' | 'medium' | 'high' | 'critical';
  planningStage: 'research' | 'planning' | 'ready-to-leave' | 'left' | 'post-separation';
  hasChildren: boolean;
  childrenInvolved: boolean;
  financialConcerns: boolean;
  legalNeeds: string[];
  riskFactors: string[];
  urgencyLevel: 'low' | 'medium' | 'high' | 'immediate';
}

export interface PersonalizationPreferences {
  situation: UserSituation;
  contentPreferences: {
    showEmergencyInfo: boolean;
    showPlanningResources: boolean;
    showLegalGuidance: boolean;
    showChildrenResources: boolean;
    showFinancialInfo: boolean;
  };
  notificationPreferences: {
    emergencyAlerts: boolean;
    safetyReminders: boolean;
    legalUpdates: boolean;
    resourceRecommendations: boolean;
  };
  privacySettings: {
    storeLocally: boolean;
    trackProgress: boolean;
    allowRecommendations: boolean;
  };
}

export interface PersonalizedContent {
  id: string;
  title: string;
  description: string;
  content: string;
  category: PersonalizationCategory;
  situation: UserSituation;
  priority: 'low' | 'medium' | 'high' | 'critical';
  tags: string[];
  estimatedReadTime: number;
  lastUpdated: Date;
}

export interface ContentRecommendation {
  contentId: string;
  content: PersonalizedContent;
  relevanceScore: number;
  reasons: string[];
  actionRequired: boolean;
  urgencyLevel: 'low' | 'medium' | 'high' | 'immediate';
}

export interface UserJourney {
  currentStage: PersonalizationCategory;
  completedStages: PersonalizationCategory[];
  progress: {
    emergency: number;
    planning: number;
    legal: number;
    postSeparation: number;
    children: number;
    financial: number;
  };
  nextSteps: UserJourneyStep[];
  completedSteps: UserJourneyStep[];
}

export interface UserJourneyStep {
  id: string;
  title: string;
  description: string;
  category: PersonalizationCategory;
  estimatedDuration: number;
  prerequisites: string[];
  contentIds: string[];
  completed: boolean;
  completedAt?: Date;
}

export type PersonalizationCategory =
  | 'emergency'
  | 'planning'
  | 'legal'
  | 'post-separation'
  | 'children'
  | 'financial';

export interface PersonalizationContext {
  userSituation: UserSituation;
  preferences: PersonalizationPreferences;
  journey: UserJourney;
  recommendations: ContentRecommendation[];
  lastUpdated: Date;
  sessionId: string;
}

export interface SituationAssessmentQuestion {
  id: string;
  question: string;
  type: 'single' | 'multiple' | 'boolean' | 'scale';
  category: PersonalizationCategory;
  options?: AssessmentOption[];
  required: boolean;
  riskIndicator?: boolean;
  affectsEmergency?: boolean;
  affectsChildren?: boolean;
  affectsFinancial?: boolean;
}

export interface AssessmentOption {
  id: string;
  text: string;
  value: string | number;
  riskLevel?: 'none' | 'low' | 'medium' | 'high' | 'critical';
  category?: PersonalizationCategory;
  nextQuestion?: string;
  affectsEmergency?: boolean;
  affectsChildren?: boolean;
  affectsFinancial?: boolean;
}

export interface SituationAssessmentResult {
  situation: UserSituation;
  confidence: number;
  riskFactors: string[];
  immediateActions: string[];
  recommendedPath: PersonalizationCategory;
  needsEmergencySupport: boolean;
}

// Storage interfaces for privacy-compliant local storage
export interface PersonalizationStorage {
  preferences: PersonalizationPreferences;
  journey: UserJourney;
  lastAssessment: SituationAssessmentResult;
  storageVersion: string;
  lastUpdated: Date;
  resetToken?: string;
}

// Analytics and tracking (privacy-compliant)
export interface PersonalizationAnalytics {
  sessionId: string;
  events: PersonalizationEvent[];
  journeyProgress: Record<string, number>;
  contentEngagement: Record<string, number>;
  recommendationsShown: number;
  recommendationsClicked: number;
}

export interface PersonalizationEvent {
  type: 'assessment_completed' | 'content_viewed' | 'recommendation_clicked' | 'journey_step_completed' | 'settings_changed';
  category: PersonalizationCategory;
  timestamp: Date;
  metadata?: Record<string, any>;
}