'use client';

import { useState } from "react";
import { X, Upload } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEditToolStore, useToolStore } from "../../lib/store";
import { editImages } from "../../../api/api"; 
import toast from "react-hot-toast";

interface PromptBoxProps {
  open: boolean;
  onClose: () => void;
}

export default function PromptBox({ open, onClose }: PromptBoxProps) {
  const [promptInput, setPromptInput] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  const { setPrompt, addResultImage, clearImages } = useEditToolStore();
  const { setUserImage, setUploadModalOpen, setIsGenerating } = useToolStore();

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const uploadedFiles = Array.from(e.target.files);
      setFiles(uploadedFiles);
      fileToBase64(uploadedFiles[0]).then((base64) => {
        clearImages();
        setUserImage(base64);
        setUploadModalOpen(true);
      });
    }
  };
const handleSubmit = async () => {
  if (!promptInput.trim() || files.length === 0) {
    toast.error("Please provide a prompt and upload at least one image.");
    return;
  }

  setPrompt(promptInput);
  setIsGenerating(true);
  clearImages();

  const base64Images = await Promise.all(files.map(fileToBase64));

  const fetchImages = editImages(promptInput, base64Images).then((data) => {
    if (data?.data?.outputAssets?.length) {
      data.data.outputAssets.forEach((asset: any) =>
        addResultImage(asset.outputImageUrl)
      );
      return "Images generated successfully!";
    } else {
      throw new Error(data.error || "Invalid response from server");
    }
  });

  toast.promise(fetchImages, {
    loading: "Generating images...",
    success: (msg) => msg,
    error: (err) => err.message || "Something went wrong while generating.",
  });

  try {
    await fetchImages;
  } catch (err) {
    console.error(err);
    setIsGenerating(false);
  } finally {
    setPromptInput("");
    setFiles([]);
    onClose();
  }
};


  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-[#1a1a1a] rounded-2xl p-6 w-[90%] max-w-md shadow-xl border border-[#333]"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-white">Edit with Prompt</h2>
              <button
                onClick={onClose}
                className="p-1 rounded hover:bg-[#222] text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <textarea
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              placeholder="Enter your prompt..."
              className="w-full h-28 rounded-lg bg-[#111] text-white p-3 border border-[#333] focus:outline-none focus:ring-2 focus:ring-[#d0fe17] resize-none"
            />

            <label className="flex items-center justify-center gap-2 mt-3 cursor-pointer px-4 py-2 bg-[#222] hover:bg-[#333] rounded-lg text-gray-300">
              <Upload size={18} />
              {files.length > 0 ? `${files.length} file(s) selected` : "Upload images"}
              <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} multiple />
            </label>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-[#222] text-gray-300 hover:bg-[#333]"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 rounded-lg bg-[#d0fe17] hover:bg-[#d0fe17]/90 text-[#1e1e1e] font-medium"
              >
                Submit
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
