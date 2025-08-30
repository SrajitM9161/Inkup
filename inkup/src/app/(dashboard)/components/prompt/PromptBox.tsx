"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PromptBoxProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (prompt: string) => void;
}

export default function PromptBox({ open, onClose, onSubmit }: PromptBoxProps) {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = () => {
    if (!prompt.trim()) return;
    onSubmit(prompt);
    setPrompt("");
    onClose();
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
              <h2 className="text-lg font-semibold text-white">Write your idea</h2>
              <button
                onClick={onClose}
                className="p-1 rounded hover:bg-[#222] text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your prompt..."
              className="w-full h-28 rounded-lg bg-[#111] text-white p-3 border border-[#333] focus:outline-none focus:ring-2 focus:ring-[#d0fe17] resize-none"
            />

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-[#222] text-gray-300 hover:bg-[#333]"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 rounded-lg bg-[#d0fe17] hover:bg-[#d0fe17] text-[#1e1e1e] font-medium"
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
