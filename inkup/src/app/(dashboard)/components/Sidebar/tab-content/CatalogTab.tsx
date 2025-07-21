'use client';

import { useCatalogImages } from '../Hooks/useCatalogImages';
import ImageGrid from '../ImageGrid';
import { useToolStore } from '../../../lib/store';
import toast from 'react-hot-toast';

interface CatalogTabProps {
  onSelect?: () => void;
}

export default function CatalogTab({ onSelect }: CatalogTabProps) {
  const { images, isLoading, hasMore, loadMore } = useCatalogImages();
  const { setSelectedImage, setResultImage } = useToolStore();

  const handleSelect = (img: string) => {
    setSelectedImage(img);
    setResultImage(img);
    toast.success('Image selected!');
    onSelect?.();
  };

  return (
    <div
      className="overflow-y-auto max-h-[60vh] pr-1"
      onScroll={(e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        if (scrollTop + clientHeight >= scrollHeight - 50 && hasMore && !isLoading) {
          loadMore();
        }
      }}
    >
      <ImageGrid images={images} onSelect={handleSelect} />
      {isLoading && <p className="text-sm text-gray-500 text-center mt-2">Loading...</p>}
    </div>
  );
}
