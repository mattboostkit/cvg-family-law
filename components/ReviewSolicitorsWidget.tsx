import React from 'react';
import Link from 'next/link';

interface ReviewSolicitorsWidgetProps {
  variant?: 'full' | 'compact' | 'badge';
  showReviews?: boolean;
  maxReviews?: number;
  className?: string;
}

interface ReviewData {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

// Mock review data - in production this would come from an API
const mockReviews: ReviewData[] = [
  {
    id: '1',
    author: 'Sarah Mitchell',
    rating: 5,
    date: '2024-09-15',
    comment: 'Outstanding service during a very difficult time. The emergency response was immediate and the legal advice was excellent.',
    verified: true
  },
  {
    id: '2',
    author: 'Michael Robertson',
    rating: 5,
    date: '2024-08-22',
    comment: 'Professional, compassionate and highly skilled. They helped me get the protection I needed urgently.',
    verified: true
  },
  {
    id: '3',
    author: 'Jennifer Adams',
    rating: 5,
    date: '2024-07-30',
    comment: 'Exceptional family law support. The team went above and beyond to ensure the best outcome for my children.',
    verified: true
  }
];

export default function ReviewSolicitorsWidget({
  variant = 'full',
  showReviews = true,
  maxReviews = 3,
  className = ''
}: ReviewSolicitorsWidgetProps) {
  const reviewPlatforms = [
    {
      name: 'ReviewSolicitors',
      url: 'https://www.reviewsolicitors.co.uk',
      logo: '/images/review-solicitors-logo.svg', // Would need to add this
      rating: 4.9,
      reviewCount: 127
    },
    {
      name: 'Google Reviews',
      url: 'https://www.google.com/search?q=CVG+Family+Law+Tunbridge+Wells',
      logo: '/images/google-logo.svg',
      rating: 4.8,
      reviewCount: 89
    }
  ];

  const displayReviews = mockReviews.slice(0, maxReviews);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  if (variant === 'badge') {
    return (
      <div className={`inline-flex items-center gap-2 ${className}`}>
        <div className="flex items-center gap-1">
          {renderStars(5)}
          <span className="text-sm font-semibold text-gray-900">4.9</span>
        </div>
        <span className="text-sm text-gray-600">({mockReviews.length} reviews)</span>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`bg-gray-50 rounded-lg p-4 ${className}`}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">Client Reviews</h3>
          <div className="flex items-center gap-1">
            {renderStars(5)}
            <span className="text-sm font-semibold text-gray-900">4.9/5</span>
          </div>
        </div>
        <div className="flex gap-2">
          {reviewPlatforms.map((platform) => (
            <a
              key={platform.name}
              href={platform.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center py-2 px-3 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors text-sm"
            >
              <div className="font-medium text-gray-900">{platform.name}</div>
              <div className="text-xs text-gray-600">
                {platform.rating}/5 ({platform.reviewCount} reviews)
              </div>
            </a>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">What Our Clients Say</h3>
          <p className="text-gray-600 mt-1">Trusted by families across Kent</p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2 mb-1">
            <div className="flex items-center gap-1">
              {renderStars(5)}
            </div>
            <span className="text-2xl font-bold text-gray-900">4.9</span>
            <span className="text-gray-600">/5</span>
          </div>
          <p className="text-sm text-gray-600">Based on {mockReviews.length}+ reviews</p>
        </div>
      </div>

      {showReviews && (
        <div className="space-y-4 mb-6">
          {displayReviews.map((review) => (
            <div key={review.id} className="border-l-4 border-blue-500 pl-4 py-3 bg-gray-50 rounded-r-lg">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">{review.author}</span>
                  {review.verified && (
                    <span className="inline-flex items-center gap-1 text-xs text-green-700 bg-green-100 px-2 py-1 rounded-full">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Verified Client
                    </span>
                  )}
                </div>
                <span className="text-sm text-gray-500">{review.date}</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-1">
                  {renderStars(review.rating)}
                </div>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">{review.comment}</p>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-3">
        {reviewPlatforms.map((platform) => (
          <a
            key={platform.name}
            href={platform.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Leave a Review on {platform.name}
          </a>
        ))}
      </div>

      <div className="mt-4 text-center">
        <Link
          href="/contact"
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          Share Your Experience →
        </Link>
      </div>
    </div>
  );
}