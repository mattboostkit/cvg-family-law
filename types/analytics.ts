// Analytics and Conversion Tracking Types
export interface AnalyticsEvent {
  id: string;
  timestamp: Date;
  eventType: AnalyticsEventType;
  category: EventCategory;
  action: string;
  label?: string;
  value?: number;
  userId?: string;
  sessionId: string;
  pageUrl: string;
  referrer?: string;
  userAgent?: string;
  ipAddress?: string;
  geoLocation?: GeoLocation;
  customData?: Record<string, any>;
}

export interface ConversionFunnel {
  id: string;
  name: string;
  steps: FunnelStep[];
  createdAt: Date;
  updatedAt: Date;
}

export interface FunnelStep {
  id: string;
  name: string;
  order: number;
  eventType: AnalyticsEventType;
  conditions?: Record<string, any>;
  conversionRate?: number;
  dropOffRate?: number;
  averageTimeToComplete?: number;
}

export interface FunnelStepAnalysis {
  stepId: string;
  stepName: string;
  order: number;
  totalEvents: number;
  uniqueSessions: number;
  uniqueUsers: number;
  conversionRate: number;
  dropOffRate: number;
  averageTimeToComplete: number;
}

export interface FunnelAnalysis {
  totalEntries: number;
  totalCompletions: number;
  overallConversionRate: number;
  averageTimeToComplete: number;
  stepAnalysis: FunnelStepAnalysis[];
  dropOffPoints: string[];
  improvementOpportunities: string[];
}

export interface FunnelAnalysisResult {
  funnel: ConversionFunnel;
  analysis: FunnelAnalysis;
}

export interface VisitorSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  pageViews: PageView[];
  events: AnalyticsEvent[];
  deviceInfo: DeviceInfo;
  location?: GeoLocation;
  referrer?: string;
  utmParameters?: UTMParameters;
  isConverted: boolean;
  conversionValue?: number;
}

export interface PageView {
  id: string;
  url: string;
  timestamp: Date;
  timeOnPage?: number;
  scrollDepth?: number;
  exitIntent?: boolean;
  engagementScore?: number;
}

export interface DeviceInfo {
  userAgent: string;
  browser: string;
  browserVersion: string;
  os: string;
  osVersion: string;
  device: DeviceType;
  screenResolution: string;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

export interface GeoLocation {
  country: string;
  region: string;
  city: string;
  postalCode?: string;
  timezone: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface UTMParameters {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
}

export enum AnalyticsEventType {
  // Emergency Interactions
  EMERGENCY_BUTTON_CLICK = 'emergency_button_click',
  EMERGENCY_CALL_INITIATED = 'emergency_call_initiated',
  EMERGENCY_CONTACT_VIEWED = 'emergency_contact_viewed',

  // Risk Assessment
  RISK_ASSESSMENT_STARTED = 'risk_assessment_started',
  RISK_ASSESSMENT_COMPLETED = 'risk_assessment_completed',
  RISK_ASSESSMENT_STEP_VIEWED = 'risk_assessment_step_viewed',

  // Contact Forms
  CONTACT_FORM_STARTED = 'contact_form_started',
  CONTACT_FORM_COMPLETED = 'contact_form_completed',
  CONTACT_FORM_SUBMITTED = 'contact_form_submitted',
  CONTACT_FORM_ERROR = 'contact_form_error',

  // Appointment Booking
  APPOINTMENT_BOOKING_STARTED = 'appointment_booking_started',
  APPOINTMENT_BOOKING_COMPLETED = 'appointment_booking_completed',
  APPOINTMENT_BOOKING_CANCELLED = 'appointment_booking_cancelled',
  APPOINTMENT_CALENDAR_VIEWED = 'appointment_calendar_viewed',

  // Resource Engagement
  RESOURCE_DOWNLOADED = 'resource_downloaded',
  RESOURCE_VIEWED = 'resource_viewed',
  RESOURCE_SHARED = 'resource_shared',
  RESOURCE_PRINTED = 'resource_printed',

