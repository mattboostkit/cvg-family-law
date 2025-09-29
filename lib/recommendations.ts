// Content Recommendation Engine for Domestic Abuse Law Firm Website
// Provides intelligent, situation-aware content recommendations

import {
  UserSituation,
  PersonalizationPreferences,
  ContentRecommendation,
  PersonalizedContent,
  PersonalizationCategory,
  UserJourney
} from '@/types/personalization';

export interface ContentItem {
  id: string;
  title: string;
  description: string;
  content: string;
  category: PersonalizationCategory;
  tags: string[];
  priority: 'low' | 'medium' | 'high' | 'critical';
  estimatedReadTime: number;
  situationRelevance: {
    emergency: number;
    planning: number;
    legal: number;
    postSeparation: number;
    children: number;
    financial: number;
  };
  prerequisites?: string[];
  relatedContent?: string[];
  lastUpdated: Date;
  published: boolean;
}

export class RecommendationEngine {
  private static instance: RecommendationEngine;
  private contentDatabase: Map<string, ContentItem> = new Map();

  private constructor() {
    this.initializeContentDatabase();
  }

  public static getInstance(): RecommendationEngine {
    if (!RecommendationEngine.instance) {
      RecommendationEngine.instance = new RecommendationEngine();
    }
    return RecommendationEngine.instance;
  }

  // Main recommendation method
  public getRecommendations(
    situation: UserSituation,
    preferences: PersonalizationPreferences,
    journey: UserJourney,
    limit: number = 5
  ): ContentRecommendation[] {
    const allContent = Array.from(this.contentDatabase.values())
      .filter(content => content.published)
      .filter(content => this.isRelevantToPreferences(content, preferences));

    // Score each content item
    const scoredContent = allContent.map(content => ({
      content,
      score: this.calculateRelevanceScore(content, situation, journey, preferences)
    }));

    // Sort by score and return top recommendations
    const topContent = scoredContent
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => this.createRecommendation(item.content, item.score, situation));

