'use client';

import {
  ReactSketchCanvas,
  ReactSketchCanvasRef,
} from 'react-sketch-canvas';
import { useToolStore } from '../lib/store';
import { useRef, useState } from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';

interface CanvasWrapperProps {
  canvasRef: React.RefObject<ReactSketchCanvasRef | null>;
}

export default function CanvasWrapper({ canvasRef }: CanvasWrapperProps) {
  const { selectedImage, customItemImage, tool, strokeWidth } = useToolStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  const handleWheelZoom = (e: React.WheelEvent) => {
    e.preventDefault();
    const newScale = scale - e.deltaY * 0.001;
    setScale(Math.min(Math.max(newScale, 0.5), 3));
  };

  const zoomIn = () => setScale((prev) => Math.min(prev + 0.1, 3));
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.1, 0.5));
  const clearCanvas = () => canvasRef.current?.clearCanvas();

  return (
    <div
      ref={containerRef}
      onWheel={handleWheelZoom}
      className="relative w-[280px] h-[420px] rounded-[20px] overflow-hidden border border-[#333] shadow-[0_0_30px_rgba(255,255,255,0.05)] backdrop-blur-md"
    >
      {/* Zoom + Clear Buttons */}
      <div className="absolute top-2 right-2 z-30 flex flex-col gap-2">
        <button
          onClick={zoomIn}
          className="bg-[#222] text-white p-1 rounded hover:bg-[#333] transition"
          title="Zoom In"
        >
          <Plus size={18} />
        </button>
        <button
          onClick={zoomOut}
          className="bg-[#222] text-white p-1 rounded hover:bg-[#333] transition"
          title="Zoom Out"
        >
          <Minus size={18} />
        </button>
        <button
          onClick={clearCanvas}
          className="bg-[#222] text-red-400 p-1 rounded hover:bg-red-600 transition"
          title="Clear Canvas"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* Small Item Image Preview (top-left corner) */}
      {selectedImage && customItemImage && (
        <div className="absolute top-2 left-2 z-30 w-[60px] h-[60px] rounded-md overflow-hidden border border-white/30 shadow-md bg-[#111]">
          <img
            src={customItemImage}
            alt="Item Preview"
            className="w-full h-full object-contain"
          />
        </div>
      )}

      {/* Glowing BG and Base Image */}
      {selectedImage && (
        <>
          <div className="absolute w-full h-full bg-white/10 blur-2xl z-0" />
          <img
            src={selectedImage}
            alt="user-upload"
            className="absolute z-10 object-cover w-full h-full transition-transform duration-300"
            style={{
              transform: `scale(${scale})`,
              transformOrigin: 'center center',
            }}
          />
        </>
      )}

      {/* Drawing Canvas */}
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
    </div>
  );
}
