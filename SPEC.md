# Picasso - AI Image Generation Web Application
## Specification Document v3.0

---

## 1. Project Overview

Picasso is a web application that helps users craft detailed prompts for AI image generation through a **natural voice conversation**. The application uses **OpenAI's Realtime API** with a hosted conversational prompt to guide users through the creative process, compiles their responses into an optimized prompt using GPT-4, and generates images using OpenAI's DALL-E 3.

### Core Value Proposition
- **Intuitive Image Creation**: Users don't need to know how to write good prompts - the AI voice agent guides them
- **Natural Voice Conversation**: Speak naturally to the AI, no typing required
- **High-Quality Results**: AI-optimized prompts ensure better image generation outcomes
- **Simple Architecture**: Leverages OpenAI's infrastructure for voice + image in one ecosystem

---

## 2. Technical Architecture

### Frontend Framework
- **Next.js 14+** (App Router)
  - Server-side rendering for optimal performance
  - Built-in API routes for secure API key handling and token generation
  - Excellent Vercel deployment integration
  - TypeScript for type safety

### Styling
- **Tailwind CSS** for responsive, mobile-first design
- Simple, clean aesthetic focusing on functionality

### State Management
- React hooks (useState, useEffect) for local state
- No complex state management needed for MVP

### APIs Integrated
1. **OpenAI Realtime API** - Voice conversation agent (WebRTC-based)
2. **OpenAI GPT-4** - Prompt compilation and optimization
3. **OpenAI DALL-E 3** - Image generation

### Voice Architecture (OpenAI Realtime)

#### Security Model: Ephemeral Tokens
```
User Browser                   Your Backend                OpenAI
     │                              │                         │
     │  1. Request token             │                         │
     │─────────────────────────────>│                         │
     │                               │  2. Create session      │
     │                               │  (with prompt_id)       │
     │                               │────────────────────────>│
     │                               │                         │
     │                               │  3. Ephemeral token     │
     │                               │<────────────────────────│
     │  4. Return token              │                         │
     │<──────────────────────────────│                         │
     │                                                         │
     │  5. Connect with token (WebRTC)                        │
     │─────────────────────────────────────────────────────────>│
     │                                                         │
     │  6. Voice conversation                                 │
     │<════════════════════════════════════════════════════════>│
```

**Key Points:**
- Your **OpenAI API key stays on the server** (never exposed to browser)
- Backend requests ephemeral `client_secret` from OpenAI
- Frontend uses temporary token to connect directly via WebRTC
- Token expires after session ends
- Follows survive-ai reference implementation pattern

#### Hosted Prompt Configuration
- **Prompt ID**: Created in OpenAI Playground/Dashboard
- **Format**: `pmpt_abc123` (example)
- Prompt contains all conversation logic, personality, and question flow
- **No client-side prompt engineering** - OpenAI hosts the intelligence
- Update prompt in OpenAI dashboard without redeploying app

---

## 3. Features & Functionality

### 3.1 Voice Conversation (OpenAI Realtime API)

#### How It Works
1. User grants microphone permission
2. Backend requests ephemeral session token from OpenAI (with `prompt_id`)
3. Frontend establishes WebRTC connection using token
4. Real-time bidirectional voice conversation begins
5. OpenAI's hosted prompt controls the entire conversation flow
6. Transcripts captured for prompt compilation

#### Hosted Prompt Instructions

The OpenAI Realtime Prompt (configured in OpenAI Playground) will contain these instructions:

```
You are an expert art director helping users create detailed prompts for 
AI image generation through a natural voice conversation.

Your goal is to gather information to build an excellent image prompt. 
Ask up to 5 questions maximum, but adapt based on what the user provides. 
Keep your responses concise (1-2 sentences).

CONVERSATION STRUCTURE:
1. Greeting: "Hi! I'm Picasso, your AI art director. Let's create something 
   amazing together. What would you like to create today?"

2. Information to Gather (up to 5 questions):
   - Main subject (what they want to create)
   - Artistic style (photorealistic, painting, digital art, etc.)
   - Setting or background
   - Mood, atmosphere, and lighting
   - Specific details or elements to include

3. Adaptive Flow:
   - If user provides multiple details in one answer, acknowledge and skip 
     redundant questions
   - If user is vague, gently encourage specificity
   - If user asks to skip, respond: "No problem! We can work with what we have."
   - After gathering sufficient info (or 5 questions), say: 
     "Perfect! I have what I need. Say 'generate my image' when you're ready!"

4. Generation Trigger:
   - Listen for: "generate", "create it", "make my image", "I'm ready"
   - Respond: "Great! I'm crafting your prompt and generating your image now. 
     This will take about 30-60 seconds..."

TONE & PERSONALITY:
- Friendly, enthusiastic, encouraging
- Artist-like persona: knowledgeable but approachable
- Show genuine interest in their creative vision
- Be concise - keep responses to 1-2 sentences
- Use natural, conversational language

EXAMPLE CONVERSATION:
You: Hi! I'm Picasso. What would you like to create today?
User: A dog in a park
You: Lovely! What kind of dog?
User: A golden retriever puppy
You: Perfect! What style - realistic photo or more artistic?
User: Realistic
You: Great! What's the setting like? Time of day, weather?
User: Sunny morning, bright and cheerful
You: Beautiful! Ready to generate, or any other details to add?
User: Generate it!
You: Fantastic! Generating your image now...
```

#### Voice Client Implementation
- **WebRTC** for real-time audio streaming
- **RTCPeerConnection** for bidirectional media
- **DataChannel** for events and transcripts
- **Server-side SDP proxy** (`/api/realtime`) to secure API key
- **Token endpoint** (`/api/realtime/token`) for ephemeral credentials
- Based on survive-ai's `VoiceClient.tsx` pattern

