'use client';

import { useCatalogImages } from '../Hooks/useCatalogImages';
import ImageGrid from '../ImageGrid';
import { useToolStore } from '../../../lib/store';
import toast from 'react-hot-toast';
import Image from 'next/image';

interface CatalogTabProps {
  onSelect?: () => void;
}

export default function CatalogTab({ onSelect }: CatalogTabProps) {
  const { images, isLoading, hasMore, loadMore } = useCatalogImages();
  const { setItemImage } = useToolStore();

  const handleSelect = (img: string) => {
    setItemImage(img);
    toast.success('Tattoo image selected!');
    onSelect?.();
  };

  // Demo video card
  const demoCard = {
    customRender: (
      <div
        className="relative cursor-pointer overflow-hidden hover:scale-[1.02] transition flex items-center justify-center border-2 border-transparent rounded-md"
        onClick={() =>
          window.open(
            'https://www.canva.com/design/DAGyLkg5-L8/SWiAS0-sLDaEhr2t-8j13Q/watch?utm_content=DAGyLkg5-L8&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h86754ddb05',
            '_blank'
          )
        }
      >
        {/* Thumbnail */}
        <Image
          src="/demo.jpg" // ✅ put your demo thumbnail inside /public
          alt="Demo Video"
          width={300}
          height={300}
          className="w-full h-[140px] object-cover"
        />

        {/* Dark overlay with play icon + label */}
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 mb-2 text-white animate-pulse"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
          <span className="text-sm font-medium">Watch Demo</span>
        </div>
      </div>
    ),
  };

  return (
    <div
      className="flex-1 overflow-y-auto"
      style={{ maxHeight: 'calc(100vh - 50px)' }}
      onScroll={(e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        if (scrollTop + clientHeight >= scrollHeight - 50 && hasMore && !isLoading) {
          loadMore();
        }
      }}
    >
      <ImageGrid images={[demoCard, ...images]} onSelect={handleSelect} />
      {isLoading && (
        <p className="text-sm text-gray-500 text-center mt-2">Loading...</p>
      )}
    </div>
  );
}
