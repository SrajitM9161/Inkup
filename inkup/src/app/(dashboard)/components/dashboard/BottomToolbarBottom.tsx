'use client';

import { ImagePlus } from 'lucide-react';

interface BottomToolbarBottomProps {
  onUploadClick: () => void;
  onUploadItemClick: () => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export default function BottomToolbarBottom({
  onUploadClick,
  onUploadItemClick,
  onGenerate,
  isGenerating,
}: BottomToolbarBottomProps) {
  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      {/* 👤 Upload User Image */}
      <button
        onClick={onUploadClick}
        title="Upload"
        className="flex items-center gap-1 px-4 py-2 border border-gray-600 text-white text-sm rounded-md hover:bg-white/10"
      >
        <ImagePlus size={18} /> Upload User
      </button>

      {/* 🧩 Upload Item Image */}
      <button
        onClick={onUploadItemClick}
        title="Upload Item"
        className="flex items-center gap-1 px-4 py-2 border border-gray-600 text-white text-sm rounded-md hover:bg-white/10"
      >
        <ImagePlus size={18} /> Upload Item
      </button>

      {/* ✨ Generate */}
      <button
        onClick={onGenerate}
        disabled={isGenerating}
        className="flex items-center gap-1 px-4 py-2 bg-cyan-400 text-black text-sm rounded-md font-semibold hover:bg-cyan-300 disabled:opacity-50"
      >
        {isGenerating ? 'Generating...' : 'Generate ✦ 5'}
      </button>
    </div>
  );
}
