# VIP List Bucket Setup Guide

## Overview
The AI Bouncer application uses Vultr's Object Storage (S3-compatible) to persist the VIP list between sessions. This guide explains how to set up the bucket and configure your environment for both local development and Netlify deployment.

## Prerequisites
- Vultr account with Object Storage enabled
- Cerebras API key for AI functionality
- Basic understanding of environment variables

## Step 1: Create a Vultr Object Storage Bucket

1. Log in to your [Vultr dashboard](https://my.vultr.com/)
2. Navigate to "Object Storage" in the sidebar
3. Click "Create Object Storage"
4. Choose a region (recommended: `New Jersey` or `ewr1`)
5. Select a label for your storage
6. Click "Create"

## Step 2: Get Your Credentials

After creation, you'll see:
- **Endpoint URL**: e.g., `https://your-label.ewr1.vultrobjects.com`
- **Access Key**: A 20-character string
- **Secret Key**: A 40-character string

To get your keys:
1. Click on "Show Keys" for your Object Storage
2. Note down the Access Key and Secret Key

## Step 3: Create the Bucket Name

1. On the Object Storage page, click the link for your storage to access the web console
2. Create a new bucket with a unique name (e.g., `your-project-vip-list`)
3. Make sure the bucket name follows S3 naming rules (lowercase, no spaces, etc.)

## Step 4: Configure Environment Variables

### For Local Development:
Create a `.env` file in your project root:

```env
# Server Configuration
PORT=3000

# Cerebras AI API
CEREBRAS_API_KEY=your-cerebras-api-key-here

# Vultr Object Storage (S3-compatible)
VULTR_ACCESS_KEY=your-vultr-access-key-here
VULTR_SECRET_KEY=your-vultr-secret-key-here
VULTR_ENDPOINT=ewr1.vultrobjects.com
VULTR_BUCKET_NAME=your-bucket-name-here
```

### For Netlify Deployment:
Go to your Netlify dashboard:
1. Navigate to your site
2. Go to "Site settings" → "Build & deploy" → "Environment"
3. Click "Edit variables" and add:

```
CEREBRAS_API_KEY=your-cerebras-api-key-here
VULTR_ACCESS_KEY=your-vultr-access-key-here
VULTR_SECRET_KEY=your-vultr-secret-key-here
VULTR_ENDPOINT=ewr1.vultrobjects.com
VULTR_BUCKET_NAME=your-bucket-name-here
```

## Step 5: Bucket Permissions

The application needs the following permissions on your Vultr Object Storage:
- Read access to the bucket
- Write access to the bucket (specifically for `vip_list.json`)

Vultr Object Storage buckets are private by default, and the application uses your API keys for authentication, so no additional permissions need to be set.

## Step 6: Testing the Setup

To verify everything is working:

1. **Local Testing:**
   ```bash
   npm run dev
   ```
   
   You should see `Bucket 'your-bucket-name' connected` in the console.

2. **API Testing:**
   - Check current VIPs: `GET /leaderboard`
   - Add a VIP: `POST /win` with payload `{"username": "test", "attempts": 1, "method": "secret"}`

## Common Issues and Troubleshooting

### Issue: "Bucket not found or no access"
- Ensure the `VULTR_BUCKET_NAME` matches exactly what you created
- Verify your credentials are correct
- Check that you're using the right endpoint

### Issue: "Failed to save to VIP list" 
- Verify your secret key has write permissions
- Ensure the bucket name is correct
- Check that your account is in good standing with Vultr

### Issue: "SignatureDoesNotMatch" error
- Double-check your access and secret keys
- Ensure there are no extra spaces or characters in your keys

### Issue: Works locally but not in Netlify deployment
- Verify environment variables are set correctly in Netlify dashboard
- Ensure you're not committing actual credentials to version control
- Check the Netlify build logs for detailed error messages

## Environment Variable Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `VULTR_ACCESS_KEY` | Your Vultr Object Storage access key | `ABCDEFGHIJKLMNOPQRST` |
| `VULTR_SECRET_KEY` | Your Vultr Object Storage secret key | `AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTt` |
| `VULTR_ENDPOINT` | The endpoint domain for your region | `ewr1.vultrobjects.com` |
| `VULTR_BUCKET_NAME` | Name of your created bucket | `my-vip-list-bucket` |

## Security Tips

1. Never commit your `.env` file to version control
2. Use different buckets for development and production
3. Rotate your API keys periodically
4. Monitor your Vultr billing to avoid unexpected charges
5. The `.gitignore` file should already include `.env` to prevent accidental commits

## Verification Checklist

Before deploying:
- [ ] Vultr Object Storage bucket created
- [ ] Access and secret keys noted securely
- [ ] Environment variables set both locally and in Netlify
- [ ] Test successful connection locally
- [ ] Test add/remove VIP functionality
- [ ] Verify Netlify build completes without errors
- [ ] Confirm VIP list persists across redeployments