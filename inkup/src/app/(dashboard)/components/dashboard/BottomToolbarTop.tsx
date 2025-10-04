'use client';
import {
  Download,
  Pencil,
  Eraser,
  Undo2,
  Redo2,
  MessageSquarePlus, 
  Brush,
  Scissors,
} from 'lucide-react';
import { useToolStore } from '../../lib/store';
import { ReactSketchCanvasRef } from 'react-sketch-canvas';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import { toast } from 'react-hot-toast';
import { useCallback, useState } from 'react';
import PromptBox from '../prompt/PromptBox'; 

interface BottomToolbarTopProps {
  canvasRef: React.RefObject<ReactSketchCanvasRef | null>;
}

export default function BottomToolbarTop({ canvasRef }: BottomToolbarTopProps) {
  const {
    userImage,
    tool,
    setTool,
    strokeWidth,
    setStrokeWidth,
    setCanvasMode,
    segmentationMode,
    setSegmentationMode,
    clearSegmentationPoints,
  } = useToolStore();

  const [promptOpen, setPromptOpen] = useState(false);

  useKeyboardShortcuts(canvasRef);
  
  const handleEnterBrushMode = () => {
    if (userImage) {
      setCanvasMode(true);
    } else {
      toast("Please upload an image to use as a canvas base first.");
    }
  };

  const handleToggleSegmentation = () => {
    console.log('[Toolbar] Toggle segmentation clicked, current:', segmentationMode);
    if (!userImage) {
      toast('Please upload an image first.');
      return;
    }
    
    if (segmentationMode) {
      clearSegmentationPoints();
    }
    setSegmentationMode(!segmentationMode);
  };

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

      background.crossOrigin = 'anonymous';
      overlay.crossOrigin = 'anonymous';

      background.src = userImage;
      overlay.src = sketch;

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

  const handleToolChange = (selectedTool: 'pen' | 'eraser') => {
    setTool(selectedTool);
    if (canvasRef.current) {
      canvasRef.current.eraseMode(selectedTool === 'eraser');
    }
  };

  return (
    <>
      <div className="w-fit flex items-center justify-center gap-2 px-3.5 py-1.5 bg-[#1C1C1C] border border-[#333] rounded-lg">
        <Pencil
          size={26}
          className={`p-1 rounded-md cursor-pointer transition-colors ${
            tool === 'pen' && !segmentationMode ? 'bg-[#D0FE17] text-black' : 'text-white/70'
          }`}
          onClick={() => !segmentationMode && handleToolChange('pen')}
        />
        <Eraser
          size={26}
          className={`p-1 rounded-md cursor-pointer transition-colors ${
            tool === 'eraser' && !segmentationMode ? 'bg-[#D0FE17] text-black' : 'text-white/70'
          }`}
          onClick={() => !segmentationMode && handleToolChange('eraser')}
        />
        <Undo2 
          size={20} 
          className={`cursor-pointer ${segmentationMode ? 'text-white/30' : 'text-white/70'}`}
          onClick={() => !segmentationMode && undo()} 
        />
        <Redo2 
          size={20} 
          className={`cursor-pointer ${segmentationMode ? 'text-white/30' : 'text-white/70'}`}
          onClick={() => !segmentationMode && redo()} 
        />
        <input
          type="range"
          min={1}
          max={30}
          value={strokeWidth}
          onChange={handleStrokeWidthChange}
          disabled={segmentationMode}
          className="w-24 accent-[#D0FE17] disabled:opacity-30"
        />
        <Download 
          size={20} 
          className={`cursor-pointer ${segmentationMode ? 'text-white/30' : 'text-white/70'}`}
          onClick={() => !segmentationMode && handleDownload()} 
        />
        <MessageSquarePlus 
          size={22} 
          className={`cursor-pointer ${segmentationMode ? 'text-white/30' : 'text-white/70'}`}
          onClick={() => !segmentationMode && setPromptOpen(true)} 
        />
        <div className="w-px h-5 bg-[#333] mx-1"></div>
        <span title="Switch to Brush Mode">
          <Brush
            size={26}
            className={`p-1 rounded-md cursor-pointer transition-colors ${
              segmentationMode ? 'text-white/30' : 'text-white/70 hover:bg-[#D0FE17] hover:text-black'
            }`}
            onClick={() => !segmentationMode && handleEnterBrushMode()}
          />
        </span>
        <span title="Segmentation Mode">
          <Scissors
            size={26}
            className={`p-1 rounded-md cursor-pointer transition-colors ${
              segmentationMode 
                ? 'bg-[#D0FE17] text-black' 
                : 'text-white/70 hover:bg-[#D0FE17] hover:text-black'
            }`}
            onClick={handleToggleSegmentation}
          />
        </span>
      </div>

      <PromptBox open={promptOpen} onClose={() => setPromptOpen(false)} />
    </>
  );
}
