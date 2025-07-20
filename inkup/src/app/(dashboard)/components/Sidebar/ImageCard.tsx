'use client';

import Image from 'next/image';

export default function ImageCard({ img, onClick }: { img: string; onClick: () => void }) {
  return (
    <div
      className="relative aspect-square rounded-xl overflow-hidden border border-[#2a2a2a] cursor-pointer hover:ring-2 hover:ring-cyan-400 transition"
      onClick={onClick}
    >
      <Image src={img} alt="catalog-item" fill className="object-cover" />
    </div>
  );
}