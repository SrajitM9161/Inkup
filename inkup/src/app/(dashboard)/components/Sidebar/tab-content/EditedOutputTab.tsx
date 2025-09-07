'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import ImageCard from '../ImageCard';
import { useToolStore } from '../../../lib/store';
import { getUserEditOutputs } from '../../../../api/api';
import { useEditedOutputStore } from '../../../lib/editedOutputStore';

export default function EditedOutputTab() {
  const { editedImages, addEditedImages } = useEditedOutputStore();
  const { setUserImage, setUploadModalOpen } = useToolStore();

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
      const response = await getUserEditOutputs(page, 20);
      const newImages = response?.data?.outputImages || [];
      const serverHasMore: boolean = response?.data?.hasMore;

      if (newImages.length === 0) {
        setHasMore(false);
        return;
      }

      addEditedImages(newImages); // ✅ store whole objects
      setPage((prev) => prev + 1);
      setHasMore(serverHasMore);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to fetch edit images');
    } finally {
      setLoading(false);
    }
  }, [page, hasMore, loading, addEditedImages]);

  useEffect(() => {
    if (editedImages.length === 0) {
      fetchEditOutputImages();
    }
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
      {editedImages.length === 0 && !loading && !error && (
        <p className="text-sm text-gray-400 mt-2">No edited images found.</p>
      )}
      {error && <p className="text-sm text-red-500 mt-2">{error}</p>}

      <div className="grid grid-cols-2 gap-[6px]">
        {editedImages.map((img) => (
          <ImageCard
            key={img.assetId}
            img={img.outputImageUrl}
            onClick={() => {
              setUserImage(img.outputImageUrl);
              setUploadModalOpen(true);
            }}
          />
        ))}
      </div>

      <div ref={observerRef} className="h-10" />

      {loading && (
        <p className="text-center text-sm text-gray-400 mt-2">Loading...</p>
      )}
      {!hasMore && !loading && editedImages.length > 0 && (
        <p className="text-center text-sm text-gray-500 mt-2">
          You’ve reached the end.
        </p>
      )}
    </div>
  );
}
