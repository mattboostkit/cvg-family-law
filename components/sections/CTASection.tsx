import Link from "next/link";
import { Phone, MessageSquare, Clock } from "lucide-react";
import { siteConfig } from "@/lib/constants";

export default function CTASection() {
  return (
    <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white section-padding">
      <div className="container-main text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to Take the Next Step?
        </h2>
        <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
          Get expert legal advice with a free 30-minute consultation. 
          We&apos;re here to listen, understand, and guide you through your options.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link
            href="/contact"
            className="bg-white text-primary-600 px-8 py-4 rounded-md font-semibold hover:bg-gray-50 transition-colors inline-flex items-center justify-center gap-2"
          >
            <MessageSquare className="h-5 w-5" />
            Book Free Consultation
          </Link>
          <a
            href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
            className="bg-transparent text-white border-2 border-white px-8 py-4 rounded-md font-semibold hover:bg-white hover:text-primary-600 transition-colors inline-flex items-center justify-center gap-2"
          >
            <Phone className="h-5 w-5" />
            Call Now
          </a>
        </div>
        
        <div className="flex items-center justify-center gap-2 text-sm">
          <Clock className="h-4 w-4" />
          <span>Available Monday-Friday, 9:00 AM - 5:30 PM</span>
        </div>
      </div>
    </section>
  );
}