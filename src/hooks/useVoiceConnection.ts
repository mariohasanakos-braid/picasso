'use client';

import { useRef, useCallback, useState } from 'react';
import { TranscriptMessage, ConnectionStatus, RealtimeEvent } from '@/lib/types';

export function useVoiceConnection() {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [audioLevel, setAudioLevel] = useState(0);
  
  // Refs for connection management
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dcRef = useRef<RTCDataChannel | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioElementsRef = useRef<HTMLAudioElement[]>([]);
  const isConnectingRef = useRef(false);
  const isCleanedUpRef = useRef(false);
  const animationFrameRef = useRef<number | null>(null);

  const monitorAudioLevel = useCallback(() => {
    if (!analyserRef.current || isCleanedUpRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    
    const updateLevel = () => {
      if (!analyserRef.current || isCleanedUpRef.current) return;
      
      analyserRef.current.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
      setAudioLevel(average / 255);
      
      animationFrameRef.current = requestAnimationFrame(updateLevel);
    };
    
    updateLevel();
  }, []);

  const stopConnection = useCallback(() => {
    console.log('Stopping voice connection...');
    
    // Set cleanup flag first to prevent any new audio or messages
    isCleanedUpRef.current = true;
    
    // Cancel audio level monitoring
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    // Stop and remove all audio elements
    audioElementsRef.current.forEach(audio => {
      audio.pause();
      audio.srcObject = null;
      audio.remove();
    });
    audioElementsRef.current = [];
    
    // Close data channel
    if (dcRef.current) {
      dcRef.current.onmessage = null;
      dcRef.current.onopen = null;
      dcRef.current.onerror = null;
      dcRef.current.close();
      dcRef.current = null;
    }
    
    // Close peer connection
    if (pcRef.current) {
      pcRef.current.ontrack = null;
      pcRef.current.onicecandidate = null;
      pcRef.current.oniceconnectionstatechange = null;
      pcRef.current.onsignalingstatechange = null;
      
      // Stop all transceivers
      pcRef.current.getTransceivers().forEach(transceiver => {
        if (transceiver.stop) {
          transceiver.stop();
        }
      });
      
      pcRef.current.close();
      pcRef.current = null;
    }
    
    // Stop microphone stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      streamRef.current = null;
    }
    
    // Close audio context
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    
    isConnectingRef.current = false;
    setConnectionStatus('disconnected');
    setAudioLevel(0);
    
    console.log('Voice connection stopped');
  }, []);

  const startConnection = useCallback(async (
    onTranscript: (message: TranscriptMessage) => void,
    onGenerationTrigger: () => void
  ) => {
    // Prevent duplicate connections
    if (isConnectingRef.current || pcRef.current) {
      console.log('Connection already in progress or established');
      return false;
    }
    
    isConnectingRef.current = true;
    isCleanedUpRef.current = false;
    
    try {
      setConnectionStatus('connecting');

      // 1. Get microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Setup audio analysis for visualization
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;

      // Start audio level monitoring
      monitorAudioLevel();

      // 2. Fetch ephemeral token
      const tokenRes = await fetch('/api/realtime/token', { method: 'POST' });
      if (!tokenRes.ok) {
        throw new Error('Failed to get session token');
      }
      const tokenData = await tokenRes.json();
      
      // 3. Setup WebRTC
      const pc = new RTCPeerConnection();
      stream.getTracks().forEach(track => pc.addTrack(track, stream));
      
      // 4. Handle incoming audio
      pc.ontrack = (event) => {
        if (isCleanedUpRef.current) {
          console.log('Ignoring audio track - component is cleaned up');
          return;
        }
        
        const audio = new Audio();
        audio.srcObject = event.streams[0];
        audio.autoplay = true;
        audioElementsRef.current.push(audio);
        audio.play().catch(err => console.error('Audio play error:', err));
      };
      
      // 5. Setup data channel for events
      const dc = pc.createDataChannel('oai-events');
      
      dc.onopen = () => {
        console.log('Data channel opened');
        setConnectionStatus('connected');
      };

      dc.onmessage = (event) => {
        if (isCleanedUpRef.current) {
          console.log('Ignoring message - component is cleaned up');
          return;
        }
        
        try {
          const message: RealtimeEvent = JSON.parse(event.data);
          
          // Handle various event types from OpenAI Realtime API
          switch (message.type) {
            case 'conversation.item.created':
            case 'response.audio_transcript.done':
            case 'conversation.item.input_audio_transcription.completed':
              if (message.transcript) {
                const role = message.type.includes('input') ? 'user' : 'assistant';
                onTranscript({
                  role,
                  content: message.transcript,
                  timestamp: Date.now()
                });

                // Removed automatic generation trigger - users should click the button
              }
              break;
            
            case 'response.audio_transcript.delta':
              // Real-time transcript streaming - could implement partial updates
              break;
          }
        } catch (err) {
          console.error('Error parsing data channel message:', err);
        }
      };

      dc.onerror = (error) => {
        console.error('Data channel error:', error);
        setConnectionStatus('error');
      };
      
      // 6. Create offer and connect
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      
      const response = await fetch('/api/realtime', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/sdp',
          'X-Ephemeral-Key': tokenData.client_secret.value
        },
        body: offer.sdp
      });
      
      if (!response.ok) {
        throw new Error('Failed to establish WebRTC connection');
      }

      const answerSdp = await response.text();
      await pc.setRemoteDescription({ type: 'answer', sdp: answerSdp });
      
      pcRef.current = pc;
      dcRef.current = dc;
      isConnectingRef.current = false;
      
      console.log('Voice connection established successfully');
      return true;
    } catch (error) {
      console.error('Error setting up realtime:', error);
      setConnectionStatus('error');
      isConnectingRef.current = false;
      stopConnection();
      return false;
    }
  }, [monitorAudioLevel, stopConnection]);

  return {
    connectionStatus,
    audioLevel,
    startConnection,
    stopConnection,
    isConnected: pcRef.current !== null && connectionStatus === 'connected'
  };
}
