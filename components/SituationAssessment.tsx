// Situation Assessment Component
// Interactive questionnaire to understand user situation and needs

'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  SituationAssessmentQuestion,
  AssessmentOption,
  SituationAssessmentResult,
  PersonalizationCategory,
  UserSituation
} from '@/types/personalization';
import { PersonalizationEngine } from '@/lib/personalization';
import { AlertTriangle, Shield, Users, Scale, Heart, DollarSign, CheckCircle } from 'lucide-react';

interface SituationAssessmentProps {
  onComplete: (result: SituationAssessmentResult) => void;
  onSkip?: () => void;
  className?: string;
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
  emergency: 'bg-red-100 text-red-800 border-red-200',
  planning: 'bg-blue-100 text-blue-800 border-blue-200',
  legal: 'bg-green-100 text-green-800 border-green-200',
  'post-separation': 'bg-purple-100 text-purple-800 border-purple-200',
  children: 'bg-orange-100 text-orange-800 border-orange-200',
  financial: 'bg-yellow-100 text-yellow-800 border-yellow-200'
};

export function SituationAssessment({ onComplete, onSkip, className }: SituationAssessmentProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, string | string[] | boolean>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState<SituationAssessmentResult | null>(null);

  const questions: SituationAssessmentQuestion[] = [
    {
      id: 'emergency_situation',
      question: 'What best describes your current situation?',
      type: 'single',
      category: 'emergency',
      options: [
        { id: 'immediate_danger', text: 'I am in immediate danger or fear for my safety', value: 'immediate_danger', riskLevel: 'critical', category: 'emergency' },
        { id: 'recent_incident', text: 'I have experienced recent abuse or violence', value: 'recent_incident', riskLevel: 'high', category: 'emergency' },
        { id: 'ongoing_abuse', text: 'I am experiencing ongoing abuse', value: 'ongoing_abuse', riskLevel: 'high', category: 'emergency' },
        { id: 'planning_to_leave', text: 'I am planning to leave an abusive situation', value: 'planning_to_leave', riskLevel: 'medium', category: 'planning' },
        { id: 'already_left', text: 'I have already left an abusive situation', value: 'already_left', riskLevel: 'low', category: 'legal' },
        { id: 'seeking_information', text: 'I am seeking information about my rights', value: 'seeking_information', riskLevel: 'none', category: 'legal' }
      ],
      required: true,
      riskIndicator: true,
      affectsEmergency: true
    },
    {
      id: 'children',
      question: 'Are children involved in your situation?',
      type: 'single',
      category: 'children',
      options: [
        { id: 'children_present', text: 'Yes, children are currently with me', value: 'children_present', riskLevel: 'high', category: 'children', affectsChildren: true },
        { id: 'children_elsewhere', text: 'Yes, but children are in another location', value: 'children_elsewhere', riskLevel: 'medium', category: 'children', affectsChildren: true },
        { id: 'expecting_children', text: 'I am pregnant or expecting children', value: 'expecting_children', riskLevel: 'medium', category: 'children', affectsChildren: true },
        { id: 'no_children', text: 'No children are involved', value: 'no_children', riskLevel: 'none' }
      ],
      required: true,
      affectsChildren: true
    },
    {
      id: 'relationship_status',
      question: 'What is your current relationship status?',
      type: 'single',
      category: 'legal',
      options: [
        { id: 'married', text: 'Married', value: 'married', category: 'legal' },
        { id: 'cohabiting', text: 'Living together', value: 'cohabiting', category: 'legal' },
        { id: 'separated', text: 'Separated', value: 'separated', category: 'post-separation' },
        { id: 'divorced', text: 'Divorced', value: 'divorced', category: 'post-separation' },
        { id: 'single', text: 'Single/Never married', value: 'single', category: 'legal' }
      ],
      required: true
    },
    {
      id: 'legal_needs',
      question: 'What legal support do you need? (Select all that apply)',
      type: 'multiple',
      category: 'legal',
      options: [
        { id: 'protection_order', text: 'Protection/Restraining Order', value: 'protection_order', category: 'legal' },
        { id: 'divorce', text: 'Divorce proceedings', value: 'divorce', category: 'legal' },
        { id: 'child_custody', text: 'Child custody arrangements', value: 'child_custody', category: 'children' },
        { id: 'financial_support', text: 'Financial support/Maintenance', value: 'financial_support', category: 'financial' },
        { id: 'housing', text: 'Housing/Emergency accommodation', value: 'housing', category: 'planning' },
        { id: 'immigration', text: 'Immigration/Visa issues', value: 'immigration', category: 'legal' }
      ],
      required: false
    },
    {
      id: 'safety_concerns',
      question: 'What are your main safety concerns? (Select all that apply)',
      type: 'multiple',
      category: 'emergency',
      options: [
        { id: 'physical_violence', text: 'Physical violence', value: 'physical_violence', riskLevel: 'high', category: 'emergency' },
        { id: 'threats', text: 'Threats or intimidation', value: 'threats', riskLevel: 'medium', category: 'emergency' },
        { id: 'stalking', text: 'Stalking or harassment', value: 'stalking', riskLevel: 'medium', category: 'emergency' },
        { id: 'financial_control', text: 'Financial control', value: 'financial_control', riskLevel: 'low', category: 'financial' },
        { id: 'isolation', text: 'Social isolation', value: 'isolation', riskLevel: 'low', category: 'planning' }
      ],
      required: false,
      riskIndicator: true
    },
    {
      id: 'financial_situation',
      question: 'Are you experiencing financial difficulties related to your situation?',
      type: 'boolean',
      category: 'financial',
      required: false,
      affectsFinancial: true
    },
    {
      id: 'support_network',
      question: 'Do you have a support network (friends, family, or other services) you can rely on?',
      type: 'boolean',
      category: 'planning',
      required: false
    },
    {
      id: 'previous_experience',
      question: 'Have you accessed legal or support services before?',
      type: 'boolean',
      category: 'legal',
      required: false
    }
  ];

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleResponse = useCallback((questionId: string, value: string | string[] | boolean) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  }, []);

  const handleNext = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      handleComplete();
    }
  }, [currentQuestionIndex]);

  const handlePrevious = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  }, [currentQuestionIndex]);

  const handleComplete = useCallback(async () => {
    setIsLoading(true);

    try {
      const engine = PersonalizationEngine.getInstance();
      const result = engine.assessSituation(responses);

      setAssessmentResult(result);
      setShowResults(true);
    } catch (error) {
      console.error('Assessment error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [responses]);

  const handleFinish = useCallback(() => {
    if (assessmentResult) {
      onComplete(assessmentResult);
    }
  }, [assessmentResult, onComplete]);

  const getRiskBadgeVariant = (level: string) => {
    switch (level) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  const renderQuestion = (question: SituationAssessmentQuestion) => {
    const IconComponent = CATEGORY_ICONS[question.category];

    return (
      <div className="space-y-6">
        {/* Question Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2 rounded-full ${CATEGORY_COLORS[question.category]}`}>
            <IconComponent className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <Badge variant="outline" className="mb-2">
              Question {currentQuestionIndex + 1} of {questions.length}
            </Badge>
            <h3 className="text-lg font-semibold text-gray-900">
              {question.question}
            </h3>
          </div>
        </div>

        {/* Response Input */}
        <div className="space-y-4">
          {question.type === 'single' && question.options && (
            <RadioGroup
              value={responses[question.id] || ''}
              onValueChange={(value) => handleResponse(question.id, value)}
              className="space-y-3"
            >
              {question.options.map((option) => (
                <div key={option.id} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50">
                  <RadioGroupItem value={option.value} id={option.id} />
                  <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                    {option.text}
                  </Label>
                  {option.riskLevel && option.riskLevel !== 'none' && (
                    <Badge variant={getRiskBadgeVariant(option.riskLevel)} className="text-xs">
                      {option.riskLevel} risk
                    </Badge>
                  )}
                </div>
              ))}
            </RadioGroup>
          )}

          {question.type === 'multiple' && question.options && (
            <div className="space-y-3">
              {question.options.map((option) => (
                <div key={option.id} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50">
                  <Checkbox
                    id={option.id}
                    checked={
                      Array.isArray(responses[question.id])
                        ? (responses[question.id] as string[]).includes(option.value as string)
                        : false
                    }
                    onCheckedChange={(checked) => {
                      const currentValues = (Array.isArray(responses[question.id]) ? responses[question.id] : []) as string[];
                      if (checked) {
                        handleResponse(question.id, [...currentValues, option.value as string]);
                      } else {
                        handleResponse(question.id, currentValues.filter(v => v !== option.value));
                      }
                    }}
                  />
                  <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                    {option.text}
                  </Label>
                  {option.riskLevel && option.riskLevel !== 'none' && (
                    <Badge variant={getRiskBadgeVariant(option.riskLevel)} className="text-xs">
                      {option.riskLevel} risk
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          )}

          {question.type === 'boolean' && (
            <RadioGroup
              value={responses[question.id]?.toString() || ''}
              onValueChange={(value: string) => handleResponse(question.id, value === 'true')}
              className="space-y-3"
            >
              <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50">
                <RadioGroupItem value="true" id={`${question.id}_yes`} />
                <Label htmlFor={`${question.id}_yes`} className="cursor-pointer">Yes</Label>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50">
                <RadioGroupItem value="false" id={`${question.id}_no`} />
                <Label htmlFor={`${question.id}_no`} className="cursor-pointer">No</Label>
              </div>
            </RadioGroup>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-6">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </Button>

          <Button
            onClick={handleNext}
            disabled={question.required && !responses[question.id]}
          >
            {currentQuestionIndex === questions.length - 1 ? 'Complete Assessment' : 'Next'}
          </Button>
        </div>
      </div>
    );
  };

  const renderResults = (result: SituationAssessmentResult) => {
    const getEmergencyMessage = () => {
      if (result.needsEmergencySupport) {
        return {
          title: 'Emergency Support Needed',
          description: 'Based on your responses, you may need immediate assistance. Please consider contacting emergency services or a domestic abuse support organisation.',
          variant: 'destructive' as const
        };
      }
      return null;
    };

    const emergencyMessage = getEmergencyMessage();

    return (
      <div className="space-y-6">
        <div className="text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Assessment Complete
          </h3>
          <p className="text-gray-600">
            Thank you for sharing your situation. Here are our recommendations:
          </p>
        </div>

        {emergencyMessage && (
          <Alert variant={emergencyMessage.variant}>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>{emergencyMessage.title}</strong>
              <br />
              {emergencyMessage.description}
            </AlertDescription>
          </Alert>
        )}

        {/* Situation Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className={`p-1.5 rounded-full ${CATEGORY_COLORS[result.recommendedPath]}`}>
                {React.createElement(CATEGORY_ICONS[result.recommendedPath], { className: "w-4 h-4" })}
              </div>
              Your Recommended Path: {result.recommendedPath.replace('-', ' ').toUpperCase()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Emergency Level</h4>
                <Badge variant={getRiskBadgeVariant(result.situation.emergencyLevel)}>
                  {result.situation.emergencyLevel.toUpperCase()}
                </Badge>
              </div>

              {result.situation.hasChildren && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Children Involved</h4>
                  <p className="text-sm text-gray-600">
                    {result.situation.childrenInvolved ? 'Children may be affected' : 'Children are involved but not directly affected'}
                  </p>
                </div>
              )}

              {result.situation.financialConcerns && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Financial Concerns</h4>
                  <p className="text-sm text-gray-600">Financial support and rights information available</p>
                </div>
              )}

              {result.riskFactors.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Risk Factors Identified</h4>
                  <div className="flex flex-wrap gap-2">
                    {result.riskFactors.map((factor, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {factor.replace('_', ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Immediate Actions */}
        {result.immediateActions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Immediate Actions Recommended</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {result.immediateActions.map((action, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm">{action}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Continue Button */}
        <div className="flex justify-center pt-4">
          <Button onClick={handleFinish} size="lg">
            Continue to Personalised Support
          </Button>
        </div>
      </div>
    );
  };

  if (showResults && assessmentResult) {
    return (
      <div className={`max-w-2xl mx-auto ${className}`}>
        {renderResults(assessmentResult)}
      </div>
    );
  }

  return (
    <div className={`max-w-2xl mx-auto ${className}`}>
      <Card>
        <CardHeader>
          <div className="space-y-4">
            <div>
              <CardTitle>Situation Assessment</CardTitle>
              <CardDescription>
                Help us understand your situation so we can provide the most relevant support and information.
              </CardDescription>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {renderQuestion(currentQuestion)}
        </CardContent>
      </Card>

      {/* Skip Option */}
      {onSkip && (
        <div className="text-center mt-4">
          <Button variant="ghost" onClick={onSkip} className="text-sm text-gray-500">
            Skip assessment for now
          </Button>
        </div>
      )}
    </div>
  );
}