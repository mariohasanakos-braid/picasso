# Picasso - Quick Start (5 Minutes)

Get up and running in 5 minutes with this streamlined guide.

## Prerequisites

- ✅ Node.js 18+ installed
- ✅ OpenAI API key (with Realtime, GPT-4, DALL-E 3 access)

## Steps

### 1. Install (30 seconds)

```bash
npm install
```

### 2. Get OpenAI API Key (1 minute)

1. Visit https://platform.openai.com/api-keys
2. Create new key
3. Copy it (starts with `sk-`)

### 3. Create Hosted Prompt (2 minutes)

**This is the most important step!**

1. Go to https://platform.openai.com/playground
2. Click **"Realtime"** mode
3. Paste this in "Instructions":

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
Listen for phrases like: "generate", "create it", "make my image", "I'm ready"

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

4. Click **"Save"** → **"Publish"**
5. Copy the **Prompt ID** (format: `pmpt_abc123`)

### 4. Configure Environment (30 seconds)

Create `.env.local`:

```bash
echo "OPENAI_API_KEY=sk-your_key_here" > .env.local
echo "OPENAI_REALTIME_PROMPT_ID=pmpt_your_id_here" >> .env.local
```

Replace `sk-your_key_here` and `pmpt_your_id_here` with your actual values.

### 5. Run (10 seconds)

```bash
npm run dev
```

Open http://localhost:3000

### 6. Test (1 minute)

1. Click "Start Conversation"
2. Grant microphone permission
3. Say "Hi"
4. Tell Picasso what you want to create
5. Say "generate my image"
6. Wait 30-60 seconds
7. Enjoy your AI-generated image! 🎨

## Troubleshooting

### "OPENAI_API_KEY not configured"
→ Check `.env.local` exists with correct API key

### "OPENAI_REALTIME_PROMPT_ID not configured"
→ You must create the hosted prompt in OpenAI Playground first

### Microphone not working
→ Check browser permissions, try Chrome/Edge

### Voice not connecting
→ Verify API key has Realtime API access enabled

## Next Steps

- Read `README.md` for full documentation
- Check `SETUP_GUIDE.md` for detailed setup
- See `SPEC.md` for technical architecture
- Review `PROJECT_SUMMARY.md` for implementation details

## Deploy to Production

```bash
# 1. Push to GitHub
git init
git add .
git commit -m "Initial commit"
git push

# 2. Deploy on Vercel
# - Import GitHub repo
# - Add environment variables
# - Deploy!
```

---

**That's it! You're ready to create amazing AI images with voice! 🚀**

Need help? Check the detailed guides or open an issue on GitHub.

