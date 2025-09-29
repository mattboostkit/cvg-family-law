'use client';

import {
  AnalyticsEvent,
  AnalyticsEventType,
  EventCategory,
  VisitorSession,
  AnalyticsConfig,
  PrivacyComplianceData,
  DeviceInfo,
  GeoLocation,
  UTMParameters,
  ConversionFunnel,
  FunnelStep,
  DeviceType
} from '@/types/analytics';

class AnalyticsTracker {
  private config: AnalyticsConfig;
  private sessionId: string;
  private userId?: string;
  private sessionStartTime: Date;
  private events: AnalyticsEvent[] = [];
  private pageViews: Array<{
    url: string;
    title: string;
    timestamp: Date;
    referrer?: string;
    timeOnPage?: number;
  }> = [];
  private consentGiven: boolean = false;
  private privacyData?: PrivacyComplianceData;

  constructor(config: AnalyticsConfig) {
    this.config = config;
    this.sessionId = this.generateSessionId();
    this.sessionStartTime = new Date();

    // Check for existing consent
    this.loadConsentStatus();

    // Initialize device and location info
    this.initializeDeviceInfo();

    // Set up automatic page view tracking
    this.setupAutomaticTracking();

    // Set up privacy compliance
    this.setupPrivacyCompliance();
  }

  private setupPrivacyCompliance(): void {
    // Initialize privacy compliance features
    // This method can be extended for additional privacy setup
    if (typeof window !== 'undefined') {
      // Check for existing privacy preferences
      const privacyPrefs = localStorage.getItem('privacy_preferences');
      if (privacyPrefs) {
        const prefs = JSON.parse(privacyPrefs);
        this.consentGiven = prefs.consentGiven || false;
      }
    }
  }

