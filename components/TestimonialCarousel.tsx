"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star, Play, Shield } from "lucide-react";
import { images } from "@/lib/images";
import { Testimonial, TestimonialCarouselProps } from "@/types/testimonials";
import VideoTestimonialPlayer from "./VideoTestimonialPlayer";
import TestimonialVerificationBadge from "./TestimonialVerificationBadge";

// Sample testimonials data using the new system
const sampleTestimonials: Testimonial[] = [
  {
    id: "testimonial_1",
    type: "text",
    author: {
      id: "author_1",
      name: "Sarah Mitchell",
      caseType: "Divorce Proceedings",
      isAnonymous: false
    },
    content: "CVG Family Law provided exceptional support during my divorce. Their compassionate approach and expertise made a difficult time so much easier. They truly care about their clients' wellbeing.",
    caseOutcome: "successful",
    rating: 5,
    tags: ["divorce", "compassionate", "professional"],
    verificationStatus: "verified",
    verificationDocuments: [],
    privacySettings: {
      level: "public",
      allowVideoBlurring: false,
      allowVoiceAlteration: false,
      allowNameDisplay: true,
      allowLocationDisplay: false,
      consentWithdrawn: false
    },
    isPublished: true,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
    viewCount: 45,
    helpfulCount: 12
  },
  {
    id: "testimonial_2",
    type: "text",
    author: {
      id: "author_2",
      name: "Michael Thompson",
      caseType: "Children Law",
      isAnonymous: false
    },
    content: "The team fought tirelessly for my children's best interests. Their knowledge of children law is outstanding, and they always kept me informed throughout the process.",
    caseOutcome: "successful",
    rating: 5,
    tags: ["children_law", "expertise", "communication"],
    verificationStatus: "verified",
    verificationDocuments: [],
    privacySettings: {
      level: "public",
      allowVideoBlurring: false,
      allowVoiceAlteration: false,
      allowNameDisplay: true,
      allowLocationDisplay: false,
      consentWithdrawn: false
    },
    isPublished: true,
    createdAt: new Date("2024-02-20"),
    updatedAt: new Date("2024-02-20"),
    viewCount: 32,
    helpfulCount: 8
  },
  {
    id: "testimonial_3",
    type: "video",
    author: {
      id: "author_3",
      name: "Emma Williams",
      caseType: "Domestic Abuse",
      isAnonymous: false
    },
    content: "CVG Family Law saved my life. They secured protection orders quickly and supported me every step of the way. I cannot thank them enough for their dedication and care.",
    caseOutcome: "successful",
    rating: 5,
    tags: ["domestic_abuse", "protection", "support"],
    verificationStatus: "verified",
    verificationDocuments: [],
    privacySettings: {
      level: "public",
      allowVideoBlurring: false,
      allowVoiceAlteration: false,
      allowNameDisplay: true,
      allowLocationDisplay: false,
      consentWithdrawn: false
    },
    isPublished: true,
    videoMetadata: {
      duration: 120,
      resolution: { width: 1920, height: 1080 },
      thumbnailUrl: "/images/testimonials/emma-video-thumb.jpg",
      transcript: "CVG Family Law saved my life. They secured protection orders quickly and supported me every step of the way...",
      hasBlurredFaces: false,
      hasAlteredVoice: false,
      fileSize: 50 * 1024 * 1024, // 50MB
      mimeType: "video/mp4"
    },
    createdAt: new Date("2024-03-10"),
    updatedAt: new Date("2024-03-10"),
    viewCount: 67,
    helpfulCount: 23
  },
];

interface EnhancedTestimonialCarouselProps extends Omit<TestimonialCarouselProps, 'testimonials'> {
  testimonials?: Testimonial[];
}

