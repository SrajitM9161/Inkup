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
    <div className="
      fixed bottom-5 left-4 right-4 z-50 
      bg-[#1a1a1a] border border-neutral-800 
      rounded-xl shadow-lg 
      space-y-3 
      md:left-6 md:right-6 md:px-6
      lg:left-6 lg:right-96 lg:px-6
    ">
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
