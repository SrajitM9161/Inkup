'use client';

import { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useToolStore } from '../../lib/store';
import BrushCanvas, { BrushCanvasHandle, ExportMethod } from './BrushCanvas';
import BrushControls from './BrushControls';
import { Download, Save, MessageSquarePlus, X } from 'lucide-react';
import PromptBox from '../prompt/PromptBox';
import { uploadGeneration } from '../../../api/api'; 

export default function BrushModeLayout() {
  const { userImage, setCanvasMode, setUserImage } = useToolStore();
  const [promptOpen, setPromptOpen] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const brushCanvasRef = useRef<BrushCanvasHandle>(null);
  const [imageRect, setImageRect] = useState<DOMRect | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const imgElement = imageRef.current;
    if (!imgElement) return;

    const handleResize = () => {
      setImageRect(imgElement.getBoundingClientRect());
    };

    const observer = new ResizeObserver(handleResize);
    observer.observe(imgElement);

    imgElement.addEventListener('load', handleResize);
    
    if (imgElement.complete) {
      handleResize();
    }

    return () => {
      observer.disconnect();
      imgElement.removeEventListener('load', handleResize);
    };
  }, [userImage]);

  const handleExport = (method: ExportMethod = 'pixi') => {
    if (brushCanvasRef.current) {
      brushCanvasRef.current.exportImage(method);
    } else {
      toast.error('Canvas is not yet ready for export.');
    }
  };
  
  const handleSave = async () => {
    if (!brushCanvasRef.current || isSaving) {
      return;
    }

    setIsSaving(true);
    toast.loading('Saving to your generations...');

    try {
      const imageBase64 = await brushCanvasRef.current.exportToBase64();

      if (!imageBase64) {
        throw new Error('Failed to get image data from canvas.');
      }

      const response = await uploadGeneration(imageBase64);
      
      toast.dismiss();
      toast.success('Successfully saved to generations!');

      if (response.data && response.data.imageUrl) {
        setUserImage(response.data.imageUrl);
      }

    } catch (error) {
      console.error('Save failed:', error);
      toast.dismiss();
      toast.error('Could not save the image.', { id: 'save-error-toast' });
    } finally {
      setIsSaving(false);
    }
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
          disabled={isSaving}
          className="flex items-center gap-2 px-3 py-2 bg-[#1A1A1A] border border-[#333] text-white rounded-lg hover:bg-[#D0FE17] hover:text-black transition disabled:opacity-50 disabled:cursor-not-allowed"
          title="Save to My Generations"
        >
          <Save size={20} />
          <span>{isSaving ? 'Saving...' : 'Save'}</span>
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