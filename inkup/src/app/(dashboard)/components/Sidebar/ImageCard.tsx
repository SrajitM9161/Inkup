'use client';

import Image from 'next/image';

export default function ImageCard({
  img,
  onClick,
}: {
  img?: string;   
  onClick: () => void;
}) {
  return (
    <div
      className="cursor-pointer overflow-hidden hover:scale-[1.02] transition flex items-center justify-center border-2 border-transparent"
      onClick={onClick}
      draggable={!!img}
      onDragStart={(e) => {
        if (img) e.dataTransfer.setData('image', img);
      }}
    >
      {img ? (
        <Image
          src={img}
          alt="Catalog"
          width={300}
          height={300}
          className="w-full h-[140px] object-cover"
        />
      ) : (
        <div className="w-full h-[150px] flex items-center justify-center border-dashed border-green-500 text-green-500 rounded-md hover:bg-green-950/30 transition">
          + Add tattoo
        </div>
      )}
    </div>
  );
}
