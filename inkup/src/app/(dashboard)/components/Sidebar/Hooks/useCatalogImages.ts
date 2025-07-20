'use client';

import { useEffect, useState } from 'react';

export const useCatalogImages = () => {
  const [images, setImages] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const loadMore = async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);

    try {
      const res = await fetch("heheheheh");
      const data: string[] = await res.json();

      if (data.length === 0) setHasMore(false);
      else {
        setImages((prev) => [...prev, ...data]);
        setPage((p) => p + 1);
      }
    } catch (err) {
      console.error('Failed to load catalog images', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMore();
  }, []);

  return { images, isLoading, hasMore, loadMore };
};
