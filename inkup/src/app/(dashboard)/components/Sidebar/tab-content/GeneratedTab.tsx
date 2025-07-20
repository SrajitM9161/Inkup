'use client';

import { useToolStore } from '../../../lib/store';
import ImageGrid from '../ImageGrid';

interface CatalogTabProps {
  onSelect?: () => void;
}

export default function GeneratedTab({ onSelect }: CatalogTabProps) {
  const { generatedItems, setSelectedImage, setResultImage } = useToolStore();

  if (!generatedItems.length) {
    return <p className="text-sm text-gray-400 mt-2">No generated images yet.</p>;
  }

  return (
    <ImageGrid
      images={generatedItems}
      onSelect={(img) => {
        setSelectedImage(img);
        setResultImage(img);
      }}
    />
  );
}
