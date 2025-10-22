'use client';

import VoiceVisualizer from './VoiceVisualizer';

interface VoiceClientProps {
  isActive: boolean;
  audioLevel: number;
}

export default function VoiceClient({ isActive, audioLevel }: VoiceClientProps) {
  return <VoiceVisualizer isActive={isActive} audioLevel={audioLevel} />;
}