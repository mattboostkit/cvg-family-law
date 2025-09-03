"use client";

import { motion } from "framer-motion";
import { Heart, Users, Shield, Clock } from "lucide-react";

const trustIndicators = [
  { 
    label: "Families Reunited", 
    value: "1000+",
    icon: Heart,
    description: "Finding peace together"
  },
  { 
    label: "Years of Compassion", 
    value: "25+",
    icon: Clock,
    description: "Trusted experience"
  },
  { 
    label: "Success Stories", 
    value: "96%",
    icon: Shield,
    description: "Positive outcomes"
  },
  { 
    label: "Free Consultation", 
    value: "30 min",
    icon: Users,
    description: "No pressure, just help"
  },
];

export default function TrustIndicators() {
  return (
    <section className="bg-gradient-to-r from-primary-500 via-primary-600 to-primary-500 text-white py-16">
      <div className="container-main">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {trustIndicators.map((indicator, index) => {
            const Icon = indicator.icon;
            return (
              <motion.div
                key={indicator.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="mb-3">
                  <Icon className="h-8 w-8 mx-auto opacity-80" />
                </div>
                <div className="text-3xl md:text-4xl font-bold mb-1">
                  {indicator.value}
                </div>
                <div className="text-sm md:text-base font-medium mb-1">
                  {indicator.label}
                </div>
                <div className="text-xs opacity-80">
                  {indicator.description}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}