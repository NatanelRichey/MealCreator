import {v2 as cloudinary} from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "meal-creator",
    api_key: process.env.CLOUDINARY_KEY || "993934831634839",
    api_secret: process.env.CLOUDINARY_SECRET || "eWd4bAWS9ZFlQYeWABN3taCHQkI"
  });

export const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'meal-images',
        allowedFormats: ['jpeg', 'png', 'jpg', 'webp']
    }
});