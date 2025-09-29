/**
 * Voice Search Optimization Schema
 * Optimizes content for natural language queries and voice assistant searches
 */

export const voiceSearchQuestions = [
  {
    question: "How do I get an emergency protection order?",
    answer: "Contact CVG Family Law immediately on 07984 782 713 for urgent assistance. We can help you obtain an emergency non-molestation order or occupation order within 24-48 hours to protect you and your family."
  },
  {
    question: "Where can I find a domestic abuse solicitor near me?",
    answer: "CVG Family Law provides expert domestic abuse legal services across Kent including Tunbridge Wells, Sevenoaks, Maidstone, and Tonbridge. Call 07984 782 713 for immediate support."
  },
  {
    question: "What should I do if I'm experiencing domestic abuse?",
    answer: "If you're in immediate danger, call 999. For urgent legal help, contact CVG Family Law on 07984 782 713. We offer free consultations and can provide immediate protection orders."
  },
  {
    question: "Can I get legal aid for domestic abuse?",
    answer: "Yes, victims of domestic abuse are often eligible for legal aid. CVG Family Law can assess your eligibility and help you apply for funding to cover legal costs."
  },
  {
    question: "How quickly can I get a non-molestation order?",
    answer: "Emergency non-molestation orders can often be obtained within 24-48 hours through urgent court applications. We work with the court on an expedited basis for your safety."
  },
  {
    question: "Do you provide 24/7 emergency legal support?",
    answer: "Yes, we provide 24/7 emergency legal support for domestic abuse victims. Call 07984 782 713 anytime for urgent assistance with protection orders and court injunctions."
  },
  {
    question: "What areas do you cover in Kent?",
    answer: "We cover all of Kent including Tunbridge Wells, Sevenoaks, Maidstone, Tonbridge, and surrounding areas. We also handle urgent cases across South East England."
  },
  {
    question: "How much does an emergency consultation cost?",
    answer: "We offer free 30-minute consultations for domestic abuse cases. This allows us to assess your situation urgently and provide immediate guidance on protection options."
  }
];

export const voiceSearchSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  name: "Domestic Abuse Legal Questions - Voice Search Optimized",
  description: "Frequently asked questions about emergency domestic abuse legal support, answered for voice search optimization",
  publisher: {
    "@type": "LegalService",
    name: "CVG Family Law",
    url: "https://www.cvgfamilylaw.com",
    telephone: "07984 782 713"
  },
  mainEntity: voiceSearchQuestions.map(item => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
      author: {
        "@type": "LegalService",
        name: "CVG Family Law"
      }
    },
    keywords: [
      "domestic abuse",
      "emergency legal help",
      "protection order",
      "family law",
      "Kent",
      "Tunbridge Wells"
    ]
  })),
  datePublished: new Date().toISOString().split('T')[0],
  dateModified: new Date().toISOString().split('T')[0]
};

// Schema for "near me" voice searches
export const locationBasedVoiceSchema = {
  "@context": "https://schema.org",
  "@type": "LegalService",
  name: "CVG Family Law - Domestic Abuse Solicitors",
  description: "Emergency domestic abuse legal services across Kent",
  areaServed: [
    {
      "@type": "Place",
      name: "Tunbridge Wells",
      addressRegion: "Kent",
      addressCountry: "GB"
    },
    {
      "@type": "Place",
      name: "Sevenoaks",
      addressRegion: "Kent",
      addressCountry: "GB"
    },
    {
      "@type": "Place",
      name: "Maidstone",
      addressRegion: "Kent",
      addressCountry: "GB"
    },
    {
      "@type": "Place",
      name: "Tonbridge",
      addressRegion: "Kent",
      addressCountry: "GB"
    },
    {
      "@type": "AdministrativeArea",
      name: "Kent",
      addressCountry: "GB"
    }
  ],
  serviceType: [
    "Emergency Protection Orders",
    "Non-Molestation Orders",
    "Occupation Orders",
    "Domestic Abuse Support",
    "Family Law"
  ],
  availableChannel: {
    "@type": "ServiceChannel",
    availableLanguage: "English",
    serviceUrl: "https://www.cvgfamilylaw.com",
    hoursAvailable: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday", "Tuesday", "Wednesday", "Thursday",
        "Friday", "Saturday", "Sunday"
      ],
      opens: "00:00",
      closes: "23:59",
      description: "24/7 emergency availability"
    }
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "150",
    bestRating: "5",
    worstRating: "1"
  }
};

// Schema for emergency/urgent voice searches
export const emergencyVoiceSchema = {
  "@context": "https://schema.org",
  "@type": "EmergencyService",
  name: "24/7 Emergency Domestic Abuse Legal Support",
  description: "Immediate legal assistance for domestic abuse victims across Kent",
  provider: {
    "@type": "LegalService",
    name: "CVG Family Law",
    url: "https://www.cvgfamilylaw.com",
    telephone: "07984 782 713",
    address: {
      "@type": "PostalAddress",
      streetAddress: "89 High Street",
      addressLocality: "Tunbridge Wells",
      addressRegion: "Kent",
      postalCode: "TN1 1YG",
      addressCountry: "GB"
    }
  },
  areaServed: [
    "Tunbridge Wells",
    "Sevenoaks",
    "Maidstone",
    "Tonbridge",
    "Kent"
  ],
  serviceType: "Emergency Legal Protection",
  audience: {
    "@type": "Audience",
    audienceType: "Domestic abuse victims requiring immediate legal protection"
  },
  availableChannel: {
    "@type": "ServiceChannel",
    availableLanguage: "English",
    servicePhone: "07984 782 713",
    hoursAvailable: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday", "Tuesday", "Wednesday", "Thursday",
        "Friday", "Saturday", "Sunday"
      ],
      opens: "00:00",
      closes: "23:59",
      validFrom: "2024-01-01",
      validThrough: "2024-12-31"
    }
  }
};