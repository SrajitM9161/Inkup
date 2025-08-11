'use client';

import { ImagePlus } from 'lucide-react';

interface BottomToolbarBottomProps {
  onUploadClick: () => void;
  onUploadItemClick: () => void;
  onGenerate: () => void;
  isGenerating: boolean;
  disableGenerate?: boolean; 
}

export default function BottomToolbarBottom({
  onUploadClick,
  onUploadItemClick,
  onGenerate,
  isGenerating,
  disableGenerate = false, 
}: BottomToolbarBottomProps) {
  return (
    <div className="flex flex-col items-center justify-between gap-3 w-full sm:flex-row sm:items-center">
      <div className="flex flex-row items-center gap-2">
        <button
          onClick={onUploadClick}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-[#555] text-[#ccc] text-sm rounded-lg hover:bg-[#D0FE17] hover:text-black hover:font-medium transition"
        >
          <ImagePlus size={14} /> Upload User
        </button>
        <button
          onClick={onUploadItemClick}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-[#555] text-[#ccc] text-sm rounded-lg hover:bg-[#D0FE17] hover:text-black hover:font-medium transition"
        >
          <ImagePlus size={14} /> Upload Tattoo
        </button>
      </div>

      <button
        onClick={onGenerate}
        disabled={isGenerating || disableGenerate}
        className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2 bg-[#D0FE17] text-black text-base rounded-lg font-semibold hover:brightness-105 transition disabled:opacity-50"
      >
        {isGenerating ? 'Generating...' : 'Generate'}
      </button>
    </div>
  );
}
