import asyncHandler from '../utils/asyncHandler.js';
import ApiResponseHandler from '../utils/apiResponseHandler.js';
import ApiErrorHandler from '../utils/apiErrorHandler.js';
import prisma from '../../prisma/prismaClient.js';

export const getTryonImage = asyncHandler(async (req, res) => {
  const { generationId } = req.params;

  const generation = await prisma.generation.findUnique({
    where: { id: generationId },
    include: { assets: true },
  });

  if (!generation) {
    throw new ApiErrorHandler(404, 'Generation not found');
  }

  const outputImageUrl = generation.assets?.[0]?.outputImageUrl;

  if (outputImageUrl) {
 
    return new ApiResponseHandler(200, 'Image fetched successfully', {
      status: 'COMPLETED',
      outputImageUrl,
    }).send(res);
  } else {
 
    return new ApiResponseHandler(200, 'Image is still generating', {
      status: 'PENDING',
      outputImageUrl: null,
    }).send(res);
  }
});
