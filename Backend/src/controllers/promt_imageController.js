import { fal } from "@fal-ai/client";
import uploadImageToCloudinary from "../config/Cloudinary.config.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponseHandler from "../utils/apiResponseHandler.js";
import ApiErrorHandler from "../utils/apiErrorHandler.js";
import prisma from "../../prisma/prismaClient.js";
import axios from "axios";
import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

fal.config({ credentials: process.env.FAL_KEY });

export const editImage = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { prompt, images } = req.body;

  if (!prompt || !images?.length) {
    throw new ApiErrorHandler(400, "Prompt and images are required");
  }

  // 1. Create EditGeneration
  const editGeneration = await prisma.editGeneration.create({
    data: {
      userId,
      prompt,
      status: "PROCESSING",
    },
  });

  // 2. Upload inputs (FAL + Cloudinary)
  const inputAssets = await Promise.all(
    images.map(async (img) => {
      let falUrl;
      let cloudUrl;

      if (img.startsWith("data:image")) {
        const base64Data = img.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, "base64");

        // Upload to FAL
        falUrl = await fal.storage.upload(buffer);

        // Upload to Cloudinary
        const tempDir = path.join(process.cwd(), "public/temp");
        await fs.mkdir(tempDir, { recursive: true });
        const tempPath = path.join(tempDir, `${uuidv4()}.jpg`);
        await fs.writeFile(tempPath, buffer);
        cloudUrl = await uploadImageToCloudinary(tempPath);
        await fs.unlink(tempPath).catch(() => {});
      } else {
        falUrl = img;
        cloudUrl = img;
      }

      return prisma.editAsset.create({
        data: {
          editGenerationId: editGeneration.id,
          inputImageUrl: cloudUrl,
        },
      });
    })
  );

 const input = {
  prompt,
  image_urls: inputAssets.map((a) => a.inputImageUrl),
  num_images: 1,                                      
  output_format: "jpeg",
};


  const result = await fal.subscribe("fal-ai/nano-banana/edit", {
    input,
    logs: true,
  });

  const imagesOut = result?.data?.images?.map((img) => img.url) || [];
  if (!imagesOut.length) {
    throw new ApiErrorHandler(500, "No images generated");
  }

  const tempDir = path.join(process.cwd(), "public/temp");
  await fs.mkdir(tempDir, { recursive: true });

  const outputAssets = await Promise.all(
    imagesOut.map(async (imgUrl) => {
      const response = await axios.get(imgUrl, { responseType: "arraybuffer" });
      const tempPath = path.join(tempDir, `${uuidv4()}.jpg`);
      await fs.writeFile(tempPath, response.data);

      const cloudUrl = await uploadImageToCloudinary(tempPath);
      await fs.unlink(tempPath).catch(() => {});

      return prisma.editAsset.create({
        data: {
          editGenerationId: editGeneration.id,
          outputImageUrl: cloudUrl,
        },
      });
    })
  );

  await prisma.editGeneration.update({
    where: { id: editGeneration.id },
    data: { status: "COMPLETED" },
  });

  return new ApiResponseHandler(
  200,
  "Edit images generated & stored successfully",
  {
    editGeneration,
    inputAssets,
    outputAssets,
  }
).send(res);

});
