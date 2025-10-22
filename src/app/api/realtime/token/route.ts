import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    const promptId = process.env.OPENAI_REALTIME_PROMPT_ID;
    const model = process.env.OPENAI_REALTIME_MODEL || 'gpt-realtime';

    if (!apiKey) {
      return NextResponse.json(
        { error: 'OPENAI_API_KEY not configured' },
        { status: 500 }
      );
    }

    if (!promptId) {
      return NextResponse.json(
        { error: 'OPENAI_REALTIME_PROMPT_ID not configured' },
        { status: 500 }
      );
    }

    const response = await fetch('https://api.openai.com/v1/realtime/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'realtime=v1'
      },
      body: JSON.stringify({
        model,
        prompt: { id: promptId },
        input_audio_transcription: { model: 'whisper-1' }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      return NextResponse.json(
        { error: 'Failed to create session', details: errorText },
        { status: response.status }
      );
    }

    const json = await response.json();
    
    return NextResponse.json({
      client_secret: json.client_secret,
      model: json.model,
      id: json.id,
      expires_at: json.client_secret?.expires_at
    });
  } catch (error) {
    console.error('Error creating realtime session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

