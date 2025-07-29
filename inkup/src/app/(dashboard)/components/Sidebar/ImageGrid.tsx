'use client';

import ImageCard from './ImageCard';

interface CatalogItem {
  image: string;
  style: string;
  source: string;
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

      {images.map((item, index) => (
        <ImageCard key={index} img={item.image} onClick={() => onSelect(item.image)} />
      ))}
    </div>
  );
}
