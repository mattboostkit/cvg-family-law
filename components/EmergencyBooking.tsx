'use client';

// Emergency booking component for crisis situations
// Provides trauma-informed booking with immediate support options

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  AlertTriangle,
  Phone,
  MessageCircle,
  Clock,
  Shield,
  Heart,
  Users,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

import {
  EmergencyBookingRequest,
  ServiceType,
  ValidationError,
  BookingConfirmation
} from '@/types/booking';
import { bookingEngine } from '@/lib/booking-engine';

interface EmergencyBookingProps {
  onBookingComplete?: (confirmation: BookingConfirmation) => void;
  onCrisisSupport?: () => void;
  className?: string;
}

interface CrisisLevel {
  level: 'moderate' | 'high' | 'critical';
  label: string;
  description: string;
  timeframe: string;
  color: string;
}

const CRISIS_LEVELS: CrisisLevel[] = [
  {
    level: 'moderate',
    label: 'Moderate Risk',
    description: 'Situation is concerning but not immediately life-threatening',
    timeframe: 'Within 24 hours',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-300'
  },
  {
    level: 'high',
    label: 'High Risk',
    description: 'Immediate danger or threat to safety',
    timeframe: 'Within 4-6 hours',
    color: 'bg-orange-100 text-orange-800 border-orange-300'
  },
  {
    level: 'critical',
    label: 'Critical Emergency',
    description: 'Life-threatening situation requiring immediate intervention',
    timeframe: 'Within 1-2 hours',
    color: 'bg-red-100 text-red-800 border-red-300'
  }
];

