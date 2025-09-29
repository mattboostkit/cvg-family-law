"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu, X, ChevronDown, Phone, Mail, MapPin,
  Shield, Heart, Users, Calculator, Clock,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/constants";

const services = [
  {
    icon: Shield,
    title: "Domestic Abuse",
    href: "/services/domestic-abuse",
    description: "Immediate protection and support",
    urgent: true,
  },
  {
    icon: Heart,
    title: "Children Law",
    href: "/services/children-law",
    description: "Child arrangements and welfare",
  },
  {
    icon: Users,
    title: "Divorce & Separation",
    href: "/services/divorce",
    description: "Compassionate divorce guidance",
  },
  {
    icon: Calculator,
    title: "Financial Matters",
    href: "/services/financial",
    description: "Fair financial settlements",
  },
];

const aboutLinks = [
  { label: "Our Story", href: "/about#story" },
  { label: "Our Team", href: "/about#team" },
  { label: "Our Values", href: "/about#values" },
  { label: "Our Approach", href: "/about#approach" },
];

const resourceLinks = [
  { label: "Support Resources", href: "/resources#support" },
  { label: "Legal Guides", href: "/resources#guides" },
  { label: "FAQs", href: "/faq" },
  { label: "Emergency Contacts", href: "/resources#emergency" },
];

