// Personalized Content Component
// Dynamic content renderer based on user situation and journey

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ContentRecommendation,
  PersonalizedContent as ContentType,
  PersonalizationContext,
  PersonalizationCategory,
  UserJourney
} from '@/types/personalization';
import { PersonalizationEngine } from '@/lib/personalization';
import { RecommendationEngine } from '@/lib/recommendations';
import {
  AlertTriangle,
  Shield,
  Users,
  Scale,
  Heart,
  DollarSign,
  Clock,
  CheckCircle,
  ExternalLink,
  BookOpen,
  Phone,
  ArrowRight
} from 'lucide-react';

interface PersonalizedContentProps {
  context?: PersonalizationContext;
  category?: PersonalizationCategory;
  className?: string;
  showRecommendations?: boolean;
  maxRecommendations?: number;
}

const CATEGORY_ICONS = {
  emergency: AlertTriangle,
  planning: Shield,
  legal: Scale,
  'post-separation': Heart,
  children: Users,
  financial: DollarSign
};

const CATEGORY_COLORS = {
  emergency: 'bg-red-50 border-red-200 text-red-800',
  planning: 'bg-blue-50 border-blue-200 text-blue-800',
  legal: 'bg-green-50 border-green-200 text-green-800',
  'post-separation': 'bg-purple-50 border-purple-200 text-purple-800',
  children: 'bg-orange-50 border-orange-200 text-orange-800',
  financial: 'bg-yellow-50 border-yellow-200 text-yellow-800'
};

const PRIORITY_COLORS = {
  critical: 'bg-red-100 text-red-800 border-red-300',
  high: 'bg-orange-100 text-orange-800 border-orange-300',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  low: 'bg-gray-100 text-gray-800 border-gray-300'
};

