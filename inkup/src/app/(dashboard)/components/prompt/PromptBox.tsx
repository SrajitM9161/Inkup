"use client";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useEditToolStore, useToolStore } from "../../lib/store";
import PromptBoxHeader from "./components/PromptBoxHeader";
import PromptBoxPreview from "./components/PromptBoxPreview";
import PromptBoxTextarea from "./components/PromptBoxTextarea";
import PromptBoxUploader from "./components/PromptBoxUploader";
import PromptBoxActions from "./components/PromptBoxActions";
import { usePromptSubmit } from "./Hooks/usePromptSubmit";

interface PromptBoxProps {
  open: boolean;
  onClose: () => void;
  overrideDisplayImage?: string | null;
}

export default function PromptBox({ open, onClose, overrideDisplayImage }: PromptBoxProps) {
  const [promptInput, setPromptInput] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [displayImage, setDisplayImage] = useState<string | null>(null);

  const { userImage, previewImage } = useToolStore();

  useEffect(() => {
    if (open) {
      const imageToShow = overrideDisplayImage || previewImage || userImage;
      setDisplayImage(imageToShow);
    }
  }, [userImage, previewImage, open, overrideDisplayImage]);

  const handleSubmit = usePromptSubmit(onClose, promptInput, files, displayImage);

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
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-[#1a1a1a] rounded-2xl p-6 w-[90%] max-w-md shadow-xl border border-[#333]"
          >
            <PromptBoxHeader onClose={onClose} />
            <PromptBoxPreview displayImage={displayImage} />
            <PromptBoxTextarea value={promptInput} onChange={setPromptInput} />
            <PromptBoxUploader files={files} setFiles={setFiles} />
            <PromptBoxActions onClose={onClose} onSubmit={handleSubmit} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}