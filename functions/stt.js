import { config } from 'dotenv';
config();

export async function handler(event, context) {
  try {
    // In Netlify Functions, we need to handle the multipart form data manually
    // The event body is base64 encoded when it contains binary data
    const isBase64Encoded = event.isBase64Encoded;
    const contentType = event.headers['content-type'] || event.headers['Content-Type'];

    if (!contentType || !contentType.includes('multipart/form-data')) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'Content-Type must be multipart/form-data' }),
      };
    }

    // Extract boundary from content type
    const boundaryMatch = contentType.match(/boundary=(.+)$/);
    if (!boundaryMatch) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'Missing boundary in content-type' }),
      };
    }
    const boundary = boundaryMatch[1].replace(/(^"|"$)/g, ''); // Remove quotes if present

    // Get the raw body buffer
    const bodyBuffer = Buffer.from(event.body, isBase64Encoded ? 'base64' : 'utf8');

    // Parse multipart data manually
    const parts = bodyBuffer.toString().split(`--${boundary}`);
    let audioBuffer = null;
    let filename = null;

    for (const part of parts) {
      if (part.trim() === '' || part.trim() === '--') continue;

      const [headerPart, ...bodyParts] = part.split('\r\n\r\n');
      if (!headerPart || !bodyParts) continue;

      const headerContent = headerPart.toLowerCase();
      if (headerContent.includes('content-disposition') && headerContent.includes('audio')) {
        // Extract filename if present
        const filenameMatch = headerPart.match(/filename="([^"]+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }

        // Get the actual file content
        const content = bodyParts.join('\r\n\r\n');
        // Remove the closing boundary if present
        const endBoundary = `\r\n--${boundary}--`;
        const cleanContent = content.replace(endBoundary, '').replace(/[\r\n]+$/, '');

        // Create buffer from the binary content
        audioBuffer = Buffer.from(cleanContent, 'binary');
        break;
      }
    }

    if (!audioBuffer) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'No audio file found in the request' }),
      };
    }

    // Use ElevenLabs client to convert speech to text
    const { ElevenLabsClient } = await import('@elevenlabs/elevenlabs-js');

    const elevenLabsClient = new ElevenLabsClient({
      apiKey: process.env.ELEVENLABS_API_KEY
    });

    try {
      const transcription = await elevenLabsClient.speechToText.convert({
        audio: audioBuffer,
        model_id: 'eleven_multilingual_v2'
      });

      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          text: transcription.text || '',
          confidence: 1.0
        }),
      };
    } catch (apiError) {
      console.error('ElevenLabs API error:', apiError);
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          error: 'Speech-to-text conversion failed',
          message: apiError.message
        }),
      };
    }
  } catch (error) {
    console.error('STT function error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        error: 'STT function failed',
        message: error.message
      }),
    };
  }
}