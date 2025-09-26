'use client';

import { ReactSketchCanvasRef } from 'react-sketch-canvas';
import { useToolStore } from '../../lib/store';
import { X } from 'lucide-react';
import BottomToolbarTop from './BottomToolbarTop';
import BottomToolbarBottom from './BottomToolbarBottom';
import BrushControls from '../canvas/BrushControls';

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
  const { canvasMode, setCanvasMode } = useToolStore();

  return (
    <div className={`fixed bottom-5 z-50 flex items-end gap-2 
      ${canvasMode 
        ? 'left-0 right-0 px-5' // Full-width with padding
        : 'left-4 right-4 md:left-6 md:right-6 lg:left-6 lg:right-96'}` // Original constrained layout
    }>
      <div className="flex-grow">
        {canvasMode ? (
          <BrushControls />
        ) : (
          <div className="space-y-2">
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
        )}
      </div>

      {canvasMode && (
         <div className="shrink-0">
            <button
              onClick={() => setCanvasMode(false)}
              className="flex items-center gap-2 px-3 py-2 bg-[#1A1A1A] border border-[#333] text-white rounded-lg hover:bg-[#D0FE17] hover:text-black transition"
              title={"Exit Brush Mode"}
            >
              <X size={20} />
            </button>
        </div>
      )}
    </div>
  );
}