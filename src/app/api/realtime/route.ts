import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const ephemeralKey = req.headers.get('x-ephemeral-key');
    const apiKey = ephemeralKey || process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      return new Response('API key not found', { status: 401 });
    }

    const model = new URL(req.url).searchParams.get('model') || 
                  process.env.OPENAI_REALTIME_MODEL ||
                  'gpt-realtime';
    
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

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI Realtime API error:', errorText);
      return new Response(errorText, { 
        status: response.status,
        headers: { 'content-type': 'text/plain' }
      });
    }

    const answerSdp = await response.text();
    return new Response(answerSdp, {
      status: response.status,
      headers: { 'content-type': 'application/sdp' }
    });
  } catch (error) {
    console.error('Error proxying SDP:', error);
    return new Response('Internal server error', { status: 500 });
  }
}