export default function EnhancedHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const handleMouseEnter = (dropdown: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveDropdown(dropdown);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 100);
  };


  return (
    <>
      {/* Main Header */}
      <header
        id="navigation"
        role="banner"
        className={cn(
          "sticky top-0 z-50 bg-white transition-all duration-300",
          isScrolled ? "shadow-lg" : "shadow-sm"
        )}
        aria-label="Main site navigation"
      >
        {/* Top Bar */}
        <div className="hidden lg:block border-b border-gray-100">
          <div className="container-main py-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-6">
                <a 
                  href={`mailto:${siteConfig.email}`}
                  className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors"
                >
                  <Mail className="h-3 w-3" />
                  {siteConfig.email}
                </a>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="h-3 w-3" />
                  {siteConfig.address.city}, {siteConfig.address.county}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="h-3 w-3" />
                  Mon-Fri: 9am-5:30pm
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-gray-500">SRA No: {siteConfig.sra}</span>
                <Link 
                  href="/contact"
                  className="bg-primary-600 text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-primary-700 transition-colors"
                >
                  Free Consultation
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="container-main">
          <div className={cn(
            "flex items-center justify-between transition-all duration-300",
            isScrolled ? "py-3" : "py-4"
          )}>
            {/* Logo */}
            <Link href="/" className="group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="transition-transform"
              >
                <Image
                  src="/logos/Logo_Flat.svg"
                  alt="CVG Family Law"
                  width={200}
                  height={48}
                  className="h-12 w-auto"
                  priority
                  sizes="(max-width: 768px) 150px, 200px"
                />
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              <Link 
                href="/"
                className="text-gray-700 hover:text-primary-600 font-medium transition-colors relative group"
              >
                Home
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-600 transition-all group-hover:w-full"></span>
              </Link>

              {/* Services Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => handleMouseEnter("services")}
                onMouseLeave={handleMouseLeave}
              >
                <button className="flex items-center gap-1 text-gray-700 hover:text-primary-600 font-medium transition-colors group">
                  Services
                  <ChevronDown className={cn(
                    "h-4 w-4 transition-transform",
                    activeDropdown === "services" && "rotate-180"
                  )} />
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-600 transition-all group-hover:w-full"></span>
                </button>
                
                <AnimatePresence>
                  {activeDropdown === "services" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-2xl p-6 min-w-[400px]"
                    >
                      <div className="grid gap-4">
                        {services.map((service) => {
                          const Icon = service.icon;
                          return (
                            <Link
                              key={service.href}
                              href={service.href}
                              className="flex items-start gap-4 p-3 rounded-lg hover:bg-primary-50 transition-colors group"
                            >
                              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                                <Icon className="h-5 w-5 text-primary-600" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-semibold text-gray-900">{service.title}</h3>
                                  {service.urgent && (
                                    <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full">
                                      Urgent Support
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600 mt-0.5">{service.description}</p>
                              </div>
                              <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-primary-600 transition-colors mt-1" />
                            </Link>
                          );
                        })}
                      </div>
                      <div className="mt-4 pt-4 border-t">
                        <Link 
                          href="/services"
                          className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                        >
                          View all services
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* About Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => handleMouseEnter("about")}
                onMouseLeave={handleMouseLeave}
              >
                <button className="flex items-center gap-1 text-gray-700 hover:text-primary-600 font-medium transition-colors group">
                  About
                  <ChevronDown className={cn(
                    "h-4 w-4 transition-transform",
                    activeDropdown === "about" && "rotate-180"
                  )} />
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-600 transition-all group-hover:w-full"></span>
                </button>
                
                <AnimatePresence>
                  {activeDropdown === "about" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-2xl p-4 min-w-[200px]"
                    >
                      {aboutLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="block px-4 py-2 rounded-lg hover:bg-primary-50 text-gray-700 hover:text-primary-600 transition-colors"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Resources Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => handleMouseEnter("resources")}
                onMouseLeave={handleMouseLeave}
              >
                <button className="flex items-center gap-1 text-gray-700 hover:text-primary-600 font-medium transition-colors group">
                  Resources
                  <ChevronDown className={cn(
                    "h-4 w-4 transition-transform",
                    activeDropdown === "resources" && "rotate-180"
                  )} />
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-600 transition-all group-hover:w-full"></span>
                </button>
                
                <AnimatePresence>
                  {activeDropdown === "resources" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-2xl p-4 min-w-[220px]"
                    >
                      {resourceLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="block px-4 py-2 rounded-lg hover:bg-primary-50 text-gray-700 hover:text-primary-600 transition-colors"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link 
                href="/contact"
                className="text-gray-700 hover:text-primary-600 font-medium transition-colors relative group"
              >
                Contact
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-600 transition-all group-hover:w-full"></span>
              </Link>

              {/* CTA Button */}
              <div className="flex items-center gap-3">
                <a
                  href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700"
                >
                  <Phone className="h-4 w-4" />
                  <span className="hidden xl:inline">{siteConfig.phone}</span>
                </a>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation"
            >
              <span className="sr-only">
                {isMobileMenuOpen ? "Close" : "Open"} navigation menu
              </span>
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              id="mobile-navigation"
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "spring", damping: 20 }}
              className="fixed inset-0 top-[60px] bg-white z-50 lg:hidden overflow-y-auto"
              role="navigation"
              aria-label="Mobile navigation menu"
              aria-modal="true"
            >
              <div className="container-main py-6">
                <div className="space-y-6">
                  <Link 
                    href="/"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-lg font-medium text-gray-700"
                  >
                    Home
                  </Link>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Services</h3>
                    <div className="space-y-3 pl-4">
                      {services.map((service) => {
                        const Icon = service.icon;
                        return (
                          <Link
                            key={service.href}
                            href={service.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center gap-3 text-gray-600"
                          >
                            <Icon className="h-4 w-4 text-primary-600" />
                            {service.title}
                          </Link>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">About</h3>
                    <div className="space-y-3 pl-4">
                      {aboutLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block text-gray-600"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Resources</h3>
                    <div className="space-y-3 pl-4">
                      {resourceLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block text-gray-600"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </div>

                  <Link 
                    href="/contact"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-lg font-medium text-gray-700"
                  >
                    Contact
                  </Link>

                  <div className="pt-6 space-y-4 border-t">
                    <a
                      href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
                      className="flex items-center justify-center gap-2 bg-primary-100 text-primary-600 py-3 rounded-lg font-semibold"
                    >
                      <Phone className="h-5 w-5" />
                      {siteConfig.phone}
                    </a>
                    <Link
                      href="/contact"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block bg-gradient-to-r from-primary-600 to-primary-700 text-white py-3 rounded-lg font-semibold text-center"
                    >
                      Book Free Consultation
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}