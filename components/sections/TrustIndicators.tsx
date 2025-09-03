"use client";

import { motion } from "framer-motion";
import { trustIndicators } from "@/lib/constants";

export default function TrustIndicators() {
  return (
    <section className="bg-primary-600 text-white py-12">
      <div className="container-main">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {trustIndicators.map((indicator, index) => (
            <motion.div
              key={indicator.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-bold mb-2">
                {indicator.value}
              </div>
              <div className="text-sm md:text-base opacity-90">
                {indicator.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}