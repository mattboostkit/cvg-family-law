// Risk Assessment Logic for Domestic Abuse Assessment Tool

import {
  AssessmentQuestion,
  AssessmentResult,
  AssessmentResponses,
  QuestionResponse,
  RiskScore,
  RiskLevel,
  Recommendation,
  EmergencyContact,
  Resource,
  RISK_THRESHOLDS,
  AssessmentCategory
} from '@/types/assessment';

// Emergency contact numbers for UK
export const EMERGENCY_CONTACTS: EmergencyContact[] = [
  {
    id: 'police',
    name: 'Police Emergency',
    phone: '999',
    service: 'Emergency Services',
    available: true,
    description: 'Call 999 if you are in immediate danger'
  },
  {
    id: 'national-helpline',
    name: 'National Domestic Abuse Helpline',
    phone: '0808 2000 247',
    service: 'Refuge',
    available: true,
    description: '24/7 support and advice for domestic abuse'
  },
  {
    id: 'womens-aid',
    name: "Women's Aid",
    phone: '0808 2000 247',
    service: 'National Charity',
    available: true,
    description: 'Support for women and children experiencing domestic abuse'
  },
  {
    id: 'mens-advice-line',
    name: "Men's Advice Line",
    phone: '0808 801 0327',
    service: 'Respect',
    available: true,
    description: 'Support for men experiencing domestic abuse'
  }
];

// Assessment Questions - 12 key risk factors
export const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  // Emergency check
  {
    id: 'immediate-danger',
    category: 'physical-safety',
    type: 'emergency-check',
    question: 'Are you in immediate danger right now?',
    description: 'This could include threats to your life, physical violence happening now, or feeling unsafe to continue',
    required: true,
    weight: 10,
    triggersEmergency: true
  },
  // Physical safety and violence
  {
    id: 'recent-violence',
    category: 'physical-safety',
    type: 'yes-no',
    question: 'Have you experienced physical violence in the last 30 days?',
    description: 'This includes hitting, pushing, choking, or any form of physical harm',
    required: true,
    weight: 9,
    triggersEmergency: true
  },
  {
    id: 'violence-frequency',
    category: 'physical-safety',
    type: 'multiple-choice',
    question: 'How often does physical violence occur?',
    options: ['Never', 'Rarely (once or twice a year)', 'Sometimes (monthly)', 'Often (weekly)', 'Very often (daily)'],
    required: true,
    weight: 8
  },
  {
    id: 'threats-weapons',
    category: 'physical-safety',
    type: 'yes-no',
    question: 'Has your partner ever threatened you with weapons or objects?',
    required: true,
    weight: 9
  },
  // Emotional/Psychological abuse
  {
    id: 'emotional-abuse',
    category: 'emotional-abuse',
    type: 'yes-no',
    question: 'Do you experience constant criticism, humiliation, or controlling behaviour?',
    required: true,
    weight: 6
  },
  {
    id: 'isolation-tactics',
    category: 'emotional-abuse',
    type: 'multiple-choice',
    question: 'How isolated do you feel from family and friends?',
    options: ['Not isolated', 'Somewhat isolated', 'Very isolated', 'Completely isolated'],
    required: true,
    weight: 7
  },
  // Financial control
  {
    id: 'financial-control',
    category: 'financial-control',
    type: 'yes-no',
    question: 'Does your partner control all finances and money decisions?',
    required: true,
    weight: 6
  },
  {
    id: 'access-to-money',
    category: 'financial-control',
    type: 'multiple-choice',
    question: 'Do you have independent access to money?',
    options: ['Full access', 'Limited access', 'No access', 'Access only with permission'],
    required: true,
    weight: 7
  },
  // Children impact
  {
    id: 'children-affected',
    category: 'children-impact',
    type: 'yes-no',
    question: 'Are children affected by the abuse in your home?',
    required: true,
    weight: 8
  },
  {
    id: 'children-witness',
    category: 'children-impact',
    type: 'yes-no',
    question: 'Have children witnessed violence or abuse?',
    required: true,
    weight: 8
  },
  // Living situation and safety
  {
    id: 'living-situation',
    category: 'living-situation',
    type: 'multiple-choice',
    question: 'What is your current living situation?',
    options: ['Living together', 'Living separately but same house', 'Separated', 'Planning to separate'],
    required: true,
    weight: 6
  },
  {
    id: 'safety-planning',
    category: 'living-situation',
    type: 'yes-no',
    question: 'Do you have a safety plan for dangerous situations?',
    required: true,
    weight: 5
  },
  // Incident history and escalation
  {
    id: 'incident-history',
    category: 'incident-history',
    type: 'multiple-choice',
    question: 'Has the abuse escalated in severity or frequency?',
    options: ['No change', 'Slightly worse', 'Much worse', 'Significantly escalated'],
    required: true,
    weight: 8
  },
  {
    id: 'previous-incidents',
    category: 'incident-history',
    type: 'multiple-choice',
    question: 'Have you reported previous incidents to police or authorities?',
    options: ['Never', 'Once', 'A few times', 'Multiple times'],
    required: true,
    weight: 5
  },
  // Support network
  {
    id: 'support-network',
    category: 'support-network',
    type: 'multiple-choice',
    question: 'How strong is your support network?',
    options: ['Strong - many supportive people', 'Moderate - some support', 'Limited - few people', 'None - isolated'],
    required: true,
    weight: 6
  },
  {
    id: 'trusted-contacts',
    category: 'support-network',
    type: 'multiple-choice',
    question: 'Do you have people you can contact in an emergency?',
    options: ['Yes - several', 'Yes - a few', 'Only one', 'None'],
    required: true,
    weight: 7
  },
  // Legal protection
  {
    id: 'protection-orders',
    category: 'legal-protection',
    type: 'yes-no',
    question: 'Do you have any legal protection orders in place?',
    required: true,
    weight: 4
  },
  {
    id: 'legal-help-needed',
    category: 'legal-protection',
    type: 'yes-no',
    question: 'Do you need help understanding your legal rights and options?',
    required: true,
    weight: 5
  }
];

