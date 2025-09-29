'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  MessageSquare,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  Phone,
  UserPlus,
  Filter,
  Search,
  Eye,
  ArrowRight
} from 'lucide-react';
import { ChatSession, Specialist, CrisisLevel } from '@/types/chat';

interface CrisisInterventionPanelProps {
  specialistId: string;
  specialistName: string;
  theme?: 'light' | 'dark';
}

interface ActiveSession extends ChatSession {
  unreadCount: number;
  lastMessage?: string;
  userName?: string;
}

export function CrisisInterventionPanel({
  specialistId,
  specialistName,
  theme = 'light'
}: CrisisInterventionPanelProps) {
  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>([]);
  const [specialist, setSpecialist] = useState<Specialist | null>(null);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [filter, setFilter] = useState<CrisisLevel | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isOnline, setIsOnline] = useState(true);

  // Mock data for demo purposes
  useEffect(() => {
    const mockSpecialist: Specialist = {
      id: specialistId,
      name: specialistName,
      email: `${specialistName.toLowerCase().replace(' ', '.')}@crisis-support.org`,
      specialities: ['domestic_abuse', 'trauma', 'crisis_intervention'],
      isAvailable: true,
      isOnline: true,
      currentChats: 2,
      maxConcurrentChats: 5,
      languages: ['en', 'es'],
      certifications: ['Licensed Clinical Social Worker', 'Trauma-Informed Care'],
      responseTime: 45
    };

    const mockSessions: ActiveSession[] = [
      {
        id: 'session_1',
        participants: [],
        messages: [],
        status: 'active',
        crisisLevel: 'high',
        priority: 7,
        createdAt: new Date(Date.now() - 300000), // 5 minutes ago
        updatedAt: new Date(Date.now() - 60000), // 1 minute ago
        isAnonymous: true,
        language: 'en',
        unreadCount: 3,
        lastMessage: 'I need help, I\'m scared',
        userName: 'Anonymous User'
      },
      {
        id: 'session_2',
        participants: [],
        messages: [],
        status: 'active',
        crisisLevel: 'medium',
        priority: 4,
        createdAt: new Date(Date.now() - 900000), // 15 minutes ago
        updatedAt: new Date(Date.now() - 120000), // 2 minutes ago
        isAnonymous: false,
        language: 'en',
        unreadCount: 1,
        lastMessage: 'Thank you for your support',
        userName: 'Sarah M.'
      },
      {
        id: 'session_3',
        participants: [],
        messages: [],
        status: 'emergency',
        crisisLevel: 'critical',
        priority: 10,
        createdAt: new Date(Date.now() - 1800000), // 30 minutes ago
        updatedAt: new Date(Date.now() - 30000), // 30 seconds ago
        isAnonymous: true,
        language: 'en',
        unreadCount: 7,
        lastMessage: 'Please help me now',
        userName: 'Anonymous User'
      }
    ];

    setSpecialist(mockSpecialist);
    setActiveSessions(mockSessions);

    // Simulate real-time updates
    const interval = setInterval(() => {
      setActiveSessions(prev => prev.map(session => ({
        ...session,
        updatedAt: Math.random() > 0.7 ? new Date() : session.updatedAt,
        unreadCount: Math.random() > 0.8 ? session.unreadCount + 1 : session.unreadCount
      })));
    }, 10000);

    return () => clearInterval(interval);
  }, [specialistId, specialistName]);

  const handleJoinSession = (sessionId: string) => {
    setSelectedSession(sessionId);
    // In a real implementation, this would open the chat window
    console.log('Joining session:', sessionId);
  };

  const handleEscalateToEmergency = (sessionId: string) => {
    setActiveSessions(prev => prev.map(session =>
      session.id === sessionId
        ? { ...session, crisisLevel: 'critical' as CrisisLevel, status: 'emergency' }
        : session
    ));

    // In a real implementation, this would trigger emergency services
    alert('Emergency services notification sent!');
  };

  const handleCloseSession = (sessionId: string) => {
    setActiveSessions(prev => prev.filter(session => session.id !== sessionId));
    if (selectedSession === sessionId) {
      setSelectedSession(null);
    }
  };

  const handleToggleAvailability = () => {
    if (specialist) {
      const newStatus = !specialist.isAvailable;
      setSpecialist({ ...specialist, isAvailable: newStatus });
      setIsOnline(newStatus);
    }
  };

  const filteredSessions = activeSessions.filter(session => {
    const matchesFilter = filter === 'all' || session.crisisLevel === filter;
    const matchesSearch = !searchTerm ||
      session.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.lastMessage?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getCrisisLevelColor = (level: CrisisLevel) => {
    switch (level) {
      case 'critical':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'high':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getCrisisLevelIcon = (level: CrisisLevel) => {
    switch (level) {
      case 'critical':
        return <AlertTriangle className="w-4 h-4" />;
      case 'high':
        return <AlertTriangle className="w-4 h-4" />;
      case 'medium':
        return <Clock className="w-4 h-4" />;
      default:
        return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getSessionStats = () => {
    const total = activeSessions.length;
    const critical = activeSessions.filter(s => s.crisisLevel === 'critical').length;
    const high = activeSessions.filter(s => s.crisisLevel === 'high').length;
    const medium = activeSessions.filter(s => s.crisisLevel === 'medium').length;

    return { total, critical, high, medium };
  };

  const stats = getSessionStats();

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900 dark:text-gray-100">
                  {specialistName}
                </h2>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {isOnline ? 'Available' : 'Offline'}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleToggleAvailability}
              className={`p-2 rounded-lg transition-colors ${
                isOnline
                  ? 'bg-green-100 hover:bg-green-200 text-green-700'
                  : 'bg-red-100 hover:bg-red-200 text-red-700'
              }`}
            >
              {isOnline ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
            </button>
          </div>

          {/* Search and Filter */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search sessions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as CrisisLevel | 'all')}
                className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Sessions</option>
                <option value="critical">Critical</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-2 mt-4">
            <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
              <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {stats.total}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Total</div>
            </div>
            <div className="text-center p-2 bg-red-50 dark:bg-red-900/20 rounded">
              <div className="text-lg font-bold text-red-600">{stats.critical}</div>
              <div className="text-xs text-red-500">Critical</div>
            </div>
            <div className="text-center p-2 bg-orange-50 dark:bg-orange-900/20 rounded">
              <div className="text-lg font-bold text-orange-600">{stats.high}</div>
              <div className="text-xs text-orange-500">High</div>
            </div>
            <div className="text-center p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
              <div className="text-lg font-bold text-yellow-600">{stats.medium}</div>
              <div className="text-xs text-yellow-500">Medium</div>
            </div>
          </div>
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto">
          {filteredSessions.map((session) => (
            <div
              key={session.id}
              className={`p-3 border-b border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${
                selectedSession === session.id ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' : ''
              }`}
              onClick={() => handleJoinSession(session.id)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {getCrisisLevelIcon(session.crisisLevel)}
                  <span className="font-medium text-sm text-gray-900 dark:text-gray-100">
                    {session.userName || 'Anonymous'}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  {session.unreadCount > 0 && (
                    <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                      {session.unreadCount}
                    </span>
                  )}
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {session.updatedAt.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>

              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getCrisisLevelColor(session.crisisLevel)}`}>
                {session.crisisLevel.toUpperCase()}
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">
                {session.lastMessage}
              </p>

              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEscalateToEmergency(session.id);
                    }}
                    className="text-red-600 hover:text-red-700 p-1"
                    title="Escalate to Emergency"
                  >
                    <Phone className="w-4 h-4" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCloseSession(session.id);
                    }}
                    className="text-gray-600 hover:text-gray-700 p-1"
                    title="Close Session"
                  >
                    <CheckCircle className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleJoinSession(session.id);
                  }}
                  className="text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                >
                  <span className="text-xs">Join</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedSession ? (
          <div className="flex-1 p-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow h-full flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Chat Session Active
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Chat interface would be displayed here
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Users className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                Select a Session
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Choose a chat session from the sidebar to start helping
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}