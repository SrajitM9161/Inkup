import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
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
import { cleanupFiles } from "../utils/cleanupFilesHandler.js";
import sharp from "sharp";
export const generateTryon = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { humanImage, tattooImage, maskImage } = req.processedImages;

  if (!humanImage?.length || !tattooImage?.length || !maskImage?.length) {
    throw new ApiErrorHandler(
      400,
      "All three images (human, tattoo, mask) are required."
    );
  }

  const humanResized = humanImage[0];
  const tattooResized = tattooImage[0];
  const maskResized = maskImage[0];

  const tempDir = path.join(process.cwd(), "Public/temp");
  const tryon_seed = Math.floor(Math.random() * 100000);
  const outputName = crypto.randomUUID();


  const binaryMaskPath = path.join(tempDir, `mask-binary-${Date.now()}.png`);
  await binarizeMask(maskResized.filePath, binaryMaskPath);

  const resizedMaskPath = path.join(tempDir, `mask-final-${Date.now()}.png`);
  await sharp(binaryMaskPath)
    .resize(humanResized.width, humanResized.height)
    .toFile(resizedMaskPath);

  const [humanUrl, tattooUrl, maskUrl] = await Promise.all([
    uploadImageToCloudinary(humanResized.filePath),
    uploadImageToCloudinary(tattooResized.filePath),
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
    width: humanResized.width,
    height: humanResized.height,
    seed: tryon_seed,
    outputName,
  });

  const ws = new WebSocket(
    `wss://${process.env.RUNPOD_SOCKET}ws?clientId=garment-tryon`
  );

  const waitForCompletion = new Promise((resolve, reject) => {
    const timeout = setTimeout(
      () => reject("Timeout waiting for ML result"),
      300000
    );

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

  const outputTempPath = path.join(tempDir, `${outputName}_00001_.png`);

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

    const cleanup = [
      humanResized.filePath,
      tattooResized.filePath,
      maskResized.filePath,
      binaryMaskPath,
      resizedMaskPath,
      outputTempPath
    ];
    await cleanupFiles(cleanup);
  }
});
