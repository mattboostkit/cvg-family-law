import { NextRequest, NextResponse } from 'next/server';
import { AnalyticsEvent, AnalyticsEventType, EventCategory, PrivacyComplianceData } from '@/types/analytics';

// In-memory storage for demo purposes - in production, use a proper database
let analyticsEvents: AnalyticsEvent[] = [];
let privacyRecords: Map<string, PrivacyComplianceData> = new Map();

// POST - Receive analytics events from client
export async function POST(request: NextRequest) {
  try {
    const eventData = await request.json();

    // Validate required fields
    if (!eventData.eventType || !eventData.sessionId || !eventData.timestamp) {
      return NextResponse.json(
        { error: 'Missing required fields: eventType, sessionId, timestamp' },
        { status: 400 }
      );
    }

    // Create analytics event object
    const event: AnalyticsEvent = {
      id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(eventData.timestamp),
      eventType: eventData.eventType as AnalyticsEventType,
      category: eventData.category as EventCategory,
      action: eventData.action,
      label: eventData.label,
      value: eventData.value,
      userId: eventData.userId,
      sessionId: eventData.sessionId,
      pageUrl: eventData.pageUrl,
      referrer: eventData.referrer,
      userAgent: eventData.userAgent,
      ipAddress: getAnonymizedIP(request),
      geoLocation: eventData.geoLocation,
      customData: eventData.customData
    };

    // Validate consent for sensitive events
    if (isSensitiveEvent(event.eventType) && !await validateConsent(event.userId)) {
      return NextResponse.json(
        { error: 'Consent required for tracking this event type' },
        { status: 403 }
      );
    }

    // Store event (in production, save to database)
    analyticsEvents.push(event);

    // Keep only recent events (last 30 days for demo)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    analyticsEvents = analyticsEvents.filter(e => e.timestamp > thirtyDaysAgo);

    // Process event for real-time analytics
    await processEventForAnalytics(event);

    return NextResponse.json({
      success: true,
      eventId: event.id,
      message: 'Event tracked successfully'
    });

  } catch (error) {
    console.error('Analytics event tracking error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET - Retrieve analytics events with filtering and aggregation
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const eventType = searchParams.get('eventType') as AnalyticsEventType;
    const category = searchParams.get('category') as EventCategory;
    const userId = searchParams.get('userId');
    const sessionId = searchParams.get('sessionId');
    const groupBy = searchParams.get('groupBy');
    const aggregate = searchParams.get('aggregate') === 'true';

    let filteredEvents = [...analyticsEvents];

    // Apply filters
    if (startDate) {
      const start = new Date(startDate);
      filteredEvents = filteredEvents.filter(e => e.timestamp >= start);
    }

    if (endDate) {
      const end = new Date(endDate);
      filteredEvents = filteredEvents.filter(e => e.timestamp <= end);
    }

    if (eventType) {
      filteredEvents = filteredEvents.filter(e => e.eventType === eventType);
    }

    if (category) {
      filteredEvents = filteredEvents.filter(e => e.category === category);
    }

    if (userId) {
      filteredEvents = filteredEvents.filter(e => e.userId === userId);
    }

    if (sessionId) {
      filteredEvents = filteredEvents.filter(e => e.sessionId === sessionId);
    }

    // Apply aggregation if requested
    if (aggregate) {
      return NextResponse.json({
        totalEvents: filteredEvents.length,
        uniqueUsers: new Set(filteredEvents.filter(e => e.userId).map(e => e.userId)).size,
        uniqueSessions: new Set(filteredEvents.map(e => e.sessionId)).size,
        eventTypes: groupEventsBy(filteredEvents, 'eventType'),
        categories: groupEventsBy(filteredEvents, 'category'),
        dateBreakdown: groupEventsByDate(filteredEvents),
        topPages: getTopPages(filteredEvents),
        deviceBreakdown: await getDeviceBreakdown(filteredEvents)
      });
    }

    // Group results if requested
    if (groupBy) {
      const grouped = groupEventsBy(filteredEvents, groupBy);
      return NextResponse.json(grouped);
    }

    return NextResponse.json({
      events: filteredEvents,
      total: filteredEvents.length,
      filters: {
        startDate: startDate || null,
        endDate: endDate || null,
        eventType: eventType || null,
        category: category || null
      }
    });

  } catch (error) {
    console.error('Analytics data retrieval error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Handle GDPR data deletion requests
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const sessionId = searchParams.get('sessionId');

    if (!userId && !sessionId) {
      return NextResponse.json(
        { error: 'userId or sessionId required for deletion' },
        { status: 400 }
      );
    }

    // Remove events
    if (userId) {
      analyticsEvents = analyticsEvents.filter(e => e.userId !== userId);
      privacyRecords.delete(userId);
    }

    if (sessionId) {
      analyticsEvents = analyticsEvents.filter(e => e.sessionId !== sessionId);
    }

    return NextResponse.json({
      success: true,
      message: 'Data deleted successfully',
      deletedEvents: userId ?
        analyticsEvents.filter(e => e.userId === userId).length :
        analyticsEvents.filter(e => e.sessionId === sessionId).length
    });

  } catch (error) {
    console.error('Analytics data deletion error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper functions
function getAnonymizedIP(request: NextRequest): string | undefined {
  // In production, implement proper IP anonymization
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const clientIP = request.headers.get('x-client-ip');

  const ip = forwarded?.split(',')[0] || realIP || clientIP;

  // Simple IP anonymization (remove last octet)
  if (ip) {
    const parts = ip.split('.');
    if (parts.length === 4) {
      return `${parts[0]}.${parts[1]}.${parts[2]}.0`;
    }
  }

  return undefined;
}

function isSensitiveEvent(eventType: AnalyticsEventType): boolean {
  const sensitiveEvents = [
    AnalyticsEventType.EMERGENCY_BUTTON_CLICK,
    AnalyticsEventType.EMERGENCY_CALL_INITIATED,
    AnalyticsEventType.RISK_ASSESSMENT_STARTED,
    AnalyticsEventType.RISK_ASSESSMENT_COMPLETED,
    AnalyticsEventType.CONTACT_FORM_COMPLETED,
    AnalyticsEventType.CONTACT_FORM_SUBMITTED
  ];

  return sensitiveEvents.includes(eventType);
}

async function validateConsent(userId?: string): Promise<boolean> {
  if (!userId) return false;

  const consentRecord = privacyRecords.get(userId);
  if (!consentRecord) return false;

  // Check if consent is still valid
  const now = new Date();
  const expiry = consentRecord.dataRetentionExpiry;

  return consentRecord.consentGiven && (!expiry || expiry > now);
}

async function processEventForAnalytics(event: AnalyticsEvent): Promise<void> {
  // Real-time processing for immediate insights
  // In production, this could trigger alerts, update dashboards, etc.

  // Check for emergency events that need immediate attention
  if (event.eventType === AnalyticsEventType.EMERGENCY_BUTTON_CLICK) {
    await triggerEmergencyAlert(event);
  }

  // Update conversion funnel progress
  if (event.category === EventCategory.CONVERSION) {
    await updateConversionMetrics(event);
  }
}

async function triggerEmergencyAlert(event: AnalyticsEvent): Promise<void> {
  // In production, this would send notifications to support team
  console.log('Emergency interaction detected:', {
    sessionId: event.sessionId,
    timestamp: event.timestamp,
    pageUrl: event.pageUrl
  });
}

async function updateConversionMetrics(event: AnalyticsEvent): Promise<void> {
  // Update real-time conversion tracking
  console.log('Conversion event processed:', {
    eventType: event.eventType,
    sessionId: event.sessionId,
    timestamp: event.timestamp
  });
}

function groupEventsBy(events: AnalyticsEvent[], field: keyof AnalyticsEvent): Record<string, number> {
  return events.reduce((acc, event) => {
    const key = String(event[field]);
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}

function groupEventsByDate(events: AnalyticsEvent[]): Record<string, number> {
  return events.reduce((acc, event) => {
    const date = event.timestamp.toISOString().split('T')[0];
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}

function getTopPages(events: AnalyticsEvent[]): Array<{page: string, views: number}> {
  const pageViews = events
    .filter(e => e.eventType === AnalyticsEventType.PAGE_VIEW)
    .reduce((acc, event) => {
      const page = event.pageUrl || 'unknown';
      acc[page] = (acc[page] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  return Object.entries(pageViews)
    .map(([page, views]) => ({ page, views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);
}

async function getDeviceBreakdown(events: AnalyticsEvent[]): Promise<Record<string, number>> {
  // This would typically require parsing user agents
  // For demo purposes, returning simplified breakdown
  const devices = ['Desktop', 'Mobile', 'Tablet'];
  return devices.reduce((acc, device) => {
    acc[device] = Math.floor(Math.random() * events.length / 3);
    return acc;
  }, {} as Record<string, number>);
}

// GDPR Compliance endpoints
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, consentData } = body;

    if (!userId || !consentData) {
      return NextResponse.json(
        { error: 'userId and consentData required' },
        { status: 400 }
      );
    }

    // Store consent record
    privacyRecords.set(userId, {
      consentGiven: consentData.consentGiven,
      consentTimestamp: new Date(),
      consentVersion: consentData.consentVersion || '1.0',
      dataProcessingPurposes: consentData.purposes || [],
      dataRetentionExpiry: consentData.retentionDays ?
        new Date(Date.now() + consentData.retentionDays * 24 * 60 * 60 * 1000) :
        new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      cookiesAccepted: consentData.cookiesAccepted || [],
      trackingOptOut: !consentData.consentGiven
    });

    return NextResponse.json({
      success: true,
      message: 'Consent preferences updated'
    });

  } catch (error) {
    console.error('Consent update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}