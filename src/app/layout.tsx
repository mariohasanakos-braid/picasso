import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Picasso - AI Image Generation with Voice',
  description: 'Create stunning AI-generated images through natural voice conversations',
  keywords: ['AI', 'image generation', 'DALL-E', 'voice', 'OpenAI'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

