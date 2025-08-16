import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

const processImage1K = async (inputFile) => {
  if (!inputFile?.path) throw new Error('Invalid uploaded file');

  const tempDir = path.join(process.cwd(), 'Public/temp');
  await fs.mkdir(tempDir, { recursive: true });

  const pngPath = path.join(tempDir, `${crypto.randomUUID()}.png`);
  await sharp(inputFile.path).png().toFile(pngPath);

  await fs.unlink(inputFile.path).catch(() => null);


  const { width, height } = await sharp(pngPath).metadata();
  if (!width || !height) throw new Error('Failed to read image dimensions');

  const MAX_DIM = 1024;
  if (width <= MAX_DIM && height <= MAX_DIM) {
    return { filePath: pngPath, width, height };
  }

  const resizedPath = path.join(tempDir, `${crypto.randomUUID()}-1k.png`);
  await sharp(pngPath)
    .resize({
      width: width > height ? MAX_DIM : null,
      height: height >= width ? MAX_DIM : null,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .png()
    .toFile(resizedPath);

  await fs.unlink(pngPath).catch(() => null);

  const resizedMeta = await sharp(resizedPath).metadata();
  return { filePath: resizedPath, width: resizedMeta.width, height: resizedMeta.height };
};


export const image1kProcessor = async (req, res, next) => {
  try {
    if (!req.files) throw new Error('No files uploaded');

    const processed = {};
    const fileKeys = Object.keys(req.files);

    for (const key of fileKeys) {
      const files = req.files[key];
      if (!Array.isArray(files) || !files.length) continue;

      processed[key] = [];
      for (const file of files) {
        const result = await processImage1K(file);
        processed[key].push(result);
      }
    }

    req.processedImages = processed;
    next();
  } catch (err) {
    console.error('[image1kProcessor] Error:', err);
    res.status(400).json({ error: err.message || 'Image processing failed' });
  }
};
