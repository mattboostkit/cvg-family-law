// Core booking types for the appointment booking system

export interface ServiceType {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  price: number;
  category: 'domestic-abuse' | 'children-law' | 'divorce' | 'financial';
  isEmergencyAvailable: boolean;
  bufferTime?: number; // buffer time after appointment in minutes
}

export interface TimeSlot {
  startTime: string; // ISO string
  endTime: string; // ISO string
  available: boolean;
  staffMemberId?: string;
  isEmergency?: boolean;
  isBuffer?: boolean;
}

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  specializations: string[];
  isAvailable: boolean;
  workingHours: {
    [key: string]: { // day of week
      start: string; // HH:mm format
      end: string; // HH:mm format
    };
  };
  emergencyContact: boolean;
}

export interface BookingRequest {
  serviceType: string;
  isEmergency: boolean;
  preferredDate?: string; // ISO string
  preferredTime?: string; // HH:mm format
  clientInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    isAnonymous?: boolean;
    emergencyContact?: string;
    specialRequirements?: string;
  };
  crisisAssessment?: {
    urgency: 'low' | 'medium' | 'high' | 'critical';
    immediateRisk: boolean;
    supportNeeded: string[];
  };
  paymentInfo?: {
    amount: number;
    currency: string;
    method: 'card' | 'bank_transfer' | 'legal_aid';
    reference?: string;
  };
}

export interface Booking extends BookingRequest {
  id: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show';
  createdAt: string;
  updatedAt: string;
  confirmedAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  meetingLink?: string;
  calendarEventId?: string;
  staffMemberId?: string;
  notes?: string;
  remindersSent: string[]; // array of ISO strings when reminders were sent
}

export interface CalendarEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  attendees: string[];
  description?: string;
  location?: string;
  meetingLink?: string;
  isPrivate: boolean;
  bookingId?: string;
  staffMemberId: string;
}

export interface AvailabilityQuery {
  serviceType: string;
  date: string; // ISO string
  isEmergency?: boolean;
  duration?: number;
}

export interface AvailabilityResponse {
  date: string;
  timeSlots: TimeSlot[];
  staffMembers: StaffMember[];
  nextAvailable?: {
    date: string;
    time: string;
  };
}

export interface BookingConfirmation {
  bookingId: string;
  status: 'confirmed' | 'pending_payment' | 'failed';
  meetingLink?: string;
  calendarInvite?: string;
  nextSteps: string[];
  contactInfo: {
    phone: string;
    email: string;
    emergency: string;
  };
}

export interface EmergencyBookingRequest extends BookingRequest {
  crisisLevel: 'moderate' | 'high' | 'critical';
  immediateCallback: boolean;
  safetyCheck: {
    canSpeakFreely: boolean;
    safeToEmail: boolean;
    preferredContactMethod: 'phone' | 'email' | 'sms';
  };
}

export interface WaitingListEntry {
  id: string;
  clientInfo: {
    name: string;
    email: string;
    phone: string;
  };
  serviceType: string;
  preferredDays: string[]; // ['monday', 'wednesday', 'friday']
  preferredTimes: string[]; // ['09:00', '14:00']
  isEmergency: boolean;
  createdAt: string;
  notifiedDates: string[]; // dates when client was notified of availability
}

export interface BookingSettings {
  businessHours: {
    [key: string]: {
      start: string;
      end: string;
      isWorkingDay: boolean;
    };
  };
  appointmentDuration: number; // default in minutes
  bufferTime: number; // buffer between appointments
  emergencySlotsPerDay: number;
  maxAdvanceBooking: number; // days in advance
  cancellationPolicy: {
    hoursRequired: number;
    penalty?: string;
  };
  reminders: {
    enabled: boolean;
    intervals: number[]; // hours before appointment
    methods: ('email' | 'sms')[];
  };
}

export interface PaymentSession {
  id: string;
  bookingId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: string;
  createdAt: string;
  completedAt?: string;
  paymentIntentId?: string;
  refundReason?: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Calendar integration types
export interface CalendarProvider {
  type: 'google' | 'outlook' | 'exchange';
  clientId?: string;
  clientSecret?: string;
  refreshToken?: string;
  accessToken?: string;
  calendarId?: string;
}

export interface CalendarSyncResult {
  eventsCreated: number;
  eventsUpdated: number;
  eventsDeleted: number;
  errors: string[];
  lastSyncAt: string;
}

// Form validation types
export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface BookingFormData {
  serviceType: string;
  isEmergency: boolean;
  selectedDate?: string;
  selectedTime?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  isAnonymous: boolean;
  emergencyContact?: string;
  specialRequirements?: string;
  paymentMethod: string;
  agreeToTerms: boolean;
  agreeToPrivacy: boolean;
}

// Dashboard and management types
export interface BookingStats {
  totalBookings: number;
  confirmedBookings: number;
  cancelledBookings: number;
  emergencyBookings: number;
  revenue: number;
  averageRating?: number;
  period: {
    start: string;
    end: string;
  };
}

export interface StaffSchedule {
  staffMemberId: string;
  date: string;
  appointments: Booking[];
  availableSlots: TimeSlot[];
  utilization: number; // percentage
}