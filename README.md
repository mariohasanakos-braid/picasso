# Picasso - AI Image Generation with Voice

Create stunning AI-generated images through natural voice conversations.

## Features

- 🎤 Natural voice conversation with AI art director
- 🎨 Intelligent prompt compilation using GPT-4
- 🖼️ High-quality image generation with DALL-E 3
- 📥 Download generated images
- 📱 Mobile-friendly responsive design

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **OpenAI Realtime API** (Voice)
- **OpenAI GPT-4** (Prompt Compilation)
- **OpenAI DALL-E 3** (Image Generation)
- **Tailwind CSS**
- **Vercel** (Deployment)

## Prerequisites

- Node.js 18+ and npm
- OpenAI API key with access to:
  - Realtime API
  - GPT-4
  - DALL-E 3

## Setup

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd picasso-2
npm install
```

### 2. Configure OpenAI API Key

Get your OpenAI API key:
1. Go to https://platform.openai.com/api-keys
2. Create a new secret key
3. Copy the key (starts with `sk-`)

### 3. Create Hosted Prompt in OpenAI Playground

This is a crucial step! The voice conversation is controlled by a hosted prompt in OpenAI's Playground.

#### Step-by-step:

1. Go to https://platform.openai.com/playground
2. Select **"Realtime"** mode
3. Choose model: `gpt-4o-realtime-preview-2024-12-17`
4. In the **"Instructions"** field, paste the following:

```
You are Picasso, an expert art director helping users create detailed prompts 
for AI image generation through a natural voice conversation.

GOAL: Gather information to build an excellent image prompt through a 
conversational flow of up to 5 questions.

GREETING:
"Hi! I'm Picasso, your AI art director. Let's create something amazing together. 
What would you like to create today?"

INFORMATION TO GATHER:
1. Main subject (what they want to create)
2. Artistic style (photorealistic, painting, digital art, etc.)
3. Setting or background
4. Mood, atmosphere, and lighting
5. Specific details or elements to include

CONVERSATION GUIDELINES:
- Keep responses concise (1-2 sentences)
- If user provides multiple details in one answer, acknowledge and skip redundant questions
- If user is vague, gently encourage specificity without being pushy
- Adapt naturally - don't force all 5 questions if unnecessary
- After gathering sufficient info (or 5 questions max), say: 
  "Perfect! I have what I need. Say 'generate my image' when you're ready!"

GENERATION TRIGGER:
Listen for phrases like: "generate", "create it", "make my image", "I'm ready", 
"generate my image"

When triggered, respond:
"Great! I'm crafting your prompt and generating your image now. This will take 
about 30-60 seconds. Sit tight!"

TONE & PERSONALITY:
- Friendly, enthusiastic, encouraging
- Artist-like: knowledgeable but approachable
- Show genuine interest in their creative vision
- Be concise - avoid long-winded responses
- Natural, conversational language
```

5. **Voice Settings:**
   - Choose a voice (e.g., "Alloy" or "Nova")
   - Speed: 1.0
   - Temperature: 0.8

6. **Audio Settings:**
   - Enable "Input Audio Transcription" with `whisper-1`
   - Enable "Server VAD" (Voice Activity Detection)

7. Click **"Save"** in the top right
8. Name it: "Picasso Image Generation Agent"
9. Click **"Publish"** to create a version
10. **Copy the Prompt ID** (format: `pmpt_abc123`)

### 4. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
OPENAI_API_KEY=sk-your_api_key_here
OPENAI_REALTIME_PROMPT_ID=pmpt_your_prompt_id_here
```

Optional configuration:

