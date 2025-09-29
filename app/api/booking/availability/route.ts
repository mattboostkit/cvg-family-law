// API route for checking appointment availability
// Provides real-time availability data for the booking system

import { NextRequest, NextResponse } from 'next/server';
import { bookingEngine } from '@/lib/booking-engine';
import { AvailabilityQuery, ApiResponse } from '@/types/booking';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Extract query parameters
    const serviceType = searchParams.get('serviceType');
    const date = searchParams.get('date');
    const isEmergency = searchParams.get('isEmergency') === 'true';
    const duration = searchParams.get('duration');

    // Validate required parameters
    if (!serviceType || !date) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required parameters: serviceType and date are required'
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
          error: 'Invalid service type'
        } as ApiResponse<never>,
        { status: 400 }
      );
    }

    // Create availability query
    const query: AvailabilityQuery = {
      serviceType,
      date,
      isEmergency,
      duration: duration ? parseInt(duration) : undefined
    };

    // Check availability
    const availability = await bookingEngine.checkAvailability(query);

    // Return availability data
    return NextResponse.json({
      success: true,
      data: availability
    } as ApiResponse<typeof availability>);

  } catch (error) {
    console.error('Availability check failed:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to check availability'
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
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}