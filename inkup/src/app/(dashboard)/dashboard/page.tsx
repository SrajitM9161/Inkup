'use client';

import { useRef, useState, Suspense } from 'react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { Menu } from 'lucide-react';
import { ReactSketchCanvasRef } from 'react-sketch-canvas';

import { useToolStore } from '../lib/store';
import CanvasWrapper from '../components/canvas/CanvasWrapper';
import BottomBar from '../components/dashboard/BottomBar';
import UploadModal from '../components/dashboard/Modals/UploadModal';
import ItemUploadModal from '../components/dashboard/Modals/Uploadtatoo';
import CatalogSidebar from '../components/Sidebar/CatalogSidebar';
import ProtectedRoute from './ProtectedRoute';
import { generateTryonImage } from '../../API/api';
import TokenHandler from '../../components/TokenHandler';

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
    setResultImage,
    setUserImage,
  } = useToolStore();

 const handleGenerate = async () => {
  if (!canvasRef.current || !userImage || !itemImage) {
    toast.error('Upload both human and tattoo images first!');
    return;
  }

  try {
    const mask = await canvasRef.current.exportImage('png');
    setIsGenerating(true);

    const timeoutId = setTimeout(() => {
      setIsGenerating(false);
      toast.dismiss();
      toast.error('Image generation timed out.');
    }, 120000);

    const generated = await generateTryonImage(userImage, itemImage, mask);
    clearTimeout(timeoutId);

    setUserImage(generated);
    setResultImage('');
    canvasRef.current.clearCanvas();
    setTool('pen');
  } catch (err) {
    console.error(err);
    toast.error('Failed to generate');
  } finally {
    toast.dismiss();
  }
};


  return (
    <ProtectedRoute>
      <Suspense fallback={null}>
        <TokenHandler />
      </Suspense>

      <div className="w-screen h-screen overflow-hidden flex flex-row-reverse bg-dot-pattern text-white">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-[320px] shrink-0 border-l border-white/10 bg-[#0D0D0D]">
          <CatalogSidebar />
        </div>

        {/* Mobile Sidebar */}
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
        {/* Main Content */}
        <div className="flex-1 h-full flex flex-col overflow-hidden relative">
          <UploadModal isOpen={uploadModalOpen} onClose={() => setUploadModalOpen(false)} />
          <ItemUploadModal isOpen={itemUploadModalOpen} onClose={() => setItemUploadModalOpen(false)} />

          {/* Header (Mobile) */}
          <div className="flex lg:hidden justify-between items-center px-4 py-3 border-b border-white/10 bg-[#0D0D0D]">
            <button
              onClick={() => setSidebarOpenMobile(true)}
              className="flex items-center gap-2 text-sm bg-[#1a1a1a] px-3 py-1 rounded"
            >
              <Menu size={25} />
            </button>
          </div>

          {/* Main Canvas Area */}
          <main className="flex-1 overflow-y-auto px-4 py-6 flex flex-col items-center gap-6">
            {!userImage? (
              <div className="text-center mt-10">
                <Image src="/logoinkara.png" alt="Logo" width={100} height={164} className="mx-auto mb-3" />
                <h1 className="text-3xl font-bold">INKARA AI GENERATE</h1>
                <p className="text-sm text-gray-400">
                  Draw, edit, erase — just <span className="text-white font-medium">clip and create</span>
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <CanvasWrapper canvasRef={canvasRef} />
              </div>
            )}

            <BottomBar
              onUploadClick={() => setUploadModalOpen(true)}
              onUploadItemClick={() => setItemUploadModalOpen(true)}
              onGenerate={handleGenerate}
              isGenerating={isGenerating ?? false}
              canvasRef={canvasRef}
              disableGenerate={!userImage || !itemImage}
            />
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}