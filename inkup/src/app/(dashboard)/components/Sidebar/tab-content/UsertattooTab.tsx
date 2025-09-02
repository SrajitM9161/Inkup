'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import ImageGrid from '../ImageGrid';
import { useToolStore } from '../../../lib/store';
import toast from 'react-hot-toast';
import { getUserTattoos, uploadUserTattoos } from '../../../../api/api';

interface Tattoo {
  id: string;
  imageUrl: string;
  createdAt: string;
}

export default function UserTattooTab() {
  const { setItemImage } = useToolStore();
  const [tattoos, setTattoos] = useState<Tattoo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const observerInstance = useRef<IntersectionObserver | null>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Fetch tattoos with page + limit
  const fetchTattoos = useCallback(
    async (pageNum = 1, append = false) => {
      setLoading(true);
      setError('');
      try {
        const res = await getUserTattoos(pageNum, 50); // fetch up to 50 at once
        const newTattoos: Tattoo[] = res.data.tattoos || [];

        // Append or replace
        setTattoos((prev) => (append ? [...prev, ...newTattoos] : newTattoos));

        setHasMore(pageNum < res.data.pages);
      } catch (err: any) {
        console.error(err);
        setError('Failed to fetch tattoos.');
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Initial fetch
  useEffect(() => {
    fetchTattoos(1, false);
    setPage(1);
  }, [fetchTattoos]);

  // Upload new tattoos
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    let uploadFiles = Array.from(files);
    if (uploadFiles.length > 10) {
      toast.error(`You selected ${uploadFiles.length} images. Only 10 will be uploaded.`);
      uploadFiles = uploadFiles.slice(0, 10);
    }

    try {
      toast.loading('Uploading tattoo(s)...', { id: 'upload' });
      const res = await uploadUserTattoos(uploadFiles);

      const newTattoos: Tattoo[] = res.data.tattoos.map((t: any) => ({
        id: t.tattooId,
        imageUrl: t.imageUrl,
        createdAt: new Date().toISOString(),
      }));

      // Prepend new uploads on top
      setTattoos((prev) => [...newTattoos, ...prev]);
      toast.success('Tattoo(s) uploaded!', { id: 'upload' });

      setPage(1); // reset pagination
      setHasMore(true);
    } catch (err) {
      console.error('Upload failed', err);
      toast.error('Failed to upload tattoo(s)', { id: 'upload' });
    }
  };

  // Infinite scroll
  useEffect(() => {
    if (!observerRef.current || !hasMore) return;

    observerInstance.current?.disconnect();

    observerInstance.current = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !loading) {
          if (debounceTimer.current) clearTimeout(debounceTimer.current);
          debounceTimer.current = setTimeout(() => {
            fetchTattoos(page + 1, true);
            setPage((prev) => prev + 1);
          }, 300);
        }
      },
      { root: null, threshold: 0.2 }
    );

    observerInstance.current.observe(observerRef.current);

    return () => {
      observerInstance.current?.disconnect();
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [fetchTattoos, hasMore, loading, page]);

  const handleSelect = (img: string) => {
    setItemImage(img);
    toast.success('Tattoo image selected!');
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ maxHeight: 'calc(100vh - 50px)' }}>
      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      <ImageGrid
        images={[
          { image: undefined, source: 'add' },
          ...tattoos.map((t) => ({ image: t.imageUrl, id: t.id })),
        ]}
        onSelect={(img) => {
          if (!img) fileInputRef.current?.click();
          else handleSelect(img);
        }}
      />

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        multiple
        accept="image/*"
        onChange={handleUpload}
      />

      <div ref={observerRef} className="h-10" />

      {loading && <p className="text-center text-sm text-gray-400 mt-2">Loading tattoos...</p>}
      {!hasMore && !loading && tattoos.length > 0 && (
        <p className="text-center text-sm text-gray-500 mt-2">You’ve reached the end.</p>
      )}
    </div>
  );
}
