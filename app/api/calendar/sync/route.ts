// API route for calendar synchronization
// Syncs bookings with external calendar systems (Google Calendar, Outlook)

import { NextRequest, NextResponse } from 'next/server';
import { bookingEngine } from '@/lib/booking-engine';
import {
  ApiResponse,
  CalendarSyncResult,
  CalendarProvider,
  Booking
} from '@/types/booking';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      provider,
      bookingIds,
      syncDirection = 'export', // 'export' | 'import' | 'bidirectional'
      dryRun = false
    } = body;

    // Validate required fields
    if (!provider) {
      return NextResponse.json(
        {
          success: false,
          error: 'Calendar provider is required'
        } as ApiResponse<never>,
        { status: 400 }
      );
    }

    // Validate provider configuration
    if (!provider.type || !['google', 'outlook', 'exchange'].includes(provider.type)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid calendar provider type. Must be google, outlook, or exchange'
        } as ApiResponse<never>,
        { status: 400 }
      );
    }

    // Get bookings to sync
    let bookings: Booking[] = [];
    if (bookingIds && bookingIds.length > 0) {
      // Sync specific bookings
      bookings = bookingIds
        .map((id: string) => bookingEngine.getBooking(id))
        .filter((booking: Booking | null): booking is Booking => booking !== null);
    } else {
      // Sync all confirmed bookings
      const allBookings = Array.from(bookingEngine['bookings'].values());
      bookings = allBookings.filter(booking => booking.status === 'confirmed');
    }

    if (bookings.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'No bookings found to sync'
        } as ApiResponse<never>,
        { status: 404 }
      );
    }

    // Perform calendar sync based on direction
    const syncResult: CalendarSyncResult = {
      eventsCreated: 0,
      eventsUpdated: 0,
      eventsDeleted: 0,
      errors: [],
      lastSyncAt: new Date().toISOString()
    };

    // Export bookings to external calendar
    if (syncDirection === 'export' || syncDirection === 'bidirectional') {
      for (const booking of bookings) {
        try {
          if (dryRun) {
            // Simulate sync for testing
            syncResult.eventsCreated++;
          } else {
            // Create calendar event
            const calendarEvent = await bookingEngine.syncToCalendar(booking);

            // Here you would integrate with actual calendar APIs
            // For now, we'll simulate successful sync
            console.log('Syncing booking to calendar:', {
              bookingId: booking.id,
              provider: provider.type,
              eventTitle: calendarEvent.title,
              startTime: calendarEvent.startTime
            });

            syncResult.eventsCreated++;
          }
        } catch (error) {
          console.error(`Failed to sync booking ${booking.id}:`, error);
          syncResult.errors.push(`Failed to sync booking ${booking.id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    }

    // Import events from external calendar (simplified)
    if (syncDirection === 'import' || syncDirection === 'bidirectional') {
      // This would typically:
      // 1. Fetch events from external calendar API
      // 2. Check for conflicts with existing bookings
      // 3. Create bookings for new events
      // 4. Update existing bookings if events changed

      console.log('Import sync requested - would fetch from', provider.type);
      syncResult.eventsUpdated = 0; // Would be populated by actual import logic
    }

    // Log sync operation
    console.log('Calendar sync completed:', {
      provider: provider.type,
      bookingsCount: bookings.length,
      direction: syncDirection,
      dryRun,
      result: syncResult
    });

    return NextResponse.json({
      success: true,
      data: syncResult
    } as ApiResponse<CalendarSyncResult>);

  } catch (error) {
    console.error('Calendar sync failed:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Calendar synchronization failed'
      } as ApiResponse<never>,
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve calendar providers and sync status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'providers') {
      // Return available calendar providers
      const providers: CalendarProvider[] = [
        {
          type: 'google',
          clientId: process.env.GOOGLE_CALENDAR_CLIENT_ID ? 'configured' : 'not_configured'
        },
        {
          type: 'outlook',
          clientId: process.env.OUTLOOK_CLIENT_ID ? 'configured' : 'not_configured'
        }
      ];

      return NextResponse.json({
        success: true,
        data: providers
      } as ApiResponse<CalendarProvider[]>);
    }

    if (action === 'status') {
      // Return last sync status
      const syncStatus = {
        lastSyncAt: new Date().toISOString(),
        lastSyncBookings: 0,
        providerStatus: {
          google: 'ready',
          outlook: 'ready'
        }
      };

      return NextResponse.json({
        success: true,
        data: syncStatus
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Invalid action. Use action=providers or action=status'
      } as ApiResponse<never>,
      { status: 400 }
    );

  } catch (error) {
    console.error('Calendar status check failed:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to retrieve calendar status'
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
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}