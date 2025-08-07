import path from "path";
import fs from "fs/promises";
import crypto from "crypto";
import sharp from "sharp";
import WebSocket from "ws";
import axios from "axios";
import prisma from "../../prisma/prismaClient.js";
import mlAPI from "../config/ML.config.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiErrorHandler from "../utils/apiErrorHandler.js";
import ApiResponseHandler from "../utils/apiResponseHandler.js";
import uploadImageToCloudinary from "../config/Cloudinary.config.js";
import { buildComfyGraph } from "../ML/buildGraph.js";
import { binarizeMask } from "../utils/binarizeMask.js";

const ensurePng = async (inputPath, outputPath) => {
  await sharp(inputPath).png().toFile(outputPath);
  return outputPath;
};

export const generateTryon = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { humanImage, tattooImage, maskImage } = req.files;

  if (!humanImage || !tattooImage || !maskImage) {
    throw new ApiErrorHandler(400, "All three images (human, tattoo, mask) are required.");
  }

  const timestamp = Date.now();
  const tempDir = path.join(process.cwd(), "Public/temp");
  const tryon_seed = Math.floor(Math.random() * 100000);
  const outputName = crypto.randomUUID();

  const humanPath = await ensurePng(
    humanImage[0].path,
    path.join(tempDir, `human-${timestamp}.png`)
  );

  const tattooPath = await ensurePng(
    tattooImage[0].path,
    path.join(tempDir, `tattoo-${timestamp}.png`)
  );

  const maskPngPath = path.join(tempDir, `mask-${timestamp}.png`);
  const binaryMaskPath = path.join(tempDir, `mask-binary-${timestamp}.png`);

  await ensurePng(maskImage[0].path, maskPngPath);
  await binarizeMask(maskPngPath, binaryMaskPath);

  // ✅ Get human image size *before* resizing mask
  const { width, height } = await sharp(humanPath).metadata();
  if (!width || !height) {
    throw new ApiErrorHandler(500, "Failed to read dimensions from human image.");
  }

  const resizedMaskPath = path.join(tempDir, `mask-resized-${timestamp}.png`);
  await sharp(binaryMaskPath).resize(width, height).toFile(resizedMaskPath);

  // ✅ Upload to Cloudinary
  const [humanUrl, tattooUrl, maskUrl] = await Promise.all([
    uploadImageToCloudinary(humanPath),
    uploadImageToCloudinary(tattooPath),
    uploadImageToCloudinary(resizedMaskPath),
  ]);

  const generation = await prisma.generation.create({
    data: {
      userId,
      userImageUrl: humanUrl,
      status: "PENDING",
    },
  });

  const promptGraph = await buildComfyGraph({
    userImageUrl: humanUrl,
    itemImageUrl: tattooUrl,
    maskImageUrl: maskUrl,
    width,
    height,
    seed: tryon_seed,
    outputName,
  });

  const ws = new WebSocket(`wss://${process.env.RUNPOD_SOCKET}ws?clientId=garment-tryon`);

  const waitForCompletion = new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject("Timeout waiting for ML result"), 90000);

    ws.on("message", (data) => {
      const message = JSON.parse(data.toString());
      if (
        message.type === "executing" &&
        message.data.node === null &&
        message.data.prompt_id === outputName
      ) {
        clearTimeout(timeout);
        ws.close();
        resolve(true);
      }
    });

    ws.on("error", (err) => {
      clearTimeout(timeout);
      reject("WebSocket connection failed: " + err.message);
    });
  });

  try {
    await mlAPI.post("/prompt", {
      prompt: promptGraph.prompt,
      client_id: promptGraph.client_id,
      prompt_id: outputName,
    });

    await waitForCompletion;

    const filename = `${outputName}_00001_.png`;
    const imageUrl = `${process.env.RUNPOD}view?filename=${filename}&type=output`;

    const { data } = await axios.get(imageUrl, { responseType: "arraybuffer" });
    const outputTempPath = path.join(tempDir, filename);
    await fs.writeFile(outputTempPath, data);

    const uploadedOutputUrl = await uploadImageToCloudinary(outputTempPath);

    await prisma.generationAsset.create({
      data: {
        generationId: generation.id,
        itemImageUrl: tattooUrl,
        maskImageUrl: maskUrl,
        outputImageUrl: uploadedOutputUrl,
      },
    });

    await prisma.generation.update({
      where: { id: generation.id },
      data: { status: "COMPLETED" },
    });

    return new ApiResponseHandler(200, "Tryon generated successfully", {
      generationId: generation.id,
    }).send(res);
  } catch (err) {
    console.error("[ERROR] Tryon Generation Failure:", err);
    throw new ApiErrorHandler(500, "Tryon generation failed");
  } finally {
    // 🧹 Clean up temp files
    const cleanup = [
      humanPath,
      tattooPath,
      maskPngPath,
      binaryMaskPath,
      resizedMaskPath,
    ];
    await Promise.all(cleanup.map((f) => fs.unlink(f).catch(() => null)));
  }
});