// Calculate risk score from responses
export function calculateRiskScore(responses: QuestionResponse[]): RiskScore {
  let totalScore = 0;
  let maxPossibleScore = 0;
  const categoryScores: Record<AssessmentCategory, number> = {
    'physical-safety': 0,
    'emotional-abuse': 0,
    'financial-control': 0,
    'children-impact': 0,
    'living-situation': 0,
    'incident-history': 0,
    'support-network': 0,
    'legal-protection': 0
  };

  // Find corresponding questions for each response
  responses.forEach(response => {
    const question = ASSESSMENT_QUESTIONS.find(q => q.id === response.questionId);
    if (!question || response.skipped) return;

    maxPossibleScore += question.weight * 10; // Max score per question is weight * 10

    let questionScore = 0;

    switch (question.type) {
      case 'yes-no':
        questionScore = response.answer === true ? question.weight * 10 : 0;
        break;
      case 'multiple-choice':
        const answerIndex = parseInt(response.answer as string);
        // Score based on answer position (higher index = higher risk)
        questionScore = (answerIndex / (question.options?.length || 1)) * question.weight * 10;
        break;
      case 'scale':
        questionScore = (response.answer as number) * question.weight;
        break;
      case 'emergency-check':
        questionScore = response.answer === true ? question.weight * 10 : 0;
        break;
      default:
        questionScore = 0;
    }

    totalScore += questionScore;
    categoryScores[question.category] += questionScore;
  });

  const percentage = maxPossibleScore > 0 ? (totalScore / maxPossibleScore) * 100 : 0;

  let level: RiskLevel;
  if (percentage <= RISK_THRESHOLDS.LOW_MAX) {
    level = 'low';
  } else if (percentage <= RISK_THRESHOLDS.MEDIUM_MAX) {
    level = 'medium';
  } else {
    level = 'high';
  }

  return {
    totalScore,
    maxPossibleScore,
    percentage,
    level,
    categoryScores
  };
}

// Check if any emergency-triggering questions were answered positively
export function checkForEmergency(responses: QuestionResponse[]): boolean {
  return responses.some(response => {
    const question = ASSESSMENT_QUESTIONS.find(q => q.id === response.questionId);
    return question?.triggersEmergency && response.answer === true;
  });
}

