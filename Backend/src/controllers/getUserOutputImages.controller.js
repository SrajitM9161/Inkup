import asyncHandler from '../utils/asyncHandler.js';
import ApiResponseHandler from '../utils/apiResponseHandler.js';
import ApiErrorHandler from '../utils/apiErrorHandler.js';
import prisma from '../../prisma/prismaClient.js';

const getUserOutputImages = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  if (!userId) {
    throw new ApiErrorHandler(401, 'Unauthorized: user ID not found in token');
  }

  const generations = await prisma.generation.findMany({
    where: {
      userId,
      status: 'COMPLETED',
      assets: {
        some: { outputImageUrl: { not: null } },
      },
    },
    select: {
      id: true,
      assets: {
        where: { outputImageUrl: { not: null } },
        select: {
          id: true,
          outputImageUrl: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      },
    },
    orderBy: { createdAt: 'desc' },
  });


  const outputImages = generations.flatMap(({ id: generationId, assets }) =>
    assets.map(({ id: assetId, outputImageUrl, createdAt }) => ({
      generationId,
      assetId,
      outputImageUrl,
      createdAt,
    }))
  );

  return new ApiResponseHandler(
    200,
    'Output images fetched successfully',
    {
      outputImages,
      page,
      limit,
      hasMore: outputImages.length === limit, 
    }
  ).send(res);
});

export default getUserOutputImages;
