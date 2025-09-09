"use client";

import { X } from "lucide-react";

interface Props {
  onClose: () => void;
}

export default function PromptBoxHeader({ onClose }: Props) {
  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-lg font-semibold text-white">Edit with Prompt</h2>
      <button
        onClick={onClose}
        className="p-1 rounded hover:bg-[#222] text-gray-400 hover:text-white"
      >
        <X size={20} />
      </button>
    </div>
  );
}
