'use client';

// Client Portal Dashboard
// Main dashboard with case information, document access, and communication

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  User,
  Case,
  Document,
  Message,
  ImportantDate,
  CaseStatus,
  CasePriority,
  DocumentCategory
} from '@/types/client-portal';

interface DashboardData {
  user: Partial<User>;
  cases: Case[];
  recentDocuments: Document[];
  unreadMessages: Message[];
  upcomingDates: ImportantDate[];
}

export default function ClientDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'cases' | 'documents' | 'messages'>('overview');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const response = await fetch('/api/client-portal/dashboard', {
        credentials: 'include'
      });

      if (response.status === 401) {
        router.push('/client-portal/login');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to load dashboard data');
      }

      const result = await response.json();
      setData(result.data);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: CaseStatus) => {
    switch (status) {
      case CaseStatus.ACTIVE:
        return 'bg-green-100 text-green-800';
      case CaseStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      case CaseStatus.CLOSED:
        return 'bg-gray-100 text-gray-800';
      case CaseStatus.ON_HOLD:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: CasePriority) => {
    switch (priority) {
      case CasePriority.URGENT:
        return 'text-red-600';
      case CasePriority.HIGH:
        return 'text-orange-600';
      case CasePriority.MEDIUM:
        return 'text-yellow-600';
      case CasePriority.LOW:
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Unable to load dashboard data</p>
          <button
            onClick={loadDashboardData}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {data.user.firstName}
              </h1>
              <p className="text-gray-600">Client Portal Dashboard</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/client-portal/documents')}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Upload Document
              </button>
              <button
                onClick={() => router.push('/client-portal/login')}
                className="text-gray-600 hover:text-gray-900"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'cases', label: 'My Cases' },
              { id: 'documents', label: 'Documents' },
              { id: 'messages', label: 'Messages' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'overview' | 'cases' | 'documents' | 'messages')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Active Cases</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {data.cases.filter(c => c.status === CaseStatus.ACTIVE).length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Documents</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {data.recentDocuments.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Upcoming Dates</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {data.upcomingDates.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Unread Messages</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {data.unreadMessages.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Cases */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Recent Cases</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {data.cases.slice(0, 3).map((case_) => (
                  <div key={case_.id} className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h4 className="text-sm font-medium text-gray-900">{case_.caseNumber}</h4>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(case_.status)}`}>
                            {case_.status.replace('_', ' ').toUpperCase()}
                          </span>
                          <span className={`text-sm font-medium ${getPriorityColor(case_.priority)}`}>
                            {case_.priority} Priority
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-600">{case_.title}</p>
                        <p className="mt-1 text-xs text-gray-500">
                          Last updated: {formatDate(case_.updatedAt)}
                        </p>
                      </div>
                      <button
                        onClick={() => router.push(`/client-portal/cases/${case_.id}`)}
                        className="ml-4 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                      >
                        View
                      </button>
                    </div>
                  </div>
                ))}
                {data.cases.length === 0 && (
                  <div className="px-6 py-8 text-center text-gray-500">
                    <p>No cases found</p>
                  </div>
                )}
              </div>
            </div>

            {/* Upcoming Important Dates */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Upcoming Important Dates</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {data.upcomingDates.slice(0, 5).map((date) => (
                  <div key={date.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{date.title}</h4>
                        <p className="text-sm text-gray-600">{date.description}</p>
                        <p className="text-xs text-gray-500 capitalize">{date.type.replace('_', ' ')}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{formatDate(date.date)}</p>
                        <p className="text-xs text-gray-500">
                          {Math.ceil((new Date(date.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {data.upcomingDates.length === 0 && (
                  <div className="px-6 py-8 text-center text-gray-500">
                    <p>No upcoming dates</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'cases' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">My Cases</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {data.cases.map((case_) => (
                  <div key={case_.id} className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="text-sm font-medium text-gray-900">{case_.caseNumber}</h4>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(case_.status)}`}>
                            {case_.status.replace('_', ' ').toUpperCase()}
                          </span>
                          <span className={`text-sm font-medium ${getPriorityColor(case_.priority)}`}>
                            {case_.priority} Priority
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{case_.title}</p>
                        <p className="text-xs text-gray-500 mb-2">Assigned to: {case_.assignedLawyer}</p>
                        <p className="text-xs text-gray-500">
                          Last updated: {formatDate(case_.updatedAt)}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => router.push(`/client-portal/cases/${case_.id}`)}
                          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => router.push(`/client-portal/cases/${case_.id}/documents`)}
                          className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
                        >
                          Documents
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {data.cases.length === 0 && (
                  <div className="px-6 py-8 text-center text-gray-500">
                    <p>No cases found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Recent Documents</h3>
              <button
                onClick={() => router.push('/client-portal/documents')}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Upload New Document
              </button>
            </div>

            <div className="bg-white rounded-lg shadow">
              <div className="divide-y divide-gray-200">
                {data.recentDocuments.map((doc) => (
                  <div key={doc.id} className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">{doc.name}</h4>
                            <p className="text-sm text-gray-500 capitalize">{doc.category.replace('_', ' ')}</p>
                            <p className="text-xs text-gray-400">
                              {formatDate(doc.uploadedAt)} • {(doc.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800 text-sm">Download</button>
                        <button className="text-gray-600 hover:text-gray-800 text-sm">Share</button>
                      </div>
                    </div>
                  </div>
                ))}
                {data.recentDocuments.length === 0 && (
                  <div className="px-6 py-8 text-center text-gray-500">
                    <p>No documents found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Recent Messages</h3>

            <div className="bg-white rounded-lg shadow">
              <div className="divide-y divide-gray-200">
                {data.unreadMessages.slice(0, 10).map((message) => (
                  <div key={message.id} className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">{message.subject}</h4>
                            <p className="text-sm text-gray-600 truncate max-w-md">{message.content}</p>
                            <p className="text-xs text-gray-400">
                              {formatDate(message.sentAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <button className="text-blue-600 hover:text-blue-800 text-sm">Read</button>
                    </div>
                  </div>
                ))}
                {data.unreadMessages.length === 0 && (
                  <div className="px-6 py-8 text-center text-gray-500">
                    <p>No unread messages</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}