export default function TestimonialCarousel({
  testimonials = sampleTestimonials,
  showVerificationBadges = true,
  showVideoControls = true,
  autoplay = true,
  showThumbnails = false,
  itemsPerView = 1,
  className = ""
}: EnhancedTestimonialCarouselProps) {
  const carouselTestimonials = testimonials.length > 0 ? testimonials : sampleTestimonials;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoplay && carouselTestimonials.length > 1);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % carouselTestimonials.length);
    }, 7000); // Slower for video testimonials

    return () => clearInterval(interval);
  }, [isAutoPlaying, carouselTestimonials.length]);

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) =>
      prev === 0 ? carouselTestimonials.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % carouselTestimonials.length);
  };

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

  const currentTestimonial = carouselTestimonials[currentIndex] ?? carouselTestimonials[0];

  return (
    <section className="py-20 bg-gradient-to-br from-white to-primary-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

      <div className="container-main relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-primary-600 font-medium text-sm uppercase tracking-wide">
            Client Stories
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-warmgray-900 mt-2">
            Real People, Real Results
          </h2>
          <p className="text-xl text-warmgray-600 mt-4 max-w-3xl mx-auto">
            Hear from families we&apos;ve helped navigate their legal journeys with compassion and expertise.
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          <div className="relative">
            {/* Main Carousel */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="p-8 md:p-12"
                >
                  <div className="space-y-6">
                    {/* Testimonial Content */}
                    <div className="relative">
                      {currentTestimonial.type === 'video' ? (
                        <div className="space-y-4">
                          <VideoTestimonialPlayer
                            testimonial={currentTestimonial}
                            autoplay={false}
                            showControls={showVideoControls}
                            className="w-full"
                          />
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="relative">
                            <Quote className="absolute -top-4 -left-4 h-12 w-12 text-primary-200" />
                            <p className="text-lg md:text-xl text-warmgray-700 italic leading-relaxed relative z-10 pl-8">
                              &ldquo;{currentTestimonial.content}&rdquo;
                            </p>
                          </div>

                          <div className="flex items-center gap-4">
                            {/* Verification Badge */}
                            {showVerificationBadges && (
                              <TestimonialVerificationBadge
                                testimonial={currentTestimonial}
                                size="sm"
                              />
                            )}

                            {/* Rating */}
                            {currentTestimonial.rating && (
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < currentTestimonial.rating! ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Author Info */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                          {currentTestimonial.author.isAnonymous ? (
                            <Shield className="h-6 w-6 text-white" />
                          ) : (
                            <span className="text-white font-semibold text-lg">
                              {currentTestimonial.author.initials || currentTestimonial.author.name?.charAt(0) || 'C'}
                            </span>
                          )}
                        </div>

                        <div>
                          <h3 className="text-lg font-bold text-warmgray-900">
                            {currentTestimonial.author.isAnonymous
                              ? 'Anonymous Client'
                              : currentTestimonial.author.name || 'Client'
                            }
                          </h3>
                          <p className="text-warmgray-600 text-sm">
                            {currentTestimonial.author.caseType} • {currentTestimonial.caseOutcome.replace('_', ' ')}
                          </p>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 max-w-48">
                        {currentTestimonial.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="inline-block bg-primary-100 text-primary-700 px-2 py-1 rounded text-xs"
                          >
                            {tag.replace('_', ' ')}
                          </span>
                        ))}
                        {currentTestimonial.tags.length > 3 && (
                          <span className="inline-block bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                            +{currentTestimonial.tags.length - 3}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Verification Details */}
                    {showVerificationBadges && (
                      <div className="pt-4 border-t border-gray-100">
                        <TestimonialVerificationBadge
                          testimonial={currentTestimonial}
                          showDetails={false}
                          size="sm"
                        />
                      </div>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={goToPrevious}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full ml-4 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all hover:scale-110 group"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-6 w-6 text-gray-600 group-hover:text-primary-600 transition-colors" />
            </button>

            <button
              onClick={goToNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full mr-4 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all hover:scale-110 group"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-6 w-6 text-gray-600 group-hover:text-primary-600 transition-colors" />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {carouselTestimonials.map((testimonial, index) => (
              <motion.button
                key={testimonial.id}
                onClick={() => goToSlide(index)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className={`transition-all ${
                  index === currentIndex
                    ? "w-12 h-3 bg-gradient-to-r from-primary-600 to-primary-700 rounded-full"
                    : "w-3 h-3 bg-gray-300 rounded-full hover:bg-gray-400"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>

          {/* Trust Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="text-center mt-12"
          >
            <p className="text-warmgray-600">
              Join hundreds of families who have found peace and resolution with CVG Family Law
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
