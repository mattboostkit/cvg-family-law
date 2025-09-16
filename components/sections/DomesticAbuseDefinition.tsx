"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Quote, Shield, ShieldCheck, MessageCircle, Lock, Home, HandCoins } from "lucide-react";

const abuseTypes = [
  {
    title: "Coercive & Controlling Behaviour",
    description:
      "Isolation, intimidation, threats, or surveillance that remove your independence and safety.",
    icon: Lock,
  },
  {
    title: "Financial & Economic Abuse",
    description:
      "Restricting access to money, employment, or essentials to maintain power over you.",
    icon: HandCoins,
  },
  {
    title: "Physical & Sexual Violence",
    description:
      "Any violent or non-consensual act that causes fear, injury, or humiliation.",
    icon: Shield,
  },
  {
    title: "Digital & Online Abuse",
    description:
      "Harassment, stalking, or threats through devices, social media, or spyware.",
    icon: MessageCircle,
  },
];

const legalSupport = [
  {
    title: "Emergency Protection",
    summary: "Non-molestation and occupation orders lodged the same day, with out-of-hours counsel available.",
  },
  {
    title: "Safe Child Arrangements",
    summary: "Child arrangement orders that prioritise safeguarding, supervised contact, and safeguarding referrals.",
  },
  {
    title: "Exit & Recovery Plans",
    summary: "Integrated support with refuges, therapists, and financial planners to rebuild securely.",
  },
];

export default function DomesticAbuseDefinition() {
  return (
    <section className="relative bg-gradient-to-br from-primary-50 to-white py-20 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-10 -left-10 w-60 h-60 bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-secondary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
      </div>

      <div className="container-main relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto text-center"
        >
          <p className="text-base md:text-lg text-warmgray-600 mb-6 leading-relaxed">
            Domestic abuse is rarely a single incident. It is a pattern of controlling, coercive, threatening,
            violent, or abusive behaviour between people aged 16 or over. Abuse can be physical, emotional,
            economic, psychological, or digital – and it affects people of every gender, background, and
            relationship status.
          </p>

          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-primary-100 mb-10 text-left">
            <Quote className="h-10 w-10 text-primary-500 mx-auto md:mx-0 mb-6" />
            <blockquote className="text-xl md:text-2xl text-warmgray-800 italic leading-relaxed mb-4">
              &ldquo;Any incident or pattern of incidents of controlling, coercive, threatening behaviour, violence
              or abuse between those aged 16 or over who are, or have been, intimate partners or family members
              regardless of gender or sexuality.&rdquo;
            </blockquote>
            <cite className="text-primary-600 font-semibold block">UK Government, Serious Crime Act 2015</cite>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto mb-12"
        >
          {abuseTypes.map(({ title, description, icon: Icon }) => (
            <div
              key={title}
              className="bg-white/80 backdrop-blur border border-primary-100 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center flex-shrink-0">
                  <Icon className="h-6 w-6 text-primary-600" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-warmgray-900 mb-2">{title}</h3>
                  <p className="text-sm text-warmgray-600 leading-relaxed">{description}</p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-6xl mx-auto"
        >
          <div className="bg-gradient-to-br from-primary-600 to-primary-500 text-white rounded-3xl p-8 md:p-12 shadow-xl">
            <div className="grid md:grid-cols-3 gap-6 md:gap-8">
              {legalSupport.map(({ title, summary }) => (
                <div key={title} className="bg-white/10 rounded-2xl p-6 border border-white/20">
                  <h3 className="text-lg font-semibold mb-3">{title}</h3>
                  <p className="text-sm md:text-base text-white/80 leading-relaxed">{summary}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 md:mt-10 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
              <div className="flex items-center gap-3 text-sm md:text-base">
                <Home className="h-5 w-5" />
                Safe in-person consultations at our Tunbridge Wells office or secure online meetings.
              </div>
              <Link
                href="/services/domestic-abuse"
                className="inline-flex items-center justify-center gap-2 bg-white text-primary-600 px-6 py-3 rounded-xl font-semibold hover:bg-primary-50 transition-colors"
              >
                Explore Domestic Abuse Legal Support
                <ShieldCheck className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
