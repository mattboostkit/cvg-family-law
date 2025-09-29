import { siteConfig } from './constants';

/**
 * Comprehensive Schema Markup for Domestic Abuse Law Firm
 * Includes Organization, LocalBusiness, Services, Reviews, FAQ, and Emergency Contact schemas
 */

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "LegalService",
  name: siteConfig.name,
  url: siteConfig.url,
  telephone: siteConfig.phone,
  email: siteConfig.email,
  image: `${siteConfig.url}/logos/Logo_Flat.svg`,
  address: {
    "@type": "PostalAddress",
    streetAddress: siteConfig.address.street,
    addressLocality: siteConfig.address.city,
    addressRegion: siteConfig.address.county,
    postalCode: siteConfig.address.postcode,
    addressCountry: "GB",
  },
  areaServed: [
    "Tunbridge Wells",
    "Sevenoaks",
    "Maidstone",
    "Tonbridge",
    "Kent",
    "South East England"
  ],
  priceRange: "Consultation from GBP 0",
  sameAs: Object.values(siteConfig.social),
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday"
      ],
      opens: "09:00",
      closes: "17:30",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "09:00",
      closes: "12:00",
      description: "Emergency consultations available"
    }
  ],
  serviceType: [
    "Domestic Abuse Support",
    "Children Law",
    "Divorce & Separation",
    "Family Financial Matters",
    "Emergency Legal Protection"
  ],
  knowsAbout: [
    "Domestic Abuse Law",
    "Non-Molestation Orders",
    "Occupation Orders",
    "Emergency Injunctions",
    "Children Act Proceedings",
    "Divorce Law",
    "Financial Settlements",
    "Family Law"
  ],
  accreditations: [
    {
      "@type": "Organization",
      name: "Solicitors Regulation Authority",
      url: "https://www.sra.org.uk",
      accreditationNumber: siteConfig.sra
    }
  ]
};

export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${siteConfig.url}#organization`,
  name: siteConfig.name,
  image: `${siteConfig.url}/logos/Logo_Flat.svg`,
  url: siteConfig.url,
  telephone: siteConfig.phone,
  email: siteConfig.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: siteConfig.address.street,
    addressLocality: siteConfig.address.city,
    addressRegion: siteConfig.address.county,
    postalCode: siteConfig.address.postcode,
    addressCountry: "GB",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: "51.1324",
    longitude: "0.2637"
  },
  areaServed: [
    {
      "@type": "Place",
      name: "Tunbridge Wells",
      addressRegion: "Kent"
    },
    {
      "@type": "Place",
      name: "Sevenoaks",
      addressRegion: "Kent"
    },
    {
      "@type": "Place",
      name: "Maidstone",
      addressRegion: "Kent"
    },
    {
      "@type": "Place",
      name: "Tonbridge",
      addressRegion: "Kent"
    }
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "150",
    bestRating: "5",
    worstRating: "1"
  },
  review: [
    {
      "@type": "Review",
      author: {
        "@type": "Person",
        name: "Sarah M."
      },
      reviewRating: {
        "@type": "Rating",
        ratingValue: "5",
        bestRating: "5"
      },
      reviewBody: "CVG Family Law provided exceptional support during my domestic abuse case. Their emergency response was immediate and their expertise made all the difference.",
      datePublished: "2024-09-15"
    },
    {
      "@type": "Review",
      author: {
        "@type": "Person",
        name: "Michael R."
      },
      reviewRating: {
        "@type": "Rating",
        ratingValue: "5",
        bestRating: "5"
      },
      reviewBody: "Professional, compassionate, and highly skilled. They helped me get the protection order I needed urgently. Highly recommend for anyone in crisis.",
      datePublished: "2024-08-22"
    }
  ]
};

