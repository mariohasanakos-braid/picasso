// Type definitions for Picasso application

export interface TranscriptMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface VoiceClientProps {
  onTranscript: (message: TranscriptMessage) => void;
  onReady: () => void;
  onStatus: (status: ConnectionStatus) => void;
  onGenerationTrigger: () => void;
}

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export interface RealtimeEvent {
  type: string;
  event_id?: string;
  transcript?: string;
  audio?: ArrayBuffer;
  delta?: string;
  [key: string]: any;
}

export interface SessionToken {
  client_secret: {
    value: string;
    expires_at: number;
  };
  model: string;
  id: string;
}

export interface CompilePromptRequest {
  transcript: string;
}

export interface CompilePromptResponse {
  prompt: string;
}

export interface GenerateImageRequest {
  prompt: string;
}

export interface GenerateImageResponse {
  imageUrl: string;
  revisedPrompt?: string;
}

