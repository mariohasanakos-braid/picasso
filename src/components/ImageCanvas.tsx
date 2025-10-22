'use client';

import Image from 'next/image';
import { Loader2 } from 'lucide-react';

interface ImageCanvasProps {
  imageUrl: string | null;
  isLoading: boolean;
  error: string | null;
}

export default function ImageCanvas({ imageUrl, isLoading, error }: ImageCanvasProps) {
  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-lg border-2 border-gray-200">
        <div className="text-center p-8">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Generation Failed</h3>
          <p className="text-secondary">{error}</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 rounded-lg border-2 border-gray-200">
        <Loader2 className="w-16 h-16 text-primary animate-spin mb-4" />
        <p className="text-lg font-medium text-gray-900">Generating your image...</p>
        <p className="text-sm text-secondary mt-2">This will take about 30-60 seconds</p>
      </div>
    );
  }

  if (imageUrl) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-lg border-2 border-gray-200 overflow-hidden">
        <div className="relative w-full h-full">
          <Image
            src={imageUrl}
            alt="Generated image"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
      <div className="text-center p-8">
        <div className="text-6xl mb-4">🎨</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Your image will appear here</h3>
        <p className="text-secondary">Start a conversation to create something amazing!</p>
      </div>
    </div>
  );
}

