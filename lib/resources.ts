import {
  Resource,
  ResourceCategory,
  ResourceFilter,
  ResourceSearchResult,
  ResourceStats,
  DownloadEvent,
  ResourceAnalytics,
  ResourceContent,
  ResourceType,
  Language,
  ResourceFormat
} from '@/types/resources';

// In-memory storage for demo purposes
// In production, this would be replaced with a database
let resources: Resource[] = [];
const downloadEvents: DownloadEvent[] = [];

// Load resources from content directory
export async function loadResources(): Promise<Resource[]> {
  try {
    // This would typically load from a CMS or database
    // For now, we'll return mock data until we create the content files
    return resources.length > 0 ? resources : await loadMockResources();
  } catch (error) {
    console.error('Error loading resources:', error);
    return [];
  }
}

// Get resource by ID
export function getResourceById(id: string): Resource | undefined {
  return resources.find(resource => resource.id === id);
}

// Get resource by slug
export function getResourceBySlug(slug: string): Resource | undefined {
  return resources.find(resource => resource.slug === slug);
}

// Filter resources based on criteria
export function filterResources(
  resources: Resource[],
  filter: ResourceFilter
): Resource[] {
  return resources.filter(resource => {
    if (filter.category && resource.category !== filter.category) {
      return false;
    }

    if (filter.type && resource.type !== filter.type) {
      return false;
    }

    if (filter.emergency !== undefined && resource.emergency !== filter.emergency) {
      return false;
    }

    if (filter.downloadable !== undefined && resource.downloadable !== filter.downloadable) {
      return false;
    }

    if (filter.featured !== undefined && resource.featured !== filter.featured) {
      return false;
    }

    if (filter.tags && filter.tags.length > 0) {
      const hasMatchingTag = filter.tags.some(tagId =>
        resource.tags.some(tag => tag.id === tagId)
      );
      if (!hasMatchingTag) {
        return false;
      }
    }

    if (filter.language) {
      const hasTranslation = resource.translations.some(
        translation => translation.language === filter.language
      );
      if (!hasTranslation) {
        return false;
      }
    }

    return true;
  });
}

// Search resources by query string
export function searchResources(
  query: string,
  resources: Resource[],
  limit: number = 50
): ResourceSearchResult[] {
  if (!query.trim()) {
    return [];
  }

  const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
  const results: ResourceSearchResult[] = [];

  for (const resource of resources) {
    let relevanceScore = 0;
    const matchedFields: string[] = [];

    // Search in title
    const titleMatch = resource.title.toLowerCase().includes(query.toLowerCase());
    if (titleMatch) {
      relevanceScore += 10;
      matchedFields.push('title');
    }

    // Search in description
    const descMatch = resource.description.toLowerCase().includes(query.toLowerCase());
    if (descMatch) {
      relevanceScore += 5;
      matchedFields.push('description');
    }

    // Search in content
    if (resource.content) {
      const contentMatch = resource.content.toLowerCase().includes(query.toLowerCase());
      if (contentMatch) {
        relevanceScore += 3;
        matchedFields.push('content');
      }
    }

    // Search in tags
    for (const tag of resource.tags) {
      const tagMatch = tag.name.toLowerCase().includes(query.toLowerCase());
      if (tagMatch) {
        relevanceScore += 7;
        matchedFields.push('tags');
        break;
      }
    }

    // Boost score for emergency resources if query suggests urgency
    const urgentKeywords = ['emergency', 'urgent', 'danger', 'help', 'crisis', 'immediate'];
    const isUrgentQuery = searchTerms.some(term => urgentKeywords.includes(term));
    if (isUrgentQuery && resource.emergency) {
      relevanceScore += 15;
    }

    // Boost score for featured resources
    if (resource.featured) {
      relevanceScore += 2;
    }

    if (relevanceScore > 0) {
      results.push({
        resource,
        relevanceScore,
        matchedFields: [...new Set(matchedFields)]
      });
    }
  }

  // Sort by relevance score and return top results
  return results
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, limit);
}

