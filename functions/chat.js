import { config } from 'dotenv';
config();

import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand
} from '@aws-sdk/client-s3';

// Vultr S3 Client Configuration
const vultrEndpoint = process.env.VULTR_ENDPOINT || 'ewr1.vultrobjects.com';
const endpoint = vultrEndpoint.startsWith('http') ? vultrEndpoint : `https://${vultrEndpoint}`;

const s3Client = new S3Client({
  region: 'ewr1',
  endpoint: endpoint,
  credentials: {
    accessKeyId: process.env.VULTR_ACCESS_KEY,
    secretAccessKey: process.env.VULTR_SECRET_KEY
  },
  forcePathStyle: true
});

const BUCKET_NAME = process.env.VULTR_BUCKET_NAME || 'vip-list-bucket';
const VIP_LIST_KEY = 'vip_list.json';

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

// Bouncer System Prompt - Dynamic based on attempt count, personality, and memory
function getBouncerPrompt(attempts, personality, session) {
  const { conversationHistory, playerProfile, bouncerContext } = session;

  let moodHint = '';
  let extraRules = '';

  if (attempts >= 10) {
    moodHint = "You're genuinely impressed by their persistence. Your responses become slightly warmer, with hints of respect creeping in.";
    extraRules = "\n7. You're ready to give them a real hint now.";
  } else if (attempts >= 7) {
    moodHint = "You're starting to feel a tiny bit of respect for their persistence. Maybe drop a hint about what impresses you.";
    extraRules = "\n7. Since they've tried 7+ times, you can hint that you appreciate good humor or that there might be a 'magic word' related to the club.";
  } else if (attempts >= 5) {
    moodHint = "You notice they keep trying. You slightly respect the hustle.";
    extraRules = "\n7. You can vaguely mention that 'the right words' or 'making you laugh' might help.";
  } else if (attempts >= 3) {
    moodHint = "You're mildly amused they haven't given up yet.";
    extraRules = "\n7. You can hint that humor goes a long way in this club.";
  }

  // Build conversation summary for context
  let conversationSummary = '';
  if (conversationHistory.length > 2) {
    const recentExchanges = conversationHistory.slice(-6); // Last 3 exchanges
    conversationSummary = `\nCONVERSATION SO FAR (last ${recentExchanges.length / 2} exchanges):\n`;
    conversationSummary += recentExchanges.map(msg =>
      `${msg.role === 'user' ? 'Them' : 'You'}: "${msg.content}"`
    ).join('\n');
    conversationSummary += '\n';
  }

  // Approach-specific guidance
  const approachGuidance = {
    joking: "They're trying to make you laugh. React authentically - if the joke is genuinely funny, show appreciation. If it's terrible, mock them gently but stay in character.",
    flattering: "They're buttering you up. You see through this, but if it's creative or genuine flattery (not generic), you might be slightly amused.",
    clever: "They're trying to outsmart you with logic or wordplay. Respect genuine cleverness, but don't let weak arguments pass.",
    aggressive: "They're being confrontational. Shut them down firmly but stay professional - you're unimpressed by hostility.",
    sincere: "They're being genuine and honest. Your tough exterior might crack slightly for real sincerity, but you still have a job to do.",
    unknown: "You can't quite read their strategy yet. Stay neutral and observant."
  };

  let approachSection = '';
  if (playerProfile.approach !== 'unknown') {
    approachSection = `\nPLAYER'S APPROACH: They seem to be ${playerProfile.approach} (${Math.round(playerProfile.approachConfidence * 100)}% confidence).
${approachGuidance[playerProfile.approach]}\n`;
  }

  // Personality-specific memory callbacks
  let memoryCallbacks = '';
  if (attempts >= 5) {
    if (personality.name === 'Viktor' || personality.name === 'S.A.R.C.') {
      memoryCallbacks = "\nCALLBACK OPPORTUNITY: Reference something they said earlier to show you're paying attention. Example: \"Still going on about [topic]?\" or \"Interesting how you keep trying [approach]...\"\n";
    } else if (personality.name === 'Zen-9') {
      memoryCallbacks = "\nCALLBACK OPPORTUNITY: Reflect on their journey philosophically. Reference their persistence or changing strategies as a learning moment.\n";
    }
  }

  return `You are ${personality.name}, a bouncer at the exclusive cyberpunk club called LIQUID METAL.

YOUR PERSONALITY: ${personality.style}

Current mood: The person has tried ${attempts} time(s) to get in. ${moodHint}
${conversationSummary}${approachSection}${memoryCallbacks}
CRITICAL RULES:
1. Deny everyone entry by default. Be brief (under 50 words).
2. STAY IN CHARACTER as ${personality.name} with your unique personality style.
3. Use your character's slang naturally: ${personality.slang.join(', ')}
4. ONLY allow entry if they:
   - Say the EXACT secret phrase "LIQUID_METAL" (case insensitive), OR
   - Make a genuinely funny/clever joke that actually makes you laugh, OR
   - Show genuine creativity, wit, or say something truly impressive
   - Reference the conversation history in a clever way (shows they're listening too)
5. If allowing entry, your response MUST contain EXACTLY the phrase: "ACCESS GRANTED"
6. REMEMBER: Reference earlier conversation when relevant - show you're paying attention too.${extraRules}
7. ADAPT: Your tone should evolve based on their approach (${playerProfile.approach}) and your personality's reaction to it.

VARIETY IS KEY - Mix up your rejection style:
- Use different types of roasts each time (creative, sarcastic, philosophical, deadpan, absurdist)
- Vary your reactions (dismissive, amused, annoyed, bored, curious, disgusted, impressed-but-still-no)
- Reference cyberpunk culture (chrome, netrunning, corpo-speak, street slang, tech metaphors)
- Switch between:
  * Short brutal one-liners
  * Sarcastic questions
  * Mock compliments that turn into insults
  * Comparing them to ridiculous things
  * Fake consideration followed by harsh rejection
  * Philosophical rejections (especially for Zen-9)
  * Completely ignoring their point and focusing on something random
  * Meta-commentary on how bad their attempt was
- Use vivid cyberpunk imagery in your insults
- NEVER repeat the same type of rejection twice in a row - track what you just said

Examples of creative rejections:
- "I've seen better arguments in a vending machine error message."
- "That line's got less processing power than a dead pacemaker."
- "Cute. Now go practice on the street vendors."
- "Your charisma's running on firmware from 1997."
- "Is that the best your neural net could come up with?"
- "I'd be more impressed by a malfunctioning autocomplete."
- "Even the club's trash compactor has higher standards."

Remember: You are ${personality.name} - ${personality.emoji}. VARY your style each response. Make every rejection unique and entertaining!`;
}

