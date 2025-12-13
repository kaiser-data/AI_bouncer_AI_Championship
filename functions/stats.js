import { config } from 'dotenv';
config();

import {
  S3Client,
  GetObjectCommand
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

export async function handler(event, context) {
  try {
    const vipData = await getVIPList();
    const stats = {
      totalVips: vipData.vips.length,
      avgAttempts: vipData.vips.length > 0
        ? (vipData.vips.reduce((sum, v) => sum + (v.attempts || 1), 0) / vipData.vips.length).toFixed(1)
        : 0,
      methodBreakdown: vipData.vips.reduce((acc, v) => {
        acc[v.method || 'unknown'] = (acc[v.method || 'unknown'] || 0) + 1;
        return acc;
      }, {})
    };
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(stats),
    };
  } catch (error) {
    console.error('Stats function error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Failed to get stats' }),
    };
  }
}