export function PersonalizedContent({
  context,
  category,
  className,
  showRecommendations = true,
  maxRecommendations = 5
}: PersonalizedContentProps) {
  const [recommendations, setRecommendations] = useState<ContentRecommendation[]>([]);
  const [journey, setJourney] = useState<UserJourney | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('recommendations');

  useEffect(() => {
    loadPersonalizedContent();
  }, [context, category]);

  const loadPersonalizedContent = async () => {
    setLoading(true);

    try {
      let currentContext = context;
      const currentJourney = journey;

      // Get context if not provided
      if (!currentContext) {
        const engine = PersonalizationEngine.getInstance();
        const contextFromEngine = engine.getContext();
        if (contextFromEngine) {
          currentContext = contextFromEngine;
        }
      }

      if (currentContext) {
        setJourney(currentContext.journey);

        // Get recommendations
        if (showRecommendations) {
          const recommendationEngine = RecommendationEngine.getInstance();
          let recs: ContentRecommendation[];

          if (category) {
            recs = recommendationEngine.getRecommendationsByCategory(
              category,
              currentContext.userSituation,
              currentContext.preferences,
              maxRecommendations
            );
          } else {
            recs = recommendationEngine.getRecommendations(
              currentContext.userSituation,
              currentContext.preferences,
              currentContext.journey,
              maxRecommendations
            );
          }

          setRecommendations(recs);
        }
      }
    } catch (error) {
      console.error('Failed to load personalized content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContentAction = (recommendation: ContentRecommendation, action: string) => {
    // Track engagement
    const recommendationEngine = RecommendationEngine.getInstance();
    recommendationEngine.trackContentEngagement(recommendation.contentId, 'click');

    // Handle different actions
    switch (action) {
      case 'view':
        // Navigate to content or open modal
        console.log('Viewing content:', recommendation.contentId);
        break;
      case 'external':
        // Open external resource
        if (recommendation.content.tags.includes('external')) {
          window.open(recommendation.content.content, '_blank');
        }
        break;
      case 'call':
        // Initiate phone call
        if (recommendation.content.tags.includes('helpline')) {
          window.location.href = `tel:${recommendation.content.content}`;
        }
        break;
    }
  };

  const getProgressPercentage = (category: PersonalizationCategory): number => {
    if (!journey) return 0;
    const categoryKey = category === 'post-separation' ? 'postSeparation' : category;
    return journey.progress[categoryKey as keyof UserJourney['progress']] || 0;
  };

  const getNextSteps = (): ContentRecommendation[] => {
    return recommendations.filter(rec => rec.actionRequired);
  };

  const getEmergencyContent = (): ContentRecommendation[] => {
    return recommendations.filter(rec =>
      rec.content.category === 'emergency' ||
      rec.urgencyLevel === 'immediate' ||
      rec.urgencyLevel === 'high'
    );
  };

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {[1, 2, 3].map(i => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!context || recommendations.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Personalised Content Available</h3>
        <p className="text-gray-600">
          Complete the situation assessment to receive personalised recommendations.
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Journey Progress Overview */}
      {journey && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Your Journey Progress
            </CardTitle>
            <CardDescription>
              Track your progress through different areas of support
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {(['emergency', 'planning', 'legal', 'post-separation', 'children', 'financial'] as PersonalizationCategory[]).map(cat => {
                const IconComponent = CATEGORY_ICONS[cat];
                const progress = getProgressPercentage(cat);
                const categoryKey = cat === 'post-separation' ? 'postSeparation' : cat;

                return (
                  <div key={cat} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <IconComponent className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium capitalize">
                        {cat.replace('-', ' ')}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-600">{Math.round(progress)}% complete</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Emergency Content Alert */}
      {getEmergencyContent().length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Emergency Support Available</strong>
            <br />
            Immediate assistance and crisis support resources are available for your situation.
          </AlertDescription>
        </Alert>
      )}

      {/* Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="recommendations">Recommended</TabsTrigger>
          <TabsTrigger value="emergency">Emergency</TabsTrigger>
          <TabsTrigger value="next-steps">Next Steps</TabsTrigger>
        </TabsList>

        <TabsContent value="recommendations" className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-4">Recommended for You</h3>
            <div className="grid gap-4">
              {recommendations.map((recommendation) => (
                <ContentCard
                  key={recommendation.contentId}
                  recommendation={recommendation}
                  onAction={handleContentAction}
                />
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="emergency" className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-4">Emergency Support</h3>
            {getEmergencyContent().length > 0 ? (
              <div className="grid gap-4">
                {getEmergencyContent().map((recommendation) => (
                  <ContentCard
                    key={recommendation.contentId}
                    recommendation={recommendation}
                    onAction={handleContentAction}
                    showUrgency={true}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center py-8">
                No emergency content currently recommended for your situation.
              </p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="next-steps" className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-4">Your Next Steps</h3>
            {getNextSteps().length > 0 ? (
              <div className="grid gap-4">
                {getNextSteps().map((recommendation) => (
                  <ContentCard
                    key={recommendation.contentId}
                    recommendation={recommendation}
                    onAction={handleContentAction}
                    showProgress={true}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center py-8">
                Complete the recommended content above to unlock your next steps.
              </p>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Immediate support options based on your situation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="justify-start h-auto p-4"
              onClick={() => window.location.href = 'tel:999'}
            >
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-red-600" />
                <div className="text-left">
                  <div className="font-medium">Emergency Services</div>
                  <div className="text-sm text-gray-600">Call 999</div>
                </div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="justify-start h-auto p-4"
              onClick={() => window.open('https://www.nationaldahelpline.org.uk/', '_blank')}
            >
              <div className="flex items-center gap-3">
                <ExternalLink className="w-5 h-5 text-blue-600" />
                <div className="text-left">
                  <div className="font-medium">National DA Helpline</div>
                  <div className="text-sm text-gray-600">Get confidential support</div>
                </div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Content Card Component
interface ContentCardProps {
  recommendation: ContentRecommendation;
  onAction: (recommendation: ContentRecommendation, action: string) => void;
  showUrgency?: boolean;
  showProgress?: boolean;
}

function ContentCard({ recommendation, onAction, showUrgency = false, showProgress = false }: ContentCardProps) {
  const { content, reasons, urgencyLevel } = recommendation;
  const IconComponent = CATEGORY_ICONS[content.category];

  const getActionButton = () => {
    if (content.tags.includes('helpline')) {
      return (
        <Button
          onClick={() => onAction(recommendation, 'call')}
          className="w-full"
          variant={content.priority === 'critical' ? 'default' : 'outline'}
        >
          <Phone className="w-4 h-4 mr-2" />
          Call Now
        </Button>
      );
    } else if (content.tags.includes('external')) {
      return (
        <Button
          onClick={() => onAction(recommendation, 'external')}
          className="w-full"
          variant="outline"
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Visit Resource
        </Button>
      );
    } else {
      return (
        <Button
          onClick={() => onAction(recommendation, 'view')}
          className="w-full"
          variant={content.priority === 'critical' ? 'default' : 'outline'}
        >
          <BookOpen className="w-4 h-4 mr-2" />
          Read More
        </Button>
      );
    }
  };

  return (
    <Card className={`transition-all hover:shadow-md ${content.priority === 'critical' ? 'ring-2 ring-red-200' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${CATEGORY_COLORS[content.category]}`}>
              <IconComponent className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-lg">{content.title}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  {content.category.replace('-', ' ')}
                </Badge>
                <Badge className={`text-xs ${PRIORITY_COLORS[content.priority]}`}>
                  {content.priority}
                </Badge>
                {showUrgency && urgencyLevel !== 'low' && (
                  <Badge variant="destructive" className="text-xs">
                    {urgencyLevel}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            {content.estimatedReadTime}min
          </div>
        </div>

        <CardDescription className="mt-2">
          {content.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Relevance Reasons */}
        {reasons.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-medium text-gray-700 mb-2">Why this is recommended:</p>
            <ul className="text-xs text-gray-600 space-y-1">
              {reasons.slice(0, 2).map((reason, index) => (
                <li key={index} className="flex items-start gap-1">
                  <div className="w-1 h-1 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
                  {reason}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Progress Indicator */}
        {showProgress && (
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Progress</span>
              <span>{Math.round(recommendation.relevanceScore * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-green-600 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${recommendation.relevanceScore * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="flex gap-2">
          {getActionButton()}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAction(recommendation, 'view')}
            className="px-3"
          >
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}