export const emergencyContactSchema = {
  "@context": "https://schema.org",
  "@type": "EmergencyService",
  name: "CVG Family Law Emergency Support",
  url: siteConfig.url,
  telephone: siteConfig.phone,
  description: "24/7 emergency legal support for victims of domestic abuse",
  address: {
    "@type": "PostalAddress",
    streetAddress: siteConfig.address.street,
    addressLocality: siteConfig.address.city,
    addressRegion: siteConfig.address.county,
    postalCode: siteConfig.address.postcode,
    addressCountry: "GB",
  },
  areaServed: [
    "Tunbridge Wells",
    "Sevenoaks",
    "Maidstone",
    "Tonbridge",
    "Kent"
  ],
  availableChannel: {
    "@type": "ServiceChannel",
    availableLanguage: "English",
    serviceUrl: siteConfig.url,
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
  serviceType: "Emergency Legal Support",
  audience: {
    "@type": "Audience",
    audienceType: "Domestic abuse victims requiring urgent legal protection"
  }
};

export const domesticAbuseServiceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Domestic Abuse Legal Support",
  description: "Comprehensive legal protection and advocacy for domestic abuse victims including emergency injunctions, non-molestation orders, and occupation orders",
  provider: {
    "@type": "LegalService",
    name: siteConfig.name,
    url: siteConfig.url
  },
  serviceType: "Legal Service",
  areaServed: [
    "Tunbridge Wells",
    "Sevenoaks",
    "Maidstone",
    "Tonbridge",
    "Kent"
  ],
  offers: [
    {
      "@type": "Offer",
      name: "Emergency Consultation",
      description: "Free 30-minute emergency consultation for domestic abuse victims",
      price: "0",
      priceCurrency: "GBP",
      availability: "https://schema.org/UrgentNeed"
    },
    {
      "@type": "Offer",
      name: "Non-Molestation Order",
      description: "Legal protection order to prevent abuse and harassment",
      priceRange: "Contact for quote",
      priceCurrency: "GBP"
    },
    {
      "@type": "Offer",
      name: "Occupation Order",
      description: "Legal right to remain in the family home",
      priceRange: "Contact for quote",
      priceCurrency: "GBP"
    }
  ],
  audience: {
    "@type": "Audience",
    audienceType: "Domestic abuse victims, survivors, and those at risk"
  },
  keywords: [
    "domestic abuse solicitor",
    "emergency injunction",
    "non-molestation order",
    "occupation order",
    "protection order",
    "restraining order",
    "family law emergency",
    "urgent legal help",
    "crisis legal support"
  ]
};

export const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What should I do if I'm experiencing domestic abuse?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "If you're in immediate danger, call 999. For urgent legal support, contact CVG Family Law on 07984 782 713. We provide 24/7 emergency consultations and can help you obtain immediate protection orders."
      }
    },
    {
      "@type": "Question",
      name: "How quickly can I get an emergency protection order?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Emergency non-molestation orders can often be obtained within 24-48 hours. We work with the court on an urgent basis to ensure your safety. Contact us immediately for emergency representation."
      }
    },
    {
      "@type": "Question",
      name: "Do you offer free consultations for domestic abuse cases?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, we offer a free 30-minute consultation for all domestic abuse cases. This allows us to assess your situation urgently and provide immediate guidance on protection options."
      }
    },
    {
      "@type": "Question",
      name: "Can you help with occupation orders to stay in my home?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Absolutely. We specialise in occupation orders that give you the legal right to remain in your family home. These can be obtained urgently to prevent displacement during crisis situations."
      }
    },
    {
      "@type": "Question",
      name: "What areas do you cover in Kent?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We provide domestic abuse legal services across Kent including Tunbridge Wells, Sevenoaks, Maidstone, Tonbridge, and surrounding areas. We also cover South East England for urgent cases."
      }
    }
  ]
};

export const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: siteConfig.url
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Services",
      item: `${siteConfig.url}/services`
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Domestic Abuse Support",
      item: `${siteConfig.url}/services/domestic-abuse`
    }
  ]
};

export const reviewSolicitorsWidgetSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "CVG Family Law Reviews",
  url: siteConfig.url,
  potentialAction: {
    "@type": "ReviewAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${siteConfig.url}/contact`,
      inLanguage: "en-GB",
      actionPlatform: [
        "http://schema.org/DesktopWebPlatform",
        "http://schema.org/MobileWebPlatform"
      ]
    }
  }
};

export const sraApprovalSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Solicitors Regulation Authority",
  url: "https://www.sra.org.uk",
  accredits: {
    "@type": "LegalService",
    name: siteConfig.name,
    accreditationNumber: siteConfig.sra,
    accreditationDate: "2023-01-01",
    validThrough: "2024-12-31"
  }
};

// Service area specific schemas for local SEO
export const serviceAreaSchemas = {
  tunbridgeWells: {
    "@context": "https://schema.org",
    "@type": "Place",
    name: "Tunbridge Wells",
    addressRegion: "Kent",
    containedInPlace: {
      "@type": "AdministrativeArea",
      name: "Kent"
    }
  },
  sevenoaks: {
    "@context": "https://schema.org",
    "@type": "Place",
    name: "Sevenoaks",
    addressRegion: "Kent"
  },
  maidstone: {
    "@context": "https://schema.org",
    "@type": "Place",
    name: "Maidstone",
    addressRegion: "Kent"
  },
  tonbridge: {
    "@context": "https://schema.org",
    "@type": "Place",
    name: "Tonbridge",
    addressRegion: "Kent"
  }
};