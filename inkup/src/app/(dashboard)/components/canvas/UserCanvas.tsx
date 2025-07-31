'use client';

import { useEffect, useState } from 'react';
import { ReactSketchCanvas, ReactSketchCanvasRef } from 'react-sketch-canvas';
import { useToolStore } from '../../lib/store';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { useCanvasZoom } from './useCanvasZoom';
import { useCanvasExport } from './useCanvasExport';
import MaskOverlay from './MaskOverlay';
import Loader from '../ui/CrazyLoader';

interface UserCanvasProps {
  canvasRef: React.RefObject<ReactSketchCanvasRef | null>;
}

export default function UserCanvas({ canvasRef }: UserCanvasProps) {
  const {
    userImage,
    tool,
    strokeWidth,
    mask,
    maskOpacity,
    clearPersistedImages,
    resultImage,
    isGenerating,
  } = useToolStore();

  const { scale, zoomIn, zoomOut, handleWheelZoom } = useCanvasZoom();
  const { clearCanvas } = useCanvasExport(canvasRef);

  const [loadedImage, setLoadedImage] = useState<string | null>(null);

  useEffect(() => {
    if (resultImage) {
      const img = new Image();
      img.src = resultImage;
      img.onload = () => setLoadedImage(resultImage);
    } else {
      setLoadedImage(null);
    }
  }, [resultImage]);

  useEffect(() => {
    if (!canvasRef.current) return;
    canvasRef.current.eraseMode(tool === 'eraser');
  }, [tool]);

  const handleClearAll = () => {
    clearCanvas();
    clearPersistedImages();
  };

  const baseImage = loadedImage || userImage;

  return (
    <div
      onWheel={handleWheelZoom}
      className="
        relative w-[280px] h-[420px]
        md:w-[360px] md:h-[540px]
        lg:w-[280px] lg:h-[420px]
        rounded-[20px] overflow-hidden 
        border border-[#333] 
        shadow-[0_0_30px_rgba(255,255,255,0.05)] 
        backdrop-blur-md
      "
    >
      {/* Controls */}
      <div className="absolute top-2 right-2 z-30 flex flex-col gap-2">
        <button onClick={zoomIn} className="bg-[#222] text-white p-1 rounded hover:bg-[#333]">
          <Plus size={18} />
        </button>
        <button onClick={zoomOut} className="bg-[#222] text-white p-1 rounded hover:bg-[#333]">
          <Minus size={18} />
        </button>
        <button onClick={handleClearAll} className="bg-[#222] text-white p-1 rounded hover:bg-[#333]">
          <Trash2 size={18} />
        </button>
      </div>

      {/* Blur background */}
      {baseImage && <div className="absolute w-full h-full bg-white/10 blur-2xl z-0" />}

      {/* Image (original or result) */}
      {baseImage && (
        <img
          src={baseImage}
          alt="Displayed Image"
          className="absolute z-10 object-contain w-full h-full transition-transform duration-300 fade-in"
          style={{ transform: `scale(${scale})`, transformOrigin: 'center center' }}
        />
      )}

      {/* Drawing Canvas */}
      {userImage && !resultImage && (
        <ReactSketchCanvas
          ref={canvasRef}
          width="100%"
          height="100%"
          strokeWidth={strokeWidth}
          strokeColor={tool === 'pen' ? '#ff3366' : '#ffffff'}
          canvasColor="transparent"
          style={{ position: 'absolute', top: 0, left: 0, zIndex: 20, pointerEvents: 'auto' }}
        />
      )}

      {/* Mask overlay */}
      {mask && <MaskOverlay mask={mask} opacity={maskOpacity} />}

      {/* Loader while generating or image not yet ready */}
      {(isGenerating || (resultImage && !loadedImage)) && (
        <div className="absolute inset-0 z-50 bg-black/50 flex items-center justify-center">
          <Loader />
        </div>
      )}
    </div>
  );
}
