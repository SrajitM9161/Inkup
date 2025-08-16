'use client';

import { useEffect, useState, useRef } from 'react';
import { ReactSketchCanvas, ReactSketchCanvasRef } from 'react-sketch-canvas';
import { useToolStore } from '../../lib/store';
import { Trash2 /*, Plus, Minus */ } from 'lucide-react';
// import { useCanvasZoom } from './useCanvasZoom';
import { useCanvasExport } from './useCanvasExport';
import MaskOverlay from './MaskOverlay';
import Loader from '../ui/CrazyLoader';
import toast from 'react-hot-toast';

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
    setIsGenerating,
  } = useToolStore();

  // const { scale, zoomIn, zoomOut, handleWheelZoom } = useCanvasZoom();
  const { clearCanvas } = useCanvasExport(canvasRef);

  const [imageLoaded, setImageLoaded] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleClearAll = () => {
    clearCanvas();
    clearPersistedImages();
  };

  const baseImage = resultImage || userImage;

  useEffect(() => {
    if (baseImage) {
      setImageLoaded(false);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        toast.dismiss();
        toast.error('Image load timeout. Please try again.');
        setIsGenerating(false);
        setImageLoaded(true);
      }, 1200000);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [baseImage]);

  const handleImageLoad = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setImageLoaded(true);
    setIsGenerating(false);
    toast.dismiss();
  };

  const handleImageError = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsGenerating(false);
    toast.dismiss();
    toast.error('Image failed to load.');
  };

  return (
    <div
      // onWheel={handleWheelZoom}  // zoom disabled
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
        {/*
        <button onClick={zoomIn} className="bg-[#222] text-white p-1 rounded hover:bg-[#333]">
          <Plus size={18} />
        </button>
        <button onClick={zoomOut} className="bg-[#222] text-white p-1 rounded hover:bg-[#333]">
          <Minus size={18} />
        </button>
        */}
        <button onClick={handleClearAll} className="bg-[#222] text-white p-1 rounded hover:bg-[#333]">
          <Trash2 size={18} />
        </button>
      </div>

      {/* Main container (no zoom) */}
      <div className="absolute inset-0">
        {baseImage && <div className="absolute w-full h-full bg-white/10 blur-2xl z-0" />}
        {baseImage && (
          <img
            src={baseImage}
            alt="Displayed Image"
            className="absolute w-full h-full object-contain z-10 fade-in"
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        )}

        {userImage && !resultImage && (
          <ReactSketchCanvas
            ref={canvasRef}
            width="100%"
            height="100%"
            strokeWidth={strokeWidth}
            strokeColor={tool === 'pen' ? '#ff3366' : '#ffffff'}
            canvasColor="transparent"
            style={{ position: 'absolute', top: 0, left: 0, zIndex: 20 }}
          />
        )}

        {mask && <MaskOverlay mask={mask} opacity={maskOpacity} />}
      </div>

      {(isGenerating || (baseImage && !imageLoaded)) && (
        <div className="absolute inset-0 z-50 bg-black/50 flex flex-col items-center justify-center">
          <Loader />
          <p className="text-sm text-white mt-3 animate-pulse">Generating Your Image…</p>
        </div>
      )}
    </div>
  );
}
