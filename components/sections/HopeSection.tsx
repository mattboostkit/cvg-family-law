"use client";

import { Heart, Sun, Users, HandHeart, Star, Home } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const hopePoints = [
  {
    icon: Sun,
    title: "Brighter Days Ahead",
    description: "Even in the darkest moments, we help you see the path to a peaceful future",
  },
  {
    icon: HandHeart,
    title: "Compassionate Guidance",
    description: "More than lawyers – we're your advocates, supporters, and champions",
  },
  {
    icon: Users,
    title: "Family-First Focus",
    description: "Your children's wellbeing and family healing are always our priority",
  },
  {
    icon: Home,
    title: "Safe Haven",
    description: "A judgment-free space where you're heard, valued, and protected",
  },
];

export default function HopeSection() {
  return (
    <section className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-secondary-50 via-white to-primary-50"></div>
      
      <div className="container-main relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-6">
              <span className="text-secondary-600 font-medium text-sm uppercase tracking-wide">Your Journey Matters</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2 text-warmgray-900">
                From Crisis to Confidence: <span className="text-primary-500">We Walk With You</span>
              </h2>
            </div>
            
            <p className="text-lg text-warmgray-600 mb-8 leading-relaxed">
              We understand that reaching out for help takes courage. That first call, that first meeting – 
              it's the beginning of your journey back to peace. We've helped over 1,000 families find their 
              way through the storm, and we're ready to help you too.
            </p>
            
            <div className="space-y-4">
              {hopePoints.map((point, index) => {
                const Icon = point.icon;
                return (
                  <motion.div
                    key={point.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="flex gap-4"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-warmgray-900 mb-1">{point.title}</h3>
                      <p className="text-warmgray-600 text-sm">{point.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
            
            <div className="mt-8">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-3 rounded-xl font-medium hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg"
              >
                <Heart className="h-5 w-5" />
                Start Your Healing Journey
              </Link>
            </div>
          </motion.div>
          
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <div className="bg-gradient-to-br from-secondary-100 to-primary-100 h-[500px] flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-32 h-32 mx-auto mb-4 bg-white rounded-full flex items-center justify-center">
                    <Heart className="h-16 w-16 text-primary-400" />
                  </div>
                  <p className="text-warmgray-600 text-lg font-medium mb-2">[Family Unity Image]</p>
                  <p className="text-warmgray-500 text-sm">Peaceful family moments ahead</p>
                </div>
              </div>
              
              {/* Floating testimonial */}
              <motion.div
                className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur rounded-xl shadow-lg p-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                <div className="flex items-start gap-3">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <div>
                    <p className="text-sm text-warmgray-700 italic">
                      "They didn't just save my case, they saved my family"
                    </p>
                    <p className="text-xs text-warmgray-500 mt-1">– Recent Client</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}