import asyncHandler from '../utils/asyncHandler.js';
import ApiResponseHandler from '../utils/apiResponseHandler.js';
import ApiErrorHandler from '../utils/apiErrorHandler.js';
import prisma from '../../prisma/prismaClient.js';

const POLLING_INTERVAL = 3000; // in ms (3 seconds)
const TIMEOUT = 30000; // in ms (30 seconds)

export const getTryonImage = asyncHandler(async (req, res) => {
  const { generationId } = req.params;

  const waitForImage = async () => {
    const startTime = Date.now();

    while (Date.now() - startTime < TIMEOUT) {
      const generation = await prisma.generation.findUnique({
        where: { id: generationId },
        include: { assets: true },
      });

      if (!generation) {
        throw new ApiErrorHandler(404, 'Generation not found');
      }

      const outputImageUrl = generation.assets?.[0]?.outputImageUrl;

      if (outputImageUrl) {
        return outputImageUrl;
      }

      // Wait for a short interval before checking again
      await new Promise((resolve) => setTimeout(resolve, POLLING_INTERVAL));
    }

    return null; // Timeout
  };

  const outputImageUrl = await waitForImage();

  if (!outputImageUrl) {
    throw new ApiErrorHandler(408, 'Image generation timed out. Please try again later.');
  }

  return new ApiResponseHandler(200, 'Image fetched successfully', {
    outputImageUrl,
  }).send(res);
});
