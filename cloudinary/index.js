import cloudinary from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
  });

export const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: () => 'meal-images',
        allowedFormats: ['jpeg', 'png', 'jpg', 'webp']
    }
});

export default cloudinary