// Video Testimonial Player with Privacy Controls
// Handles secure video playback with blurring, transcript, and accessibility features

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { VideoPlayerProps } from '@/types/testimonials';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

const VideoTestimonialPlayer: React.FC<VideoPlayerProps> = ({
  testimonial,
  autoplay = false,
  showControls = true,
  showTranscript = true,
  privacyMode = false,
  onPrivacyToggle,
  className = ''
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showTranscriptPanel, setShowTranscriptPanel] = useState(false);
  const [localPrivacyMode, setLocalPrivacyMode] = useState(privacyMode);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Handle privacy mode changes
  useEffect(() => {
    setLocalPrivacyMode(privacyMode);
  }, [privacyMode]);

  // Handle video metadata loaded
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setIsLoading(false);
    }
  };

  // Handle video time updates
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  // Handle video errors
  const handleError = () => {
    setError('Failed to load video. The testimonial may be temporarily unavailable.');
    setIsLoading(false);
  };

  // Toggle play/pause
  const togglePlayPause = async () => {
    if (videoRef.current) {
      try {
        if (isPlaying) {
          videoRef.current.pause();
        } else {
          await videoRef.current.play();
        }
      } catch (error) {
        console.error('Error toggling video playback:', error);
        setError('Unable to play video. Please try again.');
      }
    }
  };

  // Handle play event
  const handlePlay = () => {
    setIsPlaying(true);
  };

  // Handle pause event
  const handlePause = () => {
    setIsPlaying(false);
  };

  // Format time for display
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Handle volume change
  const handleVolumeChange = (newVolume: number) => {
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  // Toggle mute
  const toggleMute = () => {
    if (videoRef.current) {
      const newMuted = !isMuted;
      videoRef.current.muted = newMuted;
      setIsMuted(newMuted);
    }
  };

  // Handle seek
  const handleSeek = (newTime: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  // Toggle privacy mode
  const handlePrivacyToggle = () => {
    const newPrivacyMode = !localPrivacyMode;
    setLocalPrivacyMode(newPrivacyMode);
    onPrivacyToggle?.();
  };

  // Apply privacy filter styles
  const getPrivacyStyles = (): React.CSSProperties => {
    if (!localPrivacyMode) return {};

    return {
      filter: testimonial.videoMetadata?.hasBlurredFaces ? 'blur(2px)' : 'none',
      opacity: testimonial.privacySettings.allowVoiceAlteration ? 0.9 : 1
    };
  };

  // Get video source URL (placeholder - in production, this would be from secure storage)
  const getVideoSrc = (): string => {
    // In production, this would be a secure URL from cloud storage
    return `/api/testimonials/${testimonial.id}/video`;
  };

  if (error) {
    return (
      <div className={`video-testimonial-error ${className}`}>
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className={`video-testimonial-player ${className}`}>
      {/* Privacy Notice */}
      {localPrivacyMode && (
        <Alert className="mb-4">
          <AlertDescription>
            Privacy mode is active. Video content has been anonymized for client protection.
          </AlertDescription>
        </Alert>
      )}

      {/* Video Container */}
      <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        <video
          ref={videoRef}
          src={getVideoSrc()}
          poster={testimonial.videoMetadata?.thumbnailUrl}
          onLoadedMetadata={handleLoadedMetadata}
          onTimeUpdate={handleTimeUpdate}
          onPlay={handlePlay}
          onPause={handlePause}
          onError={handleError}
          autoPlay={autoplay}
          muted={isMuted}
          className="w-full h-full object-cover"
          style={getPrivacyStyles()}
          aria-label={`Video testimonial from ${testimonial.author.isAnonymous ? 'anonymous client' : testimonial.author.name || 'client'}`}
        />

        {/* Video Overlay Controls */}
        {showControls && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black bg-opacity-25">
            <Button
              variant="secondary"
              size="lg"
              onClick={togglePlayPause}
              className="rounded-full w-16 h-16"
              aria-label={isPlaying ? 'Pause video' : 'Play video'}
            >
              {isPlaying ? '⏸️' : '▶️'}
            </Button>
          </div>
        )}

        {/* Privacy Toggle */}
        <div className="absolute top-4 right-4">
          <Button
            variant={localPrivacyMode ? "default" : "outline"}
            size="sm"
            onClick={handlePrivacyToggle}
            className="bg-black bg-opacity-50 text-white border-white hover:bg-opacity-75"
          >
            {localPrivacyMode ? '👁️ Privacy On' : '👁️ Privacy Off'}
          </Button>
        </div>

        {/* Verification Badge */}
        <div className="absolute bottom-4 left-4">
          <Badge
            variant={testimonial.verificationStatus === 'verified' ? 'default' : 'secondary'}
            className="bg-black bg-opacity-50 text-white border-none"
          >
            {testimonial.verificationStatus === 'verified' ? '✅ Verified' : '⏳ Under Review'}
          </Badge>
        </div>
      </div>

      {/* Video Controls */}
      {showControls && (
        <div className="mt-4 space-y-4">
          {/* Progress Bar */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={togglePlayPause}
              className="px-2"
            >
              {isPlaying ? '⏸️' : '▶️'}
            </Button>

            <div className="flex-1">
              <input
                type="range"
                min="0"
                max={duration}
                value={currentTime}
                onChange={(e) => handleSeek(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                aria-label="Video progress"
              />
            </div>

            <span className="text-sm text-gray-600 min-w-[80px] text-right">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          {/* Volume Controls */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMute}
              className="px-2"
            >
              {isMuted ? '🔇' : '🔊'}
            </Button>

            <div className="flex-1 max-w-[200px]">
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={isMuted ? 0 : volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                aria-label="Volume control"
              />
            </div>
          </div>
        </div>
      )}

      {/* Transcript */}
      {showTranscript && testimonial.videoMetadata?.transcript && (
        <div className="mt-4">
          <Button
            variant="outline"
            onClick={() => setShowTranscriptPanel(!showTranscriptPanel)}
            className="mb-2"
          >
            {showTranscriptPanel ? 'Hide Transcript' : 'Show Transcript'}
          </Button>

          {showTranscriptPanel && (
            <div className="bg-gray-50 p-4 rounded-lg max-h-48 overflow-y-auto">
              <p className="text-sm text-gray-700 leading-relaxed">
                {testimonial.videoMetadata.transcript}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Testimonial Info */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div>
            <p className="font-medium text-gray-900">
              {testimonial.author.isAnonymous
                ? 'Anonymous Client'
                : testimonial.author.name || 'Client Testimonial'
              }
            </p>
            <p className="text-sm text-gray-500">
              {testimonial.author.location && `📍 ${testimonial.author.location} • `}
              {testimonial.author.caseType} • {testimonial.caseOutcome}
            </p>
          </div>
        </div>

        {testimonial.rating && (
          <div className="flex items-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={`text-lg ${
                  i < testimonial.rating! ? 'text-yellow-400' : 'text-gray-300'
                }`}
              >
                ⭐
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Tags */}
      {testimonial.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {testimonial.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag.replace('_', ' ')}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default VideoTestimonialPlayer;