'use client';
import {
  Download,
  Pencil,
  Eraser,
  Undo2,
  Redo2,
  MessageSquarePlus, 
  Brush,
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
  } = useToolStore();

  const [promptOpen, setPromptOpen] = useState(false);
  const [showCanvasSizeModal, setShowCanvasSizeModal] = useState(false);

  useKeyboardShortcuts(canvasRef);
  
  const handleEnterBrushMode = () => {
    if (userImage) {
      // If an image exists, enter brush mode directly.
      setCanvasMode(true);
    } else {
      // If no image, open a modal to ask for canvas size.
      // You would build this modal component. For now, it logs and shows a toast.
      console.log("TODO: Open Canvas Size Modal");
      toast("Please upload an image to use as a canvas base first.");
      // setShowCanvasSizeModal(true); 
    }
  };

  const handleStrokeWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStrokeWidth(Number(e.target.value));
  };

  const handleDownload = useCallback(async () => {
    // ... (This function is unchanged)
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
          className={`p-1 rounded-md cursor-pointer transition-colors ${tool === 'pen' ? 'bg-[#D0FE17] text-black' : 'text-white/70'}`}
          onClick={() => handleToolChange('pen')}
        />
        <Eraser
          size={26}
          className={`p-1 rounded-md cursor-pointer transition-colors ${tool === 'eraser' ? 'bg-[#D0FE17] text-black' : 'text-white/70'}`}
          onClick={() => handleToolChange('eraser')}
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
        <MessageSquarePlus size={22} className="text-white/70 cursor-pointer" onClick={() => setPromptOpen(true)} />
        <div className="w-px h-5 bg-[#333] mx-1"></div>
        <span title="Switch to Brush Mode">
          <Brush
            size={26}
            className="p-1 rounded-md cursor-pointer transition-colors text-white/70 hover:bg-[#D0FE17] hover:text-black"
            onClick={handleEnterBrushMode}
          />
        </span>
      </div>

      {/* You would create this modal to handle canvas size selection */}
      {/* <CanvasSizeModal isOpen={showCanvasSizeModal} ... /> */}

      <PromptBox open={promptOpen} onClose={() => setPromptOpen(false)} />
    </>
  );
}