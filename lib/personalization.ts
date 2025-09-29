// Personalization Engine for Domestic Abuse Law Firm Website
// Privacy-compliant, local storage-based personalization system

import {
  UserSituation,
  PersonalizationPreferences,
  PersonalizationContext,
  UserJourney,
  PersonalizationCategory,
  PersonalizationStorage,
  SituationAssessmentResult,
  PersonalizationAnalytics,
  PersonalizationEvent,
  UserJourneyStep
} from '@/types/personalization';

const STORAGE_KEY = 'cvgn_personalization';
const ANALYTICS_KEY = 'cvgn_personalization_analytics';
const STORAGE_VERSION = '1.0.0';

export class PersonalizationEngine {
  private static instance: PersonalizationEngine;
  private context: PersonalizationContext | null = null;
  private analytics: PersonalizationAnalytics;
  private storage: PersonalizationStorage | null = null;

  private constructor() {
    this.analytics = this.loadAnalytics();
    this.loadContext();
  }

  public static getInstance(): PersonalizationEngine {
    if (!PersonalizationEngine.instance) {
      PersonalizationEngine.instance = new PersonalizationEngine();
    }
    return PersonalizationEngine.instance;
  }

  // Context Management
  public getContext(): PersonalizationContext | null {
    return this.context;
  }

  public updateContext(updates: Partial<PersonalizationContext>): void {
    if (!this.context) return;

    this.context = {
      ...this.context,
      ...updates,
      lastUpdated: new Date()
    };

    this.saveContext();
    this.trackEvent('settings_changed', 'planning');
  }

  // Situation Assessment
  public assessSituation(responses: Record<string, string | number | boolean | string[]>): SituationAssessmentResult {
    const situation = this.calculateUserSituation(responses);
    const confidence = this.calculateConfidence(responses);
    const riskFactors = this.identifyRiskFactors(responses);
    const immediateActions = this.getImmediateActions(situation);
    const recommendedPath = this.determineRecommendedPath(situation);
    const needsEmergencySupport = situation.emergencyLevel === 'critical' || situation.emergencyLevel === 'high';

    const result: SituationAssessmentResult = {
      situation,
      confidence,
      riskFactors,
      immediateActions,
      recommendedPath,
      needsEmergencySupport
    };

    // Update context with new assessment
    if (!this.context) {
      this.initializeContext(situation, result);
    } else {
      this.context.userSituation = situation;
      this.context.lastUpdated = new Date();
    }

    this.saveContext();
    this.trackEvent('assessment_completed', recommendedPath);

    return result;
  }

  // Journey Management
  public getJourney(): UserJourney | null {
    return this.context?.journey || null;
  }

  public updateJourneyProgress(category: PersonalizationCategory, progress: number): void {
    if (!this.context?.journey) return;

    const progressKey = category === 'post-separation' ? 'postSeparation' : category;
    this.context.journey.progress[progressKey as keyof UserJourney['progress']] = Math.min(100, Math.max(0, progress));
    this.saveContext();
  }

  public completeJourneyStep(stepId: string): void {
    if (!this.context?.journey) return;

    const step = this.context.journey.nextSteps.find(s => s.id === stepId);
    if (step) {
      step.completed = true;
      step.completedAt = new Date();

      // Move to completed steps
      this.context.journey.completedSteps.push(step);
      this.context.journey.nextSteps = this.context.journey.nextSteps.filter(s => s.id !== stepId);

      // Update progress
      this.updateJourneyProgress(step.category, 100);

      this.saveContext();
      this.trackEvent('journey_step_completed', step.category, { stepId });
    }
  }

  public getNextSteps(): UserJourneyStep[] {
    return this.context?.journey?.nextSteps || [];
  }

  // Content Personalization
  public getPersonalizedContent(category?: PersonalizationCategory): any[] {
    // This would integrate with your CMS/content system
    // For now, returning mock personalized content
    return this.getMockPersonalizedContent(category);
  }

