'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import api from '../../../../api/api';
import ImageCard from '../ImageCard';
import { useEditToolStore, useToolStore } from '../../../lib/store';

interface EditOutputImage {
  editGenerationId: string;
  assetId: string;
  outputImageUrl: string;
  createdAt: string;
}

export default function EditedOutputTab() {
  const { resultImages, addResultImage, clearImages } = useEditToolStore();
  const { setUserImage, setUploadModalOpen } = useToolStore(); // 👈 use ToolStore

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const observerInstance = useRef<IntersectionObserver | null>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const fetchEditOutputImages = useCallback(async () => {
    if (!hasMore || loading) return;

    setLoading(true);
    setError('');

    try {
      const response = await api.get(`api/user/outputs/edit?page=${page}&limit=20`);
      const newImages: EditOutputImage[] = response.data?.data?.outputImages || [];
      const serverHasMore: boolean = response.data?.data?.hasMore;

      if (newImages.length === 0) {
        setHasMore(false);
        return;
      }

      newImages.forEach((img) => addResultImage(img.outputImageUrl));

      setPage((prev) => prev + 1);
      setHasMore(serverHasMore);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to fetch edit images');
    } finally {
      setLoading(false);
    }
  }, [page, hasMore, loading, addResultImage]);

  useEffect(() => {
    clearImages();
    fetchEditOutputImages();
  }, []);

  useEffect(() => {
    if (!observerRef.current || !hasMore) return;

    observerInstance.current?.disconnect();

    observerInstance.current = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !loading) {
          if (debounceTimer.current) clearTimeout(debounceTimer.current);
          debounceTimer.current = setTimeout(() => {
            fetchEditOutputImages();
          }, 400);
        }
      },
      {
        root: containerRef.current,
        threshold: 0.2,
      }
    );

    observerInstance.current.observe(observerRef.current);

    return () => {
      observerInstance.current?.disconnect();
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [fetchEditOutputImages, hasMore, loading]);

  return (
    <div ref={containerRef} className="h-[calc(100vh-64px)] overflow-y-auto p-1">
      {resultImages.length === 0 && !loading && !error && (
        <p className="text-sm text-gray-400 mt-2">No edited images found.</p>
      )}
      {error && <p className="text-sm text-red-500 mt-2">{error}</p>}

      <div className="grid grid-cols-2 gap-[6px]">
        {resultImages.map((url, idx) => (
          <ImageCard
            key={idx}
            img={url}
            onClick={() => {
              setUserImage(url); // 👈 set image into ToolStore
              setUploadModalOpen(true); // 👈 open modal with this image
            }}
          />
        ))}
      </div>

      <div ref={observerRef} className="h-10" />

      {loading && (
        <p className="text-center text-sm text-gray-400 mt-2">Loading...</p>
      )}
      {!hasMore && !loading && resultImages.length > 0 && (
        <p className="text-center text-sm text-gray-500 mt-2">
          You’ve reached the end.
        </p>
      )}
    </div>
  );
}