'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { Menu } from 'lucide-react';
import { ReactSketchCanvasRef } from 'react-sketch-canvas';

import { useToolStore } from '../lib/store';
// import { generateImageWithItem } from '../lib/api';

import CanvasWrapper from '../components/canvas/CanvasWrapper';
import BottomBar from '../components/dashboard/BottomBar';
import UploadModal from '../components/dashboard/Modals/UploadModal';
import ItemUploadModal from '../components/dashboard/Modals/Uploadtatoo';
import CatalogSidebar from '../components/Sidebar/CatalogSidebar';
import ProtectedRoute from './ProtectedRoute';

export default function DashboardPage() {
  const [sidebarOpenMobile, setSidebarOpenMobile] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [itemUploadModalOpen, setItemUploadModalOpen] = useState(false);

  const canvasRef = useRef<ReactSketchCanvasRef | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  const {
    selectedImage,
    setTool,
    setResultImage,
    setIsGenerating,
    isGenerating,
  } = useToolStore();

  // Store token if present in query
  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      localStorage.setItem('token', token);
      router.replace('/dashboard');
    }
  }, [searchParams, router]);

  // Switch to 'pen' tool when image is uploaded
  useEffect(() => {
    if (selectedImage) {
      setTool('pen');
    }
  }, [selectedImage, setTool]);

  // Generate image via backend
  const handleGenerate = async () => {
    if (!canvasRef.current || !selectedImage) {
      toast.error('No image selected!');
      return;
    }

    try {
      const mask = await canvasRef.current.exportImage('png');
      toast.loading('Generating...');
      setIsGenerating(true);

      // const generatedImage = await generateImageWithItem(selectedImage, mask);
      // setResultImage(generatedImage);
      canvasRef.current.clearCanvas();
      toast.success('Generated!');
    } catch (err) {
      console.error(err);
      toast.error('Generation failed.');
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

        {/* Main Drawing Area */}
        <div className="flex-1 h-full flex flex-col overflow-hidden relative">
          {/* Modals */}
          <UploadModal isOpen={uploadModalOpen} onClose={() => setUploadModalOpen(false)} />
          <ItemUploadModal isOpen={itemUploadModalOpen} onClose={() => setItemUploadModalOpen(false)} />

          {/* Mobile Top Bar */}
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

          {/* Canvas + Tools */}
          <main className="flex-1 overflow-y-auto px-4 py-6 flex flex-col items-center gap-6">
            {!selectedImage ? (
              <div className="text-center mt-10">
                <Image
                  src="/logo-icon.svg"
                  alt="Logo"
                  width={64}
                  height={64}
                  className="mx-auto mb-3"
                />
                <h1 className="text-3xl font-bold">INKUP GENERATE</h1>
                <p className="text-sm text-gray-400">
                  Draw, edit, erase — just <span className="text-white font-medium">clip and create</span>
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <CanvasWrapper canvasRef={canvasRef} />
              </div>
            )}

            {/* Bottom Action Bar */}
            <BottomBar
              onUploadClick={() => setUploadModalOpen(true)}
              onUploadItemClick={() => setItemUploadModalOpen(true)}
              onGenerate={handleGenerate}
              isGenerating={isGenerating ?? false}
              canvasRef={canvasRef}
            />
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
