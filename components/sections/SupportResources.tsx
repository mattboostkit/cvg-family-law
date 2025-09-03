"use client";

import { Phone, ExternalLink, AlertCircle, Heart, Shield, Baby, Brain, Wallet, type LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

interface Resource {
  name: string;
  phone?: string;
  description: string;
  urgent?: boolean;
  available?: string;
  website?: string;
}

interface SupportCategory {
  title: string;
  icon: LucideIcon;
  color: string;
  resources: Resource[];
}

const supportCategories: SupportCategory[] = [
  {
    title: "Emergency & Crisis Support",
    icon: AlertCircle,
    color: "red",
    resources: [
      {
        name: "Emergency Services",
        phone: "999",
        description: "Immediate danger - Police, Ambulance, Fire",
        urgent: true,
        available: "24/7",
      },
      {
        name: "National Domestic Abuse Helpline",
        phone: "0808 2000 247",
        description: "Free, confidential support for women experiencing domestic abuse",
        website: "https://www.nationaldahelpline.org.uk",
        available: "24/7",
      },
      {
        name: "Men's Advice Line",
        phone: "0808 8010 327",
        description: "Support for male victims of domestic abuse",
        website: "https://mensadviceline.org.uk",
        available: "Mon-Fri 10am-8pm",
      },
    ],
  },
  {
    title: "Domestic Abuse Support",
    icon: Shield,
    color: "purple",
    resources: [
      {
        name: "Refuge",
        phone: "0808 2000 247",
        description: "Emergency accommodation and support services",
        website: "https://www.refuge.org.uk",
        available: "24/7",
      },
      {
        name: "Women's Aid",
        description: "Support services and live chat for women",
        website: "https://www.womensaid.org.uk",
        available: "Mon-Fri 10am-4pm",
      },
      {
        name: "Galop",
        phone: "0800 999 5428",
        description: "Specialist LGBT+ domestic abuse support",
        website: "https://galop.org.uk",
        available: "Mon-Fri 10am-8pm",
      },
      {
        name: "Respect Phoneline",
        phone: "0808 8024 040",
        description: "For people worried about their own behavior",
        website: "https://respectphoneline.org.uk",
        available: "Mon-Fri 10am-5pm",
      },
    ],
  },
  {
    title: "Children & Family Support",
    icon: Baby,
    color: "green",
    resources: [
      {
        name: "NSPCC",
        phone: "0808 800 5000",
        description: "Help for adults concerned about a child",
        website: "https://www.nspcc.org.uk",
        available: "Mon-Fri 8am-10pm",
      },
      {
        name: "Childline",
        phone: "0800 1111",
        description: "Support for children and young people",
        website: "https://www.childline.org.uk",
        available: "24/7",
      },
      {
        name: "Cafcass",
        phone: "0300 456 4000",
        description: "Children and Family Court Advisory Service",
        website: "https://www.cafcass.gov.uk",
        available: "Mon-Fri 9am-5pm",
      },
      {
        name: "Gingerbread",
        phone: "0808 802 0925",
        description: "Support for single parent families",
        website: "https://www.gingerbread.org.uk",
        available: "Mon-Fri 10am-6pm",
      },
    ],
  },
  {
    title: "Mental Health & Wellbeing",
    icon: Brain,
    color: "blue",
    resources: [
      {
        name: "Samaritans",
        phone: "116 123",
        description: "24/7 emotional support for anyone in crisis",
        website: "https://www.samaritans.org",
        available: "24/7",
      },
      {
        name: "Mind",
        phone: "0300 123 3393",
        description: "Mental health support and information",
        website: "https://www.mind.org.uk",
        available: "Mon-Fri 9am-6pm",
      },
      {
        name: "Relate",
        phone: "0300 003 0396",
        description: "Relationship counselling and support",
        website: "https://www.relate.org.uk",
        available: "Mon-Fri 9am-5pm",
      },
      {
        name: "Anxiety UK",
        phone: "03444 775 774",
        description: "Support for anxiety and stress",
        website: "https://www.anxietyuk.org.uk",
        available: "Mon-Fri 9:30am-5:30pm",
      },
    ],
  },
  {
    title: "Financial & Legal Support",
    icon: Wallet,
    color: "yellow",
    resources: [
      {
        name: "Citizens Advice",
        phone: "0800 144 8848",
        description: "Free advice on benefits, debt, and legal matters",
        website: "https://www.citizensadvice.org.uk",
        available: "Mon-Fri 9am-5pm",
      },
      {
        name: "StepChange",
        phone: "0800 138 1111",
        description: "Free debt advice and solutions",
        website: "https://www.stepchange.org",
        available: "Mon-Fri 8am-8pm",
      },
      {
        name: "Turn2us",
        phone: "0808 802 2000",
        description: "Help accessing welfare benefits and grants",
        website: "https://www.turn2us.org.uk",
        available: "Mon-Fri 9am-5pm",
      },
      {
        name: "Shelter",
        phone: "0808 800 4444",
        description: "Housing advice and homelessness support",
        website: "https://www.shelter.org.uk",
        available: "Mon-Fri 8am-8pm",
      },
    ],
  },
];

const colorMap = {
  red: "from-red-50 to-red-100 border-red-200 hover:shadow-red-100",
  purple: "from-purple-50 to-purple-100 border-purple-200 hover:shadow-purple-100",
  green: "from-green-50 to-green-100 border-green-200 hover:shadow-green-100",
  blue: "from-blue-50 to-blue-100 border-blue-200 hover:shadow-blue-100",
  yellow: "from-yellow-50 to-yellow-100 border-yellow-200 hover:shadow-yellow-100",
};

const iconColorMap = {
  red: "text-red-600 bg-red-100",
  purple: "text-purple-600 bg-purple-100",
  green: "text-green-600 bg-green-100",
  blue: "text-blue-600 bg-blue-100",
  yellow: "text-yellow-600 bg-yellow-100",
};

export default function SupportResources() {
  return (
    <section className="section-padding bg-gradient-to-b from-warmgray-50 to-white">
      <div className="container-main">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-secondary-600 font-medium text-sm uppercase tracking-wide">
              Support Network
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-warmgray-900 mt-2">
              You&apos;re Not Alone
            </h2>
            <p className="text-xl text-warmgray-600 max-w-3xl mx-auto leading-relaxed">
              Access a comprehensive network of support services. These organizations 
              provide immediate help, ongoing support, and specialized assistance.
            </p>
          </motion.div>
        </div>

        {/* Emergency Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl p-6 mb-12 shadow-xl"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <AlertCircle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg">In Immediate Danger?</h3>
                <p className="opacity-90">Call 999 for emergency services</p>
              </div>
            </div>
            <a
              href="tel:999"
              className="bg-white text-red-600 px-6 py-3 rounded-xl font-bold hover:bg-red-50 transition-colors inline-flex items-center gap-2"
            >
              <Phone className="h-5 w-5" />
              Call 999 Now
            </a>
          </div>
        </motion.div>

        {/* Support Categories */}
        <div className="space-y-12">
          {supportCategories.map((category, categoryIndex) => {
            const Icon = category.icon;
            const colorClass = colorMap[category.color as keyof typeof colorMap];
            const iconColor = iconColorMap[category.color as keyof typeof iconColorMap];

            return (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconColor}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-2xl font-bold text-warmgray-900">{category.title}</h3>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {category.resources.map((resource, index) => (
                    <motion.div
                      key={resource.name}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: categoryIndex * 0.1 + index * 0.05 }}
                      className={`bg-gradient-to-br ${colorClass} border rounded-xl p-5 hover:shadow-lg transition-all duration-300`}
                    >
                      {resource.urgent && (
                        <div className="inline-flex items-center gap-1 bg-red-500 text-white text-xs px-2 py-1 rounded-full mb-3">
                          <AlertCircle className="h-3 w-3" />
                          URGENT
                        </div>
                      )}
                      
                      <h4 className="font-bold text-warmgray-900 mb-2">{resource.name}</h4>
                      <p className="text-sm text-warmgray-600 mb-3">{resource.description}</p>
                      
                      <div className="space-y-2">
                        {resource.phone && (
                          <a
                            href={`tel:${resource.phone.replace(/\s/g, "")}`}
                            className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
                          >
                            <Phone className="h-4 w-4" />
                            {resource.phone}
                          </a>
                        )}
                        
                        {resource.website && (
                          <a
                            href={resource.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-primary-600 hover:text-primary-700 text-sm"
                          >
                            <ExternalLink className="h-4 w-4" />
                            Visit website
                          </a>
                        )}
                        
                        {resource.available && (
                          <div className="flex items-center gap-2 text-xs text-warmgray-500">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            {resource.available}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CVG Contact Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-8 text-white text-center shadow-xl"
        >
          <Heart className="h-12 w-12 mx-auto mb-4 opacity-80" />
          <h3 className="text-2xl font-bold mb-3">Need Legal Support?</h3>
          <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto">
            We&apos;re here to provide expert legal guidance with compassion and understanding. 
            Free 30-minute consultation available.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:07984782713"
              className="bg-white text-primary-600 px-6 py-3 rounded-xl font-bold hover:bg-primary-50 transition-colors inline-flex items-center justify-center gap-2"
            >
              <Phone className="h-5 w-5" />
              07984 782 713
            </a>
            <Link
              href="/contact"
              className="bg-primary-700 text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-800 transition-colors inline-flex items-center justify-center gap-2"
            >
              Book Consultation
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}