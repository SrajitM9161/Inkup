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
  const { setItemImage } = useToolStore();

  const handleSelect = (img: string) => {
    setItemImage(img);
    toast.success('Tattoo image selected!');
    onSelect?.(); // Close sidebar if passed
  };

  return (
    <div
      className="flex-1 overflow-y-auto"
      style={{ maxHeight: 'calc(100vh - 140px)' }}
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