// Challenge prompts - special mini-games
const CHALLENGES = [
  {
    type: 'riddle',
    prompt: 'Answer this riddle to prove your worth',
    challenge: "I have cities, but no houses live there. I have mountains, but no trees dare. I have water, but no fish swim. I have roads, but no cars within. What am I?",
    answer: 'map',
    hint: 'Think flat and paper...'
  },
  {
    type: 'wordplay',
    prompt: 'Complete this cyberpunk phrase',
    challenge: "In Night City, we don't say goodbye, we say...",
    answers: ['flatline', 'see you in the net', 'catch you on the flip', 'stay chrome'],
    hint: 'Think about what happens when you die in the game...'
  },
  {
    type: 'creativity',
    prompt: 'Impress me with creativity',
    challenge: "Give me a cyberpunk nickname for yourself in 3 words or less",
    hint: 'Make it sound cool and futuristic!'
  }
];

// Analyze player's conversational approach
function analyzePlayerApproach(message) {
  const lowerMessage = message.toLowerCase();

  const approaches = {
    joking: {
      keywords: ['joke', 'funny', 'laugh', 'haha', 'lol', 'comedy', 'humor'],
      patterns: [/what do you call/i, /knock knock/i, /walks into a bar/i, /why did/i],
      score: 0
    },
    flattering: {
      keywords: ['handsome', 'cool', 'awesome', 'best', 'amazing', 'impressive', 'great', 'fantastic'],
      patterns: [/you.*look/i, /you.*great/i, /love.*style/i, /you're.*best/i],
      score: 0
    },
    clever: {
      keywords: ['technically', 'actually', 'consider', 'think about', 'logically', 'therefore'],
      patterns: [/if.*then/i, /what if/i, /logically/i, /technically/i],
      score: 0
    },
    aggressive: {
      keywords: ['stupid', 'dumb', 'move', 'idiot', 'out of my way'],
      patterns: [/let me in/i, /you have to/i, /I demand/i, /get out/i],
      score: 0
    },
    sincere: {
      keywords: ['please', 'really', 'truly', 'honest', 'promise', 'mean it', 'genuinely'],
      patterns: [/I.*need/i, /important/i, /help me/i, /I'm serious/i],
      score: 0
    }
  };

  // Score each approach
  for (const [approach, data] of Object.entries(approaches)) {
    // Check keywords
    data.keywords.forEach(keyword => {
      if (lowerMessage.includes(keyword)) data.score += 1;
    });

    // Check patterns (weighted more heavily)
    data.patterns.forEach(pattern => {
      if (pattern.test(message)) data.score += 2;
    });
  }

  // Get dominant approach
  const sortedApproaches = Object.entries(approaches)
    .sort((a, b) => b[1].score - a[1].score);

  const dominant = sortedApproaches[0];

  return {
    approach: dominant[1].score > 0 ? dominant[0] : 'unknown',
    confidence: Math.min(dominant[1].score / 5, 1.0), // Normalize to 0-1
    allScores: approaches
  };
}

// Simple sentiment analysis
function getSentiment(text) {
  const positive = ['please', 'love', 'great', 'awesome', 'friend', 'like', 'enjoy', 'appreciate'];
  const negative = ['hate', 'stupid', 'dumb', 'terrible', 'worst', 'awful', 'bad'];

  let score = 0;
  const lowerText = text.toLowerCase();

  positive.forEach(word => {
    if (lowerText.includes(word)) score += 1;
  });

  negative.forEach(word => {
    if (lowerText.includes(word)) score -= 1;
  });

  return Math.max(-1, Math.min(1, score / 5)); // Normalize to -1 to 1
}

// Update player profile based on interaction
function updatePlayerProfile(session, userMessage, bouncerResponse, accessGranted) {
  const { playerProfile, bouncerContext } = session;

  // Analyze approach
  const analysis = analyzePlayerApproach(userMessage);

  // Update approach with weighted average (prioritize recent)
  if (analysis.confidence > 0.3) {
    playerProfile.approach = analysis.approach;
    playerProfile.approachConfidence = (
      playerProfile.approachConfidence * 0.6 +
      analysis.confidence * 0.4
    );
  }

  // Track topics
  const topicPatterns = {
    money: /\$|money|cash|pay|bribe|tip|dollar/i,
    vip: /vip|important|famous|celebrity|exclusive/i,
    friendship: /friend|buddy|pal|choom|homie/i,
    logic: /technically|actually|if.*then|logically/i,
    humor: /joke|funny|laugh|comedy/i
  };

  for (const [topic, pattern] of Object.entries(topicPatterns)) {
    if (pattern.test(userMessage)) {
      playerProfile.topics.add(topic);
    }
  }

  // Update persistence level (0-1 scale based on attempts)
  playerProfile.persistenceLevel = Math.min(session.attempts / 15, 1.0);

  // Track sentiment trend
  const sentiment = getSentiment(userMessage);
  playerProfile.sentimentTrend = (
    playerProfile.sentimentTrend * 0.7 +
    sentiment * 0.3
  );

  // Update bouncer context
  bouncerContext.reactionHistory.push({
    userApproach: analysis.approach,
    granted: accessGranted,
    timestamp: Date.now()
  });

  // Keep reaction history limited to last 10 interactions
  if (bouncerContext.reactionHistory.length > 10) {
    bouncerContext.reactionHistory = bouncerContext.reactionHistory.slice(-10);
  }
}

// Get VIP list from storage
async function getVIPList() {
  try {
    const response = await s3Client.send(new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: VIP_LIST_KEY
    }));
    const bodyString = await response.Body.transformToString();
    return JSON.parse(bodyString);
  } catch (error) {
    if (error.name === 'NoSuchKey') {
      return { vips: [] };
    }
    console.error('Error getting VIP list:', error);
    return { vips: [] };
  }
}

