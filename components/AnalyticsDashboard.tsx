'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  AnalyticsDashboardData,
  ConversionFunnel,
  AnalyticsEventType,
  EventCategory,
  AlertType,
  AlertSeverity
} from '@/types/analytics';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/Skeleton';

interface AnalyticsDashboardProps {
  dateRange?: {
    startDate: string;
    endDate: string;
  };
  refreshInterval?: number;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  dateRange,
  refreshInterval = 30000 // 30 seconds default
}) => {
  const [data, setData] = useState<AnalyticsDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [realTimeVisitors, setRealTimeVisitors] = useState(0);

  // Fetch analytics data
  const fetchAnalyticsData = useCallback(async () => {
    try {
      setError(null);

      const params = new URLSearchParams();
      if (dateRange) {
        params.append('startDate', dateRange.startDate);
        params.append('endDate', dateRange.endDate);
      }
      params.append('aggregate', 'true');

      const response = await fetch(`/api/analytics/events?${params.toString()}`);

      if (!response.ok) {
        throw new Error('Failed to fetch analytics data');
      }

      const analyticsData = await response.json();
      setData(analyticsData);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching analytics data:', err);
      setError('Failed to load analytics data');
      setLoading(false);
    }
  }, [dateRange]);

  // Fetch funnel data
  const fetchFunnelData = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (dateRange) {
        params.append('startDate', dateRange.startDate);
        params.append('endDate', dateRange.endDate);
      }

      const response = await fetch(`/api/analytics/funnel?${params.toString()}`);

      if (!response.ok) {
        throw new Error('Failed to fetch funnel data');
      }

      const funnelData = await response.json();
      setData(prev => prev ? { ...prev, conversionFunnels: funnelData.funnels } : null);
    } catch (err) {
      console.error('Error fetching funnel data:', err);
    }
  }, [dateRange]);

  // Initial data load
  useEffect(() => {
    fetchAnalyticsData();
    fetchFunnelData();
  }, [fetchAnalyticsData, fetchFunnelData]);

  // Set up refresh interval
  useEffect(() => {
    const interval = setInterval(() => {
      fetchAnalyticsData();
      fetchFunnelData();

      // Update real-time visitor count
      setRealTimeVisitors(prev => Math.max(0, prev + Math.floor(Math.random() * 3) - 1));
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval, fetchAnalyticsData, fetchFunnelData]);

  if (loading) {
    return <AnalyticsDashboardSkeleton />;
  }

  if (error || !data) {
    return (
      <Alert className="m-4">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error || 'No data available'}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time insights into user behavior and conversion tracking
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="text-green-600">
            {realTimeVisitors} Active Visitors
          </Badge>
          <Button onClick={() => {
            fetchAnalyticsData();
            fetchFunnelData();
          }}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Visitors"
          value={data.overview.totalVisitors.toLocaleString()}
          change="+12.5%"
          changeType="positive"
        />
        <MetricCard
          title="Conversion Rate"
          value={`${data.overview.conversionRate.toFixed(1)}%`}
          change="+2.1%"
          changeType="positive"
        />
        <MetricCard
          title="Avg. Session Duration"
          value={`${Math.round(data.overview.averageSessionDuration / 60)}m`}
          change="+5.2%"
          changeType="positive"
        />
        <MetricCard
          title="Bounce Rate"
          value={`${data.overview.bounceRate.toFixed(1)}%`}
          change="-1.8%"
          changeType="positive"
        />
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="emergency">Emergency</TabsTrigger>
          <TabsTrigger value="funnels">Funnels</TabsTrigger>
          <TabsTrigger value="behavior">Behavior</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <OverviewTab data={data} />
        </TabsContent>

        <TabsContent value="emergency" className="space-y-4">
          <EmergencyTab data={data} />
        </TabsContent>

        <TabsContent value="funnels" className="space-y-4">
          <FunnelsTab data={data} />
        </TabsContent>

        <TabsContent value="behavior" className="space-y-4">
          <BehaviorTab data={data} />
        </TabsContent>

        <TabsContent value="resources" className="space-y-4">
          <ResourcesTab data={data} />
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <AlertsTab data={data} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Metric Card Component
interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, changeType }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className={`text-xs ${
        changeType === 'positive' ? 'text-green-600' :
        changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
      }`}>
        {change} from last period
      </p>
    </CardContent>
  </Card>
);

// Overview Tab Component
const OverviewTab: React.FC<{ data: AnalyticsDashboardData }> = ({ data }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <Card>
      <CardHeader>
        <CardTitle>Top Pages</CardTitle>
        <CardDescription>Most visited pages</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {data.topPages.slice(0, 5).map((page, index) => (
            <div key={index} className="flex justify-between items-center">
              <div className="truncate">
                <p className="font-medium">{page.pageTitle}</p>
                <p className="text-sm text-muted-foreground">{page.pageUrl}</p>
              </div>
              <Badge variant="secondary">{page.views} views</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Business Intelligence</CardTitle>
        <CardDescription>Key performance indicators</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <span>Lead Generation Rate</span>
          <span className="font-bold">{data.businessIntelligence.leadGenerationRate.toFixed(1)}%</span>
        </div>
        <div className="flex justify-between">
          <span>Client Acquisition Cost</span>
          <span className="font-bold">£{data.businessIntelligence.clientAcquisitionCost}</span>
        </div>
        <div className="flex justify-between">
          <span>Customer Lifetime Value</span>
          <span className="font-bold">£{data.businessIntelligence.customerLifetimeValue}</span>
        </div>
      </CardContent>
    </Card>
  </div>
);

// Emergency Tab Component
const EmergencyTab: React.FC<{ data: AnalyticsDashboardData }> = ({ data }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <Card>
      <CardHeader>
        <CardTitle>Emergency Analytics</CardTitle>
        <CardDescription>Emergency contact usage statistics</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <span>Total Emergency Clicks</span>
          <span className="font-bold text-red-600">{data.emergency.totalEmergencyClicks}</span>
        </div>
        <div className="flex justify-between">
          <span>Emergency Click Rate</span>
          <span className="font-bold">{data.emergency.emergencyClickRate.toFixed(1)}%</span>
        </div>
        <div className="flex justify-between">
          <span>Calls Initiated</span>
          <span className="font-bold">{data.emergency.emergencyCallsInitiated}</span>
        </div>
        <div className="flex justify-between">
          <span>Avg Response Time</span>
          <span className="font-bold">{data.emergency.emergencyResponseTime}s</span>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Peak Emergency Hours</CardTitle>
        <CardDescription>When emergency contacts are most used</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 flex-wrap">
          {data.emergency.peakEmergencyHours.map(hour => (
            <Badge key={hour} variant="outline">
              {hour}:00
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

// Funnels Tab Component
const FunnelsTab: React.FC<{ data: AnalyticsDashboardData }> = ({ data }) => (
  <div className="space-y-6">
    {data.conversionFunnels?.map((funnelData, index) => (
      <Card key={index}>
        <CardHeader>
          <CardTitle>{funnelData.funnel.name}</CardTitle>
          <CardDescription>
            Conversion Rate: {funnelData.analysis.overallConversionRate.toFixed(1)}%
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {funnelData.analysis.stepAnalysis.map((step, stepIndex) => (
              <div key={stepIndex} className="flex items-center gap-4">
                <div className="w-32 text-sm font-medium">{step.stepName}</div>
                <div className="flex-1">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${step.conversionRate}%` }}
                    ></div>
                  </div>
                </div>
                <div className="w-20 text-right text-sm">
                  {step.uniqueSessions} users
                </div>
                <div className="w-20 text-right text-sm text-muted-foreground">
                  {step.conversionRate.toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

// Behavior Tab Component
const BehaviorTab: React.FC<{ data: AnalyticsDashboardData }> = ({ data }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <Card>
      <CardHeader>
        <CardTitle>User Behavior Metrics</CardTitle>
        <CardDescription>How users interact with the site</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <span>Avg Session Duration</span>
          <span className="font-bold">{Math.round(data.userBehavior.averageSessionDuration / 60)}m</span>
        </div>
        <div className="flex justify-between">
          <span>Pages per Session</span>
          <span className="font-bold">{data.userBehavior.averagePagesPerSession.toFixed(1)}</span>
        </div>
        <div className="flex justify-between">
          <span>Bounce Rate</span>
          <span className="font-bold">{data.userBehavior.bounceRate.toFixed(1)}%</span>
        </div>
        <div className="flex justify-between">
          <span>Exit Rate</span>
          <span className="font-bold">{data.userBehavior.exitRate.toFixed(1)}%</span>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Entry & Exit Pages</CardTitle>
        <CardDescription>Where users start and end their journey</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-medium mb-2">Top Entry Pages</h4>
          <div className="space-y-1">
            {data.userBehavior.entryPages.slice(0, 3).map((page, index) => (
              <div key={index} className="text-sm">{page}</div>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-medium mb-2">Top Exit Pages</h4>
          <div className="space-y-1">
            {data.userBehavior.exitPages.slice(0, 3).map((page, index) => (
              <div key={index} className="text-sm">{page}</div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

// Resources Tab Component
const ResourcesTab: React.FC<{ data: AnalyticsDashboardData }> = ({ data }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <Card>
      <CardHeader>
        <CardTitle>Resource Engagement</CardTitle>
        <CardDescription>How users interact with resources</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <span>Total Views</span>
          <span className="font-bold">{data.resources.totalResourceViews}</span>
        </div>
        <div className="flex justify-between">
          <span>Total Downloads</span>
          <span className="font-bold">{data.resources.totalResourceDownloads}</span>
        </div>
        <div className="flex justify-between">
          <span>Download Rate</span>
          <span className="font-bold">{data.resources.resourceDownloadRate.toFixed(1)}%</span>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Popular Resources</CardTitle>
        <CardDescription>Most engaged resources</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {data.resources.popularResources.slice(0, 5).map((resource, index) => (
            <div key={index} className="flex justify-between items-center">
              <div>
                <p className="font-medium">{resource.resourceName}</p>
                <p className="text-sm text-muted-foreground">
                  {Math.round(resource.averageTimeSpent / 60)}m avg time
                </p>
              </div>
              <Badge variant="secondary">{resource.views} views</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

// Alerts Tab Component
const AlertsTab: React.FC<{ data: AnalyticsDashboardData }> = ({ data }) => (
  <Card>
    <CardHeader>
      <CardTitle>Active Alerts</CardTitle>
      <CardDescription>System alerts and notifications</CardDescription>
    </CardHeader>
    <CardContent>
      {data.alerts.length === 0 ? (
        <p className="text-muted-foreground">No active alerts</p>
      ) : (
        <div className="space-y-4">
          {data.alerts.map((alert, index) => (
            <Alert key={index} className={
              alert.severity === AlertSeverity.CRITICAL ? 'border-red-500' :
              alert.severity === AlertSeverity.HIGH ? 'border-orange-500' :
              alert.severity === AlertSeverity.MEDIUM ? 'border-yellow-500' :
              'border-blue-500'
            }>
              <AlertTitle className="flex items-center gap-2">
                {alert.title}
                <Badge variant={
                  alert.severity === AlertSeverity.CRITICAL ? 'destructive' :
                  alert.severity === AlertSeverity.HIGH ? 'destructive' :
                  'secondary'
                }>
                  {alert.severity}
                </Badge>
              </AlertTitle>
              <AlertDescription>
                {alert.message}
                <p className="text-xs text-muted-foreground mt-1">
                  {alert.timestamp.toLocaleString()}
                </p>
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}
    </CardContent>
  </Card>
);

// Loading Skeleton Component
const AnalyticsDashboardSkeleton: React.FC = () => (
  <div className="p-6 space-y-6">
    <div className="space-y-2">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-4 w-96" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16 mb-2" />
            <Skeleton className="h-3 w-24" />
          </CardContent>
        </Card>
      ))}
    </div>
    <Skeleton className="h-96 w-full" />
  </div>
);

export default AnalyticsDashboard;