  public getHomepagePersonalization(): {
    heroContent: any;
    priorityActions: any[];
    recommendedResources: any[];
    emergencyVisible: boolean;
  } {
    if (!this.context) {
      return this.getDefaultHomepageContent();
    }

    const { userSituation } = this.context;
    const emergencyVisible = userSituation.emergencyLevel === 'critical' ||
                           userSituation.emergencyLevel === 'high';

    return {
      heroContent: this.getPersonalizedHeroContent(userSituation),
      priorityActions: this.getPriorityActions(userSituation),
      recommendedResources: this.getRecommendedResources(userSituation),
      emergencyVisible
    };
  }

  // Privacy and Storage Management
  public resetPersonalization(): void {
    this.context = null;
    this.storage = null;
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(ANALYTICS_KEY);
    this.trackEvent('settings_changed', 'planning', { action: 'reset' });
  }

  public exportPersonalizationData(): Partial<PersonalizationStorage> | null {
    return this.storage ? {
      preferences: this.storage.preferences,
      journey: this.storage.journey,
      lastAssessment: this.storage.lastAssessment,
      lastUpdated: this.storage.lastUpdated
    } : null;
  }

  public updatePreferences(preferences: Partial<PersonalizationPreferences>): void {
    if (!this.context) return;

    this.context.preferences = {
      ...this.context.preferences,
      ...preferences
    };

    this.saveContext();
    this.trackEvent('settings_changed', 'planning');
  }

  // Analytics (Privacy-compliant)
  private trackEvent(
    type: PersonalizationEvent['type'],
    category: PersonalizationCategory,
    metadata?: Record<string, unknown>
  ): void {
    const event: PersonalizationEvent = {
      type,
      category,
      timestamp: new Date(),
      metadata
    };

    this.analytics.events.push(event);

    // Keep only last 100 events to prevent storage bloat
    if (this.analytics.events.length > 100) {
      this.analytics.events = this.analytics.events.slice(-100);
    }

    this.saveAnalytics();
  }

  private loadAnalytics(): PersonalizationAnalytics {
    try {
      const stored = localStorage.getItem(ANALYTICS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert date strings back to Date objects
        parsed.events = parsed.events.map((event: any) => ({
          ...event,
          timestamp: new Date(event.timestamp)
        }));
        return parsed;
      }
    } catch (error) {
      console.warn('Failed to load personalization analytics:', error);
    }

    return {
      sessionId: this.generateSessionId(),
      events: [],
      journeyProgress: {},
      contentEngagement: {},
      recommendationsShown: 0,
      recommendationsClicked: 0
    };
  }

  private saveAnalytics(): void {
    try {
      localStorage.setItem(ANALYTICS_KEY, JSON.stringify(this.analytics));
    } catch (error) {
      console.warn('Failed to save personalization analytics:', error);
    }
  }

