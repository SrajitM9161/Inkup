import uploadImageToCloudinary from "../config/Cloudinary.config.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponseHandler from "../utils/apiResponseHandler.js";
import ApiErrorHandler from "../utils/apiErrorHandler.js";
import prisma from "../../prisma/prismaClient.js";

export const uploadTattoo = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const file = req.file;

  if (!file) throw new ApiErrorHandler(400, "Tattoo image is required");

  const url = await uploadImageToCloudinary(file.path);

  const tattoo = await prisma.tattoo.create({
    data: {
      userId,
      imageUrl: url,
    },
  });

  return new ApiResponseHandler(200, "Tattoo uploaded successfully", {
    tattooId: tattoo.id,
    imageUrl: tattoo.imageUrl,
  }).send(res);
});

export const getUserTattoos = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const tattoos = await prisma.tattoo.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return new ApiResponseHandler(200, "User tattoos fetched", {
    count: tattoos.length,
    tattoos,
  }).send(res);
});
