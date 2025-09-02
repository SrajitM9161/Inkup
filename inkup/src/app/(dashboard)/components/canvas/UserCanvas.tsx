'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ReactSketchCanvas, ReactSketchCanvasRef } from 'react-sketch-canvas';
import { useToolStore, useEditToolStore } from '../../lib/store';
import { Trash2, Maximize2, X } from 'lucide-react';
import Loader from '../ui/CrazyLoader';
import toast from 'react-hot-toast';

interface UserCanvasProps {
  canvasRef: React.RefObject<ReactSketchCanvasRef | null>;
}

export default function UserCanvas({ canvasRef }: UserCanvasProps) {
  const { userImage, tool, strokeWidth, isGenerating, setIsGenerating, clearPersistedImages } =
    useToolStore();
  const { resultImages } = useEditToolStore();

  const [imageLoaded, setImageLoaded] = useState(false);
  const [displayImage, setDisplayImage] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const pendingUrlRef = useRef<string | null>(null);

  const latest = useMemo(
    () => (resultImages.length ? resultImages[resultImages.length - 1] : null),
    [resultImages]
  );

  useEffect(() => {
    const src = latest ?? userImage ?? null;
    setImageLoaded(false);
    setDisplayImage(null);

    if (!src) return;

    const img = new Image();
    img.onload = () => {
      setDisplayImage(src);
      setImageLoaded(true);
      setIsGenerating(false);
      toast.dismiss();
    };
    img.onerror = () => {
      setImageLoaded(true);
      setIsGenerating(false);
      toast.error('Failed to load image.');
    };
    img.src = src;
    pendingUrlRef.current = src;

    return () => {
      pendingUrlRef.current = null;
    };
  }, [userImage, latest, setIsGenerating]);

  const handleClearAll = () => {
    canvasRef.current?.resetCanvas();
    clearPersistedImages();
  };

  return (
    <>
      {/* Normal Canvas */}
      <div className="relative w-[280px] h-[420px] md:w-[360px] md:h-[540px] lg:w-[280px] lg:h-[420px] rounded-[20px] overflow-hidden border border-[#333] shadow-[0_0_30px_rgba(255,255,255,0.05)] backdrop-blur-md">
        <div className="absolute top-2 right-2 z-30 flex flex-col gap-2">
          <button
            onClick={handleClearAll}
            className="bg-[#222] text-white p-1 rounded hover:bg-[#333]"
          >
            <Trash2 size={18} />
          </button>
          <button
            onClick={() => setIsFullscreen(true)}
            className="bg-[#222] text-white p-1 rounded hover:bg-[#333]"
          >
            <Maximize2 size={18} />
          </button>
        </div>

        <div className="absolute inset-0">
          {displayImage && (
            <img
              src={displayImage}
              alt="Base"
              className="absolute w-full h-full object-contain z-0"
              draggable={false}
            />
          )}

          <ReactSketchCanvas
            ref={canvasRef}
            width="100%"
            height="100%"
            strokeWidth={strokeWidth}
            strokeColor={tool === 'pen' ? '#ff3366' : '#ffffff'}
            canvasColor="transparent"
            style={{ position: 'absolute', top: 0, left: 0, zIndex: 20 }}
          />
        </div>

        {(isGenerating || (!imageLoaded && (latest || userImage))) && (
          <div className="absolute inset-0 z-50 bg-black/50 flex flex-col items-center justify-center">
            <Loader />
            <p className="text-sm text-white mt-3 animate-pulse">Generating Your Image…</p>
          </div>
        )}
      </div>

      {/* Fullscreen Overlay */}
      {isFullscreen && (
        <div className="fixed inset-0 z-[1000] bg-black/90 flex items-center justify-center p-4">
          <div className="relative w-full h-full flex items-center justify-center">
            {displayImage && (
              <img
                src={displayImage}
                alt="Base"
                className="absolute w-full h-full object-contain"
                draggable={false}
              />
            )}
            <ReactSketchCanvas
              ref={canvasRef}
              width="100%"
              height="100%"
              strokeWidth={strokeWidth}
              strokeColor={tool === 'pen' ? '#ff3366' : '#ffffff'}
              canvasColor="transparent"
              style={{ position: 'absolute', top: 0, left: 0 }}
            />

            {/* Controls */}
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={handleClearAll}
                className="bg-[#222] text-white p-2 rounded-full hover:bg-[#333]"
              >
                <Trash2 size={20} />
              </button>
              <button
                onClick={() => setIsFullscreen(false)}
                className="bg-[#222] text-white p-2 rounded-full hover:bg-[#333]"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
