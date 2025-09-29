import { Metadata } from "next";
import Link from "next/link";
import { Shield, Star, Users, CheckCircle, ArrowRight, Filter, Search } from "lucide-react";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import TestimonialVerificationBadge from "@/components/TestimonialVerificationBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getPublishedTestimonials, getTestimonialStats } from "@/lib/testimonials";

export const metadata: Metadata = {
  title: "Client Testimonials - CVG Family Law",
  description:
    "Read verified testimonials from our clients. See how CVG Family Law has helped families navigate divorce, children law, and domestic abuse cases with compassion and expertise.",
};

export default function TestimonialsPage() {
  // In a real implementation, this would fetch from the database
  const testimonials = getPublishedTestimonials(10);
  const stats = getTestimonialStats();

  const featuredTestimonials = testimonials.filter(t => t.verificationStatus === 'verified').slice(0, 3);
  const recentTestimonials = testimonials.slice(3, 9);

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-white py-16">
        <div className="container-main">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-sm uppercase tracking-wide text-primary-600 font-semibold mb-3">
              Client Testimonials
            </p>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Real stories, real results
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Every testimonial is verified through our secure process to ensure authenticity while protecting client privacy.
            </p>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600">{stats.verified}</div>
                <div className="text-sm text-gray-600">Verified Reviews</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600">{stats.averageRating.toFixed(1)}</div>
                <div className="text-sm text-gray-600">Average Rating</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600">{stats.anonymous}</div>
                <div className="text-sm text-gray-600">Anonymous Options</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600">100%</div>
                <div className="text-sm text-gray-600">GDPR Compliant</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Testimonials Carousel */}
      <section className="section-padding">
        <div className="container-main">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Client Stories</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              These verified testimonials showcase the real impact of our work and the trust our clients place in us.
            </p>
          </div>

          <TestimonialCarousel
            testimonials={featuredTestimonials}
            showVerificationBadges={true}
            showVideoControls={true}
            autoplay={true}
            itemsPerView={1}
          />
        </div>
      </section>

      {/* Verification Process */}
      <section className="section-padding bg-gray-50">
        <div className="container-main">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">Our Verification Process</h2>
            <p className="text-gray-600 text-center mb-12">
              Every testimonial undergoes rigorous verification to ensure authenticity while maintaining client privacy and GDPR compliance.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center bg-white rounded-2xl p-6 shadow-sm">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Identity Verification</h3>
                <p className="text-sm text-gray-600">
                  Secure verification of client identity through approved documentation and processes.
                </p>
              </div>

              <div className="text-center bg-white rounded-2xl p-6 shadow-sm">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Case Outcome Review</h3>
                <p className="text-sm text-gray-600">
                  Verification of case outcomes and representation details through secure channels.
                </p>
              </div>

              <div className="text-center bg-white rounded-2xl p-6 shadow-sm">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">SRA Compliance</h3>
                <p className="text-sm text-gray-600">
                  All testimonials comply with Solicitors Regulation Authority guidelines and standards.
                </p>
              </div>

              <div className="text-center bg-white rounded-2xl p-6 shadow-sm">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">GDPR Protected</h3>
                <p className="text-sm text-gray-600">
                  Full GDPR compliance with privacy controls and consent management throughout.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Testimonials Grid */}
      <section className="section-padding">
        <div className="container-main">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">More Client Stories</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Browse through more verified testimonials from clients who have experienced our support firsthand.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {recentTestimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                {/* Testimonial Type Badge */}
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="outline" className="text-xs">
                    {testimonial.type === 'video' ? '🎥 Video' : '💬 Text'}
                  </Badge>
                  <TestimonialVerificationBadge
                    testimonial={testimonial}
                    size="sm"
                    showDetails={false}
                  />
                </div>

                {/* Content */}
                <blockquote className="text-gray-700 mb-4 leading-relaxed">
                  &ldquo;{testimonial.content.length > 150
                    ? `${testimonial.content.substring(0, 150)}...`
                    : testimonial.content
                  }&rdquo;
                </blockquote>

                {/* Author Info */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                    {testimonial.author.isAnonymous ? (
                      <Shield className="h-5 w-5 text-white" />
                    ) : (
                      <span className="text-white font-semibold">
                        {testimonial.author.initials || testimonial.author.name?.charAt(0) || 'C'}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {testimonial.author.isAnonymous
                        ? 'Anonymous Client'
                        : testimonial.author.name || 'Client'
                      }
                    </p>
                    <p className="text-sm text-gray-500">
                      {testimonial.author.caseType} • {testimonial.caseOutcome.replace('_', ' ')}
                    </p>
                  </div>
                </div>

                {/* Rating */}
                {testimonial.rating && (
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < testimonial.rating! ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {testimonial.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="inline-block bg-primary-50 text-primary-700 px-2 py-1 rounded text-xs"
                    >
                      {tag.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          <div className="text-center">
            <Button variant="outline" size="lg">
              Load More Testimonials
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Privacy & Trust Section */}
      <section className="section-padding bg-primary-600 text-white">
        <div className="container-main">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Your Privacy, Our Priority</h2>
            <p className="text-xl mb-8 opacity-90">
              We understand that sharing your story takes courage. That's why we offer multiple privacy options
              and ensure every testimonial is handled with the utmost care and respect.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <Shield className="h-12 w-12 mx-auto mb-3 opacity-90" />
                <h3 className="text-lg font-semibold mb-2">Anonymous Options</h3>
                <p className="text-sm opacity-80">
                  Share your story without revealing your identity
                </p>
              </div>

              <div className="text-center">
                <CheckCircle className="h-12 w-12 mx-auto mb-3 opacity-90" />
                <h3 className="text-lg font-semibold mb-2">Full Verification</h3>
                <p className="text-sm opacity-80">
                  Every testimonial is verified for authenticity
                </p>
              </div>

              <div className="text-center">
                <Star className="h-12 w-12 mx-auto mb-3 opacity-90" />
                <h3 className="text-lg font-semibold mb-2">GDPR Compliant</h3>
                <p className="text-sm opacity-80">
                  Your data is protected and you control your story
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <Link
                href="/contact"
                className="bg-white text-primary-600 px-8 py-4 rounded-md font-semibold hover:bg-gray-50 transition-colors inline-flex items-center gap-2"
              >
                Share Your Story
                <ArrowRight className="h-5 w-5" />
              </Link>

              <p className="text-sm opacity-75">
                Ready to share your experience? Contact us to learn about our secure testimonial process.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}