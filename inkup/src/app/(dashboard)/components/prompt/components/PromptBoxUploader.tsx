"use client";

import { Upload } from "lucide-react";
import toast from "react-hot-toast";
import { fileToBase64 } from "../Hooks/useFileUtils";
import { useEditToolStore, useToolStore } from "../../../lib/store";

interface Props {
  files: File[];
  setFiles: (files: File[]) => void;
}

export default function PromptBoxUploader({ files, setFiles }: Props) {
  const { clearImages } = useEditToolStore();
  const { setUserImage, setUploadModalOpen } = useToolStore();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const uploaded = Array.from(e.target.files);
    setFiles(uploaded);

    try {
      const base64 = await fileToBase64(uploaded[0]);
      clearImages();
      setUserImage(base64);
      setUploadModalOpen(true);
    } catch {
      toast.error("Failed to read file");
    }
  };

  return (
    <label className="flex items-center justify-center gap-2 mt-3 cursor-pointer px-4 py-2 bg-[#222] hover:bg-[#333] rounded-lg text-gray-300">
      <Upload size={18} />
      {files.length > 0 ? `${files.length} file(s) selected` : "Upload images"}
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileUpload}
        multiple
      />
    </label>
  );
}
