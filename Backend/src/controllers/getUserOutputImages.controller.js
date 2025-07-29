import asyncHandler from '../utils/asyncHandler.js';
import ApiResponseHandler from '../utils/apiResponseHandler.js';
import ApiErrorHandler from '../utils/apiErrorHandler.js';
import prisma from '../../prisma/prismaClient.js';

const getUserOutputImages = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    throw new ApiErrorHandler(400, 'User ID is required');
  }

  const generations = await prisma.generation.findMany({
    where: {
      userId: userId,
      status: 'COMPLETED',
    },
    include: {
      assets: true,
    },
  });

  if (!generations || generations.length === 0) {
    throw new ApiErrorHandler(404, 'No completed generations found for this user');
  }

  const outputImages = generations.flatMap((generation) =>
    generation.assets
      .filter((asset) => asset.outputImageUrl)
      .map((asset) => ({
        generationId: generation.id,
        assetId: asset.id,
        outputImageUrl: asset.outputImageUrl,
        createdAt: asset.createdAt,
      }))
  );

  if (outputImages.length === 0) {
    throw new ApiErrorHandler(404, 'No output images found for this user');
  }

  return new ApiResponseHandler(200, 'User output images fetched successfully', {
    outputImages,
  }).send(res);
});

export default  getUserOutputImages