// ===== DashboardPage.tsx (Production-Ready Fix) =====
'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
import { generateTryonImage } from '../../API/Api';

export default function DashboardPage() {
  const [sidebarOpenMobile, setSidebarOpenMobile] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [itemUploadModalOpen, setItemUploadModalOpen] = useState(false);

  const canvasRef = useRef<ReactSketchCanvasRef | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  const {
    userImage,
    itemImage,
    setTool,
    setIsGenerating,
    isGenerating,
    setResultImage,
    setUserImage,
  } = useToolStore();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      localStorage.setItem('token', token);
      router.replace('/dashboard');
    }
  }, [searchParams, router]);

  const handleGenerate = async () => {
    if (!canvasRef.current || !userImage || !itemImage) {
      toast.error('Upload both human and tattoo images first!');
      return;
    }

    try {
      const mask = await canvasRef.current.exportImage('png');
      toast.loading('Generating...');
      setIsGenerating(true);

      // ✅ Safe usage — TS ensures userImage/itemImage are strings
      const generated = await generateTryonImage(userImage, itemImage, mask);

      setUserImage(generated);
      setResultImage("");
      canvasRef.current.clearCanvas();
      setTool('pen');
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate');
    } finally {
      toast.dismiss();
      setIsGenerating(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="w-screen h-screen overflow-hidden flex flex-row-reverse bg-dot-pattern text-white">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-[320px] shrink-0 border-l border-white/10 bg-[#0D0D0D]">
          <CatalogSidebar />
        </div>

        {/* Mobile Sidebar */}
        {sidebarOpenMobile && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end">
            <div className="w-[320px] bg-[#0D0D0D] h-full">
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
          {/* Modals */}
          <UploadModal isOpen={uploadModalOpen} onClose={() => setUploadModalOpen(false)} />
          <ItemUploadModal isOpen={itemUploadModalOpen} onClose={() => setItemUploadModalOpen(false)} />

          {/* Header (Mobile) */}
          <div className="flex lg:hidden justify-between items-center px-4 py-3 border-b border-white/10 bg-[#0D0D0D]">
            <button
              onClick={() => setSidebarOpenMobile(true)}
              className="flex items-center gap-2 text-sm bg-[#1a1a1a] px-3 py-1 rounded"
            >
              <Menu size={16} />
              Catalog
            </button>
            <Image src="/logo-icon.svg" alt="Logo" width={32} height={32} />
          </div>

          {/* Main Canvas Area */}
          <main className="flex-1 overflow-y-auto px-4 py-6 flex flex-col items-center gap-6">
            {!userImage || !itemImage ? (
              <div className="text-center mt-10">
                <Image src="/logo-icon.svg" alt="Logo" width={64} height={64} className="mx-auto mb-3" />
                <h1 className="text-3xl font-bold">INKUP GENERATE</h1>
                <p className="text-sm text-gray-400">
                  Draw, edit, erase — just <span className="text-white font-medium">clip and create</span>
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <CanvasWrapper canvasRef={canvasRef} />
              </div>
            )}

            {/* Bottom Controls */}
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
