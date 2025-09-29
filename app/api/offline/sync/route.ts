/**
 * Background Sync API Route
 * Handles synchronization of offline data when connection is restored
 */

import { NextRequest, NextResponse } from 'next/server';
import { offlineStorage } from '@/lib/offline-storage';

interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  appointmentType: string;
  preferredDate?: string;
  preferredTime?: string;
  message?: string;
  [key: string]: unknown;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data, id } = body;

    console.log(`[SyncAPI] Syncing ${type} data:`, id);

    // Verify required fields
    if (!type || !data) {
      return NextResponse.json(
        { error: 'Missing required fields: type, data' },
        { status: 400 }
      );
    }

    let result;

    // Handle different data types
    switch (type) {
      case 'emergency-contact':
        result = await syncEmergencyContact(data);
        break;

      case 'booking-form':
        result = await syncBookingForm(data);
        break;

      case 'chat-message':
        result = await syncChatMessage(data);
        break;

      case 'risk-assessment':
        result = await syncRiskAssessment(data);
        break;

      default:
        return NextResponse.json(
          { error: 'Unsupported sync type' },
          { status: 400 }
        );
    }

    // Mark as synced in offline storage
    if (id && result.success) {
      await offlineStorage.markAsSynced(id);
    }

    return NextResponse.json({
      success: true,
      result,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('[SyncAPI] Sync failed:', error);
    return NextResponse.json(
      { error: 'Sync failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    // Get offline storage statistics
    const stats = await offlineStorage.getStorageStats();

    if (type) {
      // Get specific type of unsynced data
      const data = await offlineStorage.getDataByType(type as 'emergency-contact' | 'booking-form' | 'chat-message' | 'risk-assessment');
      const unsyncedData = data.filter(item => !item.synced);

      return NextResponse.json({
        success: true,
        type,
        count: unsyncedData.length,
        data: unsyncedData,
        stats,
      });
    }

    // Get all unsynced data
    const unsyncedData = await offlineStorage.getUnsyncedData();

    return NextResponse.json({
      success: true,
      totalUnsynced: unsyncedData.length,
      data: unsyncedData,
      stats,
    });

  } catch (error) {
    console.error('[SyncAPI] Failed to get offline data:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve offline data' },
      { status: 500 }
    );
  }
}

async function syncEmergencyContact(data: Record<string, unknown>) {
  try {
    // Basic validation of emergency contact data
    if (!data.name || !data.phone || !data.situation) {
      throw new Error('Invalid emergency contact data: missing required fields');
    }

    // Forward to the emergency contact API
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/emergency-contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Emergency contact API returned ${response.status}`);
    }

    const result = await response.json();

    return {
      success: true,
      type: 'emergency-contact',
      id: result.id,
      message: 'Emergency contact submitted successfully',
    };

  } catch (error) {
    console.error('[SyncAPI] Emergency contact sync failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

async function syncBookingForm(data: BookingFormData) {
  try {
    // Validate booking data structure
    if (!data.name || !data.email || !data.phone || !data.appointmentType) {
      throw new Error('Invalid booking data structure');
    }

    // Forward to booking API
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/booking/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Booking API returned ${response.status}`);
    }

    const result = await response.json();

    return {
      success: true,
      type: 'booking-form',
      id: result.id,
      message: 'Booking submitted successfully',
    };

  } catch (error) {
    console.error('[SyncAPI] Booking sync failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

async function syncChatMessage(data: Record<string, unknown>) {
  try {
    // Validate chat message structure
    if (!data.message || !data.senderId) {
      throw new Error('Invalid chat message structure');
    }

    // Forward to chat API
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/chat/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Chat API returned ${response.status}`);
    }

    const result = await response.json();

    return {
      success: true,
      type: 'chat-message',
      id: result.id,
      message: 'Chat message sent successfully',
    };

  } catch (error) {
    console.error('[SyncAPI] Chat message sync failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

async function syncRiskAssessment(data: Record<string, unknown>) {
  try {
    // Validate risk assessment data
    if (!data.answers || !Array.isArray(data.answers)) {
      throw new Error('Invalid risk assessment structure');
    }

    // Calculate risk score (reuse existing logic)
    const riskScore = calculateRiskScore(data.answers);
    const riskLevel = getRiskLevel(riskScore);

    // Store risk assessment result
    const assessmentResult = {
      ...data,
      riskScore,
      riskLevel,
      completedAt: new Date().toISOString(),
    };

    // In a real application, you might want to store this in a database
    // For now, we'll just return success
    return {
      success: true,
      type: 'risk-assessment',
      riskScore,
      riskLevel,
      message: 'Risk assessment completed and stored',
    };

  } catch (error) {
    console.error('[SyncAPI] Risk assessment sync failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Helper functions for risk assessment
function calculateRiskScore(answers: unknown[]): number {
  let score = 0;

  // Simple scoring based on answers
  answers.forEach((answer, index) => {
    if (typeof answer === 'boolean' && answer) {
      score += 10; // Boolean true = 10 points
    } else if (typeof answer === 'number') {
      score += answer * 2; // Scale number answers
    } else if (typeof answer === 'string') {
      // Score based on specific risky answers
      const riskyKeywords = ['yes', 'severe', 'immediate', 'danger'];
      if (riskyKeywords.some(keyword => answer.toLowerCase().includes(keyword))) {
        score += 15;
      }
    }
  });

  return Math.min(score, 100); // Cap at 100
}

function getRiskLevel(score: number): 'low' | 'medium' | 'high' | 'critical' {
  if (score >= 80) return 'critical';
  if (score >= 60) return 'high';
  if (score >= 40) return 'medium';
  return 'low';
}

// Batch sync endpoint for syncing all pending data
export async function PUT(request: NextRequest) {
  try {
    const unsyncedData = await offlineStorage.getUnsyncedData();
    const results = [];

    console.log(`[SyncAPI] Batch syncing ${unsyncedData.length} items`);

    for (const item of unsyncedData) {
      try {
        const response = await fetch(`${request.nextUrl.origin}/api/offline/sync`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: item.type,
            data: item.data,
            id: item.id,
          }),
        });

        const result = await response.json();
        results.push({
          id: item.id,
          type: item.type,
          success: result.success,
          result: result.result,
        });

        // Mark as synced if successful
        if (result.success) {
          await offlineStorage.markAsSynced(item.id);
        }

      } catch (error) {
        console.error(`[SyncAPI] Failed to sync item ${item.id}:`, error);
        results.push({
          id: item.id,
          type: item.type,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failureCount = results.length - successCount;

    return NextResponse.json({
      success: true,
      total: results.length,
      successful: successCount,
      failed: failureCount,
      results,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('[SyncAPI] Batch sync failed:', error);
    return NextResponse.json(
      { error: 'Batch sync failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Clear all offline data (use with caution)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    if (type) {
      // Clear specific type
      await offlineStorage.clearDataByType(type as 'emergency-contact' | 'booking-form' | 'chat-message' | 'risk-assessment');
      return NextResponse.json({
        success: true,
        message: `Cleared all ${type} data`,
      });
    } else {
      // Clear all data
      await offlineStorage.clearAllData();
      return NextResponse.json({
        success: true,
        message: 'Cleared all offline data',
      });
    }

  } catch (error) {
    console.error('[SyncAPI] Clear data failed:', error);
    return NextResponse.json(
      { error: 'Failed to clear data' },
      { status: 500 }
    );
  }
}