import { useCallback } from "react";
import toast from "react-hot-toast";
import { editImages } from "../../../../api/api";
import { useEditToolStore, useToolStore } from "../../../lib/store";
import { fileToBase64, base64ToFile } from "./useFileUtils";

export const usePromptSubmit = (
  onClose: () => void,
  promptInput: string,
  files: File[],
  displayImage: string | null
) => {
  const { setPrompt, addResultImage, clearImages } = useEditToolStore();
  const { userImage, setIsGenerating } = useToolStore();

  const handleSubmit = useCallback(async () => {
    const sourceImage = userImage || displayImage;

    if (!promptInput.trim() && !sourceImage && files.length === 0) {
      toast.error("Please provide a prompt or select an image.");
      return;
    }

    onClose();
    setPrompt(promptInput);
    setIsGenerating(true);

    try {
      let localFiles: File[] = [];
      if (files.length > 0) {
        localFiles = files;
      } else if (sourceImage) {
        const f = base64ToFile(sourceImage);
        if (f) localFiles = [f];
      }

      const base64Images = localFiles.length
        ? await Promise.all(localFiles.map(fileToBase64))
        : sourceImage
        ? [sourceImage]
        : [];

      if (base64Images.length === 0) {
        toast.error("No image available to send to API.");
        setIsGenerating(false);
        return;
      }

      clearImages();

      const task = editImages(promptInput, base64Images).then((data: any) => {
        const out = data?.data?.outputAssets;
        if (Array.isArray(out) && out.length) {
          out.forEach((asset: any) => addResultImage(asset.outputImageUrl));
          return "Images generated successfully!";
        }
        throw new Error(data?.error || "Invalid response from server");
      });

      toast.promise(task, {
        loading: "Generating images...",
        success: (msg) => msg,
        error: (err) => err.message || "Something went wrong.",
      });

      await task;
    } finally {
      setIsGenerating(false);
    }
  }, [promptInput, files, displayImage, userImage, onClose]);

  return handleSubmit;
};
