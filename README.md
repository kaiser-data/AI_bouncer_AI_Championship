# 🤖 AI Bouncer - LIQUID METAL Club

<div align="center">

**Try to convince a stubborn AI bouncer to let you into the most exclusive virtual cyberpunk club!**

[![Live Demo](https://img.shields.io/badge/🎮-Play_Now-00ff00?style=for-the-badge)](https://ai-bouncer.netlify.app)
[![Hackathon](https://img.shields.io/badge/Hackathon-AI_Championship-cyan?style=for-the-badge)](https://liquidmetal.devpost.com/?ref_content=default&ref_feature=challenge&ref_medium=portfolio)
[![Devpost](https://img.shields.io/badge/Devpost-View_Project-003e54?style=for-the-badge&logo=devpost)](https://devpost.com/software/ai-bouncer)

Built for the **AI Championship Hackathon** (LiquidMetal + Vultr)

**Category:** Best Ultra-Low Latency App (Cerebras)

</div>

---

## 🎯 About The Game

AI Bouncer is an interactive chat game where you face off against an AI-powered bouncer guarding the entrance to the exclusive LIQUID METAL club. Your mission? Use wit, creativity, humor, or persistence to gain entry and secure your spot on the VIP list!

### 🎮 How to Play

1. **🎭 Tell Jokes** - Make the bouncer laugh with your best comedy
2. **🔑 Find the Secret** - Discover the magic phrase that opens doors
3. **💬 Be Creative** - Show originality and persistence
4. **💡 Unlock Hints** - Failed attempts unlock helpful clues
5. **👑 Join the VIPs** - Get in and immortalize your achievement!

### 🏆 Ways to Win

- **Secret Phrase:** Say "LIQUID_METAL"
- **Comedy Gold:** Tell a genuinely hilarious joke
- **Creative Brilliance:** Show exceptional wit and creativity

---

## ✨ Key Features

### 🎭 Multiple Bouncer Personalities
- **Viktor** - Classic stern Russian bouncer
- **Zen-9** - Philosophical AI seeking enlightenment
- **Maximus** - Theatrical drama king
- **S.A.R.C.** - Sarcastic British wit
- **Unit-7** - Tired, seen-it-all robot

### ⚡ Ultra-Low Latency Performance
- **Cerebras Llama-3.3-70B** - Sub-second AI responses
- **Real-time Latency Display** - See the speed difference
- **Streaming Responses** - Even faster perceived performance
- **Average response time: <500ms**

### 🎤 Voice Integration
- **Speech-to-Text** - Talk to the bouncer using your microphone
- **Text-to-Speech** - Hear the bouncer's voice responses
- **ElevenLabs AI Voices** - Natural, personality-matched voices
- **Voice enabled by default** for seamless demos

### 🎯 Gamification
- **Progressive Hints** - Get smarter clues with each attempt
- **Achievement System** - Unlock badges for your play style
  - 🎯 First Try! - Get in on the first attempt
  - 💪 Persistent - Try 5+ times
  - ⚡ Speed Demon - Win in under 30 seconds
  - 😂 Comedian - Make the bouncer laugh
  - 🤐 Secret Keeper - Use the secret phrase
- **VIP Leaderboard** - Hall of fame for successful entries
- **Live Stats** - Track attempts, latency, and mood

### 🎨 Cyberpunk UI
- Neon-lit interface with glitch effects
- **Fully optimized mobile experience** with touch-friendly controls
- Custom bouncer visuals for each personality
- Real-time mood indicator

### 📱 Mobile-Optimized Experience
- **Touch-Friendly Controls** - 48-56px button targets (WCAG compliant)
- **Responsive Layout** - Adaptive breakpoints for tablet (768px) and phone (480px)
- **Smart Input Handling** - 16px font size prevents iOS auto-zoom
- **Optimized Alignment** - Flexbox layout with proper element sizing
- **Web App Ready** - Viewport configuration for seamless mobile experience
- **Performance Tuned** - Reduced tap highlights, optimized spacing

---

## 🛠️ Tech Stack

### Platform & Infrastructure
- **🚀 LiquidMetal Raindrop** - Serverless deployment platform
- **☁️ Cloudflare Workers** - Edge computing runtime
- **🌐 Netlify** - Frontend hosting with GitHub auto-deploy
- **📦 Vultr Object Storage** - S3-compatible VIP list storage

### AI & Voice
- **🧠 Cerebras Llama-3.3-70B** - Ultra-fast inference (<500ms)
- **🎤 ElevenLabs STT** - Speech-to-text with `scribe_v2` model
- **🔊 ElevenLabs TTS** - Natural voice synthesis with personality matching

### Backend (Hybrid Architecture)
- **Node.js 20** - Runtime environment
- **Hono** - Lightweight web framework for Raindrop (AI/voice endpoints)
- **Netlify Functions** - Serverless functions for VIP list persistence
- **@aws-sdk/client-s3** - Reliable S3 client for Vultr Object Storage
- **Express** - Alternative server for local development

### Frontend
- **HTML5 + Vanilla JavaScript** - No build step required
- **Tailwind CSS** - Utility-first styling
- **Custom Cyberpunk Design** - Neon effects and animations
- **Responsive CSS** - Mobile-optimized with touch-friendly interactions

---

## 🚀 Live Demo

**🎮 Play Now:** [https://ai-bouncer.netlify.app](https://ai-bouncer.netlify.app)

### 📹 Demo Video

Watch the full demo and walkthrough on Vimeo:

[![AI Bouncer Demo Video](https://vumbnail.com/1146107891.jpg)](https://vimeo.com/1146107891)

**[▶️ Watch on Vimeo](https://vimeo.com/1146107891)**

### 🏗️ Hybrid Architecture

- **Frontend:** Netlify (auto-deploys from GitHub)
- **AI/Voice Backend:** LiquidMetal Raindrop (Cerebras + ElevenLabs)
- **VIP List Backend:** Netlify Functions (reliable S3 compatibility)
- **Storage:** Vultr Object Storage (Amsterdam - `ams2`)

**Why Hybrid?**
- **Raindrop** provides ultra-low latency AI responses (<500ms) perfect for chat/voice
- **Netlify Functions** offer better S3 compatibility with `@aws-sdk/client-s3`
- **Issue discovered:** Raindrop's `aws4fetch` library has S3 signing incompatibility with Vultr
- **Solution:** Use each platform's strengths - Raindrop for speed, Netlify for storage reliability

---

## 💻 Local Development

### Prerequisites
- Node.js 18 or higher
- npm or yarn
- Cerebras API key
- Vultr Object Storage account
- ElevenLabs API key (for voice features)

### Setup Instructions

1. **Clone the repository:**
```bash
git clone https://github.com/your-username/AI_bouncer_AI_Championship.git
cd AI_bouncer_AI_Championship
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure environment variables:**
```bash
cp .env.example .env
```

4. **Edit `.env` with your credentials:**
```bash
# Server Configuration
PORT=3000

# Cerebras AI API
CEREBRAS_API_KEY=csk-xxxxxxxxxxxxx

# Vultr Object Storage (S3-compatible)
VULTR_ACCESS_KEY=your-vultr-access-key
VULTR_SECRET_KEY=your-vultr-secret-key
VULTR_ENDPOINT=ams2.vultrobjects.com
VULTR_BUCKET_NAME=bouncerai

# ElevenLabs Voice API
ELEVENLABS_API_KEY=sk_xxxxxxxxxxxxx
```

5. **Run locally:**
```bash
npm start
```

6. **Open your browser:**
```
http://localhost:3000
```

---

## 🌩️ Deploy to LiquidMetal Raindrop

### 1. Install Raindrop CLI

Follow the official guide: [LiquidMetal Raindrop Documentation](https://docs.liquidmetal.ai/reference/cli/)

### 2. Set Environment Variables

```bash
raindrop build env set CEREBRAS_API_KEY csk-xxxxxxxxxxxxx
raindrop build env set VULTR_ACCESS_KEY your-vultr-access-key
raindrop build env set VULTR_SECRET_KEY your-vultr-secret-key
raindrop build env set VULTR_ENDPOINT https://ams2.vultrobjects.com
raindrop build env set VULTR_BUCKET_NAME bouncerai
raindrop build env set ELEVENLABS_API_KEY sk_xxxxxxxxxxxxx
```

### 3. Deploy

```bash
raindrop build deploy
```

### 4. Monitor

```bash
raindrop build status
raindrop build logs
```

Your app will be live at: `https://ai-bouncer.{your-id}.lmapp.run`

---

## 📦 Vultr Object Storage Setup

### Create Storage Instance

1. Log into [Vultr Dashboard](https://my.vultr.com)
2. Go to **Products** → **Object Storage**
3. Click **Deploy New Instance**
4. Select region: **Amsterdam (ams2)** recommended
5. Create a new bucket: `bouncerai`

### Get Credentials

1. Navigate to your Object Storage instance
2. Copy:
   - **Access Key**
   - **Secret Key**
   - **Hostname** (e.g., `ams2.vultrobjects.com`)
3. Paste into your `.env` file

### Bucket Permissions

Ensure your access key has:
- ✅ **Read** permissions (GET objects)
- ✅ **Write** permissions (PUT objects)

For detailed instructions, see [VIP_BUCKET_SETUP.md](VIP_BUCKET_SETUP.md)

---

## 🌐 Deploy Frontend to Netlify

### Automatic Deployment (Recommended)

1. **Connect GitHub repository** to Netlify
2. **Configure build settings:**
   - Build command: `npm run build:functions` (optional)
   - Publish directory: `public`
3. **Set environment variables** (not required for static frontend)
4. **Enable auto-deploy** on push to `main` branch

### Manual Deployment

```bash
npm install -g netlify-cli
netlify deploy --prod --dir=public
```

---

## 🎯 API Endpoints

### Raindrop Backend (Ultra-Low Latency)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/chat` | Send message, get bouncer response |
| `POST` | `/chat/stream` | Streaming response for faster UX |
| `GET` | `/bouncer` | Get current bouncer personality info |
| `POST` | `/stt` | Speech-to-text conversion |
| `POST` | `/tts` | Text-to-speech synthesis |
| `GET` | `/health` | Health check endpoint |

### Netlify Functions (VIP List Storage)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/win` | Add username to VIP list (Vultr S3) |
| `GET` | `/leaderboard` | Retrieve VIP leaderboard from storage |
| `GET` | `/stats` | Get game statistics |

---

## 🐛 Troubleshooting

### Leaderboard Not Working

**Problem:** "Failed to save to VIP list" or 403 AccessDenied errors

**Root Causes & Solutions:**

1. **IP Address Restrictions** (Most Common)
   - Vultr allows IP whitelisting on access keys
   - Cloudflare Workers have dynamic IPs, causing 403 errors
   - **Solution:** Remove IP restrictions from Vultr Object Storage settings

2. **S3 Signing Incompatibility with Raindrop**
   - Raindrop uses `aws4fetch` library for S3 authentication
   - This library has compatibility issues with Vultr's S3 implementation
   - **Solution:** Use Netlify Functions with `@aws-sdk/client-s3` instead

3. **Hybrid Architecture Implementation**
   - Use Raindrop for AI/voice endpoints (ultra-low latency)
   - Use Netlify Functions for `/win` and `/leaderboard` endpoints
   - Frontend routes VIP list operations to Netlify Functions
   - Frontend routes chat/STT/TTS to Raindrop backend

4. **Traditional Issues:**
   - Verify Vultr credentials in environment variables
   - Check bucket name matches exactly: `bouncerai`
   - Ensure access key has **read AND write** permissions
   - Confirm endpoint URL is correct: `https://ams2.vultrobjects.com`

### Voice Features Not Working

**Problem:** STT/TTS errors

**Solutions:**
1. Check ElevenLabs API key is set
2. Verify model IDs:
   - STT: `scribe_v2`
   - TTS: `eleven_turbo_v2_5`
3. Ensure browser has microphone permissions

### Slow Response Times

**Problem:** Latency > 1 second

**Solutions:**
1. Verify using Cerebras API (not other providers)
2. Check network connection
3. Ensure Raindrop deployment is in optimal region
4. Review Cerebras API rate limits

### Deployment Issues

**Problem:** Raindrop build fails

**Solutions:**
1. Run `raindrop build validate` to check for errors
2. Ensure all environment variables are set
3. Check TypeScript compilation errors
4. Review logs: `raindrop build logs`

---

## 📊 Hackathon Requirements Checklist

- [x] **Built on Raindrop Platform** - Deployed on LiquidMetal
- [x] **Uses Cerebras Inference** - Llama-3.3-70B with ultra-low latency
- [x] **Integrates Vultr Services** - Object Storage for VIP leaderboard
- [x] **Demonstrates Speed** - Real-time latency display (<500ms avg)
- [x] **Launch-Ready Quality** - Polished UI, full features, production-ready
- [x] **Voice Integration** - ElevenLabs STT/TTS for enhanced UX

---

## 🎨 Project Structure

```
AI_bouncer_AI_Championship/
├── public/
│   └── index.html              # Single-page frontend
├── src/
│   └── bouncer/
│       ├── index.ts            # Main Raindrop application (Hono)
│       └── raindrop.gen.ts     # Generated environment types
├── functions/                  # Netlify Functions (fallback)
│   ├── chat.js
│   ├── leaderboard.js
│   ├── win.js
│   ├── stt.js
│   ├── tts.js
│   └── ...
├── server.js                   # Express server (local dev)
├── raindrop.yaml               # Raindrop configuration
├── netlify.toml                # Netlify configuration
├── package.json
└── README.md
```

---

## 🙏 Acknowledgments

- **LiquidMetal** - For the amazing Raindrop platform
- **Cerebras** - For ultra-fast AI inference
- **Vultr** - For reliable object storage
- **ElevenLabs** - For natural voice synthesis
- **AI Championship Hackathon** - For the opportunity and inspiration

---

## 📄 License

MIT License - See [LICENSE](LICENSE) file for details

---

## 🔗 Links

- **🎮 Live Demo:** [Play AI Bouncer](https://ai-bouncer.netlify.app)
- **📺 Demo Video:** [Watch on Vimeo](https://vimeo.com/1146107891)
- **📋 Devpost:** [Project Submission](https://devpost.com/software/ai-bouncer)
- **💻 GitHub:** [Source Code](https://github.com/kaiser-data/AI_bouncer_AI_Championship)
- **📚 LiquidMetal Docs:** [docs.liquidmetal.ai](https://docs.liquidmetal.ai)
- **🧠 Cerebras AI:** [cerebras.ai](https://cerebras.ai)
- **☁️ Vultr:** [vultr.com](https://vultr.com)

---

<div align="center">

**Built with ⚡ by the AI Bouncer Team**

*Challenge the AI. Earn your VIP status. Join the LIQUID METAL club.*

</div>
