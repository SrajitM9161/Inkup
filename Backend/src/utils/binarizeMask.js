import sharp from "sharp";

/**
 * Converts any input image into a binary (black and white) mask.
 * Ensures correct alpha channel (optional) and pure binary output.
 *
 * @param {string} inputPath - Path to the original mask image.
 * @param {string} outputPath - Path to save the binary mask image.
 * @returns {Promise<string>} - Path to the processed binary mask.
 */
export async function binarizeMask(inputPath, outputPath) {
  try {
    const { data, info } = await sharp(inputPath)
      .greyscale()
      .threshold(128, { grayscale: true }) 
      .raw()
      .toBuffer({ resolveWithObject: true });

    // Reconstruct the binary image from raw data
    const binaryBuffer = Buffer.from(data);

    await sharp(binaryBuffer, {
      raw: {
        width: info.width,
        height: info.height,
        channels: 1, // grayscale only
      },
    })
      .png()
      .toFile(outputPath);

    return outputPath;
  } catch (err) {
    console.error("[BinarizeMaskError]", err);
    throw new Error("Failed to binarize mask.");
  }
}
