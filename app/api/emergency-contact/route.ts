import { NextRequest, NextResponse } from 'next/server';

// Emergency contact API for offline sync
// Critical for domestic abuse law firm

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required emergency contact fields
    const { name, phone, situation, urgency = 'high' } = body;

    if (!name || !phone || !situation) {
      return NextResponse.json(
        { error: 'Missing required fields: name, phone, situation' },
        { status: 400 }
      );
    }

    // In a real application, you would:
    // 1. Store in database
    // 2. Send emergency notifications
    // 3. Trigger immediate response protocols

    console.log('[EMERGENCY] New emergency contact received:', {
      name,
      phone,
      situation,
      urgency,
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get('user-agent'),
    });

    // Simulate emergency response system
    const emergencyResponse = {
      id: Date.now().toString(),
      status: 'received',
      priority: urgency,
      estimatedResponse: 'immediate',
      message: 'Emergency contact received. Help is on the way.',
      nextSteps: [
        'Immediate legal consultation available 24/7',
        'Emergency injunction applications prepared',
        'Police liaison if required',
        'Safe accommodation arrangements',
      ],
    };

    // In production, you would integrate with:
    // - Emergency notification systems
    // - Database storage
    // - SMS/Email services
    // - Case management systems

    return NextResponse.json(emergencyResponse, {
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Content-Type': 'application/json',
      },
    });

  } catch (error) {
    console.error('[EMERGENCY] API Error:', error);

    return NextResponse.json(
      {
        error: 'Emergency contact submission failed',
        message: 'Please call our emergency hotline directly'
      },
      { status: 500 }
    );
  }
}

// Health check endpoint for service worker
export async function GET() {
  return NextResponse.json({
    status: 'active',
    service: 'emergency-contact',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
}