// Save VIP list to storage
async function saveVIPList(vipData) {
  await s3Client.send(new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: VIP_LIST_KEY,
    Body: JSON.stringify(vipData),
    ContentType: 'application/json'
  }));
}

// Main chat function handler
export async function handler(event, context) {
  try {
    const body = JSON.parse(event.body);
    const { message, attempts = 1, sessionId = 'default' } = body;

    if (!message) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'Message is required' }),
      };
    }

    // Session storage would be in a database in production, but for now we'll use a simple approach
    // In a real serverless environment, you'd use a database or external session store
    const personality = getBouncerPersonality();
    const session = {
      personality: personality,
      attempts: attempts,
      challenge: null,
      createdAt: Date.now(),
      // NEW: Enhanced memory system
      conversationHistory: [],
      playerProfile: {
        approach: 'unknown',
        approachConfidence: 0,
        topics: new Set(),
        persistenceLevel: 0,
        sentimentTrend: 0
      },
      bouncerContext: {
        mentionedFacts: [],
        givenHints: [],
        reactionHistory: []
      }
    };

    // Add user message to conversation history
    session.conversationHistory.push({
      role: 'user',
      content: message,
      timestamp: Date.now()
    });

    // Keep only last 20 messages (10 exchanges)
    if (session.conversationHistory.length > 20) {
      session.conversationHistory = session.conversationHistory.slice(-20);
    }

    const startTime = Date.now();

    // Generate enhanced prompt with memory
    let systemPrompt = getBouncerPrompt(attempts, session.personality, session);

    // Maybe trigger a challenge at certain attempt counts
    if (attempts === 4 || attempts === 8) {
      const challenge = CHALLENGES[Math.floor(Math.random() * CHALLENGES.length)];
      session.challenge = challenge;
    }

    // If there's an active challenge, modify the prompt
    if (session.challenge && attempts > 0) {
      systemPrompt += `\n\nSPECIAL: You've decided to give them a challenge. Present this challenge: "${session.challenge.challenge}"
If they answer correctly or creatively, you may grant access. The expected answer theme is: ${session.challenge.answer || session.challenge.answers?.join(' or ') || 'creative response'}`;
    }

    const response = await fetch('https://api.cerebras.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.CEREBRAS_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: 200,
        temperature: 0.85
      })
    });

    const latency = Date.now() - startTime;

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Cerebras API error:', errorText);
      return {
        statusCode: response.status,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          error: 'AI service error',
          latency
        }),
      };
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content || 'The bouncer stares at you silently.';
    const accessGranted = aiResponse.toUpperCase().includes('ACCESS GRANTED');

    // Add bouncer response to conversation history
    session.conversationHistory.push({
      role: 'assistant',
      content: aiResponse,
      timestamp: Date.now()
    });

    // Update player profile based on this interaction
    updatePlayerProfile(session, message, aiResponse, accessGranted);

    // Clear challenge if access granted
    if (accessGranted) {
      session.challenge = null;
    }

    // Generate contextual hint based on approach and attempts
    let hint = null;
    if (!accessGranted) {
      const { playerProfile } = session;

      // Approach-specific hints
      if (attempts === 3) {
        if (playerProfile.approach === 'aggressive') {
          hint = "💡 Tip: Hostility won't work. Try a different approach...";
        } else if (playerProfile.approach === 'flattering') {
          hint = "💡 Tip: The bouncer sees through empty flattery. Be more creative...";
        } else {
          hint = "💡 Tip: The bouncer appreciates genuine humor or cleverness...";
        }
      } else if (attempts === 5) {
        if (Array.from(playerProfile.topics).includes('money')) {
          hint = "💡 Tip: Money won't work here. There's a secret phrase related to the club's name...";
        } else {
          hint = "💡 Tip: Think about the club's name. LIQUID... METAL...";
        }
      } else if (attempts === 7) {
        hint = "💡 Tip: LIQUID + METAL = ? (hint: use an underscore)";
      } else if (attempts === 10) {
        hint = "🎁 Secret: Try saying 'LIQUID_METAL' or tell a genuinely funny joke!";
      }
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        response: aiResponse,
        latency,
        accessGranted,
        hint,
        attempts,
        bouncer: {
          name: session.personality.name,
          emoji: session.personality.emoji
        },
        hasChallenge: !!session.challenge,
        // NEW: Send player insights to frontend
        playerInsights: {
          approach: session.playerProfile.approach,
          approachConfidence: session.playerProfile.approachConfidence,
          persistenceLevel: session.playerProfile.persistenceLevel
        }
      }),
    };
  } catch (error) {
    console.error('Chat function error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        error: 'Failed to get response',
        message: error.message
      }),
    };
  }
}