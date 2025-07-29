'use client';

import Image from 'next/image';

export default function ImageCard({
  img,
  onClick,
}: {
  img: string;
  onClick: () => void;
}) {
  return (
    <div
  className="cursor-pointer overflow-hidden hover:scale-[1.02] transition"

      onClick={onClick}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('image', img);
      }}
    >
      <Image
        src={img}
        alt="Catalog"
        width={300}
        height={300}
        className="w-full h-[140px] object-cover"
      />
    </div>
  );
}
