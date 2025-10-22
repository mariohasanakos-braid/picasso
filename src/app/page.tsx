'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Palette, RefreshCw } from 'lucide-react';
import VoiceClient from '@/components/VoiceClient';
import TranscriptPanel from '@/components/TranscriptPanel';
import ImageCanvas from '@/components/ImageCanvas';
import PromptDisplay from '@/components/PromptDisplay';
import DownloadButton from '@/components/DownloadButton';
import { TranscriptMessage } from '@/lib/types';
import { useVoiceConnection } from '@/hooks/useVoiceConnection';

export default function Home() {
  const [messages, setMessages] = useState<TranscriptMessage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [compiledPrompt, setCompiledPrompt] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isStarted, setIsStarted] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const recentMessagesRef = useRef(new Set<string>());
  
  // Use the voice connection hook
  const { connectionStatus, audioLevel, startConnection, stopConnection } = useVoiceConnection();

  const handleTranscript = useCallback((message: TranscriptMessage) => {
    // Create a unique identifier for this message
    const messageId = `${message.role}-${message.content}-${Math.floor(message.timestamp / 1000)}`;
    
    // Check if we've already received this message in the last few seconds
    if (recentMessagesRef.current.has(messageId)) {
      console.log('Duplicate message detected, skipping:', message.content);
      return;
    }
    
    // Add to recent messages and auto-cleanup after 5 seconds
    recentMessagesRef.current.add(messageId);
    setTimeout(() => recentMessagesRef.current.delete(messageId), 5000);
    
    setMessages(prev => [...prev, message]);
  }, []);

  const handleGenerationTrigger = useCallback(async () => {
    if (messages.length === 0 || isGenerating) return;

    // isGenerating is already set by handleManualGenerate if called from button
    if (!isGenerating) {
      setIsGenerating(true);
    }
    setError(null);

    try {
      // Step 1: Compile prompt from transcript
      const transcript = messages
        .map(m => `${m.role === 'user' ? 'User' : 'Picasso'}: ${m.content}`)
        .join('\n');

      const compileRes = await fetch('/api/compile-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript })
      });

      if (!compileRes.ok) {
        const errorData = await compileRes.json();
        console.error('Compile prompt error:', errorData);
        throw new Error(errorData.error || 'Failed to compile prompt');
      }

      const { prompt } = await compileRes.json();
      setCompiledPrompt(prompt);
      console.log('Compiled prompt:', prompt);

      // Step 2: Generate image
      const imageRes = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      if (!imageRes.ok) {
        const errorData = await imageRes.json();
        console.error('Generate image error:', errorData);
        throw new Error(errorData.error || 'Failed to generate image');
      }

      const imageData = await imageRes.json();
      
      if (imageData.error) {
        // Handle specific error from our API
        if (imageData.error === 'Content policy violation') {
          setError('Your request was flagged by content safety filters. Please try describing your image differently, focusing on artistic and appropriate content.');
        } else {
          setError(imageData.details || imageData.error || 'Failed to generate image');
        }
      } else {
        setImageUrl(imageData.imageUrl);
      }
    } catch (err: any) {
      console.error('Generation error:', err);
      const errorMessage = err.message || 'Failed to generate image';
      setError(errorMessage);
      
      // Show more detailed error in console
      console.error('Full error details:', {
        message: errorMessage,
        error: err,
        transcript: messages,
        compiledPrompt
      });
    } finally {
      setIsGenerating(false);
    }
  }, [messages, isGenerating, compiledPrompt]);

  // Start voice connection when user clicks start
  useEffect(() => {
    // Only start connection if we haven't generated an image yet
    if (isStarted && connectionStatus === 'disconnected' && !isGenerating && !hasGenerated) {
      startConnection(handleTranscript, handleGenerationTrigger);
    }
  }, [isStarted, connectionStatus, startConnection, handleTranscript, handleGenerationTrigger, isGenerating, hasGenerated]);

  const handleManualGenerate = () => {
    // Set generating state first to prevent reconnection
    setIsGenerating(true);
    // Mark that we've generated to prevent reconnection
    setHasGenerated(true);
    // Stop the voice connection when generating
    stopConnection();
    // Don't reset isStarted - keep showing the conversation
    // Then trigger generation
    handleGenerationTrigger();
  };

  const handleReset = () => {
    // Stop the voice connection first
    stopConnection();
    
    // Clear all state
    setMessages([]);
    setCompiledPrompt(null);
    setImageUrl(null);
    setError(null);
    setIsGenerating(false);
    setIsStarted(false);
    setHasGenerated(false);  // Reset the generation flag
    recentMessagesRef.current.clear();
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'text-accent-connected';
      case 'connecting':
        return 'text-yellow-500';
      case 'error':
        return 'text-accent-disconnected';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Connected';
      case 'connecting':
        return 'Connecting...';
      case 'error':
        return 'Connection Error';
      default:
        return 'Disconnected';
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary rounded-lg p-2">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Picasso</h1>
                <p className="text-sm text-secondary">AI Image Generation with Voice</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className={`flex items-center gap-2 ${getStatusColor()}`}>
                <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
                <span className="text-sm font-medium">{getStatusText()}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
          {/* Left Panel - Image Canvas */}
          <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col overflow-hidden">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex-shrink-0">Generated Image</h2>
            <div className="flex-1 min-h-0 overflow-auto">
              <ImageCanvas 
                imageUrl={imageUrl} 
                isLoading={isGenerating} 
                error={error}
              />
            </div>
            <PromptDisplay prompt={compiledPrompt} />
            <div className="mt-4 flex-shrink-0">
              <DownloadButton imageUrl={imageUrl} disabled={isGenerating} />
            </div>
          </div>

          {/* Right Panel - Voice Conversation */}
          <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col h-full overflow-hidden">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex-shrink-0">Voice Conversation</h2>
            
            {!isStarted ? (
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="text-center mb-8">
                  <div className="text-6xl mb-4">🎤</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Start Your Creative Journey
                  </h3>
                  <p className="text-secondary max-w-md">
                    Click the button below to start a voice conversation with Picasso.
                    You&apos;ll be asked to grant microphone permission.
                  </p>
                </div>
                <button
                  onClick={() => setIsStarted(true)}
                  className="px-8 py-4 bg-primary text-white rounded-lg font-semibold text-lg hover:bg-blue-600 transition-all duration-200 hover:shadow-lg active:scale-95"
                >
                  Start Conversation
                </button>
              </div>
            ) : (
              <>
                {/* Voice Visualizer */}
                <div className="flex-shrink-0">
                  <VoiceClient
                    isActive={connectionStatus === 'connected'}
                    audioLevel={audioLevel}
                  />
                </div>

                {/* Transcript Panel - Fixed height with scroll */}
                <div className="flex-1 min-h-0 overflow-hidden border-t border-gray-200 mt-4">
                  <TranscriptPanel messages={messages} />
                </div>

                {/* Control Buttons */}
                {imageUrl ? (
                  <div className="flex-shrink-0 mt-4 p-4 bg-gray-50 rounded-lg text-center">
                    <p className="text-gray-700 mb-3">
                      Your image has been generated! To create another image, click below to start a new conversation.
                    </p>
                    <button
                      onClick={handleReset}
                      className="py-3 px-6 rounded-lg font-medium bg-primary text-white hover:bg-blue-600 transition-all duration-200 hover:shadow-lg active:scale-95 flex items-center justify-center gap-2 mx-auto"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Start New Conversation
                    </button>
                  </div>
                ) : (
                  <div className="flex-shrink-0 mt-4 grid grid-cols-2 gap-3">
                    <button
                      onClick={handleManualGenerate}
                      disabled={isGenerating || messages.length === 0}
                      className={`
                        py-3 px-4 rounded-lg font-medium transition-all duration-200
                        ${isGenerating || messages.length === 0
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-primary text-white hover:bg-blue-600 hover:shadow-lg active:scale-95'
                        }
                      `}
                    >
                      {isGenerating ? 'Generating...' : 'Generate Image'}
                    </button>
                    <button
                      onClick={handleReset}
                      disabled={isGenerating}
                      className="py-3 px-4 rounded-lg font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all duration-200 hover:shadow active:scale-95 flex items-center justify-center gap-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Reset
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