  // Context Storage
  private loadContext(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.storageVersion === STORAGE_VERSION) {
          this.storage = parsed;
          this.context = {
            userSituation: parsed.lastAssessment?.situation || this.getDefaultSituation(),
            preferences: parsed.preferences || this.getDefaultPreferences(),
            journey: parsed.journey || this.getDefaultJourney(),
            recommendations: [],
            lastUpdated: new Date(parsed.lastUpdated),
            sessionId: this.analytics.sessionId
          };
        }
      }
    } catch (error) {
      console.warn('Failed to load personalization context:', error);
      this.initializeDefaultContext();
    }
  }

  private saveContext(): void {
    if (!this.context) return;

    const storage: PersonalizationStorage = {
      preferences: this.context.preferences,
      journey: this.context.journey,
      lastAssessment: {
        situation: this.context.userSituation,
        confidence: 0.8, // Would be calculated from assessment
        riskFactors: [],
        immediateActions: [],
        recommendedPath: this.determineRecommendedPath(this.context.userSituation),
        needsEmergencySupport: this.context.userSituation.emergencyLevel === 'critical'
      },
      storageVersion: STORAGE_VERSION,
      lastUpdated: new Date(),
      resetToken: this.generateResetToken()
    };

    this.storage = storage;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(storage));
    } catch (error) {
      console.warn('Failed to save personalization context:', error);
    }
  }

  private initializeContext(situation: UserSituation, assessment: SituationAssessmentResult): void {
    this.context = {
      userSituation: situation,
      preferences: this.getDefaultPreferences(),
      journey: this.createJourneyForSituation(situation),
      recommendations: [],
      lastUpdated: new Date(),
      sessionId: this.analytics.sessionId
    };
  }

  private initializeDefaultContext(): void {
    this.context = {
      userSituation: this.getDefaultSituation(),
      preferences: this.getDefaultPreferences(),
      journey: this.getDefaultJourney(),
      recommendations: [],
      lastUpdated: new Date(),
      sessionId: this.analytics.sessionId
    };
  }

  // Default Values
  private getDefaultSituation(): UserSituation {
    return {
      emergencyLevel: 'none',
      planningStage: 'research',
      hasChildren: false,
      childrenInvolved: false,
      financialConcerns: false,
      legalNeeds: [],
      riskFactors: [],
      urgencyLevel: 'low'
    };
  }

  private getDefaultPreferences(): PersonalizationPreferences {
    return {
      situation: this.getDefaultSituation(),
      contentPreferences: {
        showEmergencyInfo: true,
        showPlanningResources: true,
        showLegalGuidance: true,
        showChildrenResources: false,
        showFinancialInfo: false
      },
      notificationPreferences: {
        emergencyAlerts: true,
        safetyReminders: true,
        legalUpdates: false,
        resourceRecommendations: true
      },
      privacySettings: {
        storeLocally: true,
        trackProgress: true,
        allowRecommendations: true
      }
    };
  }

  private getDefaultJourney(): UserJourney {
    return {
      currentStage: 'emergency',
      completedStages: [],
      progress: {
        emergency: 0,
        planning: 0,
        legal: 0,
        postSeparation: 0,
        children: 0,
        financial: 0
      },
      nextSteps: [],
      completedSteps: []
    };
  }

  // Situation Calculation Logic
  private calculateUserSituation(responses: Record<string, any>): UserSituation {
    // Emergency level detection
    const emergencyKeywords = ['immediate danger', 'threat to life', 'violence now', 'emergency'];
    const emergencyScore = this.calculateScore(responses, emergencyKeywords);

    let emergencyLevel: UserSituation['emergencyLevel'] = 'none';
    if (emergencyScore >= 0.8) emergencyLevel = 'critical';
    else if (emergencyScore >= 0.6) emergencyLevel = 'high';
    else if (emergencyScore >= 0.4) emergencyLevel = 'medium';
    else if (emergencyScore >= 0.2) emergencyLevel = 'low';

    // Planning stage detection
    const planningStage = this.determinePlanningStage(responses);

    // Children involvement
    const hasChildren = responses.children === 'yes' || responses.children_involved === true;
    const childrenInvolved = responses.children_affected === true || responses.custody_concerns === true;

    // Financial concerns
    const financialConcerns = responses.financial_issues === true || responses.property_concerns === true;

    // Legal needs
    const legalNeeds = this.extractLegalNeeds(responses);

    // Risk factors
    const riskFactors = this.extractRiskFactors(responses);

    // Urgency level
    const urgencyLevel = this.calculateUrgencyLevel(emergencyLevel, riskFactors);

    return {
      emergencyLevel,
      planningStage,
      hasChildren,
      childrenInvolved,
      financialConcerns,
      legalNeeds,
      riskFactors,
      urgencyLevel
    };
  }

  private calculateConfidence(responses: Record<string, any>): number {
    const requiredQuestions = ['emergency_situation', 'planning_stage', 'children'];
    const answeredQuestions = requiredQuestions.filter(q => responses[q] !== undefined);
    return answeredQuestions.length / requiredQuestions.length;
  }

  private identifyRiskFactors(responses: Record<string, any>): string[] {
    const riskFactors: string[] = [];

    if (responses.physical_violence === true) riskFactors.push('physical_violence');
    if (responses.children_present === true) riskFactors.push('children_present');
    if (responses.financial_control === true) riskFactors.push('financial_control');
    if (responses.isolation === true) riskFactors.push('social_isolation');
    if (responses.escalation === true) riskFactors.push('pattern_escalation');

    return riskFactors;
  }

  private getImmediateActions(situation: UserSituation): string[] {
    const actions: string[] = [];

    if (situation.emergencyLevel === 'critical') {
      actions.push('Call emergency services (999)');
      actions.push('Contact domestic abuse helpline');
      actions.push('Go to a safe location immediately');
    } else if (situation.emergencyLevel === 'high') {
      actions.push('Contact domestic abuse support services');
      actions.push('Create a safety plan');
      actions.push('Document incidents');
    }

    if (situation.childrenInvolved) {
      actions.push('Ensure children\'s immediate safety');
      actions.push('Contact children\'s services if needed');
    }

    return actions;
  }

  private determineRecommendedPath(situation: UserSituation): PersonalizationCategory {
    if (situation.emergencyLevel === 'critical' || situation.emergencyLevel === 'high') {
      return 'emergency';
    } else if (situation.planningStage === 'planning' || situation.planningStage === 'ready-to-leave') {
      return 'planning';
    } else if (situation.legalNeeds.length > 0) {
      return 'legal';
    } else if (situation.planningStage === 'post-separation') {
      return 'post-separation';
    } else if (situation.childrenInvolved) {
      return 'children';
    } else if (situation.financialConcerns) {
      return 'financial';
    }

    return 'planning'; // Default fallback
  }

  private determinePlanningStage(responses: Record<string, any>): UserSituation['planningStage'] {
    if (responses.immediate_danger === true) return 'research';
    if (responses.planning_to_leave === true) return 'planning';
    if (responses.ready_to_leave === true) return 'ready-to-leave';
    if (responses.already_left === true) return 'left';
    if (responses.post_separation === true) return 'post-separation';

    return 'research';
  }

  private extractLegalNeeds(responses: Record<string, any>): string[] {
    const needs: string[] = [];

    if (responses.protection_order === true) needs.push('protection_order');
    if (responses.divorce === true) needs.push('divorce');
    if (responses.custody === true) needs.push('child_custody');
    if (responses.financial_support === true) needs.push('financial_support');
    if (responses.housing === true) needs.push('housing');

    return needs;
  }

  private extractRiskFactors(responses: Record<string, any>): string[] {
    const factors: string[] = [];

    if (responses.stalking === true) factors.push('stalking');
    if (responses.threats === true) factors.push('death_threats');
    if (responses.weapon === true) factors.push('weapon_involved');
    if (responses.substance_abuse === true) factors.push('substance_abuse');
    if (responses.mental_health === true) factors.push('mental_health_concerns');

    return factors;
  }

  private calculateUrgencyLevel(
    emergencyLevel: UserSituation['emergencyLevel'],
    riskFactors: string[]
  ): UserSituation['urgencyLevel'] {
    if (emergencyLevel === 'critical') return 'immediate';
    if (emergencyLevel === 'high') return 'high';
    if (riskFactors.includes('weapon_involved') || riskFactors.includes('death_threats')) return 'high';
    if (riskFactors.length >= 2) return 'medium';

    return 'low';
  }

  private calculateScore(responses: Record<string, any>, keywords: string[]): number {
    const responseText = JSON.stringify(responses).toLowerCase();
    const matches = keywords.filter(keyword => responseText.includes(keyword)).length;
    return matches / keywords.length;
  }

  private createJourneyForSituation(situation: UserSituation): UserJourney {
    const journey = this.getDefaultJourney();
    journey.currentStage = this.determineRecommendedPath(situation);

    // Create appropriate next steps based on situation
    journey.nextSteps = this.createNextStepsForSituation(situation);

    return journey;
  }

  private createNextStepsForSituation(situation: UserSituation): UserJourneyStep[] {
    const steps: UserJourneyStep[] = [];

    // Emergency steps
    if (situation.emergencyLevel !== 'none') {
      steps.push({
        id: 'emergency_assessment',
        title: 'Immediate Safety Assessment',
        description: 'Complete emergency safety evaluation',
        category: 'emergency',
        estimatedDuration: 10,
        prerequisites: [],
        contentIds: ['emergency_safety_guide', 'emergency_contacts'],
        completed: false
      });
    }

    // Planning steps
    if (situation.planningStage === 'research' || situation.planningStage === 'planning') {
      steps.push({
        id: 'safety_planning',
        title: 'Create Safety Plan',
        description: 'Develop a comprehensive safety plan',
        category: 'planning',
        estimatedDuration: 30,
        prerequisites: situation.emergencyLevel === 'none' ? [] : ['emergency_assessment'],
        contentIds: ['safety_planning_guide', 'emergency_bag_checklist'],
        completed: false
      });
    }

    return steps;
  }

  // Content Personalization Methods
  private getPersonalizedHeroContent(situation: UserSituation): any {
    if (situation.emergencyLevel === 'critical' || situation.emergencyLevel === 'high') {
      return {
        title: 'Emergency Support Available',
        subtitle: 'Get immediate help and support',
        ctaText: 'Get Emergency Help Now',
        variant: 'emergency'
      };
    } else if (situation.planningStage === 'planning') {
      return {
        title: 'Plan Your Safety',
        subtitle: 'Take control with our safety planning resources',
        ctaText: 'Start Safety Planning',
        variant: 'planning'
      };
    } else {
      return {
        title: 'Expert Legal Support',
        subtitle: 'Specialist domestic abuse legal services',
        ctaText: 'Get Free Consultation',
        variant: 'default'
      };
    }
  }

  private getPriorityActions(situation: UserSituation): any[] {
    const actions: any[] = [];

    if (situation.emergencyLevel !== 'none') {
      actions.push({
        id: 'emergency_contact',
        title: 'Emergency Contacts',
        description: 'Immediate help and support numbers',
        priority: 'critical',
        action: 'call_emergency'
      });
    }

    if (situation.childrenInvolved) {
      actions.push({
        id: 'children_safety',
        title: 'Children\'s Safety',
        description: 'Protecting children in domestic abuse situations',
        priority: 'high',
        action: 'view_children_resources'
      });
    }

    actions.push({
      id: 'legal_consultation',
      title: 'Free Consultation',
      description: 'Speak with our specialist lawyers',
      priority: 'medium',
      action: 'book_consultation'
    });

    return actions;
  }

  private getRecommendedResources(situation: UserSituation): any[] {
    const resources: any[] = [];

    if (situation.emergencyLevel !== 'none') {
      resources.push({
        id: 'emergency_safety',
        title: 'Emergency Safety Guide',
        type: 'guide',
        category: 'emergency'
      });
    }

    if (situation.financialConcerns) {
      resources.push({
        id: 'financial_rights',
        title: 'Financial Rights & Support',
        type: 'guide',
        category: 'financial'
      });
    }

    if (situation.childrenInvolved) {
      resources.push({
        id: 'child_custody',
        title: 'Child Custody & Protection',
        type: 'guide',
        category: 'children'
      });
    }

    return resources;
  }

  private getMockPersonalizedContent(category?: PersonalizationCategory): any[] {
    // Mock content - in real implementation, this would come from CMS
    return [
      {
        id: 'emergency_safety_guide',
        title: 'Emergency Safety Planning',
        content: 'Immediate steps for safety...',
        category: 'emergency',
        priority: 'critical'
      },
      {
        id: 'safety_planning_guide',
        title: 'Safety Planning Checklist',
        content: 'Comprehensive safety planning...',
        category: 'planning',
        priority: 'high'
      }
    ];
  }

  private getDefaultHomepageContent(): any {
    return {
      heroContent: {
        title: 'Expert Domestic Abuse Legal Support',
        subtitle: 'Specialist lawyers providing confidential advice and representation',
        ctaText: 'Get Free Consultation',
        variant: 'default'
      },
      priorityActions: [],
      recommendedResources: [],
      emergencyVisible: false
    };
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateResetToken(): string {
    return Math.random().toString(36).substr(2, 16);
  }
}