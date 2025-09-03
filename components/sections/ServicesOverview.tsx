"use client";

import Link from "next/link";
import { Shield, Heart, Users, Calculator, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { services } from "@/lib/constants";

const iconMap = {
  Shield,
  Heart,
  Users,
  Calculator,
};

export default function ServicesOverview() {
  return (
    <section className="section-padding bg-gradient-to-b from-warmgray-50 to-white">
      <div className="container-main">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-primary-600 font-medium text-sm uppercase tracking-wide">How We Help</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-warmgray-900 mt-2">
              Your Path to Peace and Resolution
            </h2>
            <p className="text-xl text-warmgray-600 max-w-3xl mx-auto leading-relaxed">
              Every family&apos;s journey is unique. We offer compassionate support tailored to your 
              specific needs, helping you find stability and hope during uncertain times.
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const Icon = iconMap[service.icon as keyof typeof iconMap];
            return (
              <motion.div
                key={service.href}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="group"
              >
                <Link href={service.href} className="block">
                  <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden h-full">
                    {/* Image Placeholder */}
                    <div className="h-48 bg-gradient-to-br from-primary-50 to-secondary-50 relative overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <Icon className="h-16 w-16 text-primary-300 mb-2" />
                          <p className="text-xs text-warmgray-500">[Supportive Image]</p>
                        </div>
                      </div>
                      <div className="absolute top-2 right-2 w-12 h-12 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon className="h-6 w-6 text-primary-600" />
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-3 text-warmgray-900">{service.title}</h3>
                      <p className="text-warmgray-600 mb-4 text-sm leading-relaxed">{service.description}</p>
                      <div className="flex items-center text-primary-500 font-medium group-hover:text-primary-600 transition-colors">
                        Find your path <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}