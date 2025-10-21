/**
 * CLOUDINARY CONFIGURATION
 * 
 * This file sets up Cloudinary for server-side operations.
 * Used for generating upload signatures and managing images.
 */

import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

/**
 * Generate a signature for secure client-side uploads
 * 
 * HOW IT WORKS:
 * 1. Client requests upload signature from server
 * 2. Server generates signed parameters using Cloudinary secret
 * 3. Client uploads directly to Cloudinary with signature
 * 4. Cloudinary verifies signature and accepts upload
 * 
 * This is secure because:
 * - Client never sees the API secret
 * - Signature expires after a short time
 * - Only allows specific upload parameters
 */
export function generateUploadSignature(folder: string = 'meal-images') {
  const timestamp = Math.round(new Date().getTime() / 1000);
  
  const params = {
    timestamp,
    folder,
    // Add transformations to happen on upload
    transformation: 'w_800,h_800,c_fill,q_auto,f_auto',
  };

  const signature = cloudinary.utils.api_sign_request(
    params,
    process.env.CLOUDINARY_SECRET!
  );

  return {
    signature,
    timestamp,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_KEY,
    folder,
  };
}

/**
 * Extract public ID from Cloudinary URL
 * Used when deleting images
 */
export function getPublicIdFromUrl(url: string): string | null {
  try {
    // Example URL: https://res.cloudinary.com/meal-creator/image/upload/v1234567/meal-images/photo.jpg
    // Returns: meal-images/photo
    
    const parts = url.split('/');
    const uploadIndex = parts.findIndex(part => part === 'upload');
    
    if (uploadIndex === -1) return null;
    
    // Get everything after /upload/vXXXXXX/
    const pathParts = parts.slice(uploadIndex + 2);
    const filename = pathParts.join('/');
    
    // Remove file extension
    const publicId = filename.replace(/\.[^/.]+$/, '');
    
    return publicId;
  } catch (error) {
    console.error('Error extracting public ID:', error);
    return null;
  }
}

/**
 * Delete an image from Cloudinary
 */
export async function deleteImage(publicId: string): Promise<boolean> {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log(`✅ Deleted image from Cloudinary: ${publicId}`, result);
    return result.result === 'ok';
  } catch (error) {
    console.error('❌ Error deleting image from Cloudinary:', error);
    return false;
  }
}

export default cloudinary;

