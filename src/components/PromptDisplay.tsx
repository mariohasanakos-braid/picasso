'use client';

import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface PromptDisplayProps {
  prompt: string | null;
}

export default function PromptDisplay({ prompt }: PromptDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!prompt) return;
    
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (!prompt) return null;

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-gray-700">
          Generated Prompt:
        </label>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-sm text-primary hover:text-blue-600 transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy
            </>
          )}
        </button>
      </div>
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
        <p className="text-sm text-gray-900 font-mono leading-relaxed">
          {prompt}
        </p>
      </div>
    </div>
  );
}

