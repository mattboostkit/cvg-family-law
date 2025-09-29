'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Resource, ResourceFilter } from '@/types/resources';
import { ResourceCard } from '@/components/ResourceCard';
import { ResourceSearch } from '@/components/ResourceSearch';
import { loadResources, filterResources, searchResources } from '@/lib/resources';
import { Skeleton } from '@/components/ui/Skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Grid, List, AlertCircle, Download } from 'lucide-react';

type ViewMode = 'grid' | 'list';

interface ResourceLibraryProps {
  initialCategory?: string;
  showEmergencyOnly?: boolean;
  maxItems?: number;
  className?: string;
}

export function ResourceLibrary({
  initialCategory,
  showEmergencyOnly = false,
  maxItems,
  className = ''
}: ResourceLibraryProps) {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<ResourceFilter>({});
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [displayedResources, setDisplayedResources] = useState<Resource[]>([]);

  // Initialize with emergency filter if specified
  useEffect(() => {
    if (showEmergencyOnly) {
      setFilter(prev => ({ ...prev, emergency: true }));
    }
    if (initialCategory) {
      setFilter(prev => ({ ...prev, category: initialCategory as ResourceFilter['category'] }));
    }
  }, [showEmergencyOnly, initialCategory]);

  // Load resources on mount
  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        const data = await loadResources();
        setResources(data);
      } catch (err) {
        console.error('Failed to load resources:', err);
        setError('Failed to load resources. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  // Process and filter resources
  const processedResources = useMemo(() => {
    let filtered = resources;

    // Apply search query
    if (searchQuery.trim()) {
      const searchResults = searchResources(searchQuery, resources, 100);
      filtered = searchResults.map(result => result.resource);
    }

    // Apply filters
    if (Object.keys(filter).length > 0) {
      filtered = filterResources(filtered, filter);
    }

    // Sort resources
    filtered.sort((a, b) => {
      // Emergency resources first
      if (a.emergency && !b.emergency) return -1;
      if (!a.emergency && b.emergency) return 1;

      // Then featured resources
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;

      // Then by publication date
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });

    // Limit items if specified
    if (maxItems) {
      filtered = filtered.slice(0, maxItems);
    }

    return filtered;
  }, [resources, searchQuery, filter, maxItems]);

  // Update displayed resources
  useEffect(() => {
    setDisplayedResources(processedResources);
  }, [processedResources]);

  const handleDownload = (resource: Resource) => {
    // Track download in analytics
    // In a real app, this would call an API to track the download
    console.log('Downloading resource:', resource.title);

    // Find the first downloadable file
    const downloadableFile = resource.files.find(file => file.format === 'pdf' || file.format === 'docx');
    if (downloadableFile) {
      // Create a temporary link to trigger download
      const link = document.createElement('a');
      link.href = downloadableFile.url;
      link.download = `${resource.slug}.${downloadableFile.format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleView = (resource: Resource) => {
    // Track view in analytics
    console.log('Viewing resource:', resource.title);
    // In a real app, this might navigate to a detailed view or open a modal
  };

  // Loading state
  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <ResourceSearch
          onFilterChange={setFilter}
          onSearch={setSearchQuery}
          initialFilter={filter}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="space-y-3">
              <Skeleton className="h-48 w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={className}>
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {error}
            <Button
              variant="outline"
              size="sm"
              className="ml-4"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Search and Filter Section */}
      <ResourceSearch
        onFilterChange={setFilter}
        onSearch={setSearchQuery}
        initialFilter={filter}
        resultCount={displayedResources.length}
      />

      {/* View Mode Toggle and Emergency Notice */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
            className="flex items-center gap-2"
          >
            <Grid className="h-4 w-4" />
            Grid
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
            className="flex items-center gap-2"
          >
            <List className="h-4 w-4" />
            List
          </Button>
        </div>

        {displayedResources.length > 0 && (
          <div className="text-sm text-gray-600">
            Showing {displayedResources.length} of {resources.length} resources
          </div>
        )}
      </div>

      {/* Emergency Resources Notice */}
      {displayedResources.some(r => r.emergency) && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertCircle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>Emergency Resources Available:</strong> These resources provide immediate safety information.
            If you are in immediate danger, please call{' '}
            <a href="tel:999" className="font-semibold underline">999</a> or our emergency line{' '}
            <a href="tel:07984782713" className="font-semibold underline">07984 782 713</a>.
          </AlertDescription>
        </Alert>
      )}

      {/* Results Section */}
      {displayedResources.length === 0 ? (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No resources found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || Object.keys(filter).length > 0
                ? "Try adjusting your search terms or filters to find more resources."
                : "No resources are currently available in this category."
              }
            </p>
            {searchQuery || Object.keys(filter).length > 0 ? (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery('');
                  setFilter({});
                }}
              >
                Clear filters
              </Button>
            ) : null}
          </div>
        </div>
      ) : (
        <>
          {/* Category Tabs for Mobile */}
          <div className="block md:hidden">
            <Tabs value="all" onValueChange={() => {}} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="emergency">Emergency</TabsTrigger>
                <TabsTrigger value="featured">Featured</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-6">
                <ResourceGrid
                  resources={displayedResources}
                  viewMode={viewMode}
                  onDownload={handleDownload}
                  onView={handleView}
                />
              </TabsContent>

              <TabsContent value="emergency" className="mt-6">
                <ResourceGrid
                  resources={displayedResources.filter(r => r.emergency)}
                  viewMode={viewMode}
                  onDownload={handleDownload}
                  onView={handleView}
                />
              </TabsContent>

              <TabsContent value="featured" className="mt-6">
                <ResourceGrid
                  resources={displayedResources.filter(r => r.featured)}
                  viewMode={viewMode}
                  onDownload={handleDownload}
                  onView={handleView}
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* Desktop Grid/List View */}
          <div className="hidden md:block">
            <ResourceGrid
              resources={displayedResources}
              viewMode={viewMode}
              onDownload={handleDownload}
              onView={handleView}
            />
          </div>
        </>
      )}
    </div>
  );
}

// Resource Grid Component
interface ResourceGridProps {
  resources: Resource[];
  viewMode: ViewMode;
  onDownload: (resource: Resource) => void;
  onView: (resource: Resource) => void;
}

function ResourceGrid({ resources, viewMode, onDownload, onView }: ResourceGridProps) {
  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((resource) => (
          <ResourceCard
            key={resource.id}
            resource={resource}
            onDownload={onDownload}
            onView={onView}
          />
        ))}
      </div>
    );
  }

  // List view
  return (
    <div className="space-y-4">
      {resources.map((resource) => (
        <div key={resource.id} className="flex items-center gap-4 p-4 border rounded-lg">
          <div className="flex-shrink-0">
            <span className="text-2xl">
              {Object.entries({
                'emergency': '🚨',
                'legal-rights': '⚖️',
                'court-process': '🏛️',
                'safety-planning': '🛡️',
                'children-family': '👶',
                'financial-support': '💰',
                'local-services': '📍',
                'forms-templates': '📄'
              }).find(([key]) => key === resource.category)?.[1] || '📄'}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 truncate">{resource.title}</h3>
            <p className="text-sm text-gray-600 line-clamp-2">{resource.description}</p>
            <div className="flex items-center gap-2 mt-1">
              {resource.emergency && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                  Emergency
                </span>
              )}
              {resource.featured && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                  Featured
                </span>
              )}
              <span className="text-xs text-gray-500">
                {new Date(resource.publishedAt).toLocaleDateString('en-GB')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => onView(resource)}>
              View
            </Button>
            {resource.downloadable && (
              <Button size="sm" onClick={() => onDownload(resource)}>
                <Download className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}