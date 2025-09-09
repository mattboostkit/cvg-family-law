"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

export default function DomesticAbuseDefinition() {
  return (
    <section className="relative bg-gradient-to-br from-primary-50 to-white py-16">
      <div className="container-main">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <p className="text-lg text-warmgray-700 mb-8 leading-relaxed">
            Domestic abuse can come in many shapes and sizes…
          </p>
          
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-primary-100">
            <Quote className="h-8 w-8 text-primary-500 mx-auto mb-6" />
            <blockquote className="text-xl text-warmgray-800 italic leading-relaxed mb-4">
              "any incident or pattern of incidents of controlling, coercive, threatening behaviour, violence or abuse between those aged 16 or over who are, or have been, intimate partners or family members regardless of gender or sexuality."
            </blockquote>
            <cite className="text-primary-600 font-semibold">
              – UK Government definition
            </cite>
          </div>
        </motion.div>
      </div>
    </section>
  );
}