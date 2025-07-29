import axios from 'axios';
import FormData from 'form-data';
import mlAPI from '../config/ML.config.js';

/**
 * Uploads an image from a URL to ComfyUI with a consistent filename.
 * @param {string} url - Public URL of the image.
 * @param {string} label - 'human', 'tattoo', or 'mask'
 * @param {string} baseName - short base name like 'tryon_93ab2f3a'
 * @returns {string} - Remote path inside ComfyUI
 */
async function uploadToComfyUI(url, label, baseName) {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });

    const uniqueFilename = `${baseName}_${label}.png`;

    const form = new FormData();
    form.append('image', Buffer.from(response.data), uniqueFilename);
    form.append('type', 'input');
    form.append('subfolder', 'clipspace');

    await mlAPI.post('/upload/image', form, {
      headers: form.getHeaders(),
    });

    const remotePath = `clipspace/${uniqueFilename}`;
    console.log(`[DEBUG] Uploaded ${label} image as ${remotePath}`);
    return remotePath;
  } catch (err) {
    console.error(`[ERROR] ComfyUI Upload failed for ${label}:`, err.message);
    throw new Error(`Upload failed for ${label}`);
  }
}

export default uploadToComfyUI;
