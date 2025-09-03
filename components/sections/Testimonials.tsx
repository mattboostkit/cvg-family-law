"use client";

import { Star, Quote, Heart, Users } from "lucide-react";
import { motion } from "framer-motion";

const testimonials = [
  {
    content: "When my world was falling apart, CVG Family Law became my anchor. They didn't just handle my case – they held my hand through the darkest days and helped me find light again. My children and I are now thriving.",
    author: "Sarah, Mother of Two",
    rating: 5,
    service: "Divorce & Children Support",
    outcome: "New beginning secured",
  },
  {
    content: "I was terrified and alone. Within hours of my call, they had secured protection for me and my daughter. They gave me back my life and my hope. Forever grateful doesn't begin to cover it.",
    author: "Emma, Survivor",
    rating: 5,
    service: "Domestic Abuse Protection",
    outcome: "Safety restored",
  },
  {
    content: "After 20 years of marriage, I thought I'd lose everything. CVG fought for my future with compassion and fierce dedication. I'm now rebuilding with confidence and security.",
    author: "Michael, Father",
    rating: 5,
    service: "Financial & Children Matters",
    outcome: "Fair resolution achieved",
  },
];

export default function Testimonials() {
  return (
    <section className="section-padding bg-gradient-to-b from-white to-warmgray-50">
      <div className="container-main">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-secondary-600 font-medium text-sm uppercase tracking-wide">Real Stories</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-warmgray-900 mt-2">
              Stories of Hope and Healing
            </h2>
            <p className="text-xl text-warmgray-600 max-w-3xl mx-auto leading-relaxed">
              Every family we help reminds us why we do this work. These are their journeys 
              from crisis to confidence.
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="relative"
            >
              <div className="bg-white rounded-2xl shadow-xl p-8 h-full flex flex-col">
                {/* Profile Image Placeholder */}
                <div className="mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center">
                    <Users className="h-8 w-8 text-primary-400" />
                  </div>
                </div>
                
                <Quote className="h-8 w-8 text-primary-200 mb-4" />
                
                <p className="text-warmgray-700 mb-6 italic flex-grow leading-relaxed">
                  &quot;{testimonial.content}&quot;
                </p>
                
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <div className="pt-4 border-t border-warmgray-100">
                  <p className="font-semibold text-warmgray-900">{testimonial.author}</p>
                  <p className="text-sm text-warmgray-600 mb-2">{testimonial.service}</p>
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-primary-400" />
                    <span className="text-xs font-medium text-primary-600">{testimonial.outcome}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}