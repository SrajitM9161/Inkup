import uploadImageToCloudinary from '../config/Cloudinary.config.js';
import prisma from '../../prisma/prismaClient.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiResponseHandler from '../utils/apiResponseHandler.js';
import ApiErrorHandler from '../utils/apiErrorHandler.js';


const createGeneration = asyncHandler(async (req, res) => {
   const userId = req.user.id;
  console.log("Incoming files:", req.files); // 👈 Check this!
  console.log("userId:", userId);

  const userImage = req.files?.['userImage']?.[0];
  const itemImage = req.files?.['itemImage']?.[0];

  if (!userId || !userImage || !itemImage) {
    throw new ApiErrorHandler(400, 'Missing required fields: userId, userImage, or itemImage');
  }

  const [userImageUrl, itemImageUrl] = await Promise.all([
    uploadImageToCloudinary(userImage.path),
    uploadImageToCloudinary(itemImage.path)
  ]);

  if (!userImageUrl || !itemImageUrl) {
    throw new ApiErrorHandler(500, 'Failed to upload images to Cloudinary');
  }

  const generation = await prisma.generation.create({
    data: {
      userId,
      userImageUrl,
      itemImageUrl,
      status: 'PENDING',
      outputImageUrl: null,
    },
  });

  return new ApiResponseHandler(201, 'Generation created successfully', generation).send(res);
});

export { createGeneration };
