'use client';

import { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useToolStore } from '../../lib/store';
import BrushCanvas, { BrushCanvasHandle, ExportMethod } from './BrushCanvas';
import BrushControls from './BrushControls';
import { Download, Save, MessageSquarePlus, X } from 'lucide-react';
import PromptBox from '../prompt/PromptBox';

export default function BrushModeLayout() {
  const { userImage, setCanvasMode } = useToolStore();
  const [promptOpen, setPromptOpen] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const brushCanvasRef = useRef<BrushCanvasHandle>(null);
  const [imageRect, setImageRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const handleResize = () => {
      if (imageRef.current) {
        setImageRect(imageRef.current.getBoundingClientRect());
      }
    };
    handleResize();
    const observer = new ResizeObserver(handleResize);
    if (imageRef.current) observer.observe(imageRef.current);
    window.addEventListener('resize', handleResize);
    return () => {
      if (imageRef.current) observer.unobserve(imageRef.current);
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, [userImage]);

  const handleExport = (method: ExportMethod = 'pixi') => {
    if (brushCanvasRef.current) {
      brushCanvasRef.current.exportImage(method);
    } else {
      toast.error('Canvas is not yet ready for export.');
    }
  };
  
  const handleSave = () => {
    console.log('Saving to generations...');
    toast.success('Save function is not yet connected.');
  };

  return (
    <div className="fixed inset-0 z-40 bg-[#181818] flex flex-col">
      <div className="absolute top-5 left-5 z-20 flex items-center gap-2 flex-wrap">
        <button
          onClick={() => handleExport('pixi')}
          className="flex items-center gap-2 px-3 py-2 bg-[#1A1A1A] border border-[#333] text-white rounded-lg hover:bg-[#D0FE17] hover:text-black transition"
          title="Export Image (Recommended)"
        >
          <Download size={20} />
          <span>Export</span>
        </button>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-3 py-2 bg-[#1A1A1A] border border-[#333] text-white rounded-lg hover:bg-[#D0FE17] hover:text-black transition"
          title="Save to My Generations"
        >
          <Save size={20} />
        </button>
        <button
          onClick={() => setPromptOpen(true)}
          className="flex items-center gap-2 px-3 py-2 bg-[#1A1A1A] border border-[#333] text-white rounded-lg hover:bg-[#D0FE17] hover:text-black transition"
          title="Edit with Prompt"
        >
          <MessageSquarePlus size={20} />
        </button>
      </div>

      <div className="absolute top-5 right-5 z-20">
        <button
          onClick={() => setCanvasMode(false)}
          className="flex items-center justify-center p-2 bg-[#1A1A1A] border border-[#333] text-white rounded-full hover:bg-red-500/80 hover:border-red-400 transition"
          title="Close Canvas Mode"
        >
          <X size={20} />
        </button>
      </div>

      <div className="relative flex-1 min-h-0">
        {userImage && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
            <img
              ref={imageRef}
              src={userImage}
              alt="Drawing Reference"
              className="max-w-full max-h-full object-contain"
              onLoad={() => {
                if (imageRef.current) {
                  setImageRect(imageRef.current.getBoundingClientRect());
                }
              }}
            />
          </div>
        )}
        {imageRect && userImage && (
          <BrushCanvas
            ref={brushCanvasRef}
            imageRect={imageRect}
            baseImageSrc={userImage}
          />
        )}
      </div>

      <div className="w-full px-5 pb-5 shrink-0 z-10">
        <div className="flex items-end gap-2">
          <div className="flex-grow">
            <BrushControls />
          </div>
        </div>
      </div>

      <PromptBox open={promptOpen} onClose={() => setPromptOpen(false)} />
    </div>
  );
}