#### User Experience
- **Microphone permission** requested on start
- **Visual indicators** for connection status, listening, speaking
- **Live transcripts** displayed for accessibility
- **Mute toggle** to pause conversation
- **Fallback to text** if voice setup fails (browser compatibility)
- **Loading commentary** during image generation

### 3.2 Prompt Compilation (GPT-4)

#### Intelligent Compilation
- **Not simple concatenation** - GPT-4 processes conversation transcript intelligently
- Follows evidence-based best practices for image generation prompts
- Structured output format optimized for DALL-E 3
- Natural language processing to extract key elements from voice conversation

#### Research-Backed Prompt Best Practices

**Core Principles:**
1. **Optimal Length**: Target 15-50 words for best results
   - Concise yet detailed enough to guide the AI
   - Avoid overly long prompts that dilute focus
   - Each word should add meaningful information

2. **Natural Language Approach**: Use conversational, descriptive language
   - Write as if describing the scene to another person
   - Include sensory details (textures, colors, emotions)
   - Avoid technical jargon unless style-appropriate

3. **Positive Instructions Only**: Focus on what to include, not exclude
   - AI models respond better to positive direction
   - Example: "bright colors" not "not dark colors"
   - Describe desired elements rather than unwanted ones

4. **Clear Hierarchical Structure**: Organized information flow
   - Style/Medium comes first (sets the visual framework)
   - Subject with specific details (the what)
   - Setting and context (the where)
   - Lighting and mood (the atmosphere)
   - Composition and quality modifiers (the how)

5. **Specificity Over Vagueness**: Concrete, detailed descriptions
   - "Golden retriever puppy" not "dog"
   - "Sunset over a calm ocean" not "nice scenery"
   - "Soft morning light filtering through trees" not "good lighting"

6. **Sensory and Emotional Details**: Engage multiple senses
   - Visual: colors, textures, patterns
   - Emotional: mood, atmosphere, feeling
   - Physical: materials, surfaces, temperatures (implied visually)

#### Essential Components to Extract from Conversation

1. **Style/Medium** (Always First)
   - Artistic style: photorealistic, watercolor, oil painting, digital art, sketch
   - Medium specifics: 3D render, photography, illustration
   - Style references: "in the style of [artist]", art movement

2. **Subject Description** (Core Focus)
   - Main subject clearly identified
   - Specific characteristics and details
   - Action or pose if applicable

3. **Setting/Environment** (Context)
   - Location and background
   - Time of day, season, weather
   - Environmental details and props

4. **Lighting Conditions** (Critical for Quality)
   - Specific lighting: golden hour, studio lighting, backlit
   - Light quality: soft, dramatic, diffused, harsh
   - Light direction and color temperature

5. **Mood/Atmosphere** (Emotional Tone)
   - Emotional qualities: serene, energetic, mysterious, joyful
   - Color palette implications
   - Overall feeling or vibe

6. **Composition Details** (Professional Touch)
   - Camera angle: close-up, wide shot, aerial view
   - Framing: rule of thirds, centered, symmetry
   - Perspective and depth

7. **Quality Modifiers** (Enhancement Keywords)
   - Detail level: highly detailed, intricate, sharp focus
   - Technical quality: 4K, 8K, high resolution
   - Professional markers: award-winning, masterpiece, professional

#### Example Prompt Structure
```
[Style/Medium], [Subject with details], [Action/State], 
[Setting/Environment with specifics], [Lighting description], 
[Mood/Atmosphere], [Composition notes], [Quality modifiers]
```

#### Example Compiled Prompts

**Example 1 - Photorealistic**:
```
Professional nature photography, a serene mountain lake reflecting 
snow-capped peaks, golden hour lighting casting warm tones across 
still water, peaceful atmosphere, rule of thirds composition, 
highly detailed, 8K quality
```
(42 words - optimal length)

**Example 2 - Artistic**:
```
Watercolor painting, a Victorian-era botanist examining exotic plants 
in a lush greenhouse, soft dappled sunlight filtering through glass 
panes, tranquil mood, delicate brush strokes, intricate botanical details
```
(32 words - optimal length)

**Example 3 - Digital Art**:
```
Digital illustration, fantasy warrior with glowing enchanted sword, 
standing in mystical forest clearing, dramatic lighting from weapon 
illuminating surrounding trees, cool blue and purple color scheme, 
dynamic heroic pose, trending on artstation
```
(38 words - optimal length)

#### GPT-4 System Prompt for Compilation

```
You are an expert prompt engineer specializing in AI image generation. Your task 
is to analyze a voice conversation transcript and compile it into a single, highly 
effective image generation prompt optimized for DALL-E 3.

CRITICAL REQUIREMENTS:

1. LENGTH: Target 30-40 words (minimum 15, maximum 50)
   - Every word must add meaningful information
   - Concise yet detailed prompts perform best

2. STRUCTURE (Follow this exact order):
   [Style/Medium], [Subject with specific details], [Setting/Environment], 
   [Lighting description], [Mood/Atmosphere], [Composition], [Quality modifiers]

3. STYLE/MEDIUM FIRST (MANDATORY):
   - Always begin with the artistic style or medium
   - Examples: "Photorealistic photography", "Impressionist oil painting", 
     "Digital illustration", "3D render", "Watercolor painting"

4. USE POSITIVE LANGUAGE ONLY:
   - Describe what you WANT, never what you DON'T want
   - ✅ "Bright, vibrant colors" ❌ "Not dark colors"

5. BE SPECIFIC, NOT VAGUE:
   - ✅ "Golden retriever puppy with fluffy coat" ❌ "Dog"
   - ✅ "Soft morning light filtering through pine trees" ❌ "Nice lighting"

6. INCLUDE SENSORY & EMOTIONAL DETAILS:
   - Colors, textures, materials, patterns
   - Mood, atmosphere, feeling, emotional tone

7. LIGHTING IS CRITICAL:
   - Always specify lighting when possible
   - Use specific terms: "golden hour", "studio lighting", "soft ambient", 
     "dramatic shadows", "backlit", "dappled sunlight"

8. ADD QUALITY MODIFIERS:
   - Include 1-2 quality keywords: "highly detailed", "8K quality", 
     "professional", "sharp focus", "intricate details"

9. NATURAL, CONVERSATIONAL LANGUAGE:
   - Write as if describing the scene to another person
   - Avoid robotic or overly technical phrasing

10. AVOID THESE PITFALLS:
    - Contradictory details
    - Multiple competing subjects
    - Conflicting style directions
    - Negative phrasing
    - Vague descriptions

HANDLING INCOMPLETE INFORMATION:
- Work with whatever information the user provided
- If style is missing, choose based on subject context
- If lighting is missing, add appropriate lighting for the style/setting
- Prioritize what the user explicitly mentioned
- Don't add elements the user didn't request

CONVERSATION TRANSCRIPT:
[Transcript will be inserted here]

OUTPUT INSTRUCTIONS:
- Respond with ONLY the final image prompt
- No explanations, no other text
- Single paragraph, natural flow
- 30-40 words ideal (15-50 word range)
- Follow structure: Style → Subject → Setting → Lighting → Mood → Composition → Quality
```

