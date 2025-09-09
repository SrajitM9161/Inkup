export const isHeicFile = async (file: File) => {
  if (!file) return false;

  if (typeof window !== "undefined") {
    try {

      const { isHeic } = await import("heic-to");
      return await isHeic(file);
    } catch (error) {
      console.warn("HEIC detection failed, falling back:", error);
    }
  }

  if (file.type === "image/heic" || file.type === "image/heif") return true;
  return file.name.toLowerCase().endsWith(".heic") || file.name.toLowerCase().endsWith(".heif");
};

export const convertHeicToJpeg = async (file: File) => {

  const { heicTo } = await import("heic-to");

  const convertedBlob = await heicTo({
    blob: file,
    type: "image/jpeg",
    quality: 0.95,
  });

  return new File([convertedBlob], file.name.replace(/\.(heic|heif)$/i, ".jpg"), {
    type: "image/jpeg",
  });
};
