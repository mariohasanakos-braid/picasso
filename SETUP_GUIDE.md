# Picasso Setup Guide

This guide will walk you through setting up the Picasso application step-by-step.

## Quick Start Checklist

- [ ] Node.js 18+ installed
- [ ] OpenAI API key obtained
- [ ] Hosted prompt created in OpenAI Playground
- [ ] Environment variables configured
- [ ] Dependencies installed
- [ ] Development server running

## Detailed Setup Steps

### Step 1: Install Dependencies

```bash
npm install
```

This will install all required packages including Next.js, React, OpenAI SDK, Tailwind CSS, and TypeScript.

### Step 2: Get Your OpenAI API Key

1. Visit https://platform.openai.com/api-keys
2. Sign in or create an account
3. Click "Create new secret key"
4. Name it (e.g., "Picasso App")
5. Copy the key immediately (it starts with `sk-`)
6. Store it safely - you won't be able to see it again!

**Important:** Ensure your OpenAI account has:
- Realtime API access enabled
- GPT-4 access
- DALL-E 3 access
- Sufficient credits/billing set up

### Step 3: Create Your Hosted Prompt

This is the most important step! The AI agent's personality and conversation flow is defined in OpenAI's Playground.

#### 3.1 Access the Playground

1. Go to https://platform.openai.com/playground
2. Click on **"Realtime"** in the top navigation
3. Select model: `gpt-4o-realtime-preview-2024-12-17`

#### 3.2 Configure the Prompt

In the **"Instructions"** field, paste this exact text:

```
You are Pablo, an expert art director helping users create detailed prompts 
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
  "Perfect! I have everything I need. Click the 'Generate Image' button below when you're ready to create your masterpiece!"

IMPORTANT:
- DO NOT say "I'm generating your image" or similar phrases
- Always direct users to click the Generate Image button
- If user says they want to generate, respond: "Great! Just click the 'Generate Image' button below to create your image."
- Never imply that you are generating the image yourself

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
You: "Beautiful! I have everything I need. Click the 'Generate Image' button below when you're ready!"
User: "Generate it!"
You: "Just click the 'Generate Image' button below to create your masterpiece!"
```

#### 3.3 Configure Voice Settings

**Voice Selection:**
- Choose a voice: "Alloy" (neutral) or "Nova" (friendly)
- Speed: 1.0 (normal)
- Temperature: 0.8

**Audio Settings:**
- ✅ Enable "Input Audio Transcription"
  - Model: `whisper-1`
- ✅ Enable "Server VAD" (Voice Activity Detection)
  - Threshold: 0.5
  - Prefix padding: 300ms
  - Silence duration: 500ms

#### 3.4 Test Your Prompt

1. Click **"Connect"** button
2. Grant microphone permission
3. Test the conversation:
   - Say "Hi"
   - Answer Picasso's questions
   - Say "generate my image"
4. Verify the flow feels natural

#### 3.5 Publish and Get Prompt ID

1. Click **"Save"** in top right corner
2. Name your prompt: "Picasso Image Generation Agent"
3. Add a description (optional)
4. Click **"Publish"** to create a version
5. **Copy the Prompt ID** from the URL or interface
   - Format: `pmpt_abc123xyz`
   - This is critical - you'll need it in the next step!

### Step 4: Configure Environment Variables

Create a file named `.env.local` in the project root:

```bash
# Create the file
touch .env.local
```

Add the following content (replace with your actual values):

```env
# OpenAI Configuration
OPENAI_API_KEY=sk-your_actual_api_key_here
OPENAI_REALTIME_PROMPT_ID=pmpt_your_actual_prompt_id_here

# Optional: Override default models
# OPENAI_REALTIME_MODEL=gpt-4o-realtime-preview-2024-12-17
# OPENAI_GPT4_MODEL=gpt-4
# OPENAI_IMAGE_MODEL=dall-e-3
```

**Security Warning:** 
- ⚠️ Never commit `.env.local` to Git
- ⚠️ Never share your API key publicly
- ⚠️ Never use `NEXT_PUBLIC_` prefix for the API key

### Step 5: Run the Application

Start the development server:

```bash
npm run dev
```

You should see:

