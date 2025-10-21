/**
 * CLIENT-SIDE IMAGE UPLOAD TO CLOUDINARY
 * 
 * This file handles uploading images directly from the browser to Cloudinary.
 * It's FAST because images don't go through your server!
 * 
 * FLOW:
 * 1. User selects image file
 * 2. Get upload signature from our API
 * 3. Upload file directly to Cloudinary
 * 4. Return Cloudinary URL
 * 5. Save URL in database with meal
 */

interface UploadSignature {
  signature: string;
  timestamp: number;
  cloudName: string;
  apiKey: string;
  folder: string;
  uploadUrl: string;
}

/**
 * Upload an image file to Cloudinary
 * 
 * @param file - The image file to upload
 * @returns Cloudinary URL of the uploaded image
 * 
 * USAGE:
 * ```tsx
 * const file = event.target.files[0];
 * const imageUrl = await uploadImageToCloudinary(file);
 * // Save imageUrl to database
 * ```
 */
export async function uploadImageToCloudinary(file: File): Promise<string> {
  try {
    console.log('🔑 Step 1: Requesting upload signature...');
    
    // 1. Get upload signature from our API
    const signatureResponse = await fetch('/api/upload/signature');
    
    if (!signatureResponse.ok) {
      throw new Error('Failed to get upload signature');
    }
    
    const signatureData: UploadSignature = await signatureResponse.json();
    console.log('✅ Got upload signature');

    console.log('📤 Step 2: Uploading to Cloudinary...');
    
    // 2. Create FormData with file and signature
    const formData = new FormData();
    formData.append('file', file);
    formData.append('signature', signatureData.signature);
    formData.append('timestamp', signatureData.timestamp.toString());
    formData.append('api_key', signatureData.apiKey);
    formData.append('folder', signatureData.folder);

    // 3. Upload directly to Cloudinary
    const uploadResponse = await fetch(signatureData.uploadUrl, {
      method: 'POST',
      body: formData,
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error('Cloudinary upload error:', errorText);
      throw new Error('Failed to upload to Cloudinary');
    }

    const uploadResult = await uploadResponse.json();
    console.log('✅ Upload complete! URL:', uploadResult.secure_url);

    // 4. Return the secure URL
    return uploadResult.secure_url;

  } catch (error) {
    console.error('❌ Image upload failed:', error);
    throw error;
  }
}

/**
 * Upload with progress tracking (for larger images)
 * 
 * @param file - The image file to upload
 * @param onProgress - Callback function with upload progress (0-100)
 * @returns Cloudinary URL of the uploaded image
 */
export async function uploadImageWithProgress(
  file: File,
  onProgress: (progress: number) => void
): Promise<string> {
  try {
    // Get signature
    const signatureResponse = await fetch('/api/upload/signature');
    const signatureData: UploadSignature = await signatureResponse.json();

    // Create FormData
    const formData = new FormData();
    formData.append('file', file);
    formData.append('signature', signatureData.signature);
    formData.append('timestamp', signatureData.timestamp.toString());
    formData.append('api_key', signatureData.apiKey);
    formData.append('folder', signatureData.folder);

    // Upload with XMLHttpRequest for progress tracking
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      // Track upload progress
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100);
          onProgress(progress);
        }
      });

      // Handle completion
      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          const result = JSON.parse(xhr.responseText);
          resolve(result.secure_url);
        } else {
          reject(new Error('Upload failed'));
        }
      });

      // Handle errors
      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed'));
      });

      // Send request
      xhr.open('POST', signatureData.uploadUrl);
      xhr.send(formData);
    });

  } catch (error) {
    console.error('❌ Image upload with progress failed:', error);
    throw error;
  }
}

