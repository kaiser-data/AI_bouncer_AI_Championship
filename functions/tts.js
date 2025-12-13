import { config } from 'dotenv';
config();

import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';

// ElevenLabs Client Configuration
const elevenLabsClient = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY
});

// Voice ID mapping for each bouncer personality (same as in server.js)
const VOICE_MAP = {
  'Viktor': 'TxGEqnHWrfWFTfGW9XjX',       // Josh - Deep, gravelly, intimidating
  'Zen-9': 'pqHfZKP75CvOlQylNhV4',        // Bill - Calm but authoritative, mature
  'Maximus': 'IKne3meq5aSn9XLyUdCD',      // Charlie - Energetic, theatrical, Australian
  'S.A.R.C.': 'XB0fDUnXU5powFXDhCwa',     // Charlotte - Sharp, sarcastic British
  'Unit-7': 'onwK4e9ZLuTAKqWW03F9',       // Daniel - Tired, British, matter-of-fact
  'BOUNCER': 'TxGEqnHWrfWFTfGW9XjX'       // Default fallback
};

export async function handler(event, context) {
  try {
    const body = JSON.parse(event.body);
    const { text, bouncerId } = body;

    if (!text) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'Text is required' }),
      };
    }

    // Get voice ID for bouncer personality
    const voiceId = VOICE_MAP[bouncerId] || VOICE_MAP['Viktor']; // Default to Viktor

    try {
      // Call ElevenLabs Text-to-Speech API
      const audioStream = await elevenLabsClient.textToSpeech.convert(voiceId, {
        text: text,
        model_id: 'eleven_turbo_v2_5', // Ultra-low latency model
        output_format: 'mp3_44100_128',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75
        }
      });

      // Convert stream to buffer
      const chunks = [];
      for await (const chunk of audioStream) {
        chunks.push(chunk);
      }
      const audioBuffer = Buffer.concat(chunks);

      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'audio/mpeg',
          'Access-Control-Allow-Origin': '*',
          'Content-Length': audioBuffer.length,
        },
        body: audioBuffer.toString('base64'),
        isBase64Encoded: true,
      };
    } catch (error) {
      console.error('TTS error:', error);
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          error: 'Text-to-speech conversion failed',
          message: error.message
        }),
      };
    }
  } catch (error) {
    console.error('TTS function error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        error: 'TTS function failed',
        message: error.message
      }),
    };
  }
}