```
✓ Ready in 2.5s
○ Local:   http://localhost:3000
```

### Step 6: Test the Application

1. Open http://localhost:3000 in your browser
2. Click **"Start Conversation"**
3. Grant microphone permission when prompted
4. You should see:
   - Voice visualizer pulsing
   - Status shows "Connected"
   - Picasso greets you
5. Have a conversation and generate an image!

## Common Setup Issues

### Issue: "OPENAI_API_KEY not configured"

**Solution:** 
- Ensure `.env.local` exists in project root
- Verify the file contains `OPENAI_API_KEY=sk-...`
- Restart the development server after creating/editing `.env.local`

### Issue: "OPENAI_REALTIME_PROMPT_ID not configured"

**Solution:**
- You must create a prompt in OpenAI Playground first
- Publish the prompt and copy the ID
- Add it to `.env.local` as `OPENAI_REALTIME_PROMPT_ID=pmpt_...`
- Restart the server

### Issue: Microphone Permission Denied

**Solution:**
- Click the lock icon in browser address bar
- Allow microphone access
- Refresh the page
- Try in Chrome or Edge (best support)

### Issue: WebRTC Connection Fails

**Solution:**
- Check browser console for errors
- Verify API key has Realtime API access
- Ensure you're on a secure connection (https or localhost)
- Try a different browser

### Issue: Voice Not Working

**Solution:**
- Test your microphone in system settings
- Check browser has microphone permission
- Verify the prompt ID is correct
- Check OpenAI Playground prompt is published

### Issue: "Failed to create session"

**Solution:**
- Verify your OpenAI API key is valid
- Check you have Realtime API access enabled
- Ensure billing is set up on OpenAI account
- Check API key permissions include Realtime API

## Production Deployment

### Deploy to Vercel

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push
   ```

2. **Connect to Vercel:**
   - Go to https://vercel.com
   - Click "Import Project"
   - Select your GitHub repository
   - Vercel auto-detects Next.js

3. **Set Environment Variables:**
   - In Vercel Dashboard → Settings → Environment Variables
   - Add `OPENAI_API_KEY`
   - Add `OPENAI_REALTIME_PROMPT_ID`
   - Apply to Production, Preview, and Development

4. **Deploy:**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your app is live!

## Testing Checklist

After setup, verify these work:

- [ ] App loads at localhost:3000
- [ ] "Start Conversation" button appears
- [ ] Microphone permission prompt appears
- [ ] Voice visualizer shows activity when speaking
- [ ] Picasso greets you with voice
- [ ] Conversation transcript appears
- [ ] "Generate Image" button works
- [ ] Image appears after 30-60 seconds
- [ ] Prompt is displayed
- [ ] Download button works
- [ ] Reset button clears everything

## Cost Monitoring

Each complete session costs approximately **$0.96**:
- Voice conversation (3 min): $0.90
- Prompt compilation: $0.02
- Image generation: $0.04

**Recommendations:**
- Set billing limits in OpenAI dashboard
- Enable usage alerts
- Monitor your API usage regularly
- Use standard quality (not HD) for testing

## Updating the Hosted Prompt

One of the best features: you can update the AI's personality without redeploying!

1. Go to OpenAI Playground
2. Find your published prompt
3. Make changes to the instructions
4. Test the new behavior
5. Save and publish a new version
6. Changes take effect immediately - no code deploy needed!

## Getting Help

If you're stuck:

1. **Check the logs:**
   - Browser console (F12)
   - Terminal where `npm run dev` is running

2. **Verify environment variables:**
   ```bash
   # Check .env.local exists
   cat .env.local
   ```

3. **Test OpenAI connection:**
   - Visit https://platform.openai.com/playground
   - Try your prompt there directly

4. **Review documentation:**
   - Main README.md
   - SPEC.md for detailed architecture
   - OpenAI Realtime API docs

## Next Steps

Once your app is running:

1. **Customize the hosted prompt** to match your desired personality
2. **Adjust voice settings** in OpenAI Playground
3. **Test different conversation flows**
4. **Deploy to production** on Vercel
5. **Share your creations!**

---

**Questions?** Review the main README.md and SPEC.md for more details.

**Ready to create?** Run `npm run dev` and start your creative journey! 🎨

