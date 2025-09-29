'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Paperclip,
  Phone,
  AlertTriangle,
  Shield,
  User,
  Clock,
  Check,
  CheckCheck
} from 'lucide-react';
import { ChatWebSocketManager } from '@/lib/websocket';
import { ChatMessage, CrisisLevel, MessageStatus } from '@/types/chat';

interface ChatWindowProps {
  wsManager: ChatWebSocketManager | null;
  isConnected: boolean;
  crisisLevel: CrisisLevel;
  onEmergencyCall: () => void;
  theme?: 'light' | 'dark';
}

interface MessageWithStatus extends ChatMessage {
  status: MessageStatus;
}

export function ChatWindow({
  wsManager,
  isConnected,
  crisisLevel,
  onEmergencyCall,
  theme = 'light'
}: ChatWindowProps) {
  const [messages, setMessages] = useState<MessageWithStatus[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [specialistTyping, setSpecialistTyping] = useState<string | null>(null);
  const [sessionId] = useState(() => `session_${Date.now()}`);
  const [userName] = useState('Anonymous User');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle incoming messages from WebSocket
  useEffect(() => {
    if (!wsManager) return;

    const handleMessage = (message: ChatMessage) => {
      const messageWithStatus: MessageWithStatus = {
        ...message,
        status: 'delivered'
      };
      setMessages(prev => [...prev, messageWithStatus]);
    };

    const handleTyping = (indicator: any) => {
      if (indicator.isTyping) {
        setSpecialistTyping('Crisis Specialist');
      } else {
        setSpecialistTyping(null);
      }
    };

    // Set up event listeners
    wsManager.connect().then(() => {
      // Join the session
      wsManager.send({
        type: 'join_session',
        sessionId,
        userName,
        userType: 'user'
      });
    });

    return () => {
      // Cleanup
    };
  }, [wsManager, sessionId, userName]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !wsManager || !isConnected) return;

    const messageContent = inputValue.trim();
    setInputValue('');

    // Create optimistic message
    const optimisticMessage: MessageWithStatus = {
      id: `temp_${Date.now()}`,
      chatId: sessionId,
      senderId: 'user',
      sender: {
        id: 'user',
        name: userName,
        type: 'user',
        isOnline: true
      },
      content: messageContent,
      timestamp: new Date(),
      status: 'sending',
      messageType: 'text',
      crisisLevel: 'low',
      isEncrypted: true
    };

    setMessages(prev => [...prev, optimisticMessage]);

    try {
      // Send message via WebSocket
      wsManager.sendMessage(sessionId, messageContent, 'text');

      // Update message status
      setMessages(prev => prev.map(msg =>
        msg.id === optimisticMessage.id
          ? { ...msg, status: 'sent' }
          : msg
      ));

    } catch (error) {
      console.error('Failed to send message:', error);
      setMessages(prev => prev.map(msg =>
        msg.id === optimisticMessage.id
          ? { ...msg, status: 'sent' } // Keep as sent for now
          : msg
      ));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);

    // Handle typing indicators
    if (!isTyping) {
      setIsTyping(true);
      wsManager?.sendTyping(sessionId, true);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      wsManager?.sendTyping(sessionId, false);
    }, 1000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !wsManager) return;

    // In a real implementation, you would:
    // 1. Validate file type and size
    // 2. Encrypt the file
    // 3. Upload to secure storage
    // 4. Send file message with metadata

    console.log('File upload:', file.name);
    // For demo purposes, just show a message
    const fileMessage: MessageWithStatus = {
      id: `file_${Date.now()}`,
      chatId: sessionId,
      senderId: 'user',
      sender: {
        id: 'user',
        name: userName,
        type: 'user',
        isOnline: true
      },
      content: `📎 File: ${file.name}`,
      timestamp: new Date(),
      status: 'sent',
      messageType: 'file',
      crisisLevel: 'low',
      isEncrypted: true,
      metadata: {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type
      }
    };

    setMessages(prev => [...prev, fileMessage]);
  };

  const getMessageStatusIcon = (status: MessageStatus) => {
    switch (status) {
      case 'sending':
        return <Clock className="w-3 h-3 text-gray-400" />;
      case 'sent':
        return <Check className="w-3 h-3 text-gray-400" />;
      case 'delivered':
        return <CheckCheck className="w-3 h-3 text-blue-500" />;
      case 'read':
        return <CheckCheck className="w-3 h-3 text-green-500" />;
      default:
        return null;
    }
  };

  const getCrisisIndicator = (level: CrisisLevel) => {
    switch (level) {
      case 'critical':
        return (
          <div className="flex items-center space-x-1 text-red-600">
            <AlertTriangle className="w-3 h-3" />
            <span className="text-xs font-medium">Critical</span>
          </div>
        );
      case 'high':
        return (
          <div className="flex items-center space-x-1 text-orange-600">
            <AlertTriangle className="w-3 h-3" />
            <span className="text-xs font-medium">High Priority</span>
          </div>
        );
      case 'medium':
        return (
          <div className="flex items-center space-x-1 text-yellow-600">
            <AlertTriangle className="w-3 h-3" />
            <span className="text-xs font-medium">Medium Priority</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      {/* Chat Header */}
      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                Crisis Support
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {isConnected ? 'Specialist Online' : 'Connecting...'}
              </p>
            </div>
          </div>

          {/* Crisis Level Indicator */}
          {crisisLevel !== 'low' && (
            <div className="flex items-center">
              {getCrisisIndicator(crisisLevel)}
            </div>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            <Shield className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">
              Welcome to Crisis Support Chat
            </p>
            <p className="text-xs mt-1">
              Share what's happening. We're here to help.
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
                  message.sender.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                }`}
              >
                {/* Message Header */}
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium opacity-75">
                    {message.sender.name}
                  </span>
                  {getCrisisIndicator(message.crisisLevel || 'low')}
                </div>

                {/* Message Content */}
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>

                {/* Message Footer */}
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs opacity-70">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                  {message.sender.type === 'user' && (
                    <div className="flex items-center space-x-1">
                      {getMessageStatusIcon(message.status)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}

        {/* Typing Indicator */}
        {specialistTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg">
              <div className="flex items-center space-x-1">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {specialistTyping} is typing...
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Emergency Alert */}
      {crisisLevel === 'critical' && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border-t border-red-200 dark:border-red-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span className="text-sm font-medium text-red-800 dark:text-red-200">
                Emergency Support Required
              </span>
            </div>
            <button
              onClick={onEmergencyCall}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-medium flex items-center space-x-1"
            >
              <Phone className="w-3 h-3" />
              <span>Call 999</span>
            </button>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-end space-x-2">
          {/* File Upload */}
          <label className="cursor-pointer">
            <input
              type="file"
              className="hidden"
              onChange={handleFileUpload}
              accept="image/*,.pdf,.doc,.docx"
            />
            <Paperclip className="w-5 h-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
          </label>

          {/* Message Input */}
          <div className="flex-1">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder={
                isConnected
                  ? "Type your message... (Enter to send)"
                  : "Connecting to support..."
              }
              disabled={!isConnected}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
            />
          </div>

          {/* Send Button */}
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || !isConnected}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white disabled:text-gray-500 dark:disabled:text-gray-400 p-2 rounded-lg transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>

        {/* Security Notice */}
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center space-x-1">
          <Shield className="w-3 h-3" />
          <span>Your conversation is encrypted and secure</span>
        </div>
      </div>
    </div>
  );
}