"use client";

import { MapPin, Phone, Clock, Mail } from "lucide-react";
import { siteConfig } from "@/lib/constants";
import GoogleMap from "./GoogleMap";
import { motion } from "framer-motion";

export default function MapSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-warmgray-50 to-white">
      <div className="container-main">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-primary-600 font-medium text-sm uppercase tracking-wide">
            Visit Our Office
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-warmgray-900 mt-2">
            Find Us in Tunbridge Wells
          </h2>
          <p className="text-xl text-warmgray-600 mt-4 max-w-3xl mx-auto">
            Conveniently located in the heart of Tunbridge Wells with easy access 
            by train, car, and public transport.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Map */}
          <div className="lg:col-span-2">
            <GoogleMap height="500" className="h-full" />
          </div>

          {/* Contact Info Cards */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-warmgray-900 mb-2">Office Address</h3>
                  <address className="not-italic text-warmgray-600 space-y-1">
                    <p>{siteConfig.address.street}</p>
                    <p>{siteConfig.address.city}</p>
                    <p>{siteConfig.address.county}</p>
                    <p className="font-semibold">{siteConfig.address.postcode}</p>
                  </address>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="h-6 w-6 text-secondary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-warmgray-900 mb-2">Office Hours</h3>
                  <ul className="text-warmgray-600 space-y-1">
                    <li>Monday - Friday: 9:00 AM - 5:30 PM</li>
                    <li>Saturday: By appointment only</li>
                    <li>Sunday: Closed</li>
                  </ul>
                  <p className="text-sm text-primary-600 mt-2 font-medium">
                    Emergency support available 24/7
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-warmgray-900 mb-2">Get in Touch</h3>
                  <div className="space-y-2">
                    <a
                      href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
                      className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold"
                    >
                      <Phone className="h-4 w-4" />
                      {siteConfig.phone}
                    </a>
                    <a
                      href={`mailto:${siteConfig.email}`}
                      className="flex items-center gap-2 text-primary-600 hover:text-primary-700"
                    >
                      <Mail className="h-4 w-4" />
                      {siteConfig.email}
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl shadow-lg p-6"
            >
              <h3 className="font-semibold text-lg mb-2">Transport & Accessibility</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="font-semibold">By Train:</span>
                  <span>5 minute walk from Tunbridge Wells station</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold">By Car:</span>
                  <span>Public parking available nearby</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold">Access:</span>
                  <span>Wheelchair accessible, ground floor meeting rooms</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}