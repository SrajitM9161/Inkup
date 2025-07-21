'use client';

import { useEffect } from 'react';
import { ReactSketchCanvas, ReactSketchCanvasRef } from 'react-sketch-canvas';
import { useToolStore } from '../../lib/store';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { useCanvasZoom } from './useCanvasZoom';
import { useCanvasExport } from './useCanvasExport';
import MaskOverlay from './MaskOverlay';

interface UserCanvasProps {
  canvasRef: React.RefObject<ReactSketchCanvasRef | null>;
}

export default function UserCanvas({ canvasRef }: UserCanvasProps) {
  const {
    selectedImage,
    tool,
    strokeWidth,
    mask,
    maskOpacity,
  } = useToolStore();

  const { scale, zoomIn, zoomOut, handleWheelZoom } = useCanvasZoom();
  const { clearCanvas } = useCanvasExport(canvasRef);

  useEffect(() => {
    if (!canvasRef.current) return;
    canvasRef.current.eraseMode(tool === 'eraser');
  }, [tool]);

  return (
    <div
      onWheel={handleWheelZoom}
      className="
        relative
        w-[280px] h-[420px]           // mobile default
        md:w-[360px] md:h-[540px]     // iPad/tablet
        lg:w-[280px] lg:h-[420px]     // desktop overrides back to mobile size
        rounded-[20px] overflow-hidden 
        border border-[#333] 
        shadow-[0_0_30px_rgba(255,255,255,0.05)] 
        backdrop-blur-md
      "
    >
      <div className="absolute top-2 right-2 z-30 flex flex-col gap-2">
        <button
          onClick={zoomIn}
          className="bg-[#222] text-white p-1 rounded hover:bg-[#333]"
          title="Zoom In"
        >
          <Plus size={18} />
        </button>
        <button
          onClick={zoomOut}
          className="bg-[#222] text-white p-1 rounded hover:bg-[#333]"
          title="Zoom Out"
        >
          <Minus size={18} />
        </button>
        <button
          onClick={clearCanvas}
          className="bg-[#222] text-white p-1 rounded hover:bg-[#333]"
          title="Clear Canvas"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {selectedImage && (
        <div className="absolute w-full h-full bg-white/10 blur-2xl z-0" />
      )}

      {selectedImage && (
        <img
          src={selectedImage}
          alt="User Uploaded"
          className="absolute z-10 object-contain w-full h-full transition-transform duration-300"
          style={{ transform: `scale(${scale})`, transformOrigin: 'center center' }}
        />
      )}

      {selectedImage && (
        <ReactSketchCanvas
          ref={canvasRef}
          width="100%"
          height="100%"
          strokeWidth={strokeWidth}
          strokeColor={tool === 'pen' ? '#ff3366' : '#ffffff'}
          canvasColor="transparent"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 20,
            pointerEvents: 'auto',
          }}
        />
      )}

      {mask && <MaskOverlay mask={mask} opacity={maskOpacity} />}
    </div>
  );
}
