'use client';

// Main booking flow page for the domestic abuse law firm
// Provides a comprehensive booking experience with calendar integration

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Calendar,
  Shield,
  Clock,
  Users,
  Phone,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Info
} from 'lucide-react';

import BookingWidget from '@/components/BookingWidget';
import BookingCalendar from '@/components/BookingCalendar';
import EmergencyBooking from '@/components/EmergencyBooking';

import { BookingConfirmation } from '@/types/booking';

export default function BookingPage() {
  const [activeTab, setActiveTab] = useState('standard');
  const [bookingConfirmation, setBookingConfirmation] = useState<BookingConfirmation | null>(null);

  // Handle booking completion
  const handleBookingComplete = (confirmation: BookingConfirmation) => {
    setBookingConfirmation(confirmation);
    // Scroll to confirmation section
    setTimeout(() => {
      document.getElementById('booking-confirmation')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Handle emergency support activation
  const handleEmergencySupport = () => {
    setActiveTab('emergency');
    // Scroll to emergency section
    setTimeout(() => {
      document.getElementById('emergency-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Book Your Consultation
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Secure, confidential appointment booking with our specialist domestic abuse and family law solicitors
            </p>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-6 mt-8">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Shield className="w-5 h-5 text-green-600" />
              <span>SSL Encrypted</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span>Confidential & Secure</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Users className="w-5 h-5 text-green-600" />
              <span>Law Society Accredited</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Phone className="w-5 h-5 text-green-600" />
              <span>24/7 Emergency Support</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {bookingConfirmation ? (
          /* Booking Confirmation */
          <div id="booking-confirmation" className="max-w-2xl mx-auto">
            <Card className="border-green-200 bg-green-50">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl text-green-800">Booking Confirmed!</CardTitle>
                <CardDescription className="text-green-700">
                  Your appointment has been successfully booked
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-white p-6 rounded-lg border border-green-200">
                  <h3 className="font-semibold text-green-900 mb-4">Booking Details</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Booking Reference:</strong> {bookingConfirmation.bookingId}</p>
                    <p><strong>Status:</strong> <Badge className="bg-green-100 text-green-800">Confirmed</Badge></p>
                    {bookingConfirmation.meetingLink && (
                      <p>
                        <strong>Meeting Link:</strong>{' '}
                        <a href={bookingConfirmation.meetingLink} className="text-blue-600 underline">
                          Join Meeting
                        </a>
                      </p>
                    )}
                  </div>
                </div>

                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-4">Next Steps:</h3>
                  <ul className="space-y-2 text-sm text-blue-800">
                    {bookingConfirmation.nextSteps.map((step, index) => (
                      <li key={index} className="flex items-start">
                        <ArrowRight className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-semibold mb-4">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-gray-700">Phone</p>
                      <p className="text-gray-600">{bookingConfirmation.contactInfo.phone}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">Email</p>
                      <p className="text-gray-600">{bookingConfirmation.contactInfo.email}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700 text-red-600">Emergency</p>
                      <p className="text-gray-600 text-red-600">{bookingConfirmation.contactInfo.emergency}</p>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <Button
                    onClick={() => setBookingConfirmation(null)}
                    variant="outline"
                  >
                    Book Another Appointment
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            {/* Tab Navigation */}
            <div className="flex justify-center">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="standard" className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Standard Booking</span>
                </TabsTrigger>
                <TabsTrigger value="emergency" className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Emergency Support</span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Standard Booking Tab */}
            <TabsContent value="standard" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Booking Widget */}
                <div>
                  <BookingWidget
                    onBookingComplete={handleBookingComplete}
                    onEmergencySupport={handleEmergencySupport}
                  />
                </div>

                {/* Calendar */}
                <div>
                  <BookingCalendar
                    serviceType="domestic-abuse-consultation"
                    onTimeSlotSelect={(date, time) => {
                      console.log('Time slot selected:', date, time);
                    }}
                  />
                </div>
              </div>

              {/* Additional Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <Clock className="w-5 h-5 mr-2 text-blue-600" />
                      Consultation Duration
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      Initial consultations typically last 45-60 minutes, providing comprehensive legal advice tailored to your situation.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <Users className="w-5 h-5 mr-2 text-blue-600" />
                      Specialist Solicitors
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      All our solicitors are specialists in domestic abuse and family law with extensive experience in sensitive cases.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <Shield className="w-5 h-5 mr-2 text-blue-600" />
                      Confidentiality
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      All consultations are strictly confidential and protected by legal professional privilege.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Emergency Support Tab */}
            <TabsContent value="emergency" className="space-y-8">
              <div id="emergency-section">
                <EmergencyBooking
                  onBookingComplete={handleBookingComplete}
                />
              </div>
            </TabsContent>
          </Tabs>
        )}

        {/* Emergency Notice */}
        {!bookingConfirmation && (
          <Alert className="mt-8 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Emergency Support:</strong> If you are in immediate danger, please call our emergency line{' '}
              <a href="tel:+442012349999" className="font-semibold underline">
                +44 20 1234 9999
              </a>{' '}
              or emergency services on 999.
            </AlertDescription>
          </Alert>
        )}

        {/* FAQ Section */}
        {!bookingConfirmation && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Info className="w-5 h-5 mr-2" />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>
                Common questions about our booking process
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Is my consultation confidential?</h4>
                  <p className="text-sm text-gray-600">
                    Yes, all consultations are strictly confidential and protected by legal professional privilege.
                    Your information will never be shared without your explicit consent.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">How much does a consultation cost?</h4>
                  <p className="text-sm text-gray-600">
                    Initial consultations are charged at our standard rates, but emergency consultations
                    may be eligible for legal aid or provided at reduced rates based on your circumstances.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Can I book anonymously?</h4>
                  <p className="text-sm text-gray-600">
                    Yes, we offer anonymous booking options for initial consultations to ensure your
                    safety and privacy. You can provide contact details when you feel comfortable.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">What should I prepare?</h4>
                  <p className="text-sm text-gray-600">
                    You do not need to prepare anything specific. Our solicitors will guide you through
                    the process and ask relevant questions to understand your situation.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}