#### API Integration Flow
```javascript
// 1. Extract conversation transcript from Realtime session
const transcript = conversationHistory.join('\n');

// 2. Send to GPT-4 for compilation
const response = await openai.chat.completions.create({
  model: 'gpt-4',
  messages: [
    { role: 'system', content: COMPILATION_SYSTEM_PROMPT },
    { role: 'user', content: transcript }
  ],
  temperature: 0.7,
  max_tokens: 200
});

const compiledPrompt = response.choices[0].message.content;

// 3. Use compiled prompt for image generation (see 3.3)
```

### 3.3 Image Generation (DALL-E 3)

#### Model Specifications
- **Model**: `dall-e-3` (OpenAI's latest image generation model)
- **Resolution**: 1024x1024 pixels (square) or 1792x1024 (landscape) or 1024x1792 (portrait)
- **Quality**: `standard` or `hd` (high definition)
- **Style**: `vivid` (default) or `natural`
- **Format**: PNG or URL

#### API Integration
```javascript
const image = await openai.images.generate({
  model: 'dall-e-3',
  prompt: compiledPrompt,
  n: 1,
  size: '1024x1024',
  quality: 'standard',
  response_format: 'url'
});

const imageUrl = image.data[0].url;
```

- Endpoint: `POST https://api.openai.com/v1/images/generations`
- Secure API key handling via Next.js API routes
- Error handling for rate limits, API errors, timeouts
- **Expected Response Time**: 30-60 seconds

#### Loading States During Generation
1. Voice agent announces: "I'm generating your image now..."
2. Visual loading indicator on canvas
3. Optional: Voice agent provides engaging commentary every 10-15 seconds
   - "The AI is working on your masterpiece..."
   - "Almost there..."
4. Success: Image appears, agent says "Here's your image! What do you think?"

### 3.4 Image Display & Download

#### Image Canvas (Left Panel)
- Display generated image at full resolution
- Responsive sizing (maintain aspect ratio)
- Clean presentation with minimal chrome
- Empty state: "Your image will appear here"
- Loading state: Animated spinner with status text
- Success state: Full image display

#### Prompt Display
- Text box showing the final compiled prompt used
- Read-only display
- Label: "Generated Prompt:"
- Copy-to-clipboard button

#### Download Feature
- Download button below image
- Downloads as PNG with descriptive filename
- Format: `picasso-[timestamp].png`
- Button disabled until image is generated

---

## 4. User Interface Specifications

### 4.1 Layout

#### Desktop View (≥768px)
```
┌─────────────────────────────────────────────┐
│         Header: "Picasso" Logo               │
├──────────────────┬──────────────────────────┤
│                  │                           │
│   Image Canvas   │   Voice Conversation     │
│   (Left Panel)   │   (Right Panel)          │
│                  │                           │
│  - Generated     │  - Voice Visualizer      │
│    Image         │  - Connection Status     │
│  - Prompt Box    │  - Live Transcripts      │
│  - Download Btn  │  - Mute Button           │
│                  │  - Generate Button       │
│                  │  - Reset Button          │
│                  │                           │
└──────────────────┴──────────────────────────┘
```

#### Mobile View (<768px)
```
┌─────────────────────┐
│   Header: "Picasso" │
├─────────────────────┤
│                     │
│  Voice Panel        │
│  (Top, Full Width)  │
│  - Visualizer       │
│  - Transcripts      │
│  - Controls         │
│                     │
├─────────────────────┤
│                     │
│  Image Canvas       │
│  (Bottom)           │
│  - Generated Image  │
│  - Prompt Display   │
│  - Download         │
│                     │
└─────────────────────┘
```

### 4.2 Components

#### Header
- Simple branding: "Picasso" with palette icon
- Minimal design, doesn't distract from main content
- Subtitle: "AI Image Generation with Voice"

#### Voice Conversation Panel (Right/Top)
- **Connection Status**: Visual indicator (connected/disconnected)
- **Voice Visualizer**: Animated waveform or circle showing audio activity
  - Pulsing when AI is speaking
  - Active when user is speaking
  - Idle when silent
- **Live Transcripts**: Scrollable conversation history
  - User messages in one style
  - AI responses in another
  - Auto-scroll to latest
- **Mute Button**: Toggle microphone on/off
- **Generate Button**: Manually trigger generation (also voice-activated)
- **Reset Button**: Start new conversation

#### Image Canvas (Left/Bottom)
- **Empty State**: "Your image will appear here. Start a conversation to create something amazing!"
- **Loading State**: 
  - Animated spinner or progress indicator
  - Status text: "Generating your image... (30-60 seconds)"
  - Optional: Voice agent commentary
- **Success State**: Full-resolution image display
- **Error State**: Friendly error message with retry option

#### Prompt Display Box
- Shows final compiled prompt
- Read-only text area with copy button
- Label: "Generated Prompt:"
- Subtle styling, not competing with image

#### Download Button
- Icon + Text: "Download Image"
- Disabled until image is generated
- Primary button styling
- Triggers PNG download

### 4.3 Design System

#### Color Palette
- **Primary**: Teal/Blue (#14B8A6 or #3B82F6)
- **Background**: White/Light Gray (#FFFFFF / #F9FAFB)
- **Text**: Dark Gray (#111827)
- **Secondary**: Medium Gray (#6B7280)
- **Accent**: Green for connected (#10B981), Red for disconnected (#EF4444)

#### Typography
- **Font**: System font stack or Inter
- **Headings**: Bold, clear hierarchy
- **Body**: 16px base for readability
- **Monospace**: For prompt display

#### Spacing
- Consistent spacing scale (4px, 8px, 16px, 24px, 32px)
- Generous padding for mobile (min 44x44px touch targets)

#### Responsive Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

---

## 5. API Integration Details

### 5.1 OpenAI Realtime API

#### Required Configuration
- **API Key**: `OPENAI_API_KEY` (server-side only, never exposed)
- **Prompt ID**: `OPENAI_REALTIME_PROMPT_ID=pmpt_abc123`
- **Model**: `gpt-4o-realtime-preview-2024-12-17`

#### Endpoint 1: Token Generation (`/api/realtime/token`)
```typescript
// POST /api/realtime/token
// Purpose: Request ephemeral session token from OpenAI

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  const promptId = process.env.OPENAI_REALTIME_PROMPT_ID;

  const response = await fetch('https://api.openai.com/v1/realtime/sessions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'OpenAI-Beta': 'realtime=v1'
    },
    body: JSON.stringify({
      model: 'gpt-4o-realtime-preview-2024-12-17',
      prompt: { id: promptId },
      input_audio_transcription: { model: 'whisper-1' }
    })
  });

  const json = await response.json();
  
  return NextResponse.json({
    client_secret: json.client_secret,
    model: json.model,
    id: json.id,
    expires_at: json.client_secret?.expires_at
  });
}
```

#### Endpoint 2: SDP Proxy (`/api/realtime`)
```typescript
// POST /api/realtime
// Purpose: Proxy WebRTC SDP offer/answer to OpenAI (hides API key)

export async function POST(req: NextRequest) {
  const ephemeralKey = req.headers.get('x-ephemeral-key');
  const apiKey = ephemeralKey || process.env.OPENAI_API_KEY;
  const model = new URL(req.url).searchParams.get('model') || 
                'gpt-4o-realtime-preview-2024-12-17';
  
  const sdpOffer = await req.text();

  const response = await fetch(
    `https://api.openai.com/v1/realtime?model=${encodeURIComponent(model)}`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/sdp',
        'OpenAI-Beta': 'realtime=v1'
      },
      body: sdpOffer
    }
  );

  const answerSdp = await response.text();
  return new Response(answerSdp, {
    status: response.status,
    headers: { 'content-type': 'application/sdp' }
  });
}
```

#### VoiceClient Component Architecture
```typescript
// components/VoiceClient.tsx
// Based on survive-ai's implementation

export function VoiceClient({ 
  onTranscript, 
  onReady, 
  onStatus 
}: VoiceClientProps) {
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dcRef = useRef<RTCDataChannel | null>(null);
  
  useEffect(() => {
    async function setupRealtime() {
      // 1. Get microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // 2. Fetch ephemeral token
      const tokenRes = await fetch('/api/realtime/token', { method: 'POST' });
      const { client_secret } = await tokenRes.json();
      
      // 3. Setup WebRTC
      const pc = new RTCPeerConnection();
      stream.getTracks().forEach(track => pc.addTrack(track, stream));
      
      // 4. Handle incoming audio
      pc.ontrack = (event) => {
        const audio = new Audio();
        audio.srcObject = event.streams[0];
        audio.play();
      };
      
      // 5. Setup data channel for events
      const dc = pc.createDataChannel('oai-events');
      dc.onmessage = (event) => {
        const message = JSON.parse(event.data);
        handleRealtimeEvent(message); // Transcripts, status, etc.
      };
      
      // 6. Create offer and connect
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      
      const response = await fetch('/api/realtime', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/sdp',
          'X-Ephemeral-Key': client_secret.value
        },
        body: offer.sdp
      });
      
      const answerSdp = await response.text();
      await pc.setRemoteDescription({ type: 'answer', sdp: answerSdp });
      
      pcRef.current = pc;
      dcRef.current = dc;
    }
    
    setupRealtime();
    
    return () => {
      // Cleanup
      pcRef.current?.close();
      dcRef.current?.close();
    };
  }, []);
  
  return <VoiceVisualizer />;
}
```

### 5.2 OpenAI GPT-4 API

#### Endpoint: Prompt Compilation (`/api/compile-prompt`)
```typescript
// POST /api/compile-prompt
// Purpose: Convert conversation transcript to optimized image prompt

