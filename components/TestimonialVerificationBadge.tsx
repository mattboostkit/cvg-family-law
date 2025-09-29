// Testimonial Verification Badge Component
// Displays verification status with trust indicators and compliance information

'use client';

import React from 'react';
import { VerificationBadgeProps } from '@/types/testimonials';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const TestimonialVerificationBadge: React.FC<VerificationBadgeProps> = ({
  testimonial,
  size = 'md',
  showDetails = false,
  className = ''
}) => {
  const getVerificationInfo = () => {
    switch (testimonial.verificationStatus) {
      case 'verified':
        return {
          icon: '✅',
          text: 'Verified Testimonial',
          color: 'bg-green-100 text-green-800 border-green-200',
          description: 'This testimonial has been verified through our secure identity and case outcome validation process.',
          details: [
            'Identity verification completed',
            'Case outcome documentation reviewed',
            'SRA compliance confirmed',
            'GDPR consent validated'
          ]
        };
      case 'pending':
        return {
          icon: '⏳',
          text: 'Under Review',
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          description: 'This testimonial is currently being reviewed by our verification team.',
          details: [
            'Verification documents received',
            'Identity validation in progress',
            'Case outcome review pending',
            'Estimated completion: 2-3 business days'
          ]
        };
      case 'rejected':
        return {
          icon: '❌',
          text: 'Verification Required',
          color: 'bg-red-100 text-red-800 border-red-200',
          description: 'This testimonial requires additional verification before publication.',
          details: [
            'Additional documentation may be needed',
            'Case outcome verification required',
            'Identity validation incomplete'
          ]
        };
      case 'expired':
        return {
          icon: '⚠️',
          text: 'Verification Expired',
          color: 'bg-orange-100 text-orange-800 border-orange-200',
          description: 'This testimonial verification has expired and requires renewal.',
          details: [
            'Annual verification renewal required',
            'Contact us to update verification',
            'Testimonial temporarily unavailable'
          ]
        };
      default:
        return {
          icon: '❓',
          text: 'Status Unknown',
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          description: 'Verification status is currently unknown.',
          details: []
        };
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-2 py-1 text-xs';
      case 'lg':
        return 'px-4 py-2 text-base';
      default:
        return 'px-3 py-1 text-sm';
    }
  };

  const verificationInfo = getVerificationInfo();

  const BadgeComponent = () => (
    <Badge
      variant="outline"
      className={`${verificationInfo.color} ${getSizeClasses()} ${className} flex items-center gap-1`}
    >
      <span>{verificationInfo.icon}</span>
      <span>{verificationInfo.text}</span>
    </Badge>
  );

  if (!showDetails) {
    return (
      <div
        className="cursor-help"
        title={verificationInfo.description}
      >
        <BadgeComponent />
      </div>
    );
  }

  return (
    <div className={`testimonial-verification-badge ${className}`}>
      <BadgeComponent />

      {showDetails && (
        <div className="mt-2 p-3 bg-gray-50 rounded-lg text-sm">
          <p className="font-medium text-gray-900 mb-2">
            Verification Details
          </p>

          <p className="text-gray-600 mb-3">
            {verificationInfo.description}
          </p>

          {verificationInfo.details.length > 0 && (
            <div className="space-y-1">
              <p className="font-medium text-gray-700">What's included:</p>
              <ul className="space-y-1">
                {verificationInfo.details.map((detail, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-600">
                    <span className="text-green-500 mt-1">✓</span>
                    <span className="text-xs">{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {testimonial.verificationStatus === 'verified' && testimonial.verifiedAt && (
            <div className="mt-3 pt-2 border-t border-gray-200">
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>Verified on:</span>
                <span>{testimonial.verifiedAt.toLocaleDateString('en-GB')}</span>
              </div>
              {testimonial.verifiedBy && (
                <div className="flex justify-between items-center text-xs text-gray-500 mt-1">
                  <span>Verified by:</span>
                  <span>{testimonial.verifiedBy}</span>
                </div>
              )}
            </div>
          )}

          {testimonial.verificationStatus === 'verified' && testimonial.verifiedAt && (
            <div className="mt-3 pt-2 border-t border-gray-200">
              <p className="text-xs text-gray-500 mb-2">
                This testimonial meets our strict verification standards:
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <span className="text-blue-500">🔒</span>
                  <span>SRA Compliant</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-blue-500">📋</span>
                  <span>Case Verified</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-blue-500">👤</span>
                  <span>Identity Confirmed</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-blue-500">🔐</span>
                  <span>GDPR Compliant</span>
                </div>
              </div>
            </div>
          )}

          {testimonial.privacySettings.consentWithdrawn && (
            <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded">
              <p className="text-xs text-red-800 font-medium">
                Consent Withdrawn
              </p>
              <p className="text-xs text-red-600 mt-1">
                This testimonial is no longer available due to withdrawn consent.
              </p>
            </div>
          )}

          <div className="mt-3 pt-2 border-t border-gray-200">
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => {
                // In a real implementation, this would open a detailed verification report
                console.log('Open verification details for testimonial:', testimonial.id);
              }}
            >
              View Full Report
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestimonialVerificationBadge;