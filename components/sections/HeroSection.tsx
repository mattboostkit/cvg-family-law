"use client";

import Link from "next/link";
import Image from "next/image";
import { Phone, MessageSquare, Heart, MapPin, ShieldCheck, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { siteConfig } from "@/lib/constants";
import { images } from "@/lib/images";

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-primary-50 via-white to-secondary-50 overflow-hidden">
      {/* Warm overlay pattern */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse animation-delay-2000"></div>
      </div>

      <div className="container-main section-padding relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Heart className="h-6 w-6 text-primary-500" />
              <span className="text-primary-700 font-medium">
                Trauma-informed family law in Kent
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-warmgray-900 leading-tight mb-6">
              <span className="text-primary-500">Domestic Abuse Solicitors</span>{" "}
              in Tunbridge Wells & Kent
            </h1>

            <p className="text-xl text-warmgray-700 mb-8 leading-relaxed">
              When safety, children, and your future feel uncertain, our specialist team delivers
              rapid protective action, strategic advice, and unwavering compassion. We&apos;ve helped
              over a thousand survivors across Kent secure protection orders, safe child
              arrangements, and lasting stability.
            </p>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-primary-100 p-5 mb-8">
              <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
                <div className="flex items-center gap-3 text-left">
                  <div className="w-11 h-11 rounded-full bg-primary-100 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-wide text-primary-600 font-semibold">
                      Kent-wide support
                    </p>
                    <p className="text-warmgray-700 text-sm">
                      Tunbridge Wells &bull; Sevenoaks &bull; Maidstone &bull; Tonbridge
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-primary-700 font-medium">
                  <Sparkles className="h-4 w-4" />
                  Resolution & SRA regulated specialists
                </div>
              </div>
            </div>

            <ul className="grid sm:grid-cols-2 gap-4 mb-8 text-left">
              {[
                "Emergency injunctions and protective orders secured fast",
                "Dedicated domestic abuse team available 24/7",
                "Specialist child arrangement strategies that prioritise safety",
                "Confidential consultations in person or online",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 bg-white/60 border border-primary-100 rounded-xl px-4 py-3 shadow-sm"
                >
                  <ShieldCheck className="h-5 w-5 text-primary-600 mt-1" />
                  <span className="text-sm md:text-base text-warmgray-700 leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
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

            <p className="text-sm text-warmgray-500">
              SRA Regulated &bull; Company No. {siteConfig.companyNo} &bull; Emergency legal response available
              day or night
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Hero Image */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <div className="relative h-[500px]">
                <Image
                  src={images.hero.support}
                  alt="Domestic abuse solicitors supporting families in Tunbridge Wells"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>

              {/* Floating help cards */}
              <motion.div
                className="absolute top-4 left-4 bg-white rounded-xl shadow-lg p-4 max-w-[220px]"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium text-warmgray-700">
                    Rapid response team active
                  </span>
                </div>
                <p className="text-sm text-warmgray-600">
                  Same-day emergency injunction applications
                </p>
              </motion.div>

              <motion.div
                className="absolute bottom-4 right-4 bg-white rounded-xl shadow-lg p-4 max-w-[240px]"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 }}
              >
                <p className="text-2xl font-bold text-primary-600 mb-1">1000+</p>
                <p className="text-sm text-warmgray-600">
                  Kent families safeguarded through protective orders & child arrangements
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
