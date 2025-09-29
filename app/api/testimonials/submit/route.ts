// API route for submitting client testimonials
// Handles testimonial submission with privacy controls and verification document upload

import { NextRequest, NextResponse } from 'next/server';
import {
  submitTestimonial,
  validateTestimonialContent,
  generateTestimonialId
} from '@/lib/testimonials';
import {
  TestimonialSubmission,
  VerificationDocument,
  PrivacySettings
} from '@/types/testimonials';
import { ApiResponse } from '@/types/client-portal';

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();

    const {
      type,
      content,
      caseType,
      caseOutcome,
      rating,
      tags,
      privacySettings,
      consentGiven,
      isAnonymous,
      authorName,
      authorLocation,
      verificationDocuments: verificationFiles
    } = body;

    // Validate required fields
    if (!type || !content || !caseType || !caseOutcome) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: type, content, caseType, and caseOutcome are required'
        } as ApiResponse<never>,
        { status: 400 }
      );
    }

    // Validate content
    const contentValidation = validateTestimonialContent(content);
    if (!contentValidation.valid) {
      return NextResponse.json(
        {
          success: false,
          error: contentValidation.reason
        } as ApiResponse<never>,
        { status: 400 }
      );
    }

    // Validate consent for GDPR compliance
    if (!consentGiven) {
      return NextResponse.json(
        {
          success: false,
          error: 'Consent must be given to submit a testimonial'
        } as ApiResponse<never>,
        { status: 400 }
      );
    }

    // Validate privacy settings
    if (!privacySettings || typeof privacySettings !== 'object') {
      return NextResponse.json(
        {
          success: false,
          error: 'Privacy settings are required'
        } as ApiResponse<never>,
        { status: 400 }
      );
    }

    // For video testimonials, require verification documents
    if (type === 'video' && (!verificationFiles || verificationFiles.length === 0)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Video testimonials require verification documents for identity and case outcome validation'
        } as ApiResponse<never>,
        { status: 400 }
      );
    }

    // Validate tags
    if (!Array.isArray(tags) || tags.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'At least one tag is required to categorize the testimonial'
        } as ApiResponse<never>,
        { status: 400 }
      );
    }

    // Create privacy settings object
    const privacyConfig: PrivacySettings = {
      level: privacySettings.level || 'public',
      allowVideoBlurring: privacySettings.allowVideoBlurring || false,
      allowVoiceAlteration: privacySettings.allowVoiceAlteration || false,
      allowNameDisplay: privacySettings.allowNameDisplay ?? (privacySettings.level === 'public'),
      allowLocationDisplay: privacySettings.allowLocationDisplay || false,
      consentWithdrawn: false
    };

    // Create submission object
    const submission: TestimonialSubmission = {
      type,
      content,
      caseType,
      caseOutcome,
      rating: rating || undefined,
      tags,
      privacySettings: privacyConfig,
      verificationDocuments: [], // Will be processed from files
      consentGiven,
      isAnonymous,
      authorName: isAnonymous ? undefined : authorName,
      authorLocation: (isAnonymous || !privacyConfig.allowLocationDisplay) ? undefined : authorLocation
    };

    // Process verification documents if provided
    if (verificationFiles && verificationFiles.length > 0) {
      // In a real implementation, you would process the actual files here
      // For now, we'll create placeholder verification documents
      submission.verificationDocuments = verificationFiles.map((file: { name?: string; type?: string }, index: number) => {
        const mockFile = new File([''], file.name || `document-${index}.pdf`, {
          type: file.type || 'application/pdf'
        });
        return mockFile;
      });
    }

    // Submit testimonial
    const testimonial = await submitTestimonial(submission);

    // Log testimonial submission (in production, use proper logging service)
    console.log('Testimonial submitted:', {
      id: testimonial.id,
      type: testimonial.type,
      caseType: testimonial.author.caseType,
      isAnonymous: testimonial.author.isAnonymous,
      verificationStatus: testimonial.verificationStatus,
      timestamp: new Date().toISOString()
    });

    // Return success response
    return NextResponse.json({
      success: true,
      data: {
        testimonialId: testimonial.id,
        status: testimonial.verificationStatus,
        message: 'Testimonial submitted successfully and is pending verification',
        nextSteps: [
          'Your testimonial will be reviewed for verification',
          'You will receive an email confirmation once verified',
          'Verification typically takes 2-3 business days',
          'You can withdraw consent at any time'
        ]
      }
    } as ApiResponse<{
      testimonialId: string;
      status: string;
      message: string;
      nextSteps: string[];
    }>);

  } catch (error) {
    console.error('Testimonial submission failed:', error);

    // Return appropriate error response
    const errorMessage = error instanceof Error ? error.message : 'Testimonial submission failed';

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