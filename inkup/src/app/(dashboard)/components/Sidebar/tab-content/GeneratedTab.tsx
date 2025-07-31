'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useOutputStore } from '../../../lib/store';
import api from '../../../../API/Api';
import ImageCard from '../ImageCard';

interface OutputImage {
  generationId: string;
  assetId: string;
  outputImageUrl: string;
  createdAt: string;
}

export default function GeneratedOutputTab({ onSelect }: { onSelect?: () => void }) {
  const { outputImages, appendOutputImages } = useOutputStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<HTMLDivElement | null>(null);

  const fetchOutputImages = useCallback(async () => {
    if (!hasMore || loading) return;

    try {
      setLoading(true);
      setError('');

      const response = await api.get(`api/user/outputs?page=${page}`);
      const newImages: OutputImage[] = response.data?.data?.outputImages || [];

      if (newImages.length === 0) {
        setHasMore(false);
      } else {
        appendOutputImages(newImages);
        setPage((prev) => prev + 1);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to fetch images');
    } finally {
      setLoading(false);
    }
  }, [page, hasMore, loading, appendOutputImages]);

  useEffect(() => {
    fetchOutputImages(); // Load initial page
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchOutputImages();
        }
      },
      {
        root: containerRef.current,
        threshold: 1.0,
      }
    );

    const currentObserver = observerRef.current;
    if (currentObserver) observer.observe(currentObserver);

    return () => {
      if (currentObserver) observer.unobserve(currentObserver);
    };
  }, [fetchOutputImages, hasMore, loading]);

  return (
    <div
      ref={containerRef}
      className="h-[calc(100vh-64px)] overflow-y-auto p-1"
    >
      {outputImages.length === 0 && !loading && !error && (
        <p className="text-sm text-gray-400 mt-2">No output images found.</p>
      )}
      {error && <p className="text-sm text-red-500 mt-2">{error}</p>}

      <div className="grid grid-cols-2 gap-[6px]">
        {outputImages.map((img, index) => (
          <ImageCard
            key={index}
            img={img.outputImageUrl}
            onClick={() => console.log('Clicked image:', img.outputImageUrl)}
          />
        ))}
      </div>

      <div ref={observerRef} className="h-10" />

      {loading && (
        <p className="text-center text-sm text-gray-400 mt-2">Loading...</p>
      )}
      {!hasMore && !loading && (
        <p className="text-center text-sm text-gray-500 mt-2">You’ve reached the end.</p>
      )}
    </div>
  );
}
