'use client';

import { useRef, useState, useEffect } from 'react';
import { ReactSketchCanvasRef } from 'react-sketch-canvas';
import UploadModal from '../components/UploadModal';
import BookmarkList from '../components/BookmarkList';
import Toolbar from '../components/Toolbar';
import CanvasWrapper from '../components/CanvasWrapper';
import CatalogSidebar from '../components/Sidebar';
import BottomBar from '../components/BottomBar';
import { useToolStore } from '../lib/store';
import Image from 'next/image';
import { Menu } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import ProtectedRoute from '../components/ProtectedRoute';

export default function DashboardPage() {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [sidebarOpenMobile, setSidebarOpenMobile] = useState(false);
  const canvasRef = useRef<ReactSketchCanvasRef>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  const {
    selectedImage,
    resultImage,
    setResultImage,
    setIsGenerating,
    setTool,
    isGenerating,
  } = useToolStore();

  useEffect(() => {
    const tokenFromURL = searchParams.get('token');
    if (tokenFromURL) {
      localStorage.setItem('token', tokenFromURL);
      router.replace('/dashboard');
    }
  }, [searchParams, router]);

  useEffect(() => {
    if (selectedImage) {
      setTool('pen');
    }
  }, [selectedImage, setTool]);

  const handleExport = async () => {
    if (!canvasRef.current || !selectedImage) {
      toast.error('No image selected');
      return;
    }

    const base64 = await canvasRef.current.exportImage('png');
    setIsGenerating(true);
    toast.loading('Generating...');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: selectedImage, mask: base64 }),
      });

      const data = await response.json();
      setResultImage(data.generatedImage);
      canvasRef.current.clearCanvas();
      toast.success('Generated!');
    } catch (err) {
      toast.error('Generation failed');
    } finally {
      toast.dismiss();
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!resultImage) return;
    const a = document.createElement('a');
    a.href = resultImage;
    a.download = 'generated.png';
    a.click();
  };

  return (
    <ProtectedRoute>
      <div className="w-screen h-screen overflow-hidden flex flex-row-reverse bg-dot-pattern text-white">
        {/* Sidebar - Desktop */}
        <div className="hidden md:block w-[250px] shrink-0 border-l border-white/10 bg-[#0D0D0D]">
          <CatalogSidebar />
        </div>

        {/* Sidebar - Mobile */}
        {sidebarOpenMobile && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end">
            <div className="w-[250px] bg-[#0D0D0D] h-full">
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
          {showUploadModal && <UploadModal onClose={() => setShowUploadModal(false)} />}

          {/* Mobile Top Bar */}
          <div className="flex md:hidden justify-between items-center px-4 py-3 border-b border-white/10 bg-[#0D0D0D]">
            <button
              onClick={() => setSidebarOpenMobile(true)}
              className="flex items-center gap-2 text-sm bg-[#1a1a1a] px-3 py-1 rounded"
            >
              <Menu size={16} />
              Catalog
            </button>
            <Image src="/logo-icon.svg" alt="Logo" width={32} height={32} />
          </div>

          <main className="flex-1 overflow-y-auto px-4 py-6 flex flex-col items-center gap-6">
            {!selectedImage && (
              <div className="text-center mt-10">
                <Image
                  src="/logo-icon.svg"
                  alt="Logo"
                  width={64}
                  height={64}
                  className="mx-auto mb-2"
                />
                <h1 className="text-3xl font-bold">INKUP GENERATE</h1>
                <p className="text-sm text-gray-400">
                  Draw, edit, erase — just{' '}
                  <span className="text-white font-medium">clip and create</span>
                </p>
              </div>
            )}

            {selectedImage && (
              <div className="flex flex-col items-center gap-3">
                <CanvasWrapper canvasRef={canvasRef} />
                <Toolbar canvasRef={canvasRef} />
              </div>
            )}

            <BottomBar
              onUploadClick={() => setShowUploadModal(true)}
              onGenerate={handleExport}
              isGenerating={isGenerating!}
            />

            <BookmarkList />

            {resultImage && (
              <div className="text-center mt-6">
                <p className="text-sm text-gray-400">Generated Output:</p>
                <div className="mt-2 flex flex-col items-center gap-2">
                  <img
                    src={resultImage}
                    alt="Generated"
                    className="rounded-lg border border-gray-700 max-w-xs w-[90vw]"
                  />
                  <button
                    onClick={handleDownload}
                    className="px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700 text-sm"
                  >
                    Download Image
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
