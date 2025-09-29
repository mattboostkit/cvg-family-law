import { NextRequest, NextResponse } from 'next/server';
import {
  ConversionFunnel,
  FunnelStep,
  AnalyticsEvent,
  AnalyticsEventType,
  EventCategory
} from '@/types/analytics';

// In-memory storage for demo - in production, use database
let conversionFunnels: ConversionFunnel[] = [];
let funnelEvents: AnalyticsEvent[] = [];

// Initialize default conversion funnels
const defaultFunnels: Omit<ConversionFunnel, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'Emergency Contact Funnel',
    steps: [
      {
        id: 'emergency_view',
        name: 'Emergency Section Viewed',
        order: 1,
        eventType: AnalyticsEventType.EMERGENCY_CONTACT_VIEWED
      },
      {
        id: 'emergency_click',
        name: 'Emergency Button Clicked',
        order: 2,
        eventType: AnalyticsEventType.EMERGENCY_BUTTON_CLICK
      },
      {
        id: 'emergency_call',
        name: 'Emergency Call Initiated',
        order: 3,
        eventType: AnalyticsEventType.EMERGENCY_CALL_INITIATED
      }
    ]
  },
  {
    name: 'Risk Assessment Funnel',
    steps: [
      {
        id: 'assessment_start',
        name: 'Assessment Started',
        order: 1,
        eventType: AnalyticsEventType.RISK_ASSESSMENT_STARTED
      },
      {
        id: 'assessment_progress',
        name: 'Assessment in Progress',
        order: 2,
        eventType: AnalyticsEventType.RISK_ASSESSMENT_STEP_VIEWED
      },
      {
        id: 'assessment_complete',
        name: 'Assessment Completed',
        order: 3,
        eventType: AnalyticsEventType.RISK_ASSESSMENT_COMPLETED
      }
    ]
  },
  {
    name: 'Contact Form Funnel',
    steps: [
      {
        id: 'contact_view',
        name: 'Contact Page Viewed',
        order: 1,
        eventType: AnalyticsEventType.PAGE_VIEW,
        conditions: { pageTitle: 'Contact' }
      },
      {
        id: 'contact_start',
        name: 'Form Started',
        order: 2,
        eventType: AnalyticsEventType.CONTACT_FORM_STARTED
      },
      {
        id: 'contact_complete',
        name: 'Form Completed',
        order: 3,
        eventType: AnalyticsEventType.CONTACT_FORM_COMPLETED
      },
      {
        id: 'contact_submit',
        name: 'Form Submitted',
        order: 4,
        eventType: AnalyticsEventType.CONTACT_FORM_SUBMITTED
      }
    ]
  },
  {
    name: 'Appointment Booking Funnel',
    steps: [
      {
        id: 'booking_view',
        name: 'Booking Page Viewed',
        order: 1,
        eventType: AnalyticsEventType.PAGE_VIEW,
        conditions: { pageTitle: 'Booking' }
      },
      {
        id: 'booking_start',
        name: 'Booking Started',
        order: 2,
        eventType: AnalyticsEventType.APPOINTMENT_BOOKING_STARTED
      },
      {
        id: 'booking_complete',
        name: 'Booking Completed',
        order: 3,
        eventType: AnalyticsEventType.APPOINTMENT_BOOKING_COMPLETED
      }
    ]
  },
  {
    name: 'Resource Engagement Funnel',
    steps: [
      {
        id: 'resource_view',
        name: 'Resource Page Viewed',
        order: 1,
        eventType: AnalyticsEventType.PAGE_VIEW,
        conditions: { pageTitle: 'Resources' }
      },
      {
        id: 'resource_engage',
        name: 'Resource Viewed',
        order: 2,
        eventType: AnalyticsEventType.RESOURCE_VIEWED
      },
      {
        id: 'resource_download',
        name: 'Resource Downloaded',
        order: 3,
        eventType: AnalyticsEventType.RESOURCE_DOWNLOADED
      }
    ]
  }
];

