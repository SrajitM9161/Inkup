import uploadImageToCloudinary from '../config/Cloudinary.config.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiResponseHandler from '../utils/apiResponseHandler.js';
import ApiErrorHandler from '../utils/apiErrorHandler.js';
import prisma from '../../prisma/prismaClient.js';

export const uploadUserImage = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const file = req.file;

  if (!file) throw new ApiErrorHandler(400, 'User image is required');

  const url = await uploadImageToCloudinary(file.path);

const generation = await prisma.generation.create({
  data: {
    user: {
      connect: { id: userId },
    },
    userImageUrl: url,
    status: 'PENDING',
  },
});


  return new ApiResponseHandler(200, 'User image uploaded', generation).send(res);
});

export const uploadItemImage = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const file = req.file;

  if (!file) throw new ApiErrorHandler(400, 'Item image is required');

  const url = await uploadImageToCloudinary(file.path);

  const generation = await prisma.generation.findFirst({
    where: {
      userId,
      status: 'PENDING',
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  if (!generation) throw new ApiErrorHandler(404, 'User image must be uploaded first');

  let asset = await prisma.generationAsset.findFirst({
    where: {
      generationId: generation.id,
    },
  });

  if (asset) {
    asset = await prisma.generationAsset.update({
      where: { id: asset.id },
      data: { itemImageUrl: url },
    });
  } else {
    asset = await prisma.generationAsset.create({
      data: {
        generationId: generation.id,
        itemImageUrl: url,
      },
    });
  }

  return new ApiResponseHandler(200, 'Item image uploaded', asset).send(res);
});
