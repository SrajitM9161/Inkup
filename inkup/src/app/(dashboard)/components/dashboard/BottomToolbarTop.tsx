'use client';

import {
  Download,
  Pencil,
  Eraser,
  Undo2,
  Redo2,
} from 'lucide-react';
import { useToolStore } from '../../lib/store';
import { ReactSketchCanvasRef } from 'react-sketch-canvas';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import { toast } from 'react-hot-toast';
import { useCallback } from 'react';

interface BottomToolbarTopProps {
  canvasRef: React.RefObject<ReactSketchCanvasRef | null>;
}

export default function BottomToolbarTop({ canvasRef }: BottomToolbarTopProps) {
  const {
    selectedImage,
    tool,
    setTool,
    strokeWidth,
    setStrokeWidth,
  } = useToolStore();

  // ✅ Register keyboard shortcuts
  useKeyboardShortcuts(canvasRef);

  const handleStrokeWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStrokeWidth(Number(e.target.value));
  };

  const handleDownload = useCallback(async () => {
    if (!canvasRef.current || !selectedImage) {
      toast.error('Nothing to export');
      return;
    }

    try {
      // Get drawing as image
      const sketch = await canvasRef.current.exportImage('png');

      const background = new Image();
      const overlay = new Image();

      background.src = selectedImage;
      overlay.src = sketch;

      await Promise.all([
        new Promise((res) => (background.onload = res)),
        new Promise((res) => (overlay.onload = res)),
      ]);

      const canvas = document.createElement('canvas');
      canvas.width = background.width;
      canvas.height = background.height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        toast.error('Canvas context error');
        return;
      }

      ctx.drawImage(background, 0, 0);
      ctx.drawImage(overlay, 0, 0);

      const finalImage = canvas.toDataURL('image/png');

      const a = document.createElement('a');
      a.href = finalImage;
      a.download = 'drawing.png';
      a.click();

      toast.success('Downloaded!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Download failed');
    }
  }, [canvasRef, selectedImage]);

  const undo = () => {
    if (canvasRef.current) {
      canvasRef.current.undo();
    }
  };

  const redo = () => {
    if (canvasRef.current) {
      canvasRef.current.redo();
    }
  };

  return (
    <div
      className="
        fixed
        bottom-15
        left-40
        -translate-x-1/2
        z-50
        bg-black/40
        backdrop-blur-md
        rounded-2xl
        p-3
        flex
        flex-wrap
        items-center
        gap-3
        px-4
        shadow-lg
        border
        border-white/10
        max-w-[95vw]
        sm:max-w-md
      "
    >
      <Pencil
        size={22}
        className={`cursor-pointer transition-colors ${
          tool === 'pen' ? 'text-green-400' : 'text-white'
        }`}
        onClick={() => setTool('pen')}
      />
      <Eraser
        size={22}
        className={`cursor-pointer transition-colors ${
          tool === 'eraser' ? 'text-green-400' : 'text-white'
        }`}
        onClick={() => setTool('eraser')}
      />
      <Undo2 size={22} className="text-white cursor-pointer" onClick={undo} />
      <Redo2 size={22} className="text-white cursor-pointer" onClick={redo} />

      <input
        type="range"
        min={1}
        max={30}
        value={strokeWidth}
        onChange={handleStrokeWidthChange}
        className="w-24"
      />

      <Download
        size={22}
        className="text-white cursor-pointer"
        onClick={handleDownload}
      />
    </div>
  );
}
