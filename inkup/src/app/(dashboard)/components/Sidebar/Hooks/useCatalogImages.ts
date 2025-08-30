'use client';

import { useEffect, useState, useCallback } from 'react';
import CatalogJson from '../../../../JSON/Catalog.json'; 

interface CatalogItem {
  image: string;
  style: string;
  source: string;
}

export const useCatalogImages = () => {
  const [images, setImages] = useState<CatalogItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 10;

  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);

    setTimeout(() => {
      const nextItems = CatalogJson.slice((page - 1) * itemsPerPage, page * itemsPerPage);

      if (nextItems.length === 0) {
        setHasMore(false);
      } else {
        setImages((prev) => [...prev, ...nextItems]);
        setPage((prevPage) => prevPage + 1);
      }

      setIsLoading(false);
    }, 300);
  }, [isLoading, hasMore, page]);

  useEffect(() => {
    loadMore();
  }, [loadMore]);

  return { images, isLoading, hasMore, loadMore };
};
