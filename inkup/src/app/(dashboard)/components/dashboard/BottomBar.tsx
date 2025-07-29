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
   disableGenerate?: boolean;
}

export default function BottomBar({
  canvasRef,
  onUploadClick,
  onUploadItemClick,
  onGenerate,
  isGenerating,
  disableGenerate = false
}: BottomBarProps) {
  return (
    <div className="fixed bottom-5 left-4 right-4 z-50 space-y-2 md:left-6 md:right-6 lg:left-6 lg:right-96">
      <div className="w-fit">
        <BottomToolbarTop canvasRef={canvasRef} />
      </div>

      <div className="w-full bg-[#1A1A1A] border border-[#333] rounded-xl shadow-md px-4 py-2.5">
        <BottomToolbarBottom
          onUploadClick={onUploadClick}
          onUploadItemClick={onUploadItemClick}
          onGenerate={onGenerate}
          isGenerating={isGenerating}
           disableGenerate={disableGenerate}
        />
      </div>
    </div>
  );
}
