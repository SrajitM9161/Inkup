'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useToolStore } from '../../../lib/store';
import api from '../../../../api/api';
import { getUserEditOutputs, getProjectById } from '../../../../api/api';
import { ProjectFile } from '../../../components/types/canvas';
import ImageCard from '../ImageCard';
import toast from 'react-hot-toast';
import { X } from 'lucide-react';

interface OutputImage {
  generationId: string;
  assetId: string;
  outputImageUrl: string;
  createdAt: string;
  projectId?: string; 
}

type CombinedOutputImage = OutputImage & {
  type: 'generated' | 'edited';
};

export default function GeneratedTab({
  handleEditProject,
}: {
  handleEditProject: (project: ProjectFile) => void;
}) {
  const { setUserImage, setUploadModalOpen } = useToolStore();

  const [allImages, setAllImages] = useState<CombinedOutputImage[]>([]);

  const [generatedPage, setGeneratedPage] = useState(1);
  const [editedPage, setEditedPage] = useState(1);
  const [hasMoreGenerated, setHasMoreGenerated] = useState(true);
  const [hasMoreEdited, setHasMoreEdited] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const observerInstance = useRef<IntersectionObserver | null>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const fetchData = useCallback(async () => {
    if ((!hasMoreGenerated && !hasMoreEdited) || loading) return;

    setLoading(true);
    setError('');

    try {
      const generatedPromise = hasMoreGenerated
        ? api.get(`api/user/outputs?page=${generatedPage}&limit=20`)
        : Promise.resolve(null);

      const editedPromise = hasMoreEdited
        ? getUserEditOutputs(editedPage, 20)
        : Promise.resolve(null);

      const [generatedResponse, editedResponse] = await Promise.all([
        generatedPromise,
        editedPromise,
      ]);

      let newGeneratedImages: CombinedOutputImage[] = [];
      if (generatedResponse) {
        const images: OutputImage[] = generatedResponse.data?.data?.outputImages || [];
        const serverHasMore: boolean = generatedResponse.data?.data?.hasMore;
        newGeneratedImages = images.map((img) => ({ ...img, type: 'generated' }));
        setHasMoreGenerated(serverHasMore);
        if (images.length > 0) setGeneratedPage((prev) => prev + 1);
      }

      let newEditedImages: CombinedOutputImage[] = [];
      if (editedResponse) {
        const images: OutputImage[] = editedResponse?.data?.outputImages || [];
        const serverHasMore: boolean = editedResponse?.data?.hasMore;
        newEditedImages = images.map((img) => ({ ...img, type: 'edited' }));
        setHasMoreEdited(serverHasMore);
        if (images.length > 0) setEditedPage((prev) => prev + 1);
      }
      
      const combinedNewImages = [...newGeneratedImages, ...newEditedImages];

      if (combinedNewImages.length > 0) {
        setAllImages((prevImages) => {
          const imageMap = new Map<string, CombinedOutputImage>();
          ;[...prevImages, ...combinedNewImages].forEach((img) =>
            imageMap.set(img.assetId, img)
          );
          
          return Array.from(imageMap.values()).sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        });
      }

    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to fetch images');
    } finally {
      setLoading(false);
    }
  }, [
    loading,
    generatedPage,
    editedPage,
    hasMoreGenerated,
    hasMoreEdited,
  ]);

  useEffect(() => {
    if (allImages.length === 0) {
      fetchData();
    }
  }, [fetchData]);

  useEffect(() => {
    const hasMore = hasMoreGenerated || hasMoreEdited;
    if (!observerRef.current || !hasMore) return;

    observerInstance.current?.disconnect();
    observerInstance.current = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !loading) {
          if (debounceTimer.current) clearTimeout(debounceTimer.current);
          debounceTimer.current = setTimeout(() => {
            fetchData();
          }, 400);
        }
      },
      { root: containerRef.current, threshold: 0.2 }
    );

    observerInstance.current.observe(observerRef.current);

    return () => {
      observerInstance.current?.disconnect();
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [fetchData, loading, hasMoreGenerated, hasMoreEdited]);

  const handleSetAsBase = async (image: CombinedOutputImage) => {
    if (image.projectId) {
      toast.loading("Loading editable project...");
      try {
        const response = await getProjectById(image.projectId);
        console.log("GeneratedTab: Full project data received", response.data);
        const fullProjectData = response.data;
        
        handleEditProject(fullProjectData);
        
        toast.dismiss();
        toast.success("Project loaded into canvas!");
      } catch (err) {
        toast.dismiss();
        toast.error("Could not load the project.");
        console.error("Failed to fetch project:", err);
      }
    } else {
      setUserImage(image.outputImageUrl);
      if (image.type === 'edited') {
        setUploadModalOpen(true);
        toast.success('Image loaded for editing!');
      } else {
        toast.success('Image set as base on canvas!');
      }
    }
  };

  const hasMore = hasMoreGenerated || hasMoreEdited;

  return (
    <>
      <div
        ref={containerRef}
        className="h-[calc(100vh-64px)] overflow-y-auto p-1"
      >
        {allImages.length === 0 && !loading && !error && (
          <p className="text-sm text-gray-400 mt-2">No output images found.</p>
        )}
        {error && <p className="text-sm text-red-500 mt-2">{error}</p>}

        <div className="grid grid-cols-2 gap-[6px]">
          {allImages.map((img) => (
            <ImageCard
              key={img.assetId}
              img={img.outputImageUrl}
              showControls={true}
              onMaximize={() => setFullscreenImage(img.outputImageUrl)}
              onSetAsBase={() => handleSetAsBase(img)}
            />
          ))}
        </div>

        <div ref={observerRef} className="h-10" />

        {loading && (
          <p className="text-center text-sm text-gray-400 mt-2">Loading...</p>
        )}
        {!hasMore && !loading && allImages.length > 0 && (
          <p className="text-center text-sm text-gray-500 mt-2">
            You’ve reached the end.
          </p>
        )}
      </div>

      {fullscreenImage && (
        <div className="fixed inset-0 z-[1000] bg-black/90 flex items-center justify-center p-4">
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={fullscreenImage}
              alt="Fullscreen View"
              className="max-w-full max-h-full object-contain pointer-events-none"
              draggable={false}
            />
            <div className="absolute top-4 right-4">
              <button
                onClick={() => setFullscreenImage(null)}
                className="bg-[#222] text-white p-2 rounded-full hover:bg-[#333]"
                title="Close"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}