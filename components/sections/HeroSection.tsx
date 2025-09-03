"use client";

import Link from "next/link";
import { Phone, MessageSquare, Shield, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { siteConfig } from "@/lib/constants";

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-primary-50 to-secondary-50 overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="container-main section-padding relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Forward-Thinking{" "}
              <span className="text-primary-600">Family Law</span> Specialists
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              At CVG Family Law, we provide compassionate, expert legal support through life&apos;s most challenging moments. 
              Based in Tunbridge Wells, Kent, we&apos;re here to guide you through every step with care and expertise.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link href="/contact" className="btn-primary flex items-center justify-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Free 30-Min Consultation
              </Link>
              <a
                href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
                className="btn-outline flex items-center justify-center gap-2"
              >
                <Phone className="h-5 w-5" />
                Call {siteConfig.phone}
              </a>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Shield className="h-5 w-5 text-secondary-600" />
              <span>Specialist support for domestic abuse cases</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-white rounded-lg shadow-xl p-8">
              <h2 className="text-2xl font-bold mb-4">How We Can Help</h2>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <ArrowRight className="h-5 w-5 text-primary-600 mt-0.5" />
                  <span>Expert guidance through divorce and separation</span>
                </li>
                <li className="flex items-start gap-3">
                  <ArrowRight className="h-5 w-5 text-primary-600 mt-0.5" />
                  <span>Protection from domestic abuse</span>
                </li>
                <li className="flex items-start gap-3">
                  <ArrowRight className="h-5 w-5 text-primary-600 mt-0.5" />
                  <span>Children&apos;s welfare and arrangements</span>
                </li>
                <li className="flex items-start gap-3">
                  <ArrowRight className="h-5 w-5 text-primary-600 mt-0.5" />
                  <span>Fair financial settlements</span>
                </li>
                <li className="flex items-start gap-3">
                  <ArrowRight className="h-5 w-5 text-primary-600 mt-0.5" />
                  <span>Mediation and collaborative solutions</span>
                </li>
              </ul>
              <div className="mt-6 pt-6 border-t">
                <p className="text-sm text-gray-600 mb-3">
                  Led by Cora and Bridget, our team brings over 25 years of combined experience
                </p>
                <Link href="/about" className="text-primary-600 font-semibold hover:text-primary-700">
                  Learn more about our team →
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}