  // Session Management
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateEventId(): string {
    return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  public startNewSession(): void {
    this.sessionId = this.generateSessionId();
    this.sessionStartTime = new Date();
    this.events = [];
    this.pageViews = [];
  }

  public setUserId(userId: string): void {
    this.userId = userId;
  }

  // Privacy Compliance
  private loadConsentStatus(): void {
    if (typeof window !== 'undefined') {
      const consent = localStorage.getItem('analytics_consent');
      if (consent) {
        const consentData = JSON.parse(consent);
        this.consentGiven = consentData.given;
        this.privacyData = consentData.privacyData;
      }
    }
  }

  public setConsent(consent: boolean, purposes: string[]): void {
    this.consentGiven = consent;

    this.privacyData = {
      consentGiven: consent,
      consentTimestamp: new Date(),
      consentVersion: '1.0',
      dataProcessingPurposes: purposes,
      dataRetentionExpiry: new Date(Date.now() + (this.config.dataRetentionDays * 24 * 60 * 60 * 1000)),
      cookiesAccepted: consent ? ['analytics', 'functional'] : [],
      trackingOptOut: !consent
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem('analytics_consent', JSON.stringify({
        given: consent,
        privacyData: this.privacyData
      }));
    }
  }

  public exportUserData(): {
    events: AnalyticsEvent[];
    pageViews: Array<{
      url: string;
      title: string;
      timestamp: Date;
      referrer?: string;
      timeOnPage?: number;
    }>;
    sessionId: string;
    userId?: string;
    privacyData?: PrivacyComplianceData;
    exportDate: Date;
  } {
    return {
      events: this.events,
      pageViews: this.pageViews,
      sessionId: this.sessionId,
      userId: this.userId,
      privacyData: this.privacyData,
      exportDate: new Date()
    };
  }

  public deleteUserData(): void {
    this.events = [];
    this.pageViews = [];
    this.userId = undefined;
    this.privacyData = undefined;

    if (typeof window !== 'undefined') {
      localStorage.removeItem('analytics_consent');
      localStorage.removeItem('analytics_session');
    }
  }

  // Device and Location Information
  private initializeDeviceInfo(): void {
    if (typeof window === 'undefined') return;

    const userAgent = navigator.userAgent;
    const deviceInfo = this.parseUserAgent(userAgent);
    const geoLocation = this.getGeoLocation();

    // Store device info in session
    const sessionData = {
      deviceInfo,
      geoLocation,
      startTime: this.sessionStartTime,
      userAgent
    };

    sessionStorage.setItem('analytics_session', JSON.stringify(sessionData));
  }

  private parseUserAgent(userAgent: string): DeviceInfo {
    // Browser detection
    let browser = 'Unknown';
    let browserVersion = 'Unknown';

    if (userAgent.includes('Chrome')) {
      browser = 'Chrome';
      const match = userAgent.match(/Chrome\/(\d+\.\d+)/);
      browserVersion = match ? match[1] : 'Unknown';
    } else if (userAgent.includes('Firefox')) {
      browser = 'Firefox';
      const match = userAgent.match(/Firefox\/(\d+\.\d+)/);
      browserVersion = match ? match[1] : 'Unknown';
    } else if (userAgent.includes('Safari')) {
      browser = 'Safari';
      const match = userAgent.match(/Safari\/(\d+\.\d+)/);
      browserVersion = match ? match[1] : 'Unknown';
    } else if (userAgent.includes('Edge')) {
      browser = 'Edge';
      const match = userAgent.match(/Edge\/(\d+\.\d+)/);
      browserVersion = match ? match[1] : 'Unknown';
    }

    // OS detection
    let os = 'Unknown';
    let osVersion = 'Unknown';

    if (userAgent.includes('Windows')) {
      os = 'Windows';
      const match = userAgent.match(/Windows NT (\d+\.\d+)/);
      osVersion = match ? match[1] : 'Unknown';
    } else if (userAgent.includes('Mac OS')) {
      os = 'macOS';
      const match = userAgent.match(/Mac OS X (\d+[._]\d+)/);
      osVersion = match ? match[1].replace('_', '.') : 'Unknown';
    } else if (userAgent.includes('Linux')) {
      os = 'Linux';
    } else if (userAgent.includes('Android')) {
      os = 'Android';
      const match = userAgent.match(/Android (\d+\.\d+)/);
      osVersion = match ? match[1] : 'Unknown';
    } else if (userAgent.includes('iOS')) {
      os = 'iOS';
      const match = userAgent.match(/OS (\d+[._]\d+)/);
      osVersion = match ? match[1].replace('_', '.') : 'Unknown';
    }

    // Device type detection
    const isMobile = /Mobile|Android|iPhone|iPad|iPod|BlackBerry|Windows Phone/i.test(userAgent);
    const isTablet = /iPad|Android(?!.*Mobile)/i.test(userAgent);
    const isDesktop = !isMobile && !isTablet;

    let device = DeviceType.UNKNOWN;
    if (isMobile) device = DeviceType.MOBILE;
    else if (isTablet) device = DeviceType.TABLET;
    else if (isDesktop) device = DeviceType.DESKTOP;

    // Screen resolution
    const screenResolution = `${window.screen.width}x${window.screen.height}`;

    return {
      userAgent,
      browser,
      browserVersion,
      os,
      osVersion,
      device,
      screenResolution,
      isMobile,
      isTablet,
      isDesktop
    };
  }

  private getGeoLocation(): GeoLocation | undefined {
    // In a real implementation, you would use a geolocation service
    // For privacy compliance, we won't use actual geolocation without consent
    return undefined;
  }

  // Event Tracking
  public trackEvent(
    eventType: AnalyticsEventType,
    category: EventCategory,
    action: string,
    label?: string,
    value?: number,
    customData?: Record<string, string | number | boolean | undefined>
  ): void {
    if (!this.consentGiven || !this.config.trackingEnabled) {
      return;
    }

    const event: AnalyticsEvent = {
      id: this.generateEventId(),
      timestamp: new Date(),
      eventType,
      category,
      action,
      label,
      value,
      userId: this.userId,
      sessionId: this.sessionId,
      pageUrl: window.location.href,
      referrer: document.referrer || undefined,
      userAgent: navigator.userAgent,
      customData
    };

    this.events.push(event);

    // Send to server if server-side tracking is enabled
    if (this.config.serverSideTracking) {
      this.sendEventToServer(event);
    }

    // Store in local storage for cookieless tracking
    if (this.config.cookielessTracking) {
      this.storeEventLocally(event);
    }
  }

  // Specific tracking methods for common events
  public trackEmergencyInteraction(action: string, label?: string): void {
    this.trackEvent(
      AnalyticsEventType.EMERGENCY_BUTTON_CLICK,
      EventCategory.EMERGENCY,
      action,
      label
    );
  }

  public trackRiskAssessment(action: string, step?: number, customData?: Record<string, any>): void {
    this.trackEvent(
      step === undefined ?
        AnalyticsEventType.RISK_ASSESSMENT_STARTED :
        AnalyticsEventType.RISK_ASSESSMENT_STEP_VIEWED,
      EventCategory.ASSESSMENT,
      action,
      `step_${step}`,
      undefined,
      { ...customData, step }
    );
  }

  public trackContactForm(action: string, formName?: string, customData?: Record<string, any>): void {
    this.trackEvent(
      action === 'submit' ?
        AnalyticsEventType.CONTACT_FORM_SUBMITTED :
        AnalyticsEventType.CONTACT_FORM_STARTED,
      EventCategory.CONTACT,
      action,
      formName,
      undefined,
      customData
    );
  }

  public trackAppointmentBooking(action: string, serviceType?: string, customData?: Record<string, any>): void {
    this.trackEvent(
      action === 'completed' ?
        AnalyticsEventType.APPOINTMENT_BOOKING_COMPLETED :
        AnalyticsEventType.APPOINTMENT_BOOKING_STARTED,
      EventCategory.BOOKING,
      action,
      serviceType,
      undefined,
      { ...customData, serviceType }
    );
  }

  public trackResourceEngagement(action: string, resourceId: string, resourceName: string): void {
    this.trackEvent(
      action === 'download' ?
        AnalyticsEventType.RESOURCE_DOWNLOADED :
        AnalyticsEventType.RESOURCE_VIEWED,
      EventCategory.RESOURCE,
      action,
      resourceName,
      undefined,
      { resourceId, resourceName }
    );
  }

  public trackPageView(pageTitle?: string): void {
    this.trackEvent(
      AnalyticsEventType.PAGE_VIEW,
      EventCategory.NAVIGATION,
      'page_view',
      pageTitle || document.title
    );

    // Track scroll depth
    this.setupScrollTracking();

    // Track exit intent
    this.setupExitIntentTracking();
  }

  public trackScrollDepth(): void {
    const scrollPercentage = Math.round(
      (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
    );

    this.trackEvent(
      AnalyticsEventType.SCROLL_DEPTH,
      EventCategory.NAVIGATION,
      'scroll',
      `${scrollPercentage}%`,
      scrollPercentage
    );
  }

  public trackClick(element: HTMLElement, elementType?: string): void {
    const elementInfo = {
      tagName: element.tagName,
      id: element.id,
      className: element.className,
      textContent: element.textContent?.substring(0, 100),
      elementType: elementType || 'unknown'
    };

    this.trackEvent(
      AnalyticsEventType.CLICK_TRACK,
      EventCategory.NAVIGATION,
      'click',
      elementInfo.textContent,
      undefined,
      elementInfo
    );
  }

  // Automatic tracking setup
  private setupAutomaticTracking(): void {
    if (typeof window === 'undefined') return;

    // Track page views on route changes
    this.trackPageView();

    // Set up click tracking for important elements
    this.setupClickTracking();

    // Set up form tracking
    this.setupFormTracking();

    // Track time on page
    this.setupTimeTracking();
  }

  private setupClickTracking(): void {
    // Track emergency buttons
    document.querySelectorAll('[data-emergency]').forEach(element => {
      element.addEventListener('click', (e) => {
        this.trackEmergencyInteraction('emergency_button_click');
      });
    });

    // Track resource downloads
    document.querySelectorAll('[data-resource]').forEach(element => {
      element.addEventListener('click', (e) => {
        const resourceId = element.getAttribute('data-resource-id');
        const resourceName = element.getAttribute('data-resource-name');
        if (resourceId && resourceName) {
          this.trackResourceEngagement('download', resourceId, resourceName);
        }
      });
    });

    // Track consultation/bookings buttons
    document.querySelectorAll('[data-booking]').forEach(element => {
      element.addEventListener('click', (e) => {
        this.trackAppointmentBooking('booking_initiated');
      });
    });
  }

  private setupFormTracking(): void {
    document.querySelectorAll('form').forEach(form => {
      const formName = form.getAttribute('data-form-name') || 'unknown_form';

      form.addEventListener('submit', (e) => {
        this.trackContactForm('submit', formName);
      });

      // Track form field interactions
      form.querySelectorAll('input, textarea, select').forEach(field => {
        field.addEventListener('focus', () => {
          this.trackContactForm('field_focus', formName, {
            fieldName: field.getAttribute('name'),
            fieldType: field.getAttribute('type')
          });
        });
      });
    });
  }

  private setupScrollTracking(): void {
    let maxScroll = 0;
    let scrollTimer: NodeJS.Timeout;

    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        const currentScroll = Math.round(
          (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
        );

        if (currentScroll > maxScroll) {
          maxScroll = currentScroll;
          if (currentScroll >= 25 && currentScroll % 25 === 0) {
            this.trackScrollDepth();
          }
        }
      }, 250);
    });
  }

  private setupExitIntentTracking(): void {
    let exitIntentFired = false;

    document.addEventListener('mouseleave', (e) => {
      if (e.clientY <= 0 && !exitIntentFired) {
        exitIntentFired = true;
        this.trackEvent(
          AnalyticsEventType.PAGE_EXIT,
          EventCategory.NAVIGATION,
          'exit_intent',
          'mouse_leave'
        );
      }
    });
  }

  private setupTimeTracking(): void {
    // Track time on page
    setInterval(() => {
      const timeOnPage = Math.floor((Date.now() - this.sessionStartTime.getTime()) / 1000);
      if (timeOnPage % 30 === 0) { // Every 30 seconds
        this.trackEvent(
          AnalyticsEventType.PAGE_VIEW,
          EventCategory.NAVIGATION,
          'time_on_page',
          `${timeOnPage}s`,
          timeOnPage
        );
      }
    }, 1000);
  }

  // Server communication
  private async sendEventToServer(event: AnalyticsEvent): Promise<void> {
    try {
      await fetch('/api/analytics/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...event,
          // Anonymize IP if configured
          ipAddress: this.config.anonymizeIp ? undefined : event.ipAddress
        }),
      });
    } catch (error) {
      console.warn('Failed to send analytics event to server:', error);
    }
  }

  private storeEventLocally(event: AnalyticsEvent): void {
    const events = JSON.parse(localStorage.getItem('analytics_events') || '[]');
    events.push(event);

    // Keep only last 100 events to prevent storage bloat
    if (events.length > 100) {
      events.splice(0, events.length - 100);
    }

    localStorage.setItem('analytics_events', JSON.stringify(events));
  }

  // Data retrieval methods
  public getSessionData(): Partial<VisitorSession> {
    const sessionData = {
      id: this.sessionId,
      startTime: this.sessionStartTime,
      events: this.events,
      isConverted: this.events.some(e => e.category === EventCategory.CONVERSION)
    };

    return sessionData;
  }

  public getEvents(filter?: {
    eventType?: AnalyticsEventType;
    category?: EventCategory;
    startDate?: Date;
    endDate?: Date;
  }): AnalyticsEvent[] {
    let filteredEvents = this.events;

    if (filter) {
      if (filter.eventType) {
        filteredEvents = filteredEvents.filter(e => e.eventType === filter.eventType);
      }
      if (filter.category) {
        filteredEvents = filteredEvents.filter(e => e.category === filter.category);
      }
      if (filter.startDate) {
        filteredEvents = filteredEvents.filter(e => e.timestamp >= filter.startDate!);
      }
      if (filter.endDate) {
        filteredEvents = filteredEvents.filter(e => e.timestamp <= filter.endDate!);
      }
    }

    return filteredEvents;
  }

  // Conversion funnel analysis
  public analyzeConversionFunnel(funnel: ConversionFunnel): any {
    const funnelEvents = this.events.filter(event =>
      funnel.steps.some(step => step.eventType === event.eventType)
    );

    const stepCounts = funnel.steps.map(step => {
      const stepEvents = funnelEvents.filter(event =>
        step.conditions ?
          this.matchesConditions(event, step.conditions) :
          event.eventType === step.eventType
      );

      return {
        stepId: step.id,
        name: step.name,
        count: stepEvents.length,
        uniqueUsers: new Set(stepEvents.map(e => e.userId)).size
      };
    });

    return {
      funnelId: funnel.id,
      funnelName: funnel.name,
      totalEntries: stepCounts[0]?.count || 0,
      totalConversions: stepCounts[stepCounts.length - 1]?.count || 0,
      conversionRate: stepCounts[0]?.count ?
        (stepCounts[stepCounts.length - 1]?.count || 0) / stepCounts[0].count : 0,
      stepData: stepCounts
    };
  }

  private matchesConditions(event: AnalyticsEvent, conditions: Record<string, any>): boolean {
    for (const [key, value] of Object.entries(conditions)) {
      if (event.customData?.[key] !== value) {
        return false;
      }
    }
    return true;
  }
}

