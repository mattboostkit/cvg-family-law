// Booking engine for the domestic abuse law firm appointment system
// Handles all booking logic, validation, and calendar integration

import {
  ServiceType,
  StaffMember,
  BookingRequest,
  Booking,
  TimeSlot,
  AvailabilityQuery,
  AvailabilityResponse,
  BookingConfirmation,
  EmergencyBookingRequest,
  BookingSettings,
  ValidationError,
  BookingFormData,
  CalendarEvent,
  CalendarSyncResult,
  PaymentSession
} from '@/types/booking';

// Default services offered by the firm
export const DEFAULT_SERVICES: ServiceType[] = [
  {
    id: 'domestic-abuse-consultation',
    name: 'Domestic Abuse Consultation',
    description: 'Initial consultation for domestic abuse matters',
    duration: 60,
    price: 150,
    category: 'domestic-abuse',
    isEmergencyAvailable: true,
    bufferTime: 15
  },
  {
    id: 'children-law-consultation',
    name: 'Children Law Consultation',
    description: 'Legal advice regarding child custody and protection',
    duration: 45,
    price: 120,
    category: 'children-law',
    isEmergencyAvailable: true,
    bufferTime: 15
  },
  {
    id: 'divorce-consultation',
    name: 'Divorce & Separation Consultation',
    description: 'Initial consultation for divorce proceedings',
    duration: 60,
    price: 180,
    category: 'divorce',
    isEmergencyAvailable: false,
    bufferTime: 15
  },
  {
    id: 'financial-settlement',
    name: 'Financial Settlement Consultation',
    description: 'Advice on financial matters in family law',
    duration: 45,
    price: 140,
    category: 'financial',
    isEmergencyAvailable: false,
    bufferTime: 15
  }
];

// Default staff members
export const DEFAULT_STAFF: StaffMember[] = [
  {
    id: 'solicitor-1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@lawfirm.co.uk',
    specializations: ['domestic-abuse', 'children-law'],
    isAvailable: true,
    workingHours: {
      monday: { start: '09:00', end: '17:00' },
      tuesday: { start: '09:00', end: '17:00' },
      wednesday: { start: '09:00', end: '17:00' },
      thursday: { start: '09:00', end: '17:00' },
      friday: { start: '09:00', end: '17:00' }
    },
    emergencyContact: true
  },
  {
    id: 'solicitor-2',
    name: 'Michael Chen',
    email: 'michael.chen@lawfirm.co.uk',
    specializations: ['divorce', 'financial'],
    isAvailable: true,
    workingHours: {
      monday: { start: '09:00', end: '17:00' },
      tuesday: { start: '09:00', end: '17:00' },
      wednesday: { start: '09:00', end: '17:00' },
      thursday: { start: '09:00', end: '17:00' },
      friday: { start: '09:00', end: '17:00' }
    },
    emergencyContact: false
  }
];

// Default booking settings
export const DEFAULT_BOOKING_SETTINGS: BookingSettings = {
  businessHours: {
    monday: { start: '09:00', end: '17:00', isWorkingDay: true },
    tuesday: { start: '09:00', end: '17:00', isWorkingDay: true },
    wednesday: { start: '09:00', end: '17:00', isWorkingDay: true },
    thursday: { start: '09:00', end: '17:00', isWorkingDay: true },
    friday: { start: '09:00', end: '17:00', isWorkingDay: true },
    saturday: { start: '09:00', end: '12:00', isWorkingDay: false },
    sunday: { start: '00:00', end: '00:00', isWorkingDay: false }
  },
  appointmentDuration: 60,
  bufferTime: 15,
  emergencySlotsPerDay: 2,
  maxAdvanceBooking: 90,
  cancellationPolicy: {
    hoursRequired: 24,
    penalty: '50% of consultation fee'
  },
  reminders: {
    enabled: true,
    intervals: [24, 2], // 24 hours and 2 hours before
    methods: ['email', 'sms']
  }
};

export class BookingEngine {
  private services: ServiceType[] = DEFAULT_SERVICES;
  private staff: StaffMember[] = DEFAULT_STAFF;
  private settings: BookingSettings = DEFAULT_BOOKING_SETTINGS;
  private bookings: Map<string, Booking> = new Map();

  constructor(
    services?: ServiceType[],
    staff?: StaffMember[],
    settings?: Partial<BookingSettings>
  ) {
    if (services) this.services = services;
    if (staff) this.staff = staff;
    if (settings) this.settings = { ...this.settings, ...settings };
  }

  // Service validation and retrieval
  getService(serviceId: string): ServiceType | null {
    return this.services.find(s => s.id === serviceId) || null;
  }

