import uploadImageToCloudinary from "../config/Cloudinary.config.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponseHandler from "../utils/apiResponseHandler.js";
import ApiErrorHandler from "../utils/apiErrorHandler.js";
import prisma from "../../prisma/prismaClient.js";

export const uploadTattoo = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const files = req.files; 
  if (!files || files.length === 0) {
    throw new ApiErrorHandler(400, "At least one tattoo image is required");
  }

  const uploadedTattoos = [];

  for (const file of files) {
    const url = await uploadImageToCloudinary(file.path);

    const tattoo = await prisma.tattoo.create({
      data: {
        userId,
        imageUrl: url,
      },
    });

    uploadedTattoos.push({
      tattooId: tattoo.id,
      imageUrl: tattoo.imageUrl,
    });
  }

  return new ApiResponseHandler(200, "Tattoos uploaded successfully", {
    count: uploadedTattoos.length,
    tattoos: uploadedTattoos,
  }).send(res);
});

export const getUserTattoos = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  // pagination params
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const skip = (page - 1) * limit;

  const [tattoos, total] = await Promise.all([
    prisma.tattoo.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.tattoo.count({ where: { userId } }),
  ]);

  return new ApiResponseHandler(200, "User tattoos fetched", {
    page,
    limit,
    total,
    pages: Math.ceil(total / limit),
    tattoos,
  }).send(res);
});
