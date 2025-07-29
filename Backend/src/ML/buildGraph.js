import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import uploadToComfyUI from './uploadToComfyUI.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basePath = path.resolve(__dirname, 'baseGraphTemplate.json');

export async function buildComfyGraph({ userImageUrl, itemImageUrl, maskImageUrl, width, height, seed, outputName }) {
  console.log('[DEBUG] Building graph with:', { userImageUrl, itemImageUrl, maskImageUrl, outputName });

  const raw = fs.readFileSync(basePath, 'utf-8');
  const workflow = JSON.parse(raw);

  // ✅ Set output file prefix on SaveImage node (ID: 143)
  if (workflow["143"]?.inputs) {
    workflow["143"].inputs.filename_prefix = outputName;
    console.log('[DEBUG] Updated SaveImage prefix to:', workflow["143"].inputs.filename_prefix);
  } else {
    throw new Error('SaveImage node (143) not found in base graph');
  }

  // ✅ Width, height, seed
  workflow['27'].inputs.value = parseInt(width);     // Width
  workflow['28'].inputs.value = parseInt(height);    // Height
  workflow['95'].inputs.seed = parseInt(seed);       // Seed

  // ✅ Upload all images to ComfyUI's input folder and get internal paths
  const humanPath = await uploadToComfyUI(userImageUrl, 'human', outputName);
  const itemPath = await uploadToComfyUI(itemImageUrl, 'tattoo', outputName);
  const maskPath = await uploadToComfyUI(maskImageUrl, 'mask', outputName);

  // ✅ Ensure image loader nodes exist and assign uploaded image paths
  if (!workflow['33'] || !workflow['96'] || !workflow['153']) {
    throw new Error('Base graph missing image nodes (33, 96, 153)');
  }

  workflow['33'].inputs.image = humanPath;  // Human image
  workflow['96'].inputs.image = itemPath;   // Tattoo image
  workflow['153'].inputs.image = maskPath;  // Mask image
 workflow["143"].inputs.filename_prefix = outputName; // tryon_abc123
  console.log('[DEBUG] Final Graph Prepared ✅');

  return {
    prompt: workflow,
    client_id: 'garment-tryon',
    extra_data: {},
  };
}