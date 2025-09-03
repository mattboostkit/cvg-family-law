"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from "lucide-react";
import { siteConfig } from "@/lib/constants";

const serviceAreas = [
  "Divorce & Separation",
  "Domestic Abuse",
  "Children Arrangements",
  "Financial Settlements",
  "Other Family Matter",
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    serviceArea: "",
    urgency: "routine",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-white py-16">
        <div className="container-main">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Get in Touch
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Book your free 30-minute consultation or contact us for urgent support. 
              We&apos;re here to help you through difficult times.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="section-padding">
        <div className="container-main">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto mb-12">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <Phone className="h-8 w-8 text-primary-600 mx-auto mb-3" />
              <h3 className="font-bold mb-2">Phone</h3>
              <a
                href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
                className="text-primary-600 hover:underline"
              >
                {siteConfig.phone}
              </a>
              <p className="text-sm text-gray-600 mt-1">Mon-Fri 9am-5:30pm</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <Mail className="h-8 w-8 text-primary-600 mx-auto mb-3" />
              <h3 className="font-bold mb-2">Email</h3>
              <a
                href={`mailto:${siteConfig.email}`}
                className="text-primary-600 hover:underline"
              >
                {siteConfig.email}
              </a>
              <p className="text-sm text-gray-600 mt-1">We aim to reply within 24h</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <MapPin className="h-8 w-8 text-primary-600 mx-auto mb-3" />
              <h3 className="font-bold mb-2">Office</h3>
              <p className="text-sm">
                {siteConfig.address.street}<br />
                {siteConfig.address.city}<br />
                {siteConfig.address.county}, {siteConfig.address.postcode}
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <Clock className="h-8 w-8 text-primary-600 mx-auto mb-3" />
              <h3 className="font-bold mb-2">Emergency</h3>
              <p className="text-sm text-gray-600">
                For urgent matters outside office hours, call our emergency line
              </p>
              <p className="text-sm text-red-600 font-semibold mt-1">
                In danger? Call 999
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-lg p-8">
                  <h2 className="text-2xl font-bold mb-6">
                    Book Your Free Consultation
                  </h2>
                  
                  {isSubmitted ? (
                    <div className="text-center py-12">
                      <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold mb-2">Thank You!</h3>
                      <p className="text-gray-600 mb-6">
                        We&apos;ve received your enquiry and will contact you within 24 hours 
                        to arrange your free consultation.
                      </p>
                      <p className="text-sm text-gray-600">
                        If you need urgent assistance, please call us on{" "}
                        <a href={`tel:${siteConfig.phone.replace(/\s/g, "")}`} className="text-primary-600 font-semibold">
                          {siteConfig.phone}
                        </a>
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="firstName" className="block text-sm font-medium mb-1">
                            First Name *
                          </label>
                          <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            required
                            value={formData.firstName}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          />
                        </div>
                        <div>
                          <label htmlFor="lastName" className="block text-sm font-medium mb-1">
                            Last Name *
                          </label>
                          <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            required
                            value={formData.lastName}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium mb-1">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="serviceArea" className="block text-sm font-medium mb-1">
                          How can we help? *
                        </label>
                        <select
                          id="serviceArea"
                          name="serviceArea"
                          required
                          value={formData.serviceArea}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        >
                          <option value="">Please select...</option>
                          {serviceAreas.map((area) => (
                            <option key={area} value={area}>
                              {area}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="urgency" className="block text-sm font-medium mb-1">
                          Urgency
                        </label>
                        <select
                          id="urgency"
                          name="urgency"
                          value={formData.urgency}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        >
                          <option value="routine">Routine enquiry</option>
                          <option value="urgent">Urgent (within 48 hours)</option>
                          <option value="emergency">Emergency (same day)</option>
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium mb-1">
                          Tell us about your situation (optional)
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          rows={4}
                          value={formData.message}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Please briefly describe your situation so we can better assist you..."
                        />
                      </div>
                      
                      <div className="text-sm text-gray-600">
                        <p className="mb-4">
                          * Required fields. Your information will be kept strictly confidential.
                        </p>
                      </div>
                      
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          "Sending..."
                        ) : (
                          <>
                            <Send className="h-5 w-5" />
                            Send Enquiry
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-secondary-50 rounded-lg p-6">
                  <h3 className="font-bold mb-3">Free 30-Minute Consultation</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Your first consultation is free and confidential. We&apos;ll discuss your 
                    situation, explain your options, and outline how we can help.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-secondary-600 mt-0.5" />
                      <span>No obligation to proceed</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-secondary-600 mt-0.5" />
                      <span>Clear fee estimates provided</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-secondary-600 mt-0.5" />
                      <span>Practical next steps outlined</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded-lg">
                  <h3 className="font-bold mb-2">Need Urgent Help?</h3>
                  <p className="text-sm text-gray-700 mb-3">
                    If you&apos;re in immediate danger, call 999. For urgent legal advice:
                  </p>
                  <a
                    href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
                    className="btn-primary text-sm w-full text-center block"
                  >
                    Call {siteConfig.phone}
                  </a>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-bold mb-3">Office Hours</h3>
                  <ul className="space-y-1 text-sm">
                    <li>Monday - Friday: 9:00 AM - 5:30 PM</li>
                    <li>Saturday: By appointment</li>
                    <li>Sunday: Closed</li>
                  </ul>
                  <p className="text-xs text-gray-600 mt-3">
                    Emergency support available outside office hours for domestic abuse cases.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-main">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">
              Visit Our Office
            </h2>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-bold mb-3">CVG Family Law</h3>
                  <address className="not-italic text-gray-600 space-y-1">
                    <p>{siteConfig.address.street}</p>
                    <p>{siteConfig.address.city}</p>
                    <p>{siteConfig.address.county}</p>
                    <p>{siteConfig.address.postcode}</p>
                  </address>
                  
                  <div className="mt-4 space-y-2">
                    <p className="text-sm">
                      <strong>By Train:</strong> 5 minute walk from Tunbridge Wells station
                    </p>
                    <p className="text-sm">
                      <strong>By Car:</strong> Public parking available nearby
                    </p>
                    <p className="text-sm">
                      <strong>Accessibility:</strong> Wheelchair accessible, ground floor meeting rooms available
                    </p>
                  </div>
                </div>
                
                <div className="bg-gray-200 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Map placeholder</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}