import { OpenAI } from 'openai';

export async function POST(req: NextRequest) {
  const { transcript } = await req.json();
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: COMPILATION_SYSTEM_PROMPT },
      { role: 'user', content: transcript }
    ],
    temperature: 0.7,
    max_tokens: 200
  });

  return NextResponse.json({ 
    prompt: completion.choices[0].message.content 
  });
}
```

### 5.3 OpenAI DALL-E 3 API

#### Endpoint: Image Generation (`/api/generate-image`)
```typescript
// POST /api/generate-image
// Purpose: Generate image from compiled prompt

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const image = await openai.images.generate({
    model: 'dall-e-3',
    prompt,
    n: 1,
    size: '1024x1024',
    quality: 'standard',
    response_format: 'url'
  });

  return NextResponse.json({
    imageUrl: image.data[0].url,
    revisedPrompt: image.data[0].revised_prompt // DALL-E sometimes modifies
  });
}
```

### 5.4 Environment Variables

**`.env.example`**:
```env
# OpenAI Configuration (Server-side only - NEVER expose to browser)
OPENAI_API_KEY=sk-your_openai_api_key_here

# OpenAI Realtime Prompt Configuration
# Create your prompt in OpenAI Playground, then get the prompt ID
# Format: pmpt_abc123
OPENAI_REALTIME_PROMPT_ID=pmpt_your_prompt_id_here

