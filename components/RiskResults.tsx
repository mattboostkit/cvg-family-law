'use client';

// Risk Results Component - Displays assessment results and recommendations
import React, { useState } from 'react';
import { AssessmentResult, RiskLevel, Recommendation } from '@/types/assessment';
import { EMERGENCY_CONTACTS } from '@/lib/riskAssessment';

interface RiskResultsProps {
  result: AssessmentResult;
  onRestart?: () => void;
  className?: string;
}

export default function RiskResults({ result, onRestart, className = '' }: RiskResultsProps) {
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [shareWithTrusted, setShareWithTrusted] = useState(false);
  const [trustedEmail, setTrustedEmail] = useState('');

  const getRiskColor = (level: RiskLevel) => {
    switch (level) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'medium':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getRiskIcon = (level: RiskLevel) => {
    switch (level) {
      case 'high':
        return '🚨';
      case 'medium':
        return '⚠️';
      case 'low':
        return '✅';
      default:
        return '📋';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  const handleEmailResults = () => {
    // In a real implementation, this would send an email
    alert('Email functionality would be implemented here with proper privacy considerations.');
    setShowEmailForm(false);
  };

  const handleDeleteData = () => {
    if (confirm('Are you sure you want to delete all assessment data? This cannot be undone.')) {
      localStorage.clear();
      if (onRestart) onRestart();
    }
  };

  const handlePrintResults = () => {
    window.print();
  };

  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Assessment Results</h1>
        <p className="text-gray-600">
          Completed on {formatDate(result.generatedAt)}
        </p>
      </div>

      {/* Risk Level Summary */}
      <div className={`border-2 rounded-lg p-6 mb-8 ${getRiskColor(result.score.level)}`}>
        <div className="flex items-center justify-center mb-4">
          <span className="text-4xl mr-3">{getRiskIcon(result.score.level)}</span>
          <div>
            <h2 className="text-2xl font-bold capitalize">
              {result.score.level} Risk Level
            </h2>
            <p className="text-lg">
              Score: {Math.round(result.score.percentage)}%
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Total Score:</strong> {result.score.totalScore} / {result.score.maxPossibleScore}
          </div>
          <div>
            <strong>Assessment ID:</strong> {result.id}
          </div>
        </div>
      </div>

      {/* Emergency Alert for High Risk */}
      {result.score.level === 'high' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
          <div className="flex items-start">
            <div className="text-red-600 text-3xl mr-4">🚨</div>
            <div>
              <h3 className="text-xl font-bold text-red-800 mb-2">Immediate Action Required</h3>
              <p className="text-red-700 mb-4">
                Your assessment indicates a high-risk situation. Please contact emergency services or
                a domestic abuse support service immediately.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded border">
                  <h4 className="font-semibold text-red-800">Emergency Services</h4>
                  <p className="text-2xl font-bold text-red-600">999</p>
                  <p className="text-sm text-gray-600">Call immediately if in danger</p>
                </div>
                <div className="bg-white p-4 rounded border">
                  <h4 className="font-semibold text-red-800">Domestic Abuse Helpline</h4>
                  <p className="text-2xl font-bold text-red-600">0808 2000 247</p>
                  <p className="text-sm text-gray-600">24/7 confidential support</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Category Scores */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Risk Factors Breakdown</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {Object.entries(result.score.categoryScores).map(([category, score]) => {
            const maxScore = 100; // Each category has max 100 points
            const percentage = (score / maxScore) * 100;

            return (
              <div key={category} className="bg-white p-4 rounded border">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold capitalize">
                    {category.replace('-', ' ')}
                  </h4>
                  <span className="text-sm text-gray-600">
                    {Math.round(percentage)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      percentage > 70 ? 'bg-red-500' :
                      percentage > 40 ? 'bg-orange-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white rounded-lg border p-6 mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Personalised Recommendations</h3>
        <div className="space-y-6">
          {result.recommendations.map((rec: Recommendation) => (
            <div key={rec.id} className="border-l-4 border-blue-500 pl-4">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-lg">{rec.title}</h4>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  rec.priority === 'high' ? 'bg-red-100 text-red-800' :
                  rec.priority === 'medium' ? 'bg-orange-100 text-orange-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {rec.priority} priority
                </span>
              </div>

              <p className="text-gray-700 mb-3">{rec.description}</p>

              <div className="mb-3">
                <h5 className="font-medium text-gray-900 mb-2">Action Steps:</h5>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {rec.actions.map((action, index) => (
                    <li key={index}>{action}</li>
                  ))}
                </ul>
              </div>

              {rec.resources && rec.resources.length > 0 && (
                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Resources:</h5>
                  <div className="grid md:grid-cols-2 gap-2">
                    {rec.resources.map((resource) => (
                      <div key={resource.id} className="bg-blue-50 p-3 rounded text-sm">
                        <div className="font-medium text-blue-900">{resource.name}</div>
                        {resource.phone && (
                          <div className="text-blue-700">{resource.phone}</div>
                        )}
                        {resource.url && (
                          <div className="text-blue-600">
                            <a href={resource.url} target="_blank" rel="noopener noreferrer">
                              Visit Website →
                            </a>
                          </div>
                        )}
                        <div className="text-xs text-blue-600 mt-1">
                          {resource.description}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Contacts */}
      <div className="bg-red-50 rounded-lg p-6 mb-8">
        <h3 className="text-xl font-bold text-red-900 mb-4">Emergency Contacts</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {EMERGENCY_CONTACTS.map((contact) => (
            <div key={contact.id} className="bg-white p-4 rounded border">
              <h4 className="font-semibold text-red-800">{contact.name}</h4>
              <p className="text-2xl font-bold text-red-600">{contact.phone}</p>
              <p className="text-sm text-gray-600">{contact.service}</p>
              <p className="text-xs text-gray-500 mt-1">{contact.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Privacy and Actions */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Privacy & Data Management</h3>
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <button
            onClick={handlePrintResults}
            className="bg-white hover:bg-gray-50 border rounded-lg p-4 text-center transition-colors"
          >
            <div className="text-2xl mb-2">📄</div>
            <div className="font-medium">Print Results</div>
            <div className="text-xs text-gray-600">Save a copy for your records</div>
          </button>

          <button
            onClick={() => setShowEmailForm(!showEmailForm)}
            className="bg-white hover:bg-gray-50 border rounded-lg p-4 text-center transition-colors"
          >
            <div className="text-2xl mb-2">📧</div>
            <div className="font-medium">Email Results</div>
            <div className="text-xs text-gray-600">Send to yourself or trusted contact</div>
          </button>

          <button
            onClick={handleDeleteData}
            className="bg-white hover:bg-red-50 border border-red-200 rounded-lg p-4 text-center transition-colors"
          >
            <div className="text-2xl mb-2">🗑️</div>
            <div className="font-medium text-red-700">Delete Data</div>
            <div className="text-xs text-red-600">Permanently remove all data</div>
          </button>
        </div>

        {showEmailForm && (
          <div className="bg-white border rounded-lg p-4">
            <h4 className="font-semibold mb-3">Email Options</h4>
            <div className="space-y-3">
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={shareWithTrusted}
                    onChange={(e) => setShareWithTrusted(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm">Also send to a trusted contact</span>
                </label>
              </div>
              {shareWithTrusted && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trusted Contact Email
                  </label>
                  <input
                    type="email"
                    value={trustedEmail}
                    onChange={(e) => setTrustedEmail(e.target.value)}
                    className="w-full px-3 py-2 border rounded"
                    placeholder="trusted@example.com"
                  />
                </div>
              )}
              <button
                onClick={handleEmailResults}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Send Email
              </button>
            </div>
          </div>
        )}

        <div className="text-xs text-gray-600 mt-4">
          <p>
            <strong>Privacy Notice:</strong> Your assessment data is stored securely on your device only.
            No personal information is collected or shared with third parties. Your data will be
            automatically deleted after 30 days or you can delete it manually above.
          </p>
        </div>
      </div>

      {/* Restart Option */}
      {onRestart && (
        <div className="text-center">
          <button
            onClick={onRestart}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Take Assessment Again
          </button>
        </div>
      )}
    </div>
  );
}