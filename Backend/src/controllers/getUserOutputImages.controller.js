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
      projectId: true,
      assets: {
        where: { outputImageUrl: { not: null } },
        select: {
          id: true,
          outputImageUrl: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
      },
    },
    orderBy: { createdAt: 'desc' },
    skip,
    take: limit,
  });

  const outputImages = generations.flatMap(({ id: generationId, projectId, assets }) =>
    assets.map(({ id: assetId, outputImageUrl, createdAt }) => ({
      generationId,
      assetId,
      outputImageUrl,
      createdAt,
      projectId,
    }))
  );
  
  const totalCount = await prisma.generation.count({ where: { userId, status: 'COMPLETED' } });
  const hasMore = (skip + outputImages.length) < totalCount;

  return new ApiResponseHandler(
    200,
    'Output images fetched successfully',
    {
      outputImages,
      page,
      limit,
      hasMore,
    }
  ).send(res);
});

export default getUserOutputImages;