# Optional: Model Configuration
OPENAI_REALTIME_MODEL=gpt-4o-realtime-preview-2024-12-17
OPENAI_GPT4_MODEL=gpt-4
OPENAI_IMAGE_MODEL=dall-e-3

# Application Configuration
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Security Notes:**
- ❌ **NEVER** use `NEXT_PUBLIC_` prefix for `OPENAI_API_KEY`
- ✅ All OpenAI keys stay server-side
- ✅ Frontend only receives ephemeral tokens
- ✅ Tokens expire automatically
- ✅ No API keys in browser/network inspector

---

## 6. User Flow

### 6.1 Initial State
1. User lands on homepage
2. Voice panel shows "Connect" button
3. Image canvas shows empty state
4. User clicks "Start Conversation"

### 6.2 Connection Phase
1. Browser requests microphone permission
2. App fetches ephemeral token from backend
3. WebRTC connection establishes
4. Voice agent greets: "Hi! I'm Picasso. What would you like to create today?"
5. Visual indicator shows "Connected" and voice activity

### 6.3 Conversation Phase
1. User speaks their idea
2. Live transcript appears in conversation panel
3. Voice agent responds (up to 5 questions)
4. User can:
   - Continue speaking naturally
   - Ask to skip questions
   - Say "generate" to trigger early
5. Agent adapts based on responses
6. After sufficient info: "Perfect! Say 'generate my image' when ready!"

### 6.4 Generation Phase
1. User says "generate my image" (or clicks button)
2. Agent responds: "I'm generating your image now..."
3. App workflow:
   - Extract conversation transcript
   - Send to GPT-4 for prompt compilation
   - Display compiled prompt to user
   - Send prompt to DALL-E 3
   - Show loading state (30-60 seconds)
4. Optional: Agent provides updates every 15 seconds

### 6.5 Result Phase
1. Generated image appears on canvas
2. Agent says: "Here's your image! What do you think?"
3. Download button becomes active
4. User can:
   - Download image
   - View compiled prompt
   - Start over (reset conversation)

### 6.6 Error Handling
- **Microphone Permission Denied**: 
  - Show message: "Microphone access required for voice conversation"
  - Offer text fallback (future enhancement)
- **Connection Failed**: 
  - "Unable to connect to voice service. Please refresh and try again."
- **API Errors**: 
  - "Oops! Something went wrong. Let's try that again."
  - Retry button
- **Rate Limits**: 
  - "Service is busy. Please wait a moment and try again."
- **Generation Timeout**: 
  - "Image generation is taking longer than expected. Please try again."

---

## 7. Technical Implementation Plan

### 7.1 Project Structure
```
picasso/
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
│   ├── lib/
│   │   ├── openai.ts                   # OpenAI client utilities
│   │   ├── prompts.ts                  # System prompts (GPT-4)
│   │   └── types.ts                    # TypeScript definitions
│   └── hooks/
│       ├── useVoiceConversation.ts     # Manage voice state
│       └── useImageGeneration.ts       # Image generation state
├── public/
│   └── icons/                          # App icons
├── .env.example                        # Environment template
├── .env.local                          # Local secrets (gitignored)
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── package.json
└── README.md
```

### 7.2 Key Dependencies
```json
{
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "openai": "^4.0.0",
    "typescript": "^5.0.0",
    "tailwindcss": "^3.4.0",
    "lucide-react": "^0.294.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0",
    "autoprefixer": "^10.0.0",
    "postcss": "^8.0.0"
  }
}
```

**Note:** No special SDK needed for Realtime API - native WebRTC APIs work!

### 7.3 Implementation Phases

#### Phase 1: Core Voice Infrastructure
1. Set up Next.js project with TypeScript and Tailwind
2. Implement `/api/realtime/token` endpoint
3. Implement `/api/realtime` SDP proxy
4. Build `VoiceClient.tsx` with WebRTC connection
5. Test voice connection and transcription

#### Phase 2: OpenAI Playground Prompt Configuration
1. Create Realtime Prompt in OpenAI Playground
2. Configure conversation flow and personality
3. Test prompt with various inputs
4. Extract prompt ID for environment variable

#### Phase 3: Prompt Compilation
1. Implement `/api/compile-prompt` endpoint
2. Create GPT-4 system prompt (Section 3.2)
3. Test compilation with various conversation transcripts
4. Validate output quality

#### Phase 4: Image Generation
1. Implement `/api/generate-image` endpoint
2. Integrate DALL-E 3 API
3. Handle loading states and errors
4. Test with various prompts

#### Phase 5: UI/UX Polish
1. Build `ImageCanvas` with loading states
2. Create `TranscriptPanel` for conversation history
3. Add `VoiceVisualizer` for audio activity
4. Implement download functionality
5. Add responsive design and mobile support

#### Phase 6: Error Handling & Edge Cases
1. Handle microphone permission denial
2. Implement graceful API error recovery
3. Add retry mechanisms
4. Test browser compatibility

#### Phase 7: Deployment
1. Test locally with production build
2. Configure Vercel environment variables
3. Deploy to Vercel
4. Test production deployment

---

## 8. Deployment Strategy

### 8.1 GitHub Repository Setup
1. Initialize Git repository
2. Create `.gitignore`:
   ```
   .env.local
   .env
   node_modules/
   .next/
   out/
   .DS_Store
   ```
