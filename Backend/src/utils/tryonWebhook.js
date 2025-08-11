import asyncHandler from "../utils/asyncHandler.js";
import prisma from "../../prisma/prismaClient.js";
import { notifyUser } from "./socketServer.js"; // moved into services

const tryonWebhook = asyncHandler(async (req, res) => {
  const { generationId, userId, imageUrl } = req.body;

  if (!generationId || !userId || !imageUrl) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  await prisma.generation.update({
    where: { id: generationId },
    data: { status: "COMPLETED" },
  });

  await prisma.generationAsset.create({
    data: {
      generationId,
      outputImageUrl: imageUrl,
    },
  });

  notifyUser(userId, {
    type: "tryonComplete",
    generationId,
    imageUrl,
  });

  return res.status(200).json({ success: true });
});

export default tryonWebhook;
