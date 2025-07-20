'use client';

import { useToolStore } from '../../../lib/store';
import ImageGrid from '../ImageGrid';

interface CatalogTabProps {
  onSelect?: () => void;
}
export default function HistoryTab({ onSelect }: CatalogTabProps) {
  const { bookmarks, setSelectedImage, setResultImage } = useToolStore();

  if (!bookmarks.length) {
    return <p className="text-sm text-gray-400 mt-2">No history available.</p>;
  }

  return (
    <ImageGrid
      images={bookmarks.map((b) => b.image)}
      onSelect={(img) => {
        setSelectedImage(img);
        setResultImage(img);
      }}
    />
  );
}
