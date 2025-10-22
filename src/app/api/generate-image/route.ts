import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OPENAI_API_KEY not configured' },
        { status: 500 }
      );
    }

    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Invalid prompt provided' },
        { status: 400 }
      );
    }

    const openai = new OpenAI({ apiKey });
    
    console.log('Attempting to generate image with:');
    console.log('- Model: dall-e-3');
    console.log('- Prompt:', prompt);
    console.log('- API Key (first 10 chars):', apiKey.substring(0, 10) + '...');

    const image = await openai.images.generate({
      model: 'dall-e-3',
      prompt,
      n: 1,
      size: '1024x1024',
      quality: 'standard'
    });

    if (!image.data || image.data.length === 0) {
      throw new Error('No image data returned from OpenAI');
    }

    return NextResponse.json({
      imageUrl: image.data[0].url,
      revisedPrompt: image.data[0].revised_prompt
    });
  } catch (error: any) {
    console.error('Error generating image:', error);
    console.error('Full error details:', JSON.stringify(error, null, 2));
    
    // Check for specific OpenAI error types
    if (error.status === 401) {
      return NextResponse.json(
        { error: 'Invalid API key', details: 'Please check your OpenAI API key' },
        { status: 401 }
      );
    }
    
    if (error.status === 429) {
      return NextResponse.json(
        { error: 'Rate limit exceeded', details: 'Too many requests, please try again later' },
        { status: 429 }
      );
    }
    
    if (error.status === 400) {
      // Check if it's a content policy violation
      if (error.code === 'content_policy_violation' || 
          (error.message && error.message.includes('content_policy'))) {
        return NextResponse.json(
          { 
            error: 'Content policy violation', 
            details: 'The image prompt contains content that violates OpenAI\'s usage policies. Please try rephrasing your request to be more appropriate.' 
          },
          { status: 400 }
        );
      }
      
      return NextResponse.json(
        { error: 'Invalid request', details: error.message || 'The prompt may be too long or contain invalid content' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to generate image', details: error.message || 'Unknown error occurred' },
      { status: 500 }
    );
  }
}

