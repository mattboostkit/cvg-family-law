import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { siteConfig } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Domestic Abuse Solicitors in Tonbridge | CVG Family Law',
  description: 'Expert domestic abuse solicitors in Tonbridge, Kent. Emergency protection orders, non-molestation orders & urgent legal support. Free consultation. SRA regulated.',
  keywords: [
    'domestic abuse solicitor Tonbridge',
    'emergency injunction Tonbridge',
    'non-molestation order Tonbridge',
    'protection order Kent',
    'family law Tonbridge',
    'emergency legal help Tonbridge',
    'restraining order Tonbridge',
    'occupation order Tonbridge',
    'domestic violence lawyer Kent',
    'urgent family law Tonbridge'
  ],
  openGraph: {
    title: 'Domestic Abuse Solicitors in Tonbridge | CVG Family Law',
    description: 'Expert domestic abuse legal support in Tonbridge. 24/7 emergency consultations, protection orders & compassionate representation. SRA regulated.',
    url: `${siteConfig.url}/services/areas/tonbridge`,
    siteName: 'CVG Family Law',
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Domestic Abuse Solicitors Tonbridge | CVG Family Law',
    description: 'Urgent domestic abuse legal support in Tonbridge. Emergency protection orders & expert family law representation.',
  },
  alternates: {
    canonical: `${siteConfig.url}/services/areas/tonbridge`,
  },
};

export default function TonbridgeServiceArea() {
  return (
    <div className="container-main py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Domestic Abuse Solicitors in Tonbridge
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Expert legal protection and support for victims of domestic abuse in Tonbridge and surrounding Kent areas
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href={`tel:${siteConfig.phone.replace(/\s/g, '')}`}
              className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              Emergency: {siteConfig.phone}
            </a>
            <Link
              href="/contact"
              className="border-2 border-primary-600 text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-600 hover:text-white transition-colors"
            >
              Free Consultation
            </Link>
          </div>
        </div>

        {/* Services Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Emergency Protection Orders
            </h2>
            <p className="text-gray-600 mb-4">
              Immediate legal protection for domestic abuse victims in Tonbridge.
              We can help you obtain urgent court orders to ensure your safety.
            </p>
            <ul className="text-gray-600 space-y-2">
              <li>• Non-molestation orders</li>
              <li>• Occupation orders</li>
              <li>• Emergency injunctions</li>
              <li>• Police liaison support</li>
            </ul>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              24/7 Emergency Support
            </h2>
            <p className="text-gray-600 mb-4">
              Crisis situations don&apos;t wait for office hours. We are available around the clock
              to provide urgent legal assistance when you need it most.
            </p>
            <div className="text-primary-600 font-semibold">
              Emergency Line: {siteConfig.phone}
            </div>
          </div>
        </div>

        {/* Local Information */}
        <div className="bg-gray-50 rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Serving Tonbridge & Kent
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Local Courts</h3>
              <p className="text-gray-600">
                Tonbridge County Court, Maidstone Crown Court, and all Kent family courts
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Police Stations</h3>
              <p className="text-gray-600">
                Tonbridge Police Station, and Kent Police domestic abuse units
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Support Services</h3>
              <p className="text-gray-600">
                Local domestic abuse support services, refuges, and counselling in Kent
              </p>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="bg-white border border-gray-200 rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            Why Choose CVG Family Law in Tonbridge?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Rapid Response</h3>
              <p className="text-sm text-gray-600">Emergency consultations within hours, not days</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">SRA Regulated</h3>
              <p className="text-sm text-gray-600">Fully regulated and insured legal practice</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Local Expertise</h3>
              <p className="text-sm text-gray-600">Deep knowledge of Kent courts and procedures</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Compassionate Support</h3>
              <p className="text-sm text-gray-600">Understanding and supportive throughout your case</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-primary-600 text-white rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4">
            Need Urgent Legal Help in Tonbridge?
          </h2>
          <p className="text-xl mb-6 text-primary-100">
            Don&apos;t wait - contact us now for immediate assistance with your domestic abuse case
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`tel:${siteConfig.phone.replace(/\s/g, '')}`}
              className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Call Emergency Line: {siteConfig.phone}
            </a>
            <Link
              href="/contact"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
            >
              Book Free Consultation
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}