3. Push to GitHub
4. Branch strategy:
   - `main` - production (auto-deploys to Vercel)
   - `dev` - development
   - Feature branches for new work

### 8.2 Vercel Deployment

#### Environment Variables (Vercel Dashboard)
```
OPENAI_API_KEY=sk-your_real_api_key_here
OPENAI_REALTIME_PROMPT_ID=pmpt_your_prompt_id_here
OPENAI_REALTIME_MODEL=gpt-4o-realtime-preview-2024-12-17
OPENAI_GPT4_MODEL=gpt-4
OPENAI_IMAGE_MODEL=dall-e-3
```

#### Build Configuration
- **Framework**: Next.js
- **Build Command**: `npm run build` (default)
- **Output Directory**: `.next` (default)
- **Install Command**: `npm install` (default)
- **Node Version**: 18.x or higher

#### Deployment Steps
1. Connect GitHub repo to Vercel
2. Configure environment variables in Vercel dashboard
3. Set production branch to `main`
4. Enable automatic deployments
5. Preview deployments for PRs (optional)

### 8.3 Post-Deployment Checklist
- [ ] Voice connection works in production
- [ ] Microphone permission prompt appears
- [ ] Transcripts are captured correctly
- [ ] Image generation completes successfully
- [ ] Download functionality works
- [ ] Mobile responsive design works
- [ ] HTTPS enabled (Vercel default)
- [ ] Error handling displays friendly messages

### 8.4 Monitoring & Maintenance
- Monitor Vercel logs for errors
- Track OpenAI API usage and costs
- Monitor WebRTC connection success rate
- Gather user feedback for prompt quality
- Update hosted prompt in OpenAI dashboard as needed (no redeploy!)

---

## 9. OpenAI Playground: Creating the Hosted Prompt

