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
    <section className="section-padding bg-gray-50">
      <div className="container-main">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Comprehensive Family Law Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We provide expert legal support across all areas of family law, 
            with a particular specialization in domestic abuse cases and children&apos;s welfare
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const Icon = iconMap[service.icon as keyof typeof iconMap];
            return (
              <motion.div
                key={service.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
              >
                <Link href={service.href} className="block p-6">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <div className="flex items-center text-primary-600 font-semibold">
                    Learn more <ArrowRight className="h-4 w-4 ml-1" />
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