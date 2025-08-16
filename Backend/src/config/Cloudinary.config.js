import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs/promises';
import sharp from 'sharp';
import path from 'path';

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImageToCloudinary = async (filePath) => {
  try {
    if (!filePath) throw new Error('No file path provided');

    const { size } = await fs.stat(filePath);
    console.log(`Original: ${(size / 1024 / 1024).toFixed(2)} MB`);

    // Always compress and convert to JPEG
    const compressedPath = path.join(
      path.dirname(filePath),
      path.basename(filePath, path.extname(filePath)) + '-compressed.jpg'
    );

    await sharp(filePath)
      .resize({ width: 2000, withoutEnlargement: true }) // cap resolution
      .jpeg({ quality: 80 }) // compress
      .toFile(compressedPath);

    await fs.unlink(filePath); // remove original

    const { size: compressedSize } = await fs.stat(compressedPath);
    console.log(`Compressed: ${(compressedSize / 1024 / 1024).toFixed(2)} MB`);

    const response = await cloudinary.uploader.upload(compressedPath, {
      resource_type: 'image',
      folder: 'generations',
    });

    console.log('Uploaded to Cloudinary:', response.secure_url);

    await fs.unlink(compressedPath); // cleanup
    return response.secure_url;
  } catch (error) {
    console.error('Upload error:', error);
    try { await fs.unlink(filePath); } catch {}
    return null;
  }
};

export default uploadImageToCloudinary;
