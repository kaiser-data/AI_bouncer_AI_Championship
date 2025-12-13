# AI Bouncer - LIQUID METAL Club

A web chat game where users try to convince a stubborn AI Bouncer to let them into a virtual cyberpunk club. Built for the AI Champion Ship hackathon (LiquidMetal + Vultr).

**Category:** Best Ultra-Low Latency App (Cerebras)

## Features

- **Multiple Bouncer Personalities** - Viktor (classic), Zen-9 (philosophical), Maximus (dramatic), S.A.R.C. (sarcastic), Unit-7 (tired)
- **Progressive Hint System** - Hints unlock after failed attempts
- **Achievements** - First Try, Persistent, Speed Demon, Comedian, Secret Keeper
- **Real-time Latency Display** - Shows Cerebras ultra-low latency response times
- **VIP Leaderboard** - Stored on Vultr Object Storage
- **Streaming Responses** - Even faster perceived response times

## Tech Stack

- **Platform:** LiquidMetal Raindrop
- **Backend:** Node.js + Express
- **AI Inference:** Cerebras Llama-3.3-70b (ultra-low latency)
- **Storage:** Vultr Object Storage (S3-compatible)
- **Frontend:** Single HTML file + Tailwind CSS

## Local Development

1. Clone and install:
```bash
npm install
```

2. Create `.env` from template:
```bash
cp .env.example .env
```

3. Fill in your credentials in `.env`:
```
PORT=3000
CEREBRAS_API_KEY=your-cerebras-key
VULTR_ACCESS_KEY=your-vultr-access-key
VULTR_SECRET_KEY=your-vultr-secret-key
VULTR_ENDPOINT=ams1.vultrobjects.com
VULTR_BUCKET_NAME=your-bucket-name
```

4. Run locally:
```bash
npm start
```

5. Open http://localhost:3000

## Deploy to LiquidMetal Raindrop

1. Install Raindrop CLI:
```bash
# Follow instructions at https://docs.liquidmetal.ai/reference/cli/
```

2. Initialize and deploy:
```bash
raindrop build init
raindrop build deploy --start
```

3. Set environment variables:
```bash
raindrop build env set CEREBRAS_API_KEY your-key
raindrop build env set VULTR_ACCESS_KEY your-key
raindrop build env set VULTR_SECRET_KEY your-key
raindrop build env set VULTR_ENDPOINT ams1.vultrobjects.com
raindrop build env set VULTR_BUCKET_NAME your-bucket
```

4. Check status and logs:
```bash
raindrop build status
raindrop logs tail
```

## Vultr Object Storage Setup

1. Create Object Storage in Vultr console
2. Create a bucket (e.g., `bouncerai`)
3. Copy Access Key, Secret Key, and Hostname to your `.env`

For complete setup instructions, see [VIP_BUCKET_SETUP.md](VIP_BUCKET_SETUP.md).

### Common Issues:
- If you see "Bucket not found" error, verify your bucket name matches exactly
- If "Failed to save" occurs, check your credentials and bucket permissions
- For Netlify deployments, ensure environment variables are set in the Netlify dashboard

## How to Win

1. **Secret Phrase:** Say "LIQUID_METAL"
2. **Make the Bouncer Laugh:** Tell a genuinely funny joke
3. **Be Creative:** Show wit and persistence

## API Endpoints

- `POST /chat` - Send message, get bouncer response
- `POST /chat/stream` - Streaming response for faster UX
- `GET /bouncer` - Get current bouncer personality
- `POST /win` - Add username to VIP list
- `GET /leaderboard` - Get VIP list
- `GET /stats` - Get game statistics
- `GET /health` - Health check

## Hackathon Requirements

- [x] Built on Raindrop Platform
- [x] Uses Cerebras Inference (ultra-low latency)
- [x] Integrates Vultr Object Storage
- [x] Demonstrates latency speed prominently
- [x] Launch-ready quality

## License

MIT
