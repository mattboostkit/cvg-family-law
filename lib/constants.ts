import { NavItem, Service } from './types';

export const siteConfig = {
  name: 'CVG Family Law Ltd',
  description: 'Forward-thinking, contemporary family law firm in Tunbridge Wells, Kent',
  url: 'https://www.cvgfamilylaw.com',
  phone: '07984 782 713',
  email: 'contact@cvgfamilylaw.com',
  address: {
    street: '89 High Street',
    city: 'Tunbridge Wells',
    county: 'Kent',
    postcode: 'TN1 1YG',
  },
  sra: '8007597',
  companyNo: '15007102',
  social: {
    linkedin: 'https://linkedin.com/company/cvg-family-law',
    instagram: 'https://instagram.com/cvgfamilylaw',
    facebook: 'https://facebook.com/cvgfamilylaw',
  },
};

export const navigation: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  {
    label: 'Services',
    href: '/services',
    children: [
      { label: 'Domestic Abuse Support', href: '/services/domestic-abuse' },
      { label: 'Children Law', href: '/services/children-law' },
      { label: 'Divorce & Separation', href: '/services/divorce' },
      { label: 'Financial Matters', href: '/services/financial' },
    ],
  },
  { label: 'FAQ', href: '/faq' },
  { label: 'Resources', href: '/resources' },
  { label: 'Contact', href: '/contact' },
];

export const services: Service[] = [
  {
    title: 'Domestic Abuse Support',
    description: 'Compassionate legal protection and advocacy for victims of domestic abuse',
    icon: 'Shield',
    href: '/services/domestic-abuse',
    features: [
      'Emergency protection orders',
      'Non-molestation orders',
      'Occupation orders',
      'Support for all victims',
      'Police liaison',
      'Confidential consultations'
    ],
  },
  {
    title: 'Children Law',
    description: 'Expert representation in all matters concerning children and their welfare',
    icon: 'Heart',
    href: '/services/children-law',
    features: [
      'Child arrangement orders',
      'Parental responsibility',
      'Special guardianship',
      'Care proceedings',
      'Child protection',
      'Contact disputes'
    ],
  },
  {
    title: 'Divorce & Separation',
    description: 'Supportive guidance through divorce proceedings with dignity and respect',
    icon: 'Users',
    href: '/services/divorce',
    features: [
      'No-fault divorce',
      'Joint applications',
      'Financial settlements',
      'Separation agreements',
      'Mediation support',
      'Civil partnerships'
    ],
  },
  {
    title: 'Financial Matters',
    description: 'Fair resolution of financial matters during relationship breakdown',
    icon: 'Calculator',
    href: '/services/financial',
    features: [
      'Asset division',
      'Property settlements',
      'Pension sharing',
      'Spousal maintenance',
      'High net worth cases',
      'Cost of living support'
    ],
  },
];

export const emergencyBannerText = {
  heading: 'Need Urgent Help?',
  subheading: 'If you are in immediate danger, call 999',
  phoneLabel: 'For urgent legal advice:',
  phone: '07984 782 713',
  buttonText: 'Quick Exit',
};

export const trustIndicators = [
  { label: 'Years of Experience', value: '25+' },
  { label: 'Families Helped', value: '1000+' },
  { label: 'Success Rate', value: '96%' },
  { label: 'Free Consultation', value: '30 min' },
];