### 9.1 Accessing OpenAI Playground
1. Go to [platform.openai.com](https://platform.openai.com)
2. Navigate to **Playground** > **Realtime**
3. Select model: `gpt-4o-realtime-preview-2024-12-17`

### 9.2 Configuring the Prompt

#### System Instructions
Paste the following into the "Instructions" field:

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

EXAMPLE FLOW:
You: "Hi! I'm Picasso. What would you like to create today?"
User: "A dog in a park"
You: "Lovely! What kind of dog are we talking about?"
User: "A golden retriever puppy"
You: "Perfect! What style - realistic photo or more artistic?"
User: "Realistic"
You: "Great! Tell me about the setting. Time of day, weather?"
User: "Sunny morning, bright and cheerful"
You: "Beautiful! Any other details, or ready to generate?"
User: "Generate it!"
You: "Fantastic! Generating your image now..."
```

#### Voice Settings
- **Voice**: Choose a friendly, clear voice (e.g., "Alloy" or "Nova")
- **Speed**: 1.0 (normal)
- **Temperature**: 0.8 (balanced creativity)

#### Audio Settings
- **Input Audio Transcription**: Enable with `whisper-1`
- **Turn Detection**: Enable Server VAD (Voice Activity Detection)
  - Threshold: 0.5
  - Prefix padding: 300ms
  - Silence duration: 500ms

### 9.3 Testing Your Prompt
1. Click "Connect" in Playground
2. Grant microphone permission
3. Test conversation flow:
   - Does it greet naturally?
   - Does it ask relevant questions?
   - Does it adapt to detailed vs. vague responses?
   - Does it recognize generation trigger words?
4. Refine instructions based on testing

### 9.4 Publishing & Getting Prompt ID
1. Click "Save" in top right
2. Name your prompt: "Picasso Image Generation Agent"
3. Click "Publish" to create a version
4. Copy the **Prompt ID** (format: `pmpt_abc123`)
5. Add to `.env.local`:
   ```
   OPENAI_REALTIME_PROMPT_ID=pmpt_abc123
   ```

### 9.5 Updating the Prompt
**Key Advantage:** You can update the prompt instructions in the Playground 
without redeploying your app!

1. Make changes in Playground
2. Test thoroughly
3. Save and publish new version
4. Latest version is used automatically (unless you pin a specific version)

---

## 10. Testing Strategy

### 10.1 Local Testing Checklist
- [ ] Voice connection establishes successfully
- [ ] Microphone permission prompt appears
- [ ] Audio input is transmitted (test with speaking)
- [ ] AI agent responds with voice
- [ ] Transcripts appear in real-time
- [ ] Conversation follows expected flow
- [ ] "Generate" trigger is recognized
- [ ] GPT-4 prompt compilation works
- [ ] DALL-E 3 generates images
- [ ] Generated image displays correctly
- [ ] Download button saves PNG file
- [ ] Reset button clears state and restarts

### 10.2 Conversation Testing Scenarios

#### Scenario 1: Detailed User
```
Test: User provides detailed information upfront
User: "I want a photorealistic image of a golden retriever puppy in a sunny park"
Expected: Agent should recognize style (photorealistic), subject (puppy), 
setting (park), lighting (sunny), and ask for remaining details or offer to generate
```

#### Scenario 2: Vague User
```
Test: User provides minimal information
User: "Something cool"
Expected: Agent should guide user to be more specific about subject, style, etc.
```

#### Scenario 3: Early Generation Trigger
```
Test: User asks to generate before 5 questions
User: (After 2 questions) "Generate it!"
Expected: Agent should acknowledge and proceed with generation
```

#### Scenario 4: Skipping Questions
```
Test: User doesn't respond or says "skip"
Expected: Agent should move to next question gracefully
```

### 10.3 Browser Compatibility Testing
- [ ] Chrome (latest) - Desktop & Mobile
- [ ] Safari (latest) - Desktop & Mobile
- [ ] Firefox (latest) - Desktop
- [ ] Edge (latest) - Desktop

**Note:** WebRTC support is excellent in modern browsers, but test Safari specifically as it can have quirks.

### 10.4 Error Scenario Testing
- [ ] Microphone permission denied
- [ ] Network connection lost during voice session
- [ ] OpenAI API rate limit exceeded
- [ ] Invalid API key
- [ ] DALL-E generation failure
- [ ] Timeout during image generation

### 10.5 Performance Testing
- [ ] Voice latency is acceptable (<500ms round-trip)
- [ ] Transcripts appear promptly
- [ ] Image generation completes within 60 seconds
- [ ] Page loads quickly on mobile networks
- [ ] No memory leaks during long sessions

---

## 11. Cost Considerations

### 11.1 OpenAI API Pricing (Approximate as of Oct 2025)

#### Realtime API (Voice Conversation)
- **Input Audio**: ~$0.06 per minute
- **Output Audio**: ~$0.24 per minute
- **Text Input/Output**: Standard GPT-4 pricing
- **Typical Conversation**: 2-5 minutes = $0.60 - $1.50

#### GPT-4 (Prompt Compilation)
- **Input**: $0.03 per 1K tokens
- **Output**: $0.06 per 1K tokens
- **Typical Request**: ~500 input tokens, ~100 output = $0.02

#### DALL-E 3 (Image Generation)
- **Standard Quality (1024x1024)**: $0.040 per image
- **HD Quality (1024x1024)**: $0.080 per image

#### Total Cost Per User Session
- Voice Conversation (3 min): ~$0.90
- Prompt Compilation: ~$0.02
- Image Generation (standard): ~$0.04
- **Total**: ~$0.96 per completed session

### 11.2 Cost Optimization Strategies
1. **Limit Conversation Length**: Cap at 5 questions (already in design)
2. **Use Standard Quality**: Default to standard DALL-E quality
3. **Implement Rate Limiting**: Prevent abuse with per-IP limits
4. **Monitor Usage**: Set up billing alerts in OpenAI dashboard
5. **Optimize Prompts**: Shorter conversations = lower costs

---

## 12. Documentation Deliverables

### 12.1 README.md
```markdown
# Picasso - AI Image Generation with Voice

Create stunning AI-generated images through natural voice conversations.

## Features
- 🎤 Natural voice conversation with AI art director
- 🎨 Intelligent prompt compilation using GPT-4
- 🖼️ High-quality image generation with DALL-E 3
- 📥 Download generated images
- 📱 Mobile-friendly responsive design

## Tech Stack
- Next.js 14 (App Router)
- TypeScript
- OpenAI Realtime API (Voice)
- OpenAI GPT-4 (Prompt Compilation)
- OpenAI DALL-E 3 (Image Generation)
- Tailwind CSS
- Vercel (Deployment)

## Setup

### Prerequisites
- Node.js 18+ and npm
- OpenAI API key with access to:
  - Realtime API
  - GPT-4
  - DALL-E 3

### Installation
1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env.local`
4. Configure environment variables (see below)
5. Run development server: `npm run dev`
6. Open http://localhost:3000

### Environment Configuration

#### 1. Get Your OpenAI API Key
- Go to https://platform.openai.com/api-keys
- Create new secret key
- Copy the key (starts with `sk-`)

#### 2. Create Hosted Prompt in OpenAI Playground
- Go to https://platform.openai.com/playground
- Select "Realtime" mode
- Configure prompt instructions (see SPEC.md Section 9)
- Save and publish
- Copy the Prompt ID (format: `pmpt_abc123`)

#### 3. Configure .env.local
```env
OPENAI_API_KEY=sk-your_api_key_here
OPENAI_REALTIME_PROMPT_ID=pmpt_your_prompt_id_here
```

### Deployment to Vercel
1. Push to GitHub
2. Connect repo to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

## Usage
1. Click "Start Conversation"
2. Grant microphone permission
3. Tell the AI what you want to create
4. Answer follow-up questions (up to 5)
5. Say "generate my image" or click the button
6. Wait 30-60 seconds for your image
7. Download and enjoy!

## Cost Per Session
~$0.96 per completed image generation
- Voice: ~$0.90
- Compilation: ~$0.02
- Image: ~$0.04

## Troubleshooting

### Microphone not working
- Ensure browser has mic permission
- Check browser console for errors
- Try refreshing the page

### Voice not connecting
- Verify API key is correct
- Check Vercel environment variables
- Ensure Realtime API access is enabled

### Image generation fails
- Check OpenAI API billing/quota
- Verify DALL-E 3 access
- Check browser console for errors

## License
MIT
```

### 12.2 SETUP_GUIDE.md
Detailed step-by-step guide for configuring OpenAI Playground prompt, including screenshots and troubleshooting.

### 12.3 API_DOCUMENTATION.md
Technical documentation for all API endpoints, request/response formats, and error codes.

---

## 13. Future Enhancements (Post-MVP)

### Phase 2 Features
- **Text Fallback**: Allow typing if voice fails or is unavailable
- **Multiple Variations**: Generate 2-4 images from same prompt
- **Style Presets**: Quick-start templates ("Photorealistic Portrait", "Fantasy Landscape", etc.)
- **Image History**: Gallery of previously generated images
- **Edit & Regenerate**: Modify prompts and regenerate
- **Download Options**: Multiple resolutions and formats
- **Social Sharing**: Share images to social media
- **Custom Voice Settings**: Choose AI voice personality

### Technical Improvements
- **Caching**: Cache compiled prompts for similar conversations
- **Queue System**: Handle multiple simultaneous requests
- **Analytics**: Track popular styles and conversation patterns
- **A/B Testing**: Optimize conversation flow based on data
- **WebSocket Alternative**: Fallback for browsers without WebRTC
- **Progressive Web App**: Offline support and install prompt

### Advanced Features
- **User Accounts**: Save history and preferences
- **Collections**: Organize images into projects
- **Image Editing**: Basic tools (crop, filters, adjustments)
- **Prompt Library**: Browse and reuse successful prompts
- **Collaboration**: Share sessions with others
- **API Access**: Allow developers to integrate Picasso

---

## 14. Success Criteria

### 14.1 MVP Launch Criteria
- [ ] Voice conversation works reliably on desktop and mobile
- [ ] Prompt compilation produces high-quality structured prompts
- [ ] Image generation completes successfully 95%+ of the time
- [ ] Download functionality works across browsers
- [ ] Mobile responsive design is smooth and usable
- [ ] Error handling prevents crashes and provides helpful messages
- [ ] Documentation is complete and accurate
- [ ] Deployed to Vercel and accessible publicly

### 14.2 User Experience Goals
- Conversation feels natural and engaging
- Users understand how to use the app immediately
- Image generation completes within 60 seconds
- Generated images match user expectations 80%+ of the time
- Mobile experience is equally good as desktop
- Error messages are friendly and actionable

### 14.3 Technical Performance Goals
- Voice latency < 500ms round-trip
- Page load time < 2 seconds
- Image generation success rate > 95%
- No memory leaks during extended sessions
- Works in latest Chrome, Safari, Firefox, Edge

---

## 15. Key Differences from Previous Approach

### What Changed from v2.0 (D-ID Version)

#### ❌ Removed
- **D-ID Integration**: Completely removed - no talking head avatar
- **D-ID SDK**: No longer a dependency
- **Video Components**: No video player or avatar video
- **D-ID API Keys**: Not needed
- **Complex Avatar Management**: No SDK connection management

#### ✅ Added
- **OpenAI Realtime API**: Native voice conversation via WebRTC
- **Hosted Prompts**: Conversation logic lives in OpenAI Playground
- **Ephemeral Tokens**: Secure authentication without exposing API keys
- **Direct WebRTC**: Browser-to-OpenAI audio streaming
- **Voice Visualizer**: Audio activity indicators
- **Live Transcripts**: Real-time conversation display

#### 🔄 Changed
- **Architecture**: Simpler, one vendor (OpenAI) for voice + images
- **Security**: Token-based instead of direct API key exposure
- **Conversation Control**: Hosted prompt instead of local logic
- **User Interface**: Voice visualizer instead of talking head video
- **Flexibility**: Update conversation flow without redeploying

### Benefits of New Approach
1. **Simpler Architecture**: One API vendor, fewer integrations
2. **Better Security**: No API keys in browser
3. **More Flexible**: Update prompts without code changes
4. **Unified Ecosystem**: Voice and images from same provider
5. **Lower Complexity**: Native WebRTC, no special SDKs
6. **Faster Development**: Less integration code
7. **Easier Maintenance**: Fewer moving parts

---

## Appendix

### A. Glossary
- **WebRTC**: Web Real-Time Communication - browser API for audio/video streaming
- **SDP**: Session Description Protocol - WebRTC connection negotiation format
- **Ephemeral Token**: Temporary authentication credential that expires
- **Hosted Prompt**: Conversational AI configured in OpenAI Playground
- **DALL-E 3**: OpenAI's latest image generation model
- **GPT-4**: OpenAI's language model for prompt compilation
- **Realtime API**: OpenAI's voice conversation API

### B. References
- OpenAI Realtime API: https://platform.openai.com/docs/guides/realtime
- OpenAI Playground: https://platform.openai.com/playground
- DALL-E 3 Docs: https://platform.openai.com/docs/guides/images
- WebRTC API: https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API
- Next.js Docs: https://nextjs.org/docs
- Vercel Deployment: https://vercel.com/docs

### C. Sample Prompts for Testing

**Test Prompt 1: Simple**
```
User: "A cat on a windowsill"
Expected Output: "Professional photography, tabby cat sitting on wooden windowsill, 
soft natural light from window, peaceful indoor atmosphere, shallow depth of field, 
highly detailed fur texture, 4K quality"
```

**Test Prompt 2: Artistic**
```
User: "Watercolor painting of mountains at sunset"
Expected Output: "Watercolor painting, majestic mountain range at sunset, warm 
oranges and purples blending in sky, soft color washes with subtle gradients, 
serene peaceful mood, traditional illustration style, gallery quality"
```

**Test Prompt 3: Complex**
```
User: "Futuristic city with flying cars at night, cyberpunk style"
Expected Output: "Digital concept art, futuristic cyberpunk cityscape at night, 
towering neon-lit skyscrapers with flying vehicles, vibrant pink and cyan colors, 
dramatic atmospheric perspective, dystopian mood, cinematic composition, highly 
detailed, trending on artstation"
```

---

**Document Version**: 3.0  
**Created**: October 21, 2025  
**Last Updated**: October 21, 2025  
**Status**: Ready for Implementation - OpenAI Realtime Architecture

## Changelog

### Version 3.0 (October 21, 2025) - **Major Revision**
- **Removed**: All D-ID integration and talking head avatar features
- **Added**: OpenAI Realtime API for voice conversations
- **Added**: Hosted prompt configuration in OpenAI Playground
- **Added**: Ephemeral token security model
- **Added**: WebRTC-based voice client architecture
- **Added**: Section 9 - OpenAI Playground setup guide
- **Simplified**: Architecture with single vendor (OpenAI)
- **Enhanced**: Security with server-side API key protection
- **Updated**: All technical diagrams and code examples
- **Retained**: All prompt engineering best practices from v2.0
- **Retained**: GPT-4 compilation strategy
- **Retained**: DALL-E 3 image generation
- **Retained**: UI/UX principles and design system

### Version 2.0 (October 21, 2025)
- Enhanced prompt compilation with research-backed best practices
- Added comprehensive avatar conversation strategy
- Detailed prompt engineering guidelines

### Version 1.0 (October 21, 2025)
- Initial specification with D-ID avatar integration
- Core features and architecture defined
