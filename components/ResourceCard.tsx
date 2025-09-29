import React from 'react';
import { Resource, RESOURCE_CATEGORIES, RESOURCE_TYPES } from '@/types/resources';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, Clock, Eye, Star, AlertTriangle, FileText } from 'lucide-react';

interface ResourceCardProps {
  resource: Resource;
  onDownload?: (resource: Resource) => void;
  onView?: (resource: Resource) => void;
  className?: string;
}

export function ResourceCard({ resource, onDownload, onView, className = '' }: ResourceCardProps) {
  const categoryInfo = RESOURCE_CATEGORIES[resource.category];
  const typeInfo = RESOURCE_TYPES[resource.type];

  const formatFileSize = (bytes: string | undefined) => {
    if (!bytes) return '';
    // Simple formatting - in a real app, you'd parse the actual bytes
    return bytes;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(new Date(date));
  };

  return (
    <Card className={`h-full flex flex-col hover:shadow-lg transition-shadow duration-200 ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-lg" role="img" aria-label={categoryInfo.name}>
              {categoryInfo.icon}
            </span>
            <Badge
              variant={resource.emergency ? 'destructive' : 'secondary'}
              className="text-xs"
            >
              {categoryInfo.name}
            </Badge>
            {resource.emergency && (
              <AlertTriangle className="h-4 w-4 text-red-500" />
            )}
          </div>
          {resource.featured && (
            <Star className="h-4 w-4 text-yellow-500 fill-current" />
          )}
        </div>

        <CardTitle className="text-lg leading-tight line-clamp-2">
          {resource.title}
        </CardTitle>

        <CardDescription className="line-clamp-3">
          {resource.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col pt-0">
        {/* Resource metadata */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="outline" className="text-xs">
            <FileText className="h-3 w-3 mr-1" />
            {typeInfo.name}
          </Badge>

          {resource.estimatedReadTime && (
            <Badge variant="outline" className="text-xs">
              <Clock className="h-3 w-3 mr-1" />
              {resource.estimatedReadTime} min read
            </Badge>
          )}

          <Badge variant="outline" className="text-xs">
            <Eye className="h-3 w-3 mr-1" />
            {resource.viewCount}
          </Badge>
        </div>

        {/* Tags */}
        {resource.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {resource.tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag.id}
                variant="secondary"
                className="text-xs"
                style={{
                  backgroundColor: tag.colour ? `${tag.colour}20` : undefined,
                  borderColor: tag.colour,
                  color: tag.colour
                }}
              >
                {tag.name}
              </Badge>
            ))}
            {resource.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{resource.tags.length - 3} more
              </Badge>
            )}
          </div>
        )}

        {/* File information */}
        {resource.files.length > 0 && (
          <div className="mb-4 p-3 bg-gray-50 rounded-md">
            <div className="text-xs text-gray-600 mb-2">Available Formats:</div>
            <div className="space-y-1">
              {resource.files.slice(0, 2).map((file, index) => (
                <div key={index} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1">
                    <Download className="h-3 w-3" />
                    {file.format.toUpperCase()}
                  </span>
                  <span className="text-gray-500">
                    {formatFileSize(file.size)}
                  </span>
                </div>
              ))}
              {resource.files.length > 2 && (
                <div className="text-xs text-gray-500">
                  +{resource.files.length - 2} more formats
                </div>
              )}
            </div>
          </div>
        )}

        {/* Download count and date */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <span className="flex items-center gap-1">
            <Download className="h-3 w-3" />
            {resource.downloadCount} downloads
          </span>
          <span>Updated {formatDate(resource.updatedAt)}</span>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 mt-auto">
          <Button
            onClick={() => onView?.(resource)}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>

          {resource.downloadable && (
            <Button
              onClick={() => onDownload?.(resource)}
              size="sm"
              className="flex-1"
            >
              <Download className="h-4 w-4 mr-1" />
              Download
            </Button>
          )}
        </div>

        {/* Excerpt */}
        {resource.excerpt && (
          <div className="mt-3 p-3 bg-blue-50 rounded-md">
            <div className="text-xs font-medium text-blue-900 mb-1">Quick Summary:</div>
            <div className="text-xs text-blue-800 line-clamp-2">
              {resource.excerpt}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}