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
    <div className="
      flex flex-col items-center 
      justify-between gap-4 w-full
      sm:flex-row sm:items-center
    ">
      {/* Grouped Upload Buttons */}
      <div className="flex flex-row items-center gap-3">
        <button
          onClick={onUploadClick}
          title="Upload"
          className="flex items-center gap-1 px-4 py-2 border border-gray-600 text-white text-sm rounded-md hover:bg-white/10"
        >
          <ImagePlus size={18} /> Upload User
        </button>
        <button
          onClick={onUploadItemClick}
          title="Upload Item"
          className="flex items-center gap-1 px-4 py-2 border border-gray-600 text-white text-sm rounded-md hover:bg-white/10"
        >
          <ImagePlus size={18} /> Upload Item
        </button>
      </div>

      {/* Generate Button */}
      <button
        onClick={onGenerate}
        disabled={isGenerating}
        className="w-full sm:w-auto cursor-pointer flex items-center justify-center gap-2 px-6 py-3 bg-cyan-400 text-black text-base rounded-md font-semibold hover:bg-cyan-300 disabled:opacity-50"
      >
        {isGenerating ? 'Generating...' : 'Generate'}
      </button>
    </div>
  );
}
