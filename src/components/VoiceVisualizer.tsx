'use client';

interface VoiceVisualizerProps {
  isActive: boolean;
  audioLevel: number;
}

export default function VoiceVisualizer({ isActive, audioLevel }: VoiceVisualizerProps) {
  const scale = 1 + (audioLevel * 0.5); // Scale between 1 and 1.5
  
  return (
    <div className="flex items-center justify-center p-8">
      <div 
        className={`relative w-32 h-32 rounded-full flex items-center justify-center transition-all duration-200 ${
          isActive 
            ? 'bg-gradient-to-br from-primary to-blue-500' 
            : 'bg-gray-300'
        }`}
        style={{
          transform: `scale(${scale})`,
          boxShadow: isActive ? `0 0 ${20 + audioLevel * 30}px rgba(20, 184, 166, 0.5)` : 'none'
        }}
      >
        <svg 
          width="64" 
          height="64" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="white" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" y1="19" x2="12" y2="22" />
        </svg>
        
        {/* Pulsing rings */}
        {isActive && (
          <>
            <div 
              className="absolute inset-0 rounded-full border-2 border-primary animate-ping opacity-75"
              style={{ animationDuration: '2s' }}
            />
            <div 
              className="absolute inset-0 rounded-full border-2 border-primary animate-ping opacity-50"
              style={{ animationDuration: '2.5s', animationDelay: '0.5s' }}
            />
          </>
        )}
      </div>
    </div>
  );
}

