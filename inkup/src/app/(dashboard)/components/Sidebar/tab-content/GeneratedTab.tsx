'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useOutputStore } from '../../../lib/store';
import api from '../../../../api/api';
import ImageCard from '../ImageCard';

interface OutputImage {
  generationId: string;
  assetId: string;
  outputImageUrl: string;
  createdAt: string;
}

export default function GeneratedOutputTab() {
  const { outputImages, appendOutputImages } = useOutputStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const observerInstance = useRef<IntersectionObserver | null>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

const fetchOutputImages = useCallback(async () => {
  if (!hasMore || loading) return;

  setLoading(true);
  setError('');

  try {
    const response = await api.get(`api/user/outputs?page=${page}&limit=20`);
    const newImages: OutputImage[] = response.data?.data?.outputImages || [];
    const serverHasMore: boolean = response.data?.data?.hasMore;

    if (newImages.length === 0) {
      setHasMore(false);
      return;
    }

    appendOutputImages(newImages);
    setPage((prev) => prev + 1);
    setHasMore(serverHasMore);
  } catch (err: any) {
    setError(err?.response?.data?.message || 'Failed to fetch images');
  } finally {
    setLoading(false);
  }
}, [page, hasMore, loading, appendOutputImages]);


  useEffect(() => {
    fetchOutputImages();
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
            fetchOutputImages();
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
  }, [fetchOutputImages, hasMore, loading]);

  return (
    <div ref={containerRef} className="h-[calc(100vh-64px)] overflow-y-auto p-1">
      {outputImages.length === 0 && !loading && !error && (
        <p className="text-sm text-gray-400 mt-2">No output images found.</p>
      )}
      {error && <p className="text-sm text-red-500 mt-2">{error}</p>}

      <div className="grid grid-cols-2 gap-[6px]">
        {outputImages.map((img) => (
          <ImageCard
            key={img.assetId}
            img={img.outputImageUrl}
            onClick={() => console.log('Clicked image:', img.outputImageUrl)}
          />
        ))}
      </div>

      <div ref={observerRef} className="h-10" />

      {loading && (
        <p className="text-center text-sm text-gray-400 mt-2">Loading...</p>
      )}
      {!hasMore && !loading && outputImages.length > 0 && (
        <p className="text-center text-sm text-gray-500 mt-2">
          You’ve reached the end.
        </p>
      )}
    </div>
  );
}