  // Navigation
  PAGE_VIEW = 'page_view',
  PAGE_EXIT = 'page_exit',
  SCROLL_DEPTH = 'scroll_depth',
  CLICK_TRACK = 'click_track',
  SEARCH_PERFORMED = 'search_performed',

  // User Engagement
  CHAT_INITIATED = 'chat_initiated',
  CHAT_MESSAGE_SENT = 'chat_message_sent',
  VIDEO_PLAYED = 'video_played',
  EXTERNAL_LINK_CLICKED = 'external_link_clicked',

  // Conversion Events
  LEAD_GENERATED = 'lead_generated',
  CONSULTATION_BOOKED = 'consultation_booked',
  CASE_INTAKE_COMPLETED = 'case_intake_completed'
}

export enum EventCategory {
  EMERGENCY = 'emergency',
  ASSESSMENT = 'assessment',
  CONTACT = 'contact',
  BOOKING = 'booking',
  RESOURCE = 'resource',
  NAVIGATION = 'navigation',
  ENGAGEMENT = 'engagement',
  CONVERSION = 'conversion'
}

export enum DeviceType {
  MOBILE = 'mobile',
  TABLET = 'tablet',
  DESKTOP = 'desktop',
  UNKNOWN = 'unknown'
}

export interface AnalyticsConfig {
  trackingEnabled: boolean;
  anonymizeIp: boolean;
  cookieConsent: boolean;
  dataRetentionDays: number;
  gdprCompliant: boolean;
  cookielessTracking: boolean;
  serverSideTracking: boolean;
}

export interface ConversionMetrics {
  totalVisitors: number;
  uniqueVisitors: number;
  totalConversions: number;
  conversionRate: number;
  averageConversionValue: number;
  bounceRate: number;
  averageSessionDuration: number;
  pagesPerSession: number;
}

export interface EmergencyAnalytics {
  totalEmergencyClicks: number;
  emergencyClickRate: number;
  emergencyCallsInitiated: number;
  emergencyCallRate: number;
  emergencyContactsViewed: number;
  peakEmergencyHours: number[];
  emergencyResponseTime: number;
}

export interface RiskAssessmentAnalytics {
  totalAssessmentsStarted: number;
  totalAssessmentsCompleted: number;
  assessmentCompletionRate: number;
  averageAssessmentTime: number;
  riskLevelDistribution: Record<string, number>;
  abandonmentPoints: string[];
  popularAssessmentTimes: number[];
}

export interface ContactFormAnalytics {
  totalFormStarts: number;
  totalFormCompletions: number;
  formCompletionRate: number;
  averageFormTime: number;
  formAbandonmentPoints: string[];
  popularContactTimes: number[];
  leadQualityScore?: number;
}

export interface BookingAnalytics {
  totalBookingStarts: number;
  totalBookingsCompleted: number;
  bookingCompletionRate: number;
  averageBookingTime: number;
  popularBookingTimes: number[];
  bookingCancellationRate: number;
  noShowRate: number;
  serviceTypeDistribution: Record<string, number>;
}

export interface ResourceAnalytics {
  totalResourceViews: number;
  totalResourceDownloads: number;
  resourceDownloadRate: number;
  popularResources: ResourcePopularity[];
  averageResourceEngagement: number;
  resourceCategories: Record<string, number>;
}

export interface ResourcePopularity {
  resourceId: string;
  resourceName: string;
  views: number;
  downloads: number;
  averageTimeSpent: number;
  bounceRate: number;
}

export interface UserBehaviorMetrics {
  averageSessionDuration: number;
  averagePagesPerSession: number;
  bounceRate: number;
  exitRate: number;
  scrollDepthDistribution: Record<string, number>;
  popularPages: PagePopularity[];
  entryPages: string[];
  exitPages: string[];
}

export interface PagePopularity {
  pageUrl: string;
  pageTitle: string;
  views: number;
  uniqueViews: number;
  averageTimeOnPage: number;
  bounceRate: number;
  exitRate: number;
}

export interface BusinessIntelligenceMetrics {
  leadGenerationRate: number;
  leadQualityScore: number;
  clientAcquisitionCost: number;
  customerLifetimeValue: number;
  marketingChannelEffectiveness: Record<string, number>;
  serviceAreaPerformance: Record<string, number>;
  seasonalTrends: SeasonalTrend[];
  conversionByTrafficSource: Record<string, number>;
}

export interface SeasonalTrend {
  period: string;
  metric: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
}

export interface PrivacyComplianceData {
  consentGiven: boolean;
  consentTimestamp?: Date;
  consentVersion: string;
  dataProcessingPurposes: string[];
  dataRetentionExpiry?: Date;
  dataExportRequested?: boolean;
  dataDeletionRequested?: boolean;
  cookiesAccepted: string[];
  trackingOptOut: boolean;
}

export interface AnalyticsDashboardData {
  overview: ConversionMetrics;
  emergency: EmergencyAnalytics;
  riskAssessment: RiskAssessmentAnalytics;
  contactForms: ContactFormAnalytics;
  bookings: BookingAnalytics;
  resources: ResourceAnalytics;
  userBehavior: UserBehaviorMetrics;
  businessIntelligence: BusinessIntelligenceMetrics;
  realTimeVisitors: number;
  activeSessions: number;
  topPages: PagePopularity[];
  conversionFunnels: FunnelAnalysisResult[];
  alerts: AnalyticsAlert[];
}

export interface AnalyticsAlert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  message: string;
  timestamp: Date;
  resolved: boolean;
  resolvedAt?: Date;
  metrics?: Record<string, any>;
}

export enum AlertType {
  CONVERSION_DROP = 'conversion_drop',
  EMERGENCY_SPIKE = 'emergency_spike',
  TRAFFIC_ANOMALY = 'traffic_anomaly',
  PERFORMANCE_ISSUE = 'performance_issue',
  PRIVACY_COMPLIANCE = 'privacy_compliance'
}

export enum AlertSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export interface GDPRComplianceReport {
  totalDataSubjects: number;
  dataProcessingActivities: DataProcessingActivity[];
  consentRecords: ConsentRecord[];
  dataRetentionSchedule: DataRetentionRule[];
  breachIncidents: BreachIncident[];
  dataSubjectRequests: DataSubjectRequest[];
}

export interface DataProcessingActivity {
  id: string;
  purpose: string;
  legalBasis: string;
  categories: string[];
  recipients: string[];
  retentionPeriod: number;
  active: boolean;
}

export interface ConsentRecord {
  userId: string;
  consentGiven: boolean;
  consentVersion: string;
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
  purposes: string[];
}

export interface DataRetentionRule {
  dataType: string;
  retentionPeriod: number;
  deletionSchedule: string;
  active: boolean;
}

export interface BreachIncident {
  id: string;
  date: Date;
  description: string;
  affectedData: string[];
  affectedUsers: number;
  reportedToAuthorities: boolean;
  mitigationSteps: string[];
  resolved: boolean;
}

export interface DataSubjectRequest {
  id: string;
  requestType: 'access' | 'rectification' | 'erasure' | 'portability' | 'restrict' | 'object';
  userId: string;
  requestedAt: Date;
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  completedAt?: Date;
  response?: string;
}

export interface AnalyticsFilter {
  startDate?: Date;
  endDate?: Date;
  eventTypes?: AnalyticsEventType[];
  categories?: EventCategory[];
  userId?: string;
  sessionId?: string;
  deviceTypes?: DeviceType[];
  locations?: string[];
  trafficSources?: string[];
  pageUrls?: string[];
}

export interface AnalyticsQuery {
  metrics: string[];
  dimensions: string[];
  filters: AnalyticsFilter;
  groupBy?: string[];
  orderBy?: string;
  limit?: number;
  offset?: number;
}