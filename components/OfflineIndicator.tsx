'use client';

/**
 * Network Status Indicator Component
 * Shows online/offline status and provides user feedback for CVG Family Law PWA
 */

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Wifi, WifiOff, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NetworkStatus {
  isOnline: boolean;
  isSlowConnection: boolean;
  connectionType: string;
  effectiveType: string;
  downlink: number;
  rtt: number;
}

// Extend navigator interface for Network Information API
declare global {
  interface Navigator {
    connection?: {
      effectiveType: string;
      type: string;
      downlink: number;
      rtt: number;
      addEventListener(type: string, listener: () => void): void;
      removeEventListener(type: string, listener: () => void): void;
    };
  }
}

export default function OfflineIndicator() {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isOnline: navigator.onLine,
    isSlowConnection: false,
    connectionType: 'unknown',
    effectiveType: 'unknown',
    downlink: 0,
    rtt: 0,
  });

  const [showDetails, setShowDetails] = useState(false);
  const [lastOnline, setLastOnline] = useState<Date | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    // Update last online time when coming back online
    if (networkStatus.isOnline && !lastOnline) {
      setLastOnline(new Date());
    }
  }, [networkStatus.isOnline, lastOnline]);

  useEffect(() => {
    // Network status change handler
    const handleOnline = () => {
      console.log('[Network] Connection restored');
      setNetworkStatus(prev => ({ ...prev, isOnline: true }));
      setRetryCount(0);
    };

    const handleOffline = () => {
      console.log('[Network] Connection lost');
      setNetworkStatus(prev => ({ ...prev, isOnline: false }));
    };

    // Connection change handler for detailed network information
    const handleConnectionChange = () => {
      const connection = navigator.connection;

      if (connection) {
        const newStatus: NetworkStatus = {
          isOnline: navigator.onLine,
          isSlowConnection: connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g',
          connectionType: connection.type || 'unknown',
          effectiveType: connection.effectiveType || 'unknown',
          downlink: connection.downlink || 0,
          rtt: connection.rtt || 0,
        };

        setNetworkStatus(newStatus);
      } else {
        // Fallback for browsers without Network Information API
        setNetworkStatus(prev => ({
          ...prev,
          isOnline: navigator.onLine,
          isSlowConnection: !navigator.onLine,
        }));
      }
    };

    // Initial connection info
    handleConnectionChange();

    // Event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Listen for connection changes if supported
    if (navigator.connection) {
      navigator.connection.addEventListener('change', handleConnectionChange);
    }

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);

      if (navigator.connection) {
        navigator.connection.removeEventListener('change', handleConnectionChange);
      }
    };
  }, []);

  const handleRetry = async () => {
    setRetryCount(prev => prev + 1);

    try {
      // Try to fetch a small resource to test connectivity
      const response = await fetch('/favicon.ico', {
        method: 'HEAD',
        cache: 'no-cache',
      });

      if (response.ok) {
        console.log('[Network] Manual retry successful');
        setNetworkStatus(prev => ({ ...prev, isOnline: true }));
      }
    } catch (error) {
      console.log('[Network] Manual retry failed');
      setNetworkStatus(prev => ({ ...prev, isOnline: false }));
    }
  };

  const getStatusColor = () => {
    if (!networkStatus.isOnline) return 'destructive';
    if (networkStatus.isSlowConnection) return 'secondary';
    return 'default';
  };

  const getStatusIcon = () => {
    if (!networkStatus.isOnline) return <WifiOff className="w-3 h-3" />;
    if (networkStatus.isSlowConnection) return <AlertTriangle className="w-3 h-3" />;
    return <CheckCircle className="w-3 h-3" />;
  };

  const getStatusText = () => {
    if (!networkStatus.isOnline) return 'Offline';
    if (networkStatus.isSlowConnection) return 'Slow connection';
    return 'Online';
  };

  const formatConnectionSpeed = () => {
    if (!networkStatus.isOnline) return 'No connection';
    if (networkStatus.downlink > 0) {
      return `${networkStatus.downlink} Mbps`;
    }
    return 'Unknown speed';
  };

  // Don't show anything if online and connection is good
  if (networkStatus.isOnline && !networkStatus.isSlowConnection) {
    return null;
  }

  return (
    <>
      {/* Compact indicator */}
      <div className="fixed top-4 right-4 z-40">
        <Badge
          variant={getStatusColor()}
          className={cn(
            "cursor-pointer transition-all duration-200",
            networkStatus.isOnline ? "bg-green-100 text-green-800 hover:bg-green-200" : "bg-red-100 text-red-800 hover:bg-red-200",
            networkStatus.isSlowConnection && "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
          )}
          onClick={() => setShowDetails(!showDetails)}
        >
          {getStatusIcon()}
          <span className="ml-1 text-xs font-medium">{getStatusText()}</span>
        </Badge>
      </div>

      {/* Detailed status panel */}
      {showDetails && (
        <div className="fixed top-16 right-4 z-50 w-80">
          <Card className="shadow-lg border-2">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm">Network Status</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDetails(false)}
                    className="h-6 w-6 p-0"
                  >
                    ×
                  </Button>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <Badge variant={getStatusColor()} className="text-xs">
                      {getStatusText()}
                    </Badge>
                  </div>

                  {networkStatus.isOnline && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Connection:</span>
                        <span className="capitalize">{networkStatus.connectionType}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-600">Speed:</span>
                        <span>{formatConnectionSpeed()}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-600">Latency:</span>
                        <span>{networkStatus.rtt > 0 ? `${networkStatus.rtt}ms` : 'Unknown'}</span>
                      </div>
                    </>
                  )}
                </div>

                {!networkStatus.isOnline && (
                  <Alert className="mt-3">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      Emergency features are available offline. Your data will sync when connection is restored.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex gap-2 pt-2">
                  {!networkStatus.isOnline && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRetry}
                      className="flex-1 text-xs"
                    >
                      <RefreshCw className="w-3 h-3 mr-1" />
                      Retry ({retryCount})
                    </Button>
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDetails(false)}
                    className="flex-1 text-xs"
                  >
                    Close
                  </Button>
                </div>

                {lastOnline && (
                  <div className="text-xs text-gray-500 pt-2 border-t">
                    Last online: {lastOnline.toLocaleTimeString()}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}

// Hook for using network status in other components
export function useNetworkStatus() {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isOnline: navigator.onLine,
    isSlowConnection: false,
    connectionType: 'unknown',
    effectiveType: 'unknown',
    downlink: 0,
    rtt: 0,
  });

  useEffect(() => {
    const handleOnline = () => {
      setNetworkStatus(prev => ({ ...prev, isOnline: true }));
    };

    const handleOffline = () => {
      setNetworkStatus(prev => ({ ...prev, isOnline: false }));
    };

    const handleConnectionChange = () => {
      const connection = navigator.connection;

      if (connection) {
        setNetworkStatus({
          isOnline: navigator.onLine,
          isSlowConnection: connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g',
          connectionType: connection.type || 'unknown',
          effectiveType: connection.effectiveType || 'unknown',
          downlink: connection.downlink || 0,
          rtt: connection.rtt || 0,
        });
      } else {
        setNetworkStatus(prev => ({
          ...prev,
          isOnline: navigator.onLine,
          isSlowConnection: !navigator.onLine,
        }));
      }
    };

    // Initial setup
    handleConnectionChange();

    // Event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    if (navigator.connection) {
      navigator.connection.addEventListener('change', handleConnectionChange);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);

      if (navigator.connection) {
        navigator.connection.removeEventListener('change', handleConnectionChange);
      }
    };
  }, []);

  return networkStatus;
}

// Utility function to check if critical features should work offline
export function canUseOfflineFeatures(): boolean {
  // Always allow offline features for this emergency service
  return true;
}

// Utility function to get offline storage availability
export function isOfflineStorageAvailable(): boolean {
  try {
    return 'serviceWorker' in navigator && 'caches' in window && 'indexedDB' in window;
  } catch {
    return false;
  }
}