// Get resources by category
export function getResourcesByCategory(category: ResourceCategory): Resource[] {
  return resources.filter(resource => resource.category === category);
}

// Get featured resources
export function getFeaturedResources(limit: number = 6): Resource[] {
  return resources
    .filter(resource => resource.featured)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit);
}

// Get emergency resources
export function getEmergencyResources(): Resource[] {
  return resources.filter(resource => resource.emergency);
}

// Get resources by type
export function getResourcesByType(type: ResourceType): Resource[] {
  return resources.filter(resource => resource.type === type);
}

// Track download event
export function trackDownload(
  resourceId: string,
  userId?: string,
  language?: Language,
  format?: string
): void {
  const event: DownloadEvent = {
    resourceId,
    userId,
    timestamp: new Date(),
    language,
    format: format as ResourceFormat | undefined
  };

  downloadEvents.push(event);

  // Update resource download count
  const resource = getResourceById(resourceId);
  if (resource) {
    resource.downloadCount += 1;
  }
}

// Get resource statistics
export function getResourceStats(): ResourceStats {
  const totalResources = resources.length;
  const totalDownloads = resources.reduce((sum, resource) => sum + resource.downloadCount, 0);

  const categoryBreakdown = resources.reduce((acc, resource) => {
    acc[resource.category] = (acc[resource.category] || 0) + 1;
    return acc;
  }, {} as Record<ResourceCategory, number>);

  const typeBreakdown = resources.reduce((acc, resource) => {
    acc[resource.type] = (acc[resource.type] || 0) + 1;
    return acc;
  }, {} as Record<ResourceType, number>);

  const topDownloaded = resources
    .sort((a, b) => b.downloadCount - a.downloadCount)
    .slice(0, 10);

  const recentlyUpdated = resources
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 10);

  return {
    totalResources,
    totalDownloads,
    categoryBreakdown,
    typeBreakdown,
    topDownloaded,
    recentlyUpdated
  };
}

// Get resource analytics for a specific period
export function getResourceAnalytics(
  resourceId: string,
  period: 'day' | 'week' | 'month' | 'year' = 'month'
): ResourceAnalytics {
  const resource = getResourceById(resourceId);
  if (!resource) {
    throw new Error(`Resource with ID ${resourceId} not found`);
  }

  const now = new Date();
  let startDate: Date;

  switch (period) {
    case 'day':
      startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      break;
    case 'week':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case 'month':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case 'year':
      startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      break;
  }

  const periodDownloads = downloadEvents.filter(
    event => event.resourceId === resourceId && event.timestamp >= startDate
  );

  return {
    resourceId,
    period,
    views: resource.viewCount,
    downloads: periodDownloads.length,
    uniqueViews: resource.viewCount, // Simplified for demo
    uniqueDownloads: new Set(periodDownloads.map(d => d.userId).filter(Boolean)).size,
    averageTimeOnPage: 120, // Mock data
    bounceRate: 0.3 // Mock data
  };
}

// Add or update resource
export function upsertResource(resource: Resource): void {
  const existingIndex = resources.findIndex(r => r.id === resource.id);

  if (existingIndex >= 0) {
    resources[existingIndex] = resource;
  } else {
    resources.push(resource);
  }
}

// Delete resource
export function deleteResource(id: string): boolean {
  const initialLength = resources.length;
  resources = resources.filter(resource => resource.id !== id);
  return resources.length < initialLength;
}

// Get all unique tags
export function getAllTags(): string[] {
  const tagSet = new Set<string>();
  resources.forEach(resource => {
    resource.tags.forEach(tag => tagSet.add(tag.name));
  });
  return Array.from(tagSet).sort();
}

// Get resources by tag
export function getResourcesByTag(tagName: string): Resource[] {
  return resources.filter(resource =>
    resource.tags.some(tag => tag.name === tagName)
  );
}

// Mock data loader for development
async function loadMockResources(): Promise<Resource[]> {
  // This will be populated when we create the content files
  // For now, return empty array
  return [];
}