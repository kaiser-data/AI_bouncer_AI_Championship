import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand
} from '@aws-sdk/client-s3';

// Vultr S3 Client Configuration
const vultrEndpoint = process.env.VULTR_ENDPOINT || 'ams2.vultrobjects.com';
const endpoint = vultrEndpoint.startsWith('http') ? vultrEndpoint : `https://${vultrEndpoint}`;

const s3Client = new S3Client({
  region: 'ams2',
  endpoint: endpoint,
  credentials: {
    accessKeyId: process.env.VULTR_ACCESS_KEY,
    secretAccessKey: process.env.VULTR_SECRET_KEY
  },
  forcePathStyle: true
});

const BUCKET_NAME = process.env.VULTR_BUCKET_NAME || 'vip-list-bucket';
const VIP_LIST_KEY = 'vip_list.json';

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

export async function handler(event, context) {
  try {
    const body = JSON.parse(event.body);
    const { username, attempts, method } = body;

    if (!username || typeof username !== 'string') {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'Valid username is required' }),
      };
    }

    const cleanUsername = username.trim().slice(0, 20);

    if (cleanUsername.length < 1) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'Username cannot be empty' }),
      };
    }

    const vipData = await getVIPList();

    // Check if username already exists
    const exists = vipData.vips.some(
      vip => vip.username.toLowerCase() === cleanUsername.toLowerCase()
    );

    if (exists) {
      return {
        statusCode: 409,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'Username already on VIP list' }),
      };
    }

    // Add new VIP with more data
    vipData.vips.unshift({
      username: cleanUsername,
      timestamp: new Date().toISOString(),
      attempts: attempts || 1,
      method: method || 'unknown' // 'secret', 'joke', 'creativity', 'challenge'
    });

    // Keep only last 100 VIPs
    vipData.vips = vipData.vips.slice(0, 100);

    await saveVIPList(vipData);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        success: true,
        message: `Welcome to the VIP list, ${cleanUsername}!`,
        position: 1
      }),
    };
  } catch (error) {
    console.error('Win function error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Failed to save to VIP list' }),
    };
  }
}