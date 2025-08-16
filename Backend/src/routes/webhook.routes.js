import express from "express";
import asyncHandler from "../utils/asyncHandler.js";
import prisma from "../../prisma/prismaClient.js";
import { sendToUser } from "../utils/socketServer.js";

const router = express.Router();

router.post(
  "/ml-webhook",
  asyncHandler(async (req, res) => {
    const { userId, generationId, outputImageUrl, itemImageUrl, maskImageUrl } = req.body;

    if (!generationId || !outputImageUrl || !userId) {
      return res.status(400).json({ message: "Invalid payload" });
    }

    // ✅ Save the generated image to DB
    await prisma.generationAsset.create({
      data: {
        generationId,
        outputImageUrl,
        itemImageUrl,
        maskImageUrl,
      },
    });

    // ✅ Update generation status
    await prisma.generation.update({
      where: { id: generationId },
      data: { status: "COMPLETED" },
    });

    // ✅ Notify frontend via WebSocket
    sendToUser(userId, {
      type: "tryon-completed",
      data: { generationId, outputImageUrl },
    });

    res.status(200).json({ message: "Webhook processed successfully" });
  })
);

export default router;