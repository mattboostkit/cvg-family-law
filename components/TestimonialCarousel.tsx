"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { images } from "@/lib/images";

const testimonials = [
  {
    id: 1,
    name: "Sarah Mitchell",
    role: "Divorce Client",
    image: images.testimonials.sarah,
    rating: 5,
    text: "CVG Family Law provided exceptional support during my divorce. Their compassionate approach and expertise made a difficult time so much easier. They truly care about their clients' wellbeing.",
    highlight: "Compassionate & Professional",
  },
  {
    id: 2,
    name: "Michael Thompson",
    role: "Children Law Client",
    image: images.testimonials.michael,
    rating: 5,
    text: "The team fought tirelessly for my children's best interests. Their knowledge of children law is outstanding, and they always kept me informed throughout the process.",
    highlight: "Outstanding Expertise",
  },
  {
    id: 3,
    name: "Emma Williams",
    role: "Domestic Abuse Survivor",
    image: images.testimonials.emma,
    rating: 5,
    text: "CVG Family Law saved my life. They secured protection orders quickly and supported me every step of the way. I cannot thank them enough for their dedication and care.",
    highlight: "Life-Changing Support",
  },
];

export default function TestimonialCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => 
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

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
                  <div className="grid md:grid-cols-3 gap-8 items-center">
                    {/* Image and Info */}
                    <div className="md:col-span-1 text-center">
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="relative w-32 h-32 mx-auto mb-4"
                      >
                        <Image
                          src={testimonials[currentIndex].image}
                          alt={testimonials[currentIndex].name}
                          fill
                          className="rounded-full object-cover"
                        />
                        <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
                          <Quote className="h-6 w-6 text-white" />
                        </div>
                      </motion.div>
                      
                      <h3 className="text-xl font-bold text-warmgray-900">
                        {testimonials[currentIndex].name}
                      </h3>
                      <p className="text-warmgray-600 text-sm">
                        {testimonials[currentIndex].role}
                      </p>
                      
                      {/* Rating */}
                      <div className="flex justify-center gap-1 mt-3">
                        {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 + i * 0.1 }}
                          >
                            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Testimonial Text */}
                    <div className="md:col-span-2">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <div className="relative">
                          <Quote className="absolute -top-4 -left-4 h-12 w-12 text-primary-200" />
                          <p className="text-lg md:text-xl text-warmgray-700 italic leading-relaxed relative z-10">
                            &ldquo;{testimonials[currentIndex].text}&rdquo;
                          </p>
                        </div>
                        
                        <div className="mt-6">
                          <span className="inline-block bg-gradient-to-r from-primary-600 to-primary-700 text-white px-4 py-2 rounded-full text-sm font-semibold">
                            {testimonials[currentIndex].highlight}
                          </span>
                        </div>
                      </motion.div>
                    </div>
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
            {testimonials.map((_, index) => (
              <motion.button
                key={index}
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