    return topContent;
  }

  // Category-specific recommendations
  public getRecommendationsByCategory(
    category: PersonalizationCategory,
    situation: UserSituation,
    preferences: PersonalizationPreferences,
    limit: number = 10
  ): ContentRecommendation[] {
    const categoryContent = Array.from(this.contentDatabase.values())
      .filter(content => content.category === category && content.published)
      .filter(content => this.isRelevantToPreferences(content, preferences));

    const scoredContent = categoryContent.map(content => ({
      content,
      score: this.calculateRelevanceScore(content, situation, {
        currentStage: category,
        completedStages: [],
        progress: { emergency: 0, planning: 0, legal: 0, postSeparation: 0, children: 0, financial: 0 },
        nextSteps: [],
        completedSteps: []
      }, preferences)
    }));

    return scoredContent
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => this.createRecommendation(item.content, item.score, situation));
  }

  // Emergency content recommendations
  public getEmergencyRecommendations(situation: UserSituation): ContentRecommendation[] {
    if (situation.emergencyLevel === 'none') return [];

    const emergencyContent = Array.from(this.contentDatabase.values())
      .filter(content => content.category === 'emergency' && content.published)
      .filter(content => this.isEmergencyRelevant(content, situation));

    return emergencyContent
      .sort((a, b) => this.getPriorityWeight(b.priority) - this.getPriorityWeight(a.priority))
      .slice(0, 3)
      .map(content => this.createRecommendation(content, 1.0, situation));
  }

  // Next steps recommendations based on journey
  public getNextStepRecommendations(journey: UserJourney, situation: UserSituation): ContentRecommendation[] {
    const currentStageContent = Array.from(this.contentDatabase.values())
      .filter(content => content.category === journey.currentStage && content.published);

    const recommendations = currentStageContent
      .filter(content => this.meetsPrerequisites(content, journey))
      .sort((a, b) => this.getPriorityWeight(b.priority) - this.getPriorityWeight(a.priority))
      .slice(0, 3)
      .map(content => this.createRecommendation(content, 0.9, situation));

    return recommendations;
  }

  // Search-based recommendations
  public searchRecommendations(
    query: string,
    situation: UserSituation,
    preferences: PersonalizationPreferences,
    limit: number = 5
  ): ContentRecommendation[] {
    const searchResults = Array.from(this.contentDatabase.values())
      .filter(content => content.published)
      .filter(content => this.isRelevantToPreferences(content, preferences))
      .filter(content =>
        content.title.toLowerCase().includes(query.toLowerCase()) ||
        content.description.toLowerCase().includes(query.toLowerCase()) ||
        content.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      );

    const scoredResults = searchResults.map(content => ({
      content,
      score: this.calculateSearchRelevanceScore(content, query, situation)
    }));

    return scoredResults
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => this.createRecommendation(item.content, item.score, situation));
  }

  // Private helper methods
  private calculateRelevanceScore(
    content: ContentItem,
    situation: UserSituation,
    journey: UserJourney,
    preferences: PersonalizationPreferences
  ): number {
    let score = 0;

    // Base situation relevance
    const categoryKey = content.category === 'post-separation' ? 'postSeparation' : content.category;
    const situationRelevance = content.situationRelevance[categoryKey] || 0;
    score += situationRelevance * 0.4;

    // Priority weight
    score += this.getPriorityWeight(content.priority) * 0.2;

    // Journey progress relevance
    const journeyProgress = journey.progress[categoryKey] || 0;
    if (journeyProgress < 100) {
      score += (100 - journeyProgress) / 100 * 0.2;
    }

    // User situation factors
    if (situation.emergencyLevel !== 'none' && content.category === 'emergency') {
      score += 0.3;
    }

    if (situation.childrenInvolved && content.category === 'children') {
      score += 0.2;
    }

    if (situation.financialConcerns && content.category === 'financial') {
      score += 0.2;
    }

    // Preference alignment
    if (preferences.contentPreferences.showEmergencyInfo && content.category === 'emergency') {
      score += 0.1;
    }

    // Recency boost for recently updated content
    const daysSinceUpdate = (Date.now() - content.lastUpdated.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceUpdate < 30) {
      score += 0.1;
    }

    return Math.min(1.0, score);
  }

  private calculateSearchRelevanceScore(
    content: ContentItem,
    query: string,
    situation: UserSituation
  ): number {
    let score = 0;
    const queryLower = query.toLowerCase();

    // Title match (highest weight)
    if (content.title.toLowerCase().includes(queryLower)) {
      score += 0.4;
    }

    // Description match
    if (content.description.toLowerCase().includes(queryLower)) {
      score += 0.3;
    }

    // Tag matches
    const tagMatches = content.tags.filter(tag =>
      tag.toLowerCase().includes(queryLower)
    ).length;
    score += (tagMatches / content.tags.length) * 0.2;

    // Situation relevance boost
    const categoryKey = content.category === 'post-separation' ? 'postSeparation' : content.category;
    const situationRelevance = content.situationRelevance[categoryKey] || 0;
    score += situationRelevance * 0.1;

    return Math.min(1.0, score);
  }

  private isRelevantToPreferences(content: ContentItem, preferences: PersonalizationPreferences): boolean {
    const contentPrefs = preferences.contentPreferences;

    switch (content.category) {
      case 'emergency':
        return contentPrefs.showEmergencyInfo;
      case 'planning':
        return contentPrefs.showPlanningResources;
      case 'legal':
        return contentPrefs.showLegalGuidance;
      case 'children':
        return contentPrefs.showChildrenResources;
      case 'financial':
        return contentPrefs.showFinancialInfo;
      case 'post-separation':
        return contentPrefs.showPlanningResources; // Post-separation uses planning resources
      default:
        return true;
    }
  }

  private isEmergencyRelevant(content: ContentItem, situation: UserSituation): boolean {
    if (situation.emergencyLevel === 'critical') {
      return content.priority === 'critical' || content.priority === 'high';
    } else if (situation.emergencyLevel === 'high') {
      return content.priority !== 'low';
    } else if (situation.emergencyLevel === 'medium') {
      return content.priority === 'high' || content.priority === 'medium';
    }

    return false;
  }

  private meetsPrerequisites(content: ContentItem, journey: UserJourney): boolean {
    if (!content.prerequisites || content.prerequisites.length === 0) {
      return true;
    }

    // Check if prerequisite content has been completed
    return content.prerequisites.every(prereqId => {
      return journey.completedSteps.some(step => step.contentIds.includes(prereqId));
    });
  }

  private getPriorityWeight(priority: ContentItem['priority']): number {
    switch (priority) {
      case 'critical': return 1.0;
      case 'high': return 0.8;
      case 'medium': return 0.6;
      case 'low': return 0.4;
      default: return 0.5;
    }
  }

  private createRecommendation(
    content: ContentItem,
    score: number,
    situation: UserSituation
  ): ContentRecommendation {
    const reasons: string[] = [];

    // Add relevance reasons
    const categoryKey = content.category === 'post-separation' ? 'postSeparation' : content.category;
    const situationRelevance = content.situationRelevance[categoryKey] || 0;

    if (situationRelevance > 0.7) {
      reasons.push(`Highly relevant to your current situation`);
    } else if (situationRelevance > 0.4) {
      reasons.push(`Relevant to your current needs`);
    }

    if (content.priority === 'critical' || content.priority === 'high') {
      reasons.push(`Important for your safety`);
    }

    if (situation.emergencyLevel !== 'none' && content.category === 'emergency') {
      reasons.push(`Emergency situation guidance`);
    }

    if (situation.childrenInvolved && content.category === 'children') {
      reasons.push(`Child protection information`);
    }

    if (situation.financialConcerns && content.category === 'financial') {
      reasons.push(`Financial rights and support`);
    }

    // Determine urgency
    let urgencyLevel: ContentRecommendation['urgencyLevel'] = 'low';
    if (content.priority === 'critical' || (situation.emergencyLevel === 'critical' && content.category === 'emergency')) {
      urgencyLevel = 'immediate';
    } else if (content.priority === 'high' || situation.emergencyLevel === 'high') {
      urgencyLevel = 'high';
    } else if (content.priority === 'medium' || situation.emergencyLevel === 'medium') {
      urgencyLevel = 'medium';
    }

    return {
      contentId: content.id,
      content: {
        id: content.id,
        title: content.title,
        description: content.description,
        content: content.content,
        category: content.category,
        situation: {
          emergencyLevel: 'none',
          planningStage: 'research',
          hasChildren: false,
          childrenInvolved: false,
          financialConcerns: false,
          legalNeeds: [],
          riskFactors: [],
          urgencyLevel: 'low'
        },
        priority: content.priority,
        tags: content.tags,
        estimatedReadTime: content.estimatedReadTime,
        lastUpdated: content.lastUpdated
      },
      relevanceScore: score,
      reasons,
      actionRequired: content.priority === 'critical' || content.priority === 'high',
      urgencyLevel
    };
  }

  // Content database initialization
  private initializeContentDatabase(): void {
    const contentItems: ContentItem[] = [
      // Emergency Content
      {
        id: 'emergency_safety_guide',
        title: 'Emergency Safety Planning Guide',
        description: 'Immediate steps to ensure your safety in crisis situations',
        content: 'When facing immediate danger...',
        category: 'emergency',
        tags: ['emergency', 'safety', 'crisis', 'immediate danger'],
        priority: 'critical',
        estimatedReadTime: 15,
        situationRelevance: {
          emergency: 1.0,
          planning: 0.3,
          legal: 0.1,
          postSeparation: 0.1,
          children: 0.8,
          financial: 0.1
        },
        lastUpdated: new Date('2024-01-15'),
        published: true
      },
      {
        id: 'emergency_contacts',
        title: 'Emergency Contact Numbers',
        description: 'Essential phone numbers for immediate help and support',
        content: 'Emergency services: 999...',
        category: 'emergency',
        tags: ['emergency', 'contacts', 'helpline', 'support'],
        priority: 'critical',
        estimatedReadTime: 5,
        situationRelevance: {
          emergency: 1.0,
          planning: 0.5,
          legal: 0.2,
          postSeparation: 0.2,
          children: 0.6,
          financial: 0.1
        },
        lastUpdated: new Date('2024-01-20'),
        published: true
      },
      // Safety Planning Content
      {
        id: 'safety_planning_guide',
        title: 'Safety Planning Checklist',
        description: 'Comprehensive guide to creating your personal safety plan',
        content: 'Safety planning involves...',
        category: 'planning',
        tags: ['safety planning', 'preparation', 'checklist', 'protection'],
        priority: 'high',
        estimatedReadTime: 25,
        situationRelevance: {
          emergency: 0.6,
          planning: 1.0,
          legal: 0.4,
          postSeparation: 0.3,
          children: 0.7,
          financial: 0.3
        },
        lastUpdated: new Date('2024-01-10'),
        published: true
      },
      {
        id: 'emergency_bag_checklist',
        title: 'Emergency Bag Essentials',
        description: 'What to pack in your emergency safety bag',
        content: 'Important documents, medications...',
        category: 'planning',
        tags: ['emergency bag', 'essentials', 'documents', 'preparation'],
        priority: 'medium',
        estimatedReadTime: 10,
        situationRelevance: {
          emergency: 0.7,
          planning: 0.9,
          legal: 0.6,
          postSeparation: 0.4,
          children: 0.8,
          financial: 0.4
        },
        lastUpdated: new Date('2024-01-12'),
        published: true
      },
      // Legal Content
      {
        id: 'protection_orders',
        title: 'Understanding Protection Orders',
        description: 'Legal protection options and how to obtain them',
        content: 'Protection orders are legal...',
        category: 'legal',
        tags: ['protection order', 'restraining order', 'legal protection', 'court'],
        priority: 'high',
        estimatedReadTime: 20,
        situationRelevance: {
          emergency: 0.5,
          planning: 0.7,
          legal: 1.0,
          postSeparation: 0.6,
          children: 0.5,
          financial: 0.2
        },
        lastUpdated: new Date('2024-01-08'),
        published: true
      },
      // Children Content
      {
        id: 'child_custody_guide',
        title: 'Child Custody and Protection',
        description: 'Legal rights and options for protecting children',
        content: 'When children are involved...',
        category: 'children',
        tags: ['child custody', 'children', 'protection', 'legal rights'],
        priority: 'high',
        estimatedReadTime: 25,
        situationRelevance: {
          emergency: 0.6,
          planning: 0.5,
          legal: 0.8,
          postSeparation: 0.7,
          children: 1.0,
          financial: 0.3
        },
        lastUpdated: new Date('2024-01-14'),
        published: true
      },
      // Financial Content
      {
        id: 'financial_rights',
        title: 'Financial Rights and Support',
        description: 'Understanding your financial rights and available support',
        content: 'Financial abuse is common...',
        category: 'financial',
        tags: ['financial rights', 'support', 'maintenance', 'property'],
        priority: 'medium',
        estimatedReadTime: 20,
        situationRelevance: {
          emergency: 0.2,
          planning: 0.4,
          legal: 0.7,
          postSeparation: 0.8,
          children: 0.6,
          financial: 1.0
        },
        lastUpdated: new Date('2024-01-16'),
        published: true
      }
    ];

    contentItems.forEach(item => {
      this.contentDatabase.set(item.id, item);
    });
  }

  // Content management methods
  public addContent(content: ContentItem): void {
    this.contentDatabase.set(content.id, content);
  }

  public updateContent(id: string, updates: Partial<ContentItem>): void {
    const existing = this.contentDatabase.get(id);
    if (existing) {
      this.contentDatabase.set(id, { ...existing, ...updates });
    }
  }

  public removeContent(id: string): void {
    this.contentDatabase.delete(id);
  }

  public getContent(id: string): ContentItem | undefined {
    return this.contentDatabase.get(id);
  }

  public getAllContent(): ContentItem[] {
    return Array.from(this.contentDatabase.values());
  }

  public getContentByCategory(category: PersonalizationCategory): ContentItem[] {
    return Array.from(this.contentDatabase.values())
      .filter(content => content.category === category && content.published);
  }

  // Analytics and optimization
  public trackContentEngagement(contentId: string, engagement: 'view' | 'click' | 'complete'): void {
    const content = this.contentDatabase.get(contentId);
    if (content) {
      // In a real implementation, this would update engagement metrics
      // For now, we just ensure the content exists
      console.log(`Content engagement tracked: ${contentId} - ${engagement}`);
    }
  }
}