```env
OPENAI_REALTIME_MODEL=gpt-4o-realtime-preview-2024-12-17
OPENAI_GPT4_MODEL=gpt-4
OPENAI_IMAGE_MODEL=dall-e-3
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Click **"Start Conversation"**
2. Grant microphone permission when prompted
3. Tell Picasso what you want to create
4. Answer follow-up questions (up to 5)
5. Say **"generate my image"** or click the button
6. Wait 30-60 seconds for your image
7. Download and enjoy!

## Project Structure

```
picasso-2/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Main application page
│   │   ├── layout.tsx                  # Root layout
│   │   ├── globals.css                 # Global styles + Tailwind
│   │   └── api/
│   │       ├── realtime/
│   │       │   ├── route.ts            # SDP proxy
│   │       │   └── token/
│   │       │       └── route.ts        # Ephemeral token generation
│   │       ├── compile-prompt/
│   │       │   └── route.ts            # GPT-4 prompt compilation
│   │       └── generate-image/
│   │           └── route.ts            # DALL-E 3 generation
│   ├── components/
│   │   ├── VoiceClient.tsx             # WebRTC Realtime client
│   │   ├── VoiceVisualizer.tsx         # Audio activity visualization
│   │   ├── TranscriptPanel.tsx         # Conversation history
│   │   ├── ImageCanvas.tsx             # Image display component
│   │   ├── PromptDisplay.tsx           # Show compiled prompt
│   │   └── DownloadButton.tsx          # Image download
│   └── lib/
│       ├── prompts.ts                  # System prompts (GPT-4)
│       └── types.ts                    # TypeScript definitions
├── public/
├── .env.example                        # Environment template
├── .env.local                          # Local secrets (gitignored)
├── package.json
└── README.md
```

## How It Works

### Architecture Overview

```
User Browser          Your Backend          OpenAI
    │                      │                  │
    │  1. Request token    │                  │
    │─────────────────────>│                  │
    │                      │  2. Create       │
    │                      │  session         │
    │                      │─────────────────>│
    │                      │                  │
    │                      │  3. Token        │
    │                      │<─────────────────│
    │  4. Return token     │                  │
    │<─────────────────────│                  │
    │                                         │
    │  5. WebRTC connection                  │
    │────────────────────────────────────────>│
    │                                         │
    │  6. Voice conversation                 │
    │<═══════════════════════════════════════>│
```

### Security

- **API key stays on server** - never exposed to browser
- **Ephemeral tokens** - temporary credentials that expire
- **WebRTC direct connection** - low-latency audio streaming
- **Token-based authentication** - no API keys in browser

### Workflow

1. **Voice Conversation**: User speaks with Picasso AI agent
2. **Transcript Capture**: Conversation is transcribed in real-time
3. **Prompt Compilation**: GPT-4 converts transcript into optimized image prompt
4. **Image Generation**: DALL-E 3 creates image from compiled prompt
5. **Display & Download**: Image shown with prompt and download option

## Deployment to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo>
git push -u origin main
```

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Configure environment variables:
   - `OPENAI_API_KEY`
   - `OPENAI_REALTIME_PROMPT_ID`
4. Click "Deploy"

### 3. Configure Environment Variables in Vercel

In Vercel Dashboard → Project Settings → Environment Variables:

```
OPENAI_API_KEY=sk-your_real_api_key_here
OPENAI_REALTIME_PROMPT_ID=pmpt_your_prompt_id_here
```

## Cost Per Session

Approximate costs per completed image generation:

- **Voice Conversation** (3 min): ~$0.90
- **Prompt Compilation**: ~$0.02
- **Image Generation** (standard): ~$0.04
- **Total**: ~$0.96 per session

## Troubleshooting

### Microphone Not Working

- Ensure browser has microphone permission
- Check browser console for errors
- Try refreshing the page
- Test in Chrome/Edge (best WebRTC support)

### Voice Not Connecting

- Verify `OPENAI_API_KEY` is correct
- Verify `OPENAI_REALTIME_PROMPT_ID` is set
- Check you have Realtime API access enabled
- Check browser console for error messages

### Image Generation Fails

- Check OpenAI API billing/quota
- Verify DALL-E 3 access is enabled
- Check browser console for errors
- Ensure conversation transcript is captured

### "OPENAI_REALTIME_PROMPT_ID not configured"

- You must create a prompt in OpenAI Playground first
- Follow the setup steps above to create and publish your prompt
- Copy the prompt ID (starts with `pmpt_`)
- Add it to `.env.local`

## Browser Compatibility

- ✅ Chrome/Edge (Recommended)
- ✅ Safari (Desktop & iOS)
- ✅ Firefox
- ⚠️ Older browsers may not support WebRTC

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Key Technologies

- **WebRTC**: Browser API for real-time audio streaming
- **RTCPeerConnection**: Peer-to-peer media connection
- **RTCDataChannel**: Bidirectional data channel for events
- **OpenAI Realtime API**: Voice conversation infrastructure
- **Ephemeral Tokens**: Temporary authentication credentials

## Future Enhancements

- [ ] Text fallback if voice fails
- [ ] Multiple image variations
- [ ] Style presets and templates
- [ ] Image history gallery
- [ ] Edit & regenerate functionality
- [ ] User accounts and saved images

## Documentation

- [OpenAI Realtime API](https://platform.openai.com/docs/guides/realtime)
- [OpenAI Playground](https://platform.openai.com/playground)
- [DALL-E 3 Documentation](https://platform.openai.com/docs/guides/images)
- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Deployment](https://vercel.com/docs)

## License

MIT

## Support

For issues and questions:
1. Check the troubleshooting section above
2. Review OpenAI API status
3. Check browser console for error messages
4. Ensure all environment variables are set correctly

---

**Built with ❤️ using OpenAI's Realtime API, GPT-4, and DALL-E 3**

