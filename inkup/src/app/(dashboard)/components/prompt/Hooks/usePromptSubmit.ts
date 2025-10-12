import { useCallback } from "react";
import toast from "react-hot-toast";
import { editImages } from "../../../../api/api";
import { useEditToolStore, useToolStore } from "../../../lib/store";

const urlToBase64 = async (url: string): Promise<string> => {
  if (!url.startsWith('http')) return url;

  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};


export const usePromptSubmit = (
  onClose: () => void,
  promptInput: string,
  files: File[],
  displayImage: string | null
) => {
  const { setPrompt, clearImages } = useEditToolStore();
  const { setIsGenerating, setUserImage } = useToolStore();

  const handleSubmit = useCallback(async () => {
    const sourceImage = displayImage;

    if (!promptInput.trim() && !sourceImage && files.length === 0) {
      toast.error("Please provide a prompt or select an image.");
      return;
    }
    
    onClose();
    setPrompt(promptInput);
    setIsGenerating(true);

    try {
      let imageToSend = sourceImage;
      
      toast.loading('Preparing image...');
      imageToSend = await urlToBase64(imageToSend!);
      toast.dismiss();
      
      const base64Images = imageToSend ? [imageToSend] : [];

      if (base64Images.length === 0) {
        toast.error("No image available to send to API.");
        setIsGenerating(false);
        return;
      }

      const task = editImages(promptInput, base64Images).then((data: any) => {
        const out = data?.data?.outputAssets;
        if (Array.isArray(out) && out.length) {
          const newImageUrl = out[0]?.outputImageUrl;
          if (newImageUrl) {
            clearImages();
            setUserImage(newImageUrl);
          }
          return "Image generated successfully!";
        }
        throw new Error(data?.error || "Invalid response from server");
      });

      toast.promise(task, {
        loading: "Generating images...",
        success: (msg) => msg,
        error: (err) => err.message || "Something went wrong.",
      });

      await task;
    } catch (error) {
      toast.dismiss();
      toast.error(error instanceof Error ? error.message : "An unknown error occurred.");
    }
    finally {
      setIsGenerating(false);
    }
  }, [promptInput, files, displayImage, onClose, setPrompt, setIsGenerating, setUserImage, clearImages]);

  return handleSubmit;
};