// Generate recommendations based on risk score and responses
export function generateRecommendations(score: RiskScore, responses: QuestionResponse[]): Recommendation[] {
  const recommendations: Recommendation[] = [];

  // Immediate danger recommendations
  if (score.level === 'high' || checkForEmergency(responses)) {
    recommendations.push({
      id: 'emergency-immediate',
      type: 'immediate',
      priority: 'high',
      title: 'Seek Immediate Safety',
      description: 'Your situation indicates high risk. Please contact emergency services immediately.',
      actions: [
        'Call 999 if you are in immediate danger',
        'Go to a safe location away from the abuser',
        'Contact the National Domestic Abuse Helpline on 0808 2000 247',
        'Consider going to a police station or hospital if injured'
      ]
    });
  }

  // Physical safety recommendations
  if (score.categoryScores['physical-safety'] > 50) {
    recommendations.push({
      id: 'physical-safety',
      type: 'immediate',
      priority: 'high',
      title: 'Physical Safety Plan',
      description: 'Develop a comprehensive safety plan for physical protection.',
      actions: [
        'Identify safe areas in your home',
        'Plan escape routes and safe exits',
        'Keep emergency contacts readily available',
        'Consider a safe place to go in crisis'
      ]
    });
  }

  // Emotional support
  if (score.categoryScores['emotional-abuse'] > 40) {
    recommendations.push({
      id: 'emotional-support',
      type: 'short-term',
      priority: 'high',
      title: 'Emotional Support and Counselling',
      description: 'Seek professional support for emotional abuse recovery.',
      actions: [
        'Contact local domestic abuse support services',
        'Consider counselling or therapy',
        'Join support groups for survivors',
        'Document incidents for legal protection'
      ]
    });
  }

  // Financial independence
  if (score.categoryScores['financial-control'] > 40) {
    recommendations.push({
      id: 'financial-help',
      type: 'short-term',
      priority: 'medium',
      title: 'Financial Independence Support',
      description: 'Get help to establish financial independence and security.',
      actions: [
        'Contact Citizens Advice for benefits guidance',
        'Seek legal advice about financial rights',
        'Open separate bank account if safe to do so',
        'Explore emergency financial support options'
      ]
    });
  }

  // Children protection
  if (score.categoryScores['children-impact'] > 30) {
    recommendations.push({
      id: 'children-protection',
      type: 'immediate',
      priority: 'high',
      title: 'Children\'s Safety and Protection',
      description: 'Take immediate steps to protect any children involved.',
      actions: [
        'Contact Children\'s Services immediately',
        'Seek legal advice about child protection',
        'Document any impact on children',
        'Consider emergency child protection measures'
      ]
    });
  }

  // Legal protection
  if (score.categoryScores['legal-protection'] > 20 || score.level === 'high') {
    recommendations.push({
      id: 'legal-protection',
      type: 'short-term',
      priority: 'medium',
      title: 'Legal Protection and Rights',
      description: 'Understand your legal rights and protection options.',
      actions: [
        'Contact a family law solicitor specialising in domestic abuse',
        'Consider applying for protective orders',
        'Seek legal aid if eligible',
        'Document all incidents with dates and details'
      ]
    });
  }

  // Support network building
  if (score.categoryScores['support-network'] < 30) {
    recommendations.push({
      id: 'support-network',
      type: 'long-term',
      priority: 'medium',
      title: 'Build Support Network',
      description: 'Develop a strong support system for ongoing safety and wellbeing.',
      actions: [
        'Reconnect with trusted family and friends',
        'Join local support groups',
        'Access community resources',
        'Consider professional support services'
      ]
    });
  }

  // General low-risk recommendations
  if (score.level === 'low') {
    recommendations.push({
      id: 'monitor-situation',
      type: 'long-term',
      priority: 'low',
      title: 'Monitor and Document',
      description: 'Continue to monitor your situation and maintain safety awareness.',
      actions: [
        'Keep a record of concerning incidents',
        'Maintain emergency contacts',
        'Review safety plan regularly',
        'Seek support if situation changes'
      ]
    });
  }

  return recommendations;
}

// Get relevant resources based on risk level and location
export function getRelevantResources(riskLevel: RiskLevel): Resource[] {
  const baseResources: Resource[] = [
    {
      id: 'refuge-website',
      name: 'National Domestic Abuse Helpline',
      type: 'helpline',
      phone: '0808 2000 247',
      description: '24/7 confidential support and advice',
      available24_7: true
    },
    {
      id: 'womens-aid-website',
      name: 'Women\'s Aid',
      type: 'website',
      url: 'https://www.womensaid.org.uk',
      description: 'Information, support and resources for domestic abuse'
    },
    {
      id: 'respect-website',
      name: 'Respect',
      type: 'website',
      url: 'https://www.respect.uk.net',
      description: 'Support for people using abuse and those affected'
    }
  ];

  if (riskLevel === 'high') {
    return [
      ...baseResources,
      {
        id: 'emergency-accommodation',
        name: 'Emergency Accommodation',
        type: 'service',
        phone: '0808 2000 247',
        description: 'Immediate safe accommodation options'
      },
      {
        id: 'police-non-emergency',
        name: 'Police Non-Emergency',
        type: 'service',
        phone: '101',
        description: 'Report incidents and get police support'
      }
    ];
  }

  return baseResources;
}

// Create complete assessment result
export function createAssessmentResult(responses: AssessmentResponses): AssessmentResult {
  const score = calculateRiskScore(responses.responses);
  const recommendations = generateRecommendations(score, responses.responses);
  const emergencyContacts = EMERGENCY_CONTACTS;
  const relevantResources = getRelevantResources(score.level);

  // Add resources to recommendations
  recommendations.forEach(rec => {
    rec.resources = relevantResources.filter(r =>
      r.type === 'helpline' || r.type === 'service'
    );
  });

  return {
    id: generateResultId(),
    responses,
    score,
    recommendations,
    emergencyContacts,
    generatedAt: new Date(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
  };
}

// Generate unique result ID
function generateResultId(): string {
  return `assessment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Simple encryption for local storage (in production, use proper encryption)
export function encryptData(data: string, key: string): string {
  // Simple XOR encryption - in production use proper encryption library
  let result = '';
  for (let i = 0; i < data.length; i++) {
    result += String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return btoa(result);
}

export function decryptData(encryptedData: string, key: string): string {
  try {
    const data = atob(encryptedData);
    let result = '';
    for (let i = 0; i < data.length; i++) {
      result += String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return result;
  } catch {
    return '';
  }
}