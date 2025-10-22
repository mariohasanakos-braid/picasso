'use client';

import { Download } from 'lucide-react';

interface DownloadButtonProps {
  imageUrl: string | null;
  disabled?: boolean;
}

export default function DownloadButton({ imageUrl, disabled }: DownloadButtonProps) {
  const handleDownload = async () => {
    if (!imageUrl) return;

    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `picasso-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
      alert('Failed to download image. Please try again.');
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={disabled || !imageUrl}
      className={`
        w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium
        transition-all duration-200
        ${disabled || !imageUrl
          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
          : 'bg-primary text-white hover:bg-blue-600 hover:shadow-lg active:scale-95'
        }
      `}
    >
      <Download className="w-5 h-5" />
      Download Image
    </button>
  );
}

