import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs/promises';


cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImageToCloudinary = async (filePath) => {
  try {
    if (!filePath) throw new Error('No file path provided');

    const response = await cloudinary.uploader.upload(filePath, {
      resource_type: 'auto',
      folder: 'generations',
    });

    console.log('Uploaded to Cloudinary:', response.secure_url);
    await fs.unlink(filePath); // delete local file after successful upload

    return response.secure_url;
  } catch (error) {
    console.error('Upload error:', error);
    try {
      await fs.unlink(filePath); // clean up even on failure
    } catch (_) {}
    return null;
  }
};

export default uploadImageToCloudinary;
