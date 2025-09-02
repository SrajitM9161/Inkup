'use client';

import ImageCard from './ImageCard';
import { ReactNode } from 'react'; // ✅ import ReactNode

interface CatalogItem {
  image?: string;
  style?: string;
  source?: string;
  customRender?: ReactNode; // ✅ safe now
}

export default function ImageGrid({
  images,
  onSelect,
}: {
  images: CatalogItem[];
  onSelect: (img: string) => void;
}) {
  return (
    <div className="h-full overflow-y-auto grid grid-cols-2 gap-[6px] p-1">
      {images.map((item, index) =>
        item.customRender ? (
          <div key={index}>{item.customRender}</div> // ✅ handle custom card
        ) : (
          <ImageCard
            key={index}
            img={item.image ?? ''} // ✅ fallback so it's always a string
            onClick={() => onSelect(item.image ?? '')}
          />
        )
      )}
    </div>
  );
}
