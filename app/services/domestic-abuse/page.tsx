"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Shield, Phone, AlertCircle, Heart, Clock, CheckCircle, ArrowRight, X, MapPin, MessageCircle, FileText, Lock, Users, Eye, EyeOff, Home, Download, Smartphone, Camera, ClipboardCheck } from "lucide-react";
import { siteConfig } from "@/lib/constants";
import { motion } from "framer-motion";

export default function DomesticAbusePage() {
  const [showSafetyTip, setShowSafetyTip] = useState(true);
  const [privateMode, setPrivateMode] = useState(false);

  // Quick exit function
  const quickExit = () => {
    // Replace current page in history
    window.location.replace("https://www.bbc.co.uk/weather");
    // Open a new tab with weather site
    window.open("https://www.google.com", "_newtab");
  };

  // Keyboard shortcut for quick exit (ESC key)
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        quickExit();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <>
      {/* Fixed Quick Exit Button */}
      <div className="fixed top-20 right-4 z-50">
        <button
          onClick={quickExit}
          className="bg-red-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-red-700 transition-all transform hover:scale-105 flex items-center gap-2"
          aria-label="Quick exit - press ESC key"
        >
          <X className="h-5 w-5" />
          <span className="hidden sm:inline">Quick Exit (ESC)</span>
        </button>
      </div>

      {/* Emergency Banner with Enhanced Design */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="container-main relative">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <AlertCircle className="h-8 w-8 animate-pulse" />
                <div className="absolute inset-0 animate-ping">
                  <AlertCircle className="h-8 w-8 opacity-75" />
                </div>
              </div>
              <div>
                <p className="font-bold text-xl">In immediate danger? Call 999</p>
                <p className="text-sm opacity-90">For urgent legal advice: {siteConfig.phone} • Available 24/7</p>
              </div>
            </div>
            <div className="flex gap-2">
              <a
                href={`tel:999`}
                className="bg-white text-red-600 px-6 py-2 rounded font-semibold hover:bg-red-50 transition-all transform hover:scale-105"
              >
                Call 999
              </a>
              <button
                onClick={() => setPrivateMode(!privateMode)}
                className="bg-red-500 text-white px-4 py-2 rounded font-semibold hover:bg-red-400 transition-colors flex items-center gap-2"
                title="Toggle private browsing mode"
              >
                {privateMode ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                <span className="hidden sm:inline">{privateMode ? 'Private' : 'Normal'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Safety Browsing Tip */}
      {showSafetyTip && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-50 border-b border-amber-200 px-4 py-3"
        >
          <div className="container-main flex items-center justify-between">
            <div className="flex items-start gap-3">
              <Lock className="h-5 w-5 text-amber-600 mt-0.5" />
              <div className="text-sm">
                <strong className="text-amber-900">Your safety is our priority.</strong>
                <span className="text-amber-800 ml-1">
                  Use private/incognito browsing. Clear your history after visiting. Press ESC to quickly exit.
                </span>
              </div>
            </div>
            <button
              onClick={() => setShowSafetyTip(false)}
              className="text-amber-600 hover:text-amber-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Hero Section with Enhanced Design */}
      <section className="relative bg-gradient-to-br from-purple-50 via-pink-50 to-white py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-100/20 to-transparent"></div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="container-main relative"
        >
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <span className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                <Shield className="h-4 w-4" />
                Specialist Domestic Abuse Solicitors • Kent & South East England
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-center bg-gradient-to-r from-purple-900 to-pink-900 bg-clip-text text-transparent">
              You Are Not Alone
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-10 text-center max-w-3xl mx-auto leading-relaxed">
              Immediate legal protection for domestic abuse victims across <strong>Tunbridge Wells, 
              Sevenoaks, Tonbridge, and all of Kent</strong>. We&apos;re here 24/7.
            </p>
            
            {/* Emergency Contact Cards */}
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-red-600 text-white p-6 rounded-xl shadow-xl"
              >
                <Phone className="h-8 w-8 mb-3" />
                <h3 className="font-bold text-lg mb-2">Emergency Legal Help</h3>
                <a
                  href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
                  className="text-2xl font-bold hover:underline"
                >
                  {siteConfig.phone}
                </a>
                <p className="text-sm mt-2 opacity-90">Available 24/7 for emergencies</p>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-purple-600 text-white p-6 rounded-xl shadow-xl"
              >
                <MessageCircle className="h-8 w-8 mb-3" />
                <h3 className="font-bold text-lg mb-2">Secure Online Chat</h3>
                <button className="bg-white text-purple-600 px-4 py-2 rounded font-semibold hover:bg-purple-50 transition-colors">
                  Start Confidential Chat
                </button>
                <p className="text-sm mt-2 opacity-90">Encrypted & private</p>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-green-600 text-white p-6 rounded-xl shadow-xl"
              >
                <MapPin className="h-8 w-8 mb-3" />
                <h3 className="font-bold text-lg mb-2">Safe Meeting Locations</h3>
                <Link
                  href="/contact"
                  className="bg-white text-green-600 px-4 py-2 rounded font-semibold hover:bg-green-50 transition-colors inline-block"
                >
                  Book Safe Consultation
                </Link>
                <p className="text-sm mt-2 opacity-90">Multiple locations in Kent</p>
              </motion.div>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                <Lock className="h-4 w-4 inline mr-1" />
                All communications are strictly confidential and secure
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Immediate Local Help Section */}
      <section className="bg-gradient-to-r from-red-50 to-pink-50 py-12">
        <div className="container-main">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-8 text-center">
              <AlertCircle className="h-8 w-8 inline mr-2 text-red-600" />
              Immediate Help Available in Your Area
            </h2>
            
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Kent Emergency Services */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold mb-4 text-red-700">Kent Emergency Services</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-red-600 mt-1" />
                    <div>
                      <p className="font-semibold">Kent Police Domestic Abuse Unit</p>
                      <p className="text-sm text-gray-600">Call 101 (non-emergency) or 999 (emergency)</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-red-600 mt-1" />
                    <div>
                      <p className="font-semibold">Oasis Domestic Abuse Service (Tunbridge Wells)</p>
                      <a href="tel:01892576633" className="text-sm text-primary-600 hover:underline">01892 576633</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Heart className="h-5 w-5 text-red-600 mt-1" />
                    <div>
                      <p className="font-semibold">Look Ahead Care (Sevenoaks & Tonbridge)</p>
                      <a href="tel:01732452020" className="text-sm text-primary-600 hover:underline">01732 452020</a>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Refuge & Safe Houses */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold mb-4 text-purple-700">Safe Accommodation</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Home className="h-5 w-5 text-purple-600 mt-1" />
                    <div>
                      <p className="font-semibold">Kent Women&apos;s Refuge</p>
                      <p className="text-sm text-gray-600">24/7 emergency accommodation</p>
                      <a href="tel:08082000247" className="text-sm text-primary-600 hover:underline">0808 2000 247</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-purple-600 mt-1" />
                    <div>
                      <p className="font-semibold">Rising Sun Domestic Violence Project</p>
                      <p className="text-sm text-gray-600">Canterbury & East Kent</p>
                      <a href="tel:01227452852" className="text-sm text-primary-600 hover:underline">01227 452852</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-purple-600 mt-1" />
                    <div>
                      <p className="font-semibold">Clarion Housing Sanctuary</p>
                      <p className="text-sm text-gray-600">West Kent emergency housing</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <AlertCircle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-lg mb-2">Need Emergency Accommodation Tonight?</h4>
                  <p className="text-gray-700 mb-3">
                    We can arrange emergency safe accommodation immediately. Our team works directly with 
                    refuges across Kent, Sussex, and London to find you a safe place tonight.
                  </p>
                  <a
                    href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
                    className="inline-flex items-center gap-2 bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow-700 transition-colors"
                  >
                    <Phone className="h-5 w-5" />
                    Call Now for Emergency Housing
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Safety Planning Tools */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container-main">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-4 text-center">
              <Shield className="h-8 w-8 inline mr-2 text-blue-600" />
              Safety Planning Tools
            </h2>
            <p className="text-lg text-gray-600 mb-10 text-center max-w-3xl mx-auto">
              Practical tools and resources to help you stay safe and gather evidence
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-blue-500"
              >
                <ClipboardCheck className="h-10 w-10 text-blue-600 mb-4" />
                <h3 className="text-xl font-bold mb-3">Safety Checklist</h3>
                <p className="text-gray-600 mb-4">
                  Create your personalized safety plan with our comprehensive checklist.
                </p>
                <ul className="space-y-2 text-sm text-gray-600 mb-4">
                  <li>• Safe exit strategies</li>
                  <li>• Important documents to secure</li>
                  <li>• Emergency contacts list</li>
                  <li>• Financial preparation</li>
                </ul>
                <button className="text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Download Safety Plan PDF
                </button>
              </motion.div>
              
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-purple-500"
              >
                <Camera className="h-10 w-10 text-purple-600 mb-4" />
                <h3 className="text-xl font-bold mb-3">Evidence Documentation</h3>
                <p className="text-gray-600 mb-4">
                  Safely document abuse for legal proceedings.
                </p>
                <ul className="space-y-2 text-sm text-gray-600 mb-4">
                  <li>• Photo evidence guidelines</li>
                  <li>• Incident diary template</li>
                  <li>• Medical records checklist</li>
                  <li>• Witness statement forms</li>
                </ul>
                <button className="text-purple-600 font-semibold hover:text-purple-700 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Access Documentation Guide
                </button>
              </motion.div>
              
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-green-500"
              >
                <Smartphone className="h-10 w-10 text-green-600 mb-4" />
                <h3 className="text-xl font-bold mb-3">Digital Safety</h3>
                <p className="text-gray-600 mb-4">
                  Protect your digital privacy and communications.
                </p>
                <ul className="space-y-2 text-sm text-gray-600 mb-4">
                  <li>• Secure browsing tips</li>
                  <li>• Safe communication apps</li>
                  <li>• Location tracking prevention</li>
                  <li>• Social media privacy</li>
                </ul>
                <button className="text-green-600 font-semibold hover:text-green-700 flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Get Digital Safety Guide
                </button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Understanding Abuse with Enhanced Design */}
      <section className="section-padding bg-white">
        <div className="container-main">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-8 text-center">
                Recognizing Domestic Abuse
              </h2>
              <p className="text-lg text-gray-600 mb-10 text-center max-w-3xl mx-auto">
                Domestic abuse takes many forms. If you&apos;re experiencing any of these, 
                <strong> you deserve help and protection</strong>.
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold mb-3 text-primary-600">Physical Abuse</h3>
                <p className="text-gray-600">
                  Any form of physical violence including hitting, pushing, restraining, or 
                  threats of physical harm.
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold mb-3 text-primary-600">Emotional Abuse</h3>
                <p className="text-gray-600">
                  Verbal attacks, threats, isolation from friends and family, constant criticism, 
                  or humiliation.
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold mb-3 text-primary-600">Financial Abuse</h3>
                <p className="text-gray-600">
                  Controlling finances, preventing work, stealing money, or refusing access to 
                  joint accounts.
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold mb-3 text-primary-600">Coercive Control</h3>
                <p className="text-gray-600">
                  Pattern of controlling behaviour including monitoring, restricting freedom, or 
                  making threats.
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold mb-3 text-primary-600">Sexual Abuse</h3>
                <p className="text-gray-600">
                  Any non-consensual sexual activity or using sex as a weapon for power and 
                  control.
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold mb-3 text-primary-600">Digital Abuse</h3>
                <p className="text-gray-600">
                  Using technology to harass, stalk, or monitor including tracking devices or 
                  social media harassment.
                </p>
              </div>
            </div>
            
            <div className="mt-8 p-6 bg-secondary-50 rounded-lg">
              <p className="text-center text-lg">
                <strong>Remember:</strong> Abuse is never your fault, and you deserve to live 
                free from fear. We support victims of all genders and backgrounds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Legal Protection */}
      <section className="section-padding bg-gray-50">
        <div className="container-main">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Legal Protection Available
            </h2>
            
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start gap-4">
                  <Shield className="h-8 w-8 text-primary-600 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold mb-2">Non-Molestation Orders</h3>
                    <p className="text-gray-600 mb-3">
                      Prevents your abuser from using or threatening violence, harassing, or 
                      intimidating you. Breach is a criminal offense with immediate arrest powers.
                    </p>
                    <ul className="space-y-1">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-secondary-600 mt-0.5" />
                        <span className="text-sm text-gray-600">Can be obtained within 24 hours in emergencies</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-secondary-600 mt-0.5" />
                        <span className="text-sm text-gray-600">Protects you and your children</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-secondary-600 mt-0.5" />
                        <span className="text-sm text-gray-600">Can include specific locations like home, work, or school</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start gap-4">
                  <Shield className="h-8 w-8 text-primary-600 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold mb-2">Occupation Orders</h3>
                    <p className="text-gray-600 mb-3">
                      Decides who can live in the family home and can exclude your abuser, even 
                      if they own or rent the property.
                    </p>
                    <ul className="space-y-1">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-secondary-600 mt-0.5" />
                        <span className="text-sm text-gray-600">Secures safe housing for you and children</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-secondary-600 mt-0.5" />
                        <span className="text-sm text-gray-600">Can regulate who enters the property</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-secondary-600 mt-0.5" />
                        <span className="text-sm text-gray-600">May include power of arrest for breaches</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start gap-4">
                  <Shield className="h-8 w-8 text-primary-600 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold mb-2">Prohibited Steps Orders</h3>
                    <p className="text-gray-600 mb-3">
                      Prevents specific actions regarding children, such as removing them from 
                      your care or taking them abroad.
                    </p>
                    <ul className="space-y-1">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-secondary-600 mt-0.5" />
                        <span className="text-sm text-gray-600">Protects children from abduction</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-secondary-600 mt-0.5" />
                        <span className="text-sm text-gray-600">Can restrict contact with specific individuals</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-secondary-600 mt-0.5" />
                        <span className="text-sm text-gray-600">Enforceable by police</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Support */}
      <section className="section-padding">
        <div className="container-main">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">
              How We Support You
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-xl font-bold mb-4">Immediate Action</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-primary-600 mt-0.5" />
                    <p className="text-gray-600">Emergency appointments available same day</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-primary-600 mt-0.5" />
                    <p className="text-gray-600">Court applications within 24 hours when needed</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-primary-600 mt-0.5" />
                    <p className="text-gray-600">Liaison with police and support services</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xl font-bold mb-4">Ongoing Support</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Heart className="h-5 w-5 text-secondary-600 mt-0.5" />
                    <p className="text-gray-600">Confidential, judgment-free environment</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Heart className="h-5 w-5 text-secondary-600 mt-0.5" />
                    <p className="text-gray-600">Support through court proceedings</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Heart className="h-5 w-5 text-secondary-600 mt-0.5" />
                    <p className="text-gray-600">Referrals to counselling and support groups</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Resources */}
      <section className="section-padding bg-gray-50">
        <div className="container-main">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Additional Support Resources
            </h2>
            
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-xl font-bold mb-4">Emergency Contacts</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-primary-600 mt-0.5" />
                  <div>
                    <strong>Emergency Services:</strong> 999
                    <p className="text-sm text-gray-600">Always call if in immediate danger</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-primary-600 mt-0.5" />
                  <div>
                    <strong>National Domestic Abuse Helpline:</strong> 0808 2000 247
                    <p className="text-sm text-gray-600">24/7 confidential support</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-primary-600 mt-0.5" />
                  <div>
                    <strong>Men&apos;s Advice Line:</strong> 0808 8010 327
                    <p className="text-sm text-gray-600">Support for male victims</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-primary-600 mt-0.5" />
                  <div>
                    <strong>Galop LGBT+ Domestic Abuse:</strong> 0800 999 5428
                    <p className="text-sm text-gray-600">Specialist LGBT+ support</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 text-white section-padding">
        <div className="container-main text-center">
          <h2 className="text-3xl font-bold mb-4">
            Take the First Step to Safety
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            You deserve to live free from fear. Our specialist team is here to help you 
            take back control and protect yourself and your children.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
              className="bg-white text-primary-600 px-8 py-4 rounded-md font-semibold hover:bg-gray-50 transition-colors inline-flex items-center justify-center gap-2"
            >
              <Phone className="h-5 w-5" />
              Call Now for Help
            </a>
            <Link
              href="/contact"
              className="bg-transparent text-white border-2 border-white px-8 py-4 rounded-md font-semibold hover:bg-white hover:text-primary-600 transition-colors inline-flex items-center justify-center gap-2"
            >
              Book Confidential Consultation
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}