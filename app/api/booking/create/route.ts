// API route for creating new bookings
// Handles booking creation with validation and security measures

import { NextRequest, NextResponse } from 'next/server';
import { bookingEngine } from '@/lib/booking-engine';
import { BookingRequest, ApiResponse, BookingConfirmation, PaymentSession } from '@/types/booking';

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();

    const {
      serviceType,
      isEmergency,
      preferredDate,
      preferredTime,
      clientInfo,
      crisisAssessment,
      paymentInfo
    } = body;

    // Validate required fields
    if (!serviceType || !clientInfo) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: serviceType and clientInfo are required'
        } as ApiResponse<never>,
        { status: 400 }
      );
    }

    // Validate client information
    if (!clientInfo.firstName || !clientInfo.lastName || !clientInfo.email || !clientInfo.phone) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required client information: firstName, lastName, email, and phone are required'
        } as ApiResponse<never>,
        { status: 400 }
      );
    }

    // Validate service exists
    const service = bookingEngine.getService(serviceType);
    if (!service) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid service type selected'
        } as ApiResponse<never>,
        { status: 400 }
      );
    }

    // Check if emergency booking is valid for this service
    if (isEmergency && !service.isEmergencyAvailable) {
      return NextResponse.json(
        {
          success: false,
          error: 'Emergency booking is not available for this service'
        } as ApiResponse<never>,
        { status: 400 }
      );
    }

    // Create booking request object
    const bookingRequest: BookingRequest = {
      serviceType,
      isEmergency: isEmergency || false,
      preferredDate,
      preferredTime,
      clientInfo,
      crisisAssessment,
      paymentInfo
    };

    // Create booking through engine
    const booking = await bookingEngine.createBooking(bookingRequest);

    // Process payment if required
    let paymentSession = null;
    if (paymentInfo && paymentInfo.amount > 0) {
      try {
        paymentSession = await bookingEngine.processPayment(booking);
      } catch (paymentError) {
        console.error('Payment processing failed:', paymentError);
        // Don't fail the booking for payment issues - handle separately
      }
    }

    // Generate confirmation
    const confirmation: BookingConfirmation = {
      bookingId: booking.id,
      status: paymentSession?.status === 'paid' ? 'confirmed' : 'pending_payment',
      meetingLink: `https://meet.lawfirm.co.uk/booking/${booking.id}`,
      nextSteps: [
        'Check your email for booking confirmation',
        'Add appointment to your calendar',
        'Prepare any relevant documents',
        'Contact us if you need to reschedule'
      ],
      contactInfo: {
        phone: '+44 20 1234 5678',
        email: 'appointments@lawfirm.co.uk',
        emergency: '+44 20 1234 9999'
      }
    };

    // Log booking creation (in production, use proper logging service)
    console.log('Booking created:', {
      id: booking.id,
      service: serviceType,
      isEmergency,
      clientEmail: clientInfo.email,
      timestamp: new Date().toISOString()
    });

    // Return success response
    return NextResponse.json({
      success: true,
      data: {
        booking,
        confirmation,
        paymentSession
      }
    } as ApiResponse<{
      booking: typeof booking;
      confirmation: BookingConfirmation;
      paymentSession: PaymentSession | null;
    }>);

  } catch (error) {
    console.error('Booking creation failed:', error);

    // Return appropriate error response
    const errorMessage = error instanceof Error ? error.message : 'Booking creation failed';

    return NextResponse.json(
      {
        success: false,
        error: errorMessage
      } as ApiResponse<never>,
      { status: 500 }
    );
  }
}

// OPTIONS handler for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}