import Link from "next/link";
import { Phone, Mail, MapPin, Clock, Facebook, Linkedin, Instagram, Shield, Award, Scale, Heart } from "lucide-react";
import { siteConfig, services } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Trust Badges Section */}
      <div className="bg-warmgray-900 border-b border-gray-800">
        <div className="container-main py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-primary-600/20 rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-primary-400" />
              </div>
              <h4 className="font-semibold text-sm">SRA Regulated</h4>
              <p className="text-xs text-gray-400">No: {siteConfig.sra}</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-secondary-600/20 rounded-lg flex items-center justify-center">
                <Award className="h-6 w-6 text-secondary-400" />
              </div>
              <h4 className="font-semibold text-sm">25+ Years</h4>
              <p className="text-xs text-gray-400">Combined Experience</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-primary-600/20 rounded-lg flex items-center justify-center">
                <Scale className="h-6 w-6 text-primary-400" />
              </div>
              <h4 className="font-semibold text-sm">Law Society</h4>
              <p className="text-xs text-gray-400">Family Law Member</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-secondary-600/20 rounded-lg flex items-center justify-center">
                <Heart className="h-6 w-6 text-secondary-400" />
              </div>
              <h4 className="font-semibold text-sm">1000+ Families</h4>
              <p className="text-xs text-gray-400">Successfully Helped</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container-main py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-bold mb-4">CVG Family Law</h3>
            <p className="text-gray-300 mb-4">
              Forward-thinking family law specialists providing compassionate and expert legal support in Tunbridge Wells, Kent.
            </p>
            <div className="flex gap-4">
              <a
                href={siteConfig.social.facebook}
                aria-label="Facebook"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href={siteConfig.social.linkedin}
                aria-label="LinkedIn"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href={siteConfig.social.instagram}
                aria-label="Instagram"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Services Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Our Services</h3>
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service.href}>
                  <Link
                    href={service.href}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/resources" className="text-gray-300 hover:text-white transition-colors">
                  Resources
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-300 hover:text-white transition-colors">
                  Privacy & Complaints
                </Link>
              </li>
              <li>
                <Link href="/legal" className="text-gray-300 hover:text-white transition-colors">
                  Legal & Regulatory
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-primary-400 mt-0.5" />
                <div>
                  <a
                    href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {siteConfig.phone}
                  </a>
                  <p className="text-xs text-gray-400 mt-1">Free 30-min consultation</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary-400 mt-0.5" />
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {siteConfig.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary-400 mt-0.5" />
                <div className="text-gray-300">
                  <p>{siteConfig.address.street}</p>
                  <p>{siteConfig.address.city}</p>
                  <p>{siteConfig.address.county}, {siteConfig.address.postcode}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-primary-400 mt-0.5" />
                <div className="text-gray-300">
                  <p>Mon-Fri: 9:00 AM - 5:30 PM</p>
                  <p className="text-xs text-gray-400 mt-1">Emergency support available</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-gray-400">
                © 2025 CVG Family Law Ltd. All rights reserved.
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Specialist Family Law Solicitors in Tunbridge Wells, Kent | SRA No: {siteConfig.sra} | Company No: {siteConfig.companyNo}
              </p>
            </div>
            <div className="flex gap-4 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <span className="text-gray-600">|</span>
              <Link href="/legal" className="text-gray-400 hover:text-white transition-colors">
                Terms
              </Link>
              <span className="text-gray-600">|</span>
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('openCookieSettings'))}
                className="text-gray-400 hover:text-white transition-colors"
              >
                Cookie Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}