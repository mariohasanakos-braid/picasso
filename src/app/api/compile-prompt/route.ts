import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { COMPILATION_SYSTEM_PROMPT } from '@/lib/prompts';

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OPENAI_API_KEY not configured' },
        { status: 500 }
      );
    }

    const { transcript } = await req.json();

    if (!transcript || typeof transcript !== 'string') {
      return NextResponse.json(
        { error: 'Invalid transcript provided' },
        { status: 400 }
      );
    }

    const openai = new OpenAI({ apiKey });
    const model = process.env.OPENAI_GPT4_MODEL || 'gpt-4';

    const completion = await openai.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: COMPILATION_SYSTEM_PROMPT },
        { role: 'user', content: `CONVERSATION TRANSCRIPT:\n${transcript}` }
      ],
      temperature: 0.7,
      max_tokens: 200
    });

    const prompt = completion.choices[0].message.content?.trim() || '';
    
    console.log('Successfully compiled prompt:', prompt);
    console.log('Prompt length:', prompt.length, 'characters');

    return NextResponse.json({ prompt });
  } catch (error: any) {
    console.error('Error compiling prompt:', error);
    return NextResponse.json(
      { error: 'Failed to compile prompt', details: error.message },
      { status: 500 }
    );
  }
}

