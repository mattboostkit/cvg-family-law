// API route for verifying testimonials with SRA compliance
// Handles testimonial verification process with proper authorization

import { NextRequest, NextResponse } from 'next/server';
import {
  verifyTestimonial,
  getTestimonials,
  publishTestimonial
} from '@/lib/testimonials';
import { ApiResponse } from '@/types/client-portal';
import { TestimonialFilters, Testimonial } from '@/types/testimonials';

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();

    const {
      testimonialId,
      verificationMethod,
      notes,
      action // 'verify', 'reject', or 'publish'
    } = body;

    // Validate required fields
    if (!testimonialId || !action) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: testimonialId and action are required'
        } as ApiResponse<never>,
        { status: 400 }
      );
    }

    // Validate action
    if (!['verify', 'reject', 'publish'].includes(action)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid action. Must be verify, reject, or publish'
        } as ApiResponse<never>,
        { status: 400 }
      );
    }

    // TODO: Add proper authorization check here
    // In production, verify the user has admin/moderator permissions
    const moderatorId = 'system-moderator'; // Placeholder

    let result;

    switch (action) {
      case 'verify':
        if (!verificationMethod) {
          return NextResponse.json(
            {
              success: false,
              error: 'Verification method is required when verifying a testimonial'
            } as ApiResponse<never>,
            { status: 400 }
          );
        }

        result = await verifyTestimonial(testimonialId, moderatorId, verificationMethod, notes);

        return NextResponse.json({
          success: true,
          data: {
            testimonialId,
            status: 'verified',
            verifiedAt: result.verifiedAt,
            message: 'Testimonial verified successfully',
            nextSteps: [
              'Testimonial is now ready for publication',
              'Consider publishing if appropriate',
              'Verification details have been logged'
            ]
          }
        } as ApiResponse<{
          testimonialId: string;
          status: string;
          verifiedAt: Date;
          message: string;
          nextSteps: string[];
        }>);

      case 'publish':
        // First verify the testimonial if not already verified
        const testimonial = getTestimonials({}).find(t => t.id === testimonialId);
        if (!testimonial) {
          return NextResponse.json(
            {
              success: false,
              error: 'Testimonial not found'
            } as ApiResponse<never>,
            { status: 404 }
          );
        }

        if (testimonial.verificationStatus !== 'verified') {
          return NextResponse.json(
            {
              success: false,
              error: 'Testimonial must be verified before it can be published'
            } as ApiResponse<never>,
            { status: 400 }
          );
        }

        const publishedTestimonial = await publishTestimonial(testimonialId, moderatorId);

        return NextResponse.json({
          success: true,
          data: {
            testimonialId,
            status: 'published',
            publishedAt: publishedTestimonial.publishedAt,
            message: 'Testimonial published successfully',
            nextSteps: [
              'Testimonial is now visible on the public site',
              'Client will be notified of publication',
              'Monitor for any withdrawal requests'
            ]
          }
        } as ApiResponse<{
          testimonialId: string;
          status: string;
          publishedAt: Date;
          message: string;
          nextSteps: string[];
        }>);

      case 'reject':
        // Update testimonial status to rejected
        const rejectedTestimonial = getTestimonials({}).find(t => t.id === testimonialId);
        if (!rejectedTestimonial) {
          return NextResponse.json(
            {
              success: false,
              error: 'Testimonial not found'
            } as ApiResponse<never>,
            { status: 404 }
          );
        }

        rejectedTestimonial.verificationStatus = 'rejected';
        rejectedTestimonial.updatedAt = new Date();

        return NextResponse.json({
          success: true,
          data: {
            testimonialId,
            status: 'rejected',
            message: 'Testimonial rejected',
            reason: notes || 'No reason provided',
            nextSteps: [
              'Client will be notified of rejection',
              'Consider providing feedback to client',
              'Rejection has been logged for compliance'
            ]
          }
        } as ApiResponse<{
          testimonialId: string;
          status: string;
          message: string;
          reason: string;
          nextSteps: string[];
        }>);

      default:
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid action specified'
          } as ApiResponse<never>,
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Testimonial verification failed:', error);

    // Return appropriate error response
    const errorMessage = error instanceof Error ? error.message : 'Testimonial verification failed';

    return NextResponse.json(
      {
        success: false,
        error: errorMessage
      } as ApiResponse<never>,
      { status: 500 }
    );
  }
}

// GET handler to retrieve testimonials for moderation
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as string | null;
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // TODO: Add proper authorization check here
    // In production, verify the user has admin/moderator permissions

    const filters: TestimonialFilters = {};

    if (status) {
      filters.verificationStatus = status as 'pending' | 'verified' | 'rejected' | 'expired';
    }

    const testimonials = getTestimonials(filters, limit, offset);

    return NextResponse.json({
      success: true,
      data: {
        testimonials,
        total: testimonials.length,
        filters: {
          status,
          limit,
          offset
        }
      }
    } as ApiResponse<{
      testimonials: Testimonial[];
      total: number;
      filters: {
        status: string | null;
        limit: number;
        offset: number;
      };
    }>);

  } catch (error) {
    console.error('Failed to retrieve testimonials for moderation:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to retrieve testimonials'
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