// Initialize default funnels
function initializeDefaultFunnels() {
  if (conversionFunnels.length === 0) {
    conversionFunnels = defaultFunnels.map((funnel, index) => ({
      ...funnel,
      id: `funnel_${index + 1}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }));
  }
}

// POST - Create or update conversion funnel
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, steps, funnelId } = body;

    if (!name || !steps || !Array.isArray(steps)) {
      return NextResponse.json(
        { error: 'Name and steps array are required' },
        { status: 400 }
      );
    }

    // Validate steps
    for (const step of steps) {
      if (!step.id || !step.name || !step.eventType) {
        return NextResponse.json(
          { error: 'Each step must have id, name, and eventType' },
          { status: 400 }
        );
      }
    }

    if (funnelId) {
      // Update existing funnel
      const existingIndex = conversionFunnels.findIndex(f => f.id === funnelId);
      if (existingIndex === -1) {
        return NextResponse.json(
          { error: 'Funnel not found' },
          { status: 404 }
        );
      }

      conversionFunnels[existingIndex] = {
        ...conversionFunnels[existingIndex],
        name,
        steps: steps.map((step, index) => ({ ...step, order: index + 1 })),
        updatedAt: new Date()
      };
    } else {
      // Create new funnel
      const newFunnel: ConversionFunnel = {
        id: `funnel_${Date.now()}`,
        name,
        steps: steps.map((step, index) => ({ ...step, order: index + 1 })),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      conversionFunnels.push(newFunnel);
    }

    return NextResponse.json({
      success: true,
      funnel: funnelId ?
        conversionFunnels.find(f => f.id === funnelId) :
        conversionFunnels[conversionFunnels.length - 1],
      message: funnelId ? 'Funnel updated successfully' : 'Funnel created successfully'
    });

  } catch (error) {
    console.error('Funnel creation/update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET - Retrieve funnel analysis
export async function GET(request: NextRequest) {
  try {
    initializeDefaultFunnels();

    const { searchParams } = new URL(request.url);
    const funnelId = searchParams.get('funnelId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const sessionId = searchParams.get('sessionId');
    const userId = searchParams.get('userId');

    // Filter events by date range if provided
    let filteredEvents = [...funnelEvents];

    if (startDate) {
      const start = new Date(startDate);
      filteredEvents = filteredEvents.filter(e => e.timestamp >= start);
    }

    if (endDate) {
      const end = new Date(endDate);
      filteredEvents = filteredEvents.filter(e => e.timestamp <= end);
    }

    if (sessionId) {
      filteredEvents = filteredEvents.filter(e => e.sessionId === sessionId);
    }

    if (userId) {
      filteredEvents = filteredEvents.filter(e => e.userId === userId);
    }

    if (funnelId) {
      // Analyze specific funnel
      const funnel = conversionFunnels.find(f => f.id === funnelId);
      if (!funnel) {
        return NextResponse.json(
          { error: 'Funnel not found' },
          { status: 404 }
        );
      }

      const analysis = await analyzeFunnel(funnel, filteredEvents);

      return NextResponse.json({
        funnel,
        analysis,
        dateRange: {
          startDate: startDate || null,
          endDate: endDate || null
        }
      });
    }

    // Return all funnels with their analyses
    const funnelsWithAnalysis = await Promise.all(
      conversionFunnels.map(async (funnel) => {
        const analysis = await analyzeFunnel(funnel, filteredEvents);
        return {
          funnel,
          analysis
        };
      })
    );

    return NextResponse.json({
      funnels: funnelsWithAnalysis,
      totalFunnels: conversionFunnels.length,
      dateRange: {
        startDate: startDate || null,
        endDate: endDate || null
      }
    });

  } catch (error) {
    console.error('Funnel analysis error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Remove conversion funnel
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const funnelId = searchParams.get('funnelId');

    if (!funnelId) {
      return NextResponse.json(
        { error: 'funnelId is required' },
        { status: 400 }
      );
    }

    const initialLength = conversionFunnels.length;
    conversionFunnels = conversionFunnels.filter(f => f.id !== funnelId);

    if (conversionFunnels.length === initialLength) {
      return NextResponse.json(
        { error: 'Funnel not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Funnel deleted successfully'
    });

  } catch (error) {
    console.error('Funnel deletion error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Core funnel analysis function
async function analyzeFunnel(funnel: ConversionFunnel, events: AnalyticsEvent[]) {
  const stepAnalysis = funnel.steps.map(step => {
    const stepEvents = events.filter(event => {
      if (step.conditions) {
        return eventMatchesStepWithConditions(event, step);
      }
      return event.eventType === step.eventType;
    });

    const uniqueSessions = new Set(stepEvents.map(e => e.sessionId));
    const uniqueUsers = new Set(stepEvents.filter(e => e.userId).map(e => e.userId));

    return {
      stepId: step.id,
      stepName: step.name,
      order: step.order,
      totalEvents: stepEvents.length,
      uniqueSessions: uniqueSessions.size,
      uniqueUsers: uniqueUsers.size,
      conversionRate: 0, // Will be calculated below
      dropOffRate: 0, // Will be calculated below
      averageTimeToComplete: calculateAverageTimeToStep(stepEvents, step.order)
    };
  });

  // Calculate conversion and drop-off rates
  for (let i = 0; i < stepAnalysis.length; i++) {
    const currentStep = stepAnalysis[i];
    const previousStep = i > 0 ? stepAnalysis[i - 1] : null;

    if (i === 0) {
      // First step conversion rate is based on entry
      currentStep.conversionRate = 100;
    } else if (previousStep) {
      // Calculate conversion rate from previous step
      currentStep.conversionRate = previousStep.uniqueSessions > 0 ?
        (currentStep.uniqueSessions / previousStep.uniqueSessions) * 100 : 0;
    }

    // Calculate drop-off rate
    if (i === 0) {
      currentStep.dropOffRate = 0;
    } else if (previousStep) {
      currentStep.dropOffRate = 100 - currentStep.conversionRate;
    }
  }

  // Calculate overall funnel metrics
  const firstStep = stepAnalysis[0];
  const lastStep = stepAnalysis[stepAnalysis.length - 1];

  const overallConversionRate = firstStep && firstStep.uniqueSessions > 0 ?
    (lastStep.uniqueSessions / firstStep.uniqueSessions) * 100 : 0;

  const averageTimeToComplete = calculateFunnelCompletionTime(events, funnel);

  return {
    totalEntries: firstStep?.uniqueSessions || 0,
    totalCompletions: lastStep?.uniqueSessions || 0,
    overallConversionRate,
    averageTimeToComplete,
    stepAnalysis,
    dropOffPoints: identifyDropOffPoints(stepAnalysis),
    improvementOpportunities: suggestImprovements(stepAnalysis, funnel)
  };
}

function eventMatchesStepWithConditions(event: AnalyticsEvent, step: FunnelStep): boolean {
  // Check if event type matches
  if (event.eventType !== step.eventType) {
    return false;
  }

  // Check conditions
  if (step.conditions) {
    for (const [key, value] of Object.entries(step.conditions)) {
      if (event.customData?.[key] !== value) {
        return false;
      }
    }
  }

  return true;
}

function calculateAverageTimeToStep(events: AnalyticsEvent[], stepOrder: number): number {
  if (events.length === 0) return 0;

  // Group events by session
  const sessionGroups = events.reduce((acc, event) => {
    if (!acc[event.sessionId]) {
      acc[event.sessionId] = [];
    }
    acc[event.sessionId].push(event);
    return acc;
  }, {} as Record<string, AnalyticsEvent[]>);

  const times: number[] = [];

  for (const sessionEvents of Object.values(sessionGroups)) {
    // Sort by timestamp
    sessionEvents.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    if (sessionEvents.length >= stepOrder) {
      const firstEvent = sessionEvents[0];
      const stepEvent = sessionEvents[stepOrder - 1];

      if (firstEvent && stepEvent) {
        const timeDiff = stepEvent.timestamp.getTime() - firstEvent.timestamp.getTime();
        times.push(timeDiff);
      }
    }
  }

  return times.length > 0 ? times.reduce((sum, time) => sum + time, 0) / times.length : 0;
}

function calculateFunnelCompletionTime(events: AnalyticsEvent[], funnel: ConversionFunnel): number {
  const sessionGroups = events.reduce((acc, event) => {
    if (!acc[event.sessionId]) {
      acc[event.sessionId] = [];
    }
    acc[event.sessionId].push(event);
    return acc;
  }, {} as Record<string, AnalyticsEvent[]>);

  const completionTimes: number[] = [];

  for (const sessionEvents of Object.values(sessionGroups)) {
    // Check if session completed all steps
    const hasAllSteps = funnel.steps.every(step => {
      return sessionEvents.some(event => {
        if (step.conditions) {
          return eventMatchesStepWithConditions(event, step);
        }
        return event.eventType === step.eventType;
      });
    });

    if (hasAllSteps) {
      sessionEvents.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
      const firstEvent = sessionEvents[0];
      const lastEvent = sessionEvents[sessionEvents.length - 1];

      if (firstEvent && lastEvent) {
        completionTimes.push(lastEvent.timestamp.getTime() - firstEvent.timestamp.getTime());
      }
    }
  }

  return completionTimes.length > 0 ?
    completionTimes.reduce((sum, time) => sum + time, 0) / completionTimes.length : 0;
}

function identifyDropOffPoints(stepAnalysis: any[]): string[] {
  const dropOffPoints: string[] = [];

  for (let i = 1; i < stepAnalysis.length; i++) {
    const currentStep = stepAnalysis[i];
    const previousStep = stepAnalysis[i - 1];

    if (currentStep.dropOffRate > 20) { // More than 20% drop-off
      dropOffPoints.push(`${currentStep.stepName} (${currentStep.dropOffRate.toFixed(1)}% drop-off)`);
    }
  }

  return dropOffPoints;
}

function suggestImprovements(stepAnalysis: any[], funnel: ConversionFunnel): string[] {
  const suggestions: string[] = [];

  // Find steps with low conversion rates
  for (let i = 1; i < stepAnalysis.length; i++) {
    const step = stepAnalysis[i];
    if (step.conversionRate < 50) {
      suggestions.push(`Improve ${step.stepName} conversion rate (${step.conversionRate.toFixed(1)}%)`);
    }
  }

  // Check for long completion times
  if (funnel.name.includes('Assessment') && stepAnalysis[stepAnalysis.length - 1]?.averageTimeToComplete > 300000) { // 5 minutes
    suggestions.push('Risk assessment is taking too long - consider simplifying the process');
  }

  if (funnel.name.includes('Contact') && stepAnalysis[stepAnalysis.length - 1]?.averageTimeToComplete > 180000) { // 3 minutes
    suggestions.push('Contact form is taking too long - consider reducing required fields');
  }

  return suggestions;
}

// Add event to funnel analysis (called from events API)
export function addEventToFunnelAnalysis(event: AnalyticsEvent) {
  funnelEvents.push(event);

  // Keep only recent events (last 30 days)
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  funnelEvents = funnelEvents.filter(e => e.timestamp > thirtyDaysAgo);
}