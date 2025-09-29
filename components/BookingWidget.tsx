'use client';

// Main booking widget component for the domestic abuse law firm
// Provides a comprehensive booking interface with security and privacy features

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, Shield, AlertTriangle, CheckCircle, Info } from 'lucide-react';

import {
  ServiceType,
  BookingFormData,
  ValidationError,
  AvailabilityResponse,
  BookingConfirmation
} from '@/types/booking';
import { bookingEngine } from '@/lib/booking-engine';

interface BookingWidgetProps {
  initialService?: string;
  onBookingComplete?: (confirmation: BookingConfirmation) => void;
  onEmergencySupport?: () => void;
  className?: string;
}

interface FormStep {
  id: string;
  title: string;
  description: string;
  isComplete: boolean;
  isActive: boolean;
}

export const BookingWidget: React.FC<BookingWidgetProps> = ({
  initialService,
  onBookingComplete,
  className = ''
}) => {
  // Form state
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<BookingFormData>({
    serviceType: initialService || '',
    isEmergency: false,
    selectedDate: '',
    selectedTime: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    isAnonymous: false,
    emergencyContact: '',
    specialRequirements: '',
    paymentMethod: 'card',
    agreeToTerms: false,
    agreeToPrivacy: false
  });

  // UI state
  const [services, setServices] = useState<ServiceType[]>([]);
  const [availability, setAvailability] = useState<AvailabilityResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [bookingConfirmation, setBookingConfirmation] = useState<BookingConfirmation | null>(null);

  // Load services on component mount
  useEffect(() => {
    const loadServices = async () => {
      try {
        const availableServices = bookingEngine.getAllServices();
        setServices(availableServices);
      } catch (error) {
        console.error('Failed to load services:', error);
      }
    };

    loadServices();
  }, []);

  // Load availability when date or service changes
  useEffect(() => {
    const loadAvailability = async () => {
      if (!formData.serviceType || !formData.selectedDate) return;

      setLoading(true);
      try {
        const availabilityData = await bookingEngine.checkAvailability({
          serviceType: formData.serviceType,
          date: formData.selectedDate,
          isEmergency: formData.isEmergency
        });
        setAvailability(availabilityData);
      } catch (error) {
        console.error('Failed to load availability:', error);
        setErrors([{
          field: 'availability',
          message: 'Failed to load available time slots',
          code: 'AVAILABILITY_ERROR'
        }]);
      } finally {
        setLoading(false);
      }
    };

    loadAvailability();
  }, [formData.serviceType, formData.selectedDate, formData.isEmergency]);

  // Form steps
  const steps: FormStep[] = [
    {
      id: 'service',
      title: 'Service Selection',
      description: 'Choose your legal service',
      isComplete: !!formData.serviceType,
      isActive: currentStep === 1
    },
    {
      id: 'datetime',
      title: 'Date & Time',
      description: 'Select your appointment',
      isComplete: !!formData.selectedDate && !!formData.selectedTime,
      isActive: currentStep === 2
    },
    {
      id: 'details',
      title: 'Your Details',
      description: 'Personal information',
      isComplete: !!formData.firstName && !!formData.lastName && !!formData.email,
      isActive: currentStep === 3
    },
    {
      id: 'confirmation',
      title: 'Confirm Booking',
      description: 'Review and confirm',
      isComplete: false,
      isActive: currentStep === 4
    }
  ];

  // Form handlers
  const handleInputChange = (field: keyof BookingFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear related errors
    setErrors(prev => prev.filter(error => error.field !== field));
  };

  const validateCurrentStep = (): boolean => {
    const newErrors: ValidationError[] = [];

    switch (currentStep) {
      case 1:
        if (!formData.serviceType) {
          newErrors.push({
            field: 'serviceType',
            message: 'Please select a service',
            code: 'REQUIRED_FIELD'
          });
        }
        break;

      case 2:
        if (!formData.selectedDate) {
          newErrors.push({
            field: 'selectedDate',
            message: 'Please select an appointment date',
            code: 'REQUIRED_FIELD'
          });
        }
        if (!formData.selectedTime) {
          newErrors.push({
            field: 'selectedTime',
            message: 'Please select an appointment time',
            code: 'REQUIRED_FIELD'
          });
        }
        break;

      case 3:
        if (!formData.firstName.trim()) {
          newErrors.push({
            field: 'firstName',
            message: 'First name is required',
            code: 'REQUIRED_FIELD'
          });
        }
        if (!formData.lastName.trim()) {
          newErrors.push({
            field: 'lastName',
            message: 'Last name is required',
            code: 'REQUIRED_FIELD'
          });
        }
        if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.push({
            field: 'email',
            message: 'Valid email address is required',
            code: 'INVALID_EMAIL'
          });
        }
        if (!formData.phone.trim()) {
          newErrors.push({
            field: 'phone',
            message: 'Phone number is required',
            code: 'REQUIRED_FIELD'
          });
        }
        break;
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const nextStep = () => {
    if (validateCurrentStep() && currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;

    setLoading(true);
    try {
      // Create booking request
      const bookingRequest = {
        serviceType: formData.serviceType,
        isEmergency: formData.isEmergency,
        preferredDate: formData.selectedDate,
        preferredTime: formData.selectedTime,
        clientInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          isAnonymous: formData.isAnonymous,
          emergencyContact: formData.emergencyContact || undefined,
          specialRequirements: formData.specialRequirements || undefined
        },
        paymentInfo: {
          amount: services.find(s => s.id === formData.serviceType)?.price || 0,
          currency: 'GBP',
          method: formData.paymentMethod as 'card' | 'bank_transfer' | 'legal_aid'
        }
      };

      // Create booking through engine
      const booking = await bookingEngine.createBooking(bookingRequest);

      // Process payment if required
      if (bookingRequest.paymentInfo.amount > 0) {
        await bookingEngine.processPayment(booking);
      }

      // Generate confirmation
      const confirmation: BookingConfirmation = {
        bookingId: booking.id,
        status: 'confirmed',
        meetingLink: `https://meet.lawfirm.co.uk/booking/${booking.id}`,
        nextSteps: [
          'Check your email for confirmation details',
          'Add the appointment to your calendar',
          'Prepare any relevant documents',
          'Contact us if you need to reschedule'
        ],
        contactInfo: {
          phone: '+44 20 1234 5678',
          email: 'appointments@lawfirm.co.uk',
          emergency: '+44 20 1234 9999'
        }
      };

      setBookingConfirmation(confirmation);
      onBookingComplete?.(confirmation);

    } catch (error) {
      console.error('Booking failed:', error);
      setErrors([{
        field: 'submit',
        message: error instanceof Error ? error.message : 'Booking failed. Please try again.',
        code: 'BOOKING_ERROR'
      }]);
    } finally {
      setLoading(false);
    }
  };

  if (bookingConfirmation) {
    return (
      <Card className={`w-full max-w-2xl mx-auto ${className}`}>
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-800">Booking Confirmed!</CardTitle>
          <CardDescription>
            Your appointment has been successfully booked
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Booking Details</h3>
            <p className="text-blue-800">
              <strong>Booking ID:</strong> {bookingConfirmation.bookingId}
            </p>
            <p className="text-blue-800">
              <strong>Meeting Link:</strong>{' '}
              <a href={bookingConfirmation.meetingLink} className="underline">
                Join Meeting
              </a>
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Next Steps:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              {bookingConfirmation.nextSteps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ul>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Contact Information</h3>
            <p className="text-sm"><strong>Phone:</strong> {bookingConfirmation.contactInfo.phone}</p>
            <p className="text-sm"><strong>Email:</strong> {bookingConfirmation.contactInfo.email}</p>
            <p className="text-sm text-red-600">
              <strong>Emergency:</strong> {bookingConfirmation.contactInfo.emergency}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`w-full max-w-4xl mx-auto ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Book Your Consultation</CardTitle>
            <CardDescription>
              Secure and confidential appointment booking for legal services
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-green-600" />
            <span className="text-sm text-green-600 font-medium">Secure & Private</span>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-between mt-6">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                ${step.isComplete ? 'bg-green-600 text-white' :
                  step.isActive ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}
              `}>
                {step.isComplete ? <CheckCircle className="w-4 h-4" /> : index + 1}
              </div>
              <div className="ml-2 hidden sm:block">
                <div className={`text-sm font-medium ${step.isActive ? 'text-blue-600' : 'text-gray-600'}`}>
                  {step.title}
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-8 h-1 mx-2 ${step.isComplete ? 'bg-green-600' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Emergency Notice */}
        {formData.isEmergency && (
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Emergency Booking:</strong> We will prioritise your appointment and contact you within 2 hours.
            </AlertDescription>
          </Alert>
        )}

        {/* Step 1: Service Selection */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <Checkbox
                id="emergency"
                checked={formData.isEmergency}
                onCheckedChange={(checked: boolean) => handleInputChange('isEmergency', checked)}
              />
              <Label htmlFor="emergency" className="text-sm font-medium">
                This is an emergency situation
              </Label>
            </div>

            <div>
              <Label className="text-base font-medium">Select Service *</Label>
              <Select value={formData.serviceType} onValueChange={(value: string) => handleInputChange('serviceType', value)}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Choose a legal service" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      <div className="flex justify-between items-center w-full">
                        <span>{service.name}</span>
                        <div className="flex items-center space-x-2 ml-4">
                          <Badge variant="outline">£{service.price}</Badge>
                          <Badge variant={service.isEmergencyAvailable ? "default" : "secondary"}>
                            {service.duration}min
                          </Badge>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.find(e => e.field === 'serviceType') && (
                <p className="text-sm text-red-600 mt-1">{errors.find(e => e.field === 'serviceType')?.message}</p>
              )}
            </div>

            {formData.serviceType && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  {services.find(s => s.id === formData.serviceType)?.description}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Date & Time Selection */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div>
              <Label className="text-base font-medium">Select Date *</Label>
              <Input
                type="date"
                value={formData.selectedDate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('selectedDate', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="mt-2"
              />
            </div>

            {formData.selectedDate && availability && (
              <div>
                <Label className="text-base font-medium">Available Times *</Label>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 mt-2">
                  {availability.timeSlots
                    .filter(slot => slot.available)
                    .map((slot, index) => (
                      <Button
                        key={index}
                        variant={formData.selectedTime === slot.startTime.split('T')[1]?.substring(0, 5) ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleInputChange('selectedTime', slot.startTime.split('T')[1]?.substring(0, 5))}
                        className="text-xs"
                      >
                        {slot.startTime.split('T')[1]?.substring(0, 5)}
                      </Button>
                    ))}
                </div>
                {errors.find(e => e.field === 'selectedTime') && (
                  <p className="text-sm text-red-600 mt-1">{errors.find(e => e.field === 'selectedTime')?.message}</p>
                )}
              </div>
            )}

            {loading && (
              <div className="text-center py-4">
                <div className="inline-flex items-center">
                  <Clock className="w-4 h-4 animate-spin mr-2" />
                  <span className="text-sm">Loading availability...</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Personal Details */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <Checkbox
                id="anonymous"
                checked={formData.isAnonymous}
                onCheckedChange={(checked: boolean) => handleInputChange('isAnonymous', checked)}
              />
              <Label htmlFor="anonymous" className="text-sm font-medium">
                Book anonymously (first consultation only)
              </Label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('firstName', e.target.value)}
                  className="mt-1"
                  placeholder="Enter your first name"
                />
                {errors.find(e => e.field === 'firstName') && (
                  <p className="text-sm text-red-600 mt-1">{errors.find(e => e.field === 'firstName')?.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('lastName', e.target.value)}
                  className="mt-1"
                  placeholder="Enter your last name"
                />
                {errors.find(e => e.field === 'lastName') && (
                  <p className="text-sm text-red-600 mt-1">{errors.find(e => e.field === 'lastName')?.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('email', e.target.value)}
                  className="mt-1"
                  placeholder="your.email@example.com"
                />
                {errors.find(e => e.field === 'email') && (
                  <p className="text-sm text-red-600 mt-1">{errors.find(e => e.field === 'email')?.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('phone', e.target.value)}
                  className="mt-1"
                  placeholder="+44 20 1234 5678"
                />
                {errors.find(e => e.field === 'phone') && (
                  <p className="text-sm text-red-600 mt-1">{errors.find(e => e.field === 'phone')?.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="emergencyContact">Emergency Contact (Optional)</Label>
              <Input
                id="emergencyContact"
                value={formData.emergencyContact}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('emergencyContact', e.target.value)}
                className="mt-1"
                placeholder="Alternative contact number"
              />
            </div>

            <div>
              <Label htmlFor="specialRequirements">Special Requirements (Optional)</Label>
              <Textarea
                id="specialRequirements"
                value={formData.specialRequirements}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('specialRequirements', e.target.value)}
                className="mt-1"
                placeholder="Any accessibility requirements or special arrangements needed"
                rows={3}
              />
            </div>
          </div>
        )}

        {/* Step 4: Confirmation */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3">Booking Summary</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Service:</strong> {services.find(s => s.id === formData.serviceType)?.name}</p>
                <p><strong>Date:</strong> {formData.selectedDate && new Date(formData.selectedDate).toLocaleDateString('en-GB')}</p>
                <p><strong>Time:</strong> {formData.selectedTime}</p>
                <p><strong>Duration:</strong> {services.find(s => s.id === formData.serviceType)?.duration} minutes</p>
                <p><strong>Price:</strong> £{services.find(s => s.id === formData.serviceType)?.price}</p>
                {formData.isEmergency && <Badge className="bg-red-100 text-red-800">Emergency Booking</Badge>}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked: boolean) => handleInputChange('agreeToTerms', checked)}
                />
                <Label htmlFor="terms" className="text-sm leading-relaxed">
                  I agree to the{' '}
                  <a href="/legal/terms" className="text-blue-600 underline" target="_blank">
                    Terms and Conditions
                  </a>
                  {' '}and understand the cancellation policy
                </Label>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="privacy"
                  checked={formData.agreeToPrivacy}
                  onCheckedChange={(checked: boolean) => handleInputChange('agreeToPrivacy', checked)}
                />
                <Label htmlFor="privacy" className="text-sm leading-relaxed">
                  I agree to the{' '}
                  <a href="/privacy" className="text-blue-600 underline" target="_blank">
                    Privacy Policy
                  </a>
                  {' '}and understand how my data will be used
                </Label>
              </div>
            </div>

            {errors.find(e => e.field === 'submit') && (
              <Alert className="border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  {errors.find(e => e.field === 'submit')?.message}
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between pt-6 border-t">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            Previous
          </Button>

          {currentStep < 4 ? (
            <Button onClick={nextStep}>
              Next
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? 'Booking...' : 'Confirm Booking'}
            </Button>
          )}
        </div>

        {/* Security Notice */}
        <div className="flex items-center justify-center space-x-2 text-xs text-gray-500 pt-4 border-t">
          <Shield className="w-4 h-4" />
          <span>Your information is encrypted and secure</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingWidget;