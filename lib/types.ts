export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export interface Service {
  title: string;
  description: string;
  icon: string;
  href: string;
  features?: string[];
}

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image?: string;
  qualifications?: string[];
}

export interface Testimonial {
  content: string;
  author: string;
  rating: number;
  date: string;
}

export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  serviceArea: string;
  message: string;
  urgency: 'routine' | 'urgent' | 'emergency';
}