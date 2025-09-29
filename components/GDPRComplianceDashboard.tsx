'use client';

import React, { useState, useEffect } from 'react';
import {
  GDPRComplianceReport,
  DataProcessingActivity,
  ConsentRecord,
  DataRetentionRule,
  BreachIncident,
  DataSubjectRequest,
  AnalyticsEvent,
  PrivacyComplianceData
} from '@/types/analytics';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getAnalyticsTracker } from '@/lib/analytics';

interface GDPRComplianceDashboardProps {
  refreshInterval?: number;
}

const GDPRComplianceDashboard: React.FC<GDPRComplianceDashboardProps> = ({
  refreshInterval = 60000 // 1 minute default
}) => {
  const [report, setReport] = useState<GDPRComplianceReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showDataRequestDialog, setShowDataRequestDialog] = useState(false);
  const [showDeletionDialog, setShowDeletionDialog] = useState(false);

  const analytics = getAnalyticsTracker();

  // Fetch GDPR compliance report
  const fetchComplianceReport = async () => {
    try {
      setError(null);

      // In a real implementation, this would be an API call
      // For demo purposes, we'll generate mock data
      const mockReport: GDPRComplianceReport = {
        totalDataSubjects: 1247,
        dataProcessingActivities: [
          {
            id: 'analytics_processing',
            purpose: 'Website Analytics and Performance Monitoring',
            legalBasis: 'Legitimate Interest',
            categories: ['Usage Data', 'Technical Data', 'Performance Metrics'],
            recipients: ['Internal Analytics Team'],
            retentionPeriod: 90,
            active: true
          },
          {
            id: 'contact_forms',
            purpose: 'Client Consultation and Legal Services',
            legalBasis: 'Contract',
            categories: ['Contact Information', 'Legal Case Data', 'Communication History'],
            recipients: ['Legal Team', 'Case Management System'],
            retentionPeriod: 2555, // 7 years for legal records
            active: true
          },
          {
            id: 'emergency_contacts',
            purpose: 'Emergency Support and Crisis Intervention',
            legalBasis: 'Vital Interest',
            categories: ['Emergency Contact Data', 'Crisis Information'],
            recipients: ['Emergency Services', 'Support Team'],
            retentionPeriod: 30,
            active: true
          }
        ],
        consentRecords: [],
        dataRetentionSchedule: [
          {
            dataType: 'Analytics Data',
            retentionPeriod: 90,
            deletionSchedule: 'Automatic deletion after 90 days',
            active: true
          },
          {
            dataType: 'Contact Forms',
            retentionPeriod: 2555,
            deletionSchedule: 'Retention for 7 years post-case closure',
            active: true
          }
        ],
        breachIncidents: [],
        dataSubjectRequests: []
      };

      setReport(mockReport);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching GDPR report:', err);
      setError('Failed to load GDPR compliance report');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplianceReport();
  }, []);

  useEffect(() => {
    const interval = setInterval(fetchComplianceReport, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval]);

  const handleDataExport = async () => {
    try {
      const userData = analytics.exportUserData();

      // Create download
      const blob = new Blob([JSON.stringify(userData, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `user-data-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error exporting user data:', err);
      setError('Failed to export user data');
    }
  };

  const handleDataDeletion = async () => {
    try {
      analytics.deleteUserData();

      // Send deletion request to server
      await fetch('/api/analytics/events?userId=' + getCurrentUserId(), {
        method: 'DELETE'
      });

      alert('Your data has been successfully deleted');
      setShowDeletionDialog(false);
    } catch (err) {
      console.error('Error deleting user data:', err);
      setError('Failed to delete user data');
    }
  };

  const getCurrentUserId = (): string => {
    return localStorage.getItem('user_id') || 'anonymous';
  };

  const submitDataRequest = async (requestType: 'access' | 'rectification' | 'erasure' | 'portability', description: string) => {
    try {
      const request: Omit<DataSubjectRequest, 'id' | 'requestedAt' | 'status' | 'completedAt' | 'response'> = {
        requestType,
        userId: getCurrentUserId(),
        requestedAt: new Date(),
        status: 'pending'
      };

      // In a real implementation, send to server
      console.log('Data request submitted:', request, description);

      alert('Your data request has been submitted. We will respond within 30 days.');
      setShowDataRequestDialog(false);
    } catch (err) {
      console.error('Error submitting data request:', err);
      setError('Failed to submit data request');
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <Alert className="m-6">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error || 'No compliance data available'}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">GDPR Compliance Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor and manage GDPR compliance across all data processing activities
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showDataRequestDialog} onOpenChange={setShowDataRequestDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                Submit Data Request
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Submit Data Subject Request</DialogTitle>
                <DialogDescription>
                  Exercise your GDPR rights regarding your personal data
                </DialogDescription>
              </DialogHeader>
              <DataRequestForm onSubmit={submitDataRequest} />
            </DialogContent>
          </Dialog>

          <Button variant="outline" onClick={handleDataExport}>
            Export My Data
          </Button>

          <Dialog open={showDeletionDialog} onOpenChange={setShowDeletionDialog}>
            <DialogTrigger asChild>
              <Button variant="destructive">
                Delete My Data
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Data Deletion</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. All your personal data will be permanently deleted.
                </DialogDescription>
              </DialogHeader>
              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowDeletionDialog(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDataDeletion}>
                  Confirm Deletion
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Data Subjects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{report.totalDataSubjects.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Total individuals with data
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Processes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {report.dataProcessingActivities.filter(p => p.active).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Active data processing activities
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {report.dataSubjectRequests.filter(r => r.status === 'pending').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Data subject requests awaiting response
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
          <TabsTrigger value="retention">Retention</TabsTrigger>
          <TabsTrigger value="requests">Requests</TabsTrigger>
          <TabsTrigger value="breaches">Breaches</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Compliance Status</CardTitle>
                <CardDescription>Overall GDPR compliance health</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Consent Management</span>
                  <Badge className="bg-green-100 text-green-800">Compliant</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Data Processing</span>
                  <Badge className="bg-green-100 text-green-800">Compliant</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Retention Policies</span>
                  <Badge className="bg-green-100 text-green-800">Compliant</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Subject Rights</span>
                  <Badge className="bg-yellow-100 text-yellow-800">Review Needed</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Your Privacy Rights</CardTitle>
                <CardDescription>Quick access to your GDPR rights</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" onClick={() => submitDataRequest('access', 'Access request')}>
                  📋 Right of Access
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => submitDataRequest('rectification', 'Rectification request')}>
                  ✏️ Right to Rectification
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => submitDataRequest('erasure', 'Erasure request')}>
                  🗑️ Right to Erasure
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => submitDataRequest('portability', 'Portability request')}>
                  📤 Right to Data Portability
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="processing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Processing Activities</CardTitle>
              <CardDescription>
                All active data processing activities and their legal basis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Purpose</TableHead>
                    <TableHead>Legal Basis</TableHead>
                    <TableHead>Categories</TableHead>
                    <TableHead>Retention</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {report.dataProcessingActivities.map((activity) => (
                    <TableRow key={activity.id}>
                      <TableCell className="font-medium">{activity.purpose}</TableCell>
                      <TableCell>{activity.legalBasis}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {activity.categories.map((category) => (
                            <Badge key={category} variant="outline" className="text-xs">
                              {category}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{activity.retentionPeriod} days</TableCell>
                      <TableCell>
                        <Badge className={activity.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {activity.active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="retention" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Retention Schedule</CardTitle>
              <CardDescription>
                Automatic data deletion schedules and retention policies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data Type</TableHead>
                    <TableHead>Retention Period</TableHead>
                    <TableHead>Deletion Schedule</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {report.dataRetentionSchedule.map((rule, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{rule.dataType}</TableCell>
                      <TableCell>{rule.retentionPeriod} days</TableCell>
                      <TableCell>{rule.deletionSchedule}</TableCell>
                      <TableCell>
                        <Badge className={rule.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {rule.active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Subject Requests</CardTitle>
              <CardDescription>
                Manage and track data subject access requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              {report.dataSubjectRequests.length === 0 ? (
                <p className="text-muted-foreground">No data subject requests</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>User ID</TableHead>
                      <TableHead>Requested</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Response</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {report.dataSubjectRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium capitalize">{request.requestType}</TableCell>
                        <TableCell className="font-mono text-sm">{request.userId}</TableCell>
                        <TableCell>{request.requestedAt.toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge variant={
                            request.status === 'completed' ? 'default' :
                            request.status === 'pending' ? 'secondary' :
                            'outline'
                          }>
                            {request.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {request.completedAt ? request.completedAt.toLocaleDateString() : '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="breaches" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Breach Incidents</CardTitle>
              <CardDescription>
                Record and track data breach incidents and responses
              </CardDescription>
            </CardHeader>
            <CardContent>
              {report.breachIncidents.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No data breach incidents recorded</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    All data processing activities are operating securely
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Affected Data</TableHead>
                      <TableHead>Users Affected</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {report.breachIncidents.map((incident) => (
                      <TableRow key={incident.id}>
                        <TableCell>{incident.date.toLocaleDateString()}</TableCell>
                        <TableCell>{incident.description}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {incident.affectedData.map((data) => (
                              <Badge key={data} variant="outline" className="text-xs">
                                {data}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>{incident.affectedUsers}</TableCell>
                        <TableCell>
                          <Badge className={incident.resolved ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                            {incident.resolved ? 'Resolved' : 'Active'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Data Request Form Component
interface DataRequestFormProps {
  onSubmit: (type: 'access' | 'rectification' | 'erasure' | 'portability', description: string) => void;
}

const DataRequestForm: React.FC<DataRequestFormProps> = ({ onSubmit }) => {
  const [requestType, setRequestType] = useState<'access' | 'rectification' | 'erasure' | 'portability'>('access');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(requestType, description);
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="requestType">Request Type</Label>
        <Select value={requestType} onValueChange={(value: any) => setRequestType(value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="access">Right of Access</SelectItem>
            <SelectItem value="rectification">Right to Rectification</SelectItem>
            <SelectItem value="erasure">Right to Erasure</SelectItem>
            <SelectItem value="portability">Right to Data Portability</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Please describe your request in detail..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit">
          Submit Request
        </Button>
      </div>
    </form>
  );
};

export default GDPRComplianceDashboard;