export const EmergencyBooking: React.FC<EmergencyBookingProps> = ({
  onBookingComplete,
  onCrisisSupport,
  className = ''
}) => {
  // Form state
  const [crisisLevel, setCrisisLevel] = useState<'moderate' | 'high' | 'critical'>('moderate');
  const [immediateCallback, setImmediateCallback] = useState(true);
  const [contactMethod, setContactMethod] = useState<'phone' | 'email' | 'sms'>('phone');
  const [canSpeakFreely, setCanSpeakFreely] = useState(false);
  const [safeToEmail, setSafeToEmail] = useState(false);

  // Contact details
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');

  // Service selection
  const [selectedService, setSelectedService] = useState('');
  const [specialRequirements, setSpecialRequirements] = useState('');

  // UI state
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [step, setStep] = useState(1);
  const [bookingConfirmation, setBookingConfirmation] = useState<BookingConfirmation | null>(null);

  // Available emergency services
  const emergencyServices = bookingEngine.getAllServices().filter(service => service.isEmergencyAvailable);

  // Crisis assessment validation
  const validateCrisisAssessment = (): boolean => {
    const newErrors: ValidationError[] = [];

    if (!firstName.trim()) {
      newErrors.push({
        field: 'firstName',
        message: 'First name is required for emergency contact',
        code: 'REQUIRED_FIELD'
      });
    }

    if (!lastName.trim()) {
      newErrors.push({
        field: 'lastName',
        message: 'Last name is required for emergency contact',
        code: 'REQUIRED_FIELD'
      });
    }

    if (!phone.trim()) {
      newErrors.push({
        field: 'phone',
        message: 'Phone number is required for emergency contact',
        code: 'REQUIRED_FIELD'
      });
    }

    if (immediateCallback && !bookingEngine['isValidPhone'](phone)) {
      newErrors.push({
        field: 'phone',
        message: 'Please enter a valid phone number',
        code: 'INVALID_PHONE'
      });
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.push({
        field: 'email',
        message: 'Please enter a valid email address',
        code: 'INVALID_EMAIL'
      });
    }

    if (!selectedService) {
      newErrors.push({
        field: 'service',
        message: 'Please select the type of legal support needed',
        code: 'REQUIRED_FIELD'
      });
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  // Handle emergency booking submission
  const handleEmergencyBooking = async () => {
    if (!validateCrisisAssessment()) return;

    setLoading(true);
    try {
      const emergencyRequest: EmergencyBookingRequest = {
        serviceType: selectedService,
        isEmergency: true,
        clientInfo: {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim() || '',
          phone: phone.trim(),
          emergencyContact: emergencyContact.trim() || undefined,
          specialRequirements: specialRequirements.trim() || undefined
        },
        crisisLevel,
        immediateCallback,
        safetyCheck: {
          canSpeakFreely,
          safeToEmail,
          preferredContactMethod: contactMethod
        },
        paymentInfo: {
          amount: 0, // Emergency consultations are free
          currency: 'GBP',
          method: 'legal_aid'
        }
      };

      // Create emergency booking
      const booking = await bookingEngine.createEmergencyBooking(emergencyRequest);

      // Generate confirmation
      const confirmation: BookingConfirmation = {
        bookingId: booking.id,
        status: 'confirmed',
        nextSteps: [
          'Emergency support team has been notified',
          'You will receive a callback within 2 hours',
          'Keep your phone available and charged',
          'Emergency services: 999 (if in immediate danger)',
          'Domestic abuse helpline: 0808 2000 247'
        ],
        contactInfo: {
          phone: '+44 20 1234 9999',
          email: 'emergency@lawfirm.co.uk',
          emergency: '+44 20 1234 9999'
        }
      };

      setBookingConfirmation(confirmation);
      onBookingComplete?.(confirmation);

    } catch (error) {
      console.error('Emergency booking failed:', error);
      setErrors([{
        field: 'submit',
        message: error instanceof Error ? error.message : 'Emergency booking failed. Please call our emergency line directly.',
        code: 'EMERGENCY_BOOKING_ERROR'
      }]);
    } finally {
      setLoading(false);
    }
  };

  if (bookingConfirmation) {
    return (
      <Card className={`w-full max-w-2xl mx-auto border-green-200 bg-green-50 ${className}`}>
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-800">Emergency Support Activated</CardTitle>
          <CardDescription className="text-green-700">
            Our emergency response team has been notified
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-green-100 p-4 rounded-lg border border-green-200">
            <h3 className="font-semibold text-green-900 mb-2">What happens next:</h3>
            <ul className="space-y-1 text-sm text-green-800">
              <li>• Our emergency team will call you within 2 hours</li>
              <li>• You will receive immediate legal guidance and support</li>
              <li>• Safety planning and risk assessment will be conducted</li>
              <li>• Emergency protective orders can be arranged if needed</li>
            </ul>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Emergency Contacts:</h3>
            <p className="text-sm text-blue-800">
              <strong>Emergency Services:</strong> 999<br />
              <strong>Domestic Abuse Helpline:</strong> 0808 2000 247<br />
              <strong>Our Emergency Line:</strong> {bookingConfirmation.contactInfo.emergency}
            </p>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Your booking reference: <strong>{bookingConfirmation.bookingId}</strong>
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Emergency Header */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <CardTitle className="text-red-800">Emergency Legal Support</CardTitle>
                <CardDescription className="text-red-700">
                  Immediate assistance for crisis situations
                </CardDescription>
              </div>
            </div>
            <Badge className="bg-red-100 text-red-800">
              24/7 Emergency Support
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <Phone className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <p className="font-medium text-red-800">Emergency Line: +44 20 1234 9999</p>
                <p className="text-sm text-red-700">Call now if you are in immediate danger</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <MessageCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <p className="font-medium text-red-800">Crisis Text Support</p>
                <p className="text-sm text-red-700">Text "HELP" to 85258 for 24/7 crisis support</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Crisis Assessment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Heart className="w-5 h-5 mr-2 text-red-600" />
            Crisis Assessment
          </CardTitle>
          <CardDescription>
            Help us understand your situation so we can provide the most appropriate support
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Crisis Level Selection */}
          <div>
            <Label className="text-base font-medium mb-3 block">Current Crisis Level</Label>
            <div className="grid gap-3">
              {CRISIS_LEVELS.map((level) => (
                <div
                  key={level.level}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    crisisLevel === level.level
                      ? `${level.color} ring-2 ring-offset-2 ring-blue-500`
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setCrisisLevel(level.level)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{level.label}</h4>
                      <p className="text-sm text-gray-600 mt-1">{level.description}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="mb-1">
                        {level.timeframe}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Immediate Callback */}
          <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
            <Checkbox
              id="immediateCallback"
              checked={immediateCallback}
              onCheckedChange={(checked: boolean) => setImmediateCallback(checked)}
            />
            <div>
              <Label htmlFor="immediateCallback" className="font-medium">
                Request immediate callback
              </Label>
              <p className="text-sm text-gray-600">
                We will call you within 30 minutes if selected
              </p>
            </div>
          </div>

          {/* Safety Check */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center">
              <Shield className="w-4 h-4 mr-2" />
              Safety Check
            </h4>

            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="canSpeakFreely"
                  checked={canSpeakFreely}
                  onCheckedChange={(checked: boolean) => setCanSpeakFreely(checked)}
                />
                <Label htmlFor="canSpeakFreely" className="text-sm">
                  I can speak freely on the phone right now
                </Label>
              </div>

              <div className="flex items-center space-x-3">
                <Checkbox
                  id="safeToEmail"
                  checked={safeToEmail}
                  onCheckedChange={(checked: boolean) => setSafeToEmail(checked)}
                />
                <Label htmlFor="safeToEmail" className="text-sm">
                  It is safe to send emails to my contact address
                </Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>
            Your details will be kept strictly confidential and secure
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter your first name"
                className="mt-1"
              />
              {errors.find(e => e.field === 'firstName') && (
                <p className="text-sm text-red-600 mt-1">{errors.find(e => e.field === 'firstName')?.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter your last name"
                className="mt-1"
              />
              {errors.find(e => e.field === 'lastName') && (
                <p className="text-sm text-red-600 mt-1">{errors.find(e => e.field === 'lastName')?.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+44 20 1234 5678"
                className="mt-1"
              />
              {errors.find(e => e.field === 'phone') && (
                <p className="text-sm text-red-600 mt-1">{errors.find(e => e.field === 'phone')?.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email Address (Optional)</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="mt-1"
              />
              {errors.find(e => e.field === 'email') && (
                <p className="text-sm text-red-600 mt-1">{errors.find(e => e.field === 'email')?.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="emergencyContact">Emergency Contact (Optional)</Label>
            <Input
              id="emergencyContact"
              value={emergencyContact}
              onChange={(e) => setEmergencyContact(e.target.value)}
              placeholder="Alternative contact number"
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Legal Service Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Legal Support Needed</CardTitle>
          <CardDescription>
            Select the type of legal assistance required
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {emergencyServices.map((service) => (
              <div
                key={service.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedService === service.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedService(service.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{service.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="mb-1">
                      {service.duration}min
                    </Badge>
                    <p className="text-xs text-gray-500">Free emergency consultation</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {errors.find(e => e.field === 'service') && (
            <p className="text-sm text-red-600 mt-2">{errors.find(e => e.field === 'service')?.message}</p>
          )}
        </CardContent>
      </Card>

      {/* Special Requirements */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
          <CardDescription>
            Any special arrangements or additional details we should know
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={specialRequirements}
            onChange={(e) => setSpecialRequirements(e.target.value)}
            placeholder="Please describe any accessibility requirements, language preferences, or other special arrangements needed..."
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Error Display */}
      {errors.find(e => e.field === 'submit') && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {errors.find(e => e.field === 'submit')?.message}
          </AlertDescription>
        </Alert>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          onClick={handleEmergencyBooking}
          disabled={loading}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white"
        >
          {loading ? (
            <>
              <Clock className="w-4 h-4 mr-2 animate-spin" />
              Activating Emergency Support...
            </>
          ) : (
            <>
              <Phone className="w-4 h-4 mr-2" />
              Activate Emergency Support
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>

        <Button
          variant="outline"
          onClick={onCrisisSupport}
          className="flex-1"
        >
          <Heart className="w-4 h-4 mr-2" />
          Access Crisis Resources
        </Button>
      </div>

      {/* Confidentiality Notice */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>Confidentiality:</strong> All information provided is strictly confidential and protected by legal professional privilege.
          Your safety and privacy are our highest priority.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default EmergencyBooking;