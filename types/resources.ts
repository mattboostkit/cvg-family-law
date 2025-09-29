export type ResourceCategory =
  | 'emergency'
  | 'legal-rights'
  | 'court-process'
  | 'safety-planning'
  | 'children-family'
  | 'financial-support'
  | 'local-services'
  | 'forms-templates';

export type ResourceType = 'guide' | 'checklist' | 'template' | 'directory' | 'worksheet' | 'summary' | 'contact-list';

export type ResourceFormat = 'pdf' | 'docx' | 'web-page' | 'printable' | 'interactive';

export type Language = 'en' | 'ar' | 'hi' | 'pl' | 'ur';

export interface ResourceFile {
  format: ResourceFormat;
  url: string;
  size?: string;
  pages?: number;
  lastModified: Date;
}

export interface ResourceTranslation {
  language: Language;
  title: string;
  description: string;
  content?: string;
  file?: ResourceFile;
}

export interface ResourceTag {
  id: string;
  name: string;
  colour?: string;
}

export interface Resource {
  id: string;
  slug: string;
  category: ResourceCategory;
  type: ResourceType;
  title: string;
  description: string;
  content?: string;
  excerpt?: string;
  featured: boolean;
  emergency: boolean;
  downloadable: boolean;
  files: ResourceFile[];
  translations: ResourceTranslation[];
  tags: ResourceTag[];
  author: string;
  publishedAt: Date;
  updatedAt: Date;
  version: string;
  downloadCount: number;
  viewCount: number;
  estimatedReadTime?: number; // in minutes
  prerequisites?: string[];
  relatedResources?: string[];
}

export interface ResourceCategoryInfo {
  id: ResourceCategory;
  name: string;
  description: string;
  icon: string;
  colour: string;
  emergency: boolean;
  sortOrder: number;
}

export interface ResourceFilter {
  category?: ResourceCategory;
  type?: ResourceType;
  tags?: string[];
  emergency?: boolean;
  downloadable?: boolean;
  language?: Language;
  featured?: boolean;
}

export interface ResourceSearchResult {
  resource: Resource;
  relevanceScore: number;
  matchedFields: string[];
}

export interface ResourceStats {
  totalResources: number;
  totalDownloads: number;
  categoryBreakdown: Record<ResourceCategory, number>;
  typeBreakdown: Record<ResourceType, number>;
  topDownloaded: Resource[];
  recentlyUpdated: Resource[];
}

export interface DownloadEvent {
  resourceId: string;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
  language?: Language;
  format?: ResourceFormat;
}

export interface ResourceAnalytics {
  resourceId: string;
  period: 'day' | 'week' | 'month' | 'year';
  views: number;
  downloads: number;
  uniqueViews: number;
  uniqueDownloads: number;
  averageTimeOnPage?: number;
  bounceRate?: number;
}

// Content management types
export interface ResourceContent {
  frontmatter: {
    title: string;
    description: string;
    category: ResourceCategory;
    type: ResourceType;
    featured?: boolean;
    emergency?: boolean;
    downloadable?: boolean;
    tags?: string[];
    author?: string;
    version?: string;
    estimatedReadTime?: number;
    prerequisites?: string[];
    relatedResources?: string[];
  };
  content: string;
  excerpt?: string;
}

// Constants
export const RESOURCE_CATEGORIES: Record<ResourceCategory, ResourceCategoryInfo> = {
  emergency: {
    id: 'emergency',
    name: 'Emergency Resources',
    description: 'Immediate safety information and crisis support',
    icon: '🚨',
    colour: '#ef4444',
    emergency: true,
    sortOrder: 1
  },
  'legal-rights': {
    id: 'legal-rights',
    name: 'Legal Rights',
    description: 'Understanding your legal protections and rights',
    icon: '⚖️',
    colour: '#3b82f6',
    emergency: false,
    sortOrder: 2
  },
  'court-process': {
    id: 'court-process',
    name: 'Court Process',
    description: 'What to expect in court proceedings',
    icon: '🏛️',
    colour: '#8b5cf6',
    emergency: false,
    sortOrder: 3
  },
  'safety-planning': {
    id: 'safety-planning',
    name: 'Safety Planning',
    description: 'Creating comprehensive safety plans',
    icon: '🛡️',
    colour: '#10b981',
    emergency: false,
    sortOrder: 4
  },
  'children-family': {
    id: 'children-family',
    name: 'Children & Family',
    description: 'Child custody and family protection',
    icon: '👶',
    colour: '#f59e0b',
    emergency: false,
    sortOrder: 5
  },
  'financial-support': {
    id: 'financial-support',
    name: 'Financial Support',
    description: 'Accessing financial help and benefits',
    icon: '💰',
    colour: '#06b6d4',
    emergency: false,
    sortOrder: 6
  },
  'local-services': {
    id: 'local-services',
    name: 'Local Services',
    description: 'Support services in Kent and South East',
    icon: '📍',
    colour: '#84cc16',
    emergency: false,
    sortOrder: 7
  },
  'forms-templates': {
    id: 'forms-templates',
    name: 'Forms & Templates',
    description: 'Legal form templates and documents',
    icon: '📄',
    colour: '#6b7280',
    emergency: false,
    sortOrder: 8
  }
};

export const RESOURCE_TYPES = {
  guide: { name: 'Guide', icon: '📖', downloadable: true },
  checklist: { name: 'Checklist', icon: '✅', downloadable: true },
  template: { name: 'Template', icon: '📋', downloadable: true },
  directory: { name: 'Directory', icon: '📂', downloadable: true },
  worksheet: { name: 'Worksheet', icon: '📝', downloadable: true },
  summary: { name: 'Summary', icon: '📄', downloadable: true },
  'contact-list': { name: 'Contact List', icon: '📞', downloadable: true }
} as const;

export const SUPPORTED_LANGUAGES: Record<Language, string> = {
  en: 'English',
  ar: 'العربية',
  hi: 'हिन्दी',
  pl: 'Polski',
  ur: 'اردو'
};