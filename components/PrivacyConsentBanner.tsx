'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { getAnalyticsTracker } from '@/lib/analytics';
import { PrivacyComplianceData } from '@/types/analytics';

interface PrivacyConsentBannerProps {
  onConsentChange?: (consent: boolean) => void;
}

const PrivacyConsentBanner: React.FC<PrivacyConsentBannerProps> = ({ onConsentChange }) => {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);
  const [consentSettings, setConsentSettings] = useState({
    analytics: false,
    functional: false,
    marketing: false,
    necessary: true // Always true as these are required
  });

  const analytics = getAnalyticsTracker();

  useEffect(() => {
    // Check if user has already given consent
    const existingConsent = localStorage.getItem('privacy_consent');
    if (existingConsent) {
      const consentData = JSON.parse(existingConsent);
      setConsentGiven(consentData.given);
      setConsentSettings(consentData.settings || consentSettings);
      setShowBanner(false);

      if (consentData.given) {
        analytics.setConsent(true, getEnabledPurposes(consentData.settings));
      }
    } else {
      setShowBanner(true);
    }
  }, [analytics]);

  const getEnabledPurposes = (settings: typeof consentSettings): string[] => {
    const purposes: string[] = ['necessary'];
    if (settings.analytics) purposes.push('analytics');
    if (settings.functional) purposes.push('functional');
    if (settings.marketing) purposes.push('marketing');
    return purposes;
  };

  const handleAcceptAll = () => {
    const newSettings = {
      analytics: true,
      functional: true,
      marketing: true,
      necessary: true
    };

    setConsentSettings(newSettings);
    setConsentGiven(true);
    setShowBanner(false);

    const purposes = getEnabledPurposes(newSettings);
    analytics.setConsent(true, purposes);

    // Store consent
    const consentData = {
      given: true,
      settings: newSettings,
      timestamp: new Date(),
      version: '1.0'
    };

    localStorage.setItem('privacy_consent', JSON.stringify(consentData));

    // Send consent to server
    sendConsentToServer(consentData);

    onConsentChange?.(true);
  };

  const handleRejectAll = () => {
    const newSettings = {
      analytics: false,
      functional: false,
      marketing: false,
      necessary: true
    };

    setConsentSettings(newSettings);
    setConsentGiven(false);
    setShowBanner(false);

    analytics.setConsent(false, ['necessary']);

    // Store consent
    const consentData = {
      given: false,
      settings: newSettings,
      timestamp: new Date(),
      version: '1.0'
    };

    localStorage.setItem('privacy_consent', JSON.stringify(consentData));
    sendConsentToServer(consentData);

    onConsentChange?.(false);
  };

  const handleCustomSettings = () => {
    const hasOptionalConsent = consentSettings.analytics || consentSettings.functional || consentSettings.marketing;
    const newConsentGiven = hasOptionalConsent;

    setConsentGiven(newConsentGiven);
    setShowBanner(false);

    const purposes = getEnabledPurposes(consentSettings);
    analytics.setConsent(newConsentGiven, purposes);

    // Store consent
    const consentData = {
      given: newConsentGiven,
      settings: consentSettings,
      timestamp: new Date(),
      version: '1.0'
    };

    localStorage.setItem('privacy_consent', JSON.stringify(consentData));
    sendConsentToServer(consentData);

    onConsentChange?.(newConsentGiven);
  };

  const sendConsentToServer = async (consentData: any) => {
    try {
      await fetch('/api/analytics/events', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: getUserId(),
          consentData
        }),
      });
    } catch (error) {
      console.warn('Failed to send consent to server:', error);
    }
  };

  const getUserId = (): string => {
    // Generate or retrieve user ID for consent tracking
    let userId = localStorage.getItem('user_id');
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('user_id', userId);
    }
    return userId;
  };

  const openPrivacySettings = () => {
    setShowSettings(true);
  };

  if (!showBanner) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={openPrivacySettings}
          className="bg-white shadow-lg border-2"
        >
          <span className="mr-2">🔒</span>
          Privacy Settings
        </Button>

        {/* Privacy Settings Dialog */}
        <Dialog open={showSettings} onOpenChange={setShowSettings}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Privacy Settings</DialogTitle>
              <DialogDescription>
                Manage your privacy preferences and cookie settings
              </DialogDescription>
            </DialogHeader>
            <PrivacySettings
              settings={consentSettings}
              onSettingsChange={setConsentSettings}
              onSave={handleCustomSettings}
              onClose={() => setShowSettings(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <>
      {/* Consent Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white border-t shadow-lg">
        <Card className="max-w-4xl mx-auto">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🍪</span>
              <div>
                <CardTitle className="text-lg">Your Privacy Matters</CardTitle>
                <CardDescription>
                  We use cookies and similar technologies to enhance your experience and provide better legal services.
                  Your privacy is protected under GDPR regulations.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-2">
                  Choose your privacy preferences:
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Necessary</Badge>
                  <Badge variant="outline">Analytics</Badge>
                  <Badge variant="outline">Functional</Badge>
                  <Badge variant="outline">Marketing</Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleRejectAll}>
                  Reject All
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      Customise
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Privacy Preferences</DialogTitle>
                      <DialogDescription>
                        Choose which cookies and tracking technologies you want to allow
                      </DialogDescription>
                    </DialogHeader>
                    <PrivacySettings
                      settings={consentSettings}
                      onSettingsChange={setConsentSettings}
                      onSave={handleCustomSettings}
                      onClose={() => {}}
                    />
                  </DialogContent>
                </Dialog>
                <Button onClick={handleAcceptAll}>
                  Accept All
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Privacy Settings Dialog for Customise Button */}
      <Dialog>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Privacy Preferences</DialogTitle>
            <DialogDescription>
              Choose which cookies and tracking technologies you want to allow
            </DialogDescription>
          </DialogHeader>
          <PrivacySettings
            settings={consentSettings}
            onSettingsChange={setConsentSettings}
            onSave={handleCustomSettings}
            onClose={() => {}}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

// Privacy Settings Component
interface PrivacySettingsProps {
  settings: {
    analytics: boolean;
    functional: boolean;
    marketing: boolean;
    necessary: boolean;
  };
  onSettingsChange: (settings: any) => void;
  onSave: () => void;
  onClose: () => void;
}

const PrivacySettings: React.FC<PrivacySettingsProps> = ({
  settings,
  onSettingsChange,
  onSave,
  onClose
}) => {
  const updateSetting = (key: keyof typeof settings, value: boolean) => {
    onSettingsChange({
      ...settings,
      [key]: value
    });
  };

  return (
    <div className="space-y-6">
      {/* Necessary Cookies */}
      <div className="border rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Checkbox
            checked={settings.necessary}
            disabled
            className="mt-1"
          />
          <div className="flex-1">
            <h3 className="font-medium">Necessary Cookies</h3>
            <p className="text-sm text-muted-foreground mt-1">
              These cookies are essential for the website to function properly. They enable core functionality
              such as page navigation, access to secure areas, and basic security features. Without these cookies,
              the website cannot function correctly.
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="secondary">Security</Badge>
              <Badge variant="secondary">Authentication</Badge>
              <Badge variant="secondary">Form Functionality</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Cookies */}
      <div className="border rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Checkbox
            checked={settings.analytics}
            onCheckedChange={(checked) => updateSetting('analytics', !!checked)}
            className="mt-1"
          />
          <div className="flex-1">
            <h3 className="font-medium">Analytics Cookies</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Help us understand how visitors interact with our website by collecting and reporting information
              anonymously. This helps us improve our services and identify areas where users need more support.
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="outline">Google Analytics</Badge>
              <Badge variant="outline">User Behavior</Badge>
              <Badge variant="outline">Performance Monitoring</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Functional Cookies */}
      <div className="border rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Checkbox
            checked={settings.functional}
            onCheckedChange={(checked) => updateSetting('functional', !!checked)}
            className="mt-1"
          />
          <div className="flex-1">
            <h3 className="font-medium">Functional Cookies</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Enable enhanced functionality and personalization, such as remembering your language preferences,
              chat settings, and form data to provide a more seamless experience.
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="outline">Language Preferences</Badge>
              <Badge variant="outline">Chat Settings</Badge>
              <Badge variant="outline">Form Memory</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Marketing Cookies */}
      <div className="border rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Checkbox
            checked={settings.marketing}
            onCheckedChange={(checked) => updateSetting('marketing', !!checked)}
            className="mt-1"
          />
          <div className="flex-1">
            <h3 className="font-medium">Marketing Cookies</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Used to deliver relevant advertisements and track the effectiveness of our marketing campaigns.
              These cookies may share information with advertising partners to show you more relevant content.
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="outline">Ad Targeting</Badge>
              <Badge variant="outline">Campaign Tracking</Badge>
              <Badge variant="outline">Social Media</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* GDPR Information */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Your Rights Under GDPR</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Right to access your personal data</li>
          <li>• Right to rectification of inaccurate data</li>
          <li>• Right to erasure of your personal data</li>
          <li>• Right to data portability</li>
          <li>• Right to object to processing</li>
          <li>• Right to withdraw consent at any time</li>
        </ul>
        <p className="text-xs text-blue-700 mt-2">
          For more information about how we process your data, please read our{' '}
          <a href="/privacy" className="underline hover:no-underline">Privacy Policy</a>.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={onSave}>
          Save Preferences
        </Button>
      </div>
    </div>
  );
};

export default PrivacyConsentBanner;