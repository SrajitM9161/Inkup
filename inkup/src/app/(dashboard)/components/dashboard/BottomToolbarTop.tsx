'use client';

import { Download, Pencil, Eraser, Undo2, Redo2 } from 'lucide-react';
import { useToolStore } from '../../lib/store';
import { ReactSketchCanvasRef } from 'react-sketch-canvas';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import { toast } from 'react-hot-toast';
import { useCallback } from 'react';

interface BottomToolbarTopProps {
  canvasRef: React.RefObject<ReactSketchCanvasRef | null>;
}

export default function BottomToolbarTop({ canvasRef }: BottomToolbarTopProps) {
  const { userImage, tool, setTool, strokeWidth, setStrokeWidth } = useToolStore();

  useKeyboardShortcuts(canvasRef);

  const handleStrokeWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStrokeWidth(Number(e.target.value));
  };

 const handleDownload = useCallback(async () => {
  if (!canvasRef.current || !userImage) {
    toast.error('Nothing to export');
    return;
  }

  try {
    const sketch = await canvasRef.current.exportImage('png');

    const background = new Image();
    const overlay = new Image();

    // 🛡️ Prevent canvas tainting
    background.crossOrigin = 'anonymous';
    overlay.crossOrigin = 'anonymous';

    // Assign sources
    background.src = userImage;
    overlay.src = sketch;

    // Wait until both images are loaded
    await Promise.all([
      new Promise((res, rej) => {
        background.onload = res;
        background.onerror = rej;
      }),
      new Promise((res, rej) => {
        overlay.onload = res;
        overlay.onerror = rej;
      }),
    ]);

    // Create and draw on canvas
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

    // Export image
    const finalImage = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = finalImage;
    a.download = 'InkaraAI.png';
    a.click();

    toast.success('Downloaded!');
  } catch (error) {
    console.error('Download error:', error);
    toast.error('Download failed (CORS issue or image load error)');
  }
}, [canvasRef, userImage]);

  const undo = () => canvasRef.current?.undo?.();
  const redo = () => canvasRef.current?.redo?.();

  return (
    <div className="
      w-fit flex items-center justify-center 
      gap-2 px-3.5 py-1.5 
      bg-[#1C1C1C] 
      border border-[#333] 
      rounded-lg
    ">
      <Pencil
        size={26}
        className={`
          p-1 rounded-md cursor-pointer transition-colors 
          ${tool === 'pen' ? 'bg-[#D0FE17] text-black' : 'text-white/70'}
        `}
        onClick={() => setTool('pen')}
      />

      <Eraser
        size={26}
        className={`
          p-1 rounded-md cursor-pointer transition-colors 
          ${tool === 'eraser' ? 'bg-[#D0FE17] text-black' : 'text-white/70'}
        `}
        onClick={() => setTool('eraser')}
      />

      <Undo2 size={20} className="text-white/70 cursor-pointer" onClick={undo} />
      <Redo2 size={20} className="text-white/70 cursor-pointer" onClick={redo} />

      <input
        type="range"
        min={1}
        max={30}
        value={strokeWidth}
        onChange={handleStrokeWidthChange}
        className="w-24 accent-[#D0FE17]"
      />

      <Download size={20} className="text-white/70 cursor-pointer" onClick={handleDownload} />
    </div>
  );
}
