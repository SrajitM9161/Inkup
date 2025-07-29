/**
 * Finds the most relevant output image from ComfyUI using the unique hash prefix.
 * @param {Array<Object>} images - List of image objects with filenames.
 * @param {string} filenamePrefix - A short ID or filename prefix like "tryon_4e9d8a00".
 * @returns {Object|null} - The matched output image object.
 */
export function getOutputImage(images, filenamePrefix) {
  if (!images || !Array.isArray(images) || images.length === 0) {
    console.warn('[WARN] No images provided');
    return null;
  }

  const cleanedPrefix = filenamePrefix?.toLowerCase().replace(/\.png$/, '').trim();
  if (!cleanedPrefix) {
    console.error('[ERROR] Invalid filenamePrefix:', filenamePrefix);
    return null;
  }

  const outputPattern = new RegExp(`^${cleanedPrefix}_\\d+_\\.png$`, 'i');
  let matched = images.find((img) => outputPattern.test(img.filename.toLowerCase()));

  if (!matched) {
    const relaxedPattern = new RegExp(`^${cleanedPrefix}_.+\\.png$`, 'i');
    matched = images.find((img) => relaxedPattern.test(img.filename.toLowerCase()));
  }

  if (matched) {
    console.log('[DEBUG] Matched output image:', matched.filename);
    return matched;
  }

  console.warn('[WARN] No exact match found for prefix:', cleanedPrefix);
  images.forEach((img) => console.log(' -', img.filename));

  // Fallback to most recent
  const latest = [...images].sort((a, b) =>
    a.filename.localeCompare(b.filename)
  ).pop();

  if (latest) {
    console.log('[DEBUG] Fallback to latest image:', latest.filename);
    return latest;
  }

  return null;
}

export default getOutputImage;
