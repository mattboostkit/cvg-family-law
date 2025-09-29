'use client';

import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Minimize2, Phone, AlertTriangle } from 'lucide-react';
import { ChatWindow } from './ChatWindow';
import { ChatWebSocketManager, WebSocketEvents } from '@/lib/websocket';
import { CrisisLevel } from '@/types/chat';

interface ChatWidgetProps {
  isEmbedded?: boolean;
  defaultOpen?: boolean;
  position?: 'bottom-right' | 'bottom-left';
  theme?: 'light' | 'dark';
}

export function ChatWidget({
  isEmbedded = false,
  defaultOpen = false,
  position = 'bottom-right',
  theme = 'light'
}: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [crisisLevel, setCrisisLevel] = useState<CrisisLevel>('low');
  const [showEmergency, setShowEmergency] = useState(false);
  const [wsManager, setWsManager] = useState<ChatWebSocketManager | null>(null);

  // Emergency phone number - should be configurable
  const emergencyPhone = '999';

  useEffect(() => {
    // Initialize WebSocket connection
    const wsConfig = {
      url: `ws://localhost:3001/api/chat/websocket`,
      reconnectInterval: 3000,
      maxReconnectAttempts: 10,
      heartbeatInterval: 30000,
      encryptionEnabled: true
    };

    const wsEvents: WebSocketEvents = {
      onMessage: (message) => {
        console.log('Received message:', message);
        // Handle incoming messages
        if (message.crisisLevel === 'critical' || message.crisisLevel === 'high') {
          setCrisisLevel(message.crisisLevel);
          setShowEmergency(true);
        }
      },
      onTyping: (indicator) => {
        console.log('User typing:', indicator);
      },
      onPresence: (userId, isOnline) => {
        console.log('User presence:', userId, isOnline);
      },
      onError: (error) => {
        console.error('Chat error:', error);
        setIsConnected(false);
      },
      onConnect: () => {
        console.log('Chat connected');
        setIsConnected(true);
      },
      onDisconnect: () => {
        console.log('Chat disconnected');
        setIsConnected(false);
      },
      onCrisisEscalation: (level, reason) => {
        console.log('Crisis escalation:', level, reason);
        setCrisisLevel(level);
        setShowEmergency(true);
      }
    };

    const manager = new ChatWebSocketManager(wsConfig, wsEvents);
    setWsManager(manager);

    // Connect to WebSocket
    manager.connect();

    return () => {
      manager.disconnect();
    };
  }, []);

  const handleToggleChat = () => {
    if (isEmbedded) return;
    setIsOpen(!isOpen);
    setIsMinimized(false);
    if (!isOpen) {
      setShowEmergency(false);
    }
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleEmergencyCall = () => {
    window.location.href = `tel:${emergencyPhone}`;
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsMinimized(false);
    setShowEmergency(false);
  };

  const getButtonColor = () => {
    if (!isConnected) return 'bg-gray-500';
    switch (crisisLevel) {
      case 'critical':
        return 'bg-red-600 hover:bg-red-700 animate-pulse';
      case 'high':
        return 'bg-orange-500 hover:bg-orange-600';
      case 'medium':
        return 'bg-yellow-500 hover:bg-yellow-600';
      default:
        return 'bg-blue-600 hover:bg-blue-700';
    }
  };

  const getButtonIcon = () => {
    if (crisisLevel === 'critical') return <AlertTriangle className="w-6 h-6" />;
    return <MessageCircle className="w-6 h-6" />;
  };

  if (isEmbedded) {
    return (
      <div className="w-full h-full">
        <ChatWindow
          wsManager={wsManager}
          isConnected={isConnected}
          crisisLevel={crisisLevel}
          onEmergencyCall={handleEmergencyCall}
          theme={theme}
        />
      </div>
    );
  }

  return (
    <>
      {/* Floating Chat Button */}
      <div
        className={`fixed ${position === 'bottom-right' ? 'bottom-4 right-4' : 'bottom-4 left-4'} z-50`}
      >
        {!isOpen ? (
          <button
            onClick={handleToggleChat}
            className={`
              ${getButtonColor()}
              text-white p-4 rounded-full shadow-lg
              transition-all duration-300 ease-in-out
              hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-300
              ${crisisLevel === 'critical' ? 'animate-bounce' : ''}
            `}
            aria-label="Open crisis support chat"
          >
            {getButtonIcon()}
          </button>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 bg-blue-600 text-white rounded-t-lg">
              <div className="flex items-center space-x-2">
                <MessageCircle className="w-5 h-5" />
                <div>
                  <h3 className="font-semibold text-sm">
                    Crisis Support Chat
                  </h3>
                  <p className="text-xs opacity-90">
                    {isConnected ? 'Connected' : 'Connecting...'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {/* Emergency Button */}
                {showEmergency && (
                  <button
                    onClick={handleEmergencyCall}
                    className="bg-red-600 hover:bg-red-700 p-2 rounded-full transition-colors"
                    title="Call Emergency Services"
                  >
                    <Phone className="w-4 h-4" />
                  </button>
                )}

                {/* Minimize Button */}
                <button
                  onClick={handleMinimize}
                  className="hover:bg-blue-700 p-2 rounded transition-colors"
                  title="Minimize chat"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>

                {/* Close Button */}
                <button
                  onClick={handleClose}
                  className="hover:bg-blue-700 p-2 rounded transition-colors"
                  title="Close chat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Content */}
            {!isMinimized && (
              <div className="w-80 h-96">
                <ChatWindow
                  wsManager={wsManager}
                  isConnected={isConnected}
                  crisisLevel={crisisLevel}
                  onEmergencyCall={handleEmergencyCall}
                  theme={theme}
                />
              </div>
            )}

            {/* Minimized State */}
            {isMinimized && (
              <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={handleMinimize}
                  className="w-full text-left text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
                >
                  Chat minimized - Click to expand
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Emergency Overlay */}
      {showEmergency && crisisLevel === 'critical' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-2xl max-w-md mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
              <h3 className="text-lg font-bold text-red-600">
                Emergency Alert
              </h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Crisis intervention specialist assistance is required. Please call emergency services immediately.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={handleEmergencyCall}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-semibold flex items-center justify-center space-x-2"
              >
                <Phone className="w-4 h-4" />
                <span>Call {emergencyPhone}</span>
              </button>
              <button
                onClick={() => setShowEmergency(false)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 px-4 rounded-lg font-semibold"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}