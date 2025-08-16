import asyncHandler from '../utils/asyncHandler.js';
import ApiResponseHandler from '../utils/apiResponseHandler.js';
import ApiErrorHandler from '../utils/apiErrorHandler.js';
import prisma from '../../prisma/prismaClient.js';

const getUserOutputImages = asyncHandler(async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    throw new ApiErrorHandler(401, 'Unauthorized: user ID not found in token');
  }

  // Fetch generations with only assets that have outputImageUrl
  const generations = await prisma.generation.findMany({
    where: {
      userId,
      status: 'COMPLETED',
      assets: {
        some: {
          outputImageUrl: {
            not: null,
          },
        },
      },
    },
    select: {
      id: true,
      assets: {
        where: {
          outputImageUrl: {
            not: null,
          },
        },
        select: {
          id: true,
          outputImageUrl: true,
          createdAt: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  if (!generations.length) {
    throw new ApiErrorHandler(404, 'No output images found for this user');
  }

  // Flatten assets with generationId
  const outputImages = generations.flatMap(({ id: generationId, assets }) =>
    assets.map(({ id: assetId, outputImageUrl, createdAt }) => ({
      generationId,
      assetId,
      outputImageUrl,
      createdAt,
    }))
  );

  return new ApiResponseHandler(200, 'Output images fetched successfully', { outputImages }).send(res);
});

export default getUserOutputImages;
