import React from 'react';
import { siteConfig } from '@/lib/constants';

interface SRAApprovalBadgeProps {
  variant?: 'full' | 'compact' | 'minimal';
  className?: string;
}

export default function SRAApprovalBadge({
  variant = 'full',
  className = ''
}: SRAApprovalBadgeProps) {
  const sraUrl = `https://www.sra.org.uk/consumers/solicitor-check/?id=${siteConfig.sra}`;

  if (variant === 'minimal') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">SRA</span>
        </div>
        <span className="text-sm text-gray-700">Authorised & Regulated</span>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <a
        href={sraUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors ${className}`}
      >
        <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">SRA</span>
        </div>
        <div>
          <div className="text-sm font-semibold text-blue-900">SRA Approved</div>
          <div className="text-xs text-blue-700">#{siteConfig.sra}</div>
        </div>
      </a>
    );
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 shadow-sm ${className}`}>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">SRA</span>
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Solicitors Regulation Authority Approved
          </h3>
          <p className="text-gray-600 text-sm mb-3">
            CVG Family Law Ltd is authorised and regulated by the Solicitors Regulation Authority,
            ensuring the highest standards of legal practice and client protection.
          </p>
          <div className="flex items-center gap-4">
            <div className="text-sm">
              <span className="text-gray-500">SRA Number:</span>
              <span className="font-mono font-semibold text-gray-900 ml-2">{siteConfig.sra}</span>
            </div>
            <a
              href={sraUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Verify on SRA Website
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}