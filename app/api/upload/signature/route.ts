import { NextResponse } from 'next/server';
import { generateUploadSignature } from '@/lib/cloudinary';

/**
 * GET /api/upload/signature
 * 
 * Generate a signed upload URL for Cloudinary
 * 
 * HOW SECURE UPLOADS WORK:
 * 
 * 1. Client requests signature from this endpoint
 * 2. Server creates signature using Cloudinary secret (client never sees this!)
 * 3. Client uploads directly to Cloudinary with signature
 * 4. Cloudinary verifies signature and accepts upload
 * 
 * WHY THIS IS FAST:
 * - Image goes directly from user's browser → Cloudinary CDN
 * - Doesn't go through your Next.js server
 * - No server bottleneck!
 * - Upload happens in parallel with other operations
 * 
 * FLOW:
 * User selects image → Request signature → Upload to Cloudinary → Get URL → Save to DB
 */
export async function GET() {
  try {
    const uploadData = generateUploadSignature('meal-images');

    console.log('✅ Generated upload signature for client');

    return NextResponse.json(
      {
        signature: uploadData.signature,
        timestamp: uploadData.timestamp,
        cloudName: uploadData.cloudName,
        apiKey: uploadData.apiKey,
        folder: uploadData.folder,
        uploadUrl: `https://api.cloudinary.com/v1_1/${uploadData.cloudName}/image/upload`
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('❌ Error generating upload signature:', error);

    return NextResponse.json(
      { error: 'Failed to generate upload signature' },
      { status: 500 }
    );
  }
}

