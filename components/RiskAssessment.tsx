'use client';

// Risk Assessment Component - Main questionnaire interface
import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import { AssessmentResponses, QuestionResponse, AssessmentResult } from '@/types/assessment';
import { ASSESSMENT_QUESTIONS, createAssessmentResult, encryptData, decryptData } from '@/lib/riskAssessment';

// Lazy load the heavy RiskResults component for code splitting
const RiskResults = lazy(() => import('./RiskResults'));

interface RiskAssessmentProps {
  onComplete?: (result: AssessmentResult) => void;
  onEmergency?: () => void;
  className?: string;
}

const STORAGE_KEY = 'risk_assessment_data';
const ENCRYPTION_KEY = 'risk_assessment_encryption_key_2024';

export default function RiskAssessment({ onComplete, onEmergency, className = '' }: RiskAssessmentProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<AssessmentResponses>({
    responses: [],
    startedAt: new Date(),
    currentStep: 0,
    isEmergency: false
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  const totalSteps = ASSESSMENT_QUESTIONS.length;
  const currentQuestion = ASSESSMENT_QUESTIONS[currentStep];
  const progress = ((currentStep + 1) / totalSteps) * 100;

  // Load saved progress on mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const decrypted = decryptData(savedData, ENCRYPTION_KEY);
        const parsed = JSON.parse(decrypted);
        if (parsed && parsed.responses && !isExpired(parsed.startedAt)) {
          setResponses(parsed);
          setCurrentStep(parsed.currentStep || 0);
        }
      } catch (error) {
        console.warn('Failed to load saved assessment data:', error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  // Save progress to localStorage
  const saveProgress = useCallback((updatedResponses: AssessmentResponses) => {
    try {
      const dataToSave = JSON.stringify(updatedResponses);
      const encrypted = encryptData(dataToSave, ENCRYPTION_KEY);
      localStorage.setItem(STORAGE_KEY, encrypted);
    } catch (error) {
      console.warn('Failed to save assessment progress:', error);
    }
  }, []);

  // Check if saved data is expired (24 hours)
  const isExpired = (startedAt: string) => {
    const startTime = new Date(startedAt);
    const now = new Date();
    const diffHours = (now.getTime() - startTime.getTime()) / (1000 * 60 * 60);
    return diffHours > 24;
  };

  // Handle answer selection
  const handleAnswer = (answer: string | number | boolean) => {
    const newResponse: QuestionResponse = {
      questionId: currentQuestion.id,
      answer
    };

    const updatedResponses = {
      ...responses,
      responses: [
        ...responses.responses.filter(r => r.questionId !== currentQuestion.id),
        newResponse
      ],
      currentStep: currentStep
    };

    setResponses(updatedResponses);
    saveProgress(updatedResponses);

    // Check for emergency
    if (currentQuestion.triggersEmergency && answer === true) {
      updatedResponses.isEmergency = true;
      saveProgress(updatedResponses);

      if (onEmergency) {
        onEmergency();
      } else {
        // Show emergency screen
        setResponses({ ...updatedResponses, isEmergency: true });
        setShowResults(true);
        return;
      }
    }

    // Move to next step or complete
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeAssessment(updatedResponses);
    }
  };

  // Complete assessment and show results
  const completeAssessment = (finalResponses: AssessmentResponses) => {
    const completedResponses = {
      ...finalResponses,
      completedAt: new Date()
    };

    const result = createAssessmentResult(completedResponses);
    setAssessmentResult(result);
    setShowResults(true);

    // Clear saved data after completion
    localStorage.removeItem(STORAGE_KEY);

    if (onComplete) {
      onComplete(result);
    }
  };

  // Navigate between steps
  const goToStep = (step: number) => {
    if (step >= 0 && step < totalSteps) {
      setCurrentStep(step);
      setResponses({ ...responses, currentStep: step });
    }
  };

  // Skip question (if not required)
  const skipQuestion = () => {
    if (!currentQuestion.required) {
      const skippedResponse: QuestionResponse = {
        questionId: currentQuestion.id,
        answer: '',
        skipped: true
      };

      const updatedResponses = {
        ...responses,
        responses: [
          ...responses.responses.filter(r => r.questionId !== currentQuestion.id),
          skippedResponse
        ],
        currentStep: currentStep
      };

      setResponses(updatedResponses);

      if (currentStep < totalSteps - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        completeAssessment(updatedResponses);
      }
    }
  };

  // Restart assessment
  const restartAssessment = () => {
    const newResponses: AssessmentResponses = {
      responses: [],
      startedAt: new Date(),
      currentStep: 0,
      isEmergency: false
    };
    setResponses(newResponses);
    setCurrentStep(0);
    setShowResults(false);
    setAssessmentResult(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  // Emergency bypass - go straight to emergency contacts
  const handleEmergency = () => {
    setResponses({ ...responses, isEmergency: true });
    setShowResults(true);
  };

  if (isLoading) {
    return (
      <div className={`max-w-2xl mx-auto p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (showResults && assessmentResult) {
    return (
      <Suspense
        fallback={
          <div className={`max-w-4xl mx-auto p-6 ${className}`}>
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-6"></div>
              <div className="h-32 bg-gray-200 rounded mb-6"></div>
              <div className="h-48 bg-gray-200 rounded"></div>
            </div>
          </div>
        }
      >
        <RiskResults
          result={assessmentResult}
          onRestart={restartAssessment}
          className={className}
        />
      </Suspense>
    );
  }

  if (showResults && responses.isEmergency) {
    return (
      <div className={`max-w-2xl mx-auto p-6 ${className}`}>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-600 text-6xl mb-4">🚨</div>
          <h2 className="text-2xl font-bold text-red-800 mb-4">Emergency Situation Detected</h2>
          <p className="text-red-700 mb-6">
            Based on your response, you may be in immediate danger. Please contact emergency services right away.
          </p>
          <div className="space-y-4">
            <div className="bg-white p-4 rounded border">
              <h3 className="font-semibold text-red-800">Call Emergency Services</h3>
              <p className="text-2xl font-bold text-red-600">999</p>
              <p className="text-sm text-gray-600">If you are in immediate danger</p>
            </div>
            <div className="bg-white p-4 rounded border">
              <h3 className="font-semibold text-red-800">National Domestic Abuse Helpline</h3>
              <p className="text-2xl font-bold text-red-600">0808 2000 247</p>
              <p className="text-sm text-gray-600">24/7 confidential support</p>
            </div>
          </div>
          <button
            onClick={restartAssessment}
            className="mt-6 bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded transition-colors"
          >
            Restart Assessment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`max-w-2xl mx-auto ${className}`}>
      {/* Header with progress */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Risk Assessment</h1>
          <span className="text-sm text-gray-600">
            Step {currentStep + 1} of {totalSteps}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          ></div>
        </div>

        {/* Safety message */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <div className="text-blue-600 text-xl mr-3">🛡️</div>
            <div>
              <h3 className="font-semibold text-blue-800 mb-1">Your Safety is Our Priority</h3>
              <p className="text-blue-700 text-sm">
                This assessment is completely confidential. If you&apos;re in immediate danger,
                please call 999 or the National Domestic Abuse Helpline on 0808 2000 247.
              </p>
            </div>
          </div>
        </div>

        {/* Privacy acceptance */}
        {currentStep === 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-yellow-800 mb-2">Privacy Notice</h3>
            <p className="text-yellow-700 text-sm mb-3">
              Your responses are stored temporarily and securely on your device only.
              No personal information is collected or shared. You can delete your data at any time.
            </p>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={privacyAccepted}
                onChange={(e) => setPrivacyAccepted(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm text-yellow-800">
                I understand and accept the privacy terms
              </span>
            </label>
          </div>
        )}
      </div>

      {/* Question */}
      <div className="bg-white border rounded-lg p-6 mb-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {currentQuestion.question}
          </h2>
          {currentQuestion.description && (
            <p className="text-gray-600 text-sm">
              {currentQuestion.description}
            </p>
          )}
        </div>

        {/* Answer options based on question type */}
        <div className="space-y-3" role="radiogroup" aria-labelledby={`question-${currentQuestion.id}`}>
          {currentQuestion.type === 'yes-no' && (
            <div className="space-y-2">
              <button
                onClick={() => handleAnswer(true)}
                disabled={!privacyAccepted}
                className="w-full text-left p-3 border rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-describedby={`question-${currentQuestion.id}`}
              >
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-gray-300 rounded mr-3 flex items-center justify-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full opacity-0"></div>
                  </div>
                  Yes
                </div>
              </button>
              <button
                onClick={() => handleAnswer(false)}
                disabled={!privacyAccepted}
                className="w-full text-left p-3 border rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-describedby={`question-${currentQuestion.id}`}
              >
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-gray-300 rounded mr-3 flex items-center justify-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full opacity-0"></div>
                  </div>
                  No
                </div>
              </button>
            </div>
          )}

          {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
            <div className="space-y-2">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index.toString())}
                  disabled={!privacyAccepted}
                  className="w-full text-left p-3 border rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-describedby={`question-${currentQuestion.id}`}
                >
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-gray-300 rounded mr-3 flex items-center justify-center">
                      <div className="w-2 h-2 bg-blue-600 rounded-full opacity-0"></div>
                    </div>
                    {option}
                  </div>
                </button>
              ))}
            </div>
          )}

          {currentQuestion.type === 'emergency-check' && (
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start">
                  <div className="text-red-600 text-2xl mr-3">⚠️</div>
                  <div>
                    <h3 className="font-semibold text-red-800 mb-1">Emergency Situation</h3>
                    <p className="text-red-700 text-sm">
                      If you select &quot;Yes&quot;, we&apos;ll immediately show you emergency contact options.
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <button
                  onClick={() => handleAnswer(true)}
                  disabled={!privacyAccepted}
                  className="w-full text-left p-4 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white rounded mr-3 flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full opacity-0"></div>
                    </div>
                    <strong>Yes, I&apos;m in immediate danger - show emergency contacts</strong>
                  </div>
                </button>
                <button
                  onClick={() => handleAnswer(false)}
                  disabled={!privacyAccepted}
                  className="w-full text-left p-3 border rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-gray-300 rounded mr-3 flex items-center justify-center">
                      <div className="w-2 h-2 bg-blue-600 rounded-full opacity-0"></div>
                    </div>
                    No, I&apos;m not in immediate danger
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Skip option for non-required questions */}
        {!currentQuestion.required && (
          <div className="mt-4 pt-4 border-t">
            <button
              onClick={skipQuestion}
              disabled={!privacyAccepted}
              className="text-sm text-gray-500 hover:text-gray-700 underline disabled:opacity-50"
            >
              Skip this question
            </button>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => goToStep(currentStep - 1)}
          disabled={currentStep === 0}
          className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Previous question"
        >
          ← Previous
        </button>

        <div className="flex space-x-2">
          {/* Step indicators */}
          {Array.from({ length: totalSteps }, (_, index) => (
            <button
              key={index}
              onClick={() => goToStep(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentStep
                  ? 'bg-blue-600'
                  : index < currentStep
                  ? 'bg-green-500'
                  : 'bg-gray-300'
              }`}
              aria-label={`Go to question ${index + 1}`}
            />
          ))}
        </div>

        <div className="text-sm text-gray-500">
          {currentStep === totalSteps - 1 ? 'Final question' : `${totalSteps - currentStep - 1} remaining`}
        </div>
      </div>

      {/* Emergency access */}
      <div className="mt-6 text-center">
        <button
          onClick={handleEmergency}
          className="text-red-600 hover:text-red-800 underline text-sm"
        >
          🚨 Need emergency help now? Click here
        </button>
      </div>
    </div>
  );
}