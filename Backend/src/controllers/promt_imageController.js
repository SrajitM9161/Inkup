// backend/controllers/generateImage.js
import { fal } from "@fal-ai/client";

fal.config({
  credentials: process.env.FAL_KEY, // secret in .env
});

export const generateImage = async (req, res) => {
  try {
    const { prompt, image } = req.body; // image = base64 or URL

    if (!prompt || !image) {
      return res.status(400).json({ error: "Prompt and image required" });
    }

    let uploadedUrl = image;

    // ✅ If it's a base64 string, upload it to FAL storage
    if (image.startsWith("data:image")) {
      const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");

      // fal.storage.upload accepts Buffer directly
      uploadedUrl = await fal.storage.upload(buffer);
      console.log("✅ Uploaded to FAL:", uploadedUrl);
    }

    // ✅ API expects image_urls (array)
    const input = {
      prompt,
      image_urls: [uploadedUrl],
      num_images: 1,
      output_format: "jpeg",
    };

    const result = await fal.subscribe("fal-ai/nano-banana/edit", {
      input,
      logs: true,
    });

    console.log("📥 Raw result:", JSON.stringify(result.data, null, 2));

    const images = result?.data?.images?.map((img) => img.url) || [];

    if (!images.length) {
      return res.status(500).json({
        error: "No images generated",
        raw: result,
      });
    }

    return res.json({ images });
  } catch (error) {
    console.error("🔥 Error generating image:", error);
    return res.status(500).json({
      error: error.message,
      detail: error.body || null,
    });
  }
};