// Singleton instance
let analyticsInstance: AnalyticsTracker | null = null;

export const getAnalyticsTracker = (config?: Partial<AnalyticsConfig>): AnalyticsTracker => {
  const defaultConfig: AnalyticsConfig = {
    trackingEnabled: true,
    anonymizeIp: true,
    cookieConsent: true,
    dataRetentionDays: 90,
    gdprCompliant: true,
    cookielessTracking: false,
    serverSideTracking: true,
    ...config
  };

  if (!analyticsInstance) {
    analyticsInstance = new AnalyticsTracker(defaultConfig);
  }

  return analyticsInstance;
};

// React hook for easy access to analytics
export const useAnalytics = () => {
  const tracker = getAnalyticsTracker();

  return {
    trackEvent: tracker.trackEvent.bind(tracker),
    trackEmergencyInteraction: tracker.trackEmergencyInteraction.bind(tracker),
    trackRiskAssessment: tracker.trackRiskAssessment.bind(tracker),
    trackContactForm: tracker.trackContactForm.bind(tracker),
    trackAppointmentBooking: tracker.trackAppointmentBooking.bind(tracker),
    trackResourceEngagement: tracker.trackResourceEngagement.bind(tracker),
    trackPageView: tracker.trackPageView.bind(tracker),
    trackScrollDepth: tracker.trackScrollDepth.bind(tracker),
    trackClick: tracker.trackClick.bind(tracker),
    setUserId: tracker.setUserId.bind(tracker),
    setConsent: tracker.setConsent.bind(tracker),
    exportUserData: tracker.exportUserData.bind(tracker),
    deleteUserData: tracker.deleteUserData.bind(tracker),
    getSessionData: tracker.getSessionData.bind(tracker),
    getEvents: tracker.getEvents.bind(tracker),
    analyzeConversionFunnel: tracker.analyzeConversionFunnel.bind(tracker)
  };
};

export default AnalyticsTracker;