  getServicesByCategory(category: string): ServiceType[] {
    return this.services.filter(s => s.category === category);
  }

  getAllServices(): ServiceType[] {
    return [...this.services];
  }

  // Staff management
  getAvailableStaff(serviceType: string): StaffMember[] {
    const service = this.getService(serviceType);
    if (!service) return [];

    return this.staff.filter(staff =>
      staff.isAvailable &&
      staff.specializations.some(spec =>
        service.category === 'domestic-abuse' ? spec === 'domestic-abuse' :
        service.category === 'children-law' ? spec === 'children-law' :
        service.category === 'divorce' ? spec === 'divorce' :
        service.category === 'financial' ? spec === 'financial' : false
      )
    );
  }

  // Availability checking
  async checkAvailability(query: AvailabilityQuery): Promise<AvailabilityResponse> {
    const { serviceType, date, isEmergency = false, duration } = query;

    const service = this.getService(serviceType);
    if (!service) {
      throw new Error('Invalid service type');
    }

    const appointmentDuration = duration || service.duration;
    const targetDate = new Date(date);
    const dayOfWeek = targetDate.toLocaleDateString('en-GB', { weekday: 'long' }).toLowerCase() as keyof typeof this.settings.businessHours;

    if (!this.settings.businessHours[dayOfWeek]?.isWorkingDay) {
      return {
        date,
        timeSlots: [],
        staffMembers: [],
        nextAvailable: this.getNextAvailableDate(serviceType)
      };
    }

    const availableStaff = this.getAvailableStaff(serviceType);
    const timeSlots: TimeSlot[] = [];

    // Generate time slots for the day
    const businessDay = this.settings.businessHours[dayOfWeek];
    const startTime = businessDay.start;
    const endTime = businessDay.end;

    const startHour = parseInt(startTime.split(':')[0]);
    const endHour = parseInt(endTime.split(':')[0]);

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) { // 30-minute intervals
        const slotStart = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const slotStartDateTime = new Date(`${date}T${slotStart}:00`);

        // Check if this slot is in the past
        if (slotStartDateTime <= new Date()) continue;

        // Check for emergency slots
        const emergencySlots = this.getEmergencySlots(date);
        const isEmergencySlot = emergencySlots.some(slot =>
          slot.startTime.includes(slotStart)
        );

        if (isEmergency && !isEmergencySlot) continue;

        // Check staff availability for this slot
        const availableForSlot = availableStaff.filter(staff => {
          const existingBookings = this.getBookingsForStaffAndDate(staff.id, date);
          const hasConflict = existingBookings.some(booking => {
            const bookingStart = new Date(booking.preferredDate!);
            const bookingEnd = new Date(bookingStart.getTime() + (service.duration * 60000));
            const slotEnd = new Date(slotStartDateTime.getTime() + (appointmentDuration * 60000));

            return (slotStartDateTime < bookingEnd && slotEnd > bookingStart);
          });

          return !hasConflict;
        });

        timeSlots.push({
          startTime: slotStartDateTime.toISOString(),
          endTime: new Date(slotStartDateTime.getTime() + (appointmentDuration * 60000)).toISOString(),
          available: availableForSlot.length > 0,
          isEmergency: isEmergencySlot
        });
      }
    }

    return {
      date,
      timeSlots,
      staffMembers: availableStaff,
      nextAvailable: timeSlots.some(slot => slot.available) ? undefined : this.getNextAvailableDate(serviceType)
    };
  }

  private getEmergencySlots(date: string): TimeSlot[] {
    // Implementation would check for pre-allocated emergency slots
    // For now, return empty array - this would be populated based on settings
    return [];
  }

  private getBookingsForStaffAndDate(staffId: string, date: string): Booking[] {
    return Array.from(this.bookings.values()).filter(booking =>
      booking.staffMemberId === staffId &&
      booking.preferredDate?.startsWith(date.split('T')[0])
    );
  }

  private getNextAvailableDate(serviceType: string): { date: string; time: string } | undefined {
    // Look ahead up to maxAdvanceBooking days
    for (let i = 1; i <= this.settings.maxAdvanceBooking; i++) {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + i);
      const dateString = futureDate.toISOString().split('T')[0];

      // Skip weekends if not working days
      const dayOfWeek = futureDate.toLocaleDateString('en-GB', { weekday: 'long' }).toLowerCase() as keyof typeof this.settings.businessHours;
      if (!this.settings.businessHours[dayOfWeek]?.isWorkingDay) continue;

      // This would check actual availability - simplified for now
      return {
        date: dateString,
        time: this.settings.businessHours[dayOfWeek].start
      };
    }
    return undefined;
  }

  // Booking validation
  validateBookingRequest(request: BookingRequest): ValidationError[] {
    const errors: ValidationError[] = [];

    // Service validation
    const service = this.getService(request.serviceType);
    if (!service) {
      errors.push({
        field: 'serviceType',
        message: 'Invalid service type selected',
        code: 'INVALID_SERVICE'
      });
    }

    // Emergency booking validation
    if (request.isEmergency && !service?.isEmergencyAvailable) {
      errors.push({
        field: 'isEmergency',
        message: 'Emergency booking not available for this service',
        code: 'EMERGENCY_NOT_AVAILABLE'
      });
    }

    // Client info validation
    if (!request.clientInfo.firstName.trim()) {
      errors.push({
        field: 'firstName',
        message: 'First name is required',
        code: 'REQUIRED_FIELD'
      });
    }

    if (!request.clientInfo.lastName.trim()) {
      errors.push({
        field: 'lastName',
        message: 'Last name is required',
        code: 'REQUIRED_FIELD'
      });
    }

    if (!this.isValidEmail(request.clientInfo.email)) {
      errors.push({
        field: 'email',
        message: 'Valid email address is required',
        code: 'INVALID_EMAIL'
      });
    }

    if (!this.isValidPhone(request.clientInfo.phone)) {
      errors.push({
        field: 'phone',
        message: 'Valid phone number is required',
        code: 'INVALID_PHONE'
      });
    }

    // Emergency booking specific validation
    if (request.isEmergency && request.crisisAssessment) {
      if (!request.crisisAssessment.urgency) {
        errors.push({
          field: 'crisisAssessment.urgency',
          message: 'Please specify the urgency level',
          code: 'REQUIRED_FIELD'
        });
      }
    }

    return errors;
  }

  validateFormData(formData: BookingFormData): ValidationError[] {
    const errors: ValidationError[] = [];

    if (!formData.serviceType) {
      errors.push({
        field: 'serviceType',
        message: 'Please select a service',
        code: 'REQUIRED_FIELD'
      });
    }

    if (!formData.selectedDate) {
      errors.push({
        field: 'selectedDate',
        message: 'Please select an appointment date',
        code: 'REQUIRED_FIELD'
      });
    }

    if (!formData.selectedTime) {
      errors.push({
        field: 'selectedTime',
        message: 'Please select an appointment time',
        code: 'REQUIRED_FIELD'
      });
    }

    if (!formData.firstName.trim()) {
      errors.push({
        field: 'firstName',
        message: 'First name is required',
        code: 'REQUIRED_FIELD'
      });
    }

    if (!formData.lastName.trim()) {
      errors.push({
        field: 'lastName',
        message: 'Last name is required',
        code: 'REQUIRED_FIELD'
      });
    }

    if (!this.isValidEmail(formData.email)) {
      errors.push({
        field: 'email',
        message: 'Please enter a valid email address',
        code: 'INVALID_EMAIL'
      });
    }

    if (!this.isValidPhone(formData.phone)) {
      errors.push({
        field: 'phone',
        message: 'Please enter a valid phone number',
        code: 'INVALID_PHONE'
      });
    }

    if (!formData.agreeToTerms) {
      errors.push({
        field: 'agreeToTerms',
        message: 'You must agree to the terms and conditions',
        code: 'REQUIRED_AGREEMENT'
      });
    }

    if (!formData.agreeToPrivacy) {
      errors.push({
        field: 'agreeToPrivacy',
        message: 'You must agree to the privacy policy',
        code: 'REQUIRED_AGREEMENT'
      });
    }

    return errors;
  }

  // Booking creation
  async createBooking(request: BookingRequest): Promise<Booking> {
    // Validate the request
    const validationErrors = this.validateBookingRequest(request);
    if (validationErrors.length > 0) {
      throw new Error(`Validation failed: ${validationErrors.map(e => e.message).join(', ')}`);
    }

    // Check availability
    const availabilityQuery: AvailabilityQuery = {
      serviceType: request.serviceType,
      date: request.preferredDate || new Date().toISOString(),
      isEmergency: request.isEmergency
    };

    const availability = await this.checkAvailability(availabilityQuery);
    const hasAvailability = availability.timeSlots.some(slot =>
      slot.available && slot.startTime.includes(request.preferredTime || '')
    );

    if (!hasAvailability && !request.isEmergency) {
      throw new Error('Selected time slot is no longer available');
    }

    // Create the booking
    const booking: Booking = {
      ...request,
      id: this.generateBookingId(),
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      remindersSent: []
    };

    this.bookings.set(booking.id, booking);
    return booking;
  }

  // Emergency booking creation
  async createEmergencyBooking(request: EmergencyBookingRequest): Promise<Booking> {
    // Additional validation for emergency bookings
    if (!request.crisisLevel || !['moderate', 'high', 'critical'].includes(request.crisisLevel)) {
      throw new Error('Valid crisis level is required for emergency bookings');
    }

    if (request.immediateCallback && !request.clientInfo.phone) {
      throw new Error('Phone number is required for immediate callback requests');
    }

    // Create the booking with emergency priority
    const booking = await this.createBooking(request);

    // Update with emergency-specific fields
    booking.status = 'confirmed'; // Emergency bookings are auto-confirmed
    booking.confirmedAt = new Date().toISOString();

    this.bookings.set(booking.id, booking);
    return booking;
  }

  // Booking management
  getBooking(bookingId: string): Booking | null {
    return this.bookings.get(bookingId) || null;
  }

  updateBookingStatus(bookingId: string, status: Booking['status'], reason?: string): boolean {
    const booking = this.bookings.get(bookingId);
    if (!booking) return false;

    booking.status = status;
    booking.updatedAt = new Date().toISOString();

    if (status === 'confirmed') {
      booking.confirmedAt = new Date().toISOString();
    } else if (status === 'cancelled') {
      booking.cancelledAt = new Date().toISOString();
      booking.cancellationReason = reason;
    }

    this.bookings.set(bookingId, booking);
    return true;
  }

  // Calendar integration
  async syncToCalendar(booking: Booking): Promise<CalendarEvent> {
    const service = this.getService(booking.serviceType);
    if (!service) {
      throw new Error('Invalid service type for calendar sync');
    }

    const event: CalendarEvent = {
      id: `booking-${booking.id}`,
      title: `${service.name} - ${booking.clientInfo.firstName} ${booking.clientInfo.lastName}`,
      startTime: new Date(`${booking.preferredDate}T${booking.preferredTime}`).toISOString(),
      endTime: new Date(new Date(`${booking.preferredDate}T${booking.preferredTime}`).getTime() + (service.duration * 60000)).toISOString(),
      attendees: [booking.clientInfo.email],
      description: `Legal consultation booking. ${booking.isEmergency ? 'EMERGENCY APPOINTMENT - ' : ''}Service: ${service.name}`,
      isPrivate: true,
      bookingId: booking.id,
      staffMemberId: booking.staffMemberId || 'default'
    };

    // Here you would integrate with actual calendar APIs (Google Calendar, Outlook)
    // For now, we'll just return the event structure

    return event;
  }

  // Utility methods
  private generateBookingId(): string {
    return `BK${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidPhone(phone: string): boolean {
    // UK phone number validation
    const phoneRegex = /^(\+44\s?7\d{3}|\(?07\d{3}\)?)\s?\d{3}\s?\d{3}$|^(\+44\s?1\d{3}|\(?01\d{3}\)?)\s?\d{3}\s?\d{3}$|^(\+44\s?2\d{3}|\(?02\d{3}\)?)\s?\d{3}\s?\d{3}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  }

  // Payment integration
  async processPayment(booking: Booking): Promise<PaymentSession> {
    const service = this.getService(booking.serviceType);
    if (!booking.paymentInfo || !service) {
      throw new Error('Payment information and valid service required');
    }

    const paymentSession: PaymentSession = {
      id: `pmt_${booking.id}`,
      bookingId: booking.id,
      amount: booking.paymentInfo.amount,
      currency: booking.paymentInfo.currency,
      status: 'pending',
      paymentMethod: booking.paymentInfo.method,
      createdAt: new Date().toISOString()
    };

    // Here you would integrate with payment processors (Stripe, PayPal, etc.)
    // For now, we'll simulate successful payment for demonstration

    paymentSession.status = 'paid';
    paymentSession.completedAt = new Date().toISOString();

    return paymentSession;
  }

  // Statistics and reporting
  getBookingStats(startDate: string, endDate: string): {
    totalBookings: number;
    confirmedBookings: number;
    emergencyBookings: number;
    revenue: number;
  } {
    const bookings = Array.from(this.bookings.values()).filter(booking => {
      const bookingDate = new Date(booking.createdAt);
      return bookingDate >= new Date(startDate) && bookingDate <= new Date(endDate);
    });

    return {
      totalBookings: bookings.length,
      confirmedBookings: bookings.filter(b => b.status === 'confirmed').length,
      emergencyBookings: bookings.filter(b => b.isEmergency).length,
      revenue: bookings
        .filter(b => b.status === 'confirmed')
        .reduce((total, b) => {
          const service = this.getService(b.serviceType);
          return total + (service?.price || 0);
        }, 0)
    };
  }
}

// Export a default instance
export const bookingEngine = new BookingEngine();