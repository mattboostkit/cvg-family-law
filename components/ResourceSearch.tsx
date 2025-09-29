import React, { useState, useEffect } from 'react';
import { ResourceCategory, ResourceType, ResourceFilter, RESOURCE_CATEGORIES, RESOURCE_TYPES } from '@/types/resources';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X, AlertTriangle } from 'lucide-react';

interface ResourceSearchProps {
  onFilterChange: (filter: ResourceFilter) => void;
  onSearch: (query: string) => void;
  initialFilter?: ResourceFilter;
  resultCount?: number;
  className?: string;
}

export function ResourceSearch({
  onFilterChange,
  onSearch,
  initialFilter = {},
  resultCount,
  className = ''
}: ResourceSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<ResourceFilter>(initialFilter);
  const [showFilters, setShowFilters] = useState(false);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, onSearch]);

  // Update filters
  useEffect(() => {
    onFilterChange(filter);
  }, [filter, onFilterChange]);

  const handleFilterChange = (key: keyof ResourceFilter, value: string | boolean | undefined) => {
    setFilter(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilter({});
    setSearchQuery('');
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const activeFilterCount = Object.values(filter).filter(Boolean).length;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search resources... (e.g., 'safety planning', 'court process', 'emergency help')"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-10"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Filter Toggle and Results Count */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-1">
                {activeFilterCount}
              </Badge>
            )}
          </Button>

          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-sm text-gray-600"
            >
              Clear all
            </Button>
          )}
        </div>

        {resultCount !== undefined && (
          <div className="text-sm text-gray-600">
            {resultCount} resource{resultCount !== 1 ? 's' : ''} found
          </div>
        )}
      </div>

      {/* Emergency Notice */}
      <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
        <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0" />
        <div className="text-sm text-red-800">
          <strong>Emergency?</strong> If you are in immediate danger, call{' '}
          <a href="tel:999" className="font-semibold underline hover:no-underline">
            999
          </a>{' '}
          or CVG Family Law emergency line{' '}
          <a href="tel:07984782713" className="font-semibold underline hover:no-underline">
            07984 782 713
          </a>
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="p-4 border rounded-lg bg-gray-50 space-y-4">
          <h3 className="font-medium text-sm text-gray-900 mb-3">Filter Resources</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={filter.category || ''}
                onChange={(e) => handleFilterChange('category', e.target.value || undefined)}
                className="flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-600"
              >
                <option value="">All Categories</option>
                {Object.entries(RESOURCE_CATEGORIES).map(([key, category]) => (
                  <option key={key} value={key}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Resource Type
              </label>
              <select
                value={filter.type || ''}
                onChange={(e) => handleFilterChange('type', e.target.value || undefined)}
                className="flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-600"
              >
                <option value="">All Types</option>
                {Object.entries(RESOURCE_TYPES).map(([key, type]) => (
                  <option key={key} value={key}>
                    {type.icon} {type.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Emergency Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Urgency Level
              </label>
              <select
                value={
                  filter.emergency === true ? 'emergency' :
                  filter.emergency === false ? 'non-emergency' : ''
                }
                onChange={(e) => {
                  const value = e.target.value;
                  handleFilterChange('emergency', value === 'emergency' ? true : value === 'non-emergency' ? false : undefined);
                }}
                className="flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-600"
              >
                <option value="">All Resources</option>
                <option value="emergency">Emergency Only</option>
                <option value="non-emergency">Non-Emergency</option>
              </select>
            </div>

            {/* Downloadable Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Availability
              </label>
              <select
                value={
                  filter.downloadable === true ? 'downloadable' :
                  filter.downloadable === false ? 'online-only' : ''
                }
                onChange={(e) => {
                  const value = e.target.value;
                  handleFilterChange('downloadable', value === 'downloadable' ? true : value === 'online-only' ? false : undefined);
                }}
                className="flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-600"
              >
                <option value="">All Resources</option>
                <option value="downloadable">Downloadable</option>
                <option value="online-only">Online Only</option>
              </select>
            </div>
          </div>

          {/* Featured Filter */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="featured-only"
              checked={filter.featured === true}
              onChange={(e) => handleFilterChange('featured', e.target.checked ? true : undefined)}
              className="rounded border-gray-300"
            />
            <label htmlFor="featured-only" className="text-sm text-gray-700">
              Featured resources only
            </label>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-gray-600">Active filters:</span>

          {filter.category && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <span>{RESOURCE_CATEGORIES[filter.category].icon}</span>
              {RESOURCE_CATEGORIES[filter.category].name}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleFilterChange('category', undefined)}
              />
            </Badge>
          )}

          {filter.type && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <span>{RESOURCE_TYPES[filter.type].icon}</span>
              {RESOURCE_TYPES[filter.type].name}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleFilterChange('type', undefined)}
              />
            </Badge>
          )}

          {filter.emergency === true && (
            <Badge variant="destructive" className="flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Emergency Only
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleFilterChange('emergency', undefined)}
              />
            </Badge>
          )}

          {filter.emergency === false && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Non-Emergency
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleFilterChange('emergency', undefined)}
              />
            </Badge>
          )}

          {filter.downloadable === true && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Downloadable
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleFilterChange('downloadable', undefined)}
              />
            </Badge>
          )}

          {filter.featured === true && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Featured
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleFilterChange('featured', undefined)}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}