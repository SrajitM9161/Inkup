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
      userId,
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

  const updated = await prisma.generation.update({
    where: { id: generation.id },
    data: { itemImageUrl: url },
  });

  return new ApiResponseHandler(200, 'Item image uploaded', updated).send(res);
});
