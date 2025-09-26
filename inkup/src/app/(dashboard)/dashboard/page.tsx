'use client';

import { useRef, useState, Suspense } from 'react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { Menu } from 'lucide-react';
import { ReactSketchCanvasRef } from 'react-sketch-canvas';

import { useToolStore, useEditToolStore } from '../lib/store';
import CanvasWrapper from '../components/canvas/CanvasWrapper';
import BottomBar from '../components/dashboard/BottomBar';
import UploadModal from '../components/dashboard/Modals/UploadModal';
import ItemUploadModal from '../components/dashboard/Modals/Uploadtatoo';
import CatalogSidebar from '../components/Sidebar/CatalogSidebar';
import ProtectedRoute from './ProtectedRoute';
import { generateTryonImage } from '../../api/api';
import TokenHandler from '../../components/TokenHandler';
import BrushModeLayout from '../components/canvas/BrushModeLayout';

export default function DashboardPage() {
  const [sidebarOpenMobile, setSidebarOpenMobile] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [itemUploadModalOpen, setItemUploadModalOpen] = useState(false);
  const canvasRef = useRef<ReactSketchCanvasRef | null>(null);

  const {
    userImage,
    itemImage,
    setTool,
    setIsGenerating,
    isGenerating,
    canvasMode,
  } = useToolStore();
  
  const { addResultImage } = useEditToolStore();
  
  const handleGenerate = async () => {
    if (!userImage || !itemImage) {
      toast.error('Upload both human and tattoo images first!');
      return;
    }
    
    if (!canvasMode && canvasRef.current) {
      try {
        const mask = await canvasRef.current.exportImage('png');
        toast.loading('Generating your image...');
        setIsGenerating(true);

        const timeoutId = setTimeout(() => {
          setIsGenerating(false);
          toast.dismiss();
          toast.error('Image generation timed out.');
        }, 120000);

        const generated = await generateTryonImage(userImage, itemImage, mask);
        clearTimeout(timeoutId);
        
        addResultImage(generated);
        
        canvasRef.current.clearCanvas();
        setTool('pen');
      } catch (err) {
        console.error(err);
        toast.error('Failed to generate');
      } finally {
        setIsGenerating(false);
        toast.dismiss();
      }
    } else if (canvasMode) {
      toast.error("Generation from brush mode is not implemented yet.");
    }
  };

  return (
    <ProtectedRoute>
      <Suspense fallback={null}>
        <TokenHandler />
      </Suspense>

      <div className="w-screen h-screen overflow-hidden flex flex-row-reverse bg-dot-pattern text-white">
        <div className="hidden lg:block w-[320px] shrink-0 border-l border-white/10 bg-[#0D0D0D]">
          <CatalogSidebar />
        </div>

        {sidebarOpenMobile && (
          <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex justify-end">
            <div className="w-[320px] bg-[#0D0D0D] h-full relative z-[10000]">
              <CatalogSidebar
                onClose={() => setSidebarOpenMobile(false)}
                isMobileSidebarOpen={sidebarOpenMobile}
              />
            </div>
            <div className="flex-1" onClick={() => setSidebarOpenMobile(false)} />
          </div>
        )}

        <div className="flex-1 h-full flex flex-col relative">
          <UploadModal isOpen={uploadModalOpen} onClose={() => setUploadModalOpen(false)} />
          <ItemUploadModal isOpen={itemUploadModalOpen} onClose={() => setItemUploadModalOpen(false)} />

          <div className="flex lg:hidden justify-between items-center px-4 py-3 border-b border-white/10 bg-[#0D0D0D] shrink-0">
            <button
              onClick={() => setSidebarOpenMobile(true)}
              className="flex items-center gap-2 text-sm bg-[#1a1a1a] px-3 py-1 rounded"
            >
              <Menu size={25} />
            </button>
          </div>
          
          <main className="flex-grow overflow-auto flex flex-col items-center justify-center p-6">
            {!userImage ? (
              <div className="text-center">
                <Image src="/logoinkara.png" alt="Logo" width={100} height={164} className="mx-auto mb-3" />
                <h1 className="text-3xl font-bold">INKARA AI GENERATE</h1>
                <p className="text-sm text-gray-400">
                  Draw, edit, erase — just <span className="text-white font-medium">clip and create</span>
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 shrink-0">
                <CanvasWrapper canvasRef={canvasRef} />
              </div>
            )}
          </main>
          
          {canvasMode && <BrushModeLayout />}
          
          <BottomBar
            onUploadClick={() => setUploadModalOpen(true)}
            onUploadItemClick={() => setItemUploadModalOpen(true)}
            onGenerate={handleGenerate}
            isGenerating={isGenerating ?? false}
            canvasRef={canvasRef}
            disableGenerate={!userImage || !itemImage}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
}