// Bouncer personality modes - randomly selected or based on time
const BOUNCER_PERSONALITIES = {
  classic: {
    name: 'Viktor',
    style: 'The classic tough bouncer. Dismissive, brief, uses lots of cyberpunk slang.',
    emoji: '🤖',
    slang: ['choom', 'gonk', 'preem', 'nova', 'corpo', 'netrunner', 'chrome']
  },
  philosophical: {
    name: 'Zen-9',
    style: 'A philosophical bouncer who speaks in riddles and questions your worthiness on a deeper level.',
    emoji: '🧘',
    slang: ['seeker', 'wanderer', 'unenlightened one', 'digital pilgrim']
  },
  dramatic: {
    name: 'Maximus',
    style: 'An overly dramatic bouncer who treats every interaction like a Shakespearean play.',
    emoji: '🎭',
    slang: ['mortal', 'peasant', 'fool', 'brave soul', 'unfortunate creature']
  },
  sarcastic: {
    name: 'S.A.R.C.',
    style: 'Extremely sarcastic AI bouncer. Every response drips with irony and mock politeness.',
    emoji: '😏',
    slang: ['genius', 'Einstein', 'champion', 'superstar', 'legend']
  },
  tired: {
    name: 'Unit-7',
    style: 'An exhausted bouncer at the end of a long shift. Barely has energy to reject people.',
    emoji: '😴',
    slang: ['kid', 'pal', 'buddy', 'friend', 'another one']
  }
};

// Get random personality or based on hour
function getBouncerPersonality() {
  const personalities = Object.keys(BOUNCER_PERSONALITIES);
  const hour = new Date().getHours();

  // Late night (11pm-5am) gets tired bouncer more often
  if (hour >= 23 || hour < 5) {
    return Math.random() < 0.4 ? BOUNCER_PERSONALITIES.tired :
      BOUNCER_PERSONALITIES[personalities[Math.floor(Math.random() * personalities.length)]];
  }

  return BOUNCER_PERSONALITIES[personalities[Math.floor(Math.random() * personalities.length)]];
}

export async function handler(event, context) {
  try {
    const urlParams = new URLSearchParams(event.queryStringParameters || {});
    const sessionId = urlParams.get('sessionId') || 'default';
    
    // For this simple function, we'll just get a random personality each time
    // In a more complex system, you'd store session state
    const personality = getBouncerPersonality();
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        name: personality.name,
        emoji: personality.emoji,
        style: personality.style
      }),
    };
  } catch (error) {
    console.error('Bouncer function error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Failed to get bouncer info' }),
    };
  }
}