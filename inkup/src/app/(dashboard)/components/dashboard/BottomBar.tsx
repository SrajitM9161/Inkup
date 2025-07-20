'use client';

import { ReactSketchCanvasRef } from 'react-sketch-canvas';
import BottomToolbarTop from './BottomToolbarTop';
import BottomToolbarBottom from './BottomToolbarBottom';

interface BottomBarProps {
  canvasRef: React.RefObject<ReactSketchCanvasRef | null>; 
  onUploadClick: () => void;
  onUploadItemClick: () => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export default function BottomBar({
  canvasRef,
  onUploadClick,
  onUploadItemClick,
  onGenerate,
  isGenerating,
}: BottomBarProps) {
  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-[700px] bg-[#1a1a1a] border border-neutral-800 px-4 py-3 rounded-xl shadow-lg space-y-3">
      <BottomToolbarTop canvasRef={canvasRef} />

      <BottomToolbarBottom
        onUploadClick={onUploadClick}
        onUploadItemClick={onUploadItemClick}
        onGenerate={onGenerate}
        isGenerating={isGenerating}
      />
    </div>
  );
}
