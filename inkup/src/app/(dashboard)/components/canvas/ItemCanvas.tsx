'use client';

import { useToolStore } from '../../lib/store';
import { useRef, useState } from 'react';

export default function ItemImageFrame() {
  const { itemImage, setItemImage } = useToolStore();
  const dropRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const url = e.dataTransfer.getData('image');
    if (url) setItemImage(url);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div
      ref={dropRef}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`
        absolute top-2 left-2 
        w-[80px] h-[80px]              // mobile default
        md:w-[100px] md:h-[100px]      // iPad/tablet
        lg:w-[80px] lg:h-[80px]        // desktop override
        z-30 rounded-md overflow-hidden border 
        ${isDragging ? 'border-cyan-400' : 'border-white/30'} 
        shadow-md bg-[#111] 
        flex items-center justify-center 
        transition-all duration-200
      `}
    >
      {itemImage ? (
        <img
          src={itemImage}
          alt="Item"
          className="w-full h-full object-contain"
          draggable={false}
        />
      ) : (
        <p className="text-white text-xs text-center px-2">Drop Your Tattoo</p>
      )}
    </div>
  );
}
