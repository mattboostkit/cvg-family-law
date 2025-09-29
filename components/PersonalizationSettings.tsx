// Personalization Settings Component
// User controls for personalization preferences and privacy settings

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  PersonalizationPreferences,
  PersonalizationContext,
  PersonalizationStorage,
  UserJourney
} from '@/types/personalization';
import { PersonalizationEngine } from '@/lib/personalization';
import {
  Settings,
  Shield,
  Eye,
  EyeOff,
  Trash2,
  Download,
  Upload,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Info,
  Bell,
  BellOff
} from 'lucide-react';

interface PersonalizationSettingsProps {
  context?: PersonalizationContext;
  onContextChange?: (context: PersonalizationContext) => void;
  className?: string;
}

export function PersonalizationSettings({
  context,
  onContextChange,
  className
}: PersonalizationSettingsProps) {
  const [preferences, setPreferences] = useState<PersonalizationPreferences | null>(null);
  const [journey, setJourney] = useState<UserJourney | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [exportData, setExportData] = useState<Partial<PersonalizationStorage> | null>(null);
  const [showExportDialog, setShowExportDialog] = useState(false);

  useEffect(() => {
    loadSettings();
  }, [context]);

  const loadSettings = () => {
    const engine = PersonalizationEngine.getInstance();
    const currentContext = context || engine.getContext();

    if (currentContext) {
      setPreferences(currentContext.preferences);
      setJourney(currentContext.journey);
    }
  };

  const updatePreferences = async (updates: Partial<PersonalizationPreferences>) => {
    if (!preferences) return;

    setIsLoading(true);
    setSaveStatus('saving');

    try {
      const newPreferences = { ...preferences, ...updates };
      setPreferences(newPreferences);

      const engine = PersonalizationEngine.getInstance();
      engine.updatePreferences(newPreferences);

      if (context) {
        const updatedContext = {
          ...context,
          preferences: newPreferences,
          lastUpdated: new Date()
        };
        onContextChange?.(updatedContext);
      }

      setSaveStatus('saved');

      // Reset status after 2 seconds
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Failed to update preferences:', error);
      setSaveStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleContentPreferenceChange = (category: keyof PersonalizationPreferences['contentPreferences'], value: boolean) => {
    if (!preferences) return;

    updatePreferences({
      contentPreferences: {
        ...preferences.contentPreferences,
        [category]: value
      }
    });
  };

  const handleNotificationPreferenceChange = (category: keyof PersonalizationPreferences['notificationPreferences'], value: boolean) => {
    if (!preferences) return;

    updatePreferences({
      notificationPreferences: {
        ...preferences.notificationPreferences,
        [category]: value
      }
    });
  };

  const handlePrivacySettingChange = (setting: keyof PersonalizationPreferences['privacySettings'], value: boolean) => {
    if (!preferences) return;

    updatePreferences({
      privacySettings: {
        ...preferences.privacySettings,
        [setting]: value
      }
    });
  };

  const resetPersonalization = () => {
    if (confirm('Are you sure you want to reset all personalization data? This action cannot be undone.')) {
      const engine = PersonalizationEngine.getInstance();
      engine.resetPersonalization();

      // Reset local state
      setPreferences(null);
      setJourney(null);
      onContextChange?.(undefined as any);
    }
  };

  const exportPersonalizationData = () => {
    const engine = PersonalizationEngine.getInstance();
    const data = engine.exportPersonalizationData();
    setExportData(data);
    setShowExportDialog(true);
  };

  const downloadData = () => {
    if (!exportData) return;

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'personalization-data.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getProgressSummary = () => {
    if (!journey) return null;

    const completedCategories = Object.entries(journey.progress)
      .filter(([_, progress]) => progress === 100).length;
    const totalCategories = Object.keys(journey.progress).length;

    return {
      completed: completedCategories,
      total: totalCategories,
      percentage: Math.round((completedCategories / totalCategories) * 100)
    };
  };

  const progressSummary = getProgressSummary();

  if (!preferences) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Personalization Data</h3>
        <p className="text-gray-600">
          Complete the situation assessment to access personalization settings.
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Personalization Settings
              </CardTitle>
              <CardDescription>
                Control your content preferences and privacy settings
              </CardDescription>
            </div>
            {saveStatus === 'saved' && (
              <Badge variant="outline" className="text-green-600 border-green-600">
                <CheckCircle className="w-3 h-3 mr-1" />
                Saved
              </Badge>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Journey Progress Summary */}
      {progressSummary && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Journey Completion</span>
              <span className="text-sm font-medium">{progressSummary.percentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressSummary.percentage}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-600">
              {progressSummary.completed} of {progressSummary.total} categories completed
            </p>
          </CardContent>
        </Card>
      )}

      {/* Content Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Content Preferences
          </CardTitle>
          <CardDescription>
            Choose which types of content you want to see
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="emergency-info" className="text-sm font-medium">
                Emergency Information
              </Label>
              <p className="text-xs text-gray-600">
                Show immediate safety and crisis resources
              </p>
            </div>
            <Switch
              id="emergency-info"
              checked={preferences.contentPreferences.showEmergencyInfo}
              onCheckedChange={(value: boolean) => handleContentPreferenceChange('showEmergencyInfo', value)}
              disabled={isLoading}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="planning-resources" className="text-sm font-medium">
                Safety Planning Resources
              </Label>
              <p className="text-xs text-gray-600">
                Display preparation and safety planning content
              </p>
            </div>
            <Switch
              id="planning-resources"
              checked={preferences.contentPreferences.showPlanningResources}
              onCheckedChange={(value: boolean) => handleContentPreferenceChange('showPlanningResources', value)}
              disabled={isLoading}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="legal-guidance" className="text-sm font-medium">
                Legal Guidance
              </Label>
              <p className="text-xs text-gray-600">
                Show legal rights and court process information
              </p>
            </div>
            <Switch
              id="legal-guidance"
              checked={preferences.contentPreferences.showLegalGuidance}
              onCheckedChange={(value: boolean) => handleContentPreferenceChange('showLegalGuidance', value)}
              disabled={isLoading}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="children-resources" className="text-sm font-medium">
                Children & Family Resources
              </Label>
              <p className="text-xs text-gray-600">
                Display content related to child protection and custody
              </p>
            </div>
            <Switch
              id="children-resources"
              checked={preferences.contentPreferences.showChildrenResources}
              onCheckedChange={(value: boolean) => handleContentPreferenceChange('showChildrenResources', value)}
              disabled={isLoading}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="financial-info" className="text-sm font-medium">
                Financial Information
              </Label>
              <p className="text-xs text-gray-600">
                Show financial rights and support resources
              </p>
            </div>
            <Switch
              id="financial-info"
              checked={preferences.contentPreferences.showFinancialInfo}
              onCheckedChange={(value: boolean) => handleContentPreferenceChange('showFinancialInfo', value)}
              disabled={isLoading}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notification Preferences
          </CardTitle>
          <CardDescription>
            Manage safety reminders and resource recommendations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="emergency-alerts" className="text-sm font-medium">
                Emergency Alerts
              </Label>
              <p className="text-xs text-gray-600">
                Critical safety notifications and immediate support
              </p>
            </div>
            <Switch
              id="emergency-alerts"
              checked={preferences.notificationPreferences.emergencyAlerts}
              onCheckedChange={(value: boolean) => handleNotificationPreferenceChange('emergencyAlerts', value)}
              disabled={isLoading}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="safety-reminders" className="text-sm font-medium">
                Safety Reminders
              </Label>
              <p className="text-xs text-gray-600">
                Regular safety planning and resource reminders
              </p>
            </div>
            <Switch
              id="safety-reminders"
              checked={preferences.notificationPreferences.safetyReminders}
              onCheckedChange={(value: boolean) => handleNotificationPreferenceChange('safetyReminders', value)}
              disabled={isLoading}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="legal-updates" className="text-sm font-medium">
                Legal Updates
              </Label>
              <p className="text-xs text-gray-600">
                Court process updates and legal right changes
              </p>
            </div>
            <Switch
              id="legal-updates"
              checked={preferences.notificationPreferences.legalUpdates}
              onCheckedChange={(value: boolean) => handleNotificationPreferenceChange('legalUpdates', value)}
              disabled={isLoading}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="resource-recommendations" className="text-sm font-medium">
                Resource Recommendations
              </Label>
              <p className="text-xs text-gray-600">
                Personalised content and resource suggestions
              </p>
            </div>
            <Switch
              id="resource-recommendations"
              checked={preferences.notificationPreferences.resourceRecommendations}
              onCheckedChange={(value: boolean) => handleNotificationPreferenceChange('resourceRecommendations', value)}
              disabled={isLoading}
            />
          </div>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Privacy Settings
          </CardTitle>
          <CardDescription>
            Control how your personalization data is stored and used
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="local-storage" className="text-sm font-medium">
                Store Preferences Locally
              </Label>
              <p className="text-xs text-gray-600">
                Keep personalization data in your browser only
              </p>
            </div>
            <Switch
              id="local-storage"
              checked={preferences.privacySettings.storeLocally}
              onCheckedChange={(value: boolean) => handlePrivacySettingChange('storeLocally', value)}
              disabled={isLoading}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="track-progress" className="text-sm font-medium">
                Track Progress
              </Label>
              <p className="text-xs text-gray-600">
                Monitor your journey through different support areas
              </p>
            </div>
            <Switch
              id="track-progress"
              checked={preferences.privacySettings.trackProgress}
              onCheckedChange={(value: boolean) => handlePrivacySettingChange('trackProgress', value)}
              disabled={isLoading}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="allow-recommendations" className="text-sm font-medium">
                Allow Recommendations
              </Label>
              <p className="text-xs text-gray-600">
                Receive personalised content recommendations
              </p>
            </div>
            <Switch
              id="allow-recommendations"
              checked={preferences.privacySettings.allowRecommendations}
              onCheckedChange={(value: boolean) => handlePrivacySettingChange('allowRecommendations', value)}
              disabled={isLoading}
            />
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Data Management
          </CardTitle>
          <CardDescription>
            Export, import, or reset your personalization data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                onClick={exportPersonalizationData}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export Data
              </Button>

              <Button
                variant="outline"
                onClick={resetPersonalization}
                className="flex items-center gap-2 text-red-600 hover:text-red-700"
                disabled={isLoading}
              >
                <Trash2 className="w-4 h-4" />
                Reset All Data
              </Button>
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription className="text-xs">
                <strong>Privacy Note:</strong> All personalization data is stored locally in your browser
                and is never shared with external servers. Your privacy and safety are our top priority.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* GDPR Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Your Rights (GDPR)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 text-sm">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Right to Access</p>
                <p className="text-gray-600">You can export and view all your personalization data</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Right to Erasure</p>
                <p className="text-gray-600">Reset all personalization data at any time</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Right to Object</p>
                <p className="text-gray-600">Disable any personalization features you don't want</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Data Portability</p>
                <p className="text-gray-600">Export your data in a structured, machine-readable format</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export Dialog */}
      {showExportDialog && exportData && (
        <Card className="border-2 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5" />
              Export Personalization Data
            </CardTitle>
            <CardDescription>
              Your personalization data is ready for download
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Data Summary</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>• Preferences and settings</p>
                <p>• Journey progress tracking</p>
                <p>• Assessment history</p>
                <p>• Content engagement data</p>
              </div>
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription className="text-xs">
                This data contains only your personalization preferences and journey progress.
                No personal identifying information is included.
              </AlertDescription>
            </Alert>

            <div className="flex gap-3">
              <Button onClick={downloadData} className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Download JSON
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowExportDialog(false)}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-80">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
                <div>
                  <p className="font-medium">Saving Preferences</p>
                  <p className="text-sm text-gray-600">Please wait...</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}