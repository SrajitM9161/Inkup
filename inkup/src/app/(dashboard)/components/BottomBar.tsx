'use client';

import { useToolStore } from '../lib/store';
import { Download, Bookmark, Upload } from 'lucide-react';
import { downloadImage } from '../lib/api';
import { ModelType } from '../lib/store';

interface BottomBarProps {
  onUploadClick: () => void;
  onGenerate: () => void;
  isGenerating: boolean | undefined;
}

export default function BottomBar({ onUploadClick, onGenerate }: BottomBarProps) {
  const {
    resultImage,
    addBookmark,
    selectedImage,
    isGenerating,
    aspectRatio,
    setAspectRatio,
    model,
    setModel,
  } = useToolStore();

  const aspectOptions = ['2:3', '1:1', '3:2'];
  const styleOptions: ModelType[] = ['Basic', 'Realistic', 'Anime'];

  return (
    <div className="w-full max-w-[864px] mx-auto px-4 md:px-0 mt-6 mb-6 space-y-4">

      {/* Compact Box with Controls + Generate */}
      <div className="relative flex justify-between items-center h-[70px] bg-[#0D0D0D] border border-[#333] rounded-2xl shadow-inner px-4">
        {/* Left Corner Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onUploadClick}
            className="h-[30px] px-3 flex items-center gap-1 text-sm bg-[#1A1A1A] text-white border border-[#555] rounded-lg hover:bg-[#2A2A2A] transition"
          >
            <Upload size={14} /> Upload
          </button>

          <select
            value={aspectRatio}
            onChange={(e) => setAspectRatio(e.target.value)}
            className="h-[30px] px-2 text-sm bg-[#1A1A1A] text-white border border-[#555] rounded-lg"
          >
            {aspectOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>

          <select
            value={model}
            onChange={(e) => setModel(e.target.value as ModelType)}
            className="h-[30px] px-2 text-sm bg-[#1A1A1A] text-white border border-[#555] rounded-lg"
          >
            {styleOptions.map((style) => (
              <option key={style} value={style}>{style}</option>
            ))}
          </select>
        </div>

        {/* Right Corner Generate Button */}
        <button
          onClick={onGenerate}
          disabled={!selectedImage || isGenerating}
          className="relative w-[120px] h-[48px] bg-[#63F5FF] text-black font-semibold text-sm rounded-[10px] shadow-[0_4px_10px_rgba(99,245,255,0.4)] transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? 'Generating...' : 'Generate +5'}

          {/* Optional visual box decoration */}
          <div className="absolute w-[10px] h-[10px] bg-[#0D0D0D] rotate-45 left-[92px] top-[18px]" />
          <div className="absolute w-[4px] h-[4px] bg-[#0D0D0D] rotate-45 left-[92px] top-[27px]" />
        </button>
      </div>

      {/* Bookmark + Download */}
      {resultImage && (
        <div className="flex justify-end gap-2 mt-2 pr-1">
          <button
            onClick={() => downloadImage(resultImage)}
            title="Download"
            className="w-[38px] h-[38px] flex items-center justify-center rounded-full border border-[#555] bg-[#0D0D0D] text-white hover:bg-[#1A1A1A] transition"
          >
            <Download size={16} />
          </button>
          <button
            onClick={() => addBookmark(resultImage)}
            title="Bookmark"
            className="w-[38px] h-[38px] flex items-center justify-center rounded-full border border-[#555] bg-[#0D0D0D] text-white hover:bg-[#1A1A